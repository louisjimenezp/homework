<?php 

namespace App\Core;

class Console {

    protected static function message( $msg )
    {
        if ( $msg )
        {
            echo $msg."\n";
        }
    }

    public static function log( $msg )
    {
        static::message( $msg );
    } 

    public static function error( \Exception $e )
    {
        static::message( sprintf('ERROR: %s', $e->getMessage() ) );
    }

}
