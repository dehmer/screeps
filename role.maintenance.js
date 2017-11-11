/**
 * MAINTENANCE CREEP (WORK, CARRY, MOVE):
 *
 * - harvests and transfers energy to structures in need
 * - works on construction sites
 * - repairs damaged structures
 */

const loop = require('loop')
const {randomObject} = require('room')
const {sinks, constructionSites, damagedStructures} = require('room')
const {acquireEnergy} = require('task.composite')

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

    // TODO: duplicate code (-> role.fixer)

    if(random > 0.2) {
      // Damages structures ordered by damage (highest first),
      // filter targets currently in repair by other creeps.
      const repairers = _.filter(Game.creeps, creep => creep.memory.task && creep.memory.task.id === 'repair')
      const sites = _.map(repairers, creep => creep.memory.task.targetId)
      const targets = _.filter(damagedStructures(creep.room), target => sites.indexOf(target.id) === -1)
      if(targets.length > 0) return { id: 'repair', targetId: targets[0].id }
    }

    // Still nothing to do? Upgrade contoller!
    return { id: 'upgrade-controller' }

  }
  else return acquireEnergy(creep)
}

module.exports = { name: 'maintenance', nextTask: nextTask }