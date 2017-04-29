var app = MetronicApp;
function cl(m){
	console.log(m);
}
function showMsg(param){
	//alert(param['msg']);
	//return;
	var mbtn = function(arr){
		var str = arr.split(',');
		$("[mbtn]").hide();
		for(var i in str){
			var v = str[i];
			$("[mbtn='"+v+"']").show();
		}
 
	}
	var istr = '';
	if(param['type'] == 'error'){
		istr = "<i class=' icon-close' style='color:red;margin-right:15px;font-size:30px;line-height:40px;vertical-align: middle;'></i> ";
		mbtn('close');
	}
	if(param['type'] == 'ok'){
		istr = "<i class=' icon-check' style='color:green;margin-right:15px;font-size:30px;line-height:40px;vertical-align: middle;'></i> ";
		mbtn('goon,back');
	}
	var box = $("#msgbox").find(".modal-dialog");
	
 
	var dh = parseInt($(window).height());

	box.css('marginTop',((dh)/3));
	var h = parseInt($('#modalcontent').height());
	$("#msgcontent").html(istr+param['msg']);
	$("#msgbox").modal();
	
}
//Form Handle
function FH(responce){
	if(responce['errormsg'] && typeof responce['errormsg'] != 'undefined'){
		showMsg({'msg':responce['errormsg'],'type':'error'});
		return;
	}
	showMsg({'msg':'操作完成','type':'ok'});
	return;
}

app.factory('$req',function($http){
	
	return {
		g: function(m,a,p){
			return $http({
				url : '?m=Manager&c=Data&a=g' + "&_m="+m+"&_a="+a,
				method : 'POST',
				headers: {'Content-Type':'application/x-www-form-urlencoded'},

				data : p
			});
		},
		s: function(m,a,p){
			return $http({
				url : '?m=Manager&c=Data&a=s' + "&_m="+m+"&_a="+a,
				method : 'POST',
				headers: {'Content-Type':'application/x-www-form-urlencoded'},
 
				params : p
			});
		},
		//自动表单处理
		FH: function(m,a,p){
			$http({
				url : '?m=Manager&c=Data&a=g' + "&_m="+m+"&_a="+a,
				method : 'POST',
				headers: {'Content-Type':'application/x-www-form-urlencoded'},
				 
				data : p
			}).success(function(responce){
				FH(responce);
			});
		},
	}
});
//静态数据

var TableAjax = function () {

    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: Metronic.isRTL(),
            autoclose: true
        });
    }

    var handleRecords = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function (grid) {
                // execute some code after table records loaded
            },
            onError: function (grid) {
                // execute some code on network or other general error  
            },
            loadingMessage: 'Loading...',
            dataTable: { // here you can define a typical datatable settings from http://datatables.net/usage/options 

                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/scripts/datatable.js). 
                // So when dropdowns used the scrollable div should be removed. 
                //"dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
                
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "lengthMenu": [
                    [10, 20, 50, 100, 150, -1],
                    [10, 20, 50, 100, 150, "All"] // change per page values here
                ],
                "pageLength": 10, // default record count per page
                "ajax": {
                    "url": "../demo/table_ajax.php", // ajax source
                },
                "order": [
                    [1, "asc"]
                ] // set first column as a default sort by asc
            }
        });

        // handle group actionsubmit button click
        grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var action = $(".table-group-action-input", grid.getTableWrapper());
            if (action.val() != "" && grid.getSelectedRowsCount() > 0) {
                grid.setAjaxParam("customActionType", "group_action");
                grid.setAjaxParam("customActionName", action.val());
                grid.setAjaxParam("id", grid.getSelectedRows());
                grid.getDataTable().ajax.reload();
                grid.clearAjaxParams();
            } else if (action.val() == "") {
                Metronic.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'Please select an action',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            } else if (grid.getSelectedRowsCount() === 0) {
                Metronic.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'No record selected',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            }
        });
    }

    return {

        //main function to initiate the module
        init: function () {

            initPickers();
            handleRecords();
        }

    };

}();
app.filter('str_split_ind',function(){
    return function(str,ind){
		var s = str.split(',');
		return (s[ind]);
    }
});
app.filter('trusted', ['$sce', function ($sce) {  
        return function (text) {  
            return $sce.trustAsHtml(text);  
        }  
    }]  
)
app.filter('parseDatatableItem',function($parse,$compile,$interpolate,$sce){
    return function(column,data,$scope){ 
		var html = column.html;
		if(column.selectid){
			var html = "<input type=\"checkbox\" value='"+data[column.selectid]+"'>";
			var html = "<label class=\"mt-checkbox mt-checkbox-single mt-checkbox-outline\" ><input name=\""+column.selectid+"\" checkson checkitem=\""+data[column.selectid]+"\" type=\"checkbox\" class=\"checkboxes\" value=\""+data[column.selectid]+"\"\/><span><\/span><\/label>";
 
			return html;
		}
		if(!html) return '';
 
		var func = $interpolate(html);
		var result = func(data);
 
		//cl(result);
		//var result = $compile(result)($scope);
		//cl(result);
 
		return result; 
		 
    }
});

