/*!
 * LouisApp v1.0.0 (http://louisjimenezp.com)
 * Copyright 2018 LouisJimenezP
 */
var lApp = {};
lApp.jQuery = null;
lApp.translation = {
	'translationKeyNotSupported' : 'translation.{0}: "{1}" is not supported',
	'configKeyNotSupported' : 'config.{0}: "{1}" is not supported',
	'controllerActionNotExist' : 'Action {0} in Controller {1} not exist',
	'viewActionNotExist' : 'Action {0} in View {1} not exist',
	'noInternetConnection' : 'Your are not Connected to the Internet',
	'googleChartGIdNotExist': 'googleChart.{0}: gId {1} not exist'
};
lApp.config = {
	'version': 'v3.0.0',
	'debug': false,
	'chartJS': '',
	'runCallback': 'runCallback',

	// user definitions
	'userFullname': 'My name',
	'userEmail': 'my@email.com',
	'userDevice': 'desktop',
	'userSettings': {},

	// data
	'defaultAjaxData': {},
	'postData': {},

	// locale definitions
	'decimals': 2,
	'decimalPoint': '.',
	'thousandsSeparator': ',',
	'symbolCurrency': '$',
	'dateFormat': '{2}-{1}-{0}', // dd-mm-yyyy
	'datetimeFormat': '{2}-{1}-{0} {3}:{4}:{5}', // dd-mm-yyyy
	'monthAbbreviations': ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
	'monthNames': ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

};
lApp.model = {
	args: undefined,
	loaders: undefined,
	
	filters: undefined,
	parentCallback: true,
	listen: undefined,

	//filters: {}, caducado
	// currentReport: null,
	// reportsOpened: []
};
lApp.script = {};
lApp.lClass = {};
lApp.lService = {};
lApp.lController = {};
lApp.view = {};
lApp.autoIncrement = 0;
lApp.getAutoIncrement = function()
{
	return lApp.autoIncrement++;
};
lApp.setTranslations = function ( jsonData )
{
	this.jQuery.each( jsonData, function( key, val ){
		if ( lApp.translation[key] !== undefined )
		{
			lApp.translation[key] = val;
		}
		else 
		{
			lApp.log( lApp.format(lApp.translation.translationKeyNotSupported, [key, val]) );
		}
	});
};
lApp.setConfiguration = function ( jsonData )
{
	this.jQuery.each( jsonData, function( key, val ){
		if ( lApp.config[key] !== undefined )
		{
			lApp.config[key] = val;
		}
		else 
		{
			lApp.log( lApp.format(lApp.translation.configKeyNotSupported, [key, val]) );
		}
	});
};
lApp.log = function ( txt, force )
{
	var debug = force !== undefined ? force : this.config.debug;
	if ( window.console && debug )
	{
		console.log( txt );
	}
};
lApp.log = function()
{
	if ( top.console !== undefined )
	{
		top.console.log.apply( top.console, arguments );
	}
};
lApp.error = function ( txt, force )
{
	var debug = force !== undefined ? force : this.config.debug;
	if ( window.console && debug )
	{
		console.error( txt )
	}
};
lApp.debug = function( txt, type )
{
	if ( this.config.debug )
	{
		this.log( txt, this.config.debug );
	}
};
lApp.format = function (txt, args)
{
	if ( args !== undefined && this.jQuery.isArray( args ) )
	{
		return txt.replace(/{(\d+)}/g, function(match, number) {
			return typeof args[number] !== 'undefined'
				? args[number]
				: match;
		});
	}
	else
	{
		return txt;
	}
};
lApp.getAjaxData = function ( params )
{
	this.jQuery.extend(true, params, this.config.defaultAjaxData);
	return params;
};
lApp.getArgs = function()
{
	if ( this.model.args === undefined )
	{
		var args =  {};
		args = this.getGETArgs( args );
		args = this.getPOSTArgs( args );
		this.model.args = args;
	}
	return this.model.args;
};
lApp.getGETArgs = function( args ) 
{
	var url = window.location.search.substring(1);
	var params = url.split('&');
	for (var i = 0; i < params.length; i++)
	{
		var data = params[i].split('=');
		if ( data[0] !== undefined && data[0] !== '' )
		{
			args[decodeURIComponent(data[0])] = data[1] !== undefined ? decodeURIComponent(data[1]) : '';
		}
	}
	return args;
};
lApp.getPOSTArgs = function( args )
{
	this.jQuery.each( this.config.postData, function ( name, value ) {
		args[decodeURIComponent(name)] = decodeURIComponent(value);
	});
	return args;
};
lApp.setArgs = function( args )
{
	var newArgs = this.model.args;
	this.jQuery.each( args, function( name, value ){ 
		newArgs[ name ] = value;
	});
	this.model.args = newArgs;
};
lApp.createURLWithArgs = function( url, args )
{
	var request = url;
	var params = [];
	this.jQuery.each( args, function ( key, item ) {
		params.push(encodeURIComponent(key)+'='+encodeURIComponent(item));
	});
	request+= (params.length > 0 ? '?' + params.join('&') : '');

	return request;
};
/*
lApp.parent = function()
{
	return window !== window.parent ? window.parent.lApp : undefined;
};
*/
lApp.parent = function()
{
	var parent = undefined;
	if ( window !== window.parent )
	{
		// abierto en mainBrowser o fastSwitch
		if ( window.parent.lApp !== undefined )
		{
			parent = window.parent.lApp;
		}
		else 
		{
			// abierto con frameManager
			var frames = window.parent.document.getElementsByTagName('iframe');
			for ( var i = 0; i < frames.length; i++ ){
				if ( frames[i].contentWindow === window )
				{
					break;
				}
				if ( frames[i].contentWindow.lApp !== undefined )
				{
					parent = frames[i].contentWindow.lApp;
				}
			}
		}
	}
	return parent;
};
lApp.clone = function( object )
{
	return this.jQuery.extend(true, {}, object);
};
lApp.init = function() 
{
	if ( this.script['chartJS'] === undefined )
	{
		this.ajaxScript('chartJS', this.config.chartJS, function( app ){
				google.charts.load('current', {'packages':['corechart','table']});
				google.charts.setOnLoadCallback( function(){
					lApp.init();
				} );
			}, 
			function ( app, data ){
				if ( data.status === 404 )
				{
					alert( app.translation.noInternetConnection );
				}
			}
		);
		return false;
    }

	this.debug('init');
	this.listen();
	this.run();
};
lApp.run = function ()
{
	this.debug('run');
	//this.model.args = this.getArgs();
	this.config.runCallback( this );
};
lApp.listen = function()
{
	this.model.listen = {
		content: {
			marginBottom: ( this.isIE() ? 3 : 2 ) // like css height calc
		},
		headFixed: {
			active: false,
			scrollTop: 0
		},
		footFixed: {
			active: false,
			scrollTop: 0
		},
		resize: {
			active: true,
			timeout: undefined,
			width: undefined
		}
	};

	// scroll
	/*
	var scrollCallback = function( event )
	{
		lApp.scroll( this, event );
	};
	this.jQuery('#'+this.config.contentID).on('scroll', scrollCallback );

	// resize
	var resizeCallback = function( event )
	{
		lApp.debug('resize');
		lApp.resize( this, event );
	};
	if ( this.isDesktop() )
	{
		this.jQuery(window).on('resize', resizeCallback );
	}
	else
	{
		this.jQuery(window).on('orientationchange', resizeCallback);
	}
	*/
};
lApp.isMobile = function()
{
	return this.config.userDevice === 'mobile';
};
lApp.isTablet = function()
{
	return this.config.userDevice === 'tablet';
};
lApp.isDesktop = function()
{
	return this.config.userDevice === 'desktop';
};
lApp.getIEVersion = function ()
{
	var ua = window.navigator.userAgent;
	var ieVersion = 0;
	// Test values; Uncomment to check result â€¦

	// IE 10
	// ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

	// IE 11
	// ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

	// Edge 12 (Spartan)
	// ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

	// Edge 13
	// ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

	var msie = ua.indexOf('MSIE ');
	var trident = ua.indexOf('Trident/');
	var edge = ua.indexOf('Edge/');
	if (msie > 0) {
		// IE 10 or older => return version number
		ieVersion = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}
	else if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		ieVersion = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}
	else if (edge > 0) {
		// Edge (IE 12+) => return version number
		ieVersion = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	this.debug('IE:'+ieVersion);
	return ieVersion;
};
lApp.isIE = function()
{
	return this.getIEVersion()>0;
};
lApp.addController = function( name )
{
	return this.lController[ name ] = {
		name: name,
		actions: [],
		addAction: function( action, callback )
		{
			this.actions[ action ] = callback;
		},
		callAction: function( action )
		{
			return this.actions[ action ];
		},
		doAction: function( app, action, data )
		{
			if ( this.actions[ action ] !== undefined )
			{
				return this.actions[ action ]( app, data );
			}
			else
			{
				app.log( app.format( app.translation.controllerActionNotExist, [
					action,
					name
				] ) );
				return false;
			}
		}
	};
};
lApp.callController = function( name, action )
{
	this.debug('callController: ' + name + '.' + action );
	return this.lController[ name ].callAction( action );
};
lApp.doController = function( name, action, data )
{
	this.debug( 'doController: ' + name + '.' + action );
	return this.lController[ name ].doAction( this, action, data );
};
lApp.addView = function( name )
{
	return this.view[ name ] = {
		name: name,
		actions: [],
		addAction: function( action, callback )
		{
			this.actions[ action ] = callback;
		},
		doAction: function( app, action, data )
		{
			if ( this.actions[ action ] !== undefined )
			{
				return this.actions[ action ]( app, data );
			}
			else
			{
				app.log( app.format( app.translation.viewActionNotExistthi, [
					action,
					name
				] ) );
				return false;
			}
		}
	};
};
lApp.doView = function( name, action, data )
{
	this.debug( 'doView: ' + name + '.' + action );
	return this.view[ name ].doAction( this, action, data );
};
lApp.addService = function( name, service )
{
	this.lService[ name ] = service;
};
lApp.doService = function( name, params, callback )
{
	this.lService[ name ]( this, params, callback );
};
lApp.addClass = function( name, className )
{
	this.lClass[ name ] = className;
};
lApp.newClass = function( name, params )
{
	return new this.lClass[name]( this, params );
};
lApp.addUtil = function( name, className )
{
	this.addClass( 'util.' + name, className );
};
lApp.newUtil = function( name, params )
{
	return this.newClass( 'util.' + name, params );
};
lApp.addModel = function( name, className )
{
	this.addClass( 'model.' + name, className );
};
lApp.newModel = function( name, params )
{
	return this.newClass( 'model.' + name, params );
};

