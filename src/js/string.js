
$.extend( String.prototype, {


    lpad: function ( w, z ) {
        z = z || ' '
        return this.length >= w
            ? this + ''
            : new Array( w - this.length + 1 ).join( z ) + this
    },

    rpad: function ( w, z ) {
        z = z || ' '
        return this.length >= w
            ? this + ''
            : this + new Array( w - this.length + 1 ).join( z )
    },

    trim: function () {
        return this.replace( /^\s+|\s+$/g, '' )
    },

    toNode: function () {
        var div = document.createElement( 'div' )
        div.innerHTML = this
        return div.firstElementChild
    },

    insertCharAt: function ( c, i ) {
        i = i < 0 && this.length + i >= 0
          ? this.length + i
          : i > this.length || i < 0
          ? this.length
          : i

        return this.slice( 0, i) + c + this.slice( i )
    },

    fuzzy: function ( s ) {
        var hay = this.toLowerCase(),
            i   = 0,
            n   = 0,
            c

        s = s.toLowerCase()

        while ( c = s[i++] )
            if ( ! ( n = hay.indexOf( c, n ) + 1 ) )
                return false

        return true
    }

} )

$.extend( Array.prototype, {

    each: function( cb ) {
        for ( var i = 0, l = this.length; i < l; i++ )
            cb( this[i], i, this )
    }

} )

