/**
 * CARRIER CREEP (WORK, MOVE, CARRY):
 *
 * Harvests energy in 'remote' rooms.
 * Carrier doubles as builder and to transfer energy in remote rooms.
 */

const {BODY_CARRIER, bodySequence} = require('creep.body')
const {coalesce, randomObject} = require('combinators')
const {harvestSource, restockStorage, transferEnergy} = require('energy')
const {upgradeController, findSpawn, build} = require('room')
const ROLE = 'carrier'

const goHome = creep => {
  return {id: 'moveto', roomName: creep.memory.home}
}

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
    if(creep.room.name !== creep.memory.home) {
      return coalesce([build, transferEnergy, goHome])(creep)
    }
    else return coalesce([restockStorage, upgradeController])(creep)
  }
}

const spawn = spawnCreep => room => {
  const targetCount = 0

  // NOTE: Don't limit search to single room.
  // TODO: Count carriers for this room only.
  const xs = _.filter(Game.creeps, (creep, name) => creep.memory.role === ROLE)
  if(xs.length < targetCount) {
    const body = bodySequence(1, BODY_CARRIER)
    spawnCreep(body, {memory: {role: ROLE}})
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}