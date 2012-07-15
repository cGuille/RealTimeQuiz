#!/bin/sh

node -v >/dev/null 2>&1 || { echo >&2 "Error: Node.js does not seem to be installed. Aborting."; exit 1; }
node lib/server.js
echo -e "\nEXIT STATUS: $?"
