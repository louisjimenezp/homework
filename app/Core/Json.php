<?php 

namespace App\Core;

class Json {

    protected $data;

    public function __construct( $data = null )
    {
        $this->data = $data ? $data : new \stdClass();
    }

    public function setData( $data )
    {
        $this->data = $data;
    }

    public function getData()
    {
        return $this->data;
    }

    public function __isset( $key )
    {
        return isset( $this->data->$key );
    }

    public function __set( $key, $value )
    {
        $this->data->$key = $value;
    }

    public function __get( $key )
    {
        return isset( $this->data->$key ) ? $this->data->$key : null;
    }

    public function isValid()
    {
        return $this->data ? true : false;
    }

    public function decode( $json )
    {
        $this->data = json_decode( $json );
    }

    public function decodeFile( $filePath )
    {
        if ( file_exists( $filePath ) )
        {
            $this->decode( file_get_contents( $filePath ) );
        }
    }

    public function encode()
    {
        return json_encode( $this->data );
    }

    public function encodeFile( $filePath )
    {
        file_put_contents( $filePath, $this->encode() );
    }

    public function render()
    {
        header('Content-Type: application/json');
        echo $this->encode();
    }

    public static function parseFile( $filePath )
    {
        $obj = new static();
        $obj->decodeFile( $filePath );
        return $obj;
    }
}
