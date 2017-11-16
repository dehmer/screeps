const {randomObject} = require('combinators')
const {firstTaskOf} = require('task')
const {findSources} = require('energy')

/**
 * Repair damaged structures.
 * Damages structures ordered by damage (highest first),
 * filter targets currently in repair by other creeps.
 */
const repairDamagedStructure = creep => {
  const {damages} = require('room.ops')(creep.room)
  const repairers = _.filter(Game.creeps, creep => creep.memory.task && creep.memory.task.id === 'repair')
  const sites = _.map(repairers, creep => creep.memory.task.targetId)
  const targets = _.filter(damages(), target => sites.indexOf(target.id) === -1)
  if(targets.length > 0) return { id: 'repair', targetId: targets[0].id }
}

const repairCriticalInfrastructure = creep => {
  const {criticalDamages} = require('room.ops')(creep.room)
  const targets = criticalDamages()
  if(targets.length > 0) return { id: 'repair', targetId: randomObject(targets).id }
}

// (Mostly) higher level tasks:
module.exports = {
  repairDamagedStructure: repairDamagedStructure,
  repairStuff: firstTaskOf([repairCriticalInfrastructure, repairDamagedStructure])
}