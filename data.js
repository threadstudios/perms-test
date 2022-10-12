const users = require('./data/users.json')
const organisations = require('./data/organisations.json')
const tiers = require('./data/tiers.json')
const roles = require('./data/roles.json')
const projects = require('./data/projects.json')
const granularPermissions = require('./data/granular_permissions.json')

function getUser(id) {
  const user = users.find((u) => u.id === id)
  if (!user) {
    throw new Error('Cannot find user')
  }
  const organisation = organisations.find((o) => o.id === user.organisation)
  const tier = tiers.find((t) => t.key === organisation.tier)

  const rolePermissions = user.roles.reduce((acc, ur) => {
    const role = roles.find((r) => r.key === ur)
    acc.push(...role.permissions)
    return acc
  }, [])

  const entityPermissions = granularPermissions.filter(
    (g) => g.entityFromId === user.id,
  )

  return {
    ...user,
    organisation,
    permissions: [...tier.permissions, ...rolePermissions],
    entityPermissions: entityPermissions.map((ep) => {
      return {
        on: ep.entityToId,
        permission: ep.permission,
      }
    }),
  }
}

module.exports = {
  getUser,
}
