const loop = require('loop')
const {acquireEnergy} = require('task.composite')

const nextTask = creep => {
  if(creep.carry.energy) return { id: 'upgrade-controller' }
  else return acquireEnergy(creep)
}

const ROLE = 'upgrader'

module.exports = {
  name: ROLE,
  nextTask: nextTask
}