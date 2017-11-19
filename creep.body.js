const BODY_WORKER = [MOVE, MOVE, WORK, CARRY]
const BODY_HARVESTER = [WORK, WORK, MOVE]

const bodyCosts = body => _.reduce(body, (acc, x) => acc + BODYPART_COST[x], 0)
const bodySequence = (n, body) => _.flatten(_.times(n, _.constant(body)))
const name = role => `${role}-${Game.time}`

module.exports = {
  BODY_WORKER,
  BODY_HARVESTER,

  bodyCosts: bodyCosts,
  bodySequence: bodySequence,
  name: name
}