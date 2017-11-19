const {K} = require('combinators')
const loop = require('loop')
const {defendRoom} = require('room.defence')
const {metrics, findContainers} = require('energy')
const {findSpawn, findCreeps, spawnCreep} = require('room')

const SUPPORTED_ROLES = [
  'upgrader', 'maintenance', 'fixer',
  'harvester', 'hauler', 'claimer'
]

const roles = _(SUPPORTED_ROLES)
  .map(role => require(`role.${role}`))
  .reduce((acc, role) => K(acc)(acc => acc[role.name] = role), {})

const creepFactory = (room, role, body, targetCount) => () => {
  var xs = findCreeps(room, role)
  if(xs.length < targetCount) {
    spawnCreep(room)(body, `${role}-${Game.time}`, {memory: {role: role}})
  }
}

module.exports.loop = function () {

  // Free memory of deceased creeps:
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) delete Memory.creeps[name]
  }

  _.forEach(Game.rooms, room => {

    // TODO: spawning should be dynamic and aligned with room conditions/environment.
    // TODO: Choose bodies depending on available energy/work.
    const body = n => _.flatten(_.times(n, _.constant([MOVE, MOVE, WORK, CARRY])))

    // We might have creeps in rooms without a spawn.
    if(findSpawn(room)) {
      const containerCount = findContainers(room).length
      creepFactory(room, 'maintenance', body(2), 3)()

      // Even haulers have WORK parts so that they can upgrade controller.
      creepFactory(room, 'hauler', body(3), 4)()
      creepFactory(room, 'fixer', body(1), 2)()
      creepFactory(room, 'harvester', [WORK, WORK, MOVE], containerCount)()
      creepFactory(room, 'upgrader', body(4), 2)()
    }

    // Defence:
    defendRoom(room)

    findCreeps(room).forEach(creep => {
      const role = roles[creep.memory.role]
      if(role) loop(role.nextTask)(creep)
    })
  })
}