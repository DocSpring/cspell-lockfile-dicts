/**
 * Extract words from a Cargo.lock file
 * @param content Content of the Cargo.lock file
 * @returns Array of extracted words
 */
export function extractFromCargoLock(content: string): string[] {
  const words = new Set<string>()

  // Extract package names
  const packageNameRegex = /name = "([^"]+)"/g
  let match
  while ((match = packageNameRegex.exec(content)) !== null) {
    words.add(match[1])

    // Split package names with hyphens
    const parts = match[1].split('-')
    if (parts.length > 1) {
      parts.forEach((part) => {
        if (part && part.length > 1) {
          words.add(part)
        }
      })
    }
  }

  // Extract source URLs
  const sourceRegex = /source = "([^"]+)"/g
  while ((match = sourceRegex.exec(content)) !== null) {
    const source = match[1]

    // Extract domain and path components from URLs
    if (source.includes('://')) {
      const url = source.split('://')[1]
      const parts = url.split('/')
      parts.forEach((part) => {
        if (part && part.length > 1) {
          words.add(part)
        }
      })
    }
  }

  return Array.from(words).sort()
}
