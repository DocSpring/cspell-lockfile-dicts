#!/usr/bin/env node

import { Command } from 'commander'
import { generateDictionary } from './utils.js'
import { LockfileDictionariesConfig } from './config.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// Get package version from package.json
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf8')
)

const program = new Command()

program
  .name('cspell-lockfile-dicts')
  .description('Generate dictionary files from package lockfiles')
  .version(packageJson.version)

program
  .option('-d, --debug', 'Enable debug logging')
  .option(
    '-p, --path <path>',
    'Path to save the dictionary file',
    '.cspell/lockfile-words.txt'
  )
  .option(
    '-l, --lockfiles <files...>',
    'Specific lockfiles to process (space-separated). When specified, auto-detection is disabled.'
  )
  .option(
    '-a, --auto-detect-patterns <patterns...>',
    'Glob patterns for auto-detecting lockfiles (space-separated). Only used when --lockfiles is not specified.',
    [
      '**/package-lock.json',
      '**/yarn.lock',
      '**/Gemfile.lock',
      '**/composer.lock',
      '**/Cargo.lock',
    ]
  )

program.action(async (options) => {
  console.log('🔍 Generating dictionary from lockfiles...')

  // Auto-detection is enabled by default, but disabled when lockfiles are explicitly specified
  const autoDetect = options.lockfiles ? false : true

  const config: LockfileDictionariesConfig = {
    debug: options.debug || false,
    dictionaryPath: options.path,
    autoDetect: autoDetect,
    lockfiles: options.lockfiles,
    autoDetectPatterns: options.autoDetectPatterns,
  }

  try {
    const words = await generateDictionary(config)

    if (words.length > 0) {
      console.log(
        `✅ Dictionary generated with ${words.length} words at ${config.dictionaryPath}`
      )
      console.log('')
      console.log('To use this dictionary in your cspell configuration:')
      console.log('')
      console.log('1. Add the following to your cspell.json file:')
      console.log('')
      console.log('{')
      console.log('  "dictionaryDefinitions": [')
      console.log('    {')
      console.log('      "name": "lockfile-words",')
      console.log('      "path": "./.cspell/lockfile-words.txt",')
      console.log(
        '      "description": "Dictionary of words extracted from lockfiles"'
      )
      console.log('    }')
      console.log('  ],')
      console.log('  "dictionaries": ["lockfile-words"]')
      console.log('}')
    } else {
      console.log('❌ No words were found in lockfiles')
    }
  } catch (error) {
    console.error('❌ Error generating dictionary:', error)
    process.exit(1)
  }
})

program.parse(process.argv)
