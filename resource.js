module.exports = {
  isFullyCharged: creep => creep.carry.energy === creep.carryCapacity,
  needsEnergy: spawn => spawn.energy < spawn.energyCapacity
}
