<?php 

namespace App\Core;

class Date extends \Datetime {

    const SQL = 'Y-m-d';
    const SQL_FULL = 'Y-m-d H:i:s';
    const LOCALE = 'd/m/Y H:i:s';

    public static function parse( $dateTime )
    {
        $aDt = explode(' ', $dateTime );
        $fDt = isset( $aDt[1] ) ? static::SQL_FULL : static::SQL;
        $dt = static::createFromFormat( $fDt, $dateTime );
        if ( !$dt ) return null;
        if ( $fDt == static::SQL ) $dt->setTime(0, 0, 0);
        
        $nDt = new static();
        $nDt->setTimestamp( $dt->getTimestamp() );
        return $nDt;
    }

    public function toSql()
    {
        return $this->format( static::SQL );
    }

    public function toSqlFull()
    {
        return $this->format( static::SQL_FULL );
    }

    public function toLocale()
    {
        return $this->format( static::LOCALE );
    }
}
