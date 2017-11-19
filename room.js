const {coalesce, randomObject} = require('combinators')
const {isCritical} = require('room.defcon')

const progress = target => target.progress / target.progressTotal
const isDamaged = target => target.hits < target.hitsMax
const damage = target => target.hits / target.hitsMax

const HEALTH_GOOD = 'good'
const HEALTH_BAD = 'bad'

const health = target => {
  const hits = target.hits
  const rcl = target.room.controller.level
  if(target.structureType === STRUCTURE_ROAD) return hits < 3000 ? HEALTH_BAD : HEALTH_GOOD
  if(target.structureType === STRUCTURE_CONTAINER) return hits < 150000 ? HEALTH_BAD : HEALTH_GOOD
}

const findSpawn = room => room.find(FIND_MY_SPAWNS)[0]

const findCreeps = (room, role) => {
  const filter = role ? creep => creep.memory.role === role : () => true
  return room.find(FIND_MY_CREEPS, { filter: filter })
}

const findConstructionSites = room =>
  room.find(FIND_CONSTRUCTION_SITES).
  sort((a, b) => progress(a) < progress(b))

const findDecayingStructures = room => {
  const filter = target => target.ticksToDecay
    && target.structureType !== STRUCTURE_RAMPART
    && target.structureType !== STRUCTURE_WALL
    && isDamaged(target)
  return room.find(FIND_STRUCTURES, {filter: filter}).sort((a, b) => damage(a) - damage(b))
}

/**
* Damages of critical infrastructure.
*/
const findCriticalDamages = room => {
  const filter = target => (
    target.structureType === STRUCTURE_TOWER
    || target.structureType === STRUCTURE_EXTENSION
    || target.structureType === STRUCTURE_SPAWN
    || target.structureType === STRUCTURE_STORAGE
  ) && isDamaged(target)

  return room.find(FIND_STRUCTURES, {filter: filter})
}

/**
 * Find most damages walls ad ramparts.
 */
const findDefenceFortifications = room => {
  const mostDamaged = structureType => room
    .find(FIND_STRUCTURES, {filter: target => target.structureType === structureType})
    .sort((a, b) => damage(a) - damage(b))

  const walls = _.take(mostDamaged(STRUCTURE_WALL), 5)
  const ramparts = _.take(mostDamaged(STRUCTURE_RAMPART), 5)
  return walls.concat(ramparts)
}

const build = creep => {
  const sites = findConstructionSites(creep.room)
  if(sites.length === 0) return
  return {
    id: 'build',
    targetId: randomObject(sites).id
  }
}

const upgradeController = () => {
  return { id: 'upgrade-controller' }
}

/**
 * Repair decaying structures in bad shape.
 * Walls and ramparts are excluded.
 * They are addressed with special fortification task,
 * which receives any surplus energy.
 */
const preventDecay = creep => {
  const repairers = _.filter(Game.creeps, creep => creep.memory.task && creep.memory.task.id === 'repair')
  const assigned = _.map(repairers, creep => creep.memory.task.targetId)

  // Find unassigned, decaying structures in bad shape:
  const targets = _(findDecayingStructures(creep.room))
    .filter(target => health(target) === HEALTH_BAD)
    .filter(target => assigned.indexOf(target.id) === -1)
    .value()

  if(targets.length > 0) return {
    id: 'repair',
    targetId: targets[0].id
  }
}

/**
 * Fortify damaged walls and ramparts.
 */
const fortify = creep => {
  const targets = findDefenceFortifications(creep.room)
  if(targets.length > 0) return {
    id: 'repair',
    targetId: randomObject(targets).id
  }
}

const repairCriticalInfrastructure = creep => {
  const targets = findCriticalDamages(creep.room)
  if(targets.length > 0) return {
    id: 'repair',
    targetId: randomObject(targets).id
  }
}

const spawnCreep = room => (body, name, opts) => {
  const bodyCosts = body => _.reduce(body, (acc, x) => acc + BODYPART_COST[x], 0)
  if(room.energyCapacityAvailable < bodyCosts(body)) return console.log('[spawn] ERR_LOW_ENERGY_CAPACITY')
  if(room.energyAvailable < bodyCosts(body)) return
  const result = findSpawn(room).spawnCreep(body, name, opts)

  switch(result) {
    case OK: return
    case ERR_NOT_OWNER: return console.log('[spawn] ERR_NOT_OWNER')
    case ERR_NAME_EXISTS: return console.log('[spawn] ERR_NAME_EXISTS')
    case ERR_BUSY: /* wait */ break
    case ERR_NOT_ENOUGH_ENERGY: /* wait */ break
    case ERR_INVALID_ARGS: return console.log('[spawn] ERR_INVALID_ARGS')
    case ERR_RCL_NOT_ENOUGH: return console.log('[spawn] ERR_RCL_NOT_ENOUGH')
    default: console.log('[spawn] unhandled', result)
  }
}

module.exports = {
  findSpawn: findSpawn,
  findCreeps: findCreeps,
  build: build,
  upgradeController: upgradeController,

  // repairing/fortification:
  repairCriticalInfrastructure: repairCriticalInfrastructure,
  preventDecay: preventDecay,
  fortify: fortify,

  spawnCreep: spawnCreep
}