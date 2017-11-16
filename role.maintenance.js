/**
 * MAINTENANCE CREEP (WORK, CARRY, MOVE):
 *
 * - harvests and transfers energy to structures in need
 * - works on construction sites
 * - repairs damaged structures
 */

const loop = require('loop')
const {randomObject} = require('combinators')
const {repairDamagedStructure} = require('task.composite')
const {findConsumers, acquireEnergy, ENERGY_TIER_4} = require('energy')

const nextTask = creep => {
  const {constructionSites} = require('room.ops')(creep.room)

  // Keep harvesting until fully loaded:
  if(creep.carry.energy == creep.carryCapacity) {

    // First serve consumer:
    {
      const targets = findConsumers(creep.room)
      if(targets.length > 0) return { id: 'transfer', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }

    const random = Math.random()

    {
      const targets = constructionSites()
      if(targets.length > 0) return { id: 'build', targetId: randomObject(targets).id }
    }

    const repairTask = repairDamagedStructure(creep)
    if(repairTask) return repairTask
  }
  else return acquireEnergy(ENERGY_TIER_4)(creep)
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