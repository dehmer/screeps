const {object, clearTask} = require('task')

const isFullyLoaded = (creep, resource) =>
  creep.carryCapacity &&
  creep.carry[resource] === creep.carryCapacity

const pickup = targetId => creep => {
  const target = object(targetId)
  if(!target) return clearTask(creep)

  const result = creep.pickup(target)
  switch(result) {
    case OK: break
    case ERR_BUSY: /* wait */ break
    case ERR_FULL: return clearTask(creep)
    case ERR_NOT_IN_RANGE: {
      const result = creep.moveTo(target)
      switch(result) {
        case OK: break
        default: console.log('[moveTo] unhandled', result)
      }
      break
    }
    default: console.log('[pickup] unhandled', result)
  }

  if(isFullyLoaded(creep, RESOURCE_ENERGY)) clearTask(creep)
}

module.exports = {
  id: 'pickup',
  invoke: task => pickup(task.targetId)
}