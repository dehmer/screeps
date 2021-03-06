const {randomObject, coalesce} = require('combinators')
const {findCreeps} = require('room')

// We have up to four tiers providing or buffering energy.

const ENERGY_TIER_1 = 0 // dropped energy
const ENERGY_TIER_2 = 1 // energy sources
const ENERGY_TIER_3 = 2 // energy buffered in containers
const ENERGY_TIER_4 = 3 // energy buffered in storage

const isStructureType = type => target  => target.structureType === type
const isContainer = isStructureType(STRUCTURE_CONTAINER)

const needsEnergy = target => (
  target.structureType == STRUCTURE_SPAWN ||
  target.structureType == STRUCTURE_EXTENSION ||
  target.structureType == STRUCTURE_TOWER
) && target.energy < target.energyCapacity


const findDroppedEnergy = room => room.find(FIND_DROPPED_RESOURCES, {filter: {resourceType: RESOURCE_ENERGY}})
const findContainers = room => room.find(FIND_STRUCTURES, {filter: isContainer})
const findSources = room => room.find(FIND_SOURCES)
const findConsumers = room => room.find(FIND_STRUCTURES, { filter: needsEnergy })

/**
 * Pickup dropped energy.
 * TODO: Don't try to pickup energy when under attack
 */
const pickupDroppedEnergy = creep => {
  const droppedEnergy = findDroppedEnergy(creep.room)
  const target = creep.pos.findClosestByPath(droppedEnergy)
  if(target) return {
    id: 'pickup',
    targetId: target.id
  }
}

/**
 * Harvest energy from source.
 */
const harvestSource = creep => {
  const targets = findSources(creep.room)
  if(targets.length > 0) return {
    id: 'harvest',
    targetId: randomObject(targets).id
  }
}

/**
 * Withdraw energy from container.
 */
const withdrawFromContainer = creep => {
  const containers = findContainers(creep.room)

  // Don't drain containers completely; keep 20% buffer.
  // TODO: make dependent on demand/defence condition.
  const targets = _.filter(containers, c => c.store[RESOURCE_ENERGY] > 200)
  if(targets.length > 0) return {
    id: 'withdraw',
    targetId: randomObject(targets).id,
    resource: RESOURCE_ENERGY
  }
}

/**
 * Withdraw from storage if possible.
 */
const withdrawFromStorage = creep => {
  const storage = creep.room.storage
  if(!storage) return

  // TODO: how can we pull last reserves in case of emergency?
  if(storage.store[RESOURCE_ENERGY] < 20000) return

  return {
    id: 'withdraw',
    targetId: storage.id,
    resource: RESOURCE_ENERGY
  }
}

/**
 * Decision function which returns most appropriate task to
 * acquire energy. Maximum tier is limited with given
 * tier argument.
 *
 * @param {integer} tier [0..3]
 */
const acquireEnergy = tier => {
  const selected = [harvestSource, withdrawFromContainer, withdrawFromStorage]
    .slice(0, tier)
    .reverse()

  // Always pickup dropped energy first if available.
  selected.unshift(pickupDroppedEnergy)
  return coalesce(selected)
}

/**
 * @param {Creep} creep
 */
const transferEnergy = creep => {
  const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: needsEnergy})
  if(target) return {
    id: 'transfer',
    targetId: target.id,
    resource: RESOURCE_ENERGY
  }
}

const restockStorage = creep => {
  const storage = creep.room.storage
  if(!storage) return

  const total = _.sum(storage.store)
  if(total < storage.storeCapacity) return {
    id: 'transfer',
    targetId: storage.id,
    resource: RESOURCE_ENERGY
  }
}

const storageLevel = (room, resource) =>
  room.storage.store[resource] / room.storage.storeCapacity

const metrics = room => {
  const sources = room.find(FIND_SOURCES)
  const creeps = findCreeps(room)
  const containers = findContainers(room)
  const storage = []
  if(room.storage) storage.push(room.storage)

  return {
    time: Game.time,
    roomEnergy: room.energyAvailable,
    roomCapacity: room.energyCapacityAvailable,
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
    storageEnergy: _(storage).map(s => s.store[RESOURCE_ENERGY]).sum(),
    storageCapacity: _(storage).map(s => s.storeCapacity).sum()
  }
}

module.exports = {
  findDroppedEnergy: findDroppedEnergy,
  findContainers: findContainers,
  findSources: findSources,
  findConsumers: findConsumers,

  ENERGY_TIER_1: ENERGY_TIER_1,
  ENERGY_TIER_2: ENERGY_TIER_2,
  ENERGY_TIER_3: ENERGY_TIER_3,
  ENERGY_TIER_4: ENERGY_TIER_4,
  harvestSource: harvestSource,
  acquireEnergy: acquireEnergy,
  transferEnergy: transferEnergy,
  restockStorage: restockStorage,

  storageLevel: storageLevel,
  metrics: metrics
}