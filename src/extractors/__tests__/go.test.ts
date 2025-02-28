import { extractFromGoMod, extractFromGoSum } from '../go'
import { loadFixture, setupMocks, verifyNoDuplicates } from './test-helpers'

describe('Go Extractors', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractFromGoSum', () => {
    it('should extract module names from go.sum', () => {
      const mockContent = loadFixture('go.sum')
      const words = extractFromGoSum(mockContent)

      expect(words).toContain('user')
      expect(words).toContain('repo')
      expect(words).toContain('another')
      expect(words).toContain('module')
      expect(words).toContain('github.com/user/repo')
      expect(words).toContain('github.com/another/module')
      expect(words).toContain('golang.org/x/text')
      expect(words).toContain('golang.org/x/sync')

      verifyNoDuplicates(words)
    })
  })

  describe('extractFromGoMod', () => {
    it('should extract module names from go.mod', () => {
      const mockContent = loadFixture('go.mod')
      const words = extractFromGoMod(mockContent)

      expect(words).toContain('user')
      expect(words).toContain('project')
      expect(words).toContain('github.com/user/project')
      expect(words).toContain('github.com/user/repo')
      expect(words).toContain('github.com/another/module')
      expect(words).toContain('golang.org/x/text')

      verifyNoDuplicates(words)
    })
  })
})
