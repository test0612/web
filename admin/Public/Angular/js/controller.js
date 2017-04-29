function cl(a){
	console.log(a);
}
app.controller('arcsList', function($scope) {
	$scope.mod = 'Arcs';
	$scope.columns = [{
	
	}];
});
app.controller('configConf', function($scope,$req) {
	$scope.mod = 'Config';
	$scope.txtMode = '页面参数';
    $scope.formData = {};
	$req.g('Config','gs',{}).success(function(responce){
		cl(responce);
		$scope.formData = responce;
	})
	$scope.subForm = function(){
		var params = $scope.formData;
 		
		$req.FH($scope.mod,'ss',params);
	}
});
app.controller('html', function($scope,$req) {
	$scope.alang = ALANG;
});
app.controller('catalogsThumbs',function($scope,$stateParams,$req,$timeout){
	$scope.data = {};
	$scope.cata = {};
	$req.p('Catalogs','getOne',{id:$stateParams.id}).success(function(responce){
		$scope.cata = (responce);
	});
	$scope.addThumb = function(params){
		
		$req.p('Thumbs','adds',{'thumbs':params,'catalog_id':$stateParams.id}).success(function(responce){
			$scope.getData();
		});
	}
	$scope.getData = function(){
		$req.p('Thumbs','selectData',{'catalog_id':$stateParams.id}).success(function(responce2){
			$scope.data = (responce2);
			$timeout(function(){
				$("[titleid]").bind('blur',function(){
					var id = $(this).attr('titleid');
					var val = $(this).val();
					var params = {};
					params['id'] = id;
					params['title'] = val;
					$req.p('Thumbs','rsave',params).success(function(responce){
						
					});
				});
			},500);
		});
	}
	//删除
	$scope.delOne = function(id){
		$req.p('Thumbs','operAction',{'operAction':'delete','ids':id}).success(function(responce){
			$("#arc"+id).fadeOut();
		});
	}
	$scope.getData();
});
app.filter('entertobr',function(){
	return function(text){
		return text.replace(/\n/g,'<br/>');
	}
})
app.controller('areasList', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Areas';
	$scope.title= '区域管理';
	$scope.oper = {
		'delete':'删除'
	};
	$scope.actions = [
		{
			html : '<a href="#/areas/detail/45/0" class="btn btn-sm green"> 添加区域  <i class="fa fa-plus"></i> </a>',
		}
	];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'国家',
			html:'{{title}}',
			search : {
				field:'title',
				title:'请输入国家',
				mod:'like',
				type:'text'
			}
		},
		{
			title:'区域',
			html:'{{rules|entertobr}}',
			search : {
				field:'title',
				title:'请输入区域',
				mod:'like',
				type:'text'
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/areas/detail/'+$stateParams.id+'/{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
app.controller('joinusArcs', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Joinus';
	$scope.title = '文档管理';
	$scope.oper = {
		'delete':'删除',
		'copy':'复制'
	};
	$scope.actions = [
		{
			html : '<a href="#/joinus/detail/0" class="btn btn-sm green"> 添加信息  <i class="fa fa-plus"></i> </a>',
		}
	];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'职位',
			html:'{{title}}',
			search : {
				field:'title',
				title:'请输入标题',
				mod:'like',
				type:'text'
			}
		},
		{
			title:'区域',
			html:'{{intro}}',
			width:'200px',
			search : {
				field:'intro',
				title:'请输入区域',
				mod:'like',
				type:'text'
			}
		},
 
		{
			title:'时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			width:'120px',
			search : {
				field:'title',
				minTitle:'起始时间',
				maxTitle:'截止时间',
				mod:'like',
				type:'betweendate'
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/joinus/detail/{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
app.controller('areasDetail', function($scope,$req,$timeout,$stateParams) {
 
	$scope.mod = 'Areas';
	$scope.txtMode = $stateParams.id==0?'添加区域':'区域信息';
	$scope.formData = {};
	$req.g($scope.mod,'getOne',{id:$stateParams.id}).success(function(responce){
		$scope.formData = responce; 
	});
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH($scope.mod,'rsave',params);
	}
});
app.controller('joinusDetail', function($scope,$req,$timeout,$stateParams) {
 
	$scope.mod = 'Joinus';
	$scope.txtMode = $stateParams.id==0?'添加信息':'事记信息';
	$scope.formData = {};
	$req.g($scope.mod,'getOne',{id:$stateParams.id}).success(function(responce){
		$scope.formData = responce;
	});
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH($scope.mod,'rsave',params);
	}
});
app.controller('welcome', function($scope,$req,$timeout,$stateParams) {
});
app.controller('dongtaiArcs', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Dongtai';
	$scope.title = '文档管理'; 
	$scope.actions = [
		{
			html : '<a href="#/dongtai/detail/'+$stateParams.catalog_id+'/0" class="btn btn-sm green"> 添加珍贵历程  <i class="fa fa-plus"></i> </a>',
		}
	];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'标题',
			html:'{{title}}',
			width:'200px',
			search:{
				'type':'text',
				'mode':'like',
				'title':'请输入标题',
				'field':'title'
			}
		},
		{
			title:'年份',
			html:'{{year}}',
			width:'200px',
			search:{
				'type':'text',
				'mode':'like',
				'title':'请输入年份',
				'field':'year'
			}
		},
 
		{
			title:'时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			width:'120px',
			search:{
				'type':'betweendate',
				'minTitle':'起始时间',
				'maxTitle':'截止时间',
				'field':'cdate'
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/dongtai/detail/'+$stateParams.catalog_id+'/{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
app.controller('dongtaiDetail', function($scope,$req,$timeout,$stateParams) {
 
	$scope.mod = 'Dongtai';
	$scope.txtMode = $stateParams.id==0?'添加事记':'事记编辑';
	$scope.formData = {};
	$req.g($scope.mod,'getOne',{id:$stateParams.id}).success(function(responce){
		$scope.formData = responce;
	});
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH($scope.mod,'rsave',params);
	}
});
app.controller('leadersArcs', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Leaders';
	$scope.oper = {
		'delete':'删除',
		'copy':'复制'
	};
	$scope.title = '文档管理';
	$scope.actions = [
		{
			html : '<a href="#/leaders/detail/'+$stateParams.id+'/0" class="btn btn-sm green"> 添加领导班子  <i class="fa fa-plus"></i> </a>',
		}
	];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'缩略图',
			html:'<a href="{{thumb}}" target="_blank"><img src="{{thumb}}" style="max-height:100px"/></a>',
			width:'100px'
		},
		{
			title:'标题',
			html:'{{title}}',
			search:{
				'type':'text',
				'mode':'like',
				'title':'请输入标题',
				'field':'title',
				search:{
					'type':'text',
					'mode':'like',
					'title':'请输入标题',
					'field':'title'
				}
			}
 
		},
		{
			title:'职位',
			html:'{{intro}}',
			width:'140px',
			search:{
				'type':'text',
				'mode':'like',
				'title':'请输入职位',
				'field':'year',
				search:{
					'type':'text',
					'mode':'like',
					'title':'请输入职位',
					'field':'intro'
				}
			}
		},
		 
		{
			title:'时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			width:'160px',
			search:{
				'type':'betweendate',
				'mode':'like',
				field:'cdate',
				'minTitle':'起始时间',
				'maxTitle':'结束时间'
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/leaders/detail/'+$stateParams.id+'/	{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
app.controller('leadersDetail', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Leaders';
	$scope.txtMode = $stateParams.id==0?'领导添加':'领导编辑';
	$scope.formData = {};
	$req.g($scope.mod,'getOne',{id:$stateParams.id}).success(function(responce){
		$scope.formData = responce;
	});
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH($scope.mod,'rsave',params);
	}
});
//栏目- 单页
app.controller('catalogs_single', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Catalogs';
	$req.p($scope.mod,'getOne',{id:$stateParams.id}).success(function(responce){
		$scope.formData = responce;
	});
	 
	$scope.subForm = function(){
		var params = $scope.formData;
		cl(params);
	 
		$req.FH($scope.mod,'rsave',params);
	}
});
app.controller('arcsDetail', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Arcs';
	 
	$scope.txtMode = $stateParams.id==0?'文档添加':'文档编辑';
	$scope.formData = {};
	
	$req.g('Arcs','getOne',{id:$stateParams.id}).success(function(responce){
		$scope.formData = responce;
		if(!$scope.formData['catalog_id'])$scope.formData['catalog_id']  = $stateParams.catalog_id;
	});
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH($scope.mod,'rsave',params);
	}
});
app.controller('videosDetail', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Arcs';
	 
	$scope.txtMode = $stateParams.id==0?'文档添加':'文档编辑';
	$scope.formData = {};
	
	$req.g('Arcs','getOne',{id:$stateParams.id}).success(function(responce){
		$scope.formData = responce;
		if(!$scope.formData['catalog_id'])$scope.formData['catalog_id']  = $stateParams.catalog_id;
	});
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH($scope.mod,'rsave',params);
	}
});
app.controller('videosDetail', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Videos';
	$scope.title = '文档管理';
 
	$scope.oper = {
		'delete':'删除',
		'copy':'复制'
	};
	$scope.postparams = {'catalog_id':$stateParams.id};
	$scope.actions = [
		{
			html : '<a href="#/videos/detail/'+$stateParams.id+'/0" class="btn btn-sm green"> 添加1  <i class="fa fa-plus"></i> </a>',
		}
	];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'缩略图',
			html:'<a href="{{thumb}}" target="_blank"><img src="{{thumb}}" style="max-height:50px"/></a>',
			width:'100px'
		},
		{
			title:'标题',
			html:'{{title}}',
			width:'200px'
		},
		{
			title:'描述',
			html:'{{intro}}'
		},
		{
			title:'时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			width:'120px'
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/arcs/detail/'+$stateParams.id+'/	{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
app.controller('catalogs_arcs45',function($scope){
	cl(123)
})
app.controller('catalogs_arcs', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Arcs';
	$scope.title = '文档管理';
	$scope.oper = {
		'delete':'删除',
		'copy':'复制'
	};
	$scope.postparams = {'catalog_id':$stateParams.id};
	$scope.actions = [
		{
			html : '<a href="#/arcs/detail/'+$stateParams.id+'/0" class="btn btn-sm green"> 添加文档  <i class="fa fa-plus"></i> </a>',
		}
	];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'缩略图',
			html:'<a href="{{thumb}}" target="_blank"><img src="{{thumb}}" style="max-height:50px"/></a>',
			width:'100px'
		},
		{
			title:'标题',
			html:'{{title}}',
			width:'200px'
		},
		{
			title:'描述',
			html:'{{intro}}'
		},
		{
			title:'时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			width:'120px'
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/arcs/detail/'+$stateParams.id+'/	{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
//参数配置
app.controller('config', function($scope,$req,$timeout) {
	$scope.mod = 'Config';
	$scope.title = '参数配置';
	alert(123);
	$req.p($scope.mod,'getOne',{id:3}).success(function(responce){
		$scope.formData = responce;
 		
	});
	 
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH($scope.mod,'rsave',params);
	}
});
app.controller('msgbox', function($scope,$req,$stateParams) {
	$scope.back = function(){
		history.back();
	}
	$scope.reload = function(){
		$("[data-dismiss='modal']").trigger('click');
	}
});