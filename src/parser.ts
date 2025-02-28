import type { Parser, ParseResult, ParsedText } from '@cspell/cspell-types'
import { LockfileDictionariesConfig, defaultConfig } from './config.ts'
import { extractWordsFromFile } from './extractors.ts'
import { detectLockfileType } from './lockfileTypes.ts'
import { saveDictionary, debugLog } from './utils.ts'

/**
 * Lockfile Parser implementation
 */
export class LockfileParser implements Parser {
  readonly name = 'lockfile-parser'
  private config: LockfileDictionariesConfig
  private wordsBySource: Record<string, string[]> = {}
  private allWords = new Set<string>()

  constructor(config: LockfileDictionariesConfig = {}) {
    this.config = { ...defaultConfig, ...config }
  }

  parse(content: string, filename: string): ParseResult {
    debugLog(this.config, `🔍 Parsing file: ${filename}`)

    // Only process lockfiles
    const fileType = detectLockfileType(filename)
    if (!fileType) {
      debugLog(this.config, `❌ Not a recognized lockfile: ${filename}`)
      return {
        content,
        filename,
        parsedTexts: [
          {
            text: content,
            range: [0, content.length] as const,
          },
        ],
      }
    }

    // Extract words from the lockfile and save them to the dictionary file
    // We need to do this synchronously since the parse method doesn't support async
    try {
      debugLog(
        this.config,
        `✅ Detected file type: ${fileType} for ${filename}`
      )

      // Schedule the extraction to happen asynchronously
      // This won't block the parse method
      setTimeout(() => {
        extractWordsFromFile(filename, fileType, this.config.debug)
          .then((words) => {
            // Store words by source
            this.wordsBySource[filename] = words

            // Add to all words
            words.forEach((word) => this.allWords.add(word))

            // Save the dictionary
            const allWordsArray = Array.from(this.allWords).sort()
            saveDictionary(allWordsArray, this.wordsBySource, this.config)

            debugLog(
              this.config,
              `📝 Extracted ${words.length} words from ${filename} and saved to dictionary`
            )
          })
          .catch((error) => {
            debugLog(
              this.config,
              `❌ Error processing ${filename}: ${error}`,
              true
            )
          })
      }, 0)
    } catch (error) {
      debugLog(this.config, `❌ Error processing ${filename}: ${error}`, true)
    }

    // Return the original content for normal spell checking
    // We're not transforming the content, just extracting words for a dictionary
    const parsedTexts: ParsedText[] = [
      {
        text: content,
        range: [0, content.length] as const,
        scope: 'lockfile',
      },
    ]

    return {
      content,
      filename,
      parsedTexts,
    }
  }
}
