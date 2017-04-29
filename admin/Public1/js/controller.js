

app.controller('test',function($scope,$stateParams){ 
});
app.controller('inc_header',function($scope,$stateParams){ 
});
app.controller('inc_footer',function($scope,$stateParams){ 
});
app.controller('inc_sidebar',function($scope,$stateParams){ 
});
app.controller('inc_quick-sidebar',function($scope,$stateParams){ 
});
app.controller('users_detail',function($scope){ 
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'专场名称',
			html:'{{name}}'
		},
		{
			title:'价格',
			html:'{{price}}'
		},
		{
			title:'拍品数量',
			html:'{{maxnum}}'
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="javascript:;" click="check({{id}})" class="btn btn-xs green"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	]
})
app.controller('conf.organ',function($scope){
	$scope.mod = 'OrganConf';
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'名称',
			html:'{{name}}'
		},
		{
			title:'价格',
			html:'￥{{amount|number:2}}',
		}, 
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/conf/organ_detail/id={{id}}"   class="btn btn-xs green"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	]
});

app.controller('organ_detail',function($scope,$stateParams,$req){
	$scope.formData = {};
	$scope.txtMode = '编辑机构';
	$scope.mod = 'OrganConf';
	$scope.id = $stateParams.id;
	$req.g($scope.mod,'getOne',{id:$scope.id},function(responce){
		$scope.formData = responce; 
	});
	$scope.subForm = function(){
		$req.FH($scope.mod,'rsave',$scope.formData);
	}
});
app.controller('store_detail',function($scope,$req,$staticData,$stateParams){
	var id = $stateParams.id;

	$scope.mod = 'Stores';
	$scope.formData = {'name':''};
	$scope.statusArr = {'waitpay':'审核通过，待交服务费','fail':'审核不通过'}; 
	if($stateParams.id > 0){ 
		$req.g($scope.mod,'getOne',{'id':id}).success(function(responce){
			$scope.formData = responce['result'];
			$scope.initForm();
		});
	}
	//根据状态初始化
	$scope.initForm = function(){
		//初审 
		if($scope.formData.status == 'init' || $scope.formData.status == 'wait' || $scope.formData.status == 'fail'){ 
			$scope.statusArr = {'waitpay':'通过审核，等待付款','fail':'审核不通过'};

			$scope.subForm = function(){
				$req.FH($scope.mod,'adopt',$scope.formData);
			}
		}
	}
	$scope.subForm = function(){};
});
app.controller('auction_store_detail',function($scope,$req,$staticData,$stateParams){
	$scope.navstatus = '';
	$scope.storeDetail = {};
	
	$scope.store_id = $stateParams.id;
	$req.g('Stores','getOne',{id:$scope.store_id},function(responce){
		$scope.storeDetail = responce;
	});
	$scope.$on('navstatus',function(event,data){
		$scope.navstatus = data;
	});
});
app.controller('auction_store_detail.info',function($scope,$req,$staticData,$stateParams){
	$scope.$emit('navstatus','info');
	var id = $stateParams.id;

	$scope.mod = 'Stores';
	$scope.formData = {'name':''};
	$scope.statusArr = {'waitpay':'审核通过，待交服务费','fail':'审核不通过'}; 
	if($stateParams.id > 0){ 
		$req.g($scope.mod,'getOne',{'id':id}).success(function(responce){
			$scope.formData = responce['result'];
			$scope.initForm();
		});
	}
	//根据状态初始化
	$scope.initForm = function(){
		//初审 
		if($scope.formData.status == 'init' || $scope.formData.status == 'wait' || $scope.formData.status == 'fail'){ 
			$scope.statusArr = {'waitpay':'通过审核，等待付款','fail':'审核不通过'};

			$scope.subForm = function(){
				$req.FH($scope.mod,'adopt',$scope.formData);
			}
		}
	}
	$scope.subForm = function(){
		$req.FH('Stores','adopt',$scope.formData);
	};
});
app.controller('auction_store_detail.agoods',function($scope,$req,$staticData,$stateParams){
	$scope.$emit('navstatus','agoods'); 
	$scope.title = '拍卖商品';
	$scope.mod = 'Agoods';
	$scope.searchValues = {'store_id':$scope.store_id};
	if($scope.storeDetail.status == 'wait' || $scope.storeDetail.status == 'fail' || $scope.storeDetail.status == 'init'){
		$scope.actions = [
			'<a type="submit" class="btn green" href="'+_u('member/store/detail/'+$stateParams.store_id+'/agoods_detail/0')+'">添加商品</a>'
		];
	}
	$scope.funcs = {
		//删除专场
		delAgood : function(id){
			$req.g('Agoods','delItem',{id:id},function(responce){
				$scope.noticAction = 'refresh';
			});
		}
	}
	$scope.columns = [ 
		{
			title:'首图',
			html:'<img  src="{{thumb}}" width="60px" />'
		},
		{
			title:'拍品名称',
			html:'{{name}}',
			search:{
				type:'text',
				field:'name'
			}
			 
		},
		{
			title:'价格',
			html:'起拍价：￥{{price_start}}<br/>当前价：￥{{price_current}}<br/>保留价：￥{{price_ensure}}'
		},
		{
			title:'拍卖状态',
			html:'围观：{{count_watch}}<br/>设置提醒：{{count_remind}}<br/>竞价次数：{{count_bid}}'
		},
		{
			title:'类别',
			html:'{{type_id|staticValue:"AgoodType"}}'
		}, 
		{
			 
			title:'编辑',
			html:'<a href="'+_u('agoods/detail/store_id='+$scope.store_id+'/id={{id}}')+'"  class="btn btn-xs green"><i class="fa fa-search"></i> 编辑</a><br/><br/><a href="javascript:;"  click="delAgood({{id}})" class="btn btn-xs red"><i class="glyphicon glyphicon-ban-circle"></i> 删除</a>',
			search:'operation'
		},
	]
});
app.controller('store_conf_detail',function($scope,$req,$staticData,$stateParams){
	var id = $stateParams.id;
	$scope.mod = 'StoreConf';
	$scope.formData = {'name':''};
	if(id > 0){
		$req.g($scope.mod,'getOne',{'id':id}).success(function(responce){
			$scope.formData = responce['result'];

		});
	} 
	$scope.subForm = function(){ 
		$req.FH($scope.mod,'rsave',$scope.formData);
	}
});

