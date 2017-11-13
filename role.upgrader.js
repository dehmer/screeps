const loop = require('loop')
const {acquireEnergy} = require('task.composite')

const nextTask = creep => {
  if(creep.carry.energy) return { id: 'upgrade-controller' }
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

const ROLE = 'upgrader'

module.exports = {
  name: ROLE,
  nextTask: nextTask
}