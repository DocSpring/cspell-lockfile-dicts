import * as path from 'path'

/**
 * Supported lockfile types
 */
export enum LockfileType {
  GEMFILE_LOCK = 'gemfile-lock',
  YARN_LOCK = 'yarn-lock',
  PACKAGE_LOCK = 'package-lock',
  COMPOSER_LOCK = 'composer-lock',
  CARGO_LOCK = 'cargo-lock',
  POETRY_LOCK = 'poetry-lock',
  PIPFILE_LOCK = 'pipfile-lock',
  GRADLE_LOCK = 'gradle-lock',
  SBT_LOCK = 'sbt-lock',
  MAVEN_LOCK = 'maven-lock',
  NUGET_LOCK = 'nuget-lock',
  PODFILE_LOCK = 'podfile-lock',
  COCOAPODS_LOCK = 'cocoapods-lock',
  MIX_LOCK = 'mix-lock',
  CARTHAGE_RESOLVED = 'carthage-resolved',
  SWIFT_RESOLVED = 'swift-resolved',
  GO_SUM = 'go-sum',
  GO_MOD = 'go-mod',
}

/**
 * Detect the lockfile type based on the file path
 * @param filePath Path to the lockfile
 * @returns The detected lockfile type or undefined if not detected
 */
export function detectLockfileType(filePath: string): LockfileType | undefined {
  const fileName = path.basename(filePath).toLowerCase()

  if (fileName === 'gemfile.lock') {
    return LockfileType.GEMFILE_LOCK
  }

  if (fileName === 'yarn.lock') {
    return LockfileType.YARN_LOCK
  }

  if (fileName === 'package-lock.json') {
    return LockfileType.PACKAGE_LOCK
  }

  if (fileName === 'composer.lock') {
    return LockfileType.COMPOSER_LOCK
  }

  if (fileName === 'cargo.lock') {
    return LockfileType.CARGO_LOCK
  }

  if (fileName === 'poetry.lock') {
    return LockfileType.POETRY_LOCK
  }

  if (fileName === 'pipfile.lock') {
    return LockfileType.PIPFILE_LOCK
  }

  if (fileName.endsWith('.gradle.lockfile')) {
    return LockfileType.GRADLE_LOCK
  }

  if (fileName === 'build.sbt.lock') {
    return LockfileType.SBT_LOCK
  }

  if (fileName === 'pom.xml.lock') {
    return LockfileType.MAVEN_LOCK
  }

  if (fileName === 'packages.lock.json') {
    return LockfileType.NUGET_LOCK
  }

  if (fileName === 'podfile.lock') {
    return LockfileType.PODFILE_LOCK
  }

  if (fileName === 'cocoapods.lock') {
    return LockfileType.COCOAPODS_LOCK
  }

  if (fileName === 'mix.lock') {
    return LockfileType.MIX_LOCK
  }

  if (fileName === 'cartfile.resolved') {
    return LockfileType.CARTHAGE_RESOLVED
  }

  if (fileName === 'package.resolved') {
    return LockfileType.SWIFT_RESOLVED
  }

  if (fileName === 'go.sum') {
    return LockfileType.GO_SUM
  }

  if (fileName === 'go.mod') {
    return LockfileType.GO_MOD
  }

  return undefined
}
