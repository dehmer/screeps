const builder = require('role.builder')
const {transfer, harvest} = require('commands')
const {isFullyCharged, needsEnergy} = require('resource')
const {sources, spawn, depletedStructures} = require('room')

const energySinks = room => {
    return room.find(FIND_STRUCTURES, {
        filter: target => target.energy < target.energyCapacity
    })
}

const target = id => Game.getObjectById(id)
const randomTarget = targets => targets[Math.floor(Math.random() * targets.length)]
const firstTarget = targets => targets[0]

const taskHarvest = targetId => creep => {
    creep.memory.task = {id: 'harvest', targetId: targetId}
    harvest(creep, target(targetId))
    if(isFullyCharged(creep)) delete creep.memory.task
}

const taskTransfer = (targetId, resource) => creep => {
    creep.memory.task = {id: 'transfer', targetId: targetId, resource: resource}
    const ok = transfer(creep, target(targetId), resource)
    if(!ok || !creep.carry[resource]) delete creep.memory.task
}

const assignTask = creep => {
    if(creep.carry.energy) {
        // TODO: claim energy transfer task
        // TODO: what should we do if no energy is needed?
        const targets = energySinks(creep.room)
        if(target.length > 0) return taskTransfer(randomTarget(targets).id, RESOURCE_ENERGY)
        else console.log('no energy needed!')
    }
    else {
        const targets = sources(creep)
        if(targets.length > 0) return taskHarvest(randomTarget(targets).id)
        else console.log('no energy available!')
    }
}

/**
 * Current task from memory or new task.
 */
const task = creep => {
    // console.log(creep, JSON.stringify(creep.memory.task))
    const targetId = () => creep.memory.task.targetId
    const resource = () => creep.memory.task.resource

    if(creep.memory.task) {
        switch(creep.memory.task.id) {
            case 'harvest':  return taskHarvest(targetId())
            case 'transfer': return taskTransfer(targetId(), resource())
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