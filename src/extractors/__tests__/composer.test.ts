import { extractFromComposerLock } from '../composer'
import { loadFixture, setupMocks, verifyNoDuplicates } from './test-helpers'

describe('Composer Extractors', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractFromComposerLock', () => {
    it('should extract package names from composer.lock', () => {
      const mockContent = loadFixture('composer.lock')
      const words = extractFromComposerLock(mockContent)

      expect(words).toContain('vendor')
      expect(words).toContain('package-a')
      expect(words).toContain('package-b')
      expect(words).toContain('vendor/package-a')
      expect(words).toContain('vendor/package-b')

      verifyNoDuplicates(words)
    })
  })
})
