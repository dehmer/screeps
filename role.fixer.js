/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure first.
 */

const loop = require('loop')
const {randomObject} = require('combinators')
const {acquireEnergy, repairStuff} = require('task.composite')

const ROLE = 'fixer'

const nextTask = creep => {
  const {energyConsumers, constructionSites} = require('room.ops')(creep.room)
  if(creep.carry.energy) {

    // First serve consumer:
    {
      const targets = energyConsumers()
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

module.exports = {
  name: ROLE,
  nextTask: nextTask
}