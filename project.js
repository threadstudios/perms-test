const projects = require('./data/projects.json')

function sanitiseProject(project, permissions) {
  if (
    !permissions.includes('canSeeProjects') ||
    (project.status === 'NotYetVisible' &&
      !permissions.includes('canSeeProject'))
  ) {
    return {}
  }

  const cleanProject = {
    id: project.id,
    name: project.name,
  }

  if (permissions.includes('canSeeCapScores')) {
    cleanProject.capScore = project.capScore
  }

  return cleanProject
}

function getProject(completeUser, projectId) {
  const project = projects.find((p) => p.id === projectId)
  if (!project) {
    throw new Error('Cannot find project')
  }

  const projectPermission = completeUser.entityPermissions
    .filter((ep) => ep.on === project.id)
    .reduce((acc, perm) => {
      acc.push(perm.permission)
      return acc
    }, [])

  return sanitiseProject(project, [
    ...completeUser.permissions,
    ...projectPermission,
  ])
}

module.exports = {
  getProject,
}
