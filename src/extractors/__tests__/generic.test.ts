import { extractGeneric } from '../generic'
import { setupMocks, verifyNoDuplicates } from './test-helpers'

describe('Generic Extractor', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractGeneric', () => {
    it('should extract words from unknown file types', () => {
      const mockContent = `
This is a generic file with some package names like:
package-a, package-b, and @scope/package-c
      `
      const words = extractGeneric(mockContent)

      expect(words).toContain('package')
      expect(words).toContain('generic')
      expect(words).toContain('file')
      expect(words).toContain('names')

      verifyNoDuplicates(words)
    })

    it('should extract version numbers', () => {
      const mockContent = `
Version numbers: 1.0.0, 2.3.4, and 5.6.7
      `
      const words = extractGeneric(mockContent)

      expect(words).toContain('Version')
      expect(words).toContain('numbers')
      expect(words).toContain('100')
      expect(words).toContain('234')
      expect(words).toContain('567')

      verifyNoDuplicates(words)
    })
  })
})