//产品编辑
app.controller('product_detail',function($scope,$req,$stateParams,$staticData) {
	$scope.mode = 'add';
	
	$scope.modeTxt = {'add':'产品添加','edit':'产品编辑'};
	$scope.formData = {'year':1};
	$scope.formData['_config'] = [];
	$scope.formData['id'] = $stateParams.id;
	$scope.formData['type'] = 1;
	$scope.cLength = 0;
	$scope.bonus = $staticData.g('bonus');
	$scope.formData['bonus_per'] = {};
	for(var k in $scope.bonus){
		var v = $scope.bonus[k];
		
		$scope.formData['bonus_per'][k] = 100;
	}
	//var id = $stateParams['id'];
	if($scope.formData['id']){ // 编辑模式
		$scope.mode = 'edit';
		$scope.pageTitle = '产品编辑';
		$scope.bonus_per = {};
		$req.g('Product','getOne',{'id':$scope.formData['id']}).success(function(responce){
			responce['_config'] = [];
			if(jsonLength(responce['config'])){
				 
				var row = 0;
				for(var i in responce['config']){
					
					responce['_config'][row++] = responce['config'][i];
				}
			}
			responce['bonus_per'] = responce['bonus_per'] ? responce['bonus_per'] : {};
			for(var k in $scope.bonus){
				var v = $scope.bonus[k];
				responce['bonus_per'][k] = responce['bonus_per'][k] ? responce['bonus_per'][k] : 100;
			}
			$scope.formData = responce;
			$scope.cLength = $scope.formData['_config'].length;
		});;
	}
	
	$scope.addConfig = function(){
		$scope.formData['_config'].push({'year':1,'per':0,'fyp':0,'xuyong':0});
		$scope.cLength = $scope.formData['_config'].length;
		//$scope.formData['config'] = jsonPush($scope.formData['config'],{'year':1});
		//$scope.cLength = jsonLength($scope.formData['config']);
		 //cl($scope.formData);
	}
	
	$scope.delConfig = function(k){
		$scope.formData['_config'].splice(k,1);
		$scope.cLength = $scope.formData['_config'].length;
		//delete $scope.formData['config'][k];
		//$scope.cLength = jsonLength($scope.formData['config']);
	}
	$scope.subForm = function(){
		var c = $scope.formData['_config'];
		$scope.formData['config'] = {};
		var row=0;
 
		for(var i in c){
			$scope.formData['config'][row++] = c[i];
		}
		 
		var params = $scope.formData;
		$req.FH('Product','rsave',params);
	}
});
app.controller('managerDetail',function($scope,$req,$stateParams) {
	$scope.formData = {'auth_id':0};

	if($stateParams['id'] > 0){ // 编辑模式
 
		$scope.pageTitle = '保险公司编辑';
		$req.g('Managers','getOne',{'id':$stateParams['id']}).success(function(responce){
			$scope.mode = 'edit';
			if(responce.id){
				$scope.formData = responce;
				for(var i in $scope.formData.rules){
					$("#"+i).parent().trigger('click');
				}
			} 
		});;
	}
	$scope.subForm = function(){
		var params = $scope.formData;
		$req.FH('Managers','rsave',params);
	}
});
app.controller('managerList',function($scope,$req,$stateParams) {
	$scope.mod = 'Managers';
	$scope.oper = {'del':'删除'};
	$scope.columns = [
		{
			selectid : 'id',
			width:'30px'
		},
		{
			title : '用户名称',
			html : '{{name}}',
			search : {
				type:'text',
				field:'name',
				mode:'like',
				title:'请输入用户名称'
			},
			width:'200px'
		},
		{
			title : '用户组',
			html : '{{auth_id|staticData:"authGroups"}}', 
		},
		{
			title:'操作',
			html:'<a href="#/manager/detail/{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation',
			width:'100px'
		}
	]
});
app.controller('auth_groupDetail',function($scope,$req,$stateParams) {
	$scope.mode = 'add';
 
	$scope.modeTxt = {'add':'组别添加','edit':'组别编辑'};
	$scope.formData = {};
	$scope.formData['id'] = $stateParams.id;
	$scope.formData.rules = {};
	//var id = $stateParams['id'];
	if($scope.formData['id']){ // 编辑模式
		
		$scope.pageTitle = '保险公司编辑';
		$req.g('AuthGroups','getOne',{'id':$scope.formData['id']}).success(function(responce){
			$scope.mode = 'edit';
			if(responce.id){
				$scope.formData = responce;
				for(var i in $scope.formData.rules){
					$("#"+i).parent().trigger('click');
				}
			} 
		});;
	}

	$scope.subForm = function(){
		$scope.formData.rules = {};
		$("[rules]").each(function(){
			if($(this).prop('checked')){ 
				var name = $(this).attr('name');cl(name);
				$scope.formData.rules[name] = 1;
			}
		}); 
		var params = $scope.formData;
		$req.FH('AuthGroups','rsave',params);
	}
});
app.controller('auths_groupList',function($scope,$req,$stateParams) {
	$scope.oper = {'del':'删除'};
	$scope.mod = 'AuthGroups';
	$scope.field = "*";
	$scope.columns = [
		{
			selectid : 'id',
			width:'30px'
		},
		{
			title : '组名称',
			html : '{{name}}',
			search : {
				type:'text',
				field:'company.name',
				mode:'like',
				title:'请输入组名称'
			},
			width:'200px'
		},
		{
			title : '管理权限',
			html : '{{rulesHtml}}', 
		},
		{
			title:'操作',
			html:'<a href="#/auths/groupDetail/{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation',
			width:'100px'
		}
	];
 
 
});
app.controller('company_detail',function($scope,$req,$stateParams) {
	$scope.formData = {};
	$scope.modeTxt = {'add':'保险公司添加','edit':'保险公司编辑'};
	$scope.formData['id'] = $stateParams.id;
	if($scope.formData['id']){ // 编辑模式
		$scope.mode = 'edit';
		$scope.pageTitle = '保险公司编辑';
		$req.g('Company','getOne',{'id':$scope.formData['id']}).success(function(responce){ 
			$scope.formData = responce; 
		});;
	}
	$scope.subForm = function(){
		var params = $scope.formData;
		$req.FH('Company','rsave',params);
	}
});
app.controller('organ_detail', function($scope,$req,$stateParams) {
	$scope.mode = 'add';
	
	$scope.modeTxt = {'add':'营业組添加','edit':'营业組编辑'};
	$scope.formData = {};
	$scope.formData['id'] = $stateParams.id;
	$scope.formData['name'] = '';
	//var id = $stateParams['id'];
	if($scope.formData['id']){ // 编辑模式
		$scope.mode = 'edit';
		$scope.pageTitle = '产品编辑';
		$req.g('Organ','getOne',{'id':$scope.formData['id']}).success(function(responce){
			$scope.formData = responce; 
		});;
	}

	$scope.subForm = function(){
		var params = $scope.formData;
		$req.FH('Organ','rsave',params);
	}
	
});
app.controller('office_detail', function($scope,$req,$stateParams) {
	$scope.mode = 'add';
	
	$scope.modeTxt = {'add':'营业部添加','edit':'营业部编辑'};
	$scope.formData = {};
	$scope.formData['id'] = $stateParams.id;
	$scope.formData['name'] = '';
	//var id = $stateParams['id'];
	if($scope.formData['id']){ // 编辑模式
		$scope.mode = 'edit';
		$scope.pageTitle = '产品编辑';
		$req.g('Office','find',{'id':$scope.formData['id']}).success(function(responce){
			cl(responce);
			$scope.formData = responce;
		});;
	}

	$scope.subForm = function(){
		var params = $scope.formData;
		$req.FH('Office','rsave',params);
	}
	
});
app.controller('user_detail', function($scope,$req,$stateParams,settings,$staticData) {
	$scope.bonus = $staticData.g('bonus');
	 
	
	$scope.usermenu = 'index';
	$scope.rank = $staticData.g('rank');
 
});
app.controller('user_sidebar', function($scope,$req,$stateParams,$staticData) {
	var params = {};
	params['id'] = $stateParams.id;
	$req.g('Users','getDetail',params).success(function(responce){
		$scope.detail = responce;
	});
});

