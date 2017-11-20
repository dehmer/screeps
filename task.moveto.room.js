const {clearTask} = require('task')

const moveto = targetRoomName => creep => {
  if(creep.room.name === targetRoomName) return clearTask(creep)

  const direction = Game.map.findExit(creep.room, targetRoomName)
  const exit = creep.pos.findClosestByRange(direction)
  const result = creep.moveTo(exit)

  switch(result) {
    case OK: break;
    case ERR_BUSY: break
    case ERR_TIRED: break
    default: console.log('[moveto.room] unhandled', result)
  }
}

module.exports = {
  id: 'moveto.room',
  invoke: task => moveto(task.targetRoomName)
}