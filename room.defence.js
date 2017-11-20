const {coalesce, randomObject} = require('combinators')
const {findTowers} = require('room')

const run = tower => {

    // TODO: lower DEFCON when attacked (on decreasing hit count)

    const hostileCreep = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    if(hostileCreep) {
        const result = tower.attack(hostileCreep)
        switch(result) {
            case OK: break
            case ERR_NOT_ENOUGH_RESOURCES: return console.log('[attack] ERR_NOT_ENOUGH_RESOURCES')
            case ERR_INVALID_TARGET: return console.log('[attack] ERR_INVALID_TARGET')
            case ERR_RCL_NOT_ENOUGH: return console.log('[attack] ERR_RCL_NOT_ENOUGH')
        }
    }
}

const defendRoom = room => {
  _.forEach(findTowers(room), run)
}

module.exports = {
  defendRoom: defendRoom
}