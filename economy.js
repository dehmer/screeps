const {bodyCosts} = require('creep.body')
const {findDecayingStructures} = require('room')
const body = creep => _(creep.body).map(body => body.type).value()
const CREEP_TTL = 1500

const economy = room => {

  // {
  //   // Costs: Spawning.
  //   // Creep TTL 1500 ticks
  //   const costsPerRoom = _(Game.creeps)
  //     .filter(c => c.memory.home === room.name)
  //     .map(c => bodyCosts(body(c)))
  //     .sum()

  //   if(costsPerRoom > 0) console.log(room.name,
  //     'costs/room', costsPerRoom,
  //     'costs/tick', (costsPerRoom/CREEP_TTL))
  // }

  {
    // Costs: Repair (decaying structures)
    // Contrary to fortification (wall, ramparts),
    // repair only includes structures for which we
    // can maintain a certain level of availability
    // for use (road, container).

    // Container decay (owned room):   5000 hits/ 500 ticks =>  10 hits/tick
    // Container decay (unowned room): 5000 hits/ 100 ticks =>  50 hits/tick

    // NOTE: Roads decay by 1 tick/body part with each creep step.
    // NOTE: Depending on underlying tile (plain/swamp),
    //       roads have different max hits and building costs.
    // Road decay (plain):              100 hits/1000 ticks => 0.1 hits/tick
    // Road decay (swamp):              500 hits/1000 ticks => 0.5 hits/tick

    // const structures = findDecayingStructures(room)
    // if(!structures.length) return

    // // structures.forEach(s => console.log(s))
    // console.log(room.name, structures.length)
  }
}

module.exports = economy