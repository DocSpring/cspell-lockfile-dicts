#!/bin/bash
set -e

echo "Running E2E integration test for cspell-lockfile-dictionaries plugin"

# Get the absolute path to the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "Project root: $PROJECT_ROOT"

# First, build the project
echo "Building project..."
cd "$PROJECT_ROOT"
npm run build

# Change to the test directory
cd "$PROJECT_ROOT/test"
echo "Current directory: $(pwd)"

# Clean up any existing .cspell directory
echo "Cleaning up any existing .cspell directory..."
if [ -d ".cspell" ]; then
  rm -rf .cspell
fi

# Generate the dictionary from test lockfiles
echo "Generating dictionary from test lockfiles..."
node "$PROJECT_ROOT/dist/cli.js" --path .cspell/lockfile-words.txt --lockfiles package-lock.json,Gemfile.lock

# Ensure the dictionary file exists
if [ ! -f .cspell/lockfile-words.txt ]; then
  echo "Error: Dictionary file was not generated"
  exit 1
fi

# Run cspell with dictionary disabled - should find all errors
echo "Running cspell with dictionary disabled..."
DISABLED_OUTPUT=$(npx cspell --config test-disabled.cspell.json test.txt --words-only || true)
DISABLED_ERRORS=$(echo "$DISABLED_OUTPUT" | wc -l)

# Run cspell with dictionary enabled - should only find real spelling errors
echo "Running cspell with dictionary enabled..."
ENABLED_OUTPUT=$(npx cspell --config test-enabled.cspell.json test.txt --words-only || true)
ENABLED_ERRORS=$(echo "$ENABLED_OUTPUT" | wc -l)

# Verify that enabling the dictionary reduced the number of errors
echo "Errors with dictionary disabled: $DISABLED_ERRORS"
echo "Errors with dictionary enabled: $ENABLED_ERRORS"

# The enabled errors should be less than disabled errors
if [ "$ENABLED_ERRORS" -ge "$DISABLED_ERRORS" ]; then
  echo "E2E test failed: CSpell did not reduce the number of spelling errors"
  exit 1
fi

# The enabled errors should be exactly 3 (the real spelling errors)
if [ "$ENABLED_ERRORS" -ne 3 ]; then
  echo "E2E test failed: CSpell should have caught exactly 3 real spelling errors"
  exit 1
fi

echo "E2E test passed: CSpell correctly ignored package names while catching real spelling errors"
exit 0