/* LOADERS */
lApp.loading = function( key, trueFalse )
{
	var done = true;
	if ( this.model.loaders === undefined )
	{
		this.model.loaders = {};
	}
	this.model.loaders[ key ] = trueFalse;
	$.each( this.model.loaders, function( key, value ) {
		if ( value === true )
		{
			done = false;
			return false;
		}
	});

	if ( done )
	{
		this.stopLoading();
	}
	else
	{
		this.startLoading();
	}
};
lApp.isLoading = function ( key )
{
	return this.model.loaders !== undefined
		&& this.model.loaders[ key ] !== undefined 
			? this.model.loaders[key]
			: false;
};
lApp.isLoaded = function( key )
{
	return this.model.loaders !== undefined
		&& this.model.loaders[ key ] !== undefined
		&& this.model.loaders[ key ] === false;
};
lApp.resetLoaders = function()
{
	this.model.loaders = undefined;
};
lApp.startLoading = function()
{
	this.debug( 'startLoading' );
};
lApp.stopLoading = function()
{
	this.debug( 'stopLoading' );
};

/* HOOK */
lApp.hook = {
	hooks: [],
	register: function ( tag, callback )
	{
		if ( typeof this.hooks[ tag ] === 'undefined' )
		{
			this.hooks[ tag ] = [];
		}
		this.hooks[ tag ].push( callback );
	},
	call: function( tag )
	{
		var params = Array.prototype.slice.call(arguments, 1);
		if ( typeof this.hooks[ tag ] !== 'undefined' )
		{
			for ( var i = 0; i < this.hooks[ tag ].length; i++ )
			{
				if ( this.hooks[ tag ][ i ].apply(this, params) === false )
				{
					break;
				}
			}
		}
	},
	apply: function( tag, value )
	{
		var params = Array.prototype.slice.call(arguments, 1);
		if ( typeof this.hooks[ tag ] !== 'undefined' )
		{
			for ( var i = 0; i < this.hooks[ tag ].length; i++ )
			{
				params[0] = value;
				var result = this.hooks[ tag ][ i ].apply(this, params);
				if ( result === false )
				{
					break;
				}
				else if ( result !== undefined )
				{
					value = result;
				}
			}
		}
		return value;
	}
};


