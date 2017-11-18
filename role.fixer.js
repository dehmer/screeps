/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure and fortifies defence,
 * also builds stuff before fortification.
 */

const {coalesce} = require('combinators')
const {build, repairCriticalInfrastructure, fortify} = require('room')
const {transferEnergy, acquireEnergy, ENERGY_TIER_4} = require('energy')
const ROLE = 'fixer'

const nextTask = creep => {
  const consumeEnergy = coalesce([
    transferEnergy,
    repairCriticalInfrastructure, build, fortify
  ])

  if(creep.carry[RESOURCE_ENERGY]) return consumeEnergy(creep)
  return acquireEnergy(ENERGY_TIER_4)(creep)
}

module.exports = {
  name: ROLE,
  nextTask: nextTask
}