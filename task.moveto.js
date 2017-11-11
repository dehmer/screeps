const {object, clearTask} = require('task')

const moveto = targetId => creep => {
  const target = object(targetId)
  const result = creep.moveTo(target)

  switch(result) {
    case OK: break;
    case ERR_NO_PATH: return clearTask(creep)
    case ERR_BUSY: break
    case ERR_TIRED: break
    default: console.log('[moveto] unhandled', result)
  }

  // Give up after some time:
  creep.memory.attempts = creep.memory.attempts + 1 || 1
  if(creep.memory.attempts > 40) {
    delete creep.memory.attempts
    clearTask(creep)
  }

  if(target.pos.isEqualTo(creep.pos)) clearTask(creep)
}

module.exports = moveto