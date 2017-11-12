/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure first.
 */

const loop = require('loop')
const {randomObject} = require('combinators')
const {acquireEnergy, repairStuff} = require('task.composite')

const nextTask = creep => {
  if(creep.carry.energy) {
    const {towers} = require('room.ops')(creep.room)

    // Keep tower energized as good as possible:
    const targets = _.filter(towers(creep.room), tower => tower.energy < tower.energyCapacity)
    if(targets.length > 0) return { id: 'transfer', targetId: randomObject(targets).id, resource: RESOURCE_ENERGY }

    const repairTask = repairStuff(creep)
    if(repairTask) return repairTask

    // Still nothing to do? Upgrade contoller!
    return { id: 'upgrade-controller' }
  }
  else return acquireEnergy(creep)
}

const ROLE = 'fixer'
module.exports = {
  name: ROLE,
  nextTask: nextTask
}