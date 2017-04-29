<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<!-- 最新版本的 Bootstrap 核心 CSS 文件 -->
	<link rel="stylesheet" href="<?php echo ($WWW_URI); ?>/Public/bootstrap/css/bootstrap.min.css" />

	<!-- 可选的 Bootstrap 主题文件（一般不用引入） -->
	<link rel="stylesheet" href="<?php echo ($WWW_URI); ?>/Public/bootstrap/css/bootstrap-theme.min.css" />

	<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
	<script src="<?php echo ($WWW_URI); ?>/Public/bootstrap/js/bootstrap.min.js" crossorigin="anonymous"></script>
</head>
<body>
<div class='wrap'>
	<figure class="highlight"><pre><code class="language-bash" data-lang="bash">
	接口地址:<?php echo C("SERVICE_URI");?><br/>
	JSON:<?php echo C("SERVICE_URI");?>/json<br/>
	说明:由方法名,参数[数组]组成<br/>
	接受形式:post,rpc<br/>
	逻辑错误:errormsg为错误信息,如出现此字段则出错
	</code></pre></figure>
	<div>
	<h2>游戏部分</h2>
	<table class="table table-striped">
	<thead>
	<tr>
		<td width='100px'>名称</td>
		<td width='300px'>参数</td>
		<td width='500px'>返回值说明</td>
		<td >示例</td>
	</tr>
	</thead>
	<tbody>
	<?php
 foreach($apiHelps as $v){ ?>
	<tr>
		<td><?php echo ($v["func"]); ?><br/><?php echo ($v["funcIntro"]); ?></td>
		<td>
		<table>
			<?php
 if($v['params']){ foreach($v['params'] as $kk=>$vv){ ?>
						<tr>
							<td><b><?php echo ($kk); ?></b> :</td>
							<td><?php echo ($vv); ?></td>
						</tr>
						<?php
 } } ?>
		</table>
		</td>
		<td><?=json_encode($v['backparams'],JSON_UNESCAPED_UNICODE)?></td>
		<?php  $postparams = ['action'=>$v['func'],'params'=>$v['testparams']]; $testparams = http_build_query($postparams); ?>
		<td><a href='<?php echo ($SERVICE_URI); ?>/json/?<?php echo ($testparams); ?>' target='_blank'>测试</a></td>
	</tr>
	<?php } ?>
	</tbody>
	</table>
	</div>
</div>
<style>
.wrap{
	width:1000px;
	margin:0px auto;
	margin-top:20px;
}
</style>
</body>
</html>