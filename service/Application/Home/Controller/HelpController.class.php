<?php
namespace Home\Controller;
use Think\Controller;
class HelpController extends Controller {
    public function index(){
    	$apiHelps = [];


    	$func = 'Game.getNameList';
    	$params = ['group'=>'[1|null]<br/>1:包含游戏分类和游戏种类的二维数组<br/>null:只包含游戏种类']; 
    	$testparams = ['group'=>1];
    	$backparams = ['data(数据)'=>['彩种id'=>['id'=>'彩种ID','apiUrl'=>'开奖地址','pid'=>'分类ID','title'=>'彩种名称','shortTitle'=>'短名称','sort'=>'排序(已经排好)','thumb'=>'图标','winStartTime'=>'开始时间','winEndTime'=>'结束时间','son'=>'(如果group为1则此字段包含的是子分类)']],'count'=>'总记录数'];
    	$apiHelps[] = ['func'=>$func,'funcIntro'=>'取得游戏种类列表','params'=>$params,'backparams'=>$backparams,'testparams'=>$testparams];


    	$func = 'Game.getIssue';
    	$params = ['*game_id'=>'(int)<br/>彩种ID']; 
    	$testparams = ['game_id'=>1];
    	$backparams = ['issue'=>'期号'];
    	$apiHelps[] = ['func'=>$func,'funcIntro'=>'开奖期号','params'=>$params,'backparams'=>$backparams,'testparams'=>$testparams];

    	$func = 'Game.getIssueTime';
    	$params = ['game_id'=>'[ (int) | null ]<br/>彩种ID,空则获取全部']; 
    	$testparams = [ ];
    	$backparams = [];
    	$apiHelps[] = ['func'=>$func,'funcIntro'=>'开奖时间','params'=>$params,'backparams'=>$backparams,'testparams'=>$testparams];

    	$d = [];
    	for($i=100;$i>0;$i--){
    		$d[$i] = rand(0,9).','.rand(0,9).','.rand(0,9).','.rand(0,9).','.rand(0,9);
    	}
    	#echo json_encode($d);
    	#exit;
    	$this->apiHelps = $apiHelps;
    	$this->SERVICE_URI = C('SERVICE_URI');
    	$this->WWW_URI = C('WWW_URI');
    	$this->display();
    }
}