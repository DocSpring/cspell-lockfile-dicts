import { LockfileDictionariesConfig } from '../config.ts'
import { debugLog } from '../utils.ts'

/**
 * Extract words from a Pipfile.lock file
 * @param content Content of the Pipfile.lock file
 * @param config Configuration for lockfile dictionaries
 * @returns Array of extracted words
 */
export function extractFromPipfileLock(
  content: string,
  config?: LockfileDictionariesConfig
): string[] {
  const words = new Set<string>()
  const safeConfig = config || { debug: false }

  debugLog(
    safeConfig,
    `Extracting from Pipfile.lock, content length: ${content.length}`
  )

  try {
    const parsed = JSON.parse(content)
    debugLog(
      safeConfig,
      `Parsed Pipfile.lock: ${JSON.stringify(parsed, null, 2).substring(0, 200)}...`
    )

    // Process default packages
    if (parsed.default && typeof parsed.default === 'object') {
      Object.keys(parsed.default).forEach((packageName) => {
        words.add(packageName)

        // Split package names with hyphens and underscores
        const parts = packageName.split(/[-_]/)
        if (parts.length > 1) {
          parts.forEach((part) => {
            if (part && part.length > 1) {
              words.add(part)
            }
          })
        }
      })
    }

    // Process development packages
    if (parsed.develop && typeof parsed.develop === 'object') {
      Object.keys(parsed.develop).forEach((packageName) => {
        words.add(packageName)

        // Split package names with hyphens and underscores
        const parts = packageName.split(/[-_]/)
        if (parts.length > 1) {
          parts.forEach((part) => {
            if (part && part.length > 1) {
              words.add(part)
            }
          })
        }
      })
    }
  } catch (error) {
    debugLog(safeConfig, `Error parsing Pipfile.lock: ${error}`)
  }

  return Array.from(words).sort()
}
