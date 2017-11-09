const {transfer, harvest, repair} = require('commands')

const target = id => Game.getObjectById(id)
const randomTarget = targets => targets[Math.floor(Math.random() * targets.length)]

const resetTask = (creep, reason) => {
    if(reason) console.log('reset task: ' + reason)
    delete creep.memory.task
}

const sources = room => room.find(FIND_SOURCES)

const energySinks = room => {
    return room.find(FIND_STRUCTURES, {
        filter: target => target.energy < target.energyCapacity
    })
}

const damagedStructures = room => {
    const targets = room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
    });

    return targets.sort((a,b) => a.hits - b.hits)
}

const taskHarvest = targetId => creep => {
    creep.memory.task = {id: 'harvest', targetId: targetId}
    harvest(creep, target(targetId))
    if(creep.carry.energy === creep.carryCapacity) delete creep.memory.task
}

const taskTransfer = (targetId, resource) => creep => {
    creep.memory.task = {id: 'transfer', targetId: targetId, resource: resource}
    const ok = transfer(creep, target(targetId), resource)
    if(!ok || !creep.carry[resource]) delete creep.memory.task
}

const taskRepair = targetId => creep => {
    creep.memory.task = {id: 'repair', targetId: targetId}

    const object = target(targetId)

    const ok = repair(creep, object)
    if(!ok) resetTask(creep, 'repair failed')
    if(!creep.carry[RESOURCE_ENERGY]) resetTask(creep)
    if(object.hits === object.hitsMax) resetTask(creep)
}

const assignTask = creep => {

    if(creep.carry.energy) {
        // TODO: claim energy transfer task
        // TODO: what should we do if no energy is needed?
        const sinks = energySinks(creep.room)
        if(sinks.length > 0) return taskTransfer(randomTarget(sinks).id, RESOURCE_ENERGY)

        if(Math.random() < 0.1) {
            const damaged = damagedStructures(creep.room)
            if(damaged.length > 0) return taskRepair(randomTarget(damaged).id)
        }

        return taskTransfer(creep.room.storage.id, RESOURCE_ENERGY)
    }

    const targets = sources(creep.room)
    if(targets.length > 0) return taskHarvest(randomTarget(targets).id)
    else console.log('no energy available!')
}

/**
 * Current task from memory or new task.
 */
const task = creep => {
    const targetId = () => creep.memory.task.targetId
    const resource = () => creep.memory.task.resource

    if(creep.memory.task) {
        switch(creep.memory.task.id) {
            case 'harvest':  return taskHarvest(targetId())
            case 'transfer': return taskTransfer(targetId(), resource())
            case 'repair'  : return taskRepair(targetId())
        }
    }
    else return assignTask(creep)
}

const run = creep => {
    const assignedTask = task(creep)
    if(assignedTask) assignedTask(creep)
}

module.exports = {
    run: run
}