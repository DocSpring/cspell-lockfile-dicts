import { LockfileDictionariesConfig } from '../config.ts'
import { debugLog } from '../utils.ts'

/**
 * Extract words from a composer.lock file
 * @param content Content of the composer.lock file
 * @param config Configuration for lockfile dictionaries
 * @returns Array of extracted words
 */
export function extractFromComposerLock(
  content: string,
  config?: LockfileDictionariesConfig
): string[] {
  const words = new Set<string>()
  const safeConfig = config || { debug: false }

  debugLog(
    safeConfig,
    `Extracting from composer.lock, content length: ${content.length}`
  )

  try {
    const parsed = JSON.parse(content)
    debugLog(
      safeConfig,
      `Parsed composer.lock: ${JSON.stringify(parsed, null, 2).substring(0, 200)}...`
    )

    // Process packages
    if (Array.isArray(parsed.packages)) {
      parsed.packages.forEach((pkg: Record<string, unknown>) => {
        if (pkg.name && typeof pkg.name === 'string') {
          // Add full package name
          words.add(pkg.name)

          // Split vendor/package format
          const parts = pkg.name.split('/')
          if (parts.length > 1) {
            parts.forEach((part: string) => {
              if (part && part.length > 1) {
                words.add(part)
              }
            })
          }
        }
      })
    }

    // Process dev packages
    if (Array.isArray(parsed['packages-dev'])) {
      parsed['packages-dev'].forEach((pkg: Record<string, unknown>) => {
        if (pkg.name && typeof pkg.name === 'string') {
          // Add full package name
          words.add(pkg.name)

          // Split vendor/package format
          const parts = pkg.name.split('/')
          if (parts.length > 1) {
            parts.forEach((part: string) => {
              if (part && part.length > 1) {
                words.add(part)
              }
            })
          }
        }
      })
    }
  } catch (error) {
    debugLog(safeConfig, `Error parsing composer.lock: ${error}`)
  }

  return Array.from(words).sort()
}
