/**
 * HARVESTER CREEP (WORK, MOVE):
 *
 * Harvests energy and drops it in container (hopefully).
 */

const loop = require('loop')
const {findContainers} = require('energy')
const {findCreeps} = require('room')
const {BODY_HARVESTER, name} = require('creep.body')
const ROLE = 'harvester'

const nextTask = creep => {
  const isIncluded = (targets, pos) => _.some(targets, target => target.pos.isEqualTo(pos))
  const containers = findContainers(creep.room)

  // Position over free container:
  if(!isIncluded(containers, creep.pos)) {
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role == 'harvester')
    const freeContainers = _.filter(containers, container => !isIncluded(harvesters, container.pos))
    if(freeContainers.length > 0) return { id: 'moveto', targetId: freeContainers[0].id }
    else console.log('no free containers for harvester')
  }
  else {
    // Only resume harvesting if storage capacity is below 70%:
    const container = _.find(containers, c => c.pos.isEqualTo(creep.pos))
    const capacity = container.store[RESOURCE_ENERGY] / container.storeCapacity
    if(capacity < 0.7) {
      // Find nearest source:
      const source = creep.pos.findClosestByRange(FIND_SOURCES)
      if(source) return { id: 'harvest', targetId: source.id }
    }
  }
}

const spawn = spawnCreep => room => {
  const targetCount = findContainers(room).length
  const xs = findCreeps(room, ROLE)

  if(xs.length < targetCount) {
    spawnCreep(BODY_HARVESTER, name(ROLE), {memory: {role: ROLE}})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}