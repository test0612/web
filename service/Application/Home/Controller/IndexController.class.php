<?php
namespace Home\Controller;
use Think\Controller\HproseController;
class IndexController extends HproseController {
    public function index(){
    }
    public function g($action,$params=array()){
    	vendor('Hprose.HproseHttpClient'); 
        $client = new \HproseHttpClient(C('API_MODEL')); 
        $result = $client->g($action,$params);
        return $result;
    }
}