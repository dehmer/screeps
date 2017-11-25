/**
 * MAINTENANCE CREEP (WORK, CARRY, MOVE):
 *
 * - harvests and transfers energy to structures in need
 * - works on construction sites
 * - repairs damaged structures
 * - upgrades controller otherwise
 */

const {randomObject, coalesce} = require('combinators')
const {repairCriticalInfrastructure, preventDecay, upgradeController} = require('room')
const {build, findConstructionSites} = require('room')
const {findCreeps} = require('room')
const {transferEnergy, acquireEnergy, ENERGY_TIER_4} = require('energy')
const {BODY_WORKER, bodySequence, name} = require('creep.body')
const ROLE = 'maintenance'

const nextTask = creep => {
  const consumeEnergy = coalesce([
    transferEnergy,
    build,
    repairCriticalInfrastructure, preventDecay,
    upgradeController
  ])

  if(creep.carry.energy) return consumeEnergy(creep)
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

const spawn = spawnCreep => room => {
  const targetCount = 3
    + (findConstructionSites(room).length > 0 ? 2 : 0)

  const xs = findCreeps(room, ROLE)
  if(xs.length < targetCount) {
    const body = bodySequence(2, BODY_WORKER)
    spawnCreep(body, name(ROLE), {memory: {role: ROLE}})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}