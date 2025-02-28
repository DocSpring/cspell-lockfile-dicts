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
      // Full scoped package names should not be included
      expect(words).not.toContain('@scope/package-b')

      // Test for @cspell/dict-monkeyc
      expect(words).toContain('cspell')
      expect(words).toContain('dict-monkeyc')
      // Full scoped package names should not be included
      expect(words).not.toContain('@cspell/dict-monkeyc')
      // Package names should not be split
      expect(words).not.toContain('dict')
      expect(words).not.toContain('monkeyc')

      verifyNoDuplicates(words)
    })

    it('should extract package names from package-lock.json (lockfileVersion 3)', () => {
      const mockContent = loadFixture('package-lock-v3.json')
      const words = extractFromPackageLock(mockContent, { debug: false })

      expect(words).toContain('package-a')
      // Full scoped package names should not be included
      expect(words).not.toContain('@scope/package-b')
      expect(words).toContain('scope')
      expect(words).toContain('package-b')
      expect(words).toContain('package-c')

      // Test for @cspell/dict-monkeyc
      expect(words).toContain('cspell')
      expect(words).toContain('dict-monkeyc')
      // Full scoped package names should not be included
      expect(words).not.toContain('@cspell/dict-monkeyc')
      // Package names should not be split
      expect(words).not.toContain('dict')
      expect(words).not.toContain('monkeyc')

      // Test for engine names
      expect(words).toContain('co')
      expect(words).toContain('iojs')
      expect(words).toContain('engines')
      expect(words).toContain('license')
      expect(words).toContain('MIT')

      verifyNoDuplicates(words)
    })

    it('should properly handle scoped packages like @babel/compat-data', () => {
      const mockContent = JSON.stringify({
        name: 'test-project',
        lockfileVersion: 3,
        packages: {
          'node_modules/@babel/compat-data': {
            version: '7.23.2',
            resolved:
              'https://registry.npmjs.org/@babel/compat-data/-/compat-data-7.23.2.tgz',
          },
        },
      })

      const words = extractFromPackageLock(mockContent, { debug: false })

      // Should NOT include the full package name
      expect(words).not.toContain('@babel/compat-data')

      // Should include the scope without @
      expect(words).toContain('babel')

      // Should include the package name
      expect(words).toContain('compat-data')

      // Should NOT include the parts of the package name
      expect(words).not.toContain('compat')
      expect(words).not.toContain('data')

      verifyNoDuplicates(words)
    })
  })
})
