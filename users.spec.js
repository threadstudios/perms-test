const { getUser } = require('./data')
const { getProject } = require('./project')
const projects = require('./data/projects.json')

describe('tiering-permissions', () => {
  describe('First User', () => {
    const user = getUser(1)

    it('should have a basic tier', () => {
      expect(user.organisation.tier).toBe('basic')
    })

    it('should have the canSeeProjects permissions', () => {
      expect(user.permissions).toEqual(['canSeeProjects'])
    })

    it('should not be able to see cap scores', () => {
      expect(getProject(user, 401).capScore).toBeUndefined()
    })

    it('should have a granular permission on the special project', () => {
      expect(getProject(user, 402)).toEqual({
        id: 402,
        name: 'Project B',
      })
    })
  })

  describe('Second User', () => {
    const user = getUser(2)
    it('should have an elite tier', () => {
      expect(user.organisation.tier).toBe('elite')
    })

    it('should have the canSeeProjects and canSeeCapScores permissions', () => {
      expect(user.permissions).toEqual(['canSeeProjects', 'canSeeCapScores'])
    })

    it('should not be able to see the special project', () => {
      expect(getProject(user, 402)).toEqual({})
    })

    it('should be able to see cap scores', () => {
      expect(getProject(user, 401).capScore).not.toBeUndefined()
    })
  })

  it('should give users permissions base on tier', () => {
    const basicUser = getUser(1)
    const topTierUser = getUser(2)
    const adminUser = getUser(3)

    expect(basicUser.organisation.tier).toBe('basic')
    expect(basicUser.permissions).toEqual(['canSeeProjects'])

    expect(topTierUser.organisation.tier).toBe('elite')
    expect(topTierUser.permissions).toEqual([
      'canSeeProjects',
      'canSeeCapScores',
    ])
  })
})
