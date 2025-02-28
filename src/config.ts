/**
 * Configuration options for the lockfile dictionaries plugin
 */
export interface LockfileDictionariesConfig {
  /**
   * Paths to lockfiles to extract words from
   */
  lockfiles?: string[]

  /**
   * Whether to enable the plugin
   * @default true
   */
  enabled?: boolean

  /**
   * Whether to automatically detect lockfiles in the project
   * @default true
   */
  autoDetect?: boolean

  /**
   * Patterns to use for auto-detection
   */
  autoDetectPatterns?: string[]

  /**
   * Path to the dictionary file
   * @default '.cspell/lockfile-words.txt'
   */
  dictionaryPath?: string

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean
}

/**
 * Default configuration
 */
export const defaultConfig: LockfileDictionariesConfig = {
  enabled: true,
  autoDetect: true,
  autoDetectPatterns: [
    '**/package-lock.json',
    '**/yarn.lock',
    '**/Gemfile.lock',
    '**/composer.lock',
    '**/Cargo.lock',
  ],
  dictionaryPath: '.cspell/lockfile-words.txt',
  debug: false,
}
