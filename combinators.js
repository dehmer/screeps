const K = value => func => { func(value); return value }

/**
 * Applies given argument to all candidates in options and
 * returns the first result which is defined (not null).
 *
 * @param {function: object -> object} options list of functions accepting one argument
 * @param {object} arg Agument to apply to candidates
 */
const coalesce = options => arg => {
  if(!(options instanceof Array)) console.log('options not array')

  for(i in options) {
      const candidate = options[i](arg)
      if(candidate) return candidate
  }
}

const HEX_CHAR = '0123456789abcef'
const randomHex = () => HEX_CHAR[Math.floor(Math.random() * HEX_CHAR.length)]
const id = () => _
    .range(15)
    .map(_ => randomHex())
    .reduce((acc, x) => acc + x, '')

module.exports = {
  K: K,
  randomObject: targets => targets[Math.floor(Math.random() * targets.length)],
  coalesce: coalesce,
  id: id
}