/* AJAX */
lApp.ajaxJson = function( url, params, doneFunction, failFunction ){
	var app = this;
	this.jQuery.ajax({
		method: "GET",
		url: url,
		data: this.getAjaxData( params ),
		cache: false,
		dataType: "json"
	}).done( function ( jsonResponse ){
		doneFunction( app, jsonResponse );
	}).fail( function( jsonException ){
		failFunction( app, jsonException );
	});
};
lApp.ajaxPostJson = function ( url, params, doneFunction )
{
	this.jQuery.ajax({
		method: "POST",
		url: url,
		data: this.getAjaxData( params ),
		cache: false,
		dataType: "json"
	}).done( function ( jsonResponse ){
		doneFunction( lApp, jsonResponse );
	}).fail( function( jsonException ){
		failFunction( app, jsonException );
	});
};
lApp.ajaxScript = function ( key, url, doneFunction, failFunction ){
	if ( this.script[key] !== undefined )
	{
		doneFunction( this );
		return;
	}
	this.jQuery.ajax({
		url: url,
		dataType: 'script',
		cache: true,
	}).done( function ( ){
		lApp.script[key] = url;
		doneFunction( lApp );
	}).fail( function( jsonException ) {
		if ( typeof failFunction !== 'undefined' )
		{
			failFunction( lApp, jsonException );
		}
		lApp.log('Error.ajaxScript with URL:'+url);
	});
};
/* END AJAX */
