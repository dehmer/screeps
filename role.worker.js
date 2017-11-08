const {K} = require('combinators')
const {isFullyCharged} = require('resource')
const {repair, harvest} = require('commands')
const {sources, containers} = require('room')

const progress = target => target.progress / target.progressTotal
const damage = target => target.hits / target.hitsMax

const constructionSites = room => {
  const targets = room.find(FIND_CONSTRUCTION_SITES)

  return _.
    reduce(targets, (acc, value) => K(acc)(acc => acc.push(value)), []).
    sort((a, b) => progress(a) < progress(b))
}

// TODO: repair critical infrastructure first (e.g. containers)
const damagedStructures = room => {
  const targets = room.find(FIND_STRUCTURES, {
    filter: object => object.hits < object.hitsMax
  });

  return targets.sort((a,b) => a.hits - b.hits)
}

function run(creep) {

  // return creep.moveTo(Game.flags['staging'])

  // const sites = constructionSites(creep.room)
  // console.log('# sites: ' + sites.length)
  // _.forEach(sites, site => {
  //   console.log('progress: ' + (site.progress / site.progressTotal))
  // })

  if(isFullyCharged(creep)) {
    // TODO: work must be assigned globally
    const targets = damagedStructures(creep.room)
    // Workers steal repairs from each other :-(
    // TODO: repair one target until done or empty, if still full search near target
    if(targets.length > 0) repair(creep, targets[0])
  }
  else harvest(creep, sources(creep)[1])
}


module.exports = {
  run: run
}