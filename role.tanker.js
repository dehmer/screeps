const builder = require('role.builder')
const {transfer, harvest} = require('commands')
const {isFullyCharged, needsEnergy} = require('resource')
const {sources, spawn, depletedStructures} = require('room')

const target = id => Game.getObjectById(id)
const randomTarget = targets => targets[Math.floor(Math.random() * targets.length)]

const taskHarvest = targetId => creep => {
    creep.memory.task = {id: 'harvest', targetId: targetId}
    harvest(creep, target(targetId))
    if(isFullyCharged(creep)) delete creep.memory.task
}

const taskTransfer = (targetId, resource) => creep => {
    creep.memory.task = {id: 'transfer', targetId: targetId, resource: resource}
    console.log('transfering...')
    const ok = transfer(creep, target(targetId), resource)
    if(!ok || (!creep.carry[resource])) delete creep.memory.task
}

const assignTask = creep => {
    if(isFullyCharged(creep)) {
        // TODO: claim energy transfer task
        // TODO: what should we do if no energy is needed?
        const targets = depletedStructures(creep)
        if(targets.length > 0) return taskTransfer(targets[0].id, RESOURCE_ENERGY)
    }
    else {
        const targets = sources(creep)
        if(targets.length > 0) return taskHarvest(randomTarget(targets).id)
    }
}

/**
 * Current task from memory or new task.
 */
const task = creep => {
    console.log(creep, JSON.stringify(creep.memory.task))
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