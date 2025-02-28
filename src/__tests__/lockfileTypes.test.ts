import { LockfileType, detectLockfileType } from '../lockfileTypes'

describe('detectLockfileType', () => {
  it('should detect Gemfile.lock', () => {
    expect(detectLockfileType('/path/to/Gemfile.lock')).toBe(
      LockfileType.GEMFILE_LOCK
    )
  })

  it('should detect yarn.lock', () => {
    expect(detectLockfileType('/path/to/yarn.lock')).toBe(
      LockfileType.YARN_LOCK
    )
  })

  it('should detect package-lock.json', () => {
    expect(detectLockfileType('/path/to/package-lock.json')).toBe(
      LockfileType.PACKAGE_LOCK
    )
  })

  it('should detect composer.lock', () => {
    expect(detectLockfileType('/path/to/composer.lock')).toBe(
      LockfileType.COMPOSER_LOCK
    )
  })

  it('should detect Cargo.lock', () => {
    expect(detectLockfileType('/path/to/Cargo.lock')).toBe(
      LockfileType.CARGO_LOCK
    )
  })

  it('should detect poetry.lock', () => {
    expect(detectLockfileType('/path/to/poetry.lock')).toBe(
      LockfileType.POETRY_LOCK
    )
  })

  it('should detect Pipfile.lock', () => {
    expect(detectLockfileType('/path/to/Pipfile.lock')).toBe(
      LockfileType.PIPFILE_LOCK
    )
  })

  it('should detect gradle lockfiles', () => {
    expect(detectLockfileType('/path/to/dependencies.gradle.lockfile')).toBe(
      LockfileType.GRADLE_LOCK
    )
  })

  it('should detect go.sum', () => {
    expect(detectLockfileType('/path/to/go.sum')).toBe(LockfileType.GO_SUM)
  })

  it('should detect go.mod', () => {
    expect(detectLockfileType('/path/to/go.mod')).toBe(LockfileType.GO_MOD)
  })

  it('should return undefined for unknown files', () => {
    expect(detectLockfileType('/path/to/unknown.file')).toBeUndefined()
  })

  it('should be case insensitive', () => {
    expect(detectLockfileType('/path/to/GEMFILE.LOCK')).toBe(
      LockfileType.GEMFILE_LOCK
    )
    expect(detectLockfileType('/path/to/YARN.LOCK')).toBe(
      LockfileType.YARN_LOCK
    )
  })
})