//产品管理
app.controller('product_list', ['$scope','$req',function($scope,$req) {
	
	$scope.oper = {'del':'删除'};
	$scope.mod = 'Product';
	$scope.field = "product.*,company.name as company_name";
	$scope.columns = [
		{
			selectid : 'id', 
		},
		{
			title : '所属公司',
			html : '{{company_name}}',
			search : {
				type:'text',
				field:'company.name',
				mode:'like',
				title:'请输入公司名称'
			}
		},
		{
			title : '产品名称',
			html : '{{name}}',
			search : {
				type:'text',
				field:'name',
				mode:'like',
				title:'请输入产品名称'
			}
		},
		{
			title:'参数',
			html:"{{config}}",
		},
		{
			title:'类型',
			html : '{{type==1?"主险":"附加险"}}',
			search :{
				type : 'select',
				field : 'type',
				data : {
					0 : '请选择险种',
					1 : '主险',
					2 : '附加险'
				}
			}
		},
		{
			title:'操作',
			html:'<a href="#/product_detail/{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation'
		}
	];
 
}]);
app.controller('company_list', ['$scope','$req',function($scope,$req) {
	$scope.ftitle = '保险公司管理';
	$scope.oper = {'del':'删除'};
	$scope.mod = 'company';
	$scope.columns = [
		{
			selectid : 'id',
			width:'30px'
		},
		{
			title : '公司名称',
			html : '{{name}}',
			search : {
				mode : 'like',
				type : 'text',
				title: '请输入公司名称'
			}
		},
		{
			title : '操作',
			html:'<a href="#/company_detail/{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>'
		}
	];
	$scope.fields = [{
		title:'checkbox',
		fname:'id',
		width:'30px',
		stype:'',
	},
	{
		title:'公司名称',
		fname:'name',
		stype:'text',
		stitle:'请输入公司名称',
		smode:'like',
	},
 
	{
		title:'操作',
		fname:'id as oid',
		stype:'operation',
		html:'<a href="#/company_detail/{{val}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>'
	}
	];
 
	$scope.subForm = function(){
		
		var params = $scope.formData;
		$req.FH('Product','add',params);
	}
}]);
app.controller('assess_zero',function($scope,$req,$staticData) {
	$scope.ftitle = '';
	$scope._a = 'AT_assess_zero';
 
	$scope.oper = {'del':'删除'};
	$scope.mod = 'AssessList';
	$scope.fields = [{
		title:'checkbox',
		fname:'assess_list.id',
		width:'30px',
		stype:'',
	},
	{
		title:'代理人',
		fname:'users.name',
		as:'user_name',
		stype:'text',
		stitle:'请输入代理人名称',
		smode:'like',
	},
	{
		title:'考核时间',
		fname:'users.name',
		as:'user_name',
		stype:'betweendate',
		stitle:'起始时间,结束时间',
	},
	{
		title:'职级',
		fname:'rank.id',
		as:'_rank_id',
		stype:'select',
		stitle:'请输入工号',
		smode:'like',
		data:$staticData.g('rank')
	},

	{
		title:'操作',
		fname:'assess_list.id as oid',
		stype:'operation',
		html:'<!--<a href="#/product_detail/{{val}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>-->'
	}
	];
});
function showModal(params){
	
}
app.controller('assess_list',function($scope,$req,$staticData,$compile,$modal) {
	$scope.ftitle = '';
	$scope.ranks = $staticData.g('rank');
	$scope.actions = {
		'excelOut':1,
	};
	$scope.oper = {
		'levelup':'批量晋升',
		'leveldown':'批量降级',
	},
	$scope.loading = 0;
 	$scope.title='考核管理';
	$scope.mod = 'AssessList';
	$scope.whereoper = '0';
	$scope.noticAction = '';
 
	$scope.postparams = {'rank_id':$scope.rank_id};
	$scope.whereoption = {'up':'满足晋升','down':'满足降级'};
	
	$scope.funcs = {
		'levelUp' : function(id){
			$scope.loading = 1;
			$req.g('AssessList','levelUp',{id:id,'test':1}).success(function(responce){
				$scope.loading = 0;
				if(responce['status'] == 1){
					$scope.noticAction = 'refresh';
				}
				if(responce['errormsg']){
					alert(responce['errormsg']);
				}
			});
		},
		'levelDown' : function(id){
			$scope.loading = 1;
			$req.g('AssessList','levelDown',{id:id,'test':1}).success(function(responce){
				$scope.loading = 0;
				if(responce['status'] == 1){
					$scope.noticAction = 'refresh';
				}
				if(responce['errormsg']){
					alert(responce['errormsg']);
				}
			});
		},
	};
	
	$scope.columns1 = [
	{
		selectid:'id',
		width:'30px'
	},
	{
		'title':'时间范围',
		'html':'{{rsdate*1000|date:"yyyy年MM月dd日"}}',
		'search':{
			'field':'users.rsdate',
			'type':'betweendate',
			'mode':'like',
			'minTitle':'起始时间',
			'maxTitle':'截止时间'
		}
	},
	{
		'title':'工号',
		html:'{{id}}',
		'search':{
			'field':'id',
			'type':'text',
			'mode':'like',
			'title':'请输入工号'
		}
	},
	{
		'title':'姓名',
		html:'{{name}}',
		'search':{
			'field':'users.name',
			'type':'text',
			'mode':'like',
			'title':'请输入姓名'
		}
	},
	{
		'title':'职级',
		html:'{{rank_id|staticData:"rank"}}',
		'search':{
			'field':'rank_id',
			'type':'select',
			data : $staticData.g('rank'),
			'title':'请选择职级'
		}
	},
	{
		'title':'直接增员/直辖团队',
		'html':'{{soncount}}',
		'search':{
			'field':'soncount',
			'type':'betweentext',
			'mode':'like',
			'minTitle':'人数下限',
			'maxTitle':'人数上限'
		}
	},
	{
		'title':'累计增员/所辖团队',
		'html':'{{allsoncount}}',
		'search':{
			'field':'allsoncount',
			'type':'betweentext',
			'mode':'like',
			'minTitle':'人数下限',
			'maxTitle':'人数上限'
		}
	},
	{
		title:'操作',
		html:'<button type="button" ng-modal class="btn green btn-xs" click="levelUp(\'{{jobnumber}}\');"><i class="fa fa-check"></i> 晋升</button> <br/><br/><button type="button" ng-modal class="btn red btn-xs" click="levelDown(\'{{jobnumber}}\');"><i class="fa fa-check"></i> 降级</button>',
		search:'operation'
	}
	];
	 
	$scope.fieldss = [{
		title:'checkbox',
		fname:'users.id as id',
		width:'30px',
 
		stype:'',
	},
	{
		title:'代理人',
		fname:'users.name',
		as:'user_name',
		stype:'text',
		stitle:'请输入代理人名称',
		smode:'like',
	},
	
 
	{
		title:'考核内容',
		fname:'result',
 
	},
	{
		title:'职级',
		fname:'rank.id',
		as:'_rank_id',
		stype:'select',
		stitle:'请输入工号',
		smode:'like',
		data:$staticData.g('rank')
	},
	{
		title:'考核结果',
		fname:'move',
		stype:'select',
		data:{'1':'晋升','-1':'降级','0':'维持'},
	},
	{
		title:'生效时间',
		fname:'mdate',
 
	},
	{
		title:'操作',
		fname:'assess_list.id as oid',
		stype:'operation',
		html:'<a href="#/product_detail/{{val}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>'
	}
	];
 
	$scope.subForm = function(){
		
		var params = $scope.formData;
		$req.FH('Product','add',params);
	}
});
app.controller('office_list', ['$scope','$req',function($scope,$req) {
	$scope.ftitle = '营业部管理';
	$scope.oper = {'del':'删除'};
	$scope.mod = 'Users';
	$scope._a = 'grouplist';
	$scope.fields = [{
		title:'checkbox',
		fname:'id',
		width:'30px',
		stype:'',
	},
	{
		title:'营业部名称',
		fname:'name',
		stype:'text',
		stitle:'请输入营业部名称',
		smode:'like',
	},
	{
		title:'代码',
		fname:'jobnumber',
		stype:'text',
		stitle:'请输入营业部代码',
		smode:'like',
	},
	{
		title:'机构',
		fname:'jigou',
		stype:'text',
		stitle:'请输入机构',
		smode:'like',
	},
	{
		title:'操作',
		fname:'id as oid',
		stype:'operation',
		html:'<a href="#/office_detail/{{val}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>'
	}
	];
 
	$scope.subForm = function(){
		
		var params = $scope.formData;
		$req.FH('Product','add',params);
	}
}]);
app.controller('relation_list', ['$scope','$req','$stateParams',function($scope,$req,$stateParams) {
	$scope.ftitle = '营业組管理';
	//$scope.oper = {'del':'删除'};
	$scope.actions = {
		'excelOut':1,
	};
	$scope.mod = 'Users';
	$scope.postparams = {'tlevel':$stateParams.id};
	$scope.postfunc = 'relation_list';
	$scope.actions = {
		'excelOut':1,
	};
	$scope.columns =[
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'名称',
			html:'{{name}}',
			search:{
				'type':'text',
				'title':'请输入名称',
				'field':'name',
				'mode':'like'
			}
		},
		{
			title:'代码',
			html:'{{id}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'jobnumber',
				'title':'请输入代码',
			}
		},
		{
			title:'管辖人力',
			html:'{{soncount}}',
			/*search:{
				'type':'betweentext',
				'field':'count',
				'minTitle':'最低人数',
				'maxTitle':'最高人数'
			}*/
		},
		{
			title:'所辖人力',
			html:'{{allsoncount}}',
			/*search:{
				'type':'betweentext',
				'field':'count',
				'minTitle':'最低人数',
				'maxTitle':'最高人数'
			}*/
		},
		{
			title:'操作',
			search:'operation',
            html:'<!--<a href="javascript:;" class="btn btn-xs default"><i class="fa fa-search"></i> 查看</a>-->',
		}
	];
 
}]);
app.filter('staticData', ['$staticData', function ($staticData) {  
        return function (id,kname) {
			var data = $staticData.g(kname);
            return data[id];
        }  
    }]  
) 
app.controller('insurance_bonuslog_list',function($scope){
	$scope.mod = 'InsuranceBonuslog';
	$scope.oper = {
		'del':'删除',
		'excelOut':'导出',
	},
	$scope.columns =[
		{
			selectid:'insurance_id',
			width:'30px',
		},
		{
			title:'交单日期',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 hh:mm:ss"}}',
			search:{
				'type':'betweendate',
				'title':'请输入名称',
				'field':'cdate',
				'minTitle':'起始时间',
				'maxTitle':'截止时间'
			}
		},
		{
			title:'工号',
			html:'{{user_id}}',
			search:{
				'type':'text',
				'title':'请输入工号',
				'field':'user_id',
				'mode':'like'
			}
		},
		{
			title:'姓名',
			html:'{{user_name}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'user_name',
				'mode':'like'
			}
		},
		{
			title:'保费',
			html:'{{insurance_price|number:2}}',
			search:{
				'type':'betweentext',
				'field':'insurance_price',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'预估佣金',
			html:'{{bonud1|number:2}}',
			search:{
				'type':'betweentext',
				'field':'bonud1',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'推荐人',
			html:'{{recommend_name}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'recommend_name',
				'mode':'like'
			}
		},
		{
			title:'推荐人工号',
			html:'{{recommend_id}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'recommend_id',
				'mode':'like'
			}
		},
		{
			title:'增员奖',
			html:'{{bonud4|number:2}}',
			search:{
				'type':'betweentext',
				'field':'bonud4',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'主管',
			html:'{{t2name}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'t2name',
				'mode':'like'
			}
		},
		{
			title:'主管OR',
			html:'{{t2amount|number:2}}',
			search:{
				'type':'betweentext',
				'field':'t2amount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'育成主管',
			html:'{{t2growname}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'t2growname',
				'mode':'like'
			}
		},
		{
			title:'津贴',
			html:'{{t2growamount|number:2}}',
			search:{
				'type':'betweentext',
				'field':'t2growamount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'经理',
			html:'{{t3name}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'t3name',
				'mode':'like'
			}
		},
		{
			title:'经理OR',
			html:'{{t3amount|number:2}}',
			search:{
				'type':'betweentext',
				'field':'t3amount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'育成经理',
			html:'{{t3growname}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'t2growname',
				'mode':'like'
			}
		},
		{
			title:'津贴',
			html:'{{t3growamount|number:2}}',
			search:{
				'type':'betweentext',
				'field':'t3growamount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'总监',
			html:'{{t4name}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'t4name',
				'mode':'like'
			}
		},
		{
			title:'总监OR',
			html:'{{t4amount|number:2}}',
			search:{
				'type':'betweentext',
				'field':'t4amount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'育成总监',
			html:'{{t4growname}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'t4growname',
				'mode':'like'
			}
		},
		{
			title:'津贴',
			html:'{{t4growamount|number:2}}',
			search:{
				'type':'betweentext',
				'field':'t4growamount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'高级总监',
			html:'{{t5name}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'t5name',
				'mode':'like'
			}
		},
		{
			title:'高级总监OR',
			html:'{{t5amount|number:2}}',
			search:{
				'type':'betweentext',
				'field':'t5amount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'育成高级总监',
			html:'{{t5growname}}',
			search:{
				'type':'text',
				'title':'请输入姓名',
				'field':'t5growname',
				'mode':'like'
			}
		},
		{
			title:'津贴',
			html:'{{t5growamount|number:2}}',
			search:{
				'type':'betweentext',
				'field':'t5growamount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'操作',
			fname:'money_log.id',
			as:'oid',
			stype:'operation', 
			search:'operation',
 			html:'<a href="#/insurance_add/{{insurance_id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
		}
	]
	
})
app.controller('bouns_log',function($scope,$req,$staticData) {
	$scope.mod = 'BonusLog';
	$scope.actions = {
		'excelOut':1,
	};
	$scope.columns =[
		{
			selectid:'id',
			width:'30px',
		},
		{
			title:'工号',
			html:'{{user_id}}',
			search:{
				'type':'text',
				'title':'请输入工号',
				'field':'user_id',
				'mode':'like'
			}
		},
		{
			title:'姓名',
			html:'{{user_name}}',
			search:{
				'type':'text',
				'title':'请输入工号',
				'field':'user_name',
				'mode':'like'
			}
		},
		{
			title:'时间',
			html:'{{cdate*1000|date:"yyyy年MM月dd日 HH:mm:ss"}}',
			search:{
				'type':'betweendate',
				'title':'请输入名称',
				'field':'rsdate',
				'minTitle':'起始时间',
				'maxTitle':'截止时间'
			}
		},
		{
			title:'佣金类型',
			html:'{{bonus_id|staticData:"bonus"}}',
			search:{
				'type':'select',
				'title':'请选择奖金类型',
				'field':'bonus_id',
				'data':$staticData.g('bonus')
			}
		},
		{
			title:'数额',
			html:'￥{{amount}}',
			search:{
				'type':'betweentext',
				'field':'amount',
				'minTitle':'最低金额',
				'maxTitle':'最高金额'
			}
		},
		{
			title:'说明',
			html:'{{intro}}',
			search:{
				'type':'text',
				'title':'请输入关键字',
				'field':'intro',
				'mode':'like'
			}
		},
		{
			title:'结算',
			html:'{{done==1?"<b style=\'color:green\'>已结算</b>":"<b style=\'color:red\'>未结算</b>"}}',
			search:{
				'type':'select',
				'title':'请选择',
				'field':'done',
				data:{1:'已结算',0:'未结算'}
			}
		},
		{
			title:'操作',
			search:'operation',
            html:'',
		},
	];
});
app.controller('user_list', ['$scope','$req','$staticData',function($scope,$req,$staticData) {
	$scope.mod = 'Users';
	$scope.postparams = {'tlevel':'1'}; 
	$scope.fields = "jigou,id,t1,t1name,t2,t2name,name,jobnumber,rank_id,rsdate,idcard,phone";
	$scope.title = '用户列表';
	$scope.actions = {
		'excelOut':1,
	};
	$scope.columns =[
		{
			selectid:'id',
			width:'30px'
		},
		{
			title:'营业组名称',
			html:'{{t2name}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'t2name',
				'title':'请输入名称',
			}
		},
		{
			title:'营业组代码',
			html:'{{t2}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'t2',
				'title':'请输入代码',
			}
		},
		{
			title:'营业部名称',
			html:'{{t3name}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'t3name',
				'title':'请输入名称',
			}
		},
		{
			title:'营业部代码',
			html:'{{t3}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'t3',
				'title':'请输入代码',
			}
		},
		{
			title:'营业区名称',
			html:'{{t4name}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'t4name',
				'title':'请输入名称',
			}
		},
		{
			title:'营业区代码',
			html:'{{t4}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'t4',
				'title':'请输入代码',
			}
		},
		{
			title:'高级营业区名称',
			html:'{{t5name}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'t5name',
				'title':'请输入名称',
			}
		},
		{
			title:'高级营业区代码',
			html:'{{t5}}',
			search:{
				'type':'text',
				'mode':'like',
				'field':'t5',
				'title':'请输入代码',
			}
		},

		{
			title:'工号',
			html:'{{id}}',
			search:{
				'type':'text',
				'title':'请输入工号',
				'field':'id',
				'mode':'like'
			}
		},
		{
			title:'姓名',
			html:'{{name}}',
			search:{
				'type':'text',
				'title':'请输入名称',
				'field':'name',
				'mode':'like'
			}
		},
		{
			title:'推荐人工号',
			html:'{{recommend_id}}',
			search:{
				'type':'text',
				'title':'请输入工号',
				'field':'recommend_id', 
				'mode':'like'
			}
		},
		{
			title:'推荐人姓名',
			html:'{{recommend_name}}',
			search:{
				'type':'text',
				'title':'请输入名称',
				'field':'recommend_name',
				'mode':'like'
			}
		},
		{
			title:'职级',
			html:'{{rank_id|staticData:"rank"}}',
			search:{
				'type':'select',
				'title':'请选择职级',
				'field':'rank_id',
				'data':$staticData.g('rank')
			}
		},
		{
			title:'入司时间',
			html:'{{rsdate*1000|date:"yyyy年MM月dd日"}}',
			search:{
				'type':'betweendate',
				'title':'请输入名称',
				'field':'rsdate',
				'minTitle':'起始时间',
				'maxTitle':'截止时间'
			}
		},
		 
		{
			title:'操作',
			search:'operation',
            html:' ',
		},
	
	];
	 
}]);
app.controller('money_list', ['$scope','$req',function($scope,$req) {
 
	$scope.mod = 'MoneyLog';
	$scope.fields = [
	{
		title:'代理人',
		fname:'users.name',
		stype:'text',
		stitle:'请输入代理人名称',
		smode:'like',
	},
	{
		title:'类型',
		fname:'type',
 
	},
	 
	{
		title:'操作金额',
		fname:'amount',
	},
	{
		title:'说明',
		fname:'msg',
		as:'msg',
		stype:'text',
		stitle:'请输入说明',
		smode:'like',
	},
	{
		title:'操作',
		fname:'money_log.id',
		as:'oid',
		stype:'operation',
		html:' '
	}
	];
}]);
app.controller('insurance_list', ['$scope','$req',function($scope,$req) {
	$scope.mod = 'InsuranceList'; 
	$scope.oper = {
		'del':'删除',
		'excelOut':'导出',
	},
	$scope.columns = [
		{
 			selectid:'id',
 			width:'30px',
 		},
 		{
 			title:'录入时间',
 			html:'{{ cdate*1000 |date:"yyyy-MM-dd hh:mm:ss"}}',
 			search:{
 				type:'betweendate',
 				maxTitle:'开始时间',
 				minTitle:'截止时间',
 				field:'insurance_list.cdate'
 			}
 		},
 		{
 			title:'代理人姓名',
 			html:'{{ user_name }}',
 			search:{
 				type:'text',
 				mode:'like',
 				field:'users.name',
 				title:'请输入代理人姓名'
 			}
 		},
 		{
 			title:'代理人工号',
 			html:'{{ jobnumber }}',
 			search:{
 				type:'text',
 				mode:'like',
 				field:'jobnumber',
 				title:'请输入代理人姓名'
 			}
 		},
 		{
 			title:'保单号',
 			html:'{{ baodanhao }}',
 			search:{
 				type:'text',
 				mode:'like',
 				field:'baodanhao',
 				title:'请输入保单号'
 			}
 		},
 		{
 			title:'被保人身份证',
 			html:'{{ idcard }}',
 			search:{
 				type:'text',
 				mode:'like',
 				field:'insurance_list.idcard',
 				title:'请输入身份证'
 			}
 		}, 
 		{
 			title:'保费',
 			html:'{{ amount  }}',
 			search:{
 				type:'betweentext', 
 				field:'insurance_list.amount',
 				maxTitle:'最高保费',
 				minTitle:'最低保费'
 			}
 		}, 
 		{
 			title:'入保险种',
 			html:'{{ detail }}', 
 			search:{
 				type:'text',
 				mode:'like',
 				field:'detail',
 				title:'请输入险种名称'
 			}
 		},
 		{
 			title:'FYP',
 			html:'{{ fyp }}',
 			search:{
 				type:'betweentext', 
 				field:'insurance_list.fyp',
 				maxTitle:'最高FYP',
 				minTitle:'最低FYP'
 			}
 		},
 		{
 			title:'承保日期',
 			html:'{{ cbdate  }}',
 			search:{
 				type:'betweentext',
 				mode:'like',
 				field:'insurance_list.cbdate',
 				maxTitle:'起始时间',
 				minTitle:'截止时间'
 			}
 		}, 
 		{
 			title:'回执日期', 
 			html:'{{ cdate*1000 |date:"yyyy年MM月dd日"}}',
 			search:{
 				type:'betweendate',
 				maxTitle:'开始时间',
 				minTitle:'截止时间',
 				field:'insurance_list.cdate'
 			}
 		}, 
 		{
 			title:'保费',
 			html:'{{ amount  }}',
 			search:{
 				type:'betweentext', 
 				field:'insurance_list.amount',
 				maxTitle:'最低保费',
 				minTitle:'最高保费'
 			}
 		}, 
 		{
 			title:'首佣',
 			html:'{{ per }}',
 			search:{
 				type:'betweentext', 
 				field:'insurance_list.per',
 				maxTitle:'最低首佣',
 				minTitle:'最高首佣'
 			}
 		},
 		{
 			title:'操作',
 			search:'operation',
 			html:'<a href="#/insurance_add/{{id}}" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
 		}
	];
	
}]);
app.controller('account_wait', ['$scope','$req','$timeout',function($scope,$req,$timeout) {
	 
	$scope.mod = 'AccountWait';
	$scope.tpl = 'Account.wait';
	$scope.fields = [
	{
		title:'用户姓名',
		fname:'users.name',
 
		stype:'text',
		stitle:'请输入用户姓名',
		smode:'like',
	},
	{
		title:'奖金类型',
		fname:'bonus.name',
		as:'bonus_name',
		stype:'text',
		stitle:'请输入奖金类型',
		smode:'like',
	},
	{
		title:'佣金',
		fname:'account_list.amount ',
		stype:'text',
		stitle:'最低佣金,最高佣金',
		smode:'betweentext',
	},
	{
		title:'说明',
		fname:'account_list.intro',
		as:'intro',
		stype:'text',
		stitle:'请输入用户姓名',
		smode:'like',
	},
	{
		title:'操作',
		fname:'account_list.id',
		as:'oid',
		stype:'operation',
		html:' '
	}
	];
}]);
app.controller('sys_test', ['$scope','$req','$timeout',function($scope,$req,$timeout) {
	$scope.clearUser = function(){
		$req.g('Systest','clearUser').success(function(responce){
			if(responce['status'] == 1){
				alert('清除完成');
			}
		});
	}
	 
}]);
app.controller('UserProfile', function($scope,$req,$stateParams,$staticData) {
	var params = {};
	params['id'] = $stateParams.id;
	$scope.user_id = $stateParams.id;
	$req.g('Users','getProfile',params).success(function(responce){
		 
		$scope.profile = responce;
	});
	$scope.bonus = $staticData.g('bonus');
});
app.controller('user_setting', function($scope,$req,$stateParams,settings,$staticData) {
	$scope.formData = {};
	$scope.formData.id = $stateParams.id;
	$scope.relations = {};
	$scope.actions = {
		'excelOut':1,
	};
	$req.g('Users','getOne',{id:$scope.formData.id}).success(function(responce){
		 
		$scope.formData = responce;
		if(!$scope.formData.rules) $scope.formData.rules = [];
		
	});
	 
	$scope.ranks = $staticData.g('rank');
	cl($scope.ranks);
	$scope.nowTab = 1;
	$scope.tabShow = function(i){
		$scope.nowTab = i;
	}
	
	$scope.usermenu = 'setting';
	$scope.bonus = $staticData.g('bonus');
	
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH('Users','rsave',params);
	}
});
app.controller('user_out',function($scope,$req,$window){
	$scope.fields = 'all';
	$scope.data = {'id':'工号','name':'姓名','phone':'手机号','idcard':'身份证','rsdate':'入司时间','recommend_id':'推荐人工号','recommend_name':'推荐人姓名','rank_id':'职级','bank':'银行','bankcard':'银行卡号','tlevel':'层级','soncount':'直辖人数','allsoncount':'所辖人数'};
	$scope.start = 1;
	$scope.loadingText = "";
	$scope.nowcount = 0;
	$scope.filedown =  "";
	$scope.setData = function(){
		$scope.filedown =  "";
		$req.g('Users','out',{fields:$scope.fields,data:$scope.data,start:$scope.start,nowcount:$scope.nowcount}).success(function(responce){
			$scope.start = 0; 
			$scope.nowcount = responce.nowcount;
			$scope.allcount = responce.allcount;
			$scope.loadingText = "已处理数据："+$scope.nowcount+"/"+$scope.allcount;
			if(responce['done'] == 0){
				$scope.setData();
			}else{

				$scope.loadingText = "数据处理完毕"; 
				$scope.filedown = "/download.php?file="+responce['file']; 
			}
		});
	}
	$scope.subForm = function(){
		$scope.loadingText = "正在初始化...";
		$scope.setData();
		
	}
});
app.controller('user_calibration', ['$scope','$req','$timeout','$staticData',function($scope,$req,$timeout,$staticData) {
	$scope.recordsLoading = 0;
	$scope.tjrdata = {0:'无推荐人',1:'有推荐人'};
	$scope.statusArr = {'fail':'数据验证失败','checked':'建立关系失败','checkUsersRelation':'建立层级失败' };
	
	$scope.counts = {};
	//取得各级信息
	$scope.getCounts = function(){
	$req.g('Users','statusCounts',{}).success(function(responce){
		$scope.counts = responce; 
	});}
	$scope.getCounts();
	$scope.mod = 'Users';
	$scope.calibration = function(k){
 		 
		$scope.recordsLoading = 'calibration';
		$scope.recordsLoading = 1;
		$scope.loadingText = "准备处理"+$scope.statusArr[k]+"数据...";
		//验证数据
		var start = 1;
		$scope.check = function(){
			$scope.recordsLoading = 1; 
			$req.g('Users','calibration',{'step':k,'start':start}).success(function(responce){
				start = 0;
				if(responce['count'] == 0){ 
					$scope.loadingText = "完成";
					$scope.recordsLoading = 0;
					$scope.getCounts();
					return;
				}else{
					$scope.loadingText = "正在处理"+$scope.statusArr[k]+"数据，剩余"+responce['count']+",处理中...";
					$scope.check();
				}
			});
		} 
		$scope.check();
		
	}
	$scope._checkUserDatas = function(){
		$req.g('Users','checkDatas',{'start':1}).success(function(responce){
		 
			if(responce['status'] == 1){
				$scope.recordsLoading = '0';
				$scope.noticAction = 'refresh';
			}else{
				//$scope._checkDatas();
			}
		});
	}
	$scope.detailData = {};
	$scope._funcs = {
 
		editUserDetail : function(id){
			$scope.detailData = {};
			$("#userDetailBox").modal();
			$req.g('Users','getOne',{id:id}).success(function(responce){ 
				responce['mod'] = 'Users'; 
				$scope.detailData = responce; 
			});
			
		}, 
	}
	$scope.noticAction = ''; 
	$scope.saveDetail  = function(){ 
 
		$req.g('Users','saveDetail',$scope.detailData).success(function(responce){
			if(responce['status'] == 0){
				responce['errormsg'] && alert(responce['errormsg']);
				responce['msg'] && alert(responce['msg']);
			}else{
				$("#detailClose").trigger('click');
				$scope.noticAction = 'refresh'; 
			}
		});
	}
	$scope.jlcj = function(){
		start = 1;   
		$scope.checkUsersLevel();
	}
	
	$scope.checkRank = function(){
		
		$scope.recordsLoading = 1;
		$req.g('Users','calibration',{'step':'checkRank','start':start}).success(function(responce){
			
			if(responce['error'] == 1) return;
			start = 0;
			if(responce['count'] == 0){
				
				$scope.loadingText = "准备处理职级...";
				 
				$scope.checkUsersLevel();
			}else{ 
				$scope.loadingText = "正在处理职级，剩余"+responce['count']+",处理中...";
				$scope.checkRank();
			}
		});
	}
	
	$scope.checkUsersLevel = function(){
		$scope.recordsLoading = 1;
		$req.g('Users','calibration',{'step':'checkUsersLevel','start':start}).success(function(responce){
			$scope.recordsLoading = 0;
			$scope.checkUsersTLevel();
		});
	}
	start = 1;  
	$scope.checkUsersTLevel = function(){
		$scope.recordsLoading = 1;
		$req.g('Users','calibration',{'step':'checkUsersTLevel','start':start}).success(function(responce){
			start = 0;  
			if(responce['count'] == 0){
				
				$scope.loadingText = "准备处理职级关系..."; 
				cl('全部数据处理完成');
				$scope.recordsLoading = 0;
			}else{ 
				$scope.loadingText = "正在处理职级关系，剩余"+responce['count']+",处理中...";
				$scope.checkUsersTLevel();
			}
		});
	}
	//$scope.checkUsersTLevel();
	$scope.actions = { 
		'excelOut':1,
	};
	$scope.columns = [
		{
			selectid : 'id',
			width:'30px',
		},
		{
			title:'工号',
			html:'{{id}}',
			search:{
				type:'text',
				mode:'like',
				field:'id',
				title:'请输入工号'
			}
		},
		{
			title:'姓名',
			html:'{{name}}',
			search:{
				type:'text',
				mode:'like',
				field:'name',
				title:'请输入姓名'
			}
		},
		{
			title:'身份证',
			html:'{{idcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'idcard',
				title:'请输入身份证'
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
			title:'推荐人身份证',
			html:'{{recommend_idcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'recommend_idcard',
				title:'请输入推荐人身份证'
			}
		},
		{
			title:'关系',
			html:'{{uprelation}}',
			search:{
				type:'text',
				mode:'like',
				field:'uprelation',
				title:'请输入关键字'
			}
		}, 
		{
			title:'来源文件',
			html:'{{filename}}',
			width:'200px',
			search:{
				type:'text',
				mode:'like',
				field:'filename',
				title:'请输入关键字'
			}
		},
		{
			title:'状态',
			html:'{{datastatus}}',
			width:'200px',
			search:{
				type:'select',
				field:'datastatus',
				data:$scope.statusArr,
				title:'请选择',
			}
		},
		{
			title:'错误信息',
			html:'{{datastatus!="success"?datamsg:"<b>验证通过</b>"}}',
			width:'200px',
			search:{
				type:'text',
				mode:'like',
				field:'datamsg',
				title:'请输入关键字'
			}
		},
		 
		{
			title:'操作',
			html:'<a href="javascript:;" click="editUserDetail(\'{{id}}\')" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation',
			width:'100px'
		}
	];
}]);
 
