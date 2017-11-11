const {containers} = require('room')
const loop = require('loop')

const upgrader = require('role.upgrader')
const maintenance = require('role.maintenance')
const fixer = require('role.fixer')
const harvester = require('role.harvester')



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

    // TODO: Choose bodies depending on available energy.
    const lightBody = [MOVE, MOVE, WORK, CARRY]
    const mediumBody = [MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY]
    const heavyBody = [MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY, MOVE, MOVE, WORK, CARRY]

    creepFactory(spawn, upgrader.name, mediumBody, 3)()
    creepFactory(spawn, maintenance.name, lightBody, 6)()
    creepFactory(spawn, fixer.name, lightBody, 2)()

    const containerCount = containers(spawn.room).length
    creepFactory(spawn, harvester.name, [WORK, WORK, MOVE], containerCount)()

    const roles = {}
    roles[upgrader.name]    = upgrader
    roles[maintenance.name] = maintenance
    roles[fixer.name]       = fixer
    roles[harvester.name]   = harvester

    _.forEach(Game.creeps, creep => {
        const role = roles[creep.memory.role]
        if(role) loop(role.nextTask)(creep)
    })
}