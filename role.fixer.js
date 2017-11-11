/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure first.
 */

const loop = require('loop')
const {criticalInfrastructure, damagedStructures, randomObject} = require('room')
const {acquireEnergy} = require('task.composite')

const nextTask = creep => {
  if(creep.carry.energy) {

    {
      const targets = criticalInfrastructure(creep.room)
      if(targets.length > 0) return { id: 'repair', targetId: randomObject(targets).id }
    }

    {
      // Damaged structures ordered by damage (highest first),
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

module.exports = { name: 'fixer', nextTask: nextTask }