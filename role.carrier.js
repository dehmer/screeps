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
    const colonies = Memory.colonies[creep.memory.home]
    if(!colonies) { /* no colonies for said room */ return }

    creep.memory.targetRoom = creep.memory.targetRoom || randomObject(colonies)
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

  // Don't spawn if there are no colonies for this room:
  if(!Memory.colonies[room.name]) return

  const targetCount = 1

  const counts = creep =>
    creep.memory.role === ROLE &&
    creep.memory.home === room.name

  const xs = _.filter(Game.creeps, counts)
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