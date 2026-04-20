#!/bin/bash
# format-on-save.sh — Auto-format files after Claude edits them.
#
# oxfmt handles JS/TS/JSX/TSX/CSS/MD/JSON/HTML.
# prettier (with prettier-plugin-sql) handles SQL.
# Anything else: no-op.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Skip non-existent files (e.g. after a failed write)
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Skip files outside the project
PROJECT_DIR=$(echo "$INPUT" | jq -r '.cwd // empty')
if [ -n "$PROJECT_DIR" ] && ! echo "$FILE_PATH" | grep -q "^$PROJECT_DIR"; then
  exit 0
fi

# Skip files that shouldn't be touched
if echo "$FILE_PATH" | grep -qE '(node_modules|\.git|dist|\.next|\.cache|\.nitro|\.output)/'; then
  exit 0
fi

# Skip the TanStack Router auto-generated route tree
if echo "$FILE_PATH" | grep -qE 'routeTree\.gen\.ts$'; then
  exit 0
fi

# oxfmt respects .prettierignore / .gitignore in cwd, and walks up from cwd
# to discover .oxfmtrc.json. Run it with cwd=dirname so the nearest workspace
# config (e.g. start-app/.oxfmtrc.json) is picked up, and pass an empty
# ignore file so the repo-root .prettierignore (which excludes start-app from
# prettier) doesn't also exclude start-app from oxfmt.
if echo "$FILE_PATH" | grep -qE '\.sql$'; then
  npx prettier --write "$FILE_PATH" > /dev/null 2>&1
elif echo "$FILE_PATH" | grep -qE '\.(tsx?|jsx?|mjs|cjs|json|jsonc|css|md|html)$'; then
  (cd "$(dirname "$FILE_PATH")" && npx oxfmt --ignore-path=/dev/null "$FILE_PATH" > /dev/null 2>&1)
fi

exit 0
