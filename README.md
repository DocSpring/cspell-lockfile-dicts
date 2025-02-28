# cspell-lockfile-dicts

A tool that extracts package names from various lockfiles and adds them to a CSpell dictionary file.

## Requirements

| Tool                                                                                                                                 | Version |
| ------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| [cspell](https://github.com/streetsidesoftware/cspell)                                                                               | `>= 6`  |
| [Code Spell Checker - Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) | `>= 2`  |

## Installation

Global Install and add to cspell global settings.

```sh
npm install -g cspell-lockfile-dicts
cspell link add cspell-lockfile-dicts
```

## Uninstall from cspell

```sh
cspell link remove cspell-lockfile-dicts
```

## Manual Installation

The `cspell-ext.json` file in this package should be added to the import section in your cspell.json file.

```javascript
{
  // …
  "import": ["cspell-lockfile-dicts/cspell-ext.json"],
  // …
}
```

## Usage

### Step 1: Generate the Dictionary

Run the CLI tool to generate a dictionary from your lockfiles:

```bash
npx cspell-lockfile-dicts
```

This will:

1. Scan your project for lockfiles (package-lock.json, yarn.lock, etc.)
2. Extract package names from those lockfiles
3. Generate a `.cspell/lockfile-words.txt` file in your project root

### Step 2: Add the Dictionary to CSpell

After installing the package, add the dictionary to your CSpell configuration (e.g., `.cspell.json` or `cspell.json`):

```json
{
  "dictionaries": ["lockfile-dicts"]
}
```

This will include the generated dictionary in your spell checking.

**Important**: You need to run the `cspell-lockfile-dicts` command whenever your dependencies change to keep the dictionary up-to-date.

## CLI Options

The tool supports the following command-line options:

```
Options:
  -d, --debug                         Enable debug logging
  -p, --path <path>                   Path to save the dictionary file (default: ".cspell/lockfile-words.txt")
  -l, --lockfiles <files...>          Specific lockfiles to process (comma-separated)
  --no-auto-detect                    Disable auto-detection of lockfiles in the project
  -a, --auto-detect-patterns <patterns...>  Glob patterns for auto-detecting lockfiles (comma-separated)
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

- `package-lock.json` (npm)
- `yarn.lock` (Yarn)
- `Gemfile.lock` (Ruby/Bundler)
- `composer.lock` (PHP/Composer)
- `Cargo.lock` (Rust/Cargo)

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
      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'chore: update cspell lockfile dictionary'
          file_pattern: .cspell/lockfile-words.txt
```

## License

MIT
