const needsEnergy = structure =>
  ( structure.structureType == STRUCTURE_EXTENSION ||
    structure.structureType == STRUCTURE_SPAWN
  ) && structure.energy < structure.energyCapacity

module.exports = {
  rooms: () => Game.rooms,
  spawns: () => Game.spawns,
  spawn: name => Game.spawns[name],
  sources: creep => creep.room.find(FIND_SOURCES),
  containers: room => room.find(FIND_STRUCTURES, { filter: target => target.structureType === STRUCTURE_CONTAINER }),
  depletedStructures: creep => creep.room.find(FIND_STRUCTURES, { filter: needsEnergy }),
  constructionSites: creep => creep.room.find(FIND_CONSTRUCTION_SITES)
}