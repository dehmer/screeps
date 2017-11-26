/**
 * BUILDER CREEP (WORK, CARRY, MOVE):
 *
 * - is only spawned if some building is to do
 * - works on construction sites
 */

const {coalesce} = require('combinators')
const {build, preventDecay} = require('room')
const {findCreeps, findConstructionSites} = require('room')
const {acquireEnergy, ENERGY_TIER_4} = require('energy')
const {BODY_WORKER, bodySequence} = require('creep.body')
const ROLE = 'builder'

const nextTask = creep => {
  const consumeEnergy = coalesce([
    build,
    preventDecay // repair until TTL is up.
  ])

  if(creep.carry.energy) return consumeEnergy(creep)
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

const spawn = spawnCreep => room => {
  const sites = findConstructionSites(room)
  const targetCount = sites.length * 2

  const xs = findCreeps(room, ROLE)
  if(xs.length < targetCount) {
    const body = bodySequence(1, BODY_WORKER)
    spawnCreep(body, {memory: {role: ROLE}})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}