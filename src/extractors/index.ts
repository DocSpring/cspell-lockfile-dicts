import * as fs from 'fs'
import { LockfileType } from '../lockfileTypes.js'
import { LockfileDictionariesConfig } from '../config.js'
import { debugLog } from '../utils.js'

// Import all extractors
import { extractFromPackageLock } from './npm.js'
import { extractFromYarnLock } from './yarn.js'
import { extractFromGemfileLock } from './ruby.js'
import { extractFromComposerLock } from './composer.js'
import { extractFromCargoLock } from './cargo.js'
import { extractFromPythonLock } from './python.js'
import { extractFromGoSum, extractFromGoMod } from './go.js'
import { extractFromPoetryLock } from './poetry.js'
import { extractFromPipfileLock } from './pipenv.js'

/**
 * Extract words from a file based on its type
 * @param filePath Path to the file
 * @param fileType Type of the file
 * @param debug Whether to enable debug logging
 * @returns Array of extracted words
 */
export async function extractWordsFromFile(
  filePath: string,
  fileType: LockfileType,
  debug: boolean = false
): Promise<string[]> {
  const config: LockfileDictionariesConfig = { debug }

  debugLog(config, `🔍 Reading file content from ${filePath}`)
  const fileContent = fs.readFileSync(filePath, 'utf8')
  debugLog(config, `📄 File content length: ${fileContent.length} characters`)

  let result: string[] = []
  switch (fileType) {
    case LockfileType.GEMFILE_LOCK:
      debugLog(config, `🔍 Extracting words from Gemfile.lock`)
      result = extractFromGemfileLock(fileContent)
      break
    case LockfileType.YARN_LOCK:
      debugLog(config, `🔍 Extracting words from yarn.lock`)
      result = extractFromYarnLock(fileContent)
      break
    case LockfileType.PACKAGE_LOCK:
      debugLog(config, `🔍 Extracting words from package-lock.json`)
      result = extractFromPackageLock(fileContent, config)
      break
    case LockfileType.COMPOSER_LOCK:
      debugLog(config, `🔍 Extracting words from composer.lock`)
      result = extractFromComposerLock(fileContent)
      break
    case LockfileType.CARGO_LOCK:
      debugLog(config, `🔍 Extracting words from Cargo.lock`)
      result = extractFromCargoLock(fileContent)
      break
    case LockfileType.POETRY_LOCK:
      debugLog(config, `🔍 Extracting words from poetry.lock`)
      result = extractFromPoetryLock(fileContent)
      break
    case LockfileType.PIPFILE_LOCK:
      debugLog(config, `🔍 Extracting words from Pipfile.lock`)
      result = extractFromPipfileLock(fileContent, config)
      break
    case LockfileType.GO_SUM:
      debugLog(config, `🔍 Extracting words from go.sum`)
      result = extractFromGoSum(fileContent)
      break
    case LockfileType.GO_MOD:
      debugLog(config, `🔍 Extracting words from go.mod`)
      result = extractFromGoMod(fileContent)
      break
    default:
      debugLog(config, `⚠️ No extractor found for file type ${fileType}`)
      result = []
      break
  }

  debugLog(config, `✅ Extracted ${result.length} words from ${filePath}`)
  return result
}

// Re-export all extractors
export {
  extractFromPackageLock,
  extractFromYarnLock,
  extractFromGemfileLock,
  extractFromComposerLock,
  extractFromCargoLock,
  extractFromPythonLock,
  extractFromGoSum,
  extractFromGoMod,
  extractFromPoetryLock,
  extractFromPipfileLock,
}
