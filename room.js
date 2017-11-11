const {K} = require('combinators')

const progress = target => target.progress / target.progressTotal
const isContainer = target => target.structureType === STRUCTURE_CONTAINER

// Controller has no hits and connot be damaged:
const isDamaged = target => target.hits < target.hitsMax
const damage = target => target.hits / target.hitsMax

const hasLowEnergy = target =>
  ( target.structureType == STRUCTURE_EXTENSION ||
    target.structureType == STRUCTURE_SPAWN
  ) && target.energy < target.energyCapacity

const isCritical = target =>
  ( target.structureType == STRUCTURE_CONTAINER ||
    target.structureType == STRUCTURE_RAMPART ||
    target.structureType == STRUCTURE_TOWER ||
    target.structureType == STRUCTURE_STORAGE
  ) && isDamaged(target)

module.exports = {
  rooms: () => Game.rooms,
  spawns: () => Game.spawns,
  spawn: name => Game.spawns[name],
  sources: room => room.find(FIND_SOURCES),
  containers: room => room.find(FIND_STRUCTURES, { filter: isContainer }),
  sinks: room => room.find(FIND_STRUCTURES, { filter: hasLowEnergy }),
  randomObject: targets => targets[Math.floor(Math.random() * targets.length)],

  constructionSites: room =>
      _.reduce(room.find(FIND_CONSTRUCTION_SITES), (acc, value) => K(acc)(acc => acc.push(value)), []).
      sort((a, b) => progress(a) < progress(b)),

  damagedStructures: room =>
      room.find(FIND_STRUCTURES, { filter: isDamaged }).
      sort((a,b) => damage(a) - damage(b)),

  criticalInfrastructure: room =>
      room.find(FIND_STRUCTURES, { filter: isCritical }).
      sort((a,b) => damage(a) - damage(b))
}