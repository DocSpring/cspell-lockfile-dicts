import { extractFromYarnLock } from '../yarn'
import { loadFixture, setupMocks, verifyWords } from './test-helpers'

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
      expect(words).toContain('shiki')

      // Test for @cspell/dict-monkeyc
      expect(words).toContain('cspell')
      expect(words).toContain('dict-monkeyc')
      // Full scoped package names should not be included
      expect(words).not.toContain('@cspell/dict-monkeyc')

      verifyWords(words)
    })

    it('should extract package names from package specifications with colons', () => {
      const content =
        'shiki@^1.29.2:\n  version "1.29.2"\n  resolved "https://registry.yarnpkg.com/shiki/-/shiki-1.29.2.tgz"'
      const words = extractFromYarnLock(content)

      expect(words).toContain('shiki')
      verifyWords(words)
    })
  })
})