app.controller('pay.conf_detail',function($scope,$req,$staticData,$stateParams){
	$scope.mod = 'PayApi'; 
	$scope.formData = {};
	if($stateParams.id > 0){
		$req.g($scope.mod,'getOne',{'id':$stateParams.id }).success(function(responce){
			$scope.formData = responce['result'];   
		});
	}

	$scope.groupData = $staticData.getKV('pay_group');
	$scope.statusData = {'on':'正常','off':'关闭'};
	$scope.subForm = function(){  
		$req.FH($scope.mod,'rsave',$scope.formData);
	}
});
app.controller('agoods.param.detail',function($scope,$req,$staticData,$stateParams){
	$scope.mod = 'AgoodParam'; 
	$scope.formData = {};
	$scope.pidData = {};
	$scope._pidData = $staticData.getData('AgoodParam'); 
	for(var i in $scope._pidData){
		var v = $scope._pidData[i]; 
		if(v.pid == 0){
			$scope.pidData[v['id']] = v.name;
		}
	}

	$scope.pidData[0] = '顶级'; 
	//获取顶级

	if($stateParams.id > 0){
		$req.g($scope.mod,'getOne',{'id':$stateParams.id }).success(function(responce){
			$scope.formData = responce['result'];
			if($scope.formData['pid'] == 0 ) $scope.pidData = {0:'顶级'};
		});
	} 
	$scope.subForm = function(){  
		$req.FH($scope.mod,'rsave',$scope.formData);
	}
}); 
app.controller('agoods.type.list',function($scope,$req,$staticData,$stateParams,$sData,$filter){
	$scope.mod = 'AgoodType';
	$scope.test = '123';
	$scope.formAction = '1';
    $scope.formTitle = '';
    $scope.formData = {};
    $scope.addparamid = '';
    $scope.params = $sData.getData('AgoodParam');

    $scope.paramsTree = parseTreeJson($scope.params); 
    $scope.paramsForm = {};
    $scope.refresh = 0;
    $scope.pid = '0';
    for(var i in $scope.paramsTree){
    	var v = {};
    	for(var ii in $scope.paramsTree[i]['children']){
    		v[$scope.paramsTree[i]['children'][ii]['id']] = $scope.paramsTree[i]['children'][ii]['name'];
    	}
    	$scope.paramsTree[i]['children'] = v;
    } 
    $scope.sdata = $sData.getData('AgoodType');
    $scope.formParams = {};
    //添加修改
    $scope.subForm = function(){ 
    	$scope.formData['pid'] = $scope.pid; 
    	$req.g($scope.mod,'rsave',$scope.formData,function(responce){
    		$scope.sdata = $sData.getData($scope.mod,1);
    		$scope.data = parseTree($scope.sdata);  
    		//$scope.tree.jstree("refresh");
    		$scope.sdata = $sData.getData('AgoodType',1);
    		$scope.refresh = 1; 

    		$scope.formData = {'name':''};
    		$("#addBox1").modal('hide'); 

    	});
    }
    $scope.$watch('paramsForm',function(v){

    },true);
    $scope.addParam = function(){
    	if($scope.addparamid){
    		$scope.formParams = $scope.formParams ? $scope.formParams : {}; 
            $scope.formParams[$scope.addparamid] = 'all'; 
    	}
    }
    $scope.paramid = 0;
    $scope.subFormParams = function(){
    	var formParams = $filter('json')($scope.formParams); 
    	$req.g('AgoodType','saveParams',{'id':$scope.paramid,'param':formParams},function(responce){
    		$scope.sdata = $sData.getData('AgoodType',1);
    	});
    }
    $scope.delParam = function(k){
    	delete $scope.formParams[k];
    }
	$scope.menus = function(tree){
		var result = {};
		var level = tree.parents.length;
		if(level == 1 || level == 2){
			result['createson'] = { 
					label:"添加商品类别",
					action:function(data,c){
						$scope.formTitle = '添加商品类别';
						var inst = jQuery.jstree.reference(data.reference),  
                        obj = inst.get_node(data.reference);
                        $scope.$safeApply(function(){

                        	$scope.formAction = 'detail';
                        	$scope.pid = $scope.formData['pid'] = obj.id;
                        	$scope.formData = {};
                        	if(obj['text'] == $scope.toptext) $scope.formData['pid'] = 0; 
                        	$scope.levelData = {};
                        	for(var i in $scope.sdata){
                        		if($scope.sdata[i]['level'] == 0){
                        			$scope.levelData[i] = $scope.sdata[i]['name'];
                        		}
                        	}
                        	$scope.formData['pid'] = 0;
                        	$scope.levelData[0] = '顶级';
                        });
                        $("#addBox1").modal();
					} 
			}	
		}
		if(level == 2 || level == 3){
			result['delson'] = {
				label:"删除",
				action:function(data,c){
					if(!confirm('是否确定删除?')) return;
					var inst = jQuery.jstree.reference(data.reference),  
                    obj = inst.get_node(data.reference);
                    $scope.$safeApply(function(){
                    	$req.g($scope.mod,'operAction',{'ids':obj.id,operAction:'delete'},function(responce){
                    		$scope.sdata = $sData.getData('AgoodType',1); 
                    		$scope.refresh = 1;
                    	});
                    });
				}
			}
		}
		if(level == 3){
			result['editparam'] = {
				label:"编辑参数",
				action:function(data,c){
					var inst = jQuery.jstree.reference(data.reference),  
                    obj = inst.get_node(data.reference); 
                    var item = $scope.sdata[obj.id];
                    var param = jsonParse(item.param); 
                    $scope.$safeApply(function(){
                    	$scope.formParams = param;
                    	$scope.paramid = obj.id;
                    }); 
                    $("#editParam").modal();
				}
			}
		}
		return result;
		return {
			"新建":{
				label:"新建", 
				action:function(data,c){
					$scope.formTitle = '新建子分类';
					var inst = jQuery.jstree.reference(data.reference),  
					obj = inst.get_node(data.reference);
					$scope.safeApply(function(){
						$scope.formAction = 'detail';
						$scope.formData['pid'] = obj.id; 
						if(obj['text'] == $scope.toptext) $scope.formData['pid'] = 0; 
						$scope.levelData = {};
						for(var i in $scope.sdata){
							if($scope.sdata[i]['level'] == 0){
								$scope.levelData[i] = $scope.sdata[i]['name'];
							}
						}
						$scope.levelData[0] = '顶级';
					});
					//dialog.show({"title":"新建“"+obj.text+"”的子菜单",url:"/accountmanage/createMenu?id="+obj.id,height:280,width:400});  
				}  
			}
		}
	}
});
app.controller('agoods.param.list',function($scope,$req,$staticData,$stateParams,$sData,$filter){
	$scope.mod = 'AgoodParam';
	$scope.test = '123';
	$scope.formAction = '1';
    $scope.formTitle = '';
    $scope.formData = {};
    $scope.addparamid = '';
    $scope.params = $sData.getData('AgoodParam');
    $scope.paramsTree = parseTreeJson($scope.params);
    $scope.paramsForm = {};
    $scope.refresh = 0;
    $scope.pid = '0';
    for(var i in $scope.paramsTree){
    	var v = {};
    	for(var ii in $scope.paramsTree[i]['children']){
    		v[$scope.paramsTree[i]['children'][ii]['id']] = $scope.paramsTree[i]['children'][ii]['name'];
    	}
    	$scope.paramsTree[i]['children'] = v;
    } 
    $scope.sdata = $sData.getData('AgoodParam'); 
    $scope.formParams = {};
    //添加修改
    $scope.subForm = function(){ 
    	$scope.formData['pid'] = $scope.pid; 
    	$req.g($scope.mod,'rsave',$scope.formData,function(responce){
    		$scope.sdata = $sData.getData($scope.mod,1);
    		$scope.data = parseTree($scope.sdata);  
    		//$scope.tree.jstree("refresh");
    		$scope.sdata = $sData.getData('AgoodParam',1);
    		$scope.refresh = 1; 
    		$scope.formData = {}; 
    		$("#addBox1").modal('hide'); 
    	});
    }
    $scope.$watch('paramsForm',function(v){

    },true);
    $scope.addParam = function(){
    	if($scope.addparamid){
    		$scope.formParams = $scope.formParams ? $scope.formParams : {}; 
            $scope.formParams[$scope.addparamid] = 'all'; 
    	}
    }
    $scope.paramid = 0;
    $scope.subFormParams = function(){
    	var formParams = $filter('json')($scope.formParams); 
    	$req.g('AgoodParam','saveParams',{'id':$scope.paramid,'param':formParams},function(responce){
    		$scope.sdata = $sData.getData('AgoodParam',1);
    	});
    }
    $scope.delParam = function(k){
    	delete $scope.formParams[k];
    }
	$scope.menus = function(tree){
		var result = {};
		var level = tree.parents.length;
		if(level == 1 || level == 2){
			result['createson'] = { 
					label:"添加子类别",
					action:function(data,c){
						$scope.formTitle = '添加商品类别';
						var inst = jQuery.jstree.reference(data.reference),  
                        obj = inst.get_node(data.reference);
                        $scope.$safeApply(function(){
                        	$scope.formData = {};
                        	$scope.formAction = 'detail';
                        	$scope.pid = $scope.formData['pid'] = obj.id;
                        	
                        	if(obj['text'] == $scope.toptext) $scope.formData['pid'] = 0; 
                        	$scope.levelData = {};
                        	for(var i in $scope.sdata){
                        		if($scope.sdata[i]['pid'] == 0){
                        			$scope.levelData[i] = $scope.sdata[i]['name'];
                        		}
                        	}
                        	$scope.formData['pid'] = 0;
                        	$scope.pid = $scope.pid ? $scope.pid : 0;
                        	$scope.levelData[0] = '顶级';
                        	if(level == 1) $scope.pid = 0;
                        	$scope.formData['name'] = $scope.formData['intro'] = '';  
                        });
                        $("#addBox1").modal();
					} 
			}
		}
		if(level == 2 || level == 3){
			result['edit'] = {
				label:"编辑",
				action:function(data,c){
					$scope.formTitle = '编辑商品类别';
						var inst = jQuery.jstree.reference(data.reference),  
                        obj = inst.get_node(data.reference);
                        $scope.$safeApply(function(){
                        	$scope.formData = $sData.getData('AgoodParam')[obj.id]; 
                        	$scope.formAction = 'detail';
                        	$scope.pid = $scope.formData['pid'];  
                        	if(obj['text'] == $scope.toptext) $scope.formData['pid'] = 0; 
                        	$scope.levelData = {};
                        	for(var i in $scope.sdata){
                        		if($scope.sdata[i]['pid'] == 0){
                        			$scope.levelData[i] = $scope.sdata[i]['name'];
                        		}
                        	}
                        	$scope.formData['pid'] = 0;
                        	$scope.levelData[0] = '顶级';
                        });
                        $("#addBox1").modal();
				}
			};
			result['delson'] = {
				label:"删除",
				action:function(data,c){
					if(!confirm('是否确定删除?')) return;
					var inst = jQuery.jstree.reference(data.reference),  
                    obj = inst.get_node(data.reference);
                    $scope.$safeApply(function(){
                    	$req.g($scope.mod,'operAction',{'ids':obj.id,operAction:'delete'},function(responce){
                    		$scope.sdata = $sData.getData('AgoodParam',1); 
                    		$scope.refresh = 1;
                    	});
                    });
				}
			};

		}
		 
		return result;
 
	}
});

