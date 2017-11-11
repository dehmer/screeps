/**
 * MAINTENANCE CREEP (WORK, CARRY, MOVE):
 *
 * - harvests and transfers energy to structures in need
 * - works on construction sites
 * - repairs damaged structures
 */

const loop = require('loop')
const {randomObject, sinks, constructionSites} = require('room')
const {acquireEnergy, repairDamagedStructure} = require('task.composite')

const nextTask = creep => {
  // Keep harvesting until fully loaded:
  if(creep.carry.energy == creep.carryCapacity) {
    {
      const targets = sinks(creep.room)
      if(targets.length > 0) return { id: 'transfer', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }

    // Devide building (80%) and repairing (20%):
    const random = Math.random()
    if(random > 0.2) {
      const targets = constructionSites(creep.room)
      if(targets.length > 0) return { id: 'build', targetId: randomObject(targets).id }
    }

    const repairTask = repairDamagedStructure(creep)
    if(repairTask) return repairTask

    // Still nothing to do? Upgrade contoller!
    return { id: 'upgrade-controller' }

  }
  else return acquireEnergy(creep)
}

module.exports = { name: 'maintenance', nextTask: nextTask }