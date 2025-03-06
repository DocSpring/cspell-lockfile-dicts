/**
 * Extract words from a yarn.lock file
 * @param content Content of the yarn.lock file
 * @returns Array of extracted words
 */
export function extractFromYarnLock(content: string): string[] {
  const words = new Set<string>()

  // Simple regex to match package names in yarn.lock
  // Handles quoted ("package@") and unquoted (package@) formats
  const packageNameRegex =
    /^(?:"?([@a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)?)@|([a-zA-Z0-9_-]+)@)/gm

  let match
  while ((match = packageNameRegex.exec(content)) !== null) {
    const packageName = (match[1] || match[2]).trim()
    if (packageName && !packageName.includes(' ')) {
      // Don't add full scoped package names
      if (!packageName.startsWith('@')) {
        words.add(packageName)
      }

      // Add parts of scoped packages
      if (packageName.includes('/')) {
        const [scope, name] = packageName.split('/')
        if (scope.startsWith('@')) {
          words.add(scope.substring(1))
          words.add(name)
        }
      }
    }
  }

  return Array.from(words).sort()
}
