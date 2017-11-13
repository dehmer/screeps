/**
 * HAULER CREEP (WORK, CARRY, MOVE):
 *
 * - move energy between source and storage
 */
const {acquireEnergy} = require('task.composite')
const {randomObject} = require('combinators')

const ROLE = 'hauler'

const nextTask = creep => {
  const {creeps, containers} = require('room.ops')(creep.room)

  if(creep.carry.energy == creep.carryCapacity) {
    const storage = creep.room.storage
    if(storage) {
      const total = _.sum(creep.room.storage.store)
      if(total < storage.storeCapacity) return { id: 'transfer', targetId: storage.id, resource: RESOURCE_ENERGY }
    }
  }
  else {
    // TODO: target containers with most energy first.
    const busyTargets = _.filter(creeps(ROLE), c => {
      return c.memory.task && c.memory.task.id === 'withdraw'
    }).map(c => c.memory.task.targetId)

    const targets = containers()

    return { id: 'withdraw', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
  }
}

 module.exports = {
  name: ROLE,
  nextTask: nextTask
 }
