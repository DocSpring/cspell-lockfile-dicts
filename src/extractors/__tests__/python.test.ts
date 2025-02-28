import { extractFromPythonLock } from '../python'
import { extractFromPoetryLock } from '../poetry'
import { extractFromPipfileLock } from '../pipenv'
import { loadFixture, setupMocks, verifyWords } from './test-helpers'

describe('Python Extractors', () => {
  beforeEach(() => {
    setupMocks()
  })

  describe('extractFromPoetryLock', () => {
    it('should extract package names from poetry.lock', () => {
      const mockContent = loadFixture('poetry.lock')
      const words = extractFromPoetryLock(mockContent)

      expect(words).toContain('package-a')
      expect(words).toContain('package-b')

      verifyWords(words)
    })
  })

  describe('extractFromPipfileLock', () => {
    it('should extract package names from Pipfile.lock', () => {
      const mockContent = loadFixture('Pipfile.lock')
      const words = extractFromPipfileLock(mockContent, { debug: false })

      expect(words).toContain('package-a')
      expect(words).toContain('package-b')

      verifyWords(words)
    })
  })

  describe('extractFromPythonLock', () => {
    it('should delegate to the appropriate extractor based on content', () => {
      // Test with Pipfile.lock content (JSON format)
      const pipfileMockContent = loadFixture('Pipfile.lock')
      const pipfileWords = extractFromPythonLock(pipfileMockContent, {
        debug: false,
      })
      expect(pipfileWords).toContain('package-a')
      expect(pipfileWords).toContain('package-b')

      // Test with poetry.lock content (TOML-like format)
      const poetryMockContent = loadFixture('poetry.lock')
      const poetryWords = extractFromPythonLock(poetryMockContent, {
        debug: false,
      })
      expect(poetryWords).toContain('package-a')
      expect(poetryWords).toContain('package-b')
    })
  })
})
