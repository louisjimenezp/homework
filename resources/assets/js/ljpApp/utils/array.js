/*! UTIL */
(function (){

    lApp.addUtil('array', function( app, params ){
        this.setArray = function( array )
        {
            this.array = array;
        }
        this.findObjectByAttribute = function ( attr, val )
        {
            for ( var i = 0; i < this.array.length; i++ ){
                var obj = this.array[i];

                // get element
                if ( obj[attr] == val )
                {
                    return obj;
                }
            }
            return undefined;
        };
        
        // init
        this.array = params.array !== undefined ? this.setArray( params.array ) : [];
    });

})( lApp );
