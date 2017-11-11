const loop = require('loop')
const {randomObject} = require('room')
const {sources} = require('room')

const nextTask = creep => {
  if(creep.carry.energy) return { id: 'upgrade-controller' }
  else {
    // TODO: teach upgrader to use other energy sources
    const targets = sources(creep.room)
    if(targets.length > 0) return { id: 'harvest', targetId: randomObject(targets).id }
  }
}

module.exports = {
  role: 'upgrader',
  run: loop(nextTask)
}
