

/*******************************************************************************
* View Constructor *************************************************************
*******************************************************************************/



function View ( model, $node ) {

    this.model = model
    this.$node = $node

    // track the listeners so we can later remove them from the model with ease
    // if we wish to destroy the view and not the model
    this.listeners = {
        add:    [],
        remove: [],
        change: [],
        data:   {}
    }

    this.on( 'change', $.proxy( view_router, this ) )
        .on( 'add',    $.proxy( view_router, this ) )
}




/*******************************************************************************
* Private Functions ************************************************************
*******************************************************************************/


function view_getListener ( evt ) {
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


function view_router ( model, evt, data ) {
    var $targets = this.$node.find( '[v-name="' + data.name + '"]' ),
        val, engine, i, $target

    if ( $targets.length === 0 )
        return

    engine = this.engine[data.name]
           ? this.engine[data.name]
           : this.defaultEngine
           ? this.defaultEngine
           : this.baseEngine

    for ( i = 0; $target = $targets.at( i ); i++ )
        engine.call( this.model, $target, evt, data )
}



/*******************************************************************************
* Public Functions *************************************************************
*******************************************************************************/




View.prototype = {

    // our translation engine object. This should be overridden
    engine: {},


    // this is used as the default engine if defaultEngine is not present
    baseEngine: function ( $target, evt, data ) {
        var tgt = $target.attr( 'v-tgt' ),
            i, params

        if ( tgt === undefined ) {
            $target.text( data.value )
            return;
        }

        i = tgt.indexOf( ':' )

        if ( !~i ) {
            $target[tgt]( data.value )
            return;
        }

        params = tgt.slice( i + 1 )
        params = params.split( ',' )

        tgt    = tgt.slice( 0, i )

        params.push( data.value )

        $target[tgt].apply( $target, params )
    },



    on: function ( evt, cb ) {
        if ( !evt || !cb )
            return this

        var list = view_getListener.call( this, evt )

        list.push( cb )
        this.model.on( evt, cb )

        return this
    },



    off: function ( evt, cb ) {
        if ( !evt )
            return this

        var list = view_getListener.call( this, evt ),
            i, l


        if ( !cb ) {

            for ( i = 0; l = list[i]; i++ )
                this.model.off( evt, l )

            list = []
            return this
        }

        i = list.indexOf( cb )

        if ( ~i )
            list.splice( i, 1 )

        this.model.off( evt, cb )

        return this
    }

}


