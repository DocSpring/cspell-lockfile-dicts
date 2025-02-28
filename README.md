# cspell-lockfile-dicts

[![Test, Lint, and Spell Check](https://github.com/DocSpring/cspell-lockfile-dicts/actions/workflows/test.yml/badge.svg)](https://github.com/DocSpring/cspell-lockfile-dicts/actions/workflows/test.yml)

A tool that extracts package names from various lockfiles and adds them to a CSpell dictionary file.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

```sh
npm install -g cspell-lockfile-dicts
```

## Usage

### Step 1: Generate the Dictionary

Run the CLI tool to generate a dictionary from your lockfiles:

```bash
npx cspell-lockfile-dicts
```

This will:

1. Scan your project for lockfiles (`package-lock.json`, `yarn.lock`, `Gemfile.lock`, `composer.lock`, `Cargo.lock`, etc.)
2. Extract package names from those lockfiles
3. Generate a `.cspell/lockfile-words.txt` file in your project root

### Step 2: Add the Dictionary to CSpell

After generating the dictionary, add it to your CSpell configuration (e.g., `.cspell.json` or `cspell.json`):

```json
{
  "dictionaryDefinitions": [
    {
      "name": "lockfile-words",
      "path": "./.cspell/lockfile-words.txt",
      "description": "Dictionary of words extracted from lockfiles"
    }
  ],
  "dictionaries": ["lockfile-words"]
}
```

This will include the generated dictionary in your spell checking.

**Important**: You need to run the `cspell-lockfile-dicts` command whenever your dependencies change to keep the dictionary up-to-date.

## CLI Options

The tool supports the following command-line options:

```
Options:
  -p, --path <path>                   Path to save the dictionary file (default: ".cspell/lockfile-words.txt")
  -l, --lockfiles <files...>          Specific lockfiles to process (comma-separated)
  --no-auto-detect                    Disable auto-detection of lockfiles in the project
  -a, --auto-detect-patterns <patterns...>  Glob patterns for auto-detecting lockfiles (comma-separated)
  -d, --debug                         Enable debug logging
  -h, --help                          Display help for command
```

### Examples

Generate dictionary with debug logging:

```bash
npx cspell-lockfile-dicts --debug
```

Specify custom output path:

```bash
npx cspell-lockfile-dicts --path ./custom-dict.txt
```

Process specific lockfiles:

```bash
npx cspell-lockfile-dicts --lockfiles package-lock.json yarn.lock
```

## Supported Lockfiles

| Lockfile             | Language/Package Manager    | Status       |
| -------------------- | --------------------------- | ------------ |
| `package-lock.json`  | JavaScript/npm              | ✅ Supported |
| `yarn.lock`          | JavaScript/Yarn             | ✅ Supported |
| `Gemfile.lock`       | Ruby/Bundler                | ✅ Supported |
| `composer.lock`      | PHP/Composer                | ✅ Supported |
| `Cargo.lock`         | Rust/Cargo                  | ✅ Supported |
| `poetry.lock`        | Python/Poetry               | ✅ Supported |
| `Pipfile.lock`       | Python/Pipenv               | ✅ Supported |
| `go.sum`             | Go                          | ✅ Supported |
| `go.mod`             | Go                          | ✅ Supported |
| `pnpm-lock.yaml`     | JavaScript/pnpm             | 🔄 Pending   |
| `*.gradle.lockfile`  | Java/Gradle                 | 🔄 Pending   |
| `build.sbt.lock`     | Scala/SBT                   | 🔄 Pending   |
| `pom.xml.lock`       | Java/Maven                  | 🔄 Pending   |
| `packages.lock.json` | .NET/NuGet                  | 🔄 Pending   |
| `Podfile.lock`       | Swift/CocoaPods             | 🔄 Pending   |
| `cocoapods.lock`     | Swift/CocoaPods             | 🔄 Pending   |
| `mix.lock`           | Elixir                      | 🔄 Pending   |
| `Cartfile.resolved`  | Swift/Carthage              | 🔄 Pending   |
| `Package.resolved`   | Swift/Swift Package Manager | 🔄 Pending   |

Please feel free to open a PR to add support for other lockfiles.
(AI is pretty good at implementing them!)

## Adding to CI/CD

It's recommended to run this tool as part of your CI/CD pipeline or pre-commit hooks to keep the dictionary up-to-date with your dependencies.

Example GitHub Actions workflow:

```yaml
name: Update CSpell Dictionary

on:
  push:
    paths:
      - '**/package-lock.json'
      - '**/yarn.lock'
      - '**/Gemfile.lock'

jobs:
  update-dict:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '16'
      - run: npm install -g cspell-lockfile-dicts
      - run: cspell-lockfile-dicts
      - name: Update CSpell config
        run: |
          if [ ! -f .cspell.json ]; then
            echo '{
              "version": "0.2",
              "language": "en",
              "dictionaryDefinitions": [
                {
                  "name": "lockfile-words",
                  "path": "./.cspell/lockfile-words.txt",
                  "description": "Dictionary of words extracted from lockfiles"
                }
              ],
              "dictionaries": ["lockfile-words"]
            }' > .cspell.json
          else
            # Check if the dictionary is already configured
            if ! grep -q "lockfile-words" .cspell.json; then
              # This is a simple approach - for production use, consider using a JSON parser
              sed -i 's/"dictionaries": \[/"dictionaries": \["lockfile-words", /g' .cspell.json
              sed -i 's/"dictionaryDefinitions": \[/"dictionaryDefinitions": \[{"name": "lockfile-words", "path": "./.cspell\/lockfile-words.txt", "description": "Dictionary of words extracted from lockfiles"}, /g' .cspell.json
            fi
          fi
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'chore: update cspell lockfile dictionary'
          file_pattern: '.cspell/lockfile-words.txt .cspell.json'
```

## License

MIT
