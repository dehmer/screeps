const {acquireEnergy, ENERGY_TIER_4} = require('energy')

const nextTask = creep => {
  if(creep.carry.energy) return { id: 'upgrade-controller' }
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

const ROLE = 'upgrader'

module.exports = {
  name: ROLE,
  nextTask: nextTask
}