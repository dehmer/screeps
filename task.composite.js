const {randomObject, containers, sources} = require('room')
const {firstTaskOf} = require('task')

/**
 * Pickup dropped energy.
 */
const droppedEnergy = creep => {
  const targets = creep.room.find(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY }})
  if(targets.length > 0) return { id: 'pickup', targetId: randomObject(targets).id }
}

/**
 * Withdraw energy from container.
 */
const container = creep => {
  const targets = _.filter(containers(creep.room), c => c.store[RESOURCE_ENERGY] > 200)
  if(targets.length > 0) return { id: 'withdraw', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
}

/**
 * Harvest energy from source.
 */
const source = creep => {
  const targets = sources(creep.room)
  if(targets.length > 0) return { id: 'harvest', targetId: randomObject(targets).id }
}

// Higher level tasks:
module.exports = {
  acquireEnergy: firstTaskOf([droppedEnergy, container, source])
}