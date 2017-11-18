/**
 * MAINTENANCE CREEP (WORK, CARRY, MOVE):
 *
 * - harvests and transfers energy to structures in need
 * - works on construction sites
 * - repairs damaged structures
 */

const {randomObject, coalesce} = require('combinators')
const {build, repairCriticalInfrastructure, preventDecay, upgradeController} = require('room')
const {transferEnergy, acquireEnergy, ENERGY_TIER_4} = require('energy')
const ROLE = 'maintenance'

const nextTask = creep => {
  const consumeEnergy = coalesce([
    transferEnergy,
    build,
    repairCriticalInfrastructure, preventDecay,
    upgradeController
  ])
  if(creep.carry.energy === creep.carryCapacity) return consumeEnergy(creep)
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

module.exports = {
  name: ROLE,
  nextTask: nextTask
}