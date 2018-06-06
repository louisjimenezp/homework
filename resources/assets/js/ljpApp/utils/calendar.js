/*! UTIL */
(function (){

    lApp.addUtil('calendar', function( app, params ){
        this.parseDate = function ( sDate )
        {
            var aDateTime = sDate.split(' ');
            var aDate = aDateTime[0].split('-');
            var year = parseInt( aDate[0] );
            var month = parseInt( aDate[1] )-1;
            var day = parseInt( aDate[2] );

            if ( aDateTime[1] !== undefined )
            {
                var aTime = aDateTime[1].split(':');
                var hour = parseInt( aTime[0] );
                var minute = parseInt( aTime[1] );
                var second = parseInt( aTime[2] );

                return new Date( year, month, day, hour, minute, second );
            }
            else
            {
                return new Date( year, month, day );
            }
        };
        this.firstOfMonth = function (date)
        {
            return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0);
        };
        this.lastOfMonth = function(date)
        {
            return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
        };
    });

})( lApp );