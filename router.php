<?php

require("app/autoload.php");

use App\Core\Json;
use App\Core\Request;

$path = isset( $_SERVER['REDIRECT_SCRIPT_URL'] ) ? $_SERVER['REDIRECT_SCRIPT_URL'] : $_SERVER['REDIRECT_URL'];
$request = new Request( $_REQUEST, $path );
$json = Json::parseFile('resources/app/router.json');
$class = null; $method = null;
foreach( $json->routes as $router )
{
    if ( $router->path == $request->getPath() )
    {
        $uses = explode('@', $router->uses);
        $class = sprintf("\App\Http\Controllers\%s", $uses[0] );
        $method = sprintf("%sAction", isset( $uses[1] ) ? $uses[1] : 'default');
        break;
    }
}
if ( !$class )
{
    $class = sprintf("\App\Http\Controllers\%s", 'ErrorController' );
    $method = 'notFoundAction';
}
$controller = new $class();
$view = $controller->$method( $request );
$view->render();
