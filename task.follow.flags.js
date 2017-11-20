const {clearTask} = require('task')

const follow = flagNames => creep => {
  const task = creep.memory.task
  task.targetIndex = task.targetIndex || 0

  const flag = Game.flags[flagNames[task.targetIndex]]
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

    if(creep.pos.inRangeTo(flag, 3)) {
      if(task.targetIndex === flagNames.length - 1) clearTask(creep)
      else task.targetIndex += 1
    }
  }
}

module.exports = {
  id: 'follow.flags',
  invoke: task => follow(task.flagNames)
}