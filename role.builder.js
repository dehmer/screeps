const {spawn, constructionSites} = require('room')
const {harvest, build} = require('commands')
const roleUpgrader = require('role.upgrader')
const roleHarvester = require('role.harvester')

const run = creep => {
  if(creep.memory.building && creep.carry.energy == 0) {
    creep.memory.building = false;
  }

  if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
    creep.memory.building = true;
  }

  if(creep.memory.building) {
    var targets = constructionSites(creep)
    if(targets.length) build(creep, targets[0])
    else roleHarvester.run(creep)
  }
  else {
    var sources = creep.room.find(FIND_SOURCES)
    harvest(creep, sources[1])
  }
}


module.exports = {
  run: run
}