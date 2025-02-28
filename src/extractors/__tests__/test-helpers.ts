import * as path from 'path'

// Mock fs.readFileSync
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  readFileSync: jest.fn(),
}))

/**
 * Get the path to a fixture file
 * @param filename Name of the fixture file
 * @returns Full path to the fixture file
 */
export const getFixturePath = (filename: string): string => {
  return path.join(__dirname, 'fixtures', filename)
}

/**
 * Load a fixture file
 * @param filename Name of the fixture file
 * @returns Content of the fixture file
 */
export const loadFixture = (filename: string): string => {
  // Use the real fs module to load the fixture
  return jest
    .requireActual('fs')
    .readFileSync(getFixturePath(filename), 'utf-8')
}

/**
 * Setup mocks before each test
 */
export const setupMocks = (): void => {
  jest.clearAllMocks()
}

/**
 * Verify that the words array meets our requirements:
 * 1. No duplicate words
 * 2. No strings of numbers (version strings)
 * @param words Array of words to check
 */
export const verifyWords = (words: string[]): void => {
  // Check for duplicates
  const uniqueWords = new Set(words)
  expect(words.length).toBe(uniqueWords.size)

  // Check for strings of numbers
  const numericRegex = /^\d+$/
  const numericWords = words.filter((word) => numericRegex.test(word))
  if (numericWords.length > 0) {
    throw new Error(
      `Found numeric strings in words: ${numericWords.join(', ')}`
    )
  }

  // Check for version-like strings
  const versionRegex = /^\d+\.\d+(\.\d+)*$/
  const versionWords = words.filter((word) => versionRegex.test(word))
  if (versionWords.length > 0) {
    throw new Error(
      `Found version strings in words: ${versionWords.join(', ')}`
    )
  }
}
