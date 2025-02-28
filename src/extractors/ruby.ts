/**
 * Extract words from a Gemfile.lock file
 * @param content Content of the Gemfile.lock file
 * @returns Array of extracted words
 */
export function extractFromGemfileLock(content: string): string[] {
  const words = new Set<string>()

  // Extract gem names
  const gemNameRegex = /^\s{4}([a-zA-Z0-9_-]+)(\s|$)/gm
  let match
  while ((match = gemNameRegex.exec(content)) !== null) {
    words.add(match[1])
  }

  // Extract GitHub repository names
  const githubRepoRegex = /github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/g
  while ((match = githubRepoRegex.exec(content)) !== null) {
    words.add(match[1])
    words.add(match[2])
  }

  // Extract branch names
  const branchRegex = /^\s{2}branch: ([a-zA-Z0-9_-]+)/gm
  while ((match = branchRegex.exec(content)) !== null) {
    words.add(match[1])
  }

  // Extract version numbers (without dots)
  const versionRegex = /\(([0-9]+\.[0-9]+\.[0-9]+)\)/g
  while ((match = versionRegex.exec(content)) !== null) {
    const version = match[1].replace(/\./g, '')
    if (version.length > 2) {
      words.add(version)
    }
  }

  return Array.from(words).sort()
}
