import { LockfileDictionariesConfig } from '../config.js'
import { debugLog } from '../utils.js'

/**
 * Extract words from a package-lock.json file
 * @param content Content of the package-lock.json file
 * @param config Configuration options
 * @returns Array of extracted words
 */
export function extractFromPackageLock(
  content: string,
  config: LockfileDictionariesConfig
): string[] {
  const words = new Set<string>()

  debugLog(
    config,
    `🔍 Starting extraction from package-lock.json content (${content.length} chars)`
  )

  try {
    debugLog(config, `🔍 Parsing package-lock.json content as JSON`)
    const packageLock = JSON.parse(content)
    debugLog(config, `✅ Successfully parsed package-lock.json`)

    debugLog(config, `📋 Package lock structure:`)
    debugLog(config, `- name: ${packageLock.name || 'not specified'}`)
    debugLog(config, `- version: ${packageLock.version || 'not specified'}`)
    debugLog(
      config,
      `- lockfileVersion: ${packageLock.lockfileVersion || 'not specified'}`
    )

    debugLog(config, `🔍 Starting dependency extraction`)

    // Helper function to recursively extract words from an object
    function extractWordsFromObject(
      obj: Record<string, unknown>,
      prefix: string = ''
    ) {
      if (!obj || typeof obj !== 'object') return

      // Extract keys that might be relevant
      for (const key of Object.keys(obj)) {
        // Skip some common non-relevant keys
        if (
          [
            'version',
            'resolved',
            'integrity',
            'requires',
            'dev',
            'optional',
            'bundled',
          ].includes(key)
        )
          continue

        // Add the key itself if it looks like an identifier
        if (/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(key) && key.length > 1) {
          words.add(key)
          debugLog(config, `✅ Added word from object key: ${key}`)
        }

        const value = obj[key]

        // If the value is an object, recurse
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          extractWordsFromObject(
            value as Record<string, unknown>,
            `${prefix}${key}.`
          )
        }
        // If the value is an array, process each item
        else if (Array.isArray(value)) {
          for (const item of value) {
            if (
              typeof item === 'string' &&
              /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(item) &&
              item.length > 1
            ) {
              words.add(item)
              debugLog(config, `✅ Added word from array: ${item}`)
            } else if (typeof item === 'object' && item !== null) {
              extractWordsFromObject(
                item as Record<string, unknown>,
                `${prefix}${key}.`
              )
            }
          }
        }
        // If the value is a string and looks like an identifier, add it
        else if (
          typeof value === 'string' &&
          /^[a-zA-Z][a-zA-Z0-9_-]*$/.test(value) &&
          value.length > 1
        ) {
          words.add(value)
          debugLog(config, `✅ Added word from string value: ${value}`)
        }
      }
    }

    // Handle lockfileVersion 3+ (packages format)
    if (packageLock.packages && typeof packageLock.packages === 'object') {
      debugLog(config, `📦 Using packages format (lockfileVersion 3+)`)
      debugLog(
        config,
        `- packages count: ${Object.keys(packageLock.packages).length}`
      )

      for (const packagePath of Object.keys(packageLock.packages)) {
        // Skip the root package
        if (packagePath === '') continue

        // Extract the package name from the path
        // Format is usually "node_modules/package-name" or "node_modules/@scope/package-name"
        const parts = packagePath.split('/')
        if (parts.length >= 2) {
          const packageName = parts[parts.length - 1]
          const scope = parts[parts.length - 2]

          if (scope.startsWith('@')) {
            // Scoped package
            // Don't add the full scoped package name
            // const fullName = `${scope}/${packageName}`
            // words.add(fullName)

            // Add scope without @ symbol
            const scopeWithoutAt = scope.substring(1)
            words.add(scopeWithoutAt)

            // Add package name
            words.add(packageName)

            // Don't split package names on hyphens
            // const packageParts = packageName.split(/[-_]/)
            // packageParts.forEach(part => {
            //   if (part.length > 1) {
            //     words.add(part)
            //   }
            // })

            // Don't split scope names on hyphens
            // const scopeParts = scopeWithoutAt.split(/[-_]/)
            // scopeParts.forEach(part => {
            //   if (part.length > 1) {
            //     words.add(part)
            //   }
            // })

            debugLog(
              config,
              `✅ Added scoped package parts: ${scopeWithoutAt}, ${packageName}`
            )
          } else {
            // Regular package
            words.add(packageName)

            // Don't split package names on hyphens
            // const packageParts = packageName.split(/[-_]/)
            // packageParts.forEach(part => {
            //   if (part.length > 1) {
            //     words.add(part)
            //   }
            // })

            debugLog(config, `✅ Added package: ${packageName}`)
          }
        }

        // Recursively extract words from the package object
        extractWordsFromObject(packageLock.packages[packagePath])
      }
    }
    // Handle lockfileVersion 1-2 (dependencies format)
    else if (
      packageLock.dependencies &&
      typeof packageLock.dependencies === 'object'
    ) {
      debugLog(config, `📦 Using dependencies format (lockfileVersion 1-2)`)
      debugLog(
        config,
        `- dependencies count: ${Object.keys(packageLock.dependencies).length}`
      )

      // Extract package names from dependencies
      function extractDependencies(
        deps: Record<string, unknown>,
        depth: number = 0
      ) {
        if (!deps) {
          debugLog(
            config,
            `${' '.repeat(depth * 2)}❌ No dependencies at this level`
          )
          return
        }

        debugLog(
          config,
          `${' '.repeat(depth * 2)}📦 Processing ${Object.keys(deps).length} dependencies at depth ${depth}`
        )

        for (const packageName of Object.keys(deps)) {
          // Don't add full scoped package names
          if (!packageName.startsWith('@')) {
            words.add(packageName)
            debugLog(
              config,
              `${' '.repeat(depth * 2)}✅ Added word: ${packageName}`
            )
          }

          // Add parts of scoped packages
          if (packageName.includes('/')) {
            const [scope, name] = packageName.split('/')
            if (scope.startsWith('@')) {
              // Add scope without @ symbol
              const scopeWithoutAt = scope.substring(1)
              words.add(scopeWithoutAt)
              words.add(name)

              // Don't split package names on hyphens
              // const packageParts = name.split(/[-_]/)
              // packageParts.forEach(part => {
              //   if (part.length > 1) {
              //     words.add(part)
              //   }
              // })

              // Don't split scope names on hyphens
              // const scopeParts = scopeWithoutAt.split(/[-_]/)
              // scopeParts.forEach(part => {
              //   if (part.length > 1) {
              //     words.add(part)
              //   }
              // })
            } else {
              // Don't split regular package names on hyphens
              // const packageParts = packageName.split(/[-_]/)
              // packageParts.forEach(part => {
              //   if (part.length > 1) {
              //     words.add(part)
              //   }
              // })
            }
          }

          // Extract version without dots
          const dep = deps[packageName] as Record<string, unknown>

          // Recursively extract words from the dependency object
          extractWordsFromObject(dep)

          // Recursively process nested dependencies
          if (dep.dependencies) {
            extractDependencies(
              dep.dependencies as Record<string, unknown>,
              depth + 1
            )
          }
        }
      }

      extractDependencies(packageLock.dependencies)
    } else {
      debugLog(
        config,
        `❌ Could not find dependencies or packages in package-lock.json`
      )
    }

    debugLog(
      config,
      `✅ Finished dependency extraction, found ${words.size} unique words`
    )
  } catch (error) {
    debugLog(config, `❌ Error parsing package-lock.json: ${error}`)
  }

  debugLog(
    config,
    `📋 Final word list from package-lock.json contains ${words.size} words`
  )
  return Array.from(words).sort()
}
