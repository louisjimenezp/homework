<?php 

namespace App\Business;

use App\Traits\CoinTrait;

class Search {

    const L1_FAVORITE = 1;
    const L1_NOT_FAVORITE = 2;

    const L2_OPEN = 1;
    const L2_ORDER_AHEAD = 2;
    const L2_CLOSE = 3;
    const L2_UNKNOWN = 4;

    public function execute( $data, $filters )
    {
        $ret = [];
        $data = $this->prepareData( $data, $filters );
        foreach ( $data as $idx => $record )
        {
            if ( $this->isValidRecord( $record, $filters ) )
            {
                $orders = [
                    $this->orderFavorite( $record ),
                    $this->orderState( $record ),
                    $this->orderSorting( $record, $filters ),
                    $idx
                ];
                $key = implode('!', $orders);
                $ret[ $key ] = $record;
            }
        }
        ksort($ret);
        //print_r( $ret );exit();
        return array_values( $ret );
    }

    protected function prepareData( $data, $filters )
    {
        $values = [];
        foreach ($data as $idx => $record)
        {
            $record->idx = $idx;
            $this->prepareRecord( $record, $filters );
            $values[] = $this->orderValue( $record, $filters );
        }

        $filters->orderMax = max( $values );
        return $data;
    }

    protected function prepareRecord( $record, $filters )
    {
        $this->prepareSortingValues( $record->sortingValues );
        $record->isFavorite = in_array( $record->idx, $filters->favorites );
        $record->orderField = $filters->orderby;
        $record->orderValue = $this->orderValue( $record, $filters );
    }

    protected function prepareSortingValues( $sortingValues )
    {
        $sortingValues->topRestaurants = ($sortingValues->distance * $sortingValues->popularity) + $sortingValues->ratingAverage;
    }

    protected function isValidRecord( $record, $filters )
    {
        if ( !isset( $filters->keywords ) || !$filters->keywords || stripos($record->name, $filters->keywords) !== false )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    protected function orderFavorite( $record )
    {
        return isset( $record->isFavorite ) && $record->isFavorite ? static::L1_FAVORITE : static::L1_NOT_FAVORITE;
    }

    protected function orderState( $record )
    {
        switch ( $record->status )
        {
            case 'open':
                $order = static::L2_OPEN;
                break;

            case 'order ahead':
                $order = static::L2_ORDER_AHEAD;
                break;

            case 'closed':
                $order = static::L2_CLOSE;
                break;

            default:
                $order = static::L2_UNKNOWN;
                break;
        }
        return $order;
    }

    protected function orderValue( $record, $filters )
    {
        return isset( $record->sortingValues->{$filters->orderby} ) ? $record->sortingValues->{$filters->orderby} : 0;
    }


    /**
     * Get the orderSorting for sorting
     * By Default ASC
     * For DESC we invert de order Value using maxValue
     * 
     * @param $record \stdClass
     * @param $filters \stdClass
     * @return string
     */
    protected function orderSorting( $record, $filters )
    {
        $orderValue = $this->orderValue( $record, $filters);
        switch ($filters->orderby)
        {
            // desc 
            case 'bestMatch':
            case 'newest':
            case 'ratingAverage':
            case 'popularity':
            case 'topRestaurants':
                $orderValue = $filters->orderMax - $orderValue;
                break;
        }
        //$orderValue = str_pad($orderValue, strlen( $filters->orderMax), ' ', STR_PAD_LEFT);
        return $orderValue;
    }
}
