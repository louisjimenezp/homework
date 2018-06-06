<?php

use App\Core\Json;
use App\Business\Search;

use PHPUnit\Framework\TestCase;

class SearchTest extends TestCase {

    protected function getFiltersByOrderBy( $orderby )
    {
        $filters = new \stdClass();
        $filters->keywords = '';
        $filters->orderby = $orderby;
        $filters->favorites = [];
        return $filters;
    }

    protected function getSampleJsonData()
    {
        return Json::parseFile( 'storage/Sample.json' )->getData();
    }

    protected function getSearchData( $orderby, $keywords = null )
    {
        $filters = $this->getFiltersByOrderBy( $orderby );
        if ( $keywords )
        {
            $filters->keywords = $keywords;
        }
        $sample = $this->getSampleJsonData();

        $search = new Search();
        return $search->execute( $sample->restaurants, $filters );
    }

    public function testOrderTopRestaurant()
    {
        $data = $this->getSearchData( 'topRestaurants' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'CIRO 1939',
            $first->name
        );
        $this->assertEquals(
            312607.5,
            $first->sortingValues->topRestaurants
        );
    }

    public function testOrderBestMatch()
    {
        $data = $this->getSearchData( 'bestMatch' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'Lunchpakketdienst',
            $first->name
        );
        $this->assertEquals(
            306,
            $first->sortingValues->bestMatch
        );
    }

    public function testOrderNewest()
    {
        $data = $this->getSearchData( 'newest' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'Indian Kitchen',
            $first->name
        );
        $this->assertEquals(
            272,
            $first->sortingValues->newest
        );
    }

    public function testOrderRatingAverage()
    {
        $data = $this->getSearchData( 'ratingAverage' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'Tanoshii Sushi',
            $first->name
        );
        $this->assertEquals(
            4.5,
            $first->sortingValues->ratingAverage
        );
    }

    public function testOrderDistance()
    {
        $data = $this->getSearchData( 'distance' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'Tanoshii Sushi',
            $first->name
        );
        $this->assertEquals(
            1190,
            $first->sortingValues->distance
        );
    }

    public function testOrderPopularity()
    {
        $data = $this->getSearchData( 'popularity' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'Sushi One',
            $first->name
        );
        $this->assertEquals(
            23,
            $first->sortingValues->popularity
        );
    }

    public function testOrderAverageProductPrice()
    {
        $data = $this->getSearchData( 'averageProductPrice' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'Indian Kitchen',
            $first->name
        );
        $this->assertEquals(
            1189,
            $first->sortingValues->averageProductPrice
        );
    }

    public function testOrderDeliveryCosts()
    {
        $data = $this->getSearchData( 'deliveryCosts' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'De Amsterdamsche Tram',
            $first->name
        );
        $this->assertEquals(
            0,
            $first->sortingValues->deliveryCosts
        );
    }

    public function testOrderMinCost()
    {
        $data = $this->getSearchData( 'minCost' );       
        $first = array_shift( $data );
        $this->assertEquals(
            'De Amsterdamsche Tram',
            $first->name
        );
        $this->assertEquals(
            0,
            $first->sortingValues->minCost
        );
    }

    public function testKeywords()
    {
        $keywords = 'sushi';
        $data = $this->getSearchData( 'topRestaurants', $keywords);
        $this->assertEquals(
            4,
            count($data)
        );
        $first = array_shift( $data );
        $this->assertContains(
            $keywords,
            $first->name,
            '',
            true
        );
    }
}
