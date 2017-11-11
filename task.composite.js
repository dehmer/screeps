const {randomObject} = require('room')
const {containers, sources} = require('room')
const {criticalInfrastructure, damagedStructures} = require('room')

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
  const targets = _.filter(containers(creep.room), c => c.store[RESOURCE_ENERGY] > 200)
  if(targets.length > 0) return { id: 'withdraw', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
}

/**
 * Harvest energy from source.
 */
const harvestSource = creep => {
  const targets = sources(creep.room)
  if(targets.length > 0) return { id: 'harvest', targetId: randomObject(targets).id }
}

/**
 * Repair damaged structures.
 * Damages structures ordered by damage (highest first),
 * filter targets currently in repair by other creeps.
 */
const repairDamagedStructure = creep => {
  const repairers = _.filter(Game.creeps, creep => creep.memory.task && creep.memory.task.id === 'repair')
  const sites = _.map(repairers, creep => creep.memory.task.targetId)
  const targets = _.filter(damagedStructures(creep.room), target => sites.indexOf(target.id) === -1)
  if(targets.length > 0) return { id: 'repair', targetId: targets[0].id }
}

const repairCriticalInfrastructure = creep => {
  const targets = criticalInfrastructure(creep.room)
  if(targets.length > 0) return { id: 'repair', targetId: randomObject(targets).id }
}

// (Mostly) higher level tasks:
module.exports = {
  acquireEnergy: firstTaskOf([pickupDroppedEnergy, withdrawFromContainer, harvestSource]),
  repairDamagedStructure: repairDamagedStructure,
  repairStuff: firstTaskOf([repairCriticalInfrastructure, repairDamagedStructure])
}