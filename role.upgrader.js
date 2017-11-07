const commands = require('commands')
const resource = require('resource')

const run = creep => {
  if(!resource.isFullyCharged(creep)) {
      var sources = creep.room.find(FIND_SOURCES);
      commands.harvest(creep, sources[1])
  }
  else commands.upgradeController(creep)
}

module.exports = {
  run: run
}