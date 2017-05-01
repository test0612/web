<?php
return array(
	//'配置项'=>'配置值'
	'DB_TYPE'      =>  'mysql',     // 数据库类型
	'DB_HOST'      =>  '192.168.0.10',     // 服务器地址
	'DB_NAME'      =>  'lottery',     // 数据库名
	'DB_USER'      =>  'root',     // 用户名
	'DB_PWD'       =>  '123123',     // 密码
	'DB_PORT'      =>  '3306',     // 端口 
	'DB_PREFIX'    =>  '',     // 数据库表前缀
	'DB_DSN'       =>  '',     // 数据库连接DSN 用于PDO方式ß		
	'DB_CHARSET'   =>  'utf8', // 数据库的编码 默认为utf8
	'SALT' => md5('qwieuyuqihkjasdhasd123123'),
	'API_MODEL' => 'http://model.lottery.com',
);