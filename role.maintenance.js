/**
 * MAINTENANCE CREEP (WORK, CARRY, MOVE):
 *
 * - harvests and transfers energy to structures in need
 * - works on construction sites
 * - repairs damaged structures
 * - upgrades controller otherwise
 */

const {coalesce} = require('combinators')
const {build, preventDecay} = require('room')
const {findCreeps, repairCriticalInfrastructure, upgradeController} = require('room')
const {transferEnergy, acquireEnergy, ENERGY_TIER_4} = require('energy')
const {BODY_WORKER, bodySequence} = require('creep.body')
const ROLE = 'maintenance'

const nextTask = creep => {
  const consumeEnergy = coalesce([
    transferEnergy,
    preventDecay,
    repairCriticalInfrastructure,
    upgradeController
  ])

  if(creep.carry.energy) return consumeEnergy(creep)
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

const spawn = spawnCreep => room => {
  const targetCount = 3

  const xs = findCreeps(room, ROLE)
  if(xs.length < targetCount) {
    const body = bodySequence(2, BODY_WORKER)
    spawnCreep(body, {memory: {role: ROLE}})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}