app.filter('parseDatatableItem',function($parse,$compile,$interpolate,$sce){
    return function(column,data,$scope){ 
		var html = column.html;
		if(column.selectid){
			
			var html = "<label class=\"mt-checkbox mt-checkbox-single mt-checkbox-outline\" ><input name=\""+column.selectid+"\" checkson checkitem=\""+data[column.selectid]+"\" type=\"checkbox\" class=\"checkboxes\" value=\""+data[column.selectid]+"\"\/><span><\/span><\/label>";
 
		}
		if(!html) return '';
		 
		var func = $interpolate(html);
		var result = func(data);
	
 
		//var result = $compile(result)($scope);
  
		return result; 
		 
    }
});
app.filter('trusted', ['$sce', function ($sce) {  
        return function (text) {  
            return $sce.trustAsHtml(text);  
        }  
    }]  
)
function safeApply(scope, fn) {  
    (scope.
		phase||scope.$root.
		phase) ? fn() : scope.$apply(fn);  
}
app.directive('ngBack',function(){
	return{
		restrict: 'AECM',
		controller:function($scope,$element,$window){
			$element.click(function(){
				$window.history.back();
			});
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
				'title':'@',
				'actions':'=',
			},
			templateUrl:function($scope,iElement,attrs){
				return viewurl('directive.datatable');
			},
			controller:['$scope','$element','$req','$compile','$timeout','$parse',function($scope,$element,$req,$compile,$timeout,$parse){
				//初始化参数 
				$scope.length = '10';
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
				$scope.pageArr = ['10','20','50','100','500'];
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
								$(this).trigger('click');
							}
						}else{
							if(checkAllStatus){
								$(this).trigger('click');
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
 
					});
				}
				$scope.operAction = "";
				$scope.operSubmit = function(){
					$scope.operAction = $("#operAction").val()
					 
					if($scope.operAction && $scope.selectids.length){
						
						$req.p($scope.mod,'operAction',{'ids':$scope.selectids,'operAction':$scope.operAction}).success(function(responce){
							if(responce['status'] == 1){
								$scope.getData();
								if($("[checkAll]").is(':checked')){
									$("[checkAll]").trigger('click');
								}
							}
						});
					}
				}
				
				
				$scope.loading.left = $element.width() / 3;
				$scope.loading.top = '100';
				$scope.getData = function(){
					$scope.loading.status = 1;
					$scope.postparams['start'] = $scope.start;
					$scope.postparams['length'] = $scope.length;
					$scope.postparams['page'] = $scope.page;
					//添加搜索数据
					$element.find(".form-filter").each(function(){
 
						$scope.postparams[$(this).attr('name')] = $(this).val();
					});
					
					$req.g($scope.mod,$scope._a,$scope.postparams).success(function(responce){
						
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
							 
						},200);
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



app.directive('ngPageNav',function($req){
	return{
		
		template:'<div class="page-bar ng-scope">'
	+'<ul class="page-breadcrumb">'
		+'<li>'
			+'<i class="fa fa-home"></i>'
			+'<a href="#/dashboard"> {{DashbordName}}</a>'
		+'</li>'
		+'<li ng-repeat="v in navs">'
		+	'<i class="fa fa-angle-right"></i><a href="javascript:void(0)" >{{v.title}}</a>'
		+'</li>'
	+'</ul>'
	+'<div class="page-toolbar">'
                               +' <div class="btn-group pull-right">'
                                   +' <button type="button" class="btn green btn-sm btn-outline dropdown-toggle" data-toggle="dropdown"> {{changeLang}}'
                                    +'    <i class="fa fa-angle-down"></i>'
                                  +'  </button>'
                                    +'<ul class="dropdown-menu pull-right" role="menu">'
                                       +' <li ng-repeat="(k,v) in langs">'
                                          +'  <a href="javascript:void(0);" ng-click="changeLangs(k)">'
                                           +' {{v}}</a>'
                                       +' </li>'
                                    +'</ul>'
                                +'</div>'
                           +' </div>'
	,
		restrict:'AECM',
		scope:{
			'nav1title':'@',
			'nav1class':'@',
			'h3title':'@',
		},
		controller:function($scope,$timeout,$rootScope){
			var menu = $(".page-sidebar-menu").find('.active');
			var menu2 = $(menu).find(".active");
			$scope.DashbordName = $rootScope.LANG == 'zh' ? '欢迎' : 'Dashbord';
			//切换语言
			$scope.changeLangs = function(lang){
				if($rootScope.LANG == lang) return;
				$rootScope.LANG = lang;
				$req.p('Config','changeLang',{'lang':lang}).success(function(responce){
					if(responce['status'] == 1) location.reload();
				});
			}
			$scope.navs = [];
 
			$scope.langs = {'zh':'中文','en':'English'};
			$scope.changeLang = $scope.langs[$rootScope.LANG];
			$scope.jump = function(url){
				$("[menua]").each(function(){
					if($(this).attr('href') == url){
						$(this).trigger('click');
					}
				});
			}
			$scope.setNav = function(){
				$rootScope.navs = [];
				$("[menua]").each(function(){
					if($(this).parent().hasClass('active')){
						 
						var item = [];
						item['title'] = $(this).attr('title');
						item['href'] = $(this).attr('href');
						$rootScope.navs.push(item);
					}
				});
				$scope.navs = $rootScope.navs;
			}
			if(!$scope.nav1title){
				$timeout(function(){
					$scope.setNav();
				},500);
			}
		}
	}
});
app.directive('fgImgUpload',function($req){
	return{
		restrict: 'AECM',
		templateUrl:function($scope,iElement,attrs){
			return viewurl('directive.fgImgUpload');
		},
		scope:{
			title:'@',
		},
		require: "ngModel",
		link:function($scope,$element,attr,ctrl){

			$scope.selectText = '选择图片';
			var filebtn = $element.find("[type='file']");
			$scope.img = '';
			ctrl.$render = function(){
				if(ctrl.$viewValue){
					$scope.img = ctrl.$viewValue;
				}
			}
			//选择图片
			$scope.selectPic = function(){
				filebtn.trigger('click');
			}
			//移除图片
			$scope.removepic = function(){
				$scope.img = '';
				ctrl.$setViewValue('');
				$scope.bindUpload();
			}
			//大图
			$scope.openImg = function(){
				window.open($scope.img);
			}
			$scope.bindUpload = function(){
				filebtn.fileupload({
					url:"index.php?g=Admin&c=Data&a=p&_m=Uploads&_a=upload&type=uploadfile",
					formData:{type:'uploadfile'},
				}).bind('fileuploaddone',function(e,data){
					var result = $.parseJSON(data.result);
					cl('done');
					if(result.img){
						$scope.img = result.img;
						ctrl.$setViewValue(result.img);
						$scope.$apply();
					}
				
				});
			}
			//图片上传
			$scope.bindUpload();
			return;
			$scope.src = '';
			$scope.hideData = '';
			ctrl.$render = function(){
				if(ctrl.$viewValue){
					//待解决
					$element.find('img').attr('src',ctrl.$viewValue);
					$element.find('.hideSrc').attr('val',ctrl.$viewValue);
					$element.fadeIn();
				}
			}
 
			$element.find('.hideSrc').bind('change',function(){
				var src = $(this).val();
				var params = {
					'type' : 'imagebase64',
					'val'  : src,
				};
				$req.p('Uploads','upload',params).success(function(responce){
					if(responce['status'] == 1){
						$element.find('.hideSrc').attr('val',responce['img']);
						ctrl.$setViewValue(responce.img);
					}
				});
			});
 
		}
	}
});

app.directive('fgInputHtmledit',function($req){
	return{
		require: "ngModel",
		restrict : 'AEMC',
		template : '<div class="form-group form-md-line-input"><label class="col-md-3 control-label" for="form_control" style="color:#000000"> {{title}} <span class="required" ng-if="must">*</span></label><div class="col-md-9"><textarea content=\"content\" keditor ng-model=\"val\" data-config=\"config\" cols=\"30\" rows=\"10\" required ></textarea> <div class="form-control-focus"> </div> <span class="help-block">{{text}}</span></div></div>',
		scope : {
			title : '@',
			text:'@',
			must:'@',
		},
		link:function($scope,$element,attr,ctrl){
			
			$element.find('textarea').bind('change',function(){ 
			 
				ctrl.$setViewValue($(this).html());
			});
			ctrl.$render = function(){
				_content = (ctrl.$isEmpty(ctrl.$viewValue) ? "" : ctrl.$viewValue);
				$scope.val = _content;
			}
		 
			 
		}
	}
});
app.directive('fgInputText',function($req){
	return {
		require: "ngModel",
		restrict : 'AEMC',
		template:'<div class="form-group form-md-line-input"><label class="col-md-3 control-label" for="form_control" style="color:#000000"> {{title}} <span class="required" ng-if="must">*</span></label><div class="col-md-9"><input type="text" class="form-control" placeholder="" value="{{value}}" text name="name"> <div class="form-control-focus"> </div> <span class="help-block">{{text}}</span></div></div>',
		scope : {
			title : '@',
			text:'@',
			must:'@',
		},
		require:'ngModel',
		link:function($scope,$element,attr,ctrl){
			$scope.value = '';
			ctrl.$render = function(){
				if(ctrl.$modelValue){
					$scope.value = ctrl.$modelValue;
				}
			}
 
			$element.bind('change',function(){
				ctrl.$setViewValue($element.find('[text]').val())
			});
		}
	}
});
app.directive('fgInputTextarea',function($req){
	return {
		require: "ngModel",
		restrict : 'AEMC',
		template:'<div class="form-group form-md-line-input"><label class="col-md-3 control-label" for="form_control" style="color:#000000"> {{title}} <span class="required" ng-if="must">*</span></label><div class="col-md-9"><textarea class="form-control" rows="10" placeholder="" text>{{value}}</textarea><div class="form-control-focus"> </div> <span class="help-block">{{text}}</span></div></div>',
		scope : {
			title : '@',
			text:'@',
			must:'@',
		},
		require:'ngModel',
		link:function($scope,$element,attr,ctrl){
			$scope.value = '';
			ctrl.$render = function(){
				if(ctrl.$modelValue){
					$scope.value = ctrl.$modelValue;
				}
			}
 
			$element.bind('change',function(){

				ctrl.$setViewValue($element.find('[text]').val())
			});
		}
	}
});
app.directive('fgInputDate',function($req,$filter){
	return {
		require: "ngModel",
		restrict : 'AEMC',
		template:'<div class="form-group"> <label class="control-label col-md-3">{{title}}</label> <div class="col-md-4"> <div class="input-group date form_datetime"  data-date-format="yyyy年mm月dd日 hh:ii:ss" date-date="{{value}}"> <input type="text" size="16" class="form-control" value="{{value}}"> <span class="input-group-btn"> <button class="btn default date-reset" type="button"> <i class="fa fa-times"></i> </button> <button class="btn default date-set" type="button"> <i class="fa fa-calendar"></i> </button> </span> </div> </div> </div>',
		scope : {
			title : '@',
			text:'@',
			must:'@',
		},
		require:'ngModel',
		link:function($scope,$element,attr,ctrl){
			var timeFormat = "yyyy年MM月dd日 hh:mm:ss";
			$element.bind('change',function(){
				ctrl.$setViewValue($element.find('[text]').val())
			});
			$scope.value = '';
			ctrl.$render = function(){ 
				if(ctrl.$modelValue){
					var a = ctrl.$modelValue;
					a = $filter('date')(a*1000,timeFormat);
					$scope.value = a;
				}
			}
			$(function(){
				$.fn.datetimepicker.dates['zh'] = {  
					days:       ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六","星期日"],  
					daysShort:  ["日", "一", "二", "三", "四", "五", "六","日"],  
					daysMin:    ["日", "一", "二", "三", "四", "五", "六","日"],  
					months:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月","十二月"],  
					monthsShort:  ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],  
					meridiem:    ["上午", "下午"],  
					//suffix:      ["st", "nd", "rd", "th"],  
					today:       "今天"  
				};  
				$('.form_datetime').datetimepicker({
					language:  'zh',
					weekStart: 1,
					todayBtn:  1,
					autoclose: 1,
					todayHighlight: 1,
					startView: 2,
					forceParse: 0,
					showMeridian: 1
				});
			});
		}
	}
});

app.directive('fgSelectCatalogs',function($req,$timeout){
	return {
		require: "ngModel",
		restrict : 'AEMC',
		scope : {
			title : '@',
			text:'@',
			must:'@',
			lang:'@',
		},
		template:'<div class="form-group"> <label class="control-label col-md-3">{{title}}</label> <div class="col-md-4"> {{value}}<select class="bs-select form-control" ng-modal="value">  <option value="0">{{selectCatalog}}</option> <option ng-repeat="v in data" value="{{v.id}}">{{v.title}}</option>   </select> </div> </div>',
		link:function($scope,$element,attr,ctrl){
			$scope.data = {};
			$scope.selectCatalog = '请选择';
			 
			$req.g('Catalogs','selectOptions',{'type':'arcs'}).success(function(responce){
				$scope.data = responce;
			});
			ctrl.$render = function(){
				
                if(!ctrl.$isEmpty(ctrl.$viewValue)){
					$timeout(function(){
						$element.find('select').val(ctrl.$viewValue);
					},500);
					 
			    }
            };
			 
			
			$element.find('.form-control').bind('change',function(){
				ctrl.$setViewValue($element.find('select').val())
			});

		 
		}
	}
});


//$req.p('Uploads','upload',params)
app.directive('dropzone',function($parse){
	return {
		scope:{
			insert:'&',
		},
		restrict: 'C',
		template:'<div style="width:{{width}};margin:0px auto;"  action="" > <h3 class="sbold" ng-if="files.length==0">拖动文件到此处上传</h3> <div> <div ng-if="files.length>0"><button type="button" class="btn btn-success" ng-click="_insert()">确定添加</button></div>',
		controller:function($scope,$element,$parse){
			
			$scope._insert = function(){
				if($scope.insert){ 
					var fn = $parse($scope.insert);
					
					fn({param:$scope.files});
				}
			}
			$scope.files = [];
			$scope.width = '600px';
			var m = 'Uploads';
			var a = 'upload';
			var config = {
				url : '?m=Manager&c=Data&a=g' + "&_m="+m+"&_a="+a+"&type=uploadfile",
				maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 10,
                parallelUploads: 1,
				dictDefaultMessage:'或点击上传',
			}
			$scope.setFiles = function(){
				$scope.files = [];
				$("[dropzone_remove]").each(function(){
					var src = $(this).attr('src');
					$scope.files.push(src);
				});  
				$scope.$apply();
			}
			var dropzone = new Dropzone($element[0], config);
			var eventHandlers = {
				'addedfile': function(file) {
					var removeButton = Dropzone.createElement("<a dropzone_remove href='javascript:;'' class='btn red btn-sm btn-block'>移除</a>");
					var _this = this;
					removeButton.addEventListener("click", function(e) {
						e.preventDefault();
                        e.stopPropagation();
						_this.removeFile(file);
						$scope.setFiles();
                    });
					file.previewElement.appendChild(removeButton);
					$scope.file = file;
					if (this.files[1]!=null) {
						//this.removeFile(this.files[0]);
					}
					$scope.$apply(function() {
						$scope.fileAdded = true;
					});
				},
				'success': function (file, response) {
					response = JSON.parse(response);
					$(file.previewElement).find('[dropzone_remove]').attr('src',response['img']);
					 
					$scope.setFiles();
				}
			};
			
			angular.forEach(eventHandlers, function(handler, event) {
				dropzone.on(event, handler);
			});
			$scope.processDropzone = function() {
				dropzone.processQueue();
			};
			$scope.resetDropzone = function() {
				dropzone.removeAllFiles();
			}
			$element.addClass('dropzone dropzone-file-area');
			$element.width('600px');
		},
	}
});















