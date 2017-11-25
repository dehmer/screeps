const BODY_WORKER = [MOVE, MOVE, WORK, CARRY]
const BODY_HARVESTER = [WORK, WORK, MOVE]
const BODY_CARRIER = [
  MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, // x 6
  WORK, WORK, WORK,                   // x 3
  CARRY, CARRY, CARRY                 // x 3
]

const bodyCosts = body => _.reduce(body, (acc, x) => acc + BODYPART_COST[x], 0)
const bodySequence = (n, body) => _.flatten(_.times(n, _.constant(body)))
const name = role => `${role}-${Game.time}`

module.exports = {
  BODY_WORKER,
  BODY_HARVESTER,
  BODY_CARRIER,

  bodyCosts: bodyCosts,
  bodySequence: bodySequence,
  name: name
}