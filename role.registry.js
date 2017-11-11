const roles = []

module.exports = {
  push: role => roles.push(role),
  role: name => _.find(roles, role => role.name === name)
}