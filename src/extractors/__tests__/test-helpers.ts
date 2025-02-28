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
 * Verify that there are no duplicate words in the array
 * @param words Array of words to check
 */
export const verifyNoDuplicates = (words: string[]): void => {
  expect(words.length).toBe(new Set(words).size)
}
