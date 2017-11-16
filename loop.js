const {K} = require('combinators')
const {assignTask, clearTask, loadTask, randomObject} = require('task')

const SUPPORTED_TASKS = [
  'harvest', 'transfer', 'build', 'repair',
  'upgrade-controller', 'withdraw', 'pickup',
  'moveto', 'patrol'
]

const tasks = _(SUPPORTED_TASKS)
  .map(task => require(`task.${task}`))
  .reduce((acc, task) => K(acc)(acc => acc[task.id] = task), {})

const loop = taskFactory => creep => {

  const task = loadTask(creep) || taskFactory(creep)
  if(!task) return

  assignTask(creep, task)
  K(tasks[task.id])(definition => {
    if(definition) {
      definition.invoke(task)(creep)
    }
    else {
      console.log('unsupported task', task.id)
      clearTask(creep)
    }
  })
}

module.exports = loop