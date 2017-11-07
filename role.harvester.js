//const roleBuilder = require('role.builder')
const {transfer, harvest} = require('commands')
const {isFullyCharged, needsEnergy} = require('resource')
const {sources, spawn, depletedStructures} = require('room')
const {K} = require('combinators')

const run = creep => {
    if(isFullyCharged(creep)) {
        targets = depletedStructures(creep)
        if(targets.length > 0) transfer(creep, targets[0], RESOURCE_ENERGY)
//        else roleBuilder.run(creep)
    }
    else harvest(creep, sources(creep)[0])
}

module.exports = {
    run: run
}