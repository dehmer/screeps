const {containers} = require('room')

// load roles to fill role registry:
require('role.upgrader')
require('role.maintenance')
require('role.fixer')
require('role.harvester')

const roles = require('role.registry')
const loop = require('loop')


const bodyCosts = body => _.reduce(body, (acc, x) => acc + BODYPART_COST[x], 0)

const creepFactory = (spawn, role, body, targetCount) => () => {

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

    creepFactory(spawn, 'upgrader', lightBody, 2)()
    creepFactory(spawn, 'maintenance', mediumBody, 6)()
    creepFactory(spawn, 'fixer', lightBody, 2)()

    const containerCount = containers(spawn.room).length
    creepFactory(spawn, 'harvester', [WORK, WORK, MOVE], containerCount)()

    _.forEach(Game.creeps, creep => {
        const role = roles.role(creep.memory.role)
        if(role) loop(role.nextTask)(creep)
    })
}