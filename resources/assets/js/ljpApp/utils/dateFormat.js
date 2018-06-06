/*! UTIL */
(function (){

    lApp.addUtil('dateFormat', function( app, params ){
        this.setDate = function( date )
        {
            this.date = date;
            return this;
        };
        this.parseDate = function( sDate )
        {
            var uCalendar = lApp.newUtil('calendar', {});
            this.date = uCalendar.parseDate( sDate );
            return this;
        };
        this.format = function( format )
        {
            var date = this.date;
            return app.format(format, [
                date.getFullYear(), // 0: full year
                ('0'+(date.getMonth()+1)).slice(-2), // 1:month
                ('0'+date.getDate()).slice(-2), // 2: date
                ('0'+date.getHours()).slice(-2), // 3: hours
                ('0'+date.getMinutes()).slice(-2), // 4: minutes
                ('0'+date.getSeconds()).slice(-2), // 5: seconds
                app.config.monthNames[date.getMonth()], // 6: months
                app.config.monthAbbreviations[date.getMonth()], // 7: months with abbreviations
                date.getFullYear().toString().slice(-2) // 8: last two digits from year
            ]);
        };
        this.toSql = function()
        {
            return this.format( '{0}-{1}-{2}' );
        };
        this.toYearMonth = function()
        {
            return this.format( '{0}/{1}' );
        };

        // init
        this.date = params.date !== undefined ? params.date : undefined;
    });

})( lApp );