# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.3] - 2025-03-06

### Fixed

- Fixed detection of unquoted package names in yarn.lock (e.g. `shiki@^1.29.2:`)

## [1.1.2] - 2025-03-06

### Fixed

- Fixed an issue where specifying multiple lockfiles with `--lockfiles` option would only process the first lockfile
- Added proper error handling when specified lockfiles don't exist
- CLI now reads version from package.json instead of hardcoding it

### Added

- Added unit tests for multiple lockfile functionality
- Added this CHANGELOG file

## [1.0.0] - 2025-02-06

### Added

- Initial release
- Support for extracting words from various lockfiles:
  - package-lock.json (npm)
  - yarn.lock
  - Gemfile.lock
  - composer.lock
  - Cargo.lock
  - poetry.lock
  - Pipfile.lock
  - go.sum and go.mod
- CLI tool for generating dictionaries
- Integration with CSpell
