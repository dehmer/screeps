const {K} = require('combinators')

const handle = (handlers, errors) => result => {
  switch(result) {
    case OK: return true
    default: {
      if(!handlers) return false
      else return K(handlers[errors[result]])(handler => handler && handler())
    }
  }
}

Creep.prototype.__build = function(target, handlers) {
  const ERRORS = []
  ERRORS[ERR_NOT_OWNER]            = 'ERR_NOT_OWNER'
  ERRORS[ERR_BUSY]                 = 'ERR_BUSY'
  ERRORS[ERR_NOT_ENOUGH_RESOURCES] = 'ERR_NOT_ENOUGH_RESOURCES'
  ERRORS[ERR_INVALID_TARGET]       = 'ERR_INVALID_TARGET'
  ERRORS[ERR_NOT_IN_RANGE]         = 'ERR_NOT_IN_RANGE'
  ERRORS[ERR_NO_BODYPART]          = 'ERR_NO_BODYPART'
  ERRORS[ERR_RCL_NOT_ENOUGH]       = 'ERR_RCL_NOT_ENOUGH'

  const result = this.build(target)
  if(!handle(handlers, ERRORS)(result)) {
    console.log(`[${this.name}] build -> ${ERRORS[result]}`)
  }
}

Creep.prototype.__harvest = function(target, handlers) {
  const ERRORS = []
  ERRORS[ERR_NOT_OWNER]            = 'ERR_NOT_OWNER'
  ERRORS[ERR_BUSY]                 = 'ERR_BUSY'
  ERRORS[ERR_NOT_FOUND]            = 'ERR_NOT_FOUND'
  ERRORS[ERR_NOT_ENOUGH_RESOURCES] = 'ERR_NOT_ENOUGH_RESOURCES'
  ERRORS[ERR_INVALID_TARGET]       = 'ERR_INVALID_TARGET'
  ERRORS[ERR_NOT_IN_RANGE]         = 'ERR_NOT_IN_RANGE'
  ERRORS[ERR_NO_BODYPART]          = 'ERR_NO_BODYPART'

  const result = this.harvest(target)
  if(!handle(handlers, ERRORS)(result)) {
    console.log(`[${this.name}] harvest -> ${ERRORS[result]}`)
  }
}

Creep.prototype.__moveTo = function(target, opts, handlers) {
  // Adjust args in case optional `opts` were left out:
  if(arguments.length === 2) handlers = arguments[1]

  const ERRORS = []
  ERRORS[ERR_NOT_OWNER]      = 'ERR_NOT_OWNER'
  ERRORS[ERR_NO_PATH]        = 'ERR_NO_PATH'
  ERRORS[ERR_BUSY]           = 'ERR_BUSY'
  ERRORS[ERR_INVALID_TARGET] = 'ERR_INVALID_TARGET'
  ERRORS[ERR_TIRED]          = 'ERR_TIRED'
  ERRORS[ERR_NO_BODYPART]    = 'ERR_NO_BODYPART'

  const result = this.moveTo(target, opts)
  if(!handle(handlers, ERRORS)(result)) {
    console.log(`[${this.name}] moveTo -> ${ERRORS[result]}: task=${JSON.stringify(this.memory.task)}`)
  }
}

Creep.prototype.__pickup = function(target, handlers) {
  const ERRORS = []
  ERRORS[ERR_NOT_OWNER]      = 'ERR_NOT_OWNER'
  ERRORS[ERR_BUSY]           = 'ERR_BUSY'
  ERRORS[ERR_INVALID_TARGET] = 'ERR_INVALID_TARGET'
  ERRORS[ERR_FULL]           = 'ERR_FULL'
  ERRORS[ERR_NOT_IN_RANGE]   = 'ERR_NOT_IN_RANGE'

  const result = this.pickup(target)
  if(!handle(handlers, ERRORS)(result)) {
    console.log(`[${this.name}] pickup -> ${ERRORS[result]}`)
  }
}

