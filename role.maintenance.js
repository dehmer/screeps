/**
 * MAINTENANCE CREEP (WORK, CARRY, MOVE):
 *
 * - harvests and transfers energy to structures in need
 * - builds (work on construction sites)
 * - repairs damaged structures
 */

const loop = require('loop')
const {randomObject, containers, damage} = require('room')
const {sinks, sources, constructionSites, damagedStructures} = require('room')

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

    {
      // Damages structures ordered by damage (highest first),
      // filter targets currently in repair by other creeps.
      const repairers = _.filter(Game.creeps, creep => creep.memory.task && creep.memory.task.id === 'repair')
      const sites = _.map(repairers, creep => creep.memory.task.targetId)
      const targets = _.filter(damagedStructures(creep.room), target => sites.indexOf(target.id) === -1)

      // console.log('#damages: ' + targets.length)
      // _.forEach(targets, target => console.log(target, damage(target)))

      if(targets.length > 0) return { id: 'repair', targetId: targets[0].id }
    }

    // Still nothing to do? Upgrade contoller!
    return { id: 'upgrade-controller' }

  }
  else {

    {
      const targets = creep.room.find(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY }})
      if(targets.length > 0) return { id: 'pickup', targetId: randomObject(targets).id }

    }

    {
      const targets = _.filter(containers(creep.room), c => c.store[RESOURCE_ENERGY] > 0)
      if(targets.length > 0) return { id: 'withdraw', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }

    {
      const targets = sources(creep.room)
      if(targets.length > 0) return { id: 'harvest', targetId: randomObject(targets).id }
    }
  }
}


module.exports = {
  role: 'maintenance',
  run: loop(nextTask)
}