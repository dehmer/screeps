/**
 * CLAIMER CREEP (MOVE, CLAIM):
 *
 * Moves to another room to claim controller.
 * NOTE: Set Memory.claim to name of room to claim.
 */
const {name} = require('creep.body')
const ROLE = 'claimer'

const spawn = spawnCreep => room => {
  const targetRoom = Memory.claim
  if(!targetRoom) return
  delete Memory.claim

  spawnCreep([MOVE, MOVE, CLAIM], {memory: {
    role: ROLE,
    targetRoom: targetRoom
  }})
}

const nextTask = creep => {
  if(creep.memory.targetRoom && creep.room.name !== creep.memory.targetRoom) {
    return {id: 'moveto', roomName: creep.memory.targetRoom}
  }
  else {
    delete creep.memory.targetRoom
    const controller = creep.room.controller

    // TODO: don't claim when already owned
    const result = creep.claimController(controller)
    switch(result) {
      case OK: break
      case ERR_NOT_IN_RANGE: return creep.moveTo(controller)
      case ERR_GCL_NOT_ENOUGH: {
        console.log('[claimController] ERR_GCL_NOT_ENOUGH')
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