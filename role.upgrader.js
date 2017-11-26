const {acquireEnergy, ENERGY_TIER_4, storageLevel} = require('energy')
const {findCreeps, upgradeController} = require('room')
const {BODY_WORKER, bodySequence} = require('creep.body')
const ROLE = 'upgrader'

const nextTask = creep => {
  if(creep.carry.energy) return upgradeController(creep)
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

const spawn = spawnCreep => room => {
  const targetCount = 1
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
