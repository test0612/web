<?php
 
function jError($msg=''){
	return ['errormsg'=>$msg];
}
/*
 * 当前时间戳
 */
function GNT(){
	return time();
}
/*
 * 数组设置键名
 * @arr 数组
 * @kname 键名列名称
 */
function makeArrayKey($arr,$kname){
	$result = array();
	foreach($arr as $v){
		$result[$v[$kname]] = $v;
	}
	return $result;
}
/*
 * 数组递归分组
 * @arr 数组
 * @id,$pid 主键ID,父ID
 */
function makeArrayTree($arr,$id='id',$pid='pid'){
	 
	$arr = makeArrayKey($arr,$id);
	foreach($arr as $k=>$v){
		if($arr[$v[$pid]]){
			$arr[$v[$pid]]['son'][$v[$id]] = $v;
			unset($arr[$k]);
		}
	}
	return $arr;
}