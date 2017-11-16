const ROLE = 'dummy'

const nextTask = creep => {
    const {perimeter} = require('room.ops')(creep.room)
    const wayPoints = perimeter()

    // Keep harvesting until fully loaded:
    if(creep.carry.energy == creep.carryCapacity) {
        return { id: 'patrol', flagName: wayPoints[0] }

    }
    else {
        if(creep.room.storage) {
            const storage = creep.room.storage
            if(storage.store[RESOURCE_ENERGY] > 10000) {
                return { id: 'withdraw', targetId: storage.id, resource: RESOURCE_ENERGY }
            }
        }

        return acquireEnergy(creep)
    }

}

module.exports = {
  name: ROLE,
  nextTask: nextTask
}