Creep.prototype.__repair = function(target, handlers) {
  const ERRORS = []
  ERRORS[ERR_NOT_OWNER]            = 'ERR_NOT_OWNER'
  ERRORS[ERR_BUSY]                 = 'ERR_BUSY'
  ERRORS[ERR_NOT_ENOUGH_RESOURCES] = 'ERR_NOT_ENOUGH_RESOURCES'
  ERRORS[ERR_INVALID_TARGET]       = 'ERR_INVALID_TARGET'
  ERRORS[ERR_NOT_IN_RANGE]         = 'ERR_NOT_IN_RANGE'
  ERRORS[ERR_NO_BODYPART]          = 'ERR_NO_BODYPART'

  const result = this.repair(target)
  if(!handle(handlers, ERRORS)(result)) {
    console.log(`[${this.name}] repair -> ${ERRORS[result]}`)
  }
}

Creep.prototype.__transfer = function(target, resourceType, amount, handlers) {
  const ERRORS = []
  ERRORS[ERR_NOT_OWNER]            = 'ERR_NOT_OWNER'
  ERRORS[ERR_BUSY]                 = 'ERR_BUSY'
  ERRORS[ERR_NOT_ENOUGH_RESOURCES] = 'ERR_NOT_ENOUGH_RESOURCES'
  ERRORS[ERR_INVALID_TARGET]       = 'ERR_INVALID_TARGET'
  ERRORS[ERR_FULL]                 = 'ERR_FULL'
  ERRORS[ERR_NOT_IN_RANGE]         = 'ERR_NOT_IN_RANGE'
  ERRORS[ERR_INVALID_ARGS]         = 'ERR_INVALID_ARGS'

  const result = this.transfer(target, resourceType, amount)
  if(!handle(handlers, ERRORS)(result)) {
    console.log(`[${this.name}] transfer -> ${ERRORS[result]}`)
  }
}

Creep.prototype.__upgradeController = function(target, handlers) {
  const ERRORS = []
  ERRORS[ERR_NOT_OWNER]            = 'ERR_NOT_OWNER'
  ERRORS[ERR_BUSY]                 = 'ERR_BUSY'
  ERRORS[ERR_NOT_ENOUGH_RESOURCES] = 'ERR_NOT_ENOUGH_RESOURCES'
  ERRORS[ERR_INVALID_TARGET]       = 'ERR_INVALID_TARGET'
  ERRORS[ERR_NOT_IN_RANGE]         = 'ERR_NOT_IN_RANGE'
  ERRORS[ERR_NO_BODYPART]          = 'ERR_NO_BODYPART'

  const result = this.upgradeController(target)
  if(!handle(handlers, ERRORS)(result)) {
    console.log(`[${this.name}] upgradeController -> ${ERRORS[result]}`)
  }
}

Creep.prototype.__withdraw = function(target, resourceType, amount, handlers) {
  const ERRORS = []
  ERRORS[ERR_NOT_OWNER]            = 'ERR_NOT_OWNER'
  ERRORS[ERR_BUSY]                 = 'ERR_BUSY'
  ERRORS[ERR_NOT_ENOUGH_RESOURCES] = 'ERR_NOT_ENOUGH_RESOURCES'
  ERRORS[ERR_INVALID_TARGET]       = 'ERR_INVALID_TARGET'
  ERRORS[ERR_FULL]                 = 'ERR_FULL'
  ERRORS[ERR_NOT_IN_RANGE]         = 'ERR_NOT_IN_RANGE'
  ERRORS[ERR_INVALID_ARGS]         = 'ERR_INVALID_ARGS'

  const result = this.withdraw(target, resourceType, amount)
  if(!handle(handlers, ERRORS)(result)) {
    console.log(`[${this.name}] withdraw -> ${ERRORS[result]}`)
  }
}