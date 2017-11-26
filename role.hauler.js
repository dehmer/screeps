/**
 * HAULER CREEP (WORK, CARRY, MOVE):
 *
 * - move energy between source and storage
 * - build
 * - upgrade controller
 */
const {coalesce} = require('combinators')
const {findContainers, transferEnergy, restockStorage} = require('energy')
const {findCreeps, upgradeController, build} = require('room')
const {BODY_WORKER, bodySequence} = require('creep.body')
const ROLE = 'hauler'

const nextTask = creep => {
  const consumeEnergy = coalesce([transferEnergy, restockStorage, build, upgradeController])
  if(creep.carry.energy) return consumeEnergy(creep)
  else {

    // Choose container with most energy, not already addressed by another hauler.

    const busyTargetIds = _
      .filter(findCreeps(creep.room, ROLE), c => c.memory.task && c.memory.task.id === 'withdraw')
      .map(c => c.memory.task.targetId)

    const targets = _
      .filter(findContainers(creep.room), c => !(_.includes(busyTargetIds, c.id)))
      .sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY])

    if(targets.length > 0) return {
      id: 'withdraw',
      targetId: targets[0].id,
      resource: RESOURCE_ENERGY
    }
  }
}

const spawn = spawnCreep => room => {

  // No use for haulers until we have a storage:
  if(!room.storage) return

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
