<?php
namespace Common\Model;
use Think\Model;
class GameBaseModel extends MModel {
	Protected $autoCheckFields = false;
	public $id;
	public function c($game_id){
		$this->id = 0;
		if(!$game_id) return $this;
		$obj = D('Games\\Game'.$game_id);
		$obj->id = $game_id;
		return $obj;
	}
	/*
	 * 生成期号
	 * @game_id : 彩票种类
	 */
	public function makeIssue($p){

	}

	/*
	 * 取得当前期号
	 * @ game_id : 游戏种类id 
	 */
	public function getIssue($p){
		$game_id = $this->id;
		$time = $p['time'] ? $p['time'] : GNT();
		$timeData = $this->getIssueTime();
		$fTime = date("H:i:s",$time);

		if($timeData) foreach($timeData as $v){
			if($fTime >= $v['startTime'] && $fTime < $v['endTime']){
				$v['startTime'] = strtotime(date("Y-m-d ",GNT()).$v['startTime']);
				$v['endTime'] = strtotime(date("Y-m-d ",GNT()).$v['endTime']);
				return $this->makeIssue(['issue'=>$v['issue'],'time'=>$time,'startTime'=>$v['startTime'],'endTime'=>$v['endTime']]); 
			} 
		}
	}
	/*
	 * 取开奖时间
	 * @game_id : 游戏种类ID,为空取所有
	 */
	public function getIssueTime(){
		$game_id = $p['game_id'];
		$mod = D('GameTime');
		$mod->order('game_id asc,issue asc');
		$mod->field('id,game_id,issue,startTime,singleTime,endTime');

		if($this->id){
			$mod->where(['game_id'=>$this->id]);
		}
		$result = $mod->select();
		//全部数据则格式化
		if(!$this->id){

			$r = $result;
			$result = [];
			foreach($r as $v){
				$result[$v['game_id']][] = $v;
			}  
		}
		return $result;
	}
}




