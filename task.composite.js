const {randomObject} = require('combinators')
const {firstTaskOf} = require('task')

/**
 * Pickup dropped energy.
 */
const pickupDroppedEnergy = creep => {
  const targets = creep.room.find(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY }})
  if(targets.length > 0) return { id: 'pickup', targetId: randomObject(targets).id }
}

/**
 * Withdraw energy from container.
 */
const withdrawFromContainer = creep => {
  const {containers} = require('room.ops')(creep.room)
  const targets = _.filter(containers(creep.room), c => c.store[RESOURCE_ENERGY] > 200)
  if(targets.length > 0) return { id: 'withdraw', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
}

/**
 * Harvest energy from source.
 */
const harvestSource = creep => {
  const {energyProviders} = require('room.ops')(creep.room)
  const targets = energyProviders()
  if(targets.length > 0) return { id: 'harvest', targetId: randomObject(targets).id }
}

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
  acquireEnergy: firstTaskOf([pickupDroppedEnergy, withdrawFromContainer, harvestSource]),
  repairDamagedStructure: repairDamagedStructure,
  repairStuff: firstTaskOf([repairCriticalInfrastructure, repairDamagedStructure])
}