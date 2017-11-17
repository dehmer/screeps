const {coalesce, randomObject} = require('combinators')
const {isCritical} = require('room.defcon')

const progress = target => target.progress / target.progressTotal
const isDamaged = target => target.hits < target.hitsMax
const damage = target => target.hits / target.hitsMax

const findSpawn = room => room.find(FIND_MY_SPAWNS)[0]

const findCreeps = (room, role) => {
  const filter = role ? creep => creep.memory.role === role : () => true
  return room.find(FIND_MY_CREEPS, { filter: filter })
}

const findConstructionSites = room =>
  room.find(FIND_CONSTRUCTION_SITES).
  sort((a, b) => progress(a) < progress(b))

const findPerimeter = () => _.filter(Object.keys(Game.flags), name => name.startsWith('PERIMETER'))

const findDamages = (room, filter) =>
  room.find(FIND_STRUCTURES, { filter: filter }).
  sort((a,b) => damage(a) - damage(b))

/**
* Damages of critical infrastructure.
* Depends on room's DEFCON level.
*/
const findCriticalDamages = room => {
  const filter = target => isDamaged(target) && isCritical(room.memory.defcon)(target)
  return findDamages(room, filter)
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
* Repair damaged structures.
* Damages structures ordered by damage (highest first),
* filter targets currently in repair by other creeps.
*/
const repairDamagedStructures = creep => {
  const repairers = _.filter(Game.creeps, creep => creep.memory.task && creep.memory.task.id === 'repair')
  const sites = _.map(repairers, creep => creep.memory.task.targetId)
  const targets = _.filter(findDamages(creep.room), target => sites.indexOf(target.id) === -1)
  if(targets.length > 0) return {
    id: 'repair',
    targetId: targets[0].id
  }
}

const repairCriticalInfrastructure = creep => {
  const targets = findCriticalDamages(creep.room)
  if(targets.length > 0) return {
    id: 'repair',
    targetId: randomObject(targets).id
  }
}

module.exports = {
  findSpawn: findSpawn,
  findCreeps: findCreeps,
  findConstructionSites: findConstructionSites,
  findPerimeter: findPerimeter,
  findDamages: findDamages,
  findCriticalDamages: findCriticalDamages,
  build: build,
  upgradeController: upgradeController,
  repairDamagedStructures: repairDamagedStructures,
  repairCriticalInfrastructure: repairCriticalInfrastructure,
  repair: coalesce([repairCriticalInfrastructure, repairDamagedStructures])
}