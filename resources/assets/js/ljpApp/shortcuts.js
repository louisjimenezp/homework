/*! SHORTCUT */
(function (){

    lApp.setArgs = function( args )
    {
        this.model.args = args;
    };
    lApp.setCoins = function ( data )
    {
        var coins = {};
        for( var i in data )
        {
            var coin = {
                idx: i,
                code: data[i][0],
                krakenCode: data[i][3],
                name: data[i][1],
                url: data[i][2],
                price: 0,
                lowPrice: undefined,
                highPrice: undefined,
                delta: 0,
                volumen: 0,
                balance: 0,
                alerts: [],
                actives: []
            };
            coins[ coin.code ] = coin;
        }
        this.model.coins = coins;
    };
    lApp.getCoin = function ( code )
    {
        return this.model.coins[ code ];
    }
    lApp.setActives = function ( data )
    {
        for( var i in data )
        {
            var coin = this.getCoin( data[i][0] );
            if ( !coin ) continue;
            var active = {
                idx: i,
                code: coin.code,
                name: coin.name,
                price: data[i][1],
                volumen: data[i][2],
                orderDate: data[i][3],
                sellPrice: data[i][4] !== undefined ? data[i][4] : '',
                delta: '-',
                market: '-',
                margin: '-',
                balance: '-'
            };
            coin.volumen+= active.volumen;
            coin.actives.push( active );
        }
    };
    lApp.setAlerts = function ( data )
    {
        var alerts = [];
        for( var i in data )
        {
            var coin = this.getCoin( data[i][0] );
            if ( !coin ) continue;
            var alert = {
                idx: i,
                code: coin.code,
                name: coin.name,
                price: data[i][1],
                volumen: data[i][2],
                action: data[i][3],
                balance: '-'
            };
            coin.alerts.push( alert );
        }
    };
    lApp.render = function()
    {
        var actives = [];
        var alerts = [];
        for( var i in this.model.coins )
        {
            var coin = this.getCoin( i );
            actives = actives.concat( coin.actives );
            alerts = alerts.concat( coin.alerts );
        }
        this.view.cron = this.model.args.cron;
        this.view.coins = this.model.coins;
        this.view.actives = actives;
        this.view.alerts = alerts;
    };
    lApp.refresh = function()
    {
        this.view.balanceTotal = 0;
        this.view.activeBalanceTotal = 0;
        this.model.activeMarginTotal = 0;
        this.model.activeMarginActives = 0;
        var pairs = [];
        for( var i in this.model.coins )
        {
            var coin = this.getCoin(i);
            if ( coin.krakenCode )
            {
                pairs.push( coin.krakenCode );
            }
        }
        lApp.jQuery.ajax({
            url: this.format( this.model.args.wsURL, [ pairs.join(',') ]),
            cache: false
        }).done( function( data ) {
            var idx = 0; var idx2 = 0;
            for ( var i in lApp.model.coins )
            {
                var coin = lApp.getCoin(i);
                var params = coin.krakenCode && data.result[ coin.krakenCode ] !== undefined
                    ? data.result[ coin.krakenCode ] : {c:[1], l:[1,1], h:[1,1]};
                lApp.fetchCoin( idx, idx2, coin.code, params );
                idx+= coin.actives.length;
                idx2+= coin.alerts.length;
            }
        });
    };
    lApp.fetchCoin = function ( idx, idx2, code, data )
    {
        var coin = this.getCoin( code );
        var marketPrice = parseFloat( data.c[0] );
        var lowPrice = parseFloat( data.l[0] );
        var highPrice = parseFloat( data.h[0] );

        coin.delta = marketPrice - coin.price;
        coin.price = marketPrice;
        coin.lowPrice = lowPrice;
        coin.highPrice = highPrice;
        coin.balance = coin.volumen * coin.price;
        this.view.balanceTotal+= coin.balance;
        for ( var i = 0; i < coin.actives.length; i++ )
        {
            var active = coin.actives[i];
            active.delta = coin.delta;
            active.market = coin.price;
            active.margin = active.market != active.price ? active.market / active.price - 1 : '-';
            active.balance = active.market != active.price && active.volumen > 0 ? (active.market - active.price ) * active.volumen : '-';

            this.model.activeMarginTotal+= active.margin != '-' ? active.margin : 0;
            this.model.activeMarginActives++;

            this.view.actives[idx + i] = active;
            this.view.activeBalanceTotal+= active.balance != '-' ? active.balance : 0;
            this.view.activeMarginAverage = this.model.activeMarginTotal / this.model.activeMarginActives;
        }
        for ( var i = 0; i < coin.alerts.length; i++ )
        {
            var alert = coin.alerts[i];
            if ( alert.action == 'BUY' && coin.price <= alert.price )
            {
                alert.balance = coin.price - alert.price;
            }
            else if ( alert.action == 'SELL' && coin.price >= alert.price )
            {
                alert.balance = coin.price - alert.price;
            }
            else
            {
                alert.balance = '-';
            }
            this.view.alerts[idx2 + i ] = alert;
        }
    };
    lApp.trader = function ( config )
    {
        this.view.balanceReal = config.balance;
        this.setArgs( config )
        this.setCoins( config.coins );
        this.setActives( config.orders );
        this.setAlerts( config.notifications );
        this.render();
    };
    lApp.saveAlert = function( alert, callback )
    {
        this.jQuery.post('/api/alert.edit', alert, function( config ){
            lApp.trader( config );
            lApp.refresh();
            callback();
        });
    };
    lApp.delAlert = function( alert, callback )
    {
        this.jQuery.get('/api/alert.delete', alert, function( config ){
            lApp.trader( config );
            lApp.refresh();
            callback();
        });
    };
    lApp.saveActive = function( active, callback )
    {
        this.jQuery.post('/api/active.edit', active, function( config ){
            lApp.trader( config );
            lApp.refresh();
            callback();
        });
    };
    lApp.delActive = function( active, callback )
    {
        this.jQuery.get('/api/active.delete', active, function( config ){
            lApp.trader( config );
            lApp.refresh();
            callback();
        });
    };
    lApp.setCron = function( cron, callback )
    {
        this.jQuery.get('/api/cron.set', cron, function( config ){
            lApp.trader( config );
            lApp.refresh();
            callback();
        });
    };
    lApp.fetchCoinData = function ( code, callback )
    {
        this.jQuery.get('/storage/coin_'+code+'.json', function( data ){

            var rows = [];
            var uCalendar = lApp.newUtil('calendar', {});
            lApp.jQuery.each( data.points, function( key, row ){
                rows.push( [ uCalendar.parseDate( row.createdAt ), parseFloat( row.price )] );
            });

            var gTable = new google.visualization.DataTable();
            gTable.addColumn('datetime', 'Time');
            gTable.addColumn('number', 'Price');
            gTable.addRows(rows);

            var gData = {
                gId: 'coinLineChart',
                gTitle: code+' Chart',
                gTable: gTable
            }
            var googleChart = lApp.newUtil('googleChart', {});
            googleChart.lineChart( gData );
            callback( data );
        });
    };

})( lApp );
