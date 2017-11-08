const commands = require('commands')
const {isFullyCharged} = require('resource')

const run = creep => {

  // Decide initial state if necessary.
  if(!creep.memory.task) {
    if(creep.carry.energy > 0) creep.memory.task = 'upgrade'
    else creep.memory.task = 'harvest'
  }

  if(creep.memory.task == 'harvest') {
    var sources = creep.room.find(FIND_SOURCES);
    commands.harvest(creep, sources[0])
    if(isFullyCharged(creep)) creep.memory.task = 'upgrade'
  }
  else {
    if(!creep.carry.energy) return creep.memory.task = 'harvest'
    commands.upgradeController(creep)
  }
}

module.exports = {
  run: run
}