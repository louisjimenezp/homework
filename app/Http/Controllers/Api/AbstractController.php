<?php 

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Json;

class AbstractController {

    protected $config = 'storage/Sample.json';

    protected function getConfig()
    {
        return Json::parseFile( $this->config );
    }

    protected function returnConfig( Json $json )
    {
        $json->encodeFile( $this->config );
        return $json;
    }
}