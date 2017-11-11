const {object, clearTask} = require('task')

const isEmpty = (creep, resource) => !creep.carry[resource]
const isRepaired = target => target.hits === target.hitsMax

const repair = targetId => creep => {
  const target = object(targetId)

  const result = creep.repair(target)
  if(result !== OK) {
    switch(result) {
      case ERR_NOT_IN_RANGE: creep.moveTo(target); break
      case ERR_NOT_ENOUGH_ENERGY: return clearTask(creep)
      case ERR_NOT_ENOUGH_RESOURCES: return clearTask(creep)
      default: console.log('[repair] unhandled', result)
    }
  }

  if(isRepaired(target)) clearTask(creep)
  if(isEmpty(creep, RESOURCE_ENERGY)) return clearTask(creep)
}

module.exports = {
  id: 'repair',
  invoke: task => repair(task.targetId)
}