app.controller('user_exceladd', ['$scope','$req','$timeout','$staticData','$stateParams','$window',function($scope,$req,$timeout,$staticData,$stateParams,$window) {
	$scope.files = [];
	$scope.step = $stateParams.step;
 	$scope.postparams = {};

	$scope.noticAction = '';
	$scope.files = [
		{
			url : 'd9dc2099/1621feeb/24266f16/e91f6b5f/21928.xlsx',
		},
		{
			//url : '5e8fe054/0df825b6/e2dc9a6b/d2b0806f/142982.xlsx',
		}
	];
	$scope.files = [];
	$scope.step2loaded = 0;
	$scope.import = function(){

		//导入
		var length = $scope.files.length;
		var file = $scope.files;
		$scope.nowfileindex = 1;
		$scope.import = function(){
			$scope.importing = 1;
			$req.g('ExcelUsers','import',{file:$scope.files[$scope.nowfileindex-1]['url'],'name':$scope.files[$scope.nowfileindex-1]['filename']}).success(function(responce){
				if(responce['status']==1){
					$scope.nowfileindex++;
					if($scope.nowfileindex<=$scope.files.length){
						
						$scope.import();
					}else{
						$scope.importing = 0;
						$scope.step = 'records';
						$scope.getCount();
						$scope.noticAction = 'refresh';
					}
				}else{
					//alert(responce['errormsg']);
					//$window.location.href = "#/user_exceladd/records";
					//$scope.importing = 0;
				}
			});
		}
		$scope.import();
		
		
	}

	//$scope.step2();
	$scope.stepChange = function(i){
		$scope.step = i;

		if($scope.step == 'import'){
			$scope.import();
		}
	}
	$scope.recordsLoading = 0;
	//验证
	$scope.checkDatas_success = 0;
	$scope.checkDatas_count = 0;
	$scope.checkDatas = function(){
 
		$scope.recordsLoading = 'checkDatas';
		$scope._checkDatas();
		
	}
	$scope._checkDatas = function(){
 
		$req.g('ExcelUsers','checkDatas',{'checkDatas_success':$scope.checkDatas_success}).success(function(responce){
			$scope.checkDatas_count = responce.checkDatas_count;
			$scope.checkDatas_success = responce.checkDatas_success;
			if(responce['done'] == 1){
				$scope.recordsLoading = '0';
				$scope.noticAction = 'refresh';
			}else{
				$scope._checkDatas();
			}
		});
	}
	$scope.insysDatas_success = 0;
	$scope.insysDatas_count = 0;
	$scope.insysDatas = function(){
		$scope.recordsLoading = 'insysDatas';
		$scope._insysDatas();
	}
	$scope.noticAction2 = '';
	$scope._insysDatas = function(){
 
		$req.g('ExcelUsers','insysDatas',{'insysDatas_success':$scope.insysDatas_success}).success(function(responce){
			$scope.insysDatas_count = responce.insysDatas_count; 
			if(responce['done'] == 1){
				$scope.recordsLoading = '0';
				$scope.noticAction = 'refresh';
			}else{ 
				$scope._insysDatas(); 
			}
		});
	}
	//纠错
	$scope.importToUsers = function(){
		$req.g('ExcelUsers','importToUsers',{}).success(function(responce){
			$scope.getCount();
		});
	}
	//取得总数
	$scope.getCount = function(){
		$req.g('ExcelUsers','getCount',{}).success(function(responce){
			$scope.success_count = responce['success_count'];
			$scope.all_count = responce['all_count'];
		});
	}
	//保存详情
	$scope.saveDetail  = function(){

		$req.g('ExcelUsers','saveDetail',$scope.detail).success(function(responce){
			if(responce['status'] == 0){
				alert(responce['errormsg']);
			}else{
				alert('验证通过');
				$("#detailClose").trigger('click');
				$scope.noticAction = 'refresh';
				$scope.noticAction2 = 'refresh';
			}
		});
	}
	//$scope.importToUsers();
	//
	$scope.detail = {};
	$scope.step2mod = 'ExcelUsers';
	$scope._funcs = {
		editUser : function(id){ 
			$("#detailBox").modal();
			$req.g('ExcelUsers','getOne',{id:id}).success(function(responce){ 
				responce['mod'] = 'ExcelUsers';
				$scope.detail = responce; 

			});
			
		}, 
		editUserDetail : function(id){  
			$("#detailBox").modal();
			$req.g('ExcelUsers','getOne',{id:id}).success(function(responce){ 
				responce['mod'] = 'ExcelUsers';
				$scope.detail = responce; 
			});
			
		}, 
	}

	 
	//仅显示错误项
	$scope.showErrorData = function(){
		$("[name='searchparams\[equal\]\[errormsg\]']").val('error');
		$scope.noticAction = 'refresh';
	}
	$scope.columns = [
		{
			selectid : 'id',
			width:'30px',
		},
		{
			title:'姓名',
			html:'{{name}}',
			search:{
				type:'text',
				mode:'like',
				field:'name',
				title:'请输入姓名'
			}
		},
		{
			title:'身份证',
			html:'{{idcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'idcard',
				title:'请输入身份证'
			}
		},
		{
			title:'入司时间',
			html:'{{rsdate*1000|date:"yyyy-MM-dd"}}',
			search:{
				type:'betweendate',
				field:'rsdate',
				minTitle:'起始时间',
				maxTitle:'截止时间'
			}
		},
		{
			title:'性别',
			html:'{{sex==1?"男":"女"}}',
			search:{
				type:'select',
				data:{1:'男',0:'女'},
				title:'请选择'
			}
		},
		{
			title:'学历',
			html:'{{education}}',
			search:{
				type:'text',
				mode:'like',
				field:'education',
				title:'请输入学历'
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
			title:'推荐人身份证',
			html:'{{recommend_idcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'recommend_idcard',
				title:'请输入推荐人身份证'
			}
		},
		{
			title:'银行',
			html:'{{bank}}',
			search:{
				type:'text',
				mode:'like',
				field:'recommend_idcard',
				title:'请输入银行'
			}
		},
		{
			title:'银行卡号',
			html:'{{bankcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'bankcard',
				title:'请输入银行卡号'
			}
		},
		{
			title:'来源',
			html:'{{filename}}',
			width:'200px',
			search:{
				type:'text',
				mode:'like',
				field:'filename',
				title:'请输入来源文件'
			}
		},
		{
			title:'状态',
			html:'{{errormsg?errormsg:"<b>验证通过</b>"}}',
			width:'200px',
			search:{
				type:'select',
				field:'errormsg',
				data:{'success':'验证通过','error':'验证未通过'},
				title:'请选择',
			}
		},
		{
			title:'导入时间',
			html:'{{importdate?(importdate*1000|date:"yyyy-MM-dd HH:mm:ss"):"-"}}',
			width:'100px',

		},
		{
			title:'操作',
			html:'<a href="javascript:;" click="editUser(\'{{id}}\')" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation',
			width:'100px'
		}
	];
	$scope.tjrdata = {0:'无推荐人',1:'有推荐人'};
	 
	$scope.mod2 = 'Users';
	$scope.calibration = function(){
 
		$scope.recordsLoading = 'calibration';
		$scope.loadingText = '准备验证数据...';
		//验证数据
		var start = 1;
		$scope.checkUsers = function(){
			$req.g('Users','calibration',{'step':'checkUsers','start':start}).success(function(responce){
				start = 0;
				if(responce['count'] == 0){
					
					$scope.loadingText = "准备处理推荐关系...";
					$scope.checkUsersRelation();
				}else{
					$scope.loadingText = "正在验证数据，剩余"+responce['count']+",处理中...";
					$scope.checkUsers();
				}
			});
		}
		//处理层级
		$scope.checkUsersRelation = function(){
			start = 1;
			$req.g('Users','calibration',{'step':'checkUsersRelation','start':start}).success(function(responce){
				start = 0;
				if(responce['count'] == 0){
					 
					$scope.loadingText = "准备处理层级...";
					$scope.checkUsersLevel();
				}else{
					$scope.loadingText = "正在处理推荐关系，剩余"+responce['count']+",处理中...";
					$scope.checkUsersRelation();
				}
			});
		}
		$scope.checkUsersLevel = function(){
			alert(1);
		}
		$scope.checkUsers();
		
	}
	$scope._checkUserDatas = function(){
		$req.g('Users','checkDatas',{'start':1}).success(function(responce){
		 
			if(responce['status'] == 1){
				$scope.recordsLoading = '0';
				$scope.noticAction = 'refresh';
			}else{
				//$scope._checkDatas();
			}
		});
	}
	$scope.columns2 = [
		{
			selectid : 'id',
			width:'30px',
		},
		{
			title:'工号',
			html:'{{id}}',
			search:{
				type:'text',
				mode:'like',
				field:'id',
				title:'请输入工号'
			}
		},
		{
			title:'姓名',
			html:'{{name}}',
			search:{
				type:'text',
				mode:'like',
				field:'name',
				title:'请输入姓名'
			}
		},
		{
			title:'身份证',
			html:'{{idcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'idcard',
				title:'请输入身份证'
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
			title:'推荐人身份证',
			html:'{{recommend_idcard}}',
			search:{
				type:'text',
				mode:'like',
				field:'recommend_idcard',
				title:'请输入推荐人身份证'
			}
		},
		{
			title:'关系',
			html:'{{uprelation}}',
			search:{
				type:'text',
				mode:'like',
				field:'uprelation',
				title:'请输入关键字'
			}
		}, 
		{
			title:'状态',
			html:'{{datastatus}}',
			width:'200px',
			search:{
				type:'select',
				field:'errormsg',
				data:{'success':'验证通过','error':'验证未通过'},
				title:'请选择',
			}
		},
		{
			title:'错误信息',
			html:'{{datamsg?datamsg:"<b>验证通过</b>"}}',
			width:'200px',
			search:{
				type:'select',
				field:'errormsg',
				data:{'success':'验证通过','error':'验证未通过'},
				title:'请选择',
			}
		},
		 
		{
			title:'操作',
			html:'<a href="javascript:;" click="editUserDetail(\'{{id}}\')" class="btn btn-xs default"><i class="fa fa-search"></i> 编辑</a>',
			search:'operation',
			width:'100px'
		}
	];
	 
}]);
app.controller('job_add', ['$scope','$req','$timeout','$staticData',function($scope,$req,$timeout,$staticData) {
	$scope.formData = {};
	$scope.formData['sex'] = 1;
	$scope.formData['idcard'] = '';
	$scope.formData['rank_id'] = 1;
	$scope.formData['xueli'] = '0';
	$scope.formData['bank'] = '0';
	$scope.formData['peixun'] = '0';
	$scope.formData['peixunprice'] = '100';
	$scope.formData['dixin'] = 0;
	$scope.onSelChange = function(data){
 
	};
	$scope.ranks = $staticData.g('rank'); 
	$scope.relations = {};
	$scope.$watch("formData.recommend_jobnumber",function(newValue,oldValue){
		if(newValue){
			
			$scope.getRelation();
		}
	});
	$scope.$watch("formData.rank_id",function(newValue,oldValue){
		if(newValue){
			$scope.getRelation();
		}
	});
	$scope.getRelation = function(jobnumber){
		if(!$scope.formData.recommend_jobnumber) return;
		
		$req.g('Users','getRelation',{'jobnumber':$scope.formData.recommend_jobnumber,'rank_id':$scope.formData.rank_id}).success(function(responce){
			$scope.relations = responce;
			cl(responce);
		});
	}
	//$scope.onSelChange = '123';
	$scope.subForm = function(){
		var params = $scope.formData;
 
		$req.FH('Users','rsave',params);
	}
	$scope.inExcel = function(path){
		 
		$req.g('Tools','excelJobAdd',{'path':path}).success(function(responce){
			showMsg({'type':'ok','msg':'导入完成!'});
		});
	}
 
	$scope.excelIn = function(){
		//$("#excelIn").modal();
		
	}
}]);


