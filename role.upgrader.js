const {acquireEnergy, ENERGY_TIER_4, storageLevel} = require('energy')
const {findCreeps, upgradeController} = require('room')
const {BODY_WORKER, bodySequence} = require('creep.body')
const ROLE = 'upgrader'

const nextTask = creep => {
  if(creep.carry.energy) return upgradeController(creep)
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

const bodyFactor = rcl => {
  if(rcl == 1) return 1
  else if(rcl < 3) return 2
  else if(rcl < 4) return 3
  else return 4
}

const spawn = spawnCreep => room => {
  const rcl = room.controller.level
  const targetCount = Math.ceil(rcl / 2)

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
