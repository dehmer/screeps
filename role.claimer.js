/**
 * CLAIMER CREEP (MOVE, CLAIM):
 *
 * Moves to another room to claim controller.
 */

const ROLE = 'claimer'

const nextTask = creep => {

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

module.exports = {
  name: ROLE,
  nextTask: nextTask
}