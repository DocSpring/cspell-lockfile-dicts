/**
 * Extract words from a poetry.lock file
 * @param content Content of the poetry.lock file
 * @returns Array of extracted words
 */
export function extractFromPoetryLock(content: string): string[] {
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

  // Extract description words
  const descriptionRegex = /description = "([^"]+)"/g
  while ((match = descriptionRegex.exec(content)) !== null) {
    const description = match[1]
    const descWords = description.split(/\s+/)
    descWords.forEach((word) => {
      // Clean up the word and add if it's valid
      const cleanWord = word.replace(/[^a-zA-Z0-9_-]/g, '')
      if (cleanWord && cleanWord.length > 2) {
        words.add(cleanWord)
      }
    })
  }

  // Extract version numbers (without dots)
  const versionRegex = /version = "([0-9]+\.[0-9]+\.[0-9]+)"/g
  while ((match = versionRegex.exec(content)) !== null) {
    const version = match[1].replace(/\./g, '')
    if (version.length > 2) {
      words.add(version)
    }
  }

  // Extract category names
  const categoryRegex = /category = "([^"]+)"/g
  while ((match = categoryRegex.exec(content)) !== null) {
    words.add(match[1])
  }

  return Array.from(words).sort()
}
