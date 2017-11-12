const run = tower => {
    // repairing damaged structures costs a lot of energy!

    // TODO: lower DEFCON when attacked (on decreasing hit count)

    const hostileCreep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if(hostileCreep) {
        // TODO: gather enemy intel
        // TODO: lower DEFCON on enemy sighting
        tower.attack(hostileCreep)
    }
}

module.exports = run