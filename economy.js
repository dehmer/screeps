const {bodyCosts, body} = require('creep.body')
const {findDecayingStructures} = require('room')

const isOwnedRoom = room =>
  room.controller &&
  room.controller.owner &&
  room.controller.owner.username === 'dehmer69'

const economy = room => {
  if(!isOwnedRoom(room)) return

  // {
  //   // Costs: Spawning.
  //   // Creep TTL (CREEP_LIFE_TIME): 1500 ticks
  //   const costsPerRoom = _(Game.creeps)
  //     .filter(c => c.memory.home === room.name)
  //     .map(c => bodyCosts(body(c)))
  //     .sum()

  //   if(costsPerRoom > 0) console.log(room.name,
  //     'costs/room', costsPerRoom,
  //     'costs/tick', (costsPerRoom / CREEP_LIFE_TIME))
  // }

  {
    // Costs: Repair (decaying structures)
    // Contrary to fortification (wall, ramparts),
    // repair only includes structures for which we
    // can maintain a certain level of availability
    // for use (road, container).

    // One WORK body part repairs with 20 hits/tick
    // using 0.1 engery/hit => 2 energy/tick

    // Container decay (owned room):   5000 hits/ 500 ticks =>  10 hits/tick
    // Container decay (unowned room): 5000 hits/ 100 ticks =>  50 hits/tick

    // NOTE: Roads decay by 1 tick/body part with each creep step.
    // NOTE: Depending on underlying tile (plain/swamp),
    //       roads have different max hits and building costs.
    // Road decay (plain):              100 hits/1000 ticks => 0.1 hits/tick
    // Road decay (swamp):              500 hits/1000 ticks => 0.5 hits/tick

    const isStructureType = type => target => target.structureType === type
    const isTower = isStructureType(STRUCTURE_TOWER)
    const isContainer = isStructureType(STRUCTURE_CONTAINER)
    const isRoad = isStructureType(STRUCTURE_ROAD)
    const isWall = isStructureType(STRUCTURE_WALL)
    const isRampart = isStructureType(STRUCTURE_RAMPART)

    /**
     * Calculate decay (hits/tick) for given structure.
     * @param {object} s
     */
    const decay = s => {
      if(isContainer(s) && isOwnedRoom(s.room)) return 10
      else if(isContainer(s) && !isOwnedRoom(s.room)) return 50
      else if(isRoad(s) && s.hitsMax === 5000) return 0.1
      else if(isRoad(s) && s.hitsMax === 25000) return 0.5
    }

    /**
     * (0,1]: 0 - destroyed, 1 - healthy
     * @param {object} structure
     */
    const health = structure => structure.hits / structure.hitsMax

    // const totalDecay = _(findDecayingStructures(room))
    //   .map(s => decay(s))
    //   .sum()

    // console.log(room.name, Math.ceil(totalDecay), 'hits/tick')

    // { // Walls (level of repair).
    //   const structures = room.find(FIND_STRUCTURES, {filter: isWall})
    //   const repair = _(structures)
    //     .map(w => w.hits / w.hitsMax)
    //     .sum() / structures.length

    //   console.log(room.name, 'walls', structures.length, 'repair', (repair * 100), '%')
    // }

    // { // Ramparts (level of repair).
    //   const structures = room.find(FIND_STRUCTURES, {filter: isRampart})
    //   const repair = _(structures)
    //     .map(w => w.hits / w.hitsMax)
    //     .sum() / structures.length

    //   // Ramparts decay rate: RAMPART_DECAY_AMOUNT / RAMPART_DECAY_TIME
    //   // 3 hits/tick.
    //   // 1 point energy repairs 100 hits (REPAIR_POWER).
    //   const decayTotal =
    //     structures.length * RAMPART_DECAY_AMOUNT / RAMPART_DECAY_TIME

    //   // BTW: Hits max depends on controller level (RAMPART_HITS_MAX).
    //   const hitsMax = RAMPART_HITS_MAX[room.controller.level]

    //   console.log(room.name, 'ramparts', structures.length,
    //     'repair', (repair * 100), '%',
    //     'decay', decayTotal, 'hits/tick',
    //     'hits (max)', hitsMax,
    //     'upgrade costs (1%)', (hitsMax / 100 / REPAIR_POWER)
    //   )
    // }

    // { // Roads (level of repair).
    //   const structures = room.find(FIND_STRUCTURES, {filter: isRoad})
    //   const repair = _(structures)
    //     .map(w => w.hits / w.hitsMax)
    //     .sum() / structures.length

    //   // Roads decay rate: ROAD_DECAY_AMOUNT / ROAD_DECAY_TIME
    //   // 0.1 hits/tick

    //   // Hits max depends on terrain:
    //   // plain: 5,000 (ROAD_HITS)
    //   // swamp: 25,000 (ROAD_HITS * CONSTRUCTION_COST_ROAD_SWAMP_RATIO [probably])

    //   console.log(room.name, 'roads', structures.length, 'repair', (repair * 100), '%')
    // }



  }
}

module.exports = economy