app.controller('uploadBox',function($scope,FileUploader,$rootScope){
	$scope.type = '1';
	var uploader = $scope.uploader = new FileUploader({
       url : '?m=Manager&c=Upload',
    });

	$scope.$watch('uploader.progress',function(newValue){
		$scope.progress = (newValue);
	});
	$scope.progress = 0;
	uploader.onSuccessItem = function(fileItem, response, status, headers) {
		var hashKey = fileItem['$$hashKey'];
	    for(var i in uploader.queue){
			var v = uploader.queue[i];
			if(v['$$hashKey'] == hashKey){
				uploader.queue[i]['path'] = response['path'];
			}
		}
	};
	$scope.uploadBtnClick = function(){
		if($scope.type == 1){
			$("#btn_uploadBox1").trigger('click');
		}
	}
	uploader.onProgressItem = function(fileItem, progress) {
	   $scope.progress = progress;
	};
	$scope.callback = function(){
		
		var paths = [];
		for(var i in uploader.queue){
			var v = uploader.queue[i];
			paths.push(v['path']);
		}
		var args = {'paths':paths.toString()};
		
		$rootScope.uploadBox.callback(args);
 
	}
});

app.controller('pledge_back', function($scope,$req,$stateParams,settings,$staticData) {
	$scope.formData = {};
	$scope.formData['amount'] = 0;
	$scope.formData['type'] = 'pledge';
	$scope.formData['msg'] = '退还押金'+$scope.formData['amount']+"元";
	$scope.formData.backdate = '';
	$scope.$watch("formData['amount']",function(val){
		$scope.formData['msg'] = '退还押金'+val+"元,退款时间:"+$scope.formData.backdate;
 
	});
	$scope.$watch("formData['backdate']",function(val){
 
		$scope.formData['msg'] = '退还押金'+$scope.formData.amount+"元,退款时间:"+val;
	 
	});
	$scope.subForm = function(){
 
		if(!parseFloat($scope.formData['amount'])){
			showMsg({'type':'error','msg':'请输入退款金额'});
			return;
		}
		if(!parseInt($scope.formData['user_id'])){
			showMsg({'type':'error','msg':'请选择退款代理人'});
			return;
		}
 
		var params = $scope.formData;
		$req.FH('MoneyLog','manual',params);
	}
});
app.controller('bouns_conf', function($scope,$req,$stateParams,$staticData) {
	$scope.id = $stateParams.id;
	$scope.formData = {'rules':[]};
	$scope.ranks = $staticData.g('rank');
	
	$req.g('Bonus','getOne',{id:$scope.id}).success(function(responce){ 
		$scope.formData = responce;
		$scope.formData.rules = [];
		if(!$scope.formData.conf.rules){
			//$scope.formData.rules = [];
		} 
	});
	
	$scope.addRules = function(){
		$scope.formData.conf.rules.push({});
	}
	
	$scope.subForm = function(){
		
		var params = $scope.formData;
 
		$("[rules]").each(function(){
			var k = $(this).attr('k');
			var name = $(this).attr('name');
			 
			if(!params['rules'][k]) params['rules'][k] = {};
			
			params['rules'][k][name] = $(this).val();
		});
		if(!params['conf']) params['conf'] = {};
		params['conf']['rules'] = {};
		params['conf']['rules'] = params['rules'];
	 
		$req.FH('Bonus','rsave',params);
	}
});

