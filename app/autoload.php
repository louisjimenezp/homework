<?php

use App\Core\App;
use App\Core\Json;

/*
function __autoload($class)
{
    $parts = explode('\\', $class);
    $file = sprintf('%s.php', str_replace('\\', '/', $class) );
    require( $file );
}
*/

require __DIR__.'/../vendor/autoload.php';

// Get Config Json
$config = Json::parseFile( "resources/app/config.json" );

// Timezone Madrid
date_default_timezone_set( $config->timezone );

// App setup
$app = new App();
$app->setConfig( $config );
$app->setup();