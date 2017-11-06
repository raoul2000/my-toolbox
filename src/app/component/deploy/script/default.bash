#!/bin/bash

. "$HOME"/.bash_profile

set -u
set -e

#set -x
#trap read debug

SCRIPT_HOME=$(dirname "$0")
SCRIPT_NAME=$(basename "$0")
EXIT_CODE=0

echo "start:"
echo "cwd:$(pwd)"
echo "args: $*"

INSTALL_BASE_DIR="$1"	# example : "/methode/methXX/methode-servlets"
INSTALL_FOLDER="$2"  	# example : "webapp-3.2.5"
ARCHIVE_FILENAME="$3" # example : "webapp-3.2.5.tar.gz"
SYMLINK_NAME="$4"   	# example : "webapp"

INSTALL_DIRNAME="$INSTALL_BASE_DIR/$INSTALL_FOLDER"	# where the archive is uncompressed
WORK_DIR="$INSTALL_DIRNAME"

if [ ! -f "$WORK_DIR/$ARCHIVE_FILENAME" ]
then
	echo "error:archive file not found : $WORK_DIR/$ARCHIVE_FILENAME"
	exit 1
fi

echo "log:uncompress archive war file : $ARCHIVE_FILENAME"
cd $WORK_DIR
unzip -qo "$ARCHIVE_FILENAME"

# update softlink
echo "log:update softlink $SYMLINK_NAME"
ln -sfn "$INSTALL_DIRNAME" "$INSTALL_BASE_DIR/$SYMLINK_NAME"

echo "done:$EXIT_CODE"
exit $EXIT_CODE
