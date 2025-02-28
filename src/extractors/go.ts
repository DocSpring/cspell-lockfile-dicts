/**
 * Extract words from a go.mod file
 * @param content Content of the go.mod file
 * @returns Array of extracted words
 */
export function extractFromGoMod(content: string): string[] {
  const words = new Set<string>()

  // Extract module name
  const moduleRegex = /^module\s+([^\s]+)/m
  const moduleMatch = moduleRegex.exec(content)
  if (moduleMatch && moduleMatch[1]) {
    const moduleName = moduleMatch[1]
    words.add(moduleName)

    // Split module path into components
    const parts = moduleName.split('/')
    parts.forEach((part) => {
      if (part && part.length > 1) {
        words.add(part)
      }
    })
  }

  // Extract all require statements
  // This regex captures both single-line requires and multi-line require blocks
  const requireRegex = /require\s+\(([^)]+)\)|require\s+([^\s]+)\s+([^\s]+)/g
  let requireMatch

  while ((requireMatch = requireRegex.exec(content)) !== null) {
    if (requireMatch[1]) {
      // Multi-line require block
      const requireBlock = requireMatch[1]
      // Extract each module from the block
      const moduleLineRegex = /^\s*([^\s]+)\s+v[0-9.]+/gm
      let moduleLineMatch

      while ((moduleLineMatch = moduleLineRegex.exec(requireBlock)) !== null) {
        const modulePath = moduleLineMatch[1]
        words.add(modulePath)

        // Split module path into components
        const parts = modulePath.split('/')
        parts.forEach((part) => {
          if (part && part.length > 1) {
            words.add(part)
          }
        })
      }
    } else if (requireMatch[2]) {
      // Single-line require
      const modulePath = requireMatch[2]
      words.add(modulePath)

      // Split module path into components
      const parts = modulePath.split('/')
      parts.forEach((part) => {
        if (part && part.length > 1) {
          words.add(part)
        }
      })
    }
  }

  // Fallback: directly look for GitHub and Golang paths in case the above regex doesn't catch everything
  const packagePathRegex =
    /github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+|golang\.org\/[a-zA-Z0-9_.-/]+/g
  let match
  while ((match = packagePathRegex.exec(content)) !== null) {
    const packagePath = match[0]
    words.add(packagePath)

    // Split package path into components
    const parts = packagePath.split('/')
    parts.forEach((part) => {
      if (part && part.length > 1) {
        words.add(part)
      }
    })
  }

  return Array.from(words).sort()
}

/**
 * Extract words from a go.sum file
 * @param content Content of the go.sum file
 * @returns Array of extracted words
 */
export function extractFromGoSum(content: string): string[] {
  const words = new Set<string>()

  // Each line in go.sum is in the format: module/path version hash
  const lineRegex = /^([^\s]+)\s+([^\s]+)\s+([^\s]+)/gm
  let match
  while ((match = lineRegex.exec(content)) !== null) {
    const modulePath = match[1]
    words.add(modulePath)

    // Split module path into components
    const parts = modulePath.split('/')
    parts.forEach((part) => {
      if (part && part.length > 1) {
        words.add(part)

        // Further split by dots and dashes
        const subparts = part.split(/[.-]/)
        if (subparts.length > 1) {
          subparts.forEach((subpart) => {
            if (subpart && subpart.length > 1) {
              words.add(subpart)
            }
          })
        }
      }
    })
  }

  return Array.from(words).sort()
}
