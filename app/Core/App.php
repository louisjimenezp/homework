<?php 

namespace App\Core;

class App {

    protected $rootPath = null;

    protected $startAt = null;

    protected $config = null;

    public function __construct()
    {
        $this->startAt = new Date();
        $this->rootPath = dirname( dirname( dirname(__FILE__) ) );
    }

    public function setConfig( $config )
    {
        $this->config = $config;
    }

    public function getRoot()
    {
        return $this->rootPath;
    }

    public function getStartAt()
    {
        return $this->startAt;
    }

    public function newConnection($host, $user, $pass, $db, $alias = 'DEFAULT')
    {
        return ConnectionFactory::newConnection($host, $user, $pass, $db, $alias );
    }

    public function setup()
    {
        //$this->loadConnections();
    }

    protected function loadConnections()
    {
        foreach ( $this->config->mysql as $conn )
        {
            $this->newConnection( $conn->host, $conn->user, $conn->pass, $conn->db, $conn->alias );
        }
    }

    public function isLive()
    {
        return $this->config->environment == 'live';
    }

    public function getURL( $path = '' )
    {
        return sprintf('%s://%s/%s', $this->config->protocol, $this->config->domain, $path );
    }

}