/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure first.
 */

const loop = require('loop')
const {randomObject} = require('combinators')
const {repairStuff} = require('task.composite')
const {findConsumers, acquireEnergy, ENERGY_TIER_4} = require('energy')

const ROLE = 'fixer'

const nextTask = creep => {
  const {constructionSites} = require('room.ops')(creep.room)
  if(creep.carry.energy) {

    // First serve consumer:
    {
      const targets = findConsumers(creep.room)
      if(targets.length > 0) return { id: 'transfer', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }

    {
      // Keep tower energized as good as possible:
      const {towers} = require('room.ops')(creep.room)
      const targets = _.filter(towers(creep.room), tower => tower.energy < tower.energyCapacity)
      if(targets.length > 0) return { id: 'transfer', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }
    }


    const repairTask = repairStuff(creep)
    if(repairTask) return repairTask

    // Still nothing to do? Upgrade contoller!
    return { id: 'upgrade-controller' }
  }
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

module.exports = {
  name: ROLE,
  nextTask: nextTask
}