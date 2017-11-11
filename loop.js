const {assignTask, clearTask, loadTask, randomObject} = require('task')

const harvest = require('task.harvest')
const transfer = require('task.transfer')
const build = require('task.build')
const repair = require('task.repair')
const upgradeController = require('task.upgrade-controller')
const withdraw = require('task.withdraw')
const pickup = require('task.pickup')
const moveto = require('task.moveto')

const loop = taskFactory => creep => {

  const task = loadTask(creep) || taskFactory(creep)
  if(!task) return

  assignTask(creep, task)

  switch(task.id) {
    case 'harvest': return harvest(task.targetId)(creep)
    case 'transfer': return transfer(task.targetId, task.resource)(creep)
    case 'build': return build(task.targetId)(creep)
    case 'repair': return repair(task.targetId)(creep)
    case 'upgrade-controller': return upgradeController()(creep)
    case 'withdraw': return withdraw(task.targetId, task.resource)(creep)
    case 'pickup': return pickup(task.targetId)(creep)
    case 'moveto': return moveto(task.targetId)(creep)
    default: console.log('unsupported task', task.id)
  }
}

module.exports = loop