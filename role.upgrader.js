const loop = require('loop')
const {acquireEnergy} = require('task.composite')

const nextTask = creep => {
  if(creep.carry.energy) return { id: 'upgrade-controller' }
  else return acquireEnergy(creep)
}

module.exports = { name: 'upgrader', nextTask: nextTask }