import type { Plugin } from '@cspell/cspell-types'
import { LockfileDictionariesConfig, defaultConfig } from './config.js'
import { LockfileParser } from './parser.js'
import { debugLog } from './utils.js'

/**
 * Create a plugin instance with the given configuration
 */
export function createPlugin(config: LockfileDictionariesConfig = {}): Plugin {
  const mergedConfig = { ...defaultConfig, ...config }
  debugLog(
    mergedConfig,
    '🔌 Creating plugin with config:',
    JSON.stringify(config, null, 2)
  )

  return {
    parsers: [new LockfileParser(mergedConfig)],
  }
}

/**
 * Default plugin instance
 */
export const plugin: Plugin = createPlugin()
