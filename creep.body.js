const BODY_WORKER = [MOVE, MOVE, WORK, CARRY]
const BODY_HARVESTER = [WORK, WORK, MOVE]

const BODY_CARRIER = [
  MOVE, MOVE, MOVE, MOVE,  // x 4
  WORK, WORK,              // x 2
  CARRY, CARRY             // x 2
]

const bodyCosts = body => _.reduce(body, (acc, x) => acc + BODYPART_COST[x], 0)
const bodySequence = (n, body) => _.flatten(_.times(n, _.constant(body)))
const body = creep => _.map(creep.body, body => body.type)

module.exports = {
  BODY_WORKER,
  BODY_HARVESTER,
  BODY_CARRIER,

  bodyCosts: bodyCosts,
  bodySequence: bodySequence,
  body: body
}