/**
 * CLAIMER CREEP (MOVE, CLAIM):
 *
 * Moves to another room to claim controller.
 */
const {name} = require('creep.body')
const ROLE = 'claimer'

const spawn = spawnCreep => room => {
  const targetRoom = Memory.claim
  if(!targetRoom) return

  const opts = {memory: {
    role: ROLE,
    targetRoom: targetRoom
  }}

  spawnCreep([MOVE, MOVE, CLAIM], opts)
}

const nextTask = creep => {
  if(creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
    delete Memory.claim
    return {id: 'moveto', roomName: creep.memory.targetRoom}
  }
  else {
    delete creep.memory.targetRoom
    const controller = creep.room.controller
    const result = creep.claimController(controller)
    switch(result) {
      case OK: break
      case ERR_NOT_IN_RANGE: return creep.moveTo(controller)
      case ERR_GCL_NOT_ENOUGH: {
        console.log('[claimController] ERR_GCL_NOT_ENOUGH')
        creep.suicide()
        break
      }
      default: console.log('[claimController] unhandled', result)
    }
  }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask,
  spawn: spawn
}