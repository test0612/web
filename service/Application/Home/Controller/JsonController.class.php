<?php
namespace Home\Controller;
use Think\Controller;
class JsonController extends Controller {
    public function index(){

    	$post = I('POST.');
    	if(!$post) $post = I('GET.'); 
    	vendor('Hprose.HproseHttpClient');  
        $client = new \HproseHttpClient(C('API_MODEL'));

        $result = $client->g($post['action'],$post['params']);
        if(I('GET.debug') == 1){
        	print_r($result);
        	exit;
        }
 		echo json_encode($result);
    }
}