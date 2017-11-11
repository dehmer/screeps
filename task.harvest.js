const {object, clearTask} = require('task')

// Static harvesters don't carry anything, so this is always false.
const isFullyLoaded = (creep, resource) =>
  creep.carryCapacity &&
  creep.carry[resource] === creep.carryCapacity

const harvest = targetId => creep => {
  const target = object(targetId)
  const result = creep.harvest(target)
  if(result !== OK) {
    switch(result) {
      case ERR_BUSY: /* don't care */ break
      case ERR_NOT_ENOUGH_RESOURCES: /* wait */  break
      case ERR_NOT_IN_RANGE: {
        const result = creep.moveTo(target)
        switch(result) {
          case OK: break;
          case ERR_NO_PATH: return clearTask(creep)
          case ERR_TIRED: /* so what?! */ break
          default: console.log('[moveTo] unhandled', result)
        }
        break
      }
      default: console.log('[harvest] unhandled', result)
    }

  }

  if(isFullyLoaded(creep, RESOURCE_ENERGY)) clearTask(creep)
}

module.exports = harvest