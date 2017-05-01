<?php
namespace Home\Controller;
use Think\Controller;
class IndexController extends Controller {
	public function _initialize(){
		$this->PURL = "/Public/";
		$this->TPL_URL = "?g=Manager&c=Index&a=tpl&tpl=";
		$this->DATA_URL = '?c=Data&a=';
	}
	public function index(){ 
		 
		#$this->curuser = session('curadmin'); 
		#if(!$this->curuser){
			#redirect('/manage/login/');
			#exit;
		#}
 		 
		#$this->css = $this->_CSS();
		#$this->js = $this->_JS();

		$this->display();
	}
	public function tpl(){

		$tplname = I('GET.tpl');
 
		$tpl = explode(".",$tplname);
		$tpl = implode("/",$tpl);
 		$controller = str_replace("/","_",$tpl);
 		 
		$html = $this->fetch($tpl); 
		echo $html;
	}
	public function login(){
		$this->assign('PURL','/core/Public/Angular/'); 
		$p = I('POST.');
		
		if($p){
 
			if($p['username'] == 'admin' && $p['password'] == '123123'){
				$u = array(); 
				$u['rank_name'] = $this->sys_name;
				$u['name'] = $u['jobnumber'] = 'admin';
				$u['rank_id'] = 0;
				 
				session('curadmin',$u);
				redirect('/admina/#');
				exit;
			}
			/*
			$map = array();
			$map['_logic'] = 'OR';
			$map['jobnumber'] = $p['username'];
			$map['phone'] = $p['username'];
			$map['pwd'] = md5salt($p['password']);
			
			$u = D('Users')->WHERE($map)->find();
			if($u && $u['rank_id'] > 0){
				$rankName = D('Rank')->WHERE(array('id'=>$u['rank_id']))->getField('name');
 
				$u['rank_name'] = $rankName;
			 
				session('curuser',$u);
				redirect('/#');
				exit;
			}else{
 
				echo '<meta http-equiv="Content-type" content="text/html; charset=utf-8"><script>alert("用户名/密码错误");location.href = "/login"</script>';
 
			}
			exit;
			*/
		}	
		session('curuser',null);
		$this->show();
	}
	public function _CSS(){
		$purl = $this->PURL;
		$cssFiles = [];
		$cssFiles[] = 'plugins/font-awesome/css/font-awesome.min.css';
		$cssFiles[] = 'plugins/simple-line-icons/simple-line-icons.min.css';
		$cssFiles[] = 'plugins/bootstrap/css/bootstrap.min.css';
		$cssFiles[] = 'plugins/bootstrap-switch/css/bootstrap-switch.min.css';
		$cssFiles[] = 'css/components.min.css';
		$cssFiles[] = 'css/plugins.min.css';
		$cssFiles[] = 'layouts/layout/css/layout.min.css';
		$cssFiles[] = 'layouts/layout/css/themes/darkblue.min.css';
		$cssFiles[] = 'layouts/layout/css/custom.min.css'; 
		$result = "";
		foreach($cssFiles as $v){
			$v = $purl.$v."";
			$result .= "<link href=\"".$v."\" rel=\"stylesheet\" type=\"text/css\" />\n";
		}
		return $result;
	}
	private function _JS(){

	}
	
}