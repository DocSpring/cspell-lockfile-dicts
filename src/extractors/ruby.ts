/**
 * Extract words from a Gemfile.lock file
 * @param content Content of the Gemfile.lock file
 * @returns Array of extracted words
 */
export function extractFromGemfileLock(content: string): string[] {
  const words = new Set<string>()

  // Extract top-level gem names (4 spaces)
  const topLevelGemRegex = /^\s{4}([a-zA-Z0-9_-]+)(\s|$)/gm
  let match
  while ((match = topLevelGemRegex.exec(content)) !== null) {
    words.add(match[1])
  }

  // Extract dependency gem names (6 spaces)
  const dependencyGemRegex = /^\s{6}([a-zA-Z0-9_-]+)(\s|$)/gm
  while ((match = dependencyGemRegex.exec(content)) !== null) {
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

  // Extract revision values
  const revisionRegex = /^\s{2}revision: ([a-zA-Z0-9_-]+)/gm
  while ((match = revisionRegex.exec(content)) !== null) {
    words.add(match[1])
  }

  return Array.from(words).sort()
}
