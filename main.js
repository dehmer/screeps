const {K, id} = require('combinators')
const loop = require('loop')
const {defendRoom} = require('room.defence')
const {findSpawn, findCreeps, spawnCreep} = require('room')
const {BODY_RANGER, BODY_MELEE, BODY_SCOUT, BODY_HEALER} = require('creep.body')

const SUPPORTED_ROLES = [
  'upgrader', 'maintenance', 'fixer',
  'harvester', 'hauler'
]

const roles = _(SUPPORTED_ROLES)
  .map(role => require(`role.${role}`))
  .reduce((acc, role) => K(acc)(acc => acc[role.name] = role), {})

module.exports.loop = function () {
  Memory.units = Memory.units || {}

  // Free memory of deceased creeps:
  for(var name in Memory.creeps) {
    if(!Game.creeps[name]) delete Memory.creeps[name]
  }

  const weasel = {
    objectives: [
      {type: 'assemble', path: ['W5N8.AA.B']},
      // {type: 'assemble', path: ['W5N8.AA.A']},
      // {type: 'assemble', path: ['W9N8.CP.A', 'W9N8.CP.B', 'W9N8.CP.C', 'W9N8.CP.D']},
      // {type: 'attack', roomName: 'W9N9'}
    ],
    units: [
      {role: 'healer', count: 2, body: BODY_SCOUT},
      {role: 'ranger', count: 4, body: BODY_RANGER},
    ]
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