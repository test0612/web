/***
GLobal Directives
***/
var app = MetronicApp;

MetronicApp.directive('polarUpload',function($req,$timeout,$staticData,$parse,$rootScope){
	return{
		scope : {
			'callback' :'&callback',
		},
		restrict : 'AECM',
		replace: true,
		link : function($scope,iElement){
			 
			var html = '';
			var id = "uploadBox";
			
			var toolbody = '';
			$rootScope.uploadBox = {
				'callback':function(args){
					 
					$scope.callback({'args':args});
 
					//$scope.callback({'args':args});
				},
				'test':1,
			}; 
			$(iElement).click(function(){
				$("#"+id).modal();
			});
			return;
			$timeout(function(){
				$("#"+id).modal();
			},200);
		},
	}
});

MetronicApp.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
 
        return {
            link: function(scope, element, attrs) {
				
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });
				
                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
	 
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        Metronic.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a',
    function() {
        return {
            restrict: 'E',
            link: function(scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function(e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
});
function randomstr(len) {
　　len = len || 32;
　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
　　var maxPos = $chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
　　}
　　return pwd;
}
String.prototype.replaceAll = function(s1,s2){ 
 
	return this.replace(new RegExp(s1,"gm"),s2); 
}
MetronicApp.directive('ngPageNav',function($req){
	return{
		
		template:'<div class="page-bar ng-scope">'
	+'<ul class="page-breadcrumb">'
		+'<li>'
			+'<i class="fa fa-home"></i>'
			+'<a href="#/dashboard"> 主页</a>'
			+'<i class="fa fa-angle-right"></i>'
		+'</li>'
		+'<li>'
		+	'<i class="{{nav1class}}"></i><a href="javascript:void(0);"> {{nav1title}}</a>'
		+'</li>'
	+'</ul>'
	+'<div class="page-toolbar">'
	+'<div class="btn-group pull-right" style="display:none">'
		+	'<button type="button" class="btn btn-sm btn-default dropdown-toggle hover-initialized" data-toggle="dropdown" data-hover="dropdown" data-delay="1000" data-close-others="true"> Actions <i class="fa fa-angle-down"></i>'
			+'</button>'
			+'<ul class="dropdown-menu pull-right" role="menu">'
			+	'<li>'
				+	'<a href="#">'
				+	'<i class="icon-user"></i> New User </a>'
				+'</li>'
				+'<li>'
				+	'<a href="#">'
				+	'<i class="icon-present"></i> New Event <span class="badge badge-success">4</span>'
				+	'</a>'
				+'</li>'
				+'<li>'
				+	'<a href="#">'
				+	'<i class="icon-basket"></i> New order </a>'
				+'</li>'
				+'<li class="divider">'
				+'</li>'
				+'<li>'
				+	'<a href="#">'
				+	'<i class="icon-flag"></i> Pending Orders <span class="badge badge-danger">4</span>'
				+	'</a>'
				+'</li>'
				+'<li>'
				+	'<a href="#">'
				+	'<i class="icon-users"></i> Pending Users <span class="badge badge-warning">12</span>'
				+	'</a>'
				+'</li>'
			+'</ul>'
		+'</div>'
	+'</div>'
+'</div>'
+'<h3 class="page-title">'
	+'{{h3title}}'
+'</h3>',
		restrict:'AECM',
		scope:{
			'nav1title':'@',
			'nav1class':'@',
			'h3title':'@',
		},
		controller:function($scope,$timeout,$staticData){
			
			if(!$scope.nav1title){
				$timeout(function(){
					 
					var a = $(".open>a");
					$scope.nav1title = a.find('.title').html();
					 
					$scope.nav1class = a.children().eq(0).attr('class');
					if(!$scope.h3title){
						$scope.h3title = $(".sub-menu>.active>a").html();
					}
				},200);
			}
			
			
 
		}
	}
});
MetronicApp.directive('ngLdatepicker',function($req,$timeout){
	return{
		scope:{
			'id':'@',
			'default':'@',
			test:'@',
			readonly :'@',
		},
		require:'ngModel',
		restrict:'AECM',
		replace: true,
		template:"<input  data-date-format=\"{{format}}\"  value='{{value}}' {{readonlystr}} id='id{{$id}}' class=\"form-control form-control-inline input-medium  \" size=\"16\" type=\"text\" >",
		controller : function($scope,$element){ 
			$scope.format = "yyyy年mm月dd日";
 			$scope.value = $scope.default;
 			$scope.readonlystr = $scope.readonly ? "readonly=1" : "";
			$scope.init = function(){
				cl($scope.readonly);
				if($scope.readonly == 1) return;
				$element.datepicker({
					rtl: Metronic.isRTL(),
					orientation: "left",
					autoclose: true, 
				});
				$($element).datepicker('setStartDate', '2012-01-01');
			}
			$timeout(function(){
				$scope.init();
			},200);
			 
		}
	}
	
});

MetronicApp.directive('polarSelect',function($req,$timeout,$staticData,$parse){
	return{
		scope : {
			'key':'@',
			'val':'@',
			'mod':'@',
			'map':'@',
			'optgroup':'@',
			'placeholder':'@',
			'ngModel':'@',
			'change':'&change',
			'static':'@',
			'getdata':'&getdata',
		},
		restrict : 'AECM',
		replace: true,
		template:"<select id='id{{$id}}' class='form-control select2' ng-bind-html='tpl|trusted' ></select>",
		controller:function($scope){
			$scope.data = {};
			$scope.tpl = '';
			$scope.per = $scope.fyp = 0;
			//$scope.tpl = "<select class='form-control select2'><option ng-repeat='(k,v) in data' value='{{k}}'>{{v}}</option></select>";
			$scope.data = {};
			
			
			$scope.parseTpl = function(){
				var data = $scope.data;
				$scope.tpl = '';
				if($scope.placeholder){
					$scope.tpl += "<option value=0>"+$scope.placeholder+"</option>";
				}
				
				for(var i in data){
					 
					var v = data[i];
					
					var val = $scope.val;
 
					for(var ii in v){
						val = val.replace('['+ii+']',v[ii]);
					}
			 
					$scope.tpl += "<option value='"+v.id+"'>"+val +"</option>";
				}
				 
			}
 
			$scope.onchange = function(){
				
				$("#id"+$scope.$id).bind('change',function(){
					 
					for(var i in $scope.data){
						var v = $scope.data[i];
						
						if(v[$scope.key] == $(this).val()){
							if($scope.change){
								var fn = $parse($scope.change);
								fn('1123');
							}
						}
					}
				});
			}
			$timeout(function(){
				$scope.onchange();
			},300);
			 
			if($scope['static'] == 1){
				$scope.data = $staticData.getData($scope.mod);
 
				$scope.parseTpl();
			}else{
				var params = {};
				var arrr = ['map','key','val','mod'];
				for(var i in arrr){
					params[i] = $scope[i];
				}
				$req.g($scope.mod,'polarSelect',params).success(function(responce){
					$scope.data = responce['data'];
 
					$scope.parseTpl();
				});
			}
		}
	}
});
MetronicApp.directive('ngLselect',function($req){
	return{
		scope : {
			'name':'@',
			'kname':'@',
			'vname':'@',
			'value':'@',
			'mod':'@',
			'map':'@',
		},
		restrict : 'AECM',
		replace: true,
		template:"<select class='form-control select2'><option ng-repeat='(k,v) in data' value='{{k}}'>{{v}}</option></select>",
		controller:function($scope){
			
			$scope.data = {};
			$req.g($scope.mod,'makeSelect',{kname:$scope.kname,vname:$scope.vname,map:$scope.map}).success(function(responce){
				$scope.data = responce;
			});
		}
	}
});
MetronicApp.directive('ngSearchInput',function($timeout,$req){
	return {
		scope:{
			'placeholder':'@',
			'm':'@',
			'likekey':'@',
			'format':'@',
			'name':'@',
			'join':'@',
			'field':'@',
			'bind':'=',
			'getresult':'&getresult',
			'map':'@',
			'key':'@',
			'pk':'@',
		},
		restrict : 'AECM',
		require:'^ngModel',
		link : function($scope,$element,$attr,$ngModel){
			$scope.id = randomstr(); 
			$ngModel.$render = function(){ 
                if($ngModel.$modelValue){
					cl($ngModel.$modelValue);
					$req.g('Users','getOne',{id:$ngModel.$modelValue}).success(function(responce){
						cl(responce);
					});
					var format = '';
					for(var i in data){
						var v = data[i];
 
						format = format.replace('['+i+']',v);
					}
                    $scope.value = ctrl.$modelValue;
                }
            }
			$scope.init = function(){
 
				var val = $("#a"+$scope.$id).val();
				$("#a"+$scope.$id).select2({
					
					placeholder: $scope.placeholder,
					minimumInputLength: 1,
 
					ajax: {  
						url : '?m=Manager&c=Data&a=g' + "&_m="+$scope.m+"&_a=ajaxList",
						dataType: 'json',
						data: function (term, page) {
 
							return {
								likekey: $scope.likekey, // search term
								q:term,
								join:$scope.join,
								page_limit: 10,
								field:$scope.field,
								map:$scope.map,
							};
						},
						results: function (data, page) {
							 
							return {
								
								results: data
							};
						}
					},
					initSelection: function (element, callback) {
						 
						 
						var id = $(element).val();
						 
						if (id && parseInt(id) > 0) {
							$.ajax({
								url : "?m=Manager&c=Data&a=g&_m="+$scope.m+"&_a=getOne",
								dataType: 'json',
								type:'POST',
								data :{
									'_a':'getOne',
									'id':id,
								},
							}).done(function(responce){
								cl(responce);
								if($scope.pk) $ngModel.$setViewValue(responce[$scope.pk]); 
								callback(responce);
							});
							/*
							$.ajax("http://api.rottentomatoes.com/api/public/v1.0/movies/" + id + ".json", {
								data: {
									apikey: "ju6z9mjyajq2djue3gbvv26t"
								},	
								dataType: "jsonp"
							}).done(function (data) {
								callback(data);
							});
							*/
						}
					},
					formatResult: function(data){
						format = $scope.format;
		 
						 
						for(var i in data){
							var v = data[i];
 
							format = format.replace('['+i+']',v);
						}
						return format;
					}, // omitted for brevity, see the source of this page
					formatSelection: function(data){
						 
						if($scope.getresult) $scope.getresult({data:data});
						return this.formatResult(data);
						return data[$scope.name];
					}, // omitted for brevity, see the source of this page
					dropdownCssClass: "bigdrop", // apply css that makes the dropdown taller
					escapeMarkup: function (m) {
						return m;
					} // we do not want to escape markup since we are displaying html in results
				});
			}
			$timeout(function(){
				$scope.init();
			},300);
 
			
		},
		replace: true,
		template: '<input type="text" id="a{{$id}}" class="form-control select2">',
	}
});
MetronicApp.directive('ngs',
    function() {
        return {
            restrict: 'E',
            link: function(scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function(e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
});
app.directive('ngModal',function(){
	return {
		scope:false,
		link : function($scope,$element){
			cl($scope.columns1);
		}
	}
});
app.directive('ngDataTable',
	function(){
		return {
			restrict: 'AECM',
			scope:{
				'mod':'=mod',
				'ftitle':'@',
				'oper':'=',
				'func':'@',
				'tpl':'@',
                'columns':'=',
				'postparams':'=',
				'test':'@',
				'fields':'@',
				'funcs':'=',
				'postfunc':'@',
				'noticAction':'=',
				'test':'@',
				'actions':'=',
				'title':'@', 
			},
			templateUrl:function($scope,iElement,attrs){
				return viewurl('tools.datatable');
			},
			controller:['$scope','$element','$req','$compile','$timeout','$parse',function($scope,$element,$req,$compile,$timeout,$parse){
				//初始化Checkbox   
				$scope.selectids = [];
				$scope.checkAll = function(){
					var checkAllStatus = 0;

					if($("[checkAll]").is(':checked')){
						checkAllStatus = 1;
					}else{
						checkAllStatus = 0;
					}
					$("[checkitem]").each(function(){
						if($(this).is(':checked')){
							if(!checkAllStatus){
								$(this).prop('checked',false);
							}
						}else{
							if(checkAllStatus){
								$(this).prop('checked',true);
							}
						}
					});
					
				}
				$scope.initCheckbox = function(){
					$scope.selectids = [];
					$("[checkitem]").bind('click',function(){
						var selectids = [];
						 
						$("[checkson]").each(function(){  
							if($(this).is(':checked')){
								selectids.push($(this).val());
							}
						});
						$scope.selectids = selectids; 
						$scope.$apply(); 
					});
				}
				//初始化参数

				$scope.$watch('noticAction',function(action){
 					 
					if(action == 'refresh'){
						$scope.noticAction = '';
						$scope.getData();
					}
				});
				$scope.actionsSelect = 'none';
				function findtr(obj){
					if($(obj)[0].tagName == 'undefined') return; 
					if($(obj)[0].tagName == 'TR'){
						return $(obj);
					}
					return findtr($(obj).parent());
				}
				$scope.operSubmit = function(){
					var action = $element.find('#actionsSelect').val(); 
					if($scope.selectids.length <= 0) return;
					//Excel导出
					if(action == 'excelOut'){ 
						var content = [];
						var data = {};
						var inids = [];
						tr0 = {};
						for(var j in $scope.columns){
							var col = $scope.columns[j]; 
							if(col['title'] == '操作') continue;
							if(col['title']){
								inids.push(j);
								tr0[j] = col['title'];
							}
						}
						data[0] = tr0;
						
						var row = 1;
						for(var i in $scope.selectids){
							var v = $scope.selectids[i]; 
							var checkbox = $("[checkitem='"+v+"']"); 
							var tr = findtr(checkbox);
							var d = {};
							for(var j in data[0]){
								d[j] = tr.children().eq(j).html();

							}
							data[row] = d;
							row++;
						}
					 	$req.g('Tools','excelOut',{data:data}).success(function(responce){

					 		if(responce['status'] == 1){
					 			location.href = (responce['url']);
					 		}
					 	});
					}else{
						$scope.loading.status = 1;
						$req.g($scope.mod,'operAction',{'sel':action,'ids':$scope.selectids}).success(function(responce){
							if(responce['status'] == 0){
								cl(123);
								showMsg({'type':'error','msg':responce['msg']});
							}
							$scope.getData();
						});
					}
					
				} 
				$timeout(function(){
					$('.date-picker').datepicker({
						rtl: Metronic.isRTL(),
						orientation: "left",
						autoclose: true
					});		
				},500);
				 
				$scope.length = 10;
				$scope.resultStatus = '读取中...';
				$scope.start = 0;
				$scope.page = 1;
				 
				$scope.data = {};
				
				$scope._a = $scope.postfunc ? $scope.postfunc : 'ajaxTable';
				
				$scope.data.count = 0;
				$scope.postparams = $scope.postparams ? $scope.postparams : {};
				$scope.allPage = 0;
				$scope.search = {};
				//页码范围
				$scope.pageArr = [10,20,50,100,500];
				//初始化Loading
				$scope.loading = {};
				//翻页
				$scope.changePages = function(page){
					if($scope.loading.status == 1) return;
					if(page == $scope.page) return;
					if(page == 'next'){
						$scope.page++;
					}
					if(page == 'prev'){
						$scope.page--;
					}
					if($scope.page <= 0) $scope.page = 1;
					$scope.getData();
				}
				//每页条数
				$scope.changeLength = function(){
					$scope.getData();
				}
				$scope.loading.left = $element.width() / 3;
				$scope.loading.top = '100';
		 		cl($scope.funcs);
				$scope.getData = function(){
			 
					$scope.loading.status = 1;
					$scope.postparams['start'] = $scope.start;
					$scope.postparams['length'] = $scope.length;
					$scope.postparams['page'] = $scope.page;
					$scope.postparams['fields'] = $scope.fields;
					//添加搜索数据
					$element.find(".form-filter").each(function(){
 
						$scope.postparams[$(this).attr('name')] = $(this).val();
					});
 
					$req.g($scope.mod,$scope._a,$scope.postparams,{'parse_str':1}).success(function(responce){
						$scope.loading.status = 0;
						$scope.data = responce;
						
						$scope.allPage = parseInt(Math.ceil($scope.data.count / $scope.length));
						$scope.noPrev = $scope.noNext = 0;
						if($scope.page == 1) $scope.noPrev = 1;
						if($scope.page == $scope.allPage) $scope.noNext = 1;
						if($scope.data.count == 0) $scope.resultStatus = '没有有效数据'; 
						$timeout(function(){
		 
							var nc = $element.find('#dataTbody').find('[ng-click]');
							nc.each(function(){
	 
								$compile(this)($scope);
							});
							//初始化check
							 
							$scope.initCheckbox();
							//绑定click
							$("[click]").click(function(){
								var c = $(this).attr('click');
								var f = (c.substr(0,c.indexOf("(")));  
								eval("$scope.funcs."+c);
							});
							 
							 
						},500);
					});
				}
			 
				
				
				$scope.onclick = function(){
					var args = [];
					for(var i in arguments){
						if(i>0){
							args.push(arguments[i]);
						}
					}
					if($scope.funcs[arguments[0]]){
						var fn = $parse($scope.funcs[arguments[0]]);
						fn(arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);
					}
					 
				}
				
				$scope.submitFilter = function(){
					$scope.page = 1;
					$scope.getData();
				}
 
				$scope.getData();
			}],
		}
	}
);
 
app.directive('fgInputText',function($req){
	return {
		require: "ngModel",
		restrict : 'AEMC',
		template:'<div class="form-group form-md-line-input"><label class="col-md-3 control-label" for="form_control" style="color:#000000"> {{title}} <span class="required" ng-if="must">*</span></label><div class="col-md-9"> <input type="text" id="obj"  class="form-control" {{readonlystr}} placeholder="" value="{{value}}" text name="name"> <div class="form-control-focus"> </div> <span class="help-block">{{text}}</span></div></div>',
		scope : {
			title : '@',
			text:'@',
			must:'@',
			readonly:'@',
		},
		require:'ngModel',
		link:function($scope,$element,attr,ctrl){
			var obj = $element.find('#obj');
			$scope.value = '';
			ctrl.$render = function(){
				if(ctrl.$modelValue){
					$scope.value = ctrl.$modelValue;
				}
			}
 
			obj.bind('change',function(){
				ctrl.$setViewValue($element.find('[text]').val())
			});
			if($scope.readonly){
				obj.attr('readonly',true);
			}
		}
	}
});
app.directive('fgInputSelect',function($req){
	return {
		require : 'ngModel',
		restrict : 'AEMC',
		template : '<div class="form-group"> <label class="control-label col-md-3">{{title}}</label> <div class="col-md-9"><select id="obj" class="form-control"><option value="{{k}}"ng-repeat="(k,v) in data">{{v}}</option></select></div></div>',
		scope : {
			title : '@',
			data : '=',
		},
		link:function($scope,$element,$attr,$ctrl){
			var obj = $element.find('#obj');
			 
			$ctrl.$render = function(){
				if($ctrl.$modelValue){
					var a = $ctrl.$modelValue;cl(a);
					obj.val(a);
				}
			}
			obj.bind('change',function(){
				$ctrl.$setViewValue($(this).val());
			});
		}
	}
});
app.directive('fgInputDate',function($req,$filter,$timeout){
	return {
		require: "ngModel",
		restrict : 'AEMC',
		template:'<div class="form-group"> <label class="control-label col-md-3">{{title}}</label> <div class="col-md-9"> <div id="id{{ $id }}" class="input-group date form_datetime"  data-date-format="{{timeFormat}}" date-date="{{value}}"> <input  readonly class="form-control" value="{{value}}" size="16" type="text"  > <span class="input-group-btn"> <button class="btn default date-reset" type="button"> <i class="fa fa-times"></i> </button> <button class="btn default date-set" type="button"> <i class="fa fa-calendar"></i> </button> </span> </div> </div> </div>',
		scope : {
			title : '@',
			text:'@',
			must:'@',
		},
		require:'ngModel',
		link:function($scope,$element,attr,ctrl){

			$scope.timeFormat = "yyyy年mm月dd日";
			$element.bind('change',function(){
				ctrl.$setViewValue($element.find('[text]').val())
			});
			$scope.value = '';
			ctrl.$render = function(){ 
				if(ctrl.$modelValue){
					var a = ctrl.$modelValue; 
					a = $filter('date')(a*1000,"yyyy年MM月dd日");
					$scope.value = a;
				}
			}
			$scope.init = function(){
				$('#id'+$scope.$id).datepicker({
					rtl: Metronic.isRTL(),
					orientation: "left",
					autoclose: true
				});			
			}
			$timeout(function(){
				$scope.init();
			},200);
 
		}
	}
});

app.directive('fgUpload',function(FileUploader){
	return {
		restrict : 'A',
		templateUrl : function(){
			return viewurl('tools.fg-upload');
		},
		scope:{
			files :'=',
			filetype:'@',
		},
		link : function($scope,$element,$attr){
			//按钮
			var upload1 = $element.find('#btn_uploadBox1');
 
			$scope.selectFile = function(){
				upload1.trigger('click');
			}
		},
		controller : function($scope, FileUploader){

			var uploader = $scope.uploader = new FileUploader(
        	{
            	 url : '?m=Manager&c=Upload',
        	});
        	uploader.filters.push(
        	{
        		name: 'customFilter',
        		fn: function(item /*{File|FileLikeObject}*/ , options)
        		{
        			return this.queue.length < 10;
        		}
        	});
        	// CALLBACKS
       		uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options)
        	{

            	//console.info('onWhenAddingFileFailed', item, filter, options);
        	};
       		uploader.onAfterAddingFile = function(fileItem,a)
        	{
        		if(!$scope.filetype) return;
        		var filename = fileItem.file.name;
        		var hz = filename.split('.');
        		hz = hz[hz.length-1];
        		var hzs = $scope.filetype.split(',');
        		var no = 1;
        		for(var i in hzs){
        			var v = hzs[i];
        			if(v == hz) no = 0;
        		}
        		if(no){
        			for(var i in uploader.queue){
        				 
        			}
        		}
            	//console.info('onAfterAddingFile', fileItem);
        	};
        	uploader.onAfterAddingAll = function(addedFileItems)
        	{
        		cl(1);
           	// console.info('onAfterAddingAll', addedFileItems);
        	};
        	uploader.onBeforeUploadItem = function(item)
        	{

           		// console.info('onBeforeUploadItem', item);
        	};
        	uploader.onProgressItem = function(fileItem, progress)
        	{
           	// console.info('onProgressItem', fileItem, progress);
        	};
        	uploader.onProgressAll = function(progress)
        	{
        		// console.info('onProgressAll', progress);
        	};
        	uploader.onSuccessItem = function(fileItem, response, status, headers)
        	{
            	//console.info('onSuccessItem', fileItem, response, status, headers);

            	var hashKey = fileItem['$$hashKey'];
	    		for(var i in uploader.queue){
					var v = uploader.queue[i];
					if(v['$$hashKey'] == hashKey){

						uploader.queue[i]['path'] = response['path'];
					}
				}
				$scope.ansy();
        	};
        	uploader.onErrorItem = function(fileItem, response, status, headers)
        	{
        		// console.info('onErrorItem', fileItem, response, status, headers);
        	};
       		uploader.onCancelItem = function(fileItem, response, status, headers)
        	{
            	//console.info('onCancelItem', fileItem, response, status, headers);
        	};
        	uploader.onCompleteItem = function(fileItem, response, status, headers)
        	{

            	//console.info('onCompleteItem', fileItem, response, status, headers);
        	};
        	uploader.onCompleteAll = function()
        	{
            	console.info('onCompleteAll');
        	};
        	$scope.ansy = function(){
        		$scope.files = [];
        		for(var i in uploader.queue){
        			var v = uploader.queue[i];
        			var r = {};
        			r.url = v['path'];
        			r.size = (v['file']['size'] / 1024 / 1024).toFixed(2);
        			r.filename = v.file.name;
        			$scope.files.push(r);
        		}  
        	}
        	 
		}
	}
});
app.directive('fgCheckbox',function($req,$staticData,$timeout){
    return {
        require: "ngModel",
        restrict : 'AEMC',
        template:'<div class="form-group form-md-line-input "><label class="col-md-2 control-label" for="form_control" > {{label}} <span class="required" ng-if="must">*</span></label><div class="col-md-10 md-checkbox-inline"  > <div class="md-checkbox has-success" ng-if="all"> <input type="checkbox" ng-model="selectid.all" name="all" value="all" id="checkboxall" class="md-check"> <label for="checkboxall"> <span></span> <span class="check"></span> <span class="box"></span> {{all}}</label>  </div> <div class="md-checkbox has-success" ng-repeat="(k,v) in data"> <input type="checkbox" ng-model="selectid[k]" value="{{k}}" id="checkbox{{$id}}{{k}}"   class="md-check"> <label for="checkbox{{$id}}{{k}}"> <span></span> <span class="check"></span> <span class="box"></span> {{v}}</label>  </div></div> <span class="help-block">{{text}}</span></div></div>',
        scope : {
            title : '@',
            text:'@',
            must:'@',
            data:'=',
            all:'@',
            label:'@', 
        },
        transclude:true,
        require:'ngModel',
        link:function($scope,$element,attr,ctrl){ 
            $scope.title = $scope.title ? $scope.title : $scope.label; 
            $scope.value = '';
            $scope.checksid = "ckitem"+$scope.$id;
            $scope.selectid = {};
            for(var i in $scope.data){
                var v = $scope.data[i];
                $scope.selectid[i] = false;
            }
            ctrl.$render = function(){
                if(ctrl.$modelValue){ 
                    var values = ctrl.$modelValue;
                    values = values.split(',');
                    var hasAll = false; 
                    var c = ctrl.$modelValue.split(','); 
                    for(var i in c){
                        if(c[i] == 'all') hasAll = true;
                        $scope.selectid[c[i]] = true;
                    }
                    if(hasAll){
                        $scope.selectid['all'] = true;
                        for(var i in $scope.data){ 
                            $scope.selectid[i] = true;
                        }
                    } 

                }
            }

            $element.bind('click',function(){
                
                if($scope.all){

                    $timeout(function(){ 
                        if($scope.selectid['all']){
                            for(var i in $scope.selectid){
                                $scope.selectid[i] = true;
                            }
                        } 
                    },200);
                } 
                $timeout(function(){
                    $scope.result = [];
                    if($scope.selectid['all']){
                        $scope.result = 'all';
                    }else{
                        for(var i in $scope.selectid){
                            var v = $scope.selectid[i];
                            if(v) $scope.result.push(i);
                        }
                        $scope.result = $scope.result.toString();
                    }
                    
                    $scope.model = $scope.result; 
                    ctrl.$setViewValue($scope.result);
                },300);
            });
            $scope.$watch('selectid.all',function(){
                if($scope.all){
                    if($scope.selectid['all']){
                        a = true;
                    }else{
                        a = false;
                    }
                    for(var i in $scope.selectid){
                        $scope.selectid[i] = a;
                    }
                }
                
            });
        }
    }
});
app.directive('ngAjaxTable',
    function() {
 
        return {
            restrict: 'AECM',
            templateUrl:function($scope,iElement,attrs){
				return viewurl('ajaxtable');
			},
			scope:{
				'mod':'=mod',
				'ftitle':'@',
				'oper':'=oper',
				'func':'@',
				'tpl':'@',
                'columns':'=',
				'postparams':'=',
				'test':'@',
				'fields':'@',
			},
 
			//template: '<div>指令中：{{ mod }}</div>',
			controller:['$scope','$timeout','$parse','$staticData','$element','$compile',function($scope,$timeout,$parse,$staticData,$element,$compile){
				//表格初始化
				 
				$scope.postparams = $scope.postparams ? $scope.postparams : {};
				  
				$scope.initTable = function(){
					var _a = $scope.func ? $scope.func : 'ajaxTable';
		
					var url = "/?g=Manager&c=Data&a=g&_m="+$scope.mod+"&_a="+_a;
					 
					var grid = new Datatable();
					var params = {'test':1};
					 
					 
					if($scope.fields) $scope.postparams['fields'] = $scope.fields;
					//$scope.fields.push('test');
					grid.init({
						src: $("#datatable_ajax"),
						onSuccess: function (grid) {

						},
						onError: function (grid) {
						},
						loadingMessage: '读取中...',
						dataTable: {
							"bStateSave": true,
							"lengthMenu": [
								[10, 20, 50, 100, 150, -1],
								[10, 20, 50, 100, 150, "All"]
							],
							"pageLength": 10,
							"ajax": {
								"url": url,
								'params':$scope.postparams
							},
							"order": [
								[1, "asc"]
							]
						},
						formatResult : function(data){
							
						    var result = [];
                            var formatFunc = function(params,item){
                                if(params['selectid']){
                                    var str = '<input type="checkbox" class="group-checkable"  value="'+item[params['selectid']]+'">';
                                    return str;
                                }
                            }
							 
						    if(data){
						        var row = 0;
						        for(var i in data){
									if(i =='data') continue;
						            var item = data[i];
                                    var r = [];
                                    for(var j in $scope.columns){
                                        var valparse = $scope.columns[j]['html'];
                                        var newv = formatFunc($scope.columns[j],item);
                                        if(newv){
                                            valparse = newv;
                                        }else{
                                            var rex = new RegExp("{{.+?}}",'g');
                                            var val = valparse.match(rex);

                                            if(val && val.length) for(var l in val){
                                                var vv = val[l].replace("{{","");
                                                vv = vv.replace("}}","");
                                                var cfunc = $parse(vv);
                                                var va = cfunc(item);
                                                var rexx = val[l];
                                                rexx = rexx.replace("|","\\|");

                                                var r1 = new RegExp(rexx,'g');
                                                valparse = valparse.replace(r1,va);

                                            }
                                        }
										 
                                        r.push(valparse);
                                        //
                                        //while((ret = rex.exec(valparse))!=null) {

                                       // }

                                    }



						            result.push(r);
                                    row++;
                                }
                            }
						 
							
                            return result;
                            return data;
						}
					});
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
								message: '未选择要操作的数据',
								container: grid.getTableWrapper(),
								place: 'prepend'
							});
						}
					});
					//时间框
					$('.date-picker').datepicker({
						rtl: Metronic.isRTL(),
						orientation: "left",
						autoclose: true
					});
				};
				//延迟初始化
				$timeout(function(){
					$scope.initTable();

				},300);
				
			}]
        };
});























