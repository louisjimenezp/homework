<?php 

namespace App\Http\Controllers\Api;

use App\Core\Request;
use App\Core\Json;

class FavoriteController extends AbstractController {

    protected $config = 'storage/userdemo.json';

    public function addAction( Request $request )
    {
        $json = $this->getConfig();
        $favorites = isset( $json->favorites ) ? $json->favorites : [];
        if ( !in_array( $request->idx, $favorites ) )
        {
            $favorites[] = $request->idx;
            $json->favorites = $favorites;
        }
        return $this->returnConfig( $json );
    }

    public function removeAction( Request $request )
    {
        $json = $this->getConfig();
        $favorites = isset( $json->favorites ) ? $json->favorites : [];
        $key = array_search( $request->idx, $favorites);
        if ( $key !== false )
        {
            unset( $favorites[ $key ] );
            $json->favorites = array_values( $favorites );
        }
        return $this->returnConfig( $json );
    }

}