<?php

namespace App\Core;

set_time_limit(0);
ini_set('max_execution_time',0);

abstract class Command {

	protected $signature = null;
	protected $description = null;

	protected $argv = [];
	protected $args = [];
	protected $options = [];
	protected $cache = [];

	protected $keyname = 'keyname';
	protected $now = null;
	protected $config = [];

	public function config( $config ){
		$this->now = new \Datetime();
		foreach( $config as $variable => $value ){
			$keys = array_keys( $this->config, $variable );
			foreach ( $keys as $protected ){
				$this->$protected = $value;
			}
		}
	}

	public function run( $request ){
		try {
			$action = isset($request['action'])?$request['action']:null;
			if (!$action||!method_exists($this,$action)){
				exit(";(");
			}

			$reflection = new ReflectionMethod($this, $action);
			if (!$reflection->isPublic()) {
				exit(":P");
			}

			$this->request = $request;
			return $this->$action();
		} catch( \Exception $e ){
			exit($e->getMessage());
		}
	}

	public function getSignature()
	{
		return $this->signature;
	}

	public function phpinfo(){
		phpinfo();
	}

	public function lsHome(){
		$home = dirname(__FILE__);
		$this->execute("ls $home");
	}

	public function tarHelp(){
		$this->execute('tar --help');
	}

	public function mysqlHelp(){
		$this->execute('mysql --help');
	}

	public function mysqldumpHelp(){
		$this->execute('mysqldump --help');
	}

	public function sshHelp(){
		$this->execute('ssh --help');
	}

	public function rsyncHelp(){
		$this->execute('rsync --help');
	}

	public function unzipHelp(){
		$this->execute('unzip --help');
	}

	protected function getRequest($variable,$mandatory=false,$defaultValue=null){
		if (!isset($this->request[$variable])){
			if ( $mandatory ){
				throw new \Exception("$variable is mandatory");
			}
			else {
				return $defaultValue;
			}
		}

		return $this->request[$variable];
	}

	protected function getLastDays($fromDate){
		if ($fromDate){
			$from = new \DateTime($fromDate);
			$diff = $this->now->diff($from);
			return $diff->format('%R%a');
		}
		else {
			return '-3';
		}
	}

	protected function getDefaultTarGzFile(){
		return sprintf("%s_%s.tar.gz", $this->keyname, $this->now->format('Ymd_His'));
	}

	protected function getDefaultSQLFile(){
		return sprintf("%s_%s.sql", $this->keyname, $this->now->format('Ymd_His'));
	}

	public function compressWP(){
		$tarGzFile = $this->getRequest('file',false,$this->getDefaultTarGzFile());
		$this->execute("tar -czPf {$this->uhorizonPath}/$tarGzFile {$this->wordpressPath}");
	}

	public function compressWPLastFiles(){
		$tarGzFile = $this->getRequest('file',false,$this->getDefaultTarGzFile());
		$lastDays = $this->getLastDays($this->getRequest('from'));
		$this->execute("tar -czPf {$this->uhorizonPath}/{$tarGzFile} `find {$this->wordpressPath} -type f -mtime {$lastDays}`");
	}

	public function extractWP(){
		$tarGzFile = $this->getRequest('file',true);
		$this->execute("cd {$this->uhorizonPath}; tar -xzf $tarGzFile; mv kunden/homepages/11/d415238290/htdocs/uh-www/zomufish/wordpress .; rm -rf kunden");
	}

	public function showDB(){
		$sql = 'show tables;';
		$this->execute("mysql -e \"$sql\" -u{$this->mysqlUser} -p\"{$this->mysqlPass}\" -h{$this->mysqlHost} {$this->mysqlDB}");
	}

	public function updateDB(){
		$sqlFile = $this->getRequest('file',true);
		$this->execute("mysql -u{$this->mysqlUser} -p\"{$this->mysqlPass}\" -h{$this->mysqlHost} {$this->mysqlDB} < {$this->uhorizonPath}/$sqlFile");
	}

	public function dumpDB(){
		$sqlFile = $this->getRequest('file',false,$this->getDefaultSQLFile());
		$this->execute("mysqldump -u{$this->mysqlUser} -p\"{$this->mysqlPass}\" -h{$this->mysqlHost} {$this->mysqlDB} > {$this->uhorizonPath}/$sqlFile");
	}

	public function readFile(){
		$file = $this->getRequest('file',true);
		readfile("{$this->uhorizonPath}/{$file}");
	}

	public function rmFile(){
		$sqlFile = $this->getRequest('file',true);
		$this->execute("rm -f {$this->uhorizonPath}/$sqlFile");
	}

	public function unzipFile(){
		$zipFile = $this->getRequest('file');
		$folderPath = $this->getRequest('folder',false,dirname($zipFile));
		$this->execute("cd {$folderPath}; unzip $zipFile");
	}	

	public function dumpAndDownloadDB(){
		header("Content-Type:text/plain");
		$this->header = true;
		$this->verbose = false;
		$this->request['file'] = $this->getDefaultSQLFile();
		$this->dumpDB();
		$this->readFile();
		$this->rmFile();
	}

	public function compressAndDumpWP(){
		$fileName = $this->getRequest('file',true);
		$this->request['file'] = sprintf('%s.tar.gz',$fileName);
		$this->compressWP();
		$this->request['file'] = sprintf('%s.sql',$fileName);
		$this->dumpDB();
	}

	protected function execute( $cmd ){
		if (!$this->header && $this->verbose ) {
			header("Content-Type:text/plain");
			$this->header = true;
		}
		$output = array(); $returnVar = 0;
		if ( $this->verbose )
		{
			echo "-->executing: $cmd\n";
		}
		$lastLine = exec( $cmd, $output, $returnVar);
		if ( $this->verbose )
		{
			if (!empty($output)){ echo implode("\n",$output)."\n"; }
			echo "-->returned: {$returnVar}\n";
		}

		$ret = new \stdClass();
		$ret->output = $output;
		$ret->returnVar = $returnVar;
		return $ret;
	}

	public function system( $cmd, $verbose = false )
	{
		$this->header = true;
		$this->verbose = $verbose;
		return $this->execute( $cmd );
	}

	public function argv( $argv = null )
	{
		if ( is_null( $argv ) ) return $this->argv;
		else 
		{
			$cache = []; $i = 0;
			$keys = array_keys( $this->args );
			foreach ($argv as $key => $value) {
				if (isset( $this->options[ $value ] ))
				{
					$cache['options'][$value] = true;
				}
				else
				{
					$cache['args'][ $keys[ $i ] ] = $value;
					$i++;
				}
			}

			$this->argv = $argv;
			$this->cache = $cache;
		}
	}

	public function hasArg( $key )
	{
		return isset( $this->cache['args'][ $key ] );
	}

	public function getArg( $key  )
	{
		return isset( $this->cache['args'][ $key ] ) ? $this->cache['args'][ $key ] : null;
	}

	public function getOpt( $key )
	{
		return isset( $this->cache['options'][ $key ] ) ? true : false;
	}

	abstract public function handle( $app, $argv );
}
?>
