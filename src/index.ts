#!/usr/bin/env node

// Export configuration
export { LockfileDictionariesConfig, defaultConfig } from './config.ts'

// Export utilities
export { generateDictionary, saveDictionary } from './utils.ts'

// Export lockfile types
export { LockfileType, detectLockfileType } from './lockfileTypes.ts'

// Export extractors
export { extractWordsFromFile } from './extractors.ts'
