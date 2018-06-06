/*! UTIL */
(function (){

    lApp.addUtil('googleChart', function( app, params ){
        this.comboChart = function( data )
        {
            data.gAction = 'comboChart';
            if ( !this.isValidateData( data ) )
            {
                return false;
            }
            var options = {
                title : data.gTitle,
                titleTextStyle: { color: '#004E96', fontSize: 16},
                annotations: { textStyle: { color: '#666666' } },
                vAxis: { textStyle: { color: '#666666' } },
                hAxis: { textStyle: { color: '#666666' } },
                legend: { position: 'top', maxLines: 1 },
                chartArea: { width: '80%', height: '70%', left: '15%', top: '20%' },
                seriesType: 'bars',
                series: {2: {type: 'line'}}
            };
            if ( data.gOptions !== undefined )
            {
                app.jQuery.each( data.gOptions, function( key, value ){
                    options[ key ] = value;
                });
            }

            var chart = new google.visualization.ComboChart(document.getElementById( data.gId ));
            chart.draw(data.gTable, options);
        };
        this.columnChart = function( data )
        {
            data.gAction = 'columnChart';
            if ( !this.isValidateData( data ) )
            {
                return false;
            }
            var options = {
                title : data.gTitle,
                titleTextStyle: { color: '#004E96', fontSize: 16},
                annotations: { textStyle: { color: '#666666' } },
                vAxis: { textStyle: { color: '#666666' } },
                hAxis: { textStyle: { color: '#666666' } },
                legend: { position: 'top', maxLines: 1 },
                chartArea: { width: '80%', height: '70%', left: '15%', top: '20%' },
            };
            if ( data.gOptions !== undefined )
            {
                app.jQuery.each( data.gOptions, function( key, value ){
                    options[ key ] = value;
                });
            }

            var chart = new google.visualization.ColumnChart(document.getElementById( data.gId ));
            chart.draw(data.gTable, options);
        };
        this.areaChart = function ( data )
        {
            data.gAction = 'areaChart';
            if ( !this.isValidateData( data ) )
            {
                return false;
            }
            var options = {
                title : data.gTitle,
                titleTextStyle: { color: '#004E96', fontSize: 16},
                annotations: { textStyle: { color: '#666666' } },
                vAxis: { textStyle: { color: '#666666' } },
                hAxis: { textStyle: { color: '#666666' } },
                legend: { position: 'top', maxLines: 1 },
                chartArea: { width: '80%', height: '70%', left: '15%', top: '20%' },
            };
            if ( data.gOptions !== undefined )
            {
                app.jQuery.each( data.gOptions, function( key, value ){
                    options[ key ] = value;
                });
            }

            var chart = new google.visualization.AreaChart(document.getElementById( data.gId ));
            chart.draw(data.gTable, options);
        };
        this.lineChart = function( data )
        {
            data.gAction = 'lineChart';
            if ( !this.isValidateData( data ) )
            {
                return false;
            }
            var options = {
                title: data.gTitle,
                titleTextStyle: { color: '#004E96', fontSize: 16},
                annotations: { textStyle: { color: '#666666' } },
                hAxis: { textStyle: { color: '#666666' } },
                vAxis: { textStyle: { color: '#666666' } },
                legend: { position: 'top', maxLines: 1 },
                chartArea: { width: '80%', height: '70%', left: '15%', top: '20%' },
                curveType: 'function',
                //pointSize: 10,
            };
            if ( data.gOptions !== undefined )
            {
                app.jQuery.each( data.gOptions, function( key, value ){
                    options[ key ] = value;
                });
            }

            var chart = new google.visualization.LineChart(document.getElementById( data.gId ));
            chart.draw(data.gTable, options);
        };
        this.pieChart = function ( data )
        {
            data.gAction = 'pieChart';
            if ( !this.isValidateData( data ) )
            {
                return false;
            }
            var options = {
                title: data.gTitle,
                titleTextStyle: { color: '#004E96', fontSize: 16},
                annotations: { textStyle: { color: '#666666' } },
                hAxis: { textStyle: { color: '#666666' } },
                vAxis: { textStyle: { color: '#666666' } },
                legend: { position: 'right' },
                chartArea: { width: '80%', height: '70%', left: '15%', top: '20%' },
                pieHole: 0.4
            };
            if ( data.gOptions !== undefined )
            {
                app.jQuery.each( data.gOptions, function( key, value ){
                    options[ key ] = value;
                });
            }

            var chart = new google.visualization.PieChart(document.getElementById( data.gId ));
            chart.draw(data.gTable, options);
        };
        this.table = function( data )
        {
            data.gAction = 'table';
            if ( !this.isValidateData( data ) )
            {
                return false;
            }

            var options = {
                width: '100%',
                height: '100%'
            };
            if ( data.gOptions !== undefined )
            {
                app.jQuery.each( data.gOptions, function( key, value ){
                    options[ key ] = value;
                });
            }

            var chart = new google.visualization.Table( div );
            chart.draw(data.gTable, options);
        };
        this.isValidateData = function( data ){
            var div = document.getElementById( data.gId );
            if ( !div )
            {
                app.error(app.format(app.translation.googleChartGIdNotExist,[data.gAction, data.gId]));
                return false;
            }

            return true;
        };
    });

})( lApp );
