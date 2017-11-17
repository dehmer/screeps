/**
 * Applies given argument to all candidates in options and
 * returns the first result which is defined (not null).
 *
 * @param {function: object -> object} options list of functions accepting one argument
 * @param {object} arg Agument to apply to candidates
 */
const coalesce = options => arg => {
  for(i in options) {
      const candidate = options[i](arg)
      if(candidate) return candidate
  }
}

module.exports = {
  K: value => func => { func(value); return value },
  randomObject: targets => targets[Math.floor(Math.random() * targets.length)],
  coalesce: coalesce
}