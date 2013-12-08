

$.ext = function ( target, src, proto ) {
    target.prototype = Object.create( src.prototype )

    if ( !proto )
        return;

    for ( var i in proto )
        if ( proto.hasOwnProperty( i ) )
            target.prototype[i] = proto[i]
}


$.fn.at = function ( i ) {
    var i = this[i]

    if ( i === undefined )
        return;

    return $( i )
}
