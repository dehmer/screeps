/**
 * @param {*} creep
 * @param {*} target
 */
const moveTo = (creep, target) => {
  const result = creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}})
  switch(result) {
    case OK: return true
    // There is currently no path, target might be blocked.
    case ERR_NO_PATH: return false
    case ERR_TIRED: return false
    default: {
      console.log(`[creep.moveTo] creep: ${creep.name} - unhandled`, result)
      return false
    }
  }

  return true
}

const harvest = (creep, target) => {
  const result = creep.harvest(target)
  switch(result) {
      case OK: return
      case ERR_NOT_OWNER: creep.suicide()
      case ERR_NOT_IN_RANGE: return moveTo(creep, target)
      case ERR_BUSY: return
      case ERR_INVALID_TARGET: console.log(`[creep.harvest] ERR_INVALID_TARGET - creep: ${creep.name}, target: ${target}`)
      default: console.log(`[creep.harvest] creep: ${creep.name}, target: ${target}`, result)
  }
}

const repair = (creep, target) => {
  const result = creep.repair(target)
  switch(result) {
      case OK: return
      case ERR_NOT_IN_RANGE: return moveTo(creep, target)
      default: console.log(`[creep.harvest] creep: ${creep.name}, target: ${target}`, result)
  }
}

const transfer = (creep, target, resource) => {
  const result = creep.transfer(target, RESOURCE_ENERGY)
  switch(result) {
      case OK: return true
      case ERR_NOT_IN_RANGE: return moveTo(creep, target)
      case ERR_FULL: return false
      default: {
        console.log(`[creep.transfer] creep: ${creep.name} - unhandled`, result)
        return false;
      }
  }
}

const upgradeController = creep => {
  const target = creep.room.controller
  const result = creep.upgradeController(target)
  switch(result) {
    case OK: return
    case ERR_NOT_IN_RANGE: return moveTo(creep, target)
    default: console.log(`[creep.upgradeController] creep: ${creep.name} - unhandled`, result)
  }
}

const build = (creep, target) => {
  const result = creep.build(target)
  switch(result) {
    case OK: return
    case ERR_NOT_IN_RANGE: return creep.moveTo(target)
    default: console.log(`[creep.build] creep: ${creep.name} - unhandled`, result)
  }
}

module.exports = {
  moveTo: moveTo,
  harvest: harvest,
  transfer: transfer,
  repair: repair,
  upgradeController: upgradeController,
  build: build
}