

/*******************************************************************************
* Model Constructor ************************************************************
*******************************************************************************/

function Model () {

    this.data = {}
    this.listeners = {
        change: [],
        add:    [],
        remove: [],
        data:   {}
    }
    this.dataids = {}
}

/* events

add: { name, value }
change: { name, value }
remove: { name }

*/

/*******************************************************************************
* Private Functions ************************************************************
*******************************************************************************/



function model_getListener ( evt ) {
    var list = this.listeners[evt],
        e


    if ( !list ) {
        e = evt.slice( 7 )
        list  = this.listeners.data[e]
    }

    if ( !list )
        list = this.listeners.data[e] = []


    return list
}





/*******************************************************************************
* Public Functions *************************************************************
*******************************************************************************/



Model.prototype = {



    get: function ( name, def ) {
        var i    = 0,
            d    = this.data,
            path = name.split( '.' ),
            t    = path.length,
            cur



        for ( ; i < t; i++ ) {
            cur = path[i]

            if ( ! d.hasOwnProperty( cur ) )
                return def

            d = d[cur]
        }


        return d
    },




    set: function ( name, value ) {
        if ( !name )
            return this

        var i    = 0,
            d    = this.data,
            add  = false,
            path = name.split( '.' ),
            t    = path.length - 1,
            cur




        for ( ; i < t; i++ ) {
            cur = path[i]

            if ( d.hasOwnProperty( cur ) ) {
                d = d[cur]
                continue
            }

            d[cur] = {}
            d = d[cur]

            add = true
        }




        cur = path[i]




        if ( ! d.hasOwnProperty( cur ) )
            add = true


        d[cur] = value

        // keep a record so we can export if needed
        this.dataids[name] = true



        if ( add ) {

            if ( !this.listeners.data[name] )
                this.listeners.data[name] = []

            this.trigger( 'add', { name: name, value: value } )

        }
        else
            this.trigger( 'change', { name: name, value: value } )


        this.trigger( 'change:' + name, { name: name, value: value } )

        return this
    },



    /*
    unset: function ( name ) {
        if ( !name || !this.data.hasOwnProperty( name ) )
            return this

        delete this.data[name]

        delete this.listeners.data[name]

        this.trigger( 'remove', { name: name } )

        return this
    },*/



/*


    empty: function ( do_not_trigger ) {
        // TODO: implement
    },

*/

    on: function ( evt, cb ) {
        if ( !evt || !cb )
            return this


        var list = model_getListener.call( this, evt )


        list.push( cb )


        return this
    },


    off: function ( evt, cb ) {
        if ( !evt )
            return this

        var list = model_getListener.call( this, evt ),
            i

        if ( !cb ) {
            list = []
            return this
        }

        i = list.indexOf( cb )

        if ( ~i )
            list.splice( i, 1 )

        return this
    },


    trigger: function ( evt, data ) {
        if ( !evt )
            return this

        var ns = evt.split( '.' ),
            i  = ns.length,
            j  = 0,
            list, l, e

        for (; i > 0; i-- ) {
            e = ns.slice( 0, i ).join( '.' )

            list = model_getListener.call( this, e )


            if ( !list )
                return this

            for ( j = 0; l = list[j]; j++ )
                l( this, e, data )

        }
        return this
    },

    loadState: function ( data ) {
        // TODO: is there a better way to import / export? should we trigger
        // on import / export
        for ( var i in data )
            this.set( i, data[i] )
    },

    saveState: function () {
        var ex = {},
            i

        for ( i in this.dataids )
            ex[i] = this.get( i )

        return ex
    }

}


