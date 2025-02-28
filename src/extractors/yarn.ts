/**
 * Extract words from a yarn.lock file
 * @param content Content of the yarn.lock file
 * @returns Array of extracted words
 */
export function extractFromYarnLock(content: string): string[] {
  const words = new Set<string>()

  // Extract package names
  const packageNameRegex = /^"?([^@"]+)@|^"?(@[^/]+\/[^@"]+)@/gm
  let match
  while ((match = packageNameRegex.exec(content)) !== null) {
    const packageName = (match[1] || match[2]).trim()
    if (packageName && !packageName.includes(' ')) {
      words.add(packageName)

      // Add parts of scoped packages
      if (packageName.includes('/')) {
        const [scope, name] = packageName.split('/')
        if (scope.startsWith('@')) {
          words.add(scope.substring(1))
        }
        words.add(name)
      }
    }
  }

  // Extract version numbers (without dots)
  const versionRegex = /version "?([0-9]+\.[0-9]+\.[0-9]+)/g
  while ((match = versionRegex.exec(content)) !== null) {
    const version = match[1].replace(/\./g, '')
    if (version.length > 2) {
      words.add(version)
    }
  }

  return Array.from(words).sort()
}
