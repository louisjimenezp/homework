<?php 

namespace App\Core;

class Model {

    protected static $aliasConn = 'DEFAULT';

    protected static $table = null;

    protected static $primaryKey = 'id';

    protected static $fields = [];

    protected $attributes = [];

    protected $incrementing = true;

    protected $exists = false;

    public function hydrate( $row )
    {
        $this->exists = true;
        foreach( static::$fields as $key => $field )
        {
            $this->__set( $key, $row[ $field ] );
        }
    }

    public function __set( $key, $value )
    {
        if ( isset( static::$fields[ $key ] ) )
        {
            $this->attributes[ $key ] = $value;
        }
        else
        {
            throw new \Exception( sprintf("The field %s.%s not exists at %s", static::$table, $key, get_class( $this ) ) );
        }
    }

    public function __get( $key )
    {
        return isset( $this->attributes[ $key ] ) ? $this->attributes[ $key ] : null;
    }

    public function insert()
    {
        $keys = []; $values = []; $binds = [];
        foreach ( $this->attributes as $key => $value )
        {
            if ( $key != static::$primaryKey )
            {
                $keys[] = static::$fields[ $key ];
                $values[] = '?';
                $binds[] = $value;
            }
        }

        $sql = sprintf( "INSERT INTO %s (%s) VALUES (%s)"
            , static::$table
            , implode( ',', $keys)
            , implode( ',', $values)
        );
        $conn = ConnectionFactory::getConnection( static::$aliasConn );
        $stmt = $conn->prepare($sql);
        if( $stmt === false ) {
            throw new \Exception( 'Wrong SQL: ' . $sql . ' Error: ' . $conn->error, E_USER_ERROR );
        }
        $this->prepareBinds( $stmt, $binds );
        $stmt->execute();
        if ( $stmt->error )
        {
            throw new \Exception( 'Error SQL: '. $sql. ' Error: ' . $stmt->error, E_USER_ERROR);
        }
        if ( $this->incrementing && $stmt->insert_id )
        {
            $this->__set( static::$primaryKey, $stmt->insert_id );
        }
        $this->exists = true;
        return $stmt->affected_rows;
    }

    public function update()
    {
        $sets = []; $binds = [];
        foreach ( $this->attributes as $key => $value )
        {
            if ( $key != static::$primaryKey )
            {
                $sets[] = sprintf("%s = ? ", static::$fields[ $key ]);
                $binds[] = $value;
            }
        }

        $sql = sprintf( "UPDATE %s SET %s WHERE %s = ?"
            , static::$table
            , implode( ',', $sets)
            , static::$fields[ static::$primaryKey ]
        );
        $conn = ConnectionFactory::getConnection( static::$aliasConn );
        $stmt = $conn->prepare($sql);
        if( $stmt === false ) {
            throw new \Exception( 'Wrong SQL: ' . $sql . ' Error: ' . $conn->error, E_USER_ERROR );
        }
        $binds[] = $this->attributes[ static::$primaryKey ];
        $this->prepareBinds( $stmt, $binds );
        $stmt->execute();
        if ( $stmt->error )
        {
            throw new \Exception( 'Error SQL: '. $sql. ' Error: ' . $stmt->error, E_USER_ERROR);
        }
        return $stmt->affected_rows;
    }

    public function save()
    {
        if ( $this->exists )
        {
            return $this->update();
        }
        else
        {
            return $this->insert();
        }
    }

