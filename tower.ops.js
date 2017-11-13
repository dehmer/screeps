const run = tower => {
    // repairing damaged structures costs a lot of energy!

    // TODO: lower DEFCON when attacked (on decreasing hit count)

    const hostileCreep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if(hostileCreep) {
        // TODO: gather enemy intel
        // TODO: lower DEFCON on enemy sighting

        // Records attack information:
        memory.attacks = memory.attacks || []
        memory.attacks.push({
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

        tower.attack(hostileCreep)
    }
}

module.exports = run