import { extractFromYarnLock } from '../yarn'
import { loadFixture, setupMocks, verifyNoDuplicates } from './test-helpers'

describe('Yarn Extractors', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractFromYarnLock', () => {
    it('should extract package names from yarn.lock', () => {
      const mockContent = loadFixture('yarn.lock')
      const words = extractFromYarnLock(mockContent)

      expect(words).toContain('package-a')
      expect(words).toContain('scope')
      expect(words).toContain('package-b')

      // Test for @cspell/dict-monkeyc
      expect(words).toContain('cspell')
      expect(words).toContain('dict-monkeyc')
      expect(words).toContain('@cspell/dict-monkeyc')

      verifyNoDuplicates(words)
    })
  })
})
