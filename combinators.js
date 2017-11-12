module.exports = {
  K: value => func => { func(value); return value },
  randomObject: targets => targets[Math.floor(Math.random() * targets.length)],
}