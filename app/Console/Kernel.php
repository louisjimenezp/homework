<?php 

namespace App\Console;

use App\Core\Console;

class Kernel extends \App\Core\Console {

    protected $app = null;

    protected $commands = [

    ];

    public function handle( $app, $argv )
    {
        try
        {
            $signature = isset( $argv[1] ) ? $argv[1] : null;
            if (!$signature)
            {
                throw new \Exception('Signature is mandatory');
            }
            $found = false;
            foreach( $this->commands as $command )
            {
                $cmd = new $command();
                if ( $cmd->getSignature() == $signature )
                {
                    $argv = array_slice($argv, 2); // lcmd + signature 
                    $cmd->argv( $argv );
                    $cmd->handle($app, $argv);
                    $found = true;
                }
            }
            if (!$found)
            {
                throw new \Exception('Signature not found');
            }
        }
        catch( \Exception $e )
        {
            Console::error( $e );
        }
    }
}