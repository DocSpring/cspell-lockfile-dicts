import * as fs from 'fs'
import { generateDictionary } from '../utils'
import { extractWordsFromFile } from '../extractors'
import { detectLockfileType, LockfileType } from '../lockfileTypes'

// Mock dependencies
jest.mock('fs')
jest.mock('../extractors')
jest.mock('../lockfileTypes')

describe('Utils', () => {
  const mockedFs = fs as jest.Mocked<typeof fs>
  const mockedExtractWordsFromFile =
    extractWordsFromFile as jest.MockedFunction<typeof extractWordsFromFile>
  const mockedDetectLockfileType = detectLockfileType as jest.MockedFunction<
    typeof detectLockfileType
  >

  beforeEach(() => {
    jest.clearAllMocks()

    // Default implementations
    mockedFs.existsSync.mockReturnValue(true)
    mockedFs.writeFileSync.mockImplementation(() => undefined)
    mockedFs.mkdirSync.mockImplementation(() => undefined)

    mockedExtractWordsFromFile.mockResolvedValue(['word1', 'word2'])
    mockedDetectLockfileType.mockReturnValue(LockfileType.PACKAGE_LOCK)
  })

  describe('generateDictionary', () => {
    it('should process multiple lockfiles when specified', async () => {
      // Setup
      const config = {
        dictionaryPath: '.cspell/test-words.txt',
        lockfiles: ['package-lock.json', 'Gemfile.lock'],
        autoDetect: false,
      }

      // Execute
      const words = await generateDictionary(config)

      // Verify
      // Note: existsSync may be called multiple times for other purposes
      expect(mockedFs.existsSync).toHaveBeenCalledWith('package-lock.json')
      expect(mockedFs.existsSync).toHaveBeenCalledWith('Gemfile.lock')

      expect(mockedDetectLockfileType).toHaveBeenCalledTimes(2)
      expect(mockedDetectLockfileType).toHaveBeenCalledWith('package-lock.json')
      expect(mockedDetectLockfileType).toHaveBeenCalledWith('Gemfile.lock')

      expect(mockedExtractWordsFromFile).toHaveBeenCalledTimes(2)
      expect(words.length).toBeGreaterThan(0)
    })

    it('should throw an error when specified lockfiles do not exist', async () => {
      // Setup
      const config = {
        dictionaryPath: '.cspell/test-words.txt',
        lockfiles: ['package-lock.json', 'nonexistent.lock'],
        autoDetect: false,
      }

      // Mock fs.existsSync to return true for package-lock.json and false for nonexistent.lock
      mockedFs.existsSync.mockImplementation((path) =>
        path === 'package-lock.json' ? true : false
      )

      // Execute and verify
      await expect(generateDictionary(config)).rejects.toThrow(
        'Specified lockfile(s) not found: nonexistent.lock'
      )

      // Verify that no extraction was attempted
      expect(mockedExtractWordsFromFile).not.toHaveBeenCalled()
    })

    it('should auto-detect lockfiles when no lockfiles are specified', async () => {
      // Setup
      const config = {
        dictionaryPath: '.cspell/test-words.txt',
        autoDetect: true,
        autoDetectPatterns: ['**/package-lock.json', '**/Gemfile.lock'],
      }

      // Execute
      await generateDictionary(config)

      // Verify
      expect(mockedFs.existsSync).toHaveBeenCalledWith('package-lock.json')
      expect(mockedFs.existsSync).toHaveBeenCalledWith('Gemfile.lock')
    })
  })
})
