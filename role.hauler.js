/**
 * HAULER CREEP (WORK, CARRY, MOVE):
 *
 * - move energy between source and storage
 */
const {coalesce} = require('combinators')
const {findContainers, transferEnergy} = require('energy')
const {findCreeps, upgradeController} = require ('room')
const ROLE = 'hauler'

const restockStorageEnergy = creep => {
  const storage = creep.room.storage
  if(storage) {
    const total = _.sum(creep.room.storage.store)
    if(total < storage.storeCapacity) return {
      id: 'transfer',
      targetId: storage.id,
      resource: RESOURCE_ENERGY
    }
  }
}

const nextTask = creep => {
  const consumeEnergy = coalesce([transferEnergy, restockStorageEnergy, upgradeController])
  if(creep.carry.energy == creep.carryCapacity) return consumeEnergy(creep)
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

 module.exports = {
  name: ROLE,
  nextTask: nextTask
 }
