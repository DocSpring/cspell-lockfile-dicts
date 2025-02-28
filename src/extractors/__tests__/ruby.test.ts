import { extractFromGemfileLock } from '../ruby'
import { loadFixture, setupMocks, verifyWords } from './test-helpers'

describe('Ruby Extractors', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractFromGemfileLock', () => {
    it('should extract gem names from Gemfile.lock', () => {
      const mockContent = loadFixture('Gemfile.lock')
      const words = extractFromGemfileLock(mockContent)

      // No version strings
      expect(words).not.toContain('0.1.0')
      expect(words).not.toContain('1.0.0')
      expect(words).not.toContain('010')
      expect(words).not.toContain('100')
      expect(words).not.toContain('200')

      // Top-level gems
      expect(words).toContain('gem-a')
      expect(words).toContain('gem-b')
      expect(words).toContain('gem-c')
      expect(words).toContain('gem-e')
      expect(words).toContain('alloneword')

      // Dependency gems
      expect(words).toContain('gem-d')
      expect(words).toContain('gem-f')
      expect(words).toContain('allonewordagain')

      // Git metadata
      expect(words).toContain('awesomeuser')
      expect(words).toContain('awesomerepo')
      expect(words).not.toContain('awesomebranch')
      expect(words).not.toContain('awesomerevision')

      verifyWords(words)
    })
  })
})