app.controller('auction.organ',function($scope,$req,$staticData,$stateParams){
	$scope.mod = 'OrganApply';
	$scope.innerjoin=[{'mod':'Users','field':'nickname'}];
	//$scope.postSearch = '';
	$scope.zhongleiData = {'*':'种类','geren':'个人','jigou':'机构'};
	$scope.statusData = {'wait':'待审核','waitpay':'待交保证金','fail':'审核未通过'};
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'用户',
			html:'{{user_nickname}}',
			search:{
				type:'text',
				field:'name',
				title:'用户昵称',
				mode:'like',
			},
			width:'100px'
		}, 
		{
			title:'保证金',
			html:'{{amount}}',
			search:{
				type:'betweentext',
				field:'price',
				minTitle:'起始保证金',
				maxTitle:'截止保证金', 
			},
		}, 
		{
			title:'类型',
			html:'{{zhonglei=="qiye"?"企业":"个人"}}',
			search:{
				type:'select',
				data:$scope.zhongleiData,
				field:'zhonglei',
				minTitle:'起始时间',
				maxTitle:'截止时间', 
			},
		}, 
		{
			title:'申请时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			search:{
				type:'betweendate',
				field:'name',
				minTitle:'起始时间',
				maxTitle:'截止时间', 
			},
		},
		{
			title:'状态',
			html:'{{status|sDataVal:"check_status":"name"}}',
			search:{
				type:'select',
				field:'status',
				data:$scope.statusData,
			},
		},
		{
			title:'操作',
			width:'60px',
			html:'<a  href="'+_u('auction/organ_detail')+'/id={{id}}" class="btn btn-xs green"><i class="fa fa-search"></i> 审核</a>',
			search:'operation'
		}
	]
});
app.controller('auction.organ_detail',function($scope,$req,$staticData,$stateParams){
	$scope.mod = 'OrganApply';
	$req.g($scope.mod,'getOne',{id:$stateParams.id},function(responce){ 
		$scope.applyData = responce;
		$scope.formData = jsonParse($scope.applyData['infomation']); 
		if($scope.applyData.status == 'wait'){  
			$scope.statusArr = {'waitpay':'通过审核，待支付保证金','fail':'审核不通过'}; 
		}
		$scope.applyData.tostatus = ''; 
	});
	$scope.typeData = {'jigou':'合作机构'};
	$scope.ruzhuType = {'qiye':"企业商家",'geren':'个人'};
	$scope.zhengType = {'fenli':'三证分离','heyi':'三证合一'};
	//初审 
	
	$scope.subForm = function(){
		$scope.applyData.infomation = $scope.formData; 
		$scope.applyData.subInfomation = 1;  
		$req.FH($scope.mod,'rsave',$scope.applyData);

	}
});
app.controller('store_check',function($scope,$req,$staticData,$stateParams,$sData){
	$scope.mod = 'Stores';
	$scope.actions = [ 
		'<a type="button" class="btn green" href="'+_u('auction/store_conf_detail/id=0')+'"> <i class="fa fa-plus"></i> 添加拍卖专场</a>'
	]
	$scope.title = '专场审核';
	$scope.innerjoin=[{'mod':'Users','field':'nickname'}];
	$scope.statusData = $sData.getKV('check_status');
	for(var i in $scope.statusData){
		if(i != 'fail' && i != 'waitpay' && i != 'apply'){
			delete $scope.statusData[i];
		}
	}
	$scope.statusData = {'wait':'待审核','fail':'未通过','waitpay':'等待付款','on':'进行中','complate':'已结束'};
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'用户',
			html:'{{user_nickname}}',
			search:{
				type:'text',
				field:'name',
				title:'用户昵称',
				mode:'like',
			},
			width:'100px'
		},
		{
			title:'专场名称',
			html:'{{name}}',
			search:{
				type:'text',
				field:'name',
				title:'请输入专场名称',
				mode:'like',
			},
		},
		{
			title:'拍品数量',
			html:'{{count_agood}}',
			search:{
				type:'betweentext',
				field:'count_agood',
				minTitle:'最小数量',
				maxTitle:'最大数量', 
			},
		},
		{
			title:'保证金',
			html:'{{deposit}}',
			search:{
				type:'betweentext',
				field:'deposit',
				minTitle:'起始金额',
				maxTitle:'截止金额', 
			},
		},
		{
			title:'展览开始时间',
			html:'{{startdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			search:{
				type:'betweendate',
				field:'startdate',
				minTitle:'起始时间',
				maxTitle:'截止时间', 
			},
		},
		{
			title:'拍卖时长',
			html:'{{duration}}小时',
			search:{
				type:'betweendate',
				field:'duration',
				minTitle:'起始时长',
				maxTitle:'截止时长', 
			},
		},
		{
			title:'申请时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			search:{
				type:'betweendate',
				field:'name',
				minTitle:'起始时间',
				maxTitle:'截止时间', 
			},
		},
		{
			title:'状态',
			html:'{{status|sDataVal:"check_status":"name"}}',
			search:{
				type:'select',
				field:'status',
				data:$scope.statusData,
			},
		},
		{
			title:'操作',
			width:'60px',
			html:'<a  href="'+_u('auction/store_detail')+'/{{id}}/info" class="btn btn-xs green"><i class="fa fa-search"></i> 审核</a>',
			search:'operation'
		}
	]
});
app.controller('pay_conf_list',function($scope){
	$scope.mod = 'PayApi'; 
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'LOGO',
			html:'{{name}}'
		},
		{
			title:'接口名称',
			html:'{{name}}'
		},
		{
			title:'描述',
			html:'{{intro}}'
		},
		{
			title:'状态',
			html:'{{status|staticValue:"status"}}'
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="'+_u('pay/conf_detail')+'/id={{id}}" class="btn btn-xs green"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	]
})
app.controller('store_conf_list',function($scope,$req,$staticData){
	$scope.mod = 'StoreConf';

	$scope.actions = [ 
		{
			html:'<a type="button" class="btn green" href="'+_u('auction/store_conf_detail/id=0')+'"> <i class="fa fa-plus"></i> 添加拍卖专场</a>'
		}
	]
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'专场名称',
			html:'{{name}}'
		},
		{
			title:'价格',
			html:'{{price}}'
		},
		{
			title:'拍品数量',
			html:'{{maxnum}}'
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="'+_u('auction/store_conf_detail')+'/id={{id}}" class="btn btn-xs green"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	]

});
app.controller('users.detail',function($scope,$req,$staticData,$sData,$stateParams){
	$scope.user_id = $stateParams.id;
	$scope.formData = {};
	$req.g('Users','getOne',{id:$scope.user_id},function(responce){
		$scope.formData = responce;
	});
	$scope.subForm = function(){
		$req.FH('Users','rsave',$scope.formData);
	}
});

