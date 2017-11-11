const {object, randomObject, clearTask} = require('task')

const isFullyLoaded = (creep, resource) =>
  creep.carry[resource] === creep.carryCapacity

const withdraw = (targetId, resource) => creep => {
  const target = object(targetId)
  const result = creep.withdraw(target, resource)
  if(result !== OK) {
    switch(result) {
      case ERR_BUSY: /* don't care */ break
      case ERR_NOT_ENOUGH_RESOURCES: return clearTask(creep)
      case ERR_FULL: return clearTask(creep)
      case ERR_NOT_IN_RANGE: creep.moveTo(target); break
      default: console.log('[withdraw] unhandled', result)
    }
  }

  if(isFullyLoaded(creep, resource)) return clearTask(creep)
}

module.exports = {
  id: 'withdraw',
  invoke: task => withdraw(task.targetId, task.resource)
}