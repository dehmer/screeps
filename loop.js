const {K} = require('combinators')
const {assignTask, clearTask, loadTask, randomObject} = require('task')

const harvest = require('task.harvest')
const transfer = require('task.transfer')
const build = require('task.build')
const repair = require('task.repair')
const upgradeController = require('task.upgrade-controller')
const withdraw = require('task.withdraw')
const pickup = require('task.pickup')
const moveto = require('task.moveto')

const tasks = {}
tasks[harvest.id] = harvest
tasks[transfer.id] = transfer
tasks[build.id] = build
tasks[repair.id] = repair
tasks[upgradeController.id] = upgradeController
tasks[withdraw.id] = withdraw
tasks[pickup.id] = pickup
tasks[moveto.id] = moveto

const loop = taskFactory => creep => {

  const task = loadTask(creep) || taskFactory(creep)
  if(!task) return

  assignTask(creep, task)
  K(tasks[task.id])(definition => {
    if(definition) definition.invoke(task)(creep)
    else console.log('unsupported task', task.id)
  })
}

module.exports = loop