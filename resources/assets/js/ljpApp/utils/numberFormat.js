/*! UTIL */
(function (){

    lApp.addUtil('numberFormat', function( app, params ){
        this.setNumber = function( number )
        {
            this.number = number;
            return this;
        };
        this.format = function( number, decimals, dec_point, thousands_sep )
        {
            if ( decimals == undefined ) decimals = app.config.decimals;
            if ( dec_point == undefined ) dec_point = app.config.decimalPoint;
            if ( thousands_sep == undefined ) thousands_sep = app.config.thousandsSeparator;

            // only number like 12313.31231
            var value = parseFloat( number );
            var symbol = value < 0 ? '-' : '';
            var numbers = Math.abs(value).toFixed( decimals ).toString().split('.');
            // @link http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
            var thousands = numbers[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);
            numbers[0] = symbol+thousands;
            return numbers.join(dec_point);
        };
        this.toFloat = function( decimals )
        {
            return this.format( this.number, decimals);
        };
        this.toPercentage = function ( decimals )
        {
            return this.format( this.number * 100, decimals)+'%';
        };
        this.toMoney = function( decimals )
        {
            return app.config.symbolCurrency+this.format( this.number, decimals );
        };
        this.toNumber = function( decimals )
        {
            var multiplier = Math.pow(10, decimals || 0);
            return Math.round( this.number * multiplier) / multiplier;
        };

        // init
        this.number = params.number !== undefined ? params.number : undefined;
    });

})( lApp );