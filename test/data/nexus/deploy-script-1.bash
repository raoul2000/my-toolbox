#!/bin/bash

. "$HOME"/.bash_profile

set -u
set -e

SCRIPT_HOME=$(dirname "$0")
SCRIPT_NAME=$(basename "$0")
EXIT_CODE=0

echo "start:"
echo "args: $*"
echo "cwd:$(pwd)"

echo "done:$EXIT_CODE"
exit $EXIT_CODE
