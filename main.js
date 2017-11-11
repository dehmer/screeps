const {containers} = require('room')
const upgrader = require('role.upgrader')
const maintenance = require('role.maintenance')
const fixer = require('role.fixer')
const harvester = require('role.harvester')

const bodyCosts = body => _.reduce(body, (acc, x) => acc + BODYPART_COST[x], 0)

const creepFactory = (spawn, role, body, targetCount) => () => {

    if(spawn.room.energyAvailable < bodyCosts(body)) return

    var xs = _.filter(Game.creeps, (creep) => creep.memory.role == role)
    if(xs.length < targetCount) {
        const result = spawn.spawnCreep(body, `${role}-${Game.time}`, {memory: {role: role}})
        switch(result) {
            case OK: return
            case ERR_NOT_ENOUGH_ENERGY: break;
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

    creepFactory(spawn, upgrader.role, lightBody, 1)()
    creepFactory(spawn, maintenance.role, mediumBody, 4)()
    creepFactory(spawn, fixer.role, lightBody, 2)()

    const containerCount = containers(spawn.room).length
    creepFactory(spawn, harvester.role, [WORK, MOVE], containerCount)()

    for(var name in Game.creeps) {
        const creep = Game.creeps[name]

        if(creep.memory.role == upgrader.role) upgrader.run(creep)
        else if(creep.memory.role == maintenance.role) maintenance.run(creep)
        else if(creep.memory.role == fixer.role) fixer.run(creep)
        else if(creep.memory.role == harvester.role) harvester.run(creep)
    }
}