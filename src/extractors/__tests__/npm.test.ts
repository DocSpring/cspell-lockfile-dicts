import { extractFromPackageLock } from '../npm'
import { loadFixture, setupMocks, verifyNoDuplicates } from './test-helpers'

describe('NPM Extractors', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractFromPackageLock', () => {
    it('should extract package names from package-lock.json (lockfileVersion 1-2)', () => {
      const mockContent = loadFixture('package-lock-v2.json')
      const words = extractFromPackageLock(mockContent, { debug: false })

      expect(words).toContain('package-a')
      expect(words).toContain('scope')
      expect(words).toContain('package-b')
      expect(words).toContain('@scope/package-b')

      // Test for @cspell/dict-monkeyc
      expect(words).toContain('cspell')
      expect(words).toContain('dict-monkeyc')
      expect(words).toContain('@cspell/dict-monkeyc')

      verifyNoDuplicates(words)
    })

    it('should extract package names from package-lock.json (lockfileVersion 3)', () => {
      const mockContent = loadFixture('package-lock-v3.json')
      const words = extractFromPackageLock(mockContent, { debug: false })

      expect(words).toContain('package-a')
      expect(words).toContain('@scope/package-b')
      expect(words).toContain('scope')
      expect(words).toContain('package-b')
      expect(words).toContain('package-c')

      // Test for @cspell/dict-monkeyc
      expect(words).toContain('cspell')
      expect(words).toContain('dict-monkeyc')
      expect(words).toContain('@cspell/dict-monkeyc')

      // Test for engine names
      expect(words).toContain('co')
      expect(words).toContain('iojs')
      expect(words).toContain('engines')
      expect(words).toContain('license')
      expect(words).toContain('MIT')

      verifyNoDuplicates(words)
    })
  })
})
