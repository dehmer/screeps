/**
 * MAINTENANCE CREEP (WORK, CARRY, MOVE):
 *
 * - harvests and transfers energy to structures in need
 * - works on construction sites
 * - repairs damaged structures
 */

const loop = require('loop')
const {randomObject} = require('combinators')
const {acquireEnergy, repairDamagedStructure} = require('task.composite')

const nextTask = creep => {
  const {energyConsumers, constructionSites} = require('room.ops')(creep.room)

  // Keep harvesting until fully loaded:
  if(creep.carry.energy == creep.carryCapacity) {

    // First serve consumer:
    {
      const targets = energyConsumers()
      if(targets.length > 0) return { id: 'transfer', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }

    const random = Math.random()

    if(random > 0.2) {
      const targets = constructionSites()
      if(targets.length > 0) return { id: 'build', targetId: randomObject(targets).id }
    }

    const repairTask = repairDamagedStructure(creep)
    if(repairTask) return repairTask
  }
  else {
    if(creep.room.storage) {
      const storage = creep.room.storage
      if(storage.store[RESOURCE_ENERGY] > 10000) {
        return { id: 'withdraw', targetId: storage.id, resource: RESOURCE_ENERGY }
      }
    }

    return acquireEnergy(creep)
  }
}

const ROLE = 'maintenance'

const spawn = (room, factory) => {
    const {creeps} = require('room.ops')(room)
    const headCount = 2
    const body = [MOVE, WORK, CARRY]
    if(headCount > creeps(ROLE).length) {
        factory(body, `${ROLE}-${Game.time}`, {memory: {role: ROLE}})
    }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}