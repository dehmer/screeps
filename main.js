const {K} = require('combinators')
const loop = require('loop')
const tower = require('tower.ops')
const energy = require('energy')

const SUPPORTED_ROLES = [
    'upgrader',
    'maintenance',
    'fixer',
    'harvester',
    'hauler'
]

const roles = _(SUPPORTED_ROLES)
    .map(role => require(`role.${role}`))
    .reduce((acc, role) => K(acc)(acc => acc[role.name] = role), {})

const creepFactory = (spawn, role, body, targetCount) => () => {
    const bodyCosts = body => _.reduce(body, (acc, x) => acc + BODYPART_COST[x], 0)
    if(spawn.room.energyAvailable < bodyCosts(body)) return

    var xs = _.filter(Game.creeps, (creep) => creep.memory.role == role)
    if(xs.length < targetCount) {
        const result = spawn.spawnCreep(body, `${role}-${Game.time}`, {memory: {role: role}})
        switch(result) {
            case OK: return
            case ERR_BUSY: /* wait */ break
            case ERR_NOT_ENOUGH_ENERGY: break
            default: console.log('[spawn.spawnCreep] - unhandled', result)
        }
    }
}

module.exports.loop = function () {
    const spawn = Game.spawns['Spawn1']

    // Free memory of deceased creeps:
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) delete Memory.creeps[name];
    }

    // TODO: Choose bodies depending on available energy/work.
    const body = n => _.flatten(_.times(n, _.constant([MOVE, MOVE, WORK, CARRY])))

    _.forEach(Game.rooms, room => {
        const ops = require('room.ops')(room)
        const spawn = ops.spawn()

        // Store energy metrics every 10 ticks.
        // Limited to 20 slots (ring buffer)
        if(Game.time % 10 === 0) {
            Memory.metrics = Memory.metrics || {}
            Memory.metrics[room.name] = Memory.metrics[room.name] || []
            Memory.metrics[room.name].push(energy.metrics(room))
            if(Memory.metrics[room.name].length > 20) Memory.metrics[room.name].shift()
        }

        // _.forEach(Memory.metrics[room.name], m => console.log(JSON.stringify(m)))

        // TODO: spawning should be dynamic and aligned with room conditions.
        const containerCount = ops.containers().length
        creepFactory(spawn, 'upgrader', body(2), 3)()
        creepFactory(spawn, 'maintenance', body(1), 2)()
        creepFactory(spawn, 'hauler', body(1), 4)()
        creepFactory(spawn, 'fixer', body(1), 2)()
        creepFactory(spawn, 'harvester', [WORK, WORK, MOVE], containerCount)()

        // Process towers on room:
        _.forEach(ops.towers(), x => tower(x))

        ops.creeps().forEach(creep => {
            delete Memory.memory

            const role = roles[creep.memory.role]
            if(role) loop(role.nextTask)(creep)
        })
    })
}