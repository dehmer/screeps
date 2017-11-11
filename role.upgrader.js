const loop = require('loop')
const {acquireEnergy} = require('task.composite')
const roles = require('role.registry')

const nextTask = creep => {
  if(creep.carry.energy) return { id: 'upgrade-controller' }
  else return acquireEnergy(creep)
}

require('role.registry').push({ name: 'upgrader', nextTask: nextTask })
