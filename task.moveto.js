const {object, clearTask} = require('task')

const moveto = targetId => creep => {
  const target = object(targetId)
  const result = creep.moveTo(target)

  switch(result) {
    case OK: break;
    case ERR_NO_PATH: return clearTask(creep)
    case ERR_BUSY: break
    default: console.log('[moveto] unhandled', result)
  }

  if(target.pos.isEqualTo(creep.pos)) clearTask(creep)
}

module.exports = moveto