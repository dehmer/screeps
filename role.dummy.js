const {findPerimeter} = require('room')
const ROLE = 'dummy'

const nextTask = creep => {
    const wayPoints = findPerimeter(creep.room)
    return { id: 'patrol', flagName: wayPoints[0] }
}

module.exports = {
  name: ROLE,
  nextTask: nextTask
}