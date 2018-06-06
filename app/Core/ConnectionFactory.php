<?php 

namespace App\Core;

class ConnectionFactory {

    protected static $list = [];

    public static function newConnection( $host, $user, $pass, $db, $alias = 'DEFAULT' )
    {
        $conn = new Connection($host, $user, $pass, $db); 
        if ($conn->connect_error) {
            trigger_error('Database connection failed: '  . $conn->connect_error, E_USER_ERROR);
        }
        static::$list[ $alias ] = $conn;
        return $conn;
    }
    public static function getConnection( $alias = 'DEFAULT' )
    {
        return static::$list[ $alias ];
    }

    public static function getDefault()
    {
        return static::getConnection( 'DEFAULT' );
    }
}