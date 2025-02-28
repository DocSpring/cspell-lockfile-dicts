import { extractFromGemfileLock } from '../ruby'
import { loadFixture, setupMocks, verifyNoDuplicates } from './test-helpers'

describe('Ruby Extractors', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractFromGemfileLock', () => {
    it('should extract gem names from Gemfile.lock', () => {
      const mockContent = loadFixture('Gemfile.lock')
      const words = extractFromGemfileLock(mockContent)

      expect(words).toContain('gem-a')
      expect(words).toContain('gem-b')
      expect(words).toContain('gem-c')
      expect(words).toContain('user')
      expect(words).toContain('repo')
      expect(words).toContain('main')

      verifyNoDuplicates(words)
    })
  })
})
