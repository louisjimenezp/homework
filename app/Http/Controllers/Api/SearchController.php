<?php 

namespace App\Http\Controllers\Api;

use App\Business\Search;
use App\Core\Request;
use App\Core\Json;

class SearchController extends AbstractController {

    public function getAction( Request $request )
    {
        $sample = Json::parseFile('storage/Sample.json')->getData();
        $user = Json::parseFile('storage/userdemo.json')->getData();

        $search = new Search();
        $filters = new \stdClass();
        $filters->keywords = $request->keywords;
        $filters->orderby = $request->orderby;
        $filters->favorites = is_array( $user->favorites ) ? $user->favorites : [];

        $json = new Json();
        $json->restaurants = $search->execute( $sample->restaurants, $filters );
        $json->orderOptions = Json::parseFile('resources/database/orderList.json')->getData();
        return $json;
    }

}