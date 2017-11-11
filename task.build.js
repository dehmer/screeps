const {object, clearTask} = require('task')

const isEmpty = (creep, resource) => !creep.carry[resource] || creep.carry[resource] === 0

const build = targetId => creep => {
  const target = object(targetId)

  // Target no longer a construction site -> done:
  if(!target) return clearTask(creep)

  if(creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target)
  }

  if(isEmpty(creep, RESOURCE_ENERGY)) clearTask(creep)
}

module.exports = build