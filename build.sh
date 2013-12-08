#!/bin/bash

DEBUG=true

OUT=$( [ $DEBUG ] && echo "debug" || echo "release" )
SRC="src"

rm -rf "$OUT"
mkdir  "$OUT"

JS_SRC="$SRC/jqmvc.js"
JS_OUT="$OUT/jqmvc.js"

buildr "$JS_SRC" > "$JS_OUT"
