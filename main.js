const roleHarvester = require('role.harvester')
const roleBuilder = require('role.builder')
const roleUpgrader = require('role.upgrader')
const roleWorker = require('role.worker')

const creepFactory = (spawn, role, body, targetCount) => () => {
    // don't event try if energy is less than 300
    // TODO: count body parts to determine required amount of energy
    if(spawn.energy < 200) return

    var xs = _.filter(Game.creeps, (creep) => creep.memory.role == role)
    if(xs.length < targetCount) {
        const result = spawn.spawnCreep(body, `${role}-${Game.time}`, {memory: {role: role}})
        switch(result) {
            case ERR_NOT_ENOUGH_ENERGY: break;
        }
    }
}

printRooms = () => {
    for(var name in Game.creeps) {
        const creep = Game.creeps[name]
        console.log(`${creep}: room = ${creep.room}`)
    }
}

module.exports.loop = function () {

    // for(var name in Memory.creeps) {
    //     if(!Game.creeps[name]) delete Memory.creeps[name];
    // }

    // const spawn = Game.spawns['Spawn1']
    // const simpleBody = [WORK, CARRY, MOVE]

    // creepFactory(spawn, 'upgrader',  simpleBody, 1)()
    // creepFactory(spawn, 'harvester', simpleBody, 2)()
    // // creepFactory(spawn, 'builder',   simpleBody, 3)()
    // creepFactory(spawn, 'worker',    simpleBody, 1)()

    // for(var name in Game.creeps) {
    //     const creep = Game.creeps[name]
    //     if(creep.memory.role == 'harvester')     roleHarvester.run(creep)
    //     else if(creep.memory.role == 'builder')  roleBuilder.run(creep)
    //     else if(creep.memory.role == 'upgrader') roleUpgrader.run(creep)
    //     else if(creep.memory.role == 'worker')   roleWorker.run(creep)
    // }
}