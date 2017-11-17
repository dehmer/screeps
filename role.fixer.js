/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure first.
 */

const {coalesce} = require('combinators')
const {repair, upgradeController} = require('room')
const {transferEnergy, acquireEnergy, ENERGY_TIER_4} = require('energy')
const ROLE = 'fixer'

const nextTask = creep => {
  const consumeEnergy = coalesce([transferEnergy, repair, upgradeController])
  if(creep.carry[RESOURCE_ENERGY]) return consumeEnergy(creep)
  return acquireEnergy(ENERGY_TIER_4)(creep)
}

module.exports = {
  name: ROLE,
  nextTask: nextTask
}