/*! UTIL */
(function (){

    lApp.addModel('coin', function( app, params ){
        this.setFromArray = function( array );
        {
            this.code = array[0];
            this.name = array[1];
            this.url = array[2];
            this.krakenCode = array[3];
        };
        this.addAlert = function()
        {
            var active = {
                idx: i,
                code: coin.code,
                name: coin.name,
                price: data[i][1],
                volumen: data[i][2],
                orderDate: data[i][3],
                delta: '-',
                market: '-',
                margin: '-',
                balance: '-'
            };
            this.volumen+= active.volumen;
            this.actives.push( active );
        };

        // init
        this.idx = 0;
        this.code = '';
        this.krakenCode = '';
        this.name = '';
        this.url = '';

        this.price = 0;
        this.lowPrice = 0;
        this.highPrice = 0;
        this.delta = 0;
        this.totVolumen = 0;
        this.balance = 0;
        this.alerts = [];
        this.actives = [];
    });

})( lApp );
