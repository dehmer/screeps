const {K} = require('combinators')
const tasks = require('tasks')
const {assignTask, clearTask, currentTask} = require('tasks')

const loop = nextTask => creep => {
  const task = currentTask(creep) || nextTask(creep)
  if(task) assignTask(creep, task)
  else return

  if(tasks[task.id]) return tasks[task.id](task)(creep)
  else {
    console.log('unsupported task', task.id)
    clearTask(creep)
  }
}

module.exports = loop