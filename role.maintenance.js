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
const {BODY_WORKER, bodySequence} = require('creep.body')
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

const bodyFactor = rcl => {
  if(rcl < 3) return 1
  else return 2
}

const spawn = spawnCreep => room => {
  const rcl = room.controller.level
  const targetCount = Math.ceil(rcl / 2) + 2

  const xs = findCreeps(room, ROLE)
  if(xs.length < targetCount) {
    const body = bodySequence(bodyFactor(rcl), BODY_WORKER)
    spawnCreep(body, {memory: {role: ROLE}})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}