const {object, randomObject, clearTask} = require('task')

const isEmpty = (creep, resource) => !creep.carry[resource]

const upgradeController = () => creep => {
  if(isEmpty(creep, RESOURCE_ENERGY)) clearTask(creep)

  const target = creep.room.controller
  const result = creep.upgradeController(target)
  switch(result) {
    case OK: break
    case ERR_NOT_ENOUGH_RESOURCES: /* happens */ break
    case ERR_NO_BODYPART: return console.log('[upgradeController] ERR_NO_BODYPART')
    case ERR_NOT_IN_RANGE: return creep.moveTo(target)
    default: console.log('[upgradeController] unhandled', result)
  }
}

module.exports = {
  id: 'upgrade-controller',
  invoke: task => upgradeController()
}