#!/usr/bin/env node

// Export configuration
export { LockfileDictionariesConfig, defaultConfig } from './config.js'

// Export utilities
export { generateDictionary, saveDictionary } from './utils.js'

// Export lockfile types
export { LockfileType, detectLockfileType } from './lockfileTypes.js'

// Export extractors
export { extractWordsFromFile } from './extractors.js'