app.controller('users.list',function($scope,$req,$staticData,$sData){

	$scope.mod = 'Users';
	$scope.oper = {'delete':'删除'};
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'昵称',
			html:'{{nickname}}',
			search:{
				type:'text',
				mode:'like',
				field:'user_nickname',
				title:'请输入昵称'
			}
		},
		{
			title:'手机号码',
			html:'{{phone}}',
			search:{
				type:'text',
				mode:'like',
				field:'phone',
				title:'请输入手机号码'
			}
		},
		{
			title:'注册时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 hh:mm:ss"}}',
			search:{
				type:'betweendate',
				field:'phone', 
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/users/detail/id={{id}}" class="btn btn-xs green"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
app.controller('check_withdraw',function($scope,$req,$staticData,$sData){
	$scope.mod = 'UserWithdraw'; 
	$scope.noticAction = '';
	$scope.checkForm = {};
	$scope.checkData = $staticData.getKV('check_status');
	$scope.defaultSearch = {'status':'wait'};
	for(var i in $scope.checkData){
		if(i != 'fail' && i != 'success' && i != 'wait'){
			delete $scope.checkData[i];
		}
	}
	$scope.funcs ={
		check : function(id){
			$req.g('UserWithdraw','getOne',{'id':id}).success(function(responce){
				$scope.checkForm = responce['result'];

				$("#checkModal").modal();
			}); 
		}
	};
	$scope.subCheckForm = function(){
		$scope.checkForm.tostatus = $scope.checkForm.status;
		$req.g('UserWithdraw','rsave',$scope.checkForm).success(function(responce){
			$scope.checkForm = responce['result'];
			$scope.noticAction = 'refresh';
			$("#checkModal").find('#close').trigger('click');
		});
	} 
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'用户',
			html:'{{user_nickname}}',
			search:{
				type:'text',
				mode:'like',
				field:'user_nickname',
				title:'请输入用户名'
			}
		},
		{
			title:'申请时间', 
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			search:{
				type:'betweendate', 
				field:'cdate',
				minTitle:'开始时间',
				maxTitle:'结束时间',
			}
		},
		{
			title:'提现金额',
			html:'{{amount}}',
			search:{
				type:'betweentext', 
				field:'amount',
				minTitle:'最大金额',
				maxTitle:'最小金额',
			}
		}, 
		{
			title:'收款银行',
			html:'{{bankname}}',
			search:{
				type:'text',
				mode:'like',
				field:'user_nickname', 
			}
		},
		{
			title:'银行卡号',
			html:'{{number}}',
			search:{
				type:'text',
				mode:'like',
				field:'number', 
			}
		},
		{
			title:'开户行',
			html:'{{address}}',
			search:{
				type:'text',
				mode:'like',
				field:'address', 
			}
		}, 
		{
			title:'通过时间',
			html:'{{status=="success"?(sdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"):"<b style=\'color:red\'>未通过"+(status_msg?":"+status_msg:"")+"</b>"}}',
			search:{
				type:'betweendate', 
				field:'successdate',
				minTitle:'开始时间',
				maxTitle:'结束时间',

			}
		},
		{
			title:'状态',
			html:'{{status|sDataVal:"check_status":"name"}}',
			search:{
				type:'select',
				field:'status',
				data:$scope.checkData,
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="javascript:;" click="check({{id}})" class="btn btn-xs green"><i class="fa fa-search"></i> 审核</a>',
			search:'operation'
		}
	];
})
app.controller('users_check_truename',function($scope,$req,$staticData,$sData){
	$scope.mod = 'UserInfo';
	$scope.noticAction = '';
	$scope.checkForm = {};
	$scope.checkData = $staticData.getKV('check_status');
	$scope.defaultSearch = {'status':'wait'};
	for(var i in $scope.checkData){
		if(i != 'fail' && i != 'success' && i != 'wait'){
			delete $scope.checkData[i];
		}
	}
	$scope.funcs ={
		check : function(id){
			$req.g('UserInfo','getOne',{'id':id}).success(function(responce){
				$scope.checkForm = responce['result'];
				$("#checkModal").modal();
			}); 
		}
	};
	$scope.subCheckForm = function(){
		$req.g('UserInfo','rsave',$scope.checkForm).success(function(responce){
			$scope.checkForm = responce['result'];
			$scope.noticAction = 'refresh';
			$("#checkModal").find('#close').trigger('click');
		});
	} 
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'用户',
			html:'{{user_nickname}}',
			search:{
				type:'text',
				mode:'like',
				field:'user_nickname',
				title:'请输入用户名'
			}
		},
		{
			title:'真实姓名',
			html:'{{truename}}',
			search:{
				type:'text',
				mode:'like',
				field:'truename',
				title:'请输入真实姓名'
			}
		},
		{
			title:'身份证',
			html:'{{idcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'truename',
				title:'请输入身份证号'
			}
		},
		{
			title:'身份证正面照',
			html:'<div style="text-align:center;"><a href="{{idcard_thumb2}}"  target="_blank"><img src="{{idcard_thumb1}}" height="50px;"/></a></div>'
		}
		,
		{
			title:'身份证反面照',
			html:'<div style="text-align:center;"><a href="{{idcard_thumb2}}"  target="_blank"><img src="{{idcard_thumb2}}" height="50px;"/></a></div>'
		}
		,
		{
			title:'申请时间', 
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			search:{
				type:'betweendate', 
				field:'cdate',
				minTitle:'开始时间',
				maxTitle:'结束时间',

			}
		}
		,
		{
			title:'通过时间',
			html:'{{status=="success"?(successdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"):"<b style=\'color:red\'>未通过"+(failmsg?":"+failmsg:"")+"</b>"}}',
			search:{
				type:'betweendate', 
				field:'successdate',
				minTitle:'开始时间',
				maxTitle:'结束时间',

			}
		},
		{
			title:'状态',
			html:'{{status|sDataVal:"check_status":"name"}}',
			search:{
				type:'select',
				field:'status',
				data:$scope.checkData,
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="javascript:;" click="check({{id}})" class="btn btn-xs green"><i class="fa fa-search"></i> 审核</a>',
			search:'operation'
		}
	];
})
app.controller('bill.pledge',function($scope,$sData){
	$scope.mod = 'UserAccountLog';
	$scope.innerjoin = [{'mod':'users','field':'nickname'}]; 
	$scope.postSearch = [{'field':'type','type':'in','val':'adopt_pay,payensure_pay'}];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'用户',
			html:'{{user_nickname}}',
			 
		},
		{
			title:'类型',
			html:'{{type|sDataVal:"account_log":"name"}}'
		},
		{
			title:'金额',
			html:'{{money}}'
		},
		{
			title:'说明',
			html:'{{intro}}'
		},
		{
			title:'时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 hh:mm:ss"}}'
		}, 
		 
	];
})
app.controller('bill.account',function($scope,$sData){
	$scope.mod = 'UserAccountLog';
	$scope.innerjoin = [{'mod':'users','field':'nickname'}];  
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'用户',
			html:'{{user_nickname}}',
			 
		},
		{
			title:'操作金额',
			html:'{{money}}'
		},
		{
			title:'冻结金额',
			html:'{{freeze}}'
		},
		{
			title:'剩余金额',
			html:'{{user_money}}'
		},
		{
			title:'剩余冻结',
			html:'{{user_freeze}}'
		},
		{
			title:'类型',
			html:'{{type|sDataVal:"account_log":"name"}}'
		},
		{
			title:'金额',
			html:'{{money}}'
		},
		{
			title:'说明',
			html:'{{intro}}'
		},
		{
			title:'时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 hh:mm:ss"}}'
		}, 
		 
	];
})
app.controller('users.info',function($scope,$req,$staticData,$sData){ 
	$scope.mod = 'UserInfo';
	$scope.noticAction = ''; 
	$scope.checkForm = {};
	$scope.postparams = {};
	$scope.searchPost = [{'field':'status','val':'success','type':'equal'}];  
	$scope.checkData = $staticData.getKV('check_status'); 
	for(var i in $scope.checkData){
		if(i != 'fail' && i != 'success' && i != 'wait'){
			delete $scope.checkData[i];
		}
	}
	 
	$scope.columns = [
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'用户',
			html:'{{user_nickname}}',
			search:{
				type:'text',
				mode:'like',
				field:'user_nickname',
				title:'请输入用户名'
			}
		},
		{
			title:'真实姓名',
			html:'{{truename}}',
			search:{
				type:'text',
				mode:'like',
				field:'truename',
				title:'请输入真实姓名'
			}
		},
		{
			title:'身份证',
			html:'{{idcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'truename',
				title:'请输入身份证号'
			}
		},
		{
			title:'身份证正面照',
			html:'<div style="text-align:center;"><a href="{{idcard_thumb2}}"  target="_blank"><img src="{{idcard_thumb1}}" height="50px;"/></a></div>'
		}
		,
		{
			title:'身份证反面照',
			html:'<div style="text-align:center;"><a href="{{idcard_thumb2}}"  target="_blank"><img src="{{idcard_thumb2}}" height="50px;"/></a></div>'
		}
		,
		{
			title:'申请时间', 
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			search:{
				type:'betweendate', 
				field:'cdate',
				minTitle:'开始时间',
				maxTitle:'结束时间',

			}
		}
		,
		{
			title:'通过时间',
			html:'{{status=="success"?(successdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"):"<b style=\'color:red\'>未通过"+(failmsg?":"+failmsg:"")+"</b>"}}',
			search:{
				type:'betweendate', 
				field:'successdate',
				minTitle:'开始时间',
				maxTitle:'结束时间',

			}
		},
		{
			title:'状态',
			html:'{{status|sDataVal:"check_status":"name"}}',
			search:{
				type:'select',
				field:'status',
				data:$scope.checkData,
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="javascript:;" click="check({{id}})" class="btn btn-xs green"><i class="fa fa-search"></i> 审核</a>',
			search:'operation'
		}
	];
})


