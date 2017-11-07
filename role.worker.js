const {harvest} = require('commands')
const {sources} = require('room')
const energy = creep => creep.carry.energy
const random = targets => targets[Math.floor(Math.random() * targets.length)]

const task = creep => {
  if(energy(creep) === 0) return {
    command: 'harvest',
    targetId: random(sources(creep)).id
  }
}

const run = creep => {
  // {type: ..., hits: ...}
  creep.memory.task = creep.memory.task || task(creep)
  console.log('creep.task', JSON.stringify(creep.memory.task))

  const result = creep.moveTo(Game.getObjectById(creep.memory.task.targetId))
  switch(result) {
    case ERR_INVALID_TARGET: console.log('[moveTo]', 'ERR_INVALID_TARGET')
  }
}

module.exports = {
  run: run
}