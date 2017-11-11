/**
 * HARVESTER CREEP (WORK, MOVE):
 *
 * Harvests energy and drops it in container (hopefully).
 */

const loop = require('loop')
const {sources, randomObject, containers} = require('room')

const nextTask = creep => {

  const isIncluded = (targets, pos) => _.some(targets, target => target.pos.isEqualTo(pos))
  const targets = containers(creep.room)

  // Position over free container:
  if(!isIncluded(targets, creep.pos)) {
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester')
    const freeContainers = _.filter(targets, container => !isIncluded(harvesters, container.pos))
    if(freeContainers.length > 0) return { id: 'moveto', targetId: freeContainers[0].id }
    else console.log('no free containers for harvester')
  }
  else {
    // Only resume harvesting if storage capacity is below 70%:
    const container = _.find(targets, c => c.pos.isEqualTo(creep.pos))
    const capacity = container.store[RESOURCE_ENERGY] / container.storeCapacity
    if(capacity < 0.7) {
      // Find nearest source:
      const target = creep.pos.findClosestByRange(FIND_SOURCES)
      if(target) return { id: 'harvest', targetId: target.id }
    }
  }
}

require('role.registry').push({ name: 'harvester', nextTask: nextTask })