    protected static function prepareBinds( $stmt, $binds )
    {
        /* Bind parameters. Types: s = string, i = integer, d = double,  b = blob */
        $types = '';
        $params = [];
        foreach ( $binds as $value )
        {
            if ( is_int( $value ) )
            {
                $types.= 'i'; 
                $params[] = (int) $value;
            }
            elseif ( is_float( $value ) )
            {
                $types.= 'd';
                $params[] = (float) $value;
            }
            elseif ( is_string( $value ) )
            {
                $types.= 's';
                $params[] = (string) $value;
            }
            elseif ( is_null( $value ) ) {
                $types.= 's';
                $params[] = (string) 'null';
            }
            else
            {
                $types.= 'b';
                $params[] = (string) $value; 
            }
        }
        if ( count( $params ) > 0 )
        {
            $bp = array( $types );
            foreach ( array_keys( $params ) as $key )
            {
                $bp[] = &$params[$key];
            }
            call_user_func_array(array($stmt,"bind_param"), $bp);
        }
    }

    public static function where( $conds = array(), $order = array(), $limit = array(), $select = array('*'), $group = array() )
    {
        $where = []; $binds = [];
        foreach( $conds as $key => $value )
        {
            if ( isset( static::$fields[ $key ] ) )
            {
                $where[] = sprintf("%s = ?", static::$fields[$key]);
                $binds[] = $value;
            }
            else if ( is_array( $value )  )
            {
                if ( count( $value ) == 2)
                {
                    $where[] = sprintf("%s = ?", static::$fields[$value[0]]);
                    $binds[] = $value[1];
                }
                elseif ( count( $value ) == 3 )
                {
                    $where[] = sprintf("%s %s ?", static::$fields[$value[0]], $value[1]);
                    $binds[] = $value[2];
                }
            }
            elseif ( is_string( $value ) )
            {
                $where[] = $value;
            }
        }
        $sql = sprintf( "SELECT ".implode(',', $select)." FROM %s", static::$table );
        if (count($where)>0) $sql.=" WHERE ".implode(" and ", $where);
        if (count($group)>0) $sql.=" GROUP BY ".implode(", ", $group);
        if (count($order)>0) $sql.=" ORDER BY ".implode(" and ", $order);
        if (count($limit)>0) $sql.=" LIMIT ".$limit[0];
        $conn = ConnectionFactory::getConnection( static::$aliasConn );
        $stmt = $conn->prepare($sql);
        if( $stmt === false ) {
            trigger_error('Wrong SQL: ' . $sql . ' Error: ' . $conn->error, E_USER_ERROR);
        }

        static::prepareBinds( $stmt, $binds );
        $stmt->execute();
        if ( $stmt->error )
        {
            throw new \Exception( 'Error SQL: '. $sql. ' Error: ' . $stmt->error, E_USER_ERROR);
        }
        return $stmt->get_result();
    }

    public static function find( $id )
    {
        $res = static::where( [ static::$primaryKey => $id ], array(), array(1) );
        if ( $row = $res->fetch_assoc() )
        {
            $obj = new static();
            $obj->hydrate( $row );
            return $obj;
        }
        return null;
    }

    public static function first( $conds, $order = array() )
    {
        $res = static::where( $conds, $order, array(1) );
        if ( $row = $res->fetch_assoc() )
        {
            $obj = new static();
            $obj->hydrate( $row );
            return $obj;
        }
        return null;
    }

    public static function execute( $sql, $binds )
    {
        $conn = ConnectionFactory::getConnection( static::$aliasConn );
        $stmt = $conn->prepare($sql);
        if( $stmt === false ) {
            throw new \Exception( 'Wrong SQL: ' . $sql . ' Error: ' . $conn->error, E_USER_ERROR );
        }
        static::prepareBinds( $stmt, $binds );
        $stmt->execute();
        if ( $stmt->error )
        {
            throw new \Exception( 'Error SQL: '. $sql. ' Error: ' . $stmt->error, E_USER_ERROR);
        }
        return $stmt->affected_rows;
    }

    /*
    public static function firstOrCreate( $attrs )
    {
        $res = static::where( $attrs, array(), array(1) );
        $obj = new static();
        if ( $row = $res->fetch_assoc() )
        {
            $obj->hydrate( $row );
        }
        else 
        {
            foreach ( $attrs as $key => $value )
            {
                $obj->$key = $value;
            }
        }
        return $obj;
    }
    */
}
