const {K} = require('combinators')
const loop = require('loop')
const {defendRoom} = require('room.defence')
const {findSpawn, findCreeps, spawnCreep} = require('room')

const SUPPORTED_ROLES = [
  'upgrader', 'maintenance', 'fixer',
  'harvester', 'hauler', 'claimer'
]

const roles = _(SUPPORTED_ROLES)
  .map(role => require(`role.${role}`))
  .reduce((acc, role) => K(acc)(acc => acc[role.name] = role), {})

module.exports.loop = function () {

  // Free memory of deceased creeps:
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) delete Memory.creeps[name]
  }

  _.forEach(Game.rooms, room => {

    // We might have creeps in rooms without a spawn.
    if(findSpawn(room)) {

      // Delegate spawning to individual roles.
      // Note: Roles are not required to supply a `spawn` method.
      _(roles)
        .filter(role => role.spawn)
        .map(role => role.spawn(spawnCreep(room)))
        .value()
        .forEach(spawn => spawn(room))
    }

    // Defence:
    defendRoom(room)

    findCreeps(room).forEach(creep => {
      const role = roles[creep.memory.role]
      if(role) loop(role.nextTask)(creep)
    })
  })
}