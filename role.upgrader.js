const {acquireEnergy, ENERGY_TIER_4, storageLevel} = require('energy')
const {findCreeps, upgradeController} = require('room')
const {BODY_WORKER, bodySequence, name} = require('creep.body')
const ROLE = 'upgrader'

const nextTask = creep => {
  if(creep.carry.energy) return upgradeController(creep)
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

const spawn = spawnCreep => room => {
  const targetCount = 3
    + (storageLevel(room, RESOURCE_ENERGY) > 0.8 ? 3 : 0)

  const xs = findCreeps(room, ROLE)

  if(xs.length < targetCount) {
    const body = bodySequence(4, BODY_WORKER)
    spawnCreep(body, name(ROLE), {memory: {role: ROLE}})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}
