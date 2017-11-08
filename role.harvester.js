const {transfer, harvest} = require('commands')
const {isFullyCharged, needsEnergy} = require('resource')
const {sources, spawn, depletedStructures} = require('room')

const run = creep => {
    creep.memory.targetId = creep.memory.targetId || sources(creep)[1].id
    const target = Game.getObjectById(creep.memory.targetId)
    harvest(creep, target)
}

module.exports = {
    run: run
}