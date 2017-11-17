const {acquireEnergy, ENERGY_TIER_4} = require('energy')
const ROLE = 'upgrader'

const nextTask = creep => {
  if(creep.carry.energy) return { id: 'upgrade-controller' }
  else return acquireEnergy(ENERGY_TIER_4)(creep)
}

module.exports = {
  name: ROLE,
  nextTask: nextTask
}