#!/bin/sh
set -e

exec "$@" 2&> /dev/null
