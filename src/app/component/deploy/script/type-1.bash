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

INSTALL_BASE_DIR="$1"	# example : "/methode/methdig/methode-servlets"
INSTALL_FOLDER="$2"  	# example : "swing-3.2.5"
ARCHIVE_FILENAME="$3" # example : "swing-standalone-3.5.0-20170718.141633-59-RC.tar.gz"
SYMLINK_NAME="$4"   	# example : "swing"

INSTALL_DIRNAME="$INSTALL_BASE_DIR/$INSTALL_FOLDER"	# where the archive is uncompressed
WORK_DIR="$INSTALL_DIRNAME"

if [ ! -f "$WORK_DIR/$ARCHIVE_FILENAME" ]
then
	echo "error:archive file not found : $WORK_DIR/$ARCHIVE_FILENAME"
	exit 1
fi

echo "log:uncompress archive $ARCHIVE_FILENAME"
cd $WORK_DIR
tar -xvf "$ARCHIVE_FILENAME"    # create a folder named swing-tomcat-8.5-standalone

echo "log:copying files to install folder"
cp -rva ./swing-tomcat-*-standalone/swing/* "$INSTALL_DIRNAME"

# preparing upgrade for ./lib/swing/embaselib
if [ ! -d "$INSTALL_BASE_DIR/lib/swing" ]
then
	echo "error:folder $INSTALL_BASE_DIR/lib/swing not found"
	exit 2
fi

# backup existing swing embaselib
if [ -d "$INSTALL_BASE_DIR/lib/swing/embaselib" ]
then
	echo "log:backup $INSTALL_BASE_DIR/lib/swing/embaselib"
	mv "$INSTALL_BASE_DIR/lib/swing/embaselib" "$INSTALL_BASE_DIR/lib/swing/embaselib.$(date +%Y%m%d-%H%M%S)"
fi

echo "log:copy $INSTALL_DIRNAME/embaselib"
cp  -rva "$INSTALL_DIRNAME/embaselib" "$INSTALL_BASE_DIR/lib/swing"

# update softlink
echo "log:update softlink $SYMLINK_NAME"
ln -sfn "$INSTALL_DIRNAME" "$INSTALL_BASE_DIR/$SYMLINK_NAME"

# cleanup
echo "log:cleanup"
rm -rf "$WORK_DIR/swing-tomcat-*-standalone"
rm -rf "$WORK_DIR/embaselib"
# rm "$WORK_DIR/$ARCHIVE_FILENAME"


echo "done:$EXIT_CODE"
exit $EXIT_CODE
