<?php
namespace Home\Controller;
use Think\Controller;
class TestController extends Controller {

    public function index(){
        ?>
        <meta http-equiv="content-type" content="text/html;charset=utf-8">
        <?php
    	$r = D('Game')->getIssue(['game_id'=>1]); 
    }
    public function g($action,$params=array()){

    	$action = explode('.',$action);
    	 
    	if(count($action) != 2) return false;
    	$mod = $action[0];
    	$action = $action[1];
 
    	return D($mod)->$action($params);
    }
}