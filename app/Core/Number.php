<?php 

namespace App\Core;

class Number {

    protected $number;
    protected $decimals = 2;
    protected $decPoint = ',';
    protected $thousandsSep = '.';

    public function __construct( $number )
    {
        $this->number = $number;
    }

    public function toLocale()
    {
        return number_format( $this->number, $this->decimals, $this->decPoint, $this->thousandsSep);
    }

    public static function parse( $number )
    {
        return new static( (float) $number );
    }

    public static function createFromFloat( $float )
    {
        return static::parse( (float) $float );
    }
}
