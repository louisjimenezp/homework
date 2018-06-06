/*! CONTROLLER */
(function (){

    var controller = lApp.addController('home');
    controller.addAction( 'load', function( app, data ){
        app.view.result = data.restaurants;
        app.view.orderOptions = data.orderOptions;
    });

})( lApp );
