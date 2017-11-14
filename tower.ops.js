const run = tower => {
    // repairing damaged structures costs a lot of energy!

    // TODO: lower DEFCON when attacked (on decreasing hit count)

    const hostileCreep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if(hostileCreep) {
        // TODO: gather enemy intel
        // TODO: lower DEFCON on enemy sighting

        // Records attack information:
        Memory.attacks = Memory.attacks || []
        Memory.attacks.push({
            rep_dttm: Game.time,
            rep_org: {
                id: tower.id,
                type: tower.structureType,
                energy: tower.energy,
                hits: tower.hits
            },
            room: hostileCreep.room.name,
            creep: {
                id: hostileCreep.id,
                name: hostileCreep.name,
                body: hostileCreep.body,
                varry: hostileCreep.carry,
                owner: hostileCreep.owner,
                memory: hostileCreep.memory
            }
        })

        const result = tower.attack(hostileCreep)
        switch(result) {
            case OK: break
            case ERR_NOT_ENOUGH_RESOURCES: return console.log('[attack] ERR_NOT_ENOUGH_RESOURCES')
            case ERR_INVALID_TARGET: return console.log('[attack] ERR_INVALID_TARGET')
            case ERR_RCL_NOT_ENOUGH: return console.log('[attack] ERR_RCL_NOT_ENOUGH')
        }
    }
}

module.exports = run