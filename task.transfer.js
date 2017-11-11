const {object, randomObject, clearTask} = require('task')

const isEmpty = (creep, resource) => !creep.carry[resource]

const transfer = (targetId, resource) => creep => {
  const target = object(targetId)

  const result = creep.transfer(target, RESOURCE_ENERGY)
  if(result !== OK) {
    switch(result) {
      case ERR_NOT_ENOUGH_RESOURCES: return clearTask(creep)
      case ERR_FULL: return clearTask(creep)
      case ERR_NOT_IN_RANGE: creep.moveTo(target); break
      default: console.log('[transfer] unhandled', result)
    }
  }

  if(isEmpty(creep, resource)) clearTask(creep)
}

module.exports = {
  id: 'transfer',
  invoke: task => transfer(task.targetId, task.resource)
}