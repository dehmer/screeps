/**
 * HARVESTER CREEP (WORK, MOVE):
 *
 * Harvests energy and drops it in container (hopefully).
 */

const loop = require('loop')
const {sources, randomObject, containers} = require('room')

const nextTask = creep => {

  // Position over free container:
  const isIncluded = (targets, pos) => _.some(targets, target => target.pos.isEqualTo(pos))
  const targets = containers(creep.room)

  if(!isIncluded(targets, creep.pos)) {
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester')
    const freeContainers = _.filter(targets, container => !isIncluded(harvesters, container.pos))
    if(freeContainers.length > 0) return { id: 'moveto', targetId: freeContainers[0].id }
    else console.log('no free containers for harvester')
  }
  else {
    // Find nearest source:
    const target = creep.pos.findClosestByRange(FIND_SOURCES)
    if(target) return { id: 'harvest', targetId: target.id }
  }
}

module.exports = {
  role: 'harvester',
  run: loop(nextTask)
}