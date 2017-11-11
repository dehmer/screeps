/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure first.
 */

const loop = require('loop')
const {randomObject} = require('room')
const {sources, criticalInfrastructure, damagedStructures} = require('room')
const {containers} = require('room')

const nextTask = creep => {
  if(creep.carry.energy) {

    {
      const targets = criticalInfrastructure(creep.room)
      if(targets.length > 0) return { id: 'repair', targetId: randomObject(targets).id }
    }

    {
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
  else {

    // Find dropped energy

    {
      const targets = creep.room.find(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY }})
      if(targets.length > 0) return { id: 'pickup', targetId: randomObject(targets).id }
    }

    // then try containers first...

    {
      const targets = _.filter(containers(creep.room), c => c.store[RESOURCE_ENERGY] > 200)
      if(targets.length > 0) return { id: 'withdraw', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }

    // ... then sources.

    {
      const targets = sources(creep.room)
      if(targets.length > 0) return { id: 'harvest', targetId: randomObject(targets).id }
    }
  }
}

module.exports = {
  role: 'fixer',
  run: loop(nextTask)
}