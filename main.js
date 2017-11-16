const {K} = require('combinators')
const loop = require('loop')
const tower = require('tower.ops')
const {metrics, findContainers} = require('energy')

const SUPPORTED_ROLES = [
    'upgrader', 'maintenance', 'fixer',
    'harvester', 'hauler', 'dummy'
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
    // Free memory of deceased creeps:
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) delete Memory.creeps[name];
    }

    _.forEach(Game.rooms, room => {
        const ops = require('room.ops')(room)
        const spawn = ops.spawn()

        // Store energy metrics every 10 ticks.
        // Limited to 20 slots (ring buffer)
        if(Game.time % 10 === 0) {
            Memory.metrics = Memory.metrics || {}
            Memory.metrics[room.name] = Memory.metrics[room.name] || []
            Memory.metrics[room.name].push(metrics(room))
            if(Memory.metrics[room.name].length > 20) Memory.metrics[room.name].shift()
        }

        // _.forEach(Memory.metrics[room.name], m => console.log(m.storageEnergy))
        // _.forEach(Memory.metrics[room.name], m => console.log(JSON.stringify(m)))

        // TODO: Choose bodies depending on available energy/work.
        const body = n => _.flatten(_.times(n, _.constant([MOVE, MOVE, WORK, CARRY])))

        // TODO: spawning should be dynamic and aligned with room conditions.
        const containerCount = findContainers(room).length
        creepFactory(spawn, 'upgrader', body(2), 4)()
        creepFactory(spawn, 'maintenance', body(2), 5)()
        creepFactory(spawn, 'hauler', body(1), 4)()
        creepFactory(spawn, 'fixer', body(1), 3)()
        creepFactory(spawn, 'harvester', [WORK, WORK, MOVE], containerCount)()
        creepFactory(spawn, 'dummy', body(1), 0)()

        // Process towers in room:
        _.forEach(ops.towers(), x => tower(x))

        ops.creeps().forEach(creep => {
            if(creep.name.startsWith('harvester')) creep.memory.role = 'harvester'
            if(creep.name.startsWith('maintenance')) creep.memory.role = 'maintenance'
            else if(creep.name.startsWith('fixer')) creep.memory.role = 'fixer'
            else if(creep.name.startsWith('dummy')) creep.memory.role = 'maintenance-'

            const role = roles[creep.memory.role]
            if(role) loop(role.nextTask)(creep)
        })
    })
}