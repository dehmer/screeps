// We have up to four tiers providing or buffering energy.
// Tier 1: dropped energy.
// Tier 2: energy sources.
// Tier 3: energy buffered in containers.
// Tier 4: energy buffered in storage.

const metrics = room => {
    const ops = require('room.ops')(room)
    const sources = room.find(FIND_SOURCES)
    const creeps = ops.creeps()
    const containers = ops.containers()
    const storage = []
    if(room.storage) storage.push(room.storage)

    return {
        roomName: room.name,
        roomEnergy: room.energyAvailable,
        energyCapacity: room.energyCapacityAvailable,
        sourceCount: sources.length,
        sourceEnergy: _.sum(sources, s => s.energy),
        sourceCapacity: _.sum(sources, s => s.energyCapacity),
        creepCount: creeps.length,
        creepEnergy: _(creeps).filter(c => c.carry).map(c => c.carry[RESOURCE_ENERGY]).sum(),
        creepCapacity:  _(creeps).map(c => c.carryCapacity).sum(),
        containerCount: containers.length,
        containerEnergy: _(containers).map(c => c.store[RESOURCE_ENERGY]).sum(),
        containerCapacity: _(containers).map(c => c.storeCapacity).sum(),
        storageCount: storage.length,
        storageEnergy: _(storage).map(c => c.store[RESOURCE_ENERGY]).sum(),
        storageCapacity: _(storage).map(c => c.storeCapacity).sum()
    }
}

module.exports = {
    metrics: metrics
}