#!/usr/bin/env node

import { Command } from 'commander'
import { generateDictionary } from './utils.js'
import { LockfileDictionariesConfig } from './config.js'

const program = new Command()

program
  .name('cspell-lockfile-dicts')
  .description('Generate dictionary files from package lockfiles')
  .version('1.0.0')

program
  .option('-d, --debug', 'Enable debug logging')
  .option(
    '-p, --path <path>',
    'Path to save the dictionary file',
    '.cspell/lockfile-words.txt'
  )
  .option(
    '-l, --lockfiles <files...>',
    'Specific lockfiles to process (comma-separated)'
  )
  .option(
    '--no-auto-detect',
    'Disable auto-detection of lockfiles in the project'
  )
  .option(
    '-a, --auto-detect-patterns <patterns...>',
    'Glob patterns for auto-detecting lockfiles (comma-separated)',
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

  const config: LockfileDictionariesConfig = {
    debug: options.debug || false,
    dictionaryPath: options.path,
    autoDetect: options.autoDetect !== false,
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
      console.log('1. Link the package to cspell:')
      console.log('')
      console.log('```')
      console.log('cspell link add cspell-lockfile-dicts')
      console.log('```')
      console.log('')
      console.log('2. Add the following to your cspell.json file:')
      console.log('')
      console.log('```json')
      console.log('{')
      console.log('  "import": ["cspell-lockfile-dicts/cspell-ext.json"]')
      console.log('}')
      console.log('```')
    } else {
      console.log('❌ No words were found in lockfiles')
    }
  } catch (error) {
    console.error('❌ Error generating dictionary:', error)
    process.exit(1)
  }
})

program.parse(process.argv)
