const {K, id} = require('combinators')
const {findContainers} = require('energy')
const {body} = require('creep.body')

const assignTask = (creep, task) => K(task)(task => creep.memory.task = task)
const clearTask = (creep, reason) => delete creep.memory.task
const currentTask = creep => creep.memory.task
const object = id => Game.getObjectById(id)

const isEmpty = (creep, resource) => !creep.carry[resource]
const isRepaired = target => !target || target.hits === target.hitsMax

const isFullyLoaded = (creep, resource) =>
  creep.carryCapacity &&
  creep.carry[resource] === creep.carryCapacity

/**
 * @param {object} task
 * @param {string} task.targetId
 */
const build = task => creep => {
  const target = object(task.targetId)

  // Target no longer a construction site -> done:
  if(!target) return clearTask(creep)
  if(isEmpty(creep, RESOURCE_ENERGY)) clearTask(creep)

  creep.__build(target, {
    ERR_NOT_IN_RANGE: () => creep.__moveTo(target),
    ERR_NOT_ENOUGH_RESOURCES: () => { /* so be it */ }
  })
}

/**
 * @param {object} task
 * @param {string} task.targetId
 */
const harvest = task => creep => {
  const target = object(task.targetId)

  // Special case: static harvesting.
  // Stop harvesting if container beneath creep is full.
  if(creep.memory.role === 'harvester') {
    const targets = findContainers(creep.room)
    const container = _.find(targets, target => target.pos.isEqualTo(creep.pos))
    if(container && container.storeCapacity === container.store[RESOURCE_ENERGY]) {
      clearTask(creep)
    }
  }

  creep.__harvest(target, {
    ERR_BUSY: () => { /* don't care */ },
    ERR_NOT_ENOUGH_RESOURCES: () => { /* wait */ },
    ERR_NO_BODYPART: () => creep.suicide(), // <-- poor lad must've been attacked!
    ERR_NOT_IN_RANGE: () => creep.__moveTo(target, {
      ERR_NO_PATH: () => clearTask(creep),
      ERR_TIRED: () => { /* so what?! */ }
    })
  })

  if(isFullyLoaded(creep, RESOURCE_ENERGY)) clearTask(creep)
}

/**
 * Get room position from target or actual position.
 *
 * @param {Creep} creep
 * @param {object} task
 *
 * One of `targetId`, `position` or `roomName`:
 * @param {string} task.targetId
 * @param {object} task.position
 * @param {string} task.roomName
 * @returns {RoomPosition}
 */
const position = (creep, task) => {
  if(task.targetId) return object(task.targetId).pos
  else if(task.position) return new RoomPosition(task.position.x, task.position.y, task.position.roomName)
  else if(task.roomName && task.roomName !== creep.room.name) {
    const exit = creep.room.findExitTo(task.roomName)
    return creep.pos.findClosestByRange(exit)
  }
}

/**
 * @param {object} task
 * @param {string} task.targetId
 * @param {string} task.position
 * @param {string} task.roomName
 * @param {string} task.opts (optional)
 */
const moveto = task => creep => {

  // Don't even try if tired:
  if(creep.fatigue) return

  const targetPosition = position(creep, task)
  if(!targetPosition) return clearTask(creep)

  creep.__moveTo(targetPosition, task.opts, {
    ERR_NO_PATH: () =>  { /* wait */},
    ERR_BUSY: () => { /* wait */},
    ERR_TIRED: () => { /* wait */}
  })

  // Give up after some time:
  creep.memory.attempts = creep.memory.attempts + 1 || 1
  if(creep.memory.attempts > 40) {
    delete creep.memory.attempts
    clearTask(creep)
  }

  if(targetPosition.isEqualTo(creep.pos)) clearTask(creep)
}

/**
 * @param {object} task
 * @param {string} task.targetId
 */
const pickup = task => creep => {
  const target = object(task.targetId)
  if(!target) return clearTask(creep)

  const result = creep.__pickup(target, {
    ERR_BUSY: () => { /* wait */ },
    ERR_FULL: () => clearTask(creep),
    ERR_NOT_IN_RANGE: () => creep.__moveTo(target)
  })

  if(isFullyLoaded(creep, RESOURCE_ENERGY)) clearTask(creep)
}

/**
 * @param {object} task
 * @param {string} targetId
 */
const repair = task => creep => {

  const target = object(task.targetId)

  // console.log(_(creep.body).map(b => )

  task.ref = task.ref || id()
  // Memory.debug = Memory.debug || {}
  // Memory.debug[task.ref] = Memory.debug[task.ref] || {
  //   type: target.structureType,
  //   energy: creep.carry[RESOURCE_ENERGY],
  //   workParts: _.filter(body(creep), part => part === WORK).length,
  //   time: Game.time,
  //   hits: target.hits
  // }

  creep.__repair(target, {
    ERR_NOT_IN_RANGE: () => creep.__moveTo(target),
    ERR_NOT_ENOUGH_RESOURCES: () => {
      // Memory.debug[task.ref] = {
      //   type: Memory.debug[task.ref].type,
      //   energy: Memory.debug[task.ref].energy,
      //   workParts: Memory.debug[task.ref].workParts,
      //   duration: Game.time - Memory.debug[task.ref].time,
      //   hits: target.hits - Memory.debug[task.ref].hits
      // }

      clearTask(creep)
    }
  })

  if(isRepaired(target)) return clearTask(creep)
}

/**
 * @param {object} task
 * @param {string} task.targetId
 * @param {string} task.resource
 * @param {number} task.amount (optional)
 */
const transfer = task => creep => {

  // Clear all transfer tasks with same target:
  const clearTransferTasks = () => {
    creep.room.find(FIND_MY_CREEPS, {filter: creep => {
      return creep.memory.task
        && creep.memory.task.id === 'transfer'
        && creep.memory.task.targetId === task.targetId
    }}).forEach(clearTask)
  }

  const target = object(task.targetId)
  creep.__transfer(target, task.resource, task.amount, {
    ERR_NOT_ENOUGH_RESOURCES: () => clearTask(creep),
    ERR_FULL: () => clearTransferTasks(),
    ERR_NOT_IN_RANGE: () => creep.__moveTo(target)
  })

  if(isEmpty(creep, task.resource)) clearTask(creep)
}

/**
 *
 */
const upgradeController = () => creep => {
  if(isEmpty(creep, RESOURCE_ENERGY)) clearTask(creep)

  const target = creep.room.controller
  const result = creep.__upgradeController(target, {
    ERR_NOT_ENOUGH_RESOURCES: () => {/* happens */ },
    ERR_NOT_IN_RANGE: () => creep.__moveTo(target)
  })
}

/**
 * @param {object} task
 * @param {string} task.targetId
 * @param {string} task.resource
 * @param {number} task.amount (optional)
 */
const withdraw = task => creep => {
  const target = object(task.targetId)
  const result = creep.__withdraw(target, task.resource, task.amount, {
    ERR_BUSY: () => { /* don't care */ },
    ERR_NOT_ENOUGH_RESOURCES: () => clearTask(creep),
    ERR_FULL: () => clearTask(creep),
    ERR_NOT_IN_RANGE: () => creep.__moveTo(target)
  })

  if(isFullyLoaded(creep, task.resource)) return clearTask(creep)
}

module.exports = {
  assignTask: assignTask,
  clearTask: clearTask,
  currentTask: currentTask,

  // keys match task.id =>
  build: build,
  harvest: harvest,
  moveto: moveto,
  pickup: pickup,
  repair: repair,
  transfer: transfer,
  'upgrade-controller': upgradeController,
  withdraw: withdraw
}