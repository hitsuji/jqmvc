
/*******************************************************************************
* Controller Constructor *******************************************************
*******************************************************************************/

function Controller ( model, $node ) {
    this.model = model
    this.$node = $node

    this.listeners = {
        add:    [],
        remove: [],
        change: [],
        data:   {}
    }

    this.add( $node )
}




function controller_router( e ) {
    var $target = $( e.target ),
        name    = $target.attr( 'c-name' ),
        engine  = this.engine[name]
                ? this.engine[name]
                : this.defaultEngine
                ? this.defaultEngine
                : this.baseEngine,
        val     = engine( this.model, e, $target )

        if ( val === undefined || val === this.model.get( name ) )
            return

        this.model.set( name, val )
}




Controller.prototype = {
    engine: {},

    baseEngine: function ( model, e, $target ) {
        var tgt = $target.attr( 'c-tgt' ),
            i, params

            if ( tgt === undefined )
                return $target.val()

            i = tgt.indexOf( ':' )

            if ( !~i )
                return $target[tgt]()

            params = tgt.slice( i + 1 )
            params = params.split( ',' )

            tgt    = tgt.slice( 0, i )

            return $target[tgt].apply( $target, params )
    },

    add: function ( node ) {
        var $targets = node instanceof $ // is it a jquery object
                     ? node.find( '[c-name]' )
                     : $( node + ' [c-name]' ),
            ctrl     = this



        $targets.each( function ( i, e ) {
            var $t = $( e ),
                // ctrl = this,
                evts = $t.attr( 'c-evt' ), // we expect a list of events here
                j, evt


            // if the c-evts attr is not set default to the change event
            if ( !evts ) {
                $t.on( 'change', $.proxy( controller_router, ctrl ) )
                return
            }

            // the c-evts string is expected to be a space separated list of events
            evts = evts.split( ' ' )
            for ( j = 0; evt = evts[j]; j++ )
                $t.on( evt, $.proxy( controller_router, ctrl ) )

        })

    }
}



