import type { Plugin } from '@cspell/cspell-types'
import { LockfileDictionariesConfig, defaultConfig } from './config.ts'
import { LockfileParser } from './parser.ts'
import { debugLog } from './utils.ts'

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
