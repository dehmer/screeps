/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure and fortifies defence.
 */

const {coalesce} = require('combinators')
const {build, repairCriticalInfrastructure, fortify} = require('room')
const {findCreeps} = require('room')
const {transferEnergy, acquireEnergy, ENERGY_TIER_4} = require('energy')
const {BODY_WORKER, bodySequence} = require('creep.body')
const ROLE = 'fixer'

const nextTask = creep => {
  const consumeEnergy = coalesce([
    transferEnergy,
    repairCriticalInfrastructure,
    fortify
  ])

  if(creep.carry[RESOURCE_ENERGY]) return consumeEnergy(creep)
  return acquireEnergy(ENERGY_TIER_4)(creep)
}

const spawn = spawnCreep => room => {
  const rcl = room.controller.level
  const targetCount = 3 + (rcl > 6 ? 3 : 0)
  const bodyFactor = 2 + (rcl > 6 ? 1 : 0)
  const xs = findCreeps(room, ROLE)
  if(xs.length < targetCount) {
    const body = bodySequence(bodyFactor, BODY_WORKER)
    spawnCreep(body, {memory: {role: ROLE}})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}