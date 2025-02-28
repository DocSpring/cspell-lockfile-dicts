/**
 * This file is kept for backward compatibility.
 * It re-exports all extractors from the extractors directory.
 */

// Re-export the extractWordsFromFile function
export { extractWordsFromFile } from './extractors/index.ts'

// Re-export all individual extractors
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
} from './extractors/index.ts'
