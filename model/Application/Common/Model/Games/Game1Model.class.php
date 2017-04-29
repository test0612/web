<?php
namespace Common\Model\Games;
 
class Game1Model extends \Common\Model\GameBaseModel {
	 
	/*
	 * 生成期号
	 * @game_id : 彩票种类
	 */
	public function makeIssue($p){ 
		$issue = date("Ymd",$p['time']).$p['issue'];
		$p['issue'] = $issue;
		
		return $p;
	}
}