app.controller('header',function($scope){  
});
app.controller('store.list.on',function($scope){
	$scope.mod = 'Stores';
	$scope.postSearch = [{'field':'status','val':'on','type':'in'}];
	$scope.innerjoin = [{'mod':'Users','field':'nickname'}];
	$scope.columns = [
		{
			title:'用户名',
			html:'{{user_nickname}}',
			search:{
				type:'text',
				field:'user_nickname',
				mode:'like',
				title:'请输入用户名'
			}
		},
		{
			title:'专场',
			html:'{{name}}',
			search:{
				type:'text',
				field:'name',
				mode:'like',
				title:'请输入专场名称'
			}
		}, 
		{
			title:'拍品数量',
			html:'{{count_agood}} ',
			search:{
				type:'betweentext',
				field:'name', 
				title:'数量',
			}
		},   
		{
			title:'开展时间',
			html:'{{startdate*1000|date:"yyyy年MM月dd日 HH:mm"}}',
			search:{
				type:'betweendate',
				field:'startdate',  
			}
		},
		{
			title:'结束时间',
			html:'{{enddate*1000|date:"yyyy年MM月dd日 HH:mm"}}',
			search:{
				type:'betweendate',
				field:'enddate',  
			}
		},
		{
			title:'类别',
			html:'{{agood_type_ids|sDataVal:"AgoodType":"name"}}'
		},
		{
			title:'操作',
			width:'60px',
			search:'operation',
			html:'<div ><a href="'+_u('auction/store_detail')+'/{{id}}/info" class="btn btn-xs green  ">专场信息</a>   <a href="'+_u('auction/store_detail')+'/{{id}}/agoods" class="btn btn-xs yellow  ">查看拍品</a> </div>', 
		}
	]
});
app.controller('store.list.preview',function($scope){ 
	$scope.mod = 'Stores'; 
	$scope.postSearch = [{'type':'equal','field':'status','val':'preview'}];
	$scope.innerjoin = [{'mod':'Users','field':'nickname'}];
	$scope.columns = [
		{
			title:'用户名',
			html:'{{user_nickname}}',
			search:{
				type:'text',
				field:'user_nickname',
				mode:'like',
				title:'请输入用户名'
			}
		},
		{
			title:'专场',
			html:'{{name}}',
			search:{
				type:'text',
				field:'name',
				mode:'like',
				title:'请输入专场名称'
			}
		}, 
		{
			title:'拍品数量',
			html:'{{count_agood}} ',
			search:{
				type:'betweentext',
				field:'name', 
				title:'数量',
			}
		},   
		{
			title:'开展时间',
			html:'{{startdate*1000|date:"yyyy年MM月dd日 hh:mm:ss"}}',
			search:{
				type:'betweendate',
				field:'name',  
			}
		},
		{
			title:'类别',
			html:'{{agood_type_ids|sDataVal:"AgoodType":"name"}}'
		},
		{
			title:'操作',
			width:'60px',
			search:'operation',
			html:'<div ><a href="'+_u('auction/store_detail')+'/{{id}}/info" class="btn btn-xs green  ">专场信息</a>   <a href="'+_u('auction/store_detail')+'/{{id}}/agoods" class="btn btn-xs yellow  ">查看拍品</a> </div>', 
		}
	]
});
app.controller('store.detail',function($scope,$stateParams,$timeout,$req,$state){ 
	$scope.tabstatus = '';
	$stateParams.store_id = $stateParams.id;
	$scope.storeDetail = {'test':'test'};
	$scope.tabstatus = '';
	$req.t('Stores','getOne',{id:$stateParams.store_id}).success(function(responce){
		$scope.storeDetail = responce.result; 
		$scope.storeDetail.nums = $scope.storeDetail.curnum + " / " + $scope.storeDetail.maxnum;
	});
	$scope.subForm = function(){

		$req.FH('Stores','rsave',$scope.storeDetail);
	}
}); 
app.controller('agoods.list',function($scope,$sData){
	$scope.mod = 'Agoods';  
	$scope.postparams = { 'organ_type':'organ'}; 
	$scope.columns = [
		{
			title:'首图',
			html:'<img src="{{thumb}}" style="max-height:40px"/>',
			width:'60px', 
		},
		{
			title:'名称',
			html:'<a href="/#/agoods/detail/{{id}}" target="_blank">{{name}}</a>',
			search:{
				type:'text',
				field:'name',
				mode:'like',
				title:'请输入名称'
			}
		},
		{
			title:'专场名称',
			html:'{{st_name}}',
			search:{
				type:'select',
				field:'store_id',
				data:$sData.getKV('Stores'),
				title:'请选择'
			}
		}, 
		{
			title:'围观次数',
			html:'{{count_watch}}',
			search:{
				type:'betweentext',
				field:'count_watch', 
				title:'次数',
			}
		},
		{
			title:'报价次数',
			html:'{{count_bid}}',
			search:{
				type:'betweentext',
				field:'count_bid', 
				title:'次数',
			}
		},
		{
			title:'提醒人数',
			html:'{{count_remind}}',
			search:{
				type:'betweentext',
				field:'count_remind', 
				title:'人数',
			}
		},
		{
			title:'状态',
			html:'{{status|sDataVal:"check_status":"name"}}',
			search:{
				type:'select',
				field:'status',
				data:$sData.getKV('check_status'),
				title:'请选择'
			}
		},
		{
			title:'开始时间',
			html:'{{startdate*1000|date:"yyyy年MM月dd日 hh:mm:ss"}}',
			search:{
				type:'betweendate',
				field:'name',  
			}
		},
		{
			title:'结束时间',
			html:'{{startdate*1000|date:"yyyy年MM月dd日 hh:mm:ss"}}',
			search:{
				type:'betweendate',
				field:'name',  
			}
		},
		{
			title:'操作',
			width:'60px',
			search:'operation',
			html:'<div > <a href="'+_u('agoods_tl/detail')+'/id={{id}}/store_id={{store_id}}" class="btn btn-xs green  ">详细信息</a> </div>', 
		}
	]
});
app.controller('conf.messages',function($scope,$state,$stateParams,$req,$staticData,$filter,$window,$filter){
	$scope.formData = {};
	$req.g('MsgTpl','selectGroupID',{},function(responce){
		$scope.formData = responce;
	});
});
app.controller('agoods.detail',function($scope,$state,$stateParams,$req,$staticData,$filter,$window,$filter){
	$stateParams.agood_id = $stateParams.id;
	$scope.agood_id = $stateParams.id;
	$scope.txtMode = '商品管理';
	$scope.mod = 'Agoods';
	$scope.panelTitle = '商品编辑';
	$scope.typeData0 = $scope.typeData1 = {};
	$scope.type_id = $scope.type_id_0 = 0;
	$scope.paramListData = [];
	$scope.formData = {};
	//商品参数
	$scope.AgoodParamData = $staticData.getData('AgoodParam');
	var typeData = $staticData.getData('AgoodType');
	$scope.init = function(){
		$scope.typeData0[0] = '请选择商品类别';
		for(var i in typeData){
			var v = typeData[i];
			if(v.pid == 0){
				$scope.typeData0[v.id] = v.name;
			}
		}

		//取得商品信息
		if($scope.agood_id){
			$req.g($scope.mod,'getOne',{id:$scope.agood_id},function(responce){
				$scope.formData = responce;

			});
		}
		
	}
	//二级商品类别
	$scope.$watch('formData.type_id_0',function(newValue){
		if(newValue){
			$scope.typeData1 = {};
			$scope.typeData1[0] = '请选择二级类别';
			for(var i in typeData){
				var v = typeData[i];
				if(v.pid == newValue){ 
					$scope.typeData1[v.id] = v.name;
				}
			} 
		}
	});
	//监听TypeId，改变商品参数
	$scope.param_ids = {};
	$scope.$watch('formData.type_id',function(newValue){ 
		if(newValue){ 
			$req.g('AgoodType','getParam',{'id':newValue}).success(function(responce){ 
				var result = responce.result;
				$scope.paramListData = [];
				for(var i in result){ 
					var v = {};
					v['val'] = result[i].split(',');
					v['title'] = $filter('staticValue')(i,'AgoodParam');
					v['data'] = {};
					v['id'] = i;
					for(var ii in $scope.AgoodParamData){
						var vv = $scope.AgoodParamData[ii];
						if(v['val']['0'] == 'all'){ 
							if(vv.pid == i){ 
								v['data'][vv.id] = vv.name;
							}
						}else{

							if(in_array(vv['id'],v['val'])){
								v['data'][vv.id] = vv.name;
							}
						}
					}   
					$scope.paramListData.push(v);
				}
			}); 
		}
	})
 
	$scope.newAgood = function(){
		

		$scope.formData.param = $scope.param_ids;
		//填充参数
		$("[params]").find('select').each(function(){
			 
		});

		$req.FH($scope.mod,'rsavePerson',$scope.formData,function(responce){
			 layer.open({
				content:'操作完成',
				offset:otop,
				icon:1,
				btn:['返回' ],
				yes:function(){
					window.history.back();
					layer.closeAll();
				},
				btn2:function(){
			 
					$window.location.href = (_u('member/store/detail/'+$scope.storeDetail.id+'/agoods_detail/0'));
					layer.closeAll();
				}
			});
		});
	}
	$scope.init(); 

	//审核
	$scope.toStatusArr = {'fail':'审核不通过','waitpay':'审核通过','wait':'待审核'};
	//专场

	$scope.storeData = {};
	$scope.storePrices = {};
	$req.g('StoresTl','getList',{'order':'startdate desc'},function(responce){
		$scope.storeData[0] = '请选择专场';
		for(var i in responce){
			var v = responce[i];
			$scope.storePrices[v.id] = v.disposit;
			$scope.storeData[v.id] = $filter("date")(v.startdate*1000,"yyyy年MM月dd日 HH:mm") + " - " +v.name;
		}
		//选择专场后变化保证金
		$scope.$watch('formData.store_id',function(newValue){
		 
			var disposit = $scope.storePrices[newValue] ? $scope.storePrices[newValue] : 0; 
			$scope.formData.disposit = disposit ? disposit : 0;
			 

		});
		 
	});
	
	$scope.subForm = function(){
		$scope.formData.param = $scope.param_ids;

		$req.FH($scope.mod,'rsavePerson',$scope.formData);
		return;
		//未审核
		if($scope.formData.status == 'wait' || $scope.formData.status == 'waitpay' || $scope.formData.status == 'fail'){
			if(!$scope.formData.tostatus) jError('请选择审核状态');
			//审核失败
			if($scope.formData.tostatus == 'fail'){

			}
			//审核成功
			if($scope.formData.tostatus == 'waitpay'){
				 
			}
		}
	}
	//$scope.
})
app.controller('agoods_tl.detail',function($scope,$state,$stateParams,$req,$staticData,$filter,$window,$filter){
	$stateParams.agood_id = $stateParams.id;
	$scope.agood_id = $stateParams.id;
	$scope.txtMode = '商品管理';
	$scope.mod = 'Agoods';
	$scope.panelTitle = '商品编辑';
	$scope.typeData0 = $scope.typeData1 = {};
	$scope.type_id = $scope.type_id_0 = 0;
	$scope.paramListData = [];
	$scope.formData = {};
	//商品参数
	$scope.AgoodParamData = $staticData.getData('AgoodParam');
	var typeData = $staticData.getData('AgoodType');
	$scope.init = function(){
		$scope.typeData0[0] = '请选择商品类别';
		for(var i in typeData){
			var v = typeData[i];
			if(v.pid == 0){
				$scope.typeData0[v.id] = v.name;
			}
		}

		//取得商品信息
		if($scope.agood_id){
			$req.g($scope.mod,'getOne',{id:$scope.agood_id},function(responce){
				$scope.formData = responce;

			});
		}
		
	}
	//二级商品类别
	$scope.$watch('formData.type_id_0',function(newValue){
		if(newValue){
			$scope.typeData1 = {};
			$scope.typeData1[0] = '请选择二级类别';
			for(var i in typeData){
				var v = typeData[i];
				if(v.pid == newValue){ 
					$scope.typeData1[v.id] = v.name;
				}
			} 
		}
	});
	//监听TypeId，改变商品参数
	$scope.param_ids = {};
	$scope.$watch('formData.type_id',function(newValue){ 
		if(newValue){ 
			$req.g('AgoodType','getParam',{'id':newValue}).success(function(responce){ 
				var result = responce.result;
				$scope.paramListData = [];
				for(var i in result){ 
					var v = {};
					v['val'] = result[i].split(',');
					v['title'] = $filter('staticValue')(i,'AgoodParam');
					v['data'] = {};
					v['id'] = i;
					for(var ii in $scope.AgoodParamData){
						var vv = $scope.AgoodParamData[ii];
						if(v['val']['0'] == 'all'){ 
							if(vv.pid == i){ 
								v['data'][vv.id] = vv.name;
							}
						}else{

							if(in_array(vv['id'],v['val'])){
								v['data'][vv.id] = vv.name;
							}
						}
					}   
					$scope.paramListData.push(v);
				}
			}); 
		}
	})
 
	$scope.newAgood = function(){
		

		$scope.formData.param = $scope.param_ids;
		//填充参数
		$("[params]").find('select').each(function(){
			 
		});

		$req.FH($scope.mod,'rsavePerson',$scope.formData,function(responce){
			 layer.open({
				content:'操作完成',
				offset:otop,
				icon:1,
				btn:['返回' ],
				yes:function(){
					window.history.back();
					layer.closeAll();
				},
				btn2:function(){
			 
					$window.location.href = (_u('member/store/detail/'+$scope.storeDetail.id+'/agoods_detail/0'));
					layer.closeAll();
				}
			});
		});
	}
	$scope.init(); 

	//审核
	$scope.toStatusArr = {'fail':'审核不通过','waitpay':'审核通过','wait':'待审核'};
	//专场

	$scope.storeData = {};
	$scope.storePrices = {};
	$scope.storeCommission = {};
	$req.g('StoresTl','getList',{'order':'startdate desc','enddate':'noafter'},function(responce){
		 
		$scope.storeData[0] = '请选择专场';
		for(var i in responce){
			var v = responce[i];
			$scope.storePrices[v.id] = v.disposit;
			$scope.storeCommission[v.id] = v.commission;
			$scope.storeData[v.id] = $filter("date")(v.startdate*1000,"yyyy年MM月dd日 HH:mm") + " - " +v.name;
		}
		//选择专场后变化保证金
		$scope.$watch('formData.store_id',function(newValue){
		 
			var disposit = $scope.storePrices[newValue] ? $scope.storePrices[newValue] : 0; 
			var commission = $scope.storeCommission[newValue] ? $scope.storeCommission[newValue] : 0; 
			$scope.formData.disposit = disposit ? disposit : 0;
			$scope.formData.commission = commission ? commission : 0;

		});
		 
	});
	
	$scope.subForm = function(){
		$scope.formData.param = $scope.param_ids;

		$req.FH($scope.mod,'rsavePerson',$scope.formData);
		return;
		//未审核
		if($scope.formData.status == 'wait' || $scope.formData.status == 'waitpay' || $scope.formData.status == 'fail'){
			if(!$scope.formData.tostatus) jError('请选择审核状态');
			//审核失败
			if($scope.formData.tostatus == 'fail'){

			}
			//审核成功
			if($scope.formData.tostatus == 'waitpay'){
				 
			}
		}
	}
	//$scope.
})
 

