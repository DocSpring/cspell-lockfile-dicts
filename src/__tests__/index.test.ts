import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { LockfileParser } from '../parser'
import { plugin, createPlugin } from '../plugin-experimental'
import { extractWordsFromFile } from '../extractors'
import { detectLockfileType, LockfileType } from '../lockfileTypes'

// Create a temporary directory for the tests
const tmpDir = fs.mkdtempSync(
  path.join(os.tmpdir(), 'cspell-lockfile-dicts-test-')
)
const dictionaryPath = path.join(tmpDir, 'lockfile-words.txt')

// Use the real fs module for the tests
jest.mock('../extractors', () => ({
  extractWordsFromFile: jest.fn(),
}))

jest.mock('../lockfileTypes', () => ({
  detectLockfileType: jest.fn(),
  LockfileType: {
    PACKAGE_LOCK: 'package-lock',
    YARN_LOCK: 'yarn-lock',
    GEMFILE_LOCK: 'gemfile-lock',
  },
}))

describe('Plugin API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    // Default mock implementation
    ;(extractWordsFromFile as jest.Mock).mockResolvedValue([
      'react',
      'lodash',
      'typescript',
    ])
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  afterAll(() => {
    // Clean up the temporary directory after all tests
    try {
      if (fs.existsSync(dictionaryPath)) {
        fs.unlinkSync(dictionaryPath)
      }
      fs.rmdirSync(tmpDir)
    } catch (error) {
      console.error('Error cleaning up temporary directory:', error)
    }
  })

  describe('plugin', () => {
    it('should export a plugin instance', () => {
      expect(plugin).toBeDefined()
      expect(plugin.parsers).toBeDefined()
      expect(plugin.parsers?.length).toBe(1)
      expect(plugin.parsers?.[0]).toBeInstanceOf(LockfileParser)
    })
  })

  describe('createPlugin', () => {
    it('should create a plugin with custom configuration', () => {
      const customPlugin = createPlugin({
        dictionaryPath,
      })

      expect(customPlugin).toBeDefined()
      expect(customPlugin.parsers).toBeDefined()
      expect(customPlugin.parsers?.length).toBe(1)
      expect(customPlugin.parsers?.[0]).toBeInstanceOf(LockfileParser)
    })
  })

  describe('LockfileParser', () => {
    it('should parse a lockfile and extract words', () => {
      // Mock file type detection
      ;(detectLockfileType as jest.Mock).mockReturnValue(
        LockfileType.PACKAGE_LOCK
      )

      // Create a parser instance
      const parser = new LockfileParser({ dictionaryPath })

      // Parse a file
      const result = parser.parse('package content', 'package-lock.json')

      // Verify the result
      expect(result).toBeDefined()
      expect(result.content).toBe('package content')
      expect(result.filename).toBe('package-lock.json')
      expect(result.parsedTexts).toHaveLength(1)

      const parsedText = Array.from(result.parsedTexts)[0]
      expect(parsedText.text).toBe('package content')
      expect(parsedText.range).toEqual([0, 'package content'.length])
      expect(parsedText.scope).toBe('lockfile')

      // Fast-forward timers to trigger the async extraction
      jest.runAllTimers()

      // Verify that the extraction was scheduled
      expect(extractWordsFromFile).toHaveBeenCalledWith(
        'package-lock.json',
        LockfileType.PACKAGE_LOCK,
        expect.any(Boolean)
      )
    })

    it('should handle non-lockfiles', () => {
      // Mock file type detection (not a lockfile)
      ;(detectLockfileType as jest.Mock).mockReturnValue(undefined)

      // Create a parser instance
      const parser = new LockfileParser({ dictionaryPath })

      // Parse a non-lockfile
      const result = parser.parse('regular content', 'regular.txt')

      // Verify the result
      expect(result).toBeDefined()
      expect(result.content).toBe('regular content')
      expect(result.filename).toBe('regular.txt')
      expect(result.parsedTexts).toHaveLength(1)

      const parsedText = Array.from(result.parsedTexts)[0]
      expect(parsedText.text).toBe('regular content')
      expect(parsedText.range).toEqual([0, 'regular content'.length])
      expect(parsedText.scope).toBeUndefined()

      // Verify that no extraction was attempted
      expect(extractWordsFromFile).not.toHaveBeenCalled()
    })

    it('should handle errors gracefully', () => {
      // Mock file type detection
      ;(detectLockfileType as jest.Mock).mockReturnValue(
        LockfileType.PACKAGE_LOCK
      )

      // Mock extraction to throw an error
      ;(extractWordsFromFile as jest.Mock).mockRejectedValueOnce(
        new Error('Extraction error')
      )

      // Create a parser instance
      const parser = new LockfileParser({ dictionaryPath })

      // Parse a file - this should not throw an error
      const result = parser.parse('package content', 'package-lock.json')

      // Verify the result is still valid
      expect(result).toBeDefined()
      expect(result.content).toBe('package content')
      expect(result.filename).toBe('package-lock.json')
      expect(result.parsedTexts).toHaveLength(1)

      // Fast-forward timers
      jest.runAllTimers()

      // The test passes if no exception is thrown
    })
  })
})
