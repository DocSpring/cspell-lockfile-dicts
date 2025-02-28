/**
 * Generic extractor for any file type
 * @param content Content of the file
 * @returns Array of extracted words
 */
export function extractGeneric(content: string): string[] {
  const words = new Set<string>()

  // Extract words that look like identifiers (alphanumeric with hyphens, underscores, dots)
  const identifierRegex = /[a-zA-Z][a-zA-Z0-9_.-]{2,}/g
  let match
  while ((match = identifierRegex.exec(content)) !== null) {
    const word = match[0]

    // Add the full word
    words.add(word)

    // Split by separators and add parts
    const parts = word.split(/[._-]/)
    if (parts.length > 1) {
      parts.forEach((part) => {
        if (part && part.length > 2) {
          words.add(part)
        }
      })
    }
  }

  // Extract version numbers (without dots)
  const versionRegex = /\b(\d+\.\d+\.\d+)\b/g
  while ((match = versionRegex.exec(content)) !== null) {
    const version = match[1].replace(/\./g, '')
    if (version.length > 2) {
      words.add(version)
    }
  }

  return Array.from(words).sort()
}
