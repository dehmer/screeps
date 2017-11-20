const {clearTask} = require('task')

const moveto = flagName => creep => {
  const flag = Game.flags[flagName]
  if(!flag) return clearTask(creep)


  // Flag may be located in different room:
  if(creep.room.name !== flag.pos.roomName) {
    const direction = Game.map.findExit(creep.room, flag.pos.roomName)
    const exit = creep.pos.findClosestByRange(direction)

    // TODO: duplicate code
    const result = creep.moveTo(exit)
    switch(result) {
      case OK: break;
      case ERR_BUSY: break
      case ERR_TIRED: break
      case ERR_INVALID_TARGET: return console.log('[moveto.flag] ERR_INVALID_TARGET')
      default: console.log('[moveto.flag] unhandled', result)
    }
  }
  else {
    const result = creep.moveTo(flag)
    switch(result) {
      case OK: break;
      case ERR_BUSY: break
      case ERR_TIRED: break
      default: console.log('[moveto.flag] unhandled', result)
    }

    if(creep.pos.inRangeTo(flag, 3)) clearTask(creep)
  }
}

module.exports = {
  id: 'moveto.flag',
  invoke: task => moveto(task.flagName)
}