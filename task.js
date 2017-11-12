const assignTask = (creep, task) => { creep.memory.task = task; return task }
const clearTask = (creep, reason) => {
  if(reason) console.log('clearing task. ' + reason)
  delete creep.memory.task
}

const loadTask = creep => creep.memory.task

const firstTaskOf = options => creep => {
  for(i in options) {
    const task = options[i](creep)
    if(task) return task
  }
}

const object = id => Game.getObjectById(id)

module.exports = {
  assignTask: assignTask,
  clearTask: clearTask,
  loadTask: loadTask,
  firstTaskOf: firstTaskOf,
  object: object
}