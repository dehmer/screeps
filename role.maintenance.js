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
    {
      const targets = energyConsumers(creep.room)
      if(targets.length > 0) return { id: 'transfer', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }

    // Devide building (80%) and repairing (20%):
    const random = Math.random()
    if(random > 0.2) {
      const targets = constructionSites(creep.room)
      if(targets.length > 0) return { id: 'build', targetId: randomObject(targets).id }
    }

    // TODO: make dependent on DEFCON level
    if(random > 0.4) {
      const repairTask = repairDamagedStructure(creep)
      if(repairTask) return repairTask

    }

    // Still nothing to do? Upgrade contoller!
    return { id: 'upgrade-controller' }

  }
  else return acquireEnergy(creep)
}

const ROLE = 'maintenance'
module.exports = {
  name: ROLE,
  nextTask: nextTask
}