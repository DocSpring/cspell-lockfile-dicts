import { extractFromCargoLock } from '../cargo'
import { loadFixture, setupMocks, verifyNoDuplicates } from './test-helpers'

describe('Cargo Extractors', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractFromCargoLock', () => {
    it('should extract package names from Cargo.lock', () => {
      const mockContent = loadFixture('Cargo.lock')
      const words = extractFromCargoLock(mockContent)

      expect(words).toContain('package-a')
      expect(words).toContain('package-b')

      verifyNoDuplicates(words)
    })
  })
})
