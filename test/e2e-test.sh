#!/bin/bash
set -e

echo "Running E2E integration test for cspell-lockfile-dictionaries plugin"

# Get the absolute path to the project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "Project root: $PROJECT_ROOT"

# Disable project .cspell.json
mv "$PROJECT_ROOT/.cspell.json" "$PROJECT_ROOT/.cspell.json.disabled" || true

# Enable on exit
TRAP_SCRIPT="mv $PROJECT_ROOT/.cspell.json.disabled $PROJECT_ROOT/.cspell.json"
trap '$TRAP_SCRIPT' EXIT

CSPELL_BIN="$PROJECT_ROOT/node_modules/.bin/cspell"

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

mkdir -p .cspell
touch .cspell/empty.txt

# Function to test dictionary generation and spell checking
test_dictionary() {
  local name=$1
  local lockfiles=$2
  local expected_words=$3
  local dict_path=".cspell/lockfile-words-${name}.txt"
  
  echo "=== Testing ${name} ==="
  
  # Generate the dictionary
  echo "Generating dictionary from ${lockfiles}..."
  node "$PROJECT_ROOT/dist/cli.js" --path "${dict_path}" --lockfiles ${lockfiles}
  
  # Ensure the dictionary file exists
  if [ ! -f "${dict_path}" ]; then
    echo "Error: Dictionary file was not generated"
    exit 1
  fi
  
  # Check if expected words are in the dictionary
  echo "Checking for expected words in the dictionary..."
  for word in ${expected_words}; do
    if ! grep -q "${word}" "${dict_path}"; then
      echo "Error: Expected word '${word}' not found in dictionary"
      exit 1
    else
      echo "✅ Found expected word: ${word}"
    fi
  done
  
  # Run cspell with dictionary disabled - should find all errors
  echo "Running cspell with dictionary disabled..."
  DISABLED_OUTPUT=$($CSPELL_BIN --config test-none.cspell.json test.txt --words-only || true)
  DISABLED_ERRORS=$(echo "$DISABLED_OUTPUT" | wc -l)
  
  # Run cspell with this dictionary enabled
  echo "Running cspell with ${name} dictionary enabled..."
  ENABLED_OUTPUT=$($CSPELL_BIN --config "test-${name}.cspell.json" test.txt --words-only || true)
  ENABLED_ERRORS=$(echo "$ENABLED_OUTPUT" | wc -l)
  
  # Verify that enabling the dictionary reduced the number of errors
  echo "Errors with dictionary disabled: $DISABLED_ERRORS"
  echo "Errors with ${name} dictionary enabled: $ENABLED_ERRORS"
  
  if [ "$ENABLED_ERRORS" -ge "$DISABLED_ERRORS" ]; then
    echo "E2E test failed: CSpell did not reduce the number of spelling errors with ${name} dictionary"
    exit 1
  fi
  
  echo "✅ ${name} test passed"
  echo ""
}

# Test Gemfile.lock only
test_dictionary "ruby" "Gemfile.lock" "gemfilespecc gemfilespecb gemfilespeca"

# Test package-lock.json only
test_dictionary "npm" "package-lock.json" "dict-monkeyc is-arrayish iojs"

# Test both lockfiles together
test_dictionary "combined" "package-lock.json Gemfile.lock" "gemfilespecc dict-monkeyc is-arrayish iojs"

echo "=== Final Test With Auto-Detected Lockfiles ==="

# Generate the combined dictionary
echo "Generating combined dictionary..."
node "$PROJECT_ROOT/dist/cli.js"

# Run cspell with dictionary disabled - should find all errors
echo "Running cspell with dictionary disabled..."
DISABLED_OUTPUT=$($CSPELL_BIN --config test-none.cspell.json test.txt --words-only || true)
DISABLED_ERRORS=$(echo "$DISABLED_OUTPUT" | wc -l)

# Run cspell with dictionary enabled - should only find real spelling errors
echo "Running cspell with auto-detection dictionary enabled..."
ENABLED_OUTPUT=$($CSPELL_BIN --config test-auto.cspell.json test.txt --words-only || true)
ENABLED_ERRORS=$(echo "$ENABLED_OUTPUT" | wc -l)

# Verify that enabling the dictionary reduced the number of errors
echo "Errors with dictionary disabled: $DISABLED_ERRORS"
echo "Errors with auto-detection dictionary enabled: $ENABLED_ERRORS"

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

# Check that the expected words are not flagged as errors
for word in "gemfilespecc" "dict-monkeyc" "is-arrayish" "iojs"; do
  if echo "$ENABLED_OUTPUT" | grep -q "$word"; then
    echo "Error: Word '$word' should not be flagged as a spelling error"
    exit 1
  else
    echo "✅ Word '$word' correctly ignored by the spell checker"
  fi
done

# Check that the real spelling errors are still caught
for word in "mispeling" "recieved" "ohokthen"; do
  if ! echo "$ENABLED_OUTPUT" | grep -q "$word"; then
    echo "Error: Real spelling error '$word' was not caught"
    exit 1
  else
    echo "✅ Real spelling error '$word' correctly caught"
  fi
done

echo "✅ E2E test passed: CSpell correctly ignored package names while catching real spelling errors"
exit 0
