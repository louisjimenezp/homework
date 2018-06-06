<?php 

namespace App\Core;

class Request {

    protected $path;
    protected $data;

    public function __construct( $data, $path )
    {
        $this->path = $path;
        $this->data = $data;
    }

    public function __set( $key, $val )
    {
        $this->data[ $key ] = $val;
    }

    public function __get( $key )
    {
        return isset( $this->data[ $key ] ) ? $this->data[ $key ] : null;
    }

    public function __isset( $key )
    {
        return isset( $this->data[ $key ] );
    }

    public function getPath()
    {
        return $this->path;
    }
}
