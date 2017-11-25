/**
 * CARRIER CREEP (WORK, MOVE, CARRY):
 *
 * Harvests energy in 'remote' rooms.
 */

const {BODY_CARRIER, bodySequence, name} = require('creep.body')
const {coalesce, randomObject} = require('combinators')
const {harvestSource, restockStorage} = require('energy')
const {upgradeController} = require('room')
const ROLE = 'carrier'

const nextTask = creep => {
  if(!creep.carry[RESOURCE_ENERGY]) {

    // If we have no target room assign, pick random.
    creep.memory.targetRoom = creep.memory.targetRoom || randomObject(Memory.remoteSources)
    if(creep.room.name !== creep.memory.targetRoom) {
      return {id: 'moveto', roomName: creep.memory.targetRoom}
    }
    else return harvestSource(creep)
  }
  else {
    // Reset target room, so that we pick another one next time:
    delete creep.memory.targetRoom
    if(creep.room.name !== creep.memory.base) {
      return {id: 'moveto', roomName: creep.memory.base}
    }
    else return coalesce([restockStorage, upgradeController])(creep)
  }
}

const spawn = spawnCreep => room => {
  const targetCount = 7

  // NOTE: Don't limit search to single room:
  const xs = _.filter(Game.creeps, (creep, name) => creep.memory.role === ROLE)
  if(xs.length < targetCount) {
    const body = bodySequence(1, BODY_CARRIER)
    spawnCreep(body, name(ROLE), {memory: {
      role: ROLE,
      base: room.name
    }})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}