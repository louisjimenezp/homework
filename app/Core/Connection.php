<?php 

namespace App\Core;

class Connection extends \mysqli {

    protected $host = null;
    protected $username = null;
    protected $passwd = null;
    protected $dbname = null;

    public function __construct( $host, $username, $passwd, $dbname )
    {
        $this->host = $host;
        $this->username = $username;
        $this->passwd = $passwd;
        $this->dbname = $dbname;
        parent::__construct( $host, $username, $passwd, $dbname );
    }

    public function getHost()
    {
        return $this->host;
    }

    public function getUser()
    {
        return $this->username;
    }

    public function getPass()
    {
        return $this->passwd;
    }

    public function getDB()
    {
        return $this->dbname;
    }
}
