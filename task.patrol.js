const {object, clearTask, assignTask} = require('task')

const patrol = flagName => creep => {
  const flag = Game.flags[flagName]
  const result = creep.moveTo(flag)

  const {perimeter} = require('room.ops')(creep.room)
  const wayPoints = _.map(perimeter(), name => Game.flags[name])

  switch(result) {
    case OK: break;
    case ERR_NO_PATH: return clearTask(creep)
    case ERR_BUSY: break
    case ERR_TIRED: break
    default: console.log('[patrol] unhandled', result)
  }

  if(flag.pos.isEqualTo(creep.pos)) {
    const index = _.findIndex(wayPoints, p => p.pos.isEqualTo(flag.pos))
    const name = wayPoints[(index + 1) % wayPoints.length].name
    assignTask(creep, { id: 'patrol', flagName: name })
  }
}

module.exports = {
  id: 'patrol',
  invoke: task => patrol(task.flagName)
}