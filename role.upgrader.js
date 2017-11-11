const loop = require('loop')
const {randomObject} = require('room')
const {sources} = require('room')

const nextTask = creep => {
  if(creep.carry.energy) return { id: 'upgrade-controller' }
  else {
    const targets = sources(creep.room)
    if(targets.length > 0) return { id: 'harvest', targetId: randomObject(targets).id }
  }
}

module.exports = {
  role: 'upgrader',
  run: loop(nextTask)
}