app.controller('insurance_add', ['$scope','$req','$stateParams',function($scope,$req,$stateParams) {
	$scope.formData = {'sex':1};
	$scope.fyp = $scope.yongjin = 0;
	if($stateParams.id){
		$req.g('InsuranceList','getOne',{id:$stateParams.id}).success(function(responce){

			$scope.formData.id = $stateParams.id;
			$scope.formData = responce;
			$scope.bxlist = responce['detail'];
			$scope.parseNum();
		});
	}
	$scope.$watch('formData.product_id',function(newValue,oldValue){
		if(newValue) $scope.initPrice();
		
	});
	$scope.$watch('formData.price',function(newValue,oldValue){
		if(newValue) $scope.initPrice();
	});
	//取得fyp系数
	$req.g('Config','gs',{'ids':'fyp_per'}).success(function(responce){
		$scope.formData['fyp_per'] = responce['fyp_per'];
	});
	$scope.subForm = function(){
		var v= $("[name='nobonus']:checked").val();
		v = v ? v : 0;
		$scope.formData['nobonus'] = v;
		$scope.formData['bandanlist'] = {};
 
		for(var i in $scope.bxlist){
			$scope.formData['bandanlist'][i] = $scope.bxlist[i];
		}
 		
		var params = $scope.formData;
		$req.FH('InsuranceList','rsave',params);
	}
	
	$scope.initPrice = function(){
 
		var d = $req.g('Product','getOne',{id:$scope.formData.product_id}).success(function(responce){
			$scope.fyp = parseFloat($scope.formData.price * responce.fyp / 100).toFixed(2);
			$scope.fyp = $scope.fyp == 'NaN' ? 0 : $scope.fyp;
			$scope.yongjin = parseFloat($scope.formData.price * responce.per / 100).toFixed(2);
			$scope.yongjin = $scope.yongjin == 'NaN' ? 0 : $scope.yongjin;
		});;
		 
	}
	$scope.change = function(args){
 
	}
	$scope.bxlist = {};
	//添加保险
	$scope.addbx = function(){
		if(!$scope.formData.product_id && !$scope.formData.fujia_id){
			alert('请选择主险或附加险');
		}else{
			 
			if($scope.formData.product_id){
				$req.g('Product','getOne',{'id':$scope.formData.product_id}).success(function(responce){
					$scope.formData.product_id = 0;
					$scope.initBxTr(responce);
				});
			}
			if($scope.formData.fujia_id){
				$req.g('Product','getOne',{'id':$scope.formData.fujia_id}).success(function(responce){
					$scope.formData.fujia_id = 0;
					$scope.initBxTr(responce);
				});
			}
		}
		
	}
	$scope.initBxTr = function(v){
		if(v.type == 1) v['type_name'] = '主险';
		if(v.type == 2) v['type_name'] = '附加险';
		v['amount'] = 0;
		$req.g('Company','getOne',{'id':v.company_id}).success(function(responce){
			var d = responce;
			v['company_name'] = d['name'];
			var id = randomstr();
			$scope.bxlist[id] = v;
		}); 
	}
	$scope.persum = $scope.fypsum = 0;
	$scope.bxlistChange = function(k,amount){
		
		var v = $scope.bxlist[k];
		$scope.bxlist[k]['amount'] = amount;
		$scope.bxlist[k]['per_detail'] = amount * v.per / 100;
		$scope.bxlist[k]['fyp_detail'] = amount * v.fyp / 100;
		
		$scope.parseNum();
	}
	$scope.parseNum = function(){
		$scope.persum = $scope.fypsum = 0;
		for(var i in $scope.bxlist){
			$scope.persum += parseFloat(typeof $scope.bxlist[i]['per_detail']=='undefined'?0:$scope.bxlist[i]['per_detail']);
			$scope.fypsum += parseFloat(typeof $scope.bxlist[i]['fyp_detail']=='undefined'?0:$scope.bxlist[i]['fyp_detail']);
		}
	}
	$scope.getBxName = function(){
	 
	}
	$scope.bxlistSelChange = function(k){
		var v = $scope.bxlist[k];
		var year = parseInt(v.year);
		var data = {};
		 
		for(var i in v['config']){
			var vv = v['config'][i];
			if(year == parseInt(vv['year'])) data = vv;
			 
		}
		$scope.bxlist[k]['year'] = data['year'];
		$scope.bxlist[k]['per'] = data['per'];
		$scope.bxlist[k]['fyp'] = data['fyp'];
		$scope.bxlist[k]['xuyong'] = data['xuyong'];
		$scope.bxlistChange(k,$scope.bxlist[k]['amount'])
	 
	}
	$scope.bxlistRemove = function(k){
		delete $scope.bxlist[k]  ;
 
		$scope.parseNum();
	}
	//$scope.formData.product_id = 33;
	//$scope.formData.fujia_id = 30;
	//$scope.addbx();
}]);
app.controller('setting_account', ['$scope','$req',function($scope,$req) {
	$scope.formData={};
	var params = {'ids':'fyp_per,account_day,valid_user,active_user'};
 
	$req.g('Config','gs',params).success(function(responce){
		$scope.formData['ids'] = responce;
	});
	$scope.subForm = function(){
		var params = $scope.formData;
		$req.FH('Config','ss',params);
	}
}]);
 
 




app.controller('assess_conf', ['$scope','$req',function($scope,$req) {
	var params = {};
	$scope.formData = {};
	$req.g('Rank','gs',params).success(function(responce){
		$scope.formData = responce;
 
	});
	$scope.subForm = function(){
		var params = $scope.formData;
		$req.FH('Rank','ss',params);
	}
}]);
 
app.controller('pageHeader', function($scope,$req) {
	//取得菜单名
	var title = $(".sub-menu>.active>a").html();
	if(!$scope.pageTitle) $scope.pageTitle = title;
	
	//nav1
	var nav1 = {};
	var a = $(".open>a");
 
	nav1['title'] = a.find('.title').html();
	nav1['class'] = a.children().eq(0).attr('class');
	$scope.nav1 = nav1;
	//nav2
	
});




app.controller('msgbox', function($scope,$req,$stateParams,$staticData,$route) {
	$scope.back = function(){
		  history.back();
	}
	$scope.reload = function(){
		location.reload();
	}
});























