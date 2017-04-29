<?php
namespace Home\Controller;
use Think\Controller\HproseController;
class IndexController extends HproseController {

    public function index(){
    	$r = D('Game')->getNameList(['group'=>1]);
    	 
    }
    public function g($action,$params=array()){

    	$action = explode('.',$action);
    	 
    	if(count($action) != 2) return false;
    	$mod = $action[0];
    	$action = $action[1];
 
    	return D($mod)->$action($params);
    }
}