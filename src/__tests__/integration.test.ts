import * as fs from 'fs'
import { extractWordsFromFile } from '../extractors'
import { LockfileType } from '../lockfileTypes'
import { loadFixture } from '../extractors/__tests__/test-helpers'

// Mock fs module
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
}))

const mockedReadFileSync = fs.readFileSync as jest.MockedFunction<
  typeof fs.readFileSync
>

describe('Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('extractWordsFromFile', () => {
    it('should extract words from package-lock.json', async () => {
      const mockContent = loadFixture('package-lock-v3.json')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'package-lock.json',
        LockfileType.PACKAGE_LOCK,
        false
      )

      expect(words).toContain('package-a')
      expect(words).toContain('@scope/package-b')
      expect(words).toContain('@cspell/dict-monkeyc')
    })

    it('should extract words from yarn.lock', async () => {
      const mockContent = loadFixture('yarn.lock')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'yarn.lock',
        LockfileType.YARN_LOCK,
        false
      )

      expect(words).toContain('package-a')
      expect(words).toContain('@cspell/dict-monkeyc')
    })

    it('should extract words from Gemfile.lock', async () => {
      const mockContent = loadFixture('Gemfile.lock')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'Gemfile.lock',
        LockfileType.GEMFILE_LOCK,
        false
      )

      expect(words).toContain('gem-a')
      expect(words).toContain('gem-b')
    })

    it('should extract words from composer.lock', async () => {
      const mockContent = loadFixture('composer.lock')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'composer.lock',
        LockfileType.COMPOSER_LOCK,
        false
      )

      expect(words).toContain('vendor/package-a')
    })

    it('should extract words from Cargo.lock', async () => {
      const mockContent = loadFixture('Cargo.lock')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'Cargo.lock',
        LockfileType.CARGO_LOCK,
        false
      )

      expect(words).toContain('package-a')
    })

    it('should extract words from poetry.lock', async () => {
      const mockContent = loadFixture('poetry.lock')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'poetry.lock',
        LockfileType.POETRY_LOCK,
        false
      )

      expect(words).toContain('package-a')
    })

    it('should extract words from Pipfile.lock', async () => {
      const mockContent = loadFixture('Pipfile.lock')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'Pipfile.lock',
        LockfileType.PIPFILE_LOCK,
        false
      )

      expect(words).toContain('package-a')
    })

    it('should extract words from go.sum', async () => {
      const mockContent = loadFixture('go.sum')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'go.sum',
        LockfileType.GO_SUM,
        false
      )

      expect(words).toContain('github.com/user/repo')
    })

    it('should extract words from go.mod', async () => {
      const mockContent = loadFixture('go.mod')
      mockedReadFileSync.mockReturnValue(mockContent)

      const words = await extractWordsFromFile(
        'go.mod',
        LockfileType.GO_MOD,
        false
      )

      expect(words).toContain('github.com/user/project')
      expect(words).toContain('github.com/user/repo')
      expect(words).toContain('github.com/another/module')
      expect(words).toContain('golang.org/x/text')
    })

    it('should use generic extractor for unknown file types', async () => {
      const mockContent = 'This is a generic file with package-a and package-b'
      mockedReadFileSync.mockReturnValue(mockContent)

      // Use PACKAGE_LOCK as a fallback, but the content doesn't match so it will use generic extractor
      const words = await extractWordsFromFile(
        'unknown.txt',
        LockfileType.PACKAGE_LOCK,
        false
      )

      expect(words).toContain('generic')
      expect(words).toContain('package')
    })
  })
})
