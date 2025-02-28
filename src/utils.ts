import * as fs from 'fs'
import { LockfileDictionariesConfig, defaultConfig } from './config.ts'
import { extractWordsFromFile } from './extractors.ts'
import { detectLockfileType } from './lockfileTypes.ts'

/**
 * Debug logger that only logs when debug is enabled
 */
export function debugLog(
  config: LockfileDictionariesConfig,
  ...args: unknown[]
): void {
  if (config.debug) {
    console.log(...args)
  }
}

/**
 * Generate a dictionary from lockfiles
 * @param config Configuration options
 * @returns Array of words extracted from lockfiles
 */
export async function generateDictionary(
  config: LockfileDictionariesConfig = {}
): Promise<string[]> {
  const mergedConfig = { ...defaultConfig, ...config }

  debugLog(
    mergedConfig,
    '🔍 generateDictionary called with config:',
    JSON.stringify(config, null, 2)
  )
  debugLog(
    mergedConfig,
    '🔍 Merged config:',
    JSON.stringify(mergedConfig, null, 2)
  )

  if (!mergedConfig.enabled) {
    debugLog(
      mergedConfig,
      '❌ Dictionary generation disabled, returning empty array'
    )
    return []
  }

  const lockfilePaths: string[] = []

  // Add explicitly specified lockfiles
  if (mergedConfig.lockfiles && mergedConfig.lockfiles.length > 0) {
    debugLog(
      mergedConfig,
      '📋 Using explicitly specified lockfiles:',
      mergedConfig.lockfiles
    )
    lockfilePaths.push(...mergedConfig.lockfiles)
  }

  // Auto-detect lockfiles if enabled
  if (mergedConfig.autoDetect && mergedConfig.autoDetectPatterns) {
    debugLog(
      mergedConfig,
      '🔎 Auto-detecting lockfiles with patterns:',
      mergedConfig.autoDetectPatterns
    )
    // In a real implementation, we would use glob to find files matching the patterns
    // For now, we'll just check if the files exist in the current directory
    for (const pattern of mergedConfig.autoDetectPatterns) {
      const filename = pattern.replace(/^\*\*\//, '')
      debugLog(mergedConfig, `🔍 Checking if ${filename} exists...`)
      if (fs.existsSync(filename)) {
        debugLog(mergedConfig, `✅ Found lockfile: ${filename}`)
        lockfilePaths.push(filename)
      } else {
        debugLog(mergedConfig, `❌ Lockfile not found: ${filename}`)
      }
    }
  }

  debugLog(
    mergedConfig,
    '📋 Final list of lockfiles to process:',
    lockfilePaths
  )

  // Extract words from all lockfiles
  const allWords = new Set<string>()
  const wordsBySource: Record<string, string[]> = {}

  for (const lockfilePath of lockfilePaths) {
    try {
      debugLog(mergedConfig, `🔍 Processing lockfile: ${lockfilePath}`)
      const fileType = detectLockfileType(lockfilePath)

      if (fileType) {
        debugLog(
          mergedConfig,
          `✅ Detected file type: ${fileType} for ${lockfilePath}`
        )
        const words = await extractWordsFromFile(
          lockfilePath,
          fileType,
          mergedConfig.debug
        )
        debugLog(
          mergedConfig,
          `📝 Extracted ${words.length} words from ${lockfilePath}`
        )
        words.forEach((word) => allWords.add(word))
        wordsBySource[lockfilePath] = words
      } else {
        debugLog(
          mergedConfig,
          `❌ Could not detect file type for ${lockfilePath}`
        )
      }
    } catch (error) {
      debugLog(mergedConfig, `❌ Error processing ${lockfilePath}:`, error)
    }
  }

  const result = Array.from(allWords).sort()
  debugLog(mergedConfig, `✅ Final dictionary contains ${result.length} words`)

  // Save the dictionary with source comments
  if (result.length > 0) {
    saveDictionary(result, wordsBySource, mergedConfig)
  }

  return result
}

/**
 * Save a dictionary to a file
 * @param words Words to save
 * @param wordsBySource Words grouped by source file
 * @param config Configuration options
 */
export function saveDictionary(
  words: string[],
  wordsBySource: Record<string, string[]>,
  config: LockfileDictionariesConfig = {}
): string {
  const mergedConfig = { ...defaultConfig, ...config }
  const dictionaryPath =
    mergedConfig.dictionaryPath || '.cspell/lockfile-words.txt'

  // Ensure the directory exists
  const dirPath = dictionaryPath.substring(0, dictionaryPath.lastIndexOf('/'))
  if (dirPath && !fs.existsSync(dirPath)) {
    debugLog(mergedConfig, `📁 Creating directory: ${dirPath}`)
    fs.mkdirSync(dirPath, { recursive: true })
  }

  // Create the dictionary content with comments
  let content = '# CSpell Lockfile Words\n'
  content += '# Generated on ' + new Date().toISOString() + '\n\n'

  // Add all words sorted alphabetically
  content += '# All words (sorted alphabetically)\n'
  content += words.join('\n') + '\n\n'

  // Add words by source
  for (const [source, sourceWords] of Object.entries(wordsBySource)) {
    if (sourceWords.length > 0) {
      content += `# Words from ${source} (${sourceWords.length} words)\n`
      content += '# ' + '-'.repeat(40) + '\n'
      content += sourceWords.sort().join('\n') + '\n\n'
    }
  }

  // Write the file
  fs.writeFileSync(dictionaryPath, content)
  debugLog(mergedConfig, `📝 Dictionary saved to ${dictionaryPath}`)

  return dictionaryPath
}
