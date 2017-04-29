<?php
namespace Common\Model;
use Think\Model;
class GameModel extends MModel {
	Protected $autoCheckFields = false;
	//
	public function getNameList($p=[]){
		$mod = D('GameName');
		$mod->field("id,pid,title,shortTitle,sort,thumb,winStartTime,winEndTime,apiUri");
		$mod->order('sort desc');
		$mod->where(['status'=>1]);
    	if($p['group'] == 1){

    	}else{
    		$mod->where(array('pid'=>['NEQ',0]));
    	}
    	 
		$result = $mod->selectCount();
		 
		if($p['group'] == 1){
			$result['data'] = makeArrayTree($result['data']);
		}
		return $result;
	}
	//
	public function getTime($p){

	}
	/*
	 * 取得当前期号
	 * @ game_id : 游戏种类id 
	 */
	public function getIssue($p){ 
		return D('GameBase')->c($p['game_id'])->getIssue(); 
	}
	/*
	 * 生成期号
	 * @game_id : 彩票种类	
	 */
	public function makeIssue($p){

	}
	/*
	 * 取开奖时间
	 * @game_id : 游戏种类ID,为空取所有
	 */
	public function getIssueTime($p){
		$game_id = $p['game_id'];
		return D('GameBase')->c($game_id)->getIssueTime(); 
	}
}








