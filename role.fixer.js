/**
 * FIXER CREEP (MOVE, CARRY, WORK):
 *
 * Fixes critical infrastructure first.
 */

const loop = require('loop')
const {randomObject} = require('room')
const {acquireEnergy, repairStuff} = require('task.composite')

const nextTask = creep => {
  if(creep.carry.energy) {

    const repairTask = repairStuff(creep)
    if(repairTask) return repairTask

    // Still nothing to do? Upgrade contoller!
    return { id: 'upgrade-controller' }
  }
  else return acquireEnergy(creep)
}

module.exports = { name: 'fixer', nextTask: nextTask }