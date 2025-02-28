#!/bin/bash
set -e

echo "Running E2E integration test for cspell-lockfile-dictionaries plugin"

# Debug: Show current directory and files
echo "Current directory: $(pwd)"
echo "Contents of current directory:"
ls -la
echo "Contents of dist directory:"
ls -la dist
echo "Contents of test directory:"
ls -la test
echo "cspell-ext.json content:"
cat cspell-ext.json
echo "test-enabled.json content:"
cat test/test-enabled.json

# Run cspell with plugin disabled - should find all errors
echo "Running cspell with plugin disabled..."
DISABLED_OUTPUT=$(npx cspell --config test/test-disabled.json test/test-cspell-plugin.txt --words-only)
DISABLED_ERRORS=$(echo "$DISABLED_OUTPUT" | wc -l)
echo "Disabled plugin output:"
echo "$DISABLED_OUTPUT"

# Run cspell with plugin enabled - should only find real spelling errors
echo "Running cspell with plugin enabled..."
# Add --trace flag to see more details about plugin loading
echo "IMPORTANT: Running cspell from directory: $(pwd)"
echo "Running: npx cspell --config test/test-enabled.json test/test-cspell-plugin.txt --words-only --trace"
ENABLED_OUTPUT=$(npx cspell --config test/test-enabled.json test/test-cspell-plugin.txt --words-only --trace)
ENABLED_ERRORS=$(echo "$ENABLED_OUTPUT" | wc -l)
echo "Enabled plugin output:"
echo "$ENABLED_OUTPUT"

# Debug: Run cspell with trace logging
echo "Running cspell with trace logging..."
npx cspell --config test/test-enabled.json test/test-cspell-plugin.txt --trace

# Verify that the plugin reduced the number of errors
echo "Errors with plugin disabled: $DISABLED_ERRORS"
echo "Errors with plugin enabled: $ENABLED_ERRORS"

# The enabled errors should be less than disabled errors
if [ "$ENABLED_ERRORS" -ge "$DISABLED_ERRORS" ]; then
  echo "E2E test failed: Plugin did not reduce the number of spelling errors"
  exit 1
fi

# The enabled errors should be exactly 3 (the real spelling errors)
if [ "$ENABLED_ERRORS" -ne 3 ]; then
  echo "E2E test failed: Plugin should have caught exactly 3 real spelling errors"
  exit 1
fi

echo "E2E test passed: Plugin correctly ignored package names while catching real spelling errors"
exit 0
