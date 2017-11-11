const {object, randomObject, clearTask} = require('task')

const isEmpty = (creep, resource) => !creep.carry[resource]

const upgradeController = () => creep => {
  const target = creep.room.controller
  if(creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target)
  }

  if(isEmpty(creep, RESOURCE_ENERGY)) clearTask(creep)
}

module.exports = {
  id: 'upgrade-controller',
  invoke: task => upgradeController()
}