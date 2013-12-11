#!/bin/bash

clean() {
    rm -rf "debug"
    rm -rf "release"
}

build() {
    OUT=$( [[ "$1" == "release" ]] && echo "release" || echo "debug" )
    SRC="src"

    mkdir  "$OUT"

    buildr "file:$SRC/jqmvc.js" $( [[ ! "$1" == "release" ]] && echo "compress" ) > "$OUT/jqmvc.js"
}

main() {
    case "$1" in
        "clean")
            clean
            ;;

        "debug")
            clean
            build "debug"
            ;;

        "release")
            clean
            build "release"
            ;;

        "push")
            ;;
    esac
}

for i in ${1+"$@"}; do
    main "$i"
done