app.controller('conf.view',function($scope,$req){
	$scope.formData = {};
	$req.g('Conf','gs',{},function(responce){
		$scope.formData = responce;
		 
	});
	$scope.subForm = function(){
		$req.FH('Conf','ss',$scope.formData);
	}
});
app.controller('catalogs.arcs',function($scope,$req,$stateParams){
	$scope.mod = 'Arcs';
	$scope.title = '文档管理';
	$scope.oper = {
		'delete':'删除',
		'copy':'复制'
	}; 
	$scope.postparams = {'catalog_id':$stateParams.id};
	$scope.actions = [
		{
			html : '<a href="#/arcs/detail/catalog_id='+$stateParams.id+'/arc_id=0" class="btn btn-sm green"> 添加文档  <i class="fa fa-plus"></i> </a>',
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
			width:'200px'
		}, 
		{
			title:'发布时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			width:'120px'
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/arcs/detail/catalog_id='+$stateParams.id+'/arc_id={{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
app.controller('catalogs.thumbs',function($scope,$req,$stateParams){
	$scope.mod = 'Arcs';
	$scope.title = '轮播图管理';
	$scope.oper = {
		'delete':'删除',
		'copy':'复制'
	}; 
	$scope.postparams = {'catalog_id':$stateParams.id};
	$scope.actions = [
		{
			html : '<a href="#/arcs/detail/catalog_id='+$stateParams.id+'/arc_id=0" class="btn btn-sm green"> 添加文档  <i class="fa fa-plus"></i> </a>',
		}
	];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'图片',
			html:'<a href=""><img src="{{thumb}}" style="max-height:50px;"></a>',
			width:'200px'
		}, 
		{
			title:'标题',
			html:'{{title}}',
			width:'200px'
		}, 
		{
			title:'发布时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			width:'120px'
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/arcs/detail/catalog_id='+$stateParams.id+'/arc_id={{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
});
app.controller('arcs.detail', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'Arcs';
	$scope.catalog = {};
	$scope.actionurl = 'normal';
	$req.g('Catalogs','getOne',{id:$stateParams.catalog_id}).success(function(responce){
		$scope.catalog = responce.result;
		$scope.actionurl = $scope.catalog.actionurl ? 'thumbs' : 'normal'; 

	});
	$scope.txtMode = $stateParams.arc_id==0?'文档添加':'文档编辑';
	$scope.formData = {}; 
	$req.g('Arcs','getOne',{id:$stateParams.arc_id}).success(function(responce){
		$scope.formData = responce.result ? responce.result : {}; 
	});
	$scope.subForm = function(){
		var params = $scope.formData;
 		$scope.formData['catalog_id'] = $scope.formData['catalog_id'] ? $scope.formData['catalog_id'] : $stateParams.catalog_id; 
		$req.FH($scope.mod,'rsave',params);
	}
});

app.controller('agoods.check_tl', function($scope,$req,$timeout,$stateParams,$sData){
	$scope.mod = 'Agoods';
	$scope.postfunc = 'ajaxTableTl'; 
	//$scope.innerjoin = [{'mod':'StoresTl','field':'name'}];
	$scope.postparams = {'organ_type':'person'};
	$scope.defaultSearch = {'status':'wait'};
	$scope.columns = [
		{
			title:'首图',
			html:'<img src="{{thumb}}" style="max-height:40px"/>',
			width:'60px', 
		},
		{
			title:'名称',
			html:'<a href="/#/agoods/detail/{{id}}" target="_blank">{{name}}</a>',
			search:{
				type:'text',
				field:'name',
				mode:'like',
				title:'请输入名称'
			}
		},
		{
			title:'专场',
			html:'{{st_name?st_name:"无"}}',
			search:{
				type:'select',
				field:'store_id',
				data:$sData.getKV('Stores'),
				title:'请选择'
			}
		}, 
		{
			title:'类别',
			html:'{{type_id_0|sDataVal:"AgoodType":"name"}} - {{type_id_1|sDataVal:"AgoodType":"name"}}',
			 
		},
		{
			title:'起拍价',
			html:'{{price_start|number:2}}',
			search:{
				type:'betweentext',
				field:'price_start',  
			}
		},
		{
			title:'保留价',
			html:'{{price_retain|number:2}}',
			search:{
				type:'betweentext',
				field:'price_retain',  
			}
		},
		{
			title:'加价幅度',
			html:'{{price_range|number:2}}',
			search:{
				type:'betweentext',
				field:'price_range',  
			}
		},
		{
			title:'状态',
			html:'{{status|sDataVal:"check_status":"name"}}',
			search:{
				type:'select',
				field:'status',
				data:$sData.getKV('check_status'),
				title:'请选择'
			}
		},
		 
		{
			title:'操作',
			width:'60px',
			search:'operation',
			html:'<div > <a href="'+_u('agoods_tl/detail')+'/id={{id}}/store_id={{store_id}}" class="btn btn-xs green  ">详细信息</a> </div>', 
		}
	]
});
app.controller('auction_tl.store.list', function($scope,$req,$timeout,$stateParams) {
	$scope.mod = 'StoresTl';
	$scope.title = '专场管理';
	$scope.statusData = {'*':'不限','fail':'无效','success':'有效'};
	$scope.actions = [
		{
			html : '<a href="#/auction_tl/store/detail/id=0" class="btn btn-sm green"> 添加专场  <i class="fa fa-plus"></i> </a>',
		}
	];
	$scope.columns = [
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'名称',
			html:'{{name}}', 
			search:{
				type:'text',
				field:'name'
			}
		}, 
		{
			title:'开始时间',
			html:'{{startdate*1000|date:"yyyy年MM月dd日 HH时mm分"}}', 
			search:{
				type:'betweentext',
				field:'startdate'
			}
		}, 
		{
			title:'结束时间',
			html:'{{enddate*1000|date:"yyyy年MM月dd日 HH时mm分"}}', 
			search:{
				type:'betweentext',
				field:'enddate'
			}
		}, 
		{
			title:'保证金',
			html:'{{disposit|number:2}}', 
			search:{
				type:'betweentext',
				field:'enddate'
			}
		}, 
		{
			title:'状态',
			html:'{{status=="fail"?"<b style=\'color:red\'>无效</b>":""}}{{status=="success"?"<b style=\'color:green\'>有效</b>":""}}',
			search:{
				type:'select',
				data:$scope.statusData,
				field:'status'
			}
		},
		{
			title:'操作',
			width:'60px',
			html:'<a href="#/auction_tl/store/detail/id={{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	]
});
app.controller('auction_tl.store.detail', function($scope,$req,$timeout,$stateParams) {
	$scope.formData = {'status':'success'};
	$scope.statusData = {'fail':'无效','success':'有效'};
	if($stateParams.id){
		$req.g('StoresTl','getOne',{id:$stateParams.id},function(responce){
			$scope.formData = responce;
		});
	}
	$scope.subForm = function(){

		$req.FH('StoresTl','rsave',$scope.formData );
	}

});
app.controller('tasks.list', function($scope,$req,$timeout,$stateParams,$staticData){
	$scope.navid = '62';
	$scope.mod = 'Tasks';
	$scope.listorder = 'id desc';
	$scope.columns = [
		{
			title:'创建时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm"}}', 
		},
		{
			title:'预期执行时间',
			html:'{{edate*1000|date:"yyyy年MM月dd日 HH:mm"}}', 
		},
		{
			title:'实际执行时间',
			html:'{{sdate?(sdate*1000|date:"yyyy年MM月dd日 HH:mm"):"未执行"}}', 
		},
		{
			title:'所属模块',
			html:'{{mod|staticValue:"taskMod"}}',
		},
		{
			title:'执行动作',
			html:'{{act|staticValue:"taskAction"}}',
		},
		{
			title:'数据ID',
			html:'{{mod_id}}',
		}, 
		{
			title:'操作',
			width:'60px',
			search:'operation',
			html:'<div >{{!sdate?"<a href=\'#/tasks/do/id="+id+"\'   class=\'btn btn-xs green\'>立即执行</a>":"已执行"}}</div>', 
		}
	]
});
app.controller('tasks.do', function($scope,$req,$timeout,$stateParams,$staticData,$window) {
	 
	$scope.id = $stateParams.id;
	$req.g('Tasks','doOne',{id:$scope.id},function(responce){
		$window.location.href = "#/tasks/list";
	});
});
app.controller('agoods_tl.list', function($scope,$req,$timeout,$stateParams) { 
	$scope.mod = 'Agoods';
	$scope.postfunc = 'ajaxTableTl'; 
	$scope.postparams = { 'organ_type':'person'}; 
	$scope.$on('beat.refresh.store_tl.list',function(event,data){ 
		$scope.getPersonCounts(); 
		$scope.noticAction = 'refresh'; 
	});
	$scope.columns = [
		{
			title:'首图',
			html:'<img src="{{thumb}}" style="max-height:60px"/>',
			width:'60px', 
		},
		{
			title:'名称',
			html:'<a href="/#/agoods/detail/{{id}}" target="_blank">{{name}}</a>',
			width:'200px'
		},
		{
			title:'专场名称',
			html:'{{st_name?st_name:"无"}}', 
		},
		{
			title:'拍卖时间',
			html:'{{startdate*1000|date:"yyyy年MM月dd日"}}<br/>{{startdate*1000|date:"HH:mm"}}至{{enddate*1000|date:"HH:mm"}}', 
		},
		 
		{
			title:'价格',
			html:'当前价：￥{{price_current|number:2}}<br/>竞拍次数：{{count_bid|number:0}}次<br/>起拍价：￥{{price_start|number:2}}<br/>围观：{{count_watch|number:0}}次',
			width:'200px'
		}, 
		{
			title:'状态',
			html:'{{status|staticValue:"check_status"}}',
		},
		{
			title:'操作',
			width:'60px',
			search:'operation',
			html:'<div > <a href="'+_u('agoods_tl/detail')+'/id={{id}}/store_id={{store_id}}" class="btn btn-xs green  ">详细信息</a> </div>', 
		}
	]

});