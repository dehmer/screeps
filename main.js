require('prototypes')
const {K, id} = require('combinators')
const loop = require('loop')
const {defendRoom} = require('room.defence')
const {findSpawn, findCreeps, spawnCreep} = require('room')
const economy = require('economy')

const SUPPORTED_ROLES = [
  'upgrader', 'maintenance', 'fixer',
  'harvester', 'hauler', 'carrier', 'claimer', 'builder'
]

const roles = _(SUPPORTED_ROLES)
  .map(role => require(`role.${role}`))
  .reduce((acc, role) => K(acc)(acc => acc[role.name] = role), {})

module.exports.loop = function () {

  // Configure available rooms for remote harvesting.
  // For each room we have a list of colonies to 'exploit'.
  Memory.colonies = {
    'W5N8': ['W6N8', 'W5N9', 'W5N7', 'W6N9']
  }

  // Free memory of deceased creeps:
  // TODO: garbage collect only every n ticks.
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) delete Memory.creeps[name]
  }

  _.forEach(Game.rooms, room => {
    economy(room)

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