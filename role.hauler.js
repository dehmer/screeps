/**
 * HAULER CREEP (WORK, CARRY, MOVE):
 *
 * - move energy between source and storage
 */
const {randomObject} = require('combinators')
const {findContainers, findConsumers} = require('energy')

const ROLE = 'hauler'

const nextTask = creep => {
  const {creeps} = require('room.ops')(creep.room)
  const {constructionSites} = require('room.ops')(creep.room)

  if(creep.carry.energy == creep.carryCapacity) {
    const storage = creep.room.storage

    // First serve consumer:
    {
      const targets = findConsumers(creep.room)
      if(targets.length > 0) return { id: 'transfer', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }

    if(storage) {
      const total = _.sum(creep.room.storage.store)
      if(total < storage.storeCapacity) return { id: 'transfer', targetId: storage.id, resource: RESOURCE_ENERGY }
    }
  }
  else {
    // Choose container with most energy, not already addressed by other hauler.

    const busyTargetIds = _
      .filter(creeps(ROLE), c => c.memory.task && c.memory.task.id === 'withdraw')
      .map(c => c.memory.task.targetId)

    const targets = _
      .filter(findContainers(creep.room), c => !(_.includes(busyTargetIds, c.id)))
      .sort((a, b) => b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY])

    if(targets.length > 0) return { id: 'withdraw', targetId: targets[0].id, resource: RESOURCE_ENERGY }
  }
}

 module.exports = {
  name: ROLE,
  nextTask: nextTask
 }
