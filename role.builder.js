const {sources, spawn, depletedStructures, constructionSites} = require('room')
const {harvest, build, transfer} = require('commands')
const {isFullyCharged, needsEnergy} = require('resource')

const run = creep => {

  // creep.moveTo(Game.flags['staging'])

  if(creep.memory.building && creep.carry.energy == 0) {
    creep.memory.building = false;
  }

  if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
    creep.memory.building = true;
  }

  if(creep.memory.building) {
    var targets = constructionSites(creep)
    if(targets.length) build(creep, targets[0])
  }
  else {
    var sources = creep.room.find(FIND_SOURCES)
    harvest(creep, sources[1])
  }
}


module.exports = {
  run: run
}