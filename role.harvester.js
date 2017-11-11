/**
 * HARVESTER CREEP (WORK, MOVE)
 *
 * Harvests energy and drops it in container (hopefully).
 */

const loop = require('loop')
const {sources, randomObject} = require('room')

const nextTask = creep => {
  const targets = sources(creep.room)
  if(targets.length > 0) return { id: 'harvest', targetId: randomObject(targets).id }
}

module.exports = {
  role: 'harvester',
  run: loop(nextTask)
}