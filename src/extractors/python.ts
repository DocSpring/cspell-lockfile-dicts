import { LockfileDictionariesConfig } from '../config.js'
import { debugLog } from '../utils.js'

/**
 * Extract words from a Python lock file (poetry.lock or Pipfile.lock)
 * @param content Content of the Python lock file
 * @param config Configuration for lockfile dictionaries
 * @returns Array of extracted words
 */
export function extractFromPythonLock(
  content: string,
  config?: LockfileDictionariesConfig
): string[] {
  const safeConfig = config || { debug: false }

  // This is a generic function that can handle both poetry.lock and Pipfile.lock
  // It will delegate to the specific extractors based on the content format

  // Check if it's a Pipfile.lock (JSON format)
  if (content.trim().startsWith('{')) {
    try {
      JSON.parse(content)
      // If we can parse it as JSON, it's likely a Pipfile.lock
      debugLog(
        safeConfig,
        'Detected Pipfile.lock format, delegating to Pipfile extractor'
      )
      return extractFromPipfileLock(content, config)
    } catch {
      // Not valid JSON, probably not a Pipfile.lock
      debugLog(safeConfig, 'Failed to parse as JSON, not a Pipfile.lock')
    }
  }

  // If not a Pipfile.lock, assume it's a poetry.lock
  debugLog(
    safeConfig,
    'Assuming poetry.lock format, delegating to Poetry extractor'
  )
  return extractFromPoetryLock(content)
}

/**
 * Import the specific extractors to avoid circular dependencies
 */
import { extractFromPoetryLock } from './poetry.js'
import { extractFromPipfileLock } from './pipenv.js'
