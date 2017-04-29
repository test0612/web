/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
app.directive('ngSpinnerBar', ['$rootScope', '$state',
    function($rootScope, $state) {
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
                    Layout.setAngularJsSidebarMenuActiveLink('match', null, $state); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
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
app.directive('a', function() {
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

// Handle Dropdown Hover Plugin Integration
app.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});

app.directive('pageNav',function(){ 
    return{
        template:'<div class="page-bar"> <ul class="page-breadcrumb"> <li> <a href="index.html">Home</a> <i class="fa fa-circle"></i> </li>  <li> <span>Form Stuff</span> </li> </ul> <div class="page-toolbar">  <div class="btn-group pull-right"> <button type="button" class="btn green btn-sm btn-outline dropdown-toggle" data-toggle="dropdown"> Actions  <i class="fa fa-angle-down"></i> </button> <ul class="dropdown-menu pull-right" role="menu"> <li> <a href="#"> <i class="icon-bell"></i> Action</a> </li>  <li> <a href="#"> <i class="icon-shield"></i> Another action</a> </li> <li> <a href="#"> <i class="icon-user"></i> Something else here</a> </li> <li class="divider"> </li> <li> <a href="#"> <i class="icon-bag"></i> Separated link</a> </li> </ul> </div> </div> </div> <h1 class="page-title"> 渤海在线艺术品  <small>material design bootstrap inputs, input groups, custom checkboxes and radio controls and more</small>  </h1>',
        link:function(){ 
        }
    }
});


/* FG BEGIN */
app.directive('fgText',function($req){
    return {
        require: "ngModel",
        restrict : 'AEMC',
        template:'<div class="form-group form-md-line-input"><label class="col-md-2 control-label" for="form_control" > {{label}} <span class="required" ng-if="must">*</span></label><div class="col-md-10"><input type="text" class="form-control"  id="{{inputid}}" value="{{value}}"   placeholder="{{placeholder}}"> <div class="form-control-focus"> </div> <span class="help-block">{{help}}</span></div></div>',
        scope : {
            title : '@',
            label: '@',
            text:'@',
            must:'@',
            placeholder:'@',
            help:'@'
        },
        require:'ngModel',
        link:function($scope,$element,attr,ctrl){ 
            $scope.value = '';
            $scope.inputid = 'input'+$scope.$id;
            ctrl.$render = function(){
                if(ctrl.$modelValue){
                    $scope.value = ctrl.$modelValue;
                }
            }
 
            $element.bind('change',function(){
                var val = $element.find('#'+$scope.inputid).val(); 
                ctrl.$setViewValue(val);
            });
        }
    }
});
app.directive('fgSelect',function($req,$timeout,$staticData){
    return{
        scope : {
            'label':'@',
            'data':'@',
            'staticData':'@',
        },
        require:'?ngModel',
        restrict : 'AECM',
        replace: true,
        //template:"<select class='form-control select2'><option　value='0'>请选择</option><option ng-repeat='(k,v) in data' value='{{k}}'>{{v}}</option></select>",
        template:'<div class="form-group form-md-line-input"> <label class="col-md-2 control-label" for="form_control_1">{{label}}</label> <div class="col-md-10">  <select class="form-control" id="form_control_1"> <option value="{{k}}" ng-repeat="(k,v) in data">{{v}}</option> </select> <div class="form-control-focus"> </div> </div> </div>',
        link:function($scope,$element,$attrs,$ngModel){ 
            if(!$scope.data){
                $scope.data = $staticData.getKV($scope.staticData);
            }else if(!$scope.staticData){
                cl('Error:no data & no staticData -> '+$scope.label);
                return;
            }
            $ngModel.$render = function(){
                if($ngModel.$viewValue){
                    $timeout(function(){
                        $element.find('select').val($ngModel.$viewValue);
                    },100);
                }
            }
            $element.bind('change',function(){

                $ngModel.$setViewValue($element.find('select').val());
            });
             
        }
    }
});
app.directive('fgCheckbox',function($req,$staticData,$timeout){
    return {
        require: "ngModel",
        restrict : 'AEMC',
        template:'<div class="form-group form-md-line-input"><label class="col-md-3 control-label" for="form_control" style="color:#000000"> {{title}} <span class="required" ng-if="must">*</span></label><div class="col-md-9 md-checkbox-inline"  > <div class="md-checkbox has-success" ng-if="all"> <input type="checkbox" ng-model="selectid.all" name="all" value="all" id="checkboxall" class="md-check"> <label for="checkboxall"> <span></span> <span class="check"></span> <span class="box"></span> {{all}}</label>  </div> <div class="md-checkbox has-success" ng-repeat="(k,v) in data"> <input type="checkbox" ng-model="selectid[k]" value="{{k}}" id="checkbox{{$id}}{{k}}"   class="md-check"> <label for="checkbox{{$id}}{{k}}"> <span></span> <span class="check"></span> <span class="box"></span> {{v}}</label>  </div></div> <span class="help-block">{{text}}</span></div></div>',
        scope : {
            title : '@',
            text:'@',
            must:'@',
            data:'=',
            all:'@',
        },
        require:'ngModel',
        link:function($scope,$element,attr,ctrl){
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
app.directive('fgTextarea',function($req){
    return {
        require: "ngModel",
        restrict : 'AEMC',
        template:'<div class="form-group form-md-line-input"><label class="col-md-3 control-label" for="form_control" style="color:#000000"> {{label}} <span class="required" ng-if="must">*</span></label><div class="col-md-9"><textarea class="form-control" rows="3" placeholder="" text>{{value}}</textarea><div class="form-control-focus"> </div> <span class="help-block">{{text}}</span></div></div>',
        scope : {
            label : '@',
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
app.directive('fgRadio',function($req,$staticData,$timeout){
    return {
        require: "ngModel",
        restrict : 'AEMC',
        template:'<div class="form-group form-md-line-input"><label class="col-md-3 control-label" for="form_control" style="color:#000000"> {{title}} <span class="required" ng-if="must">*</span></label><div class="col-md-9 md-radio-inline"  >  <div class="md-radio" ng-repeat="(k,v) in data"> <input type="radio" name="{{inputname}}" ng-click="setV(k)" ng-model="selectid" value="{{k}}" id="checkbox{{$id}}{{k}}"   class="md-radiobtn"> <label for="checkbox{{$id}}{{k}}"> <span class="inc"></span> <span class="check"></span> <span class="box"></span> {{v}} </label>  </div></div> <span class="help-block">{{text}}</span></div></div>',
        scope : {
            title : '@',
            label : '@',
            text:'@',
            must:'@',
            data:'=',
            all:'@',
        },
        require:'ngModel',
        link:function($scope,$element,attr,ctrl){
            $scope.value = '';
            $scope.inputname = 'input'+$scope.$id;
            $scope.checksid = "ckitem"+$scope.$id;
            $scope.selectid = '';
            
            $scope.title = $scope.title ? $scope.title : $scope.label;
            ctrl.$render = function(){
                if(ctrl.$modelValue){
                    $scope.selectid = ctrl.$modelValue; 
                }
            }
            $scope.setV = function(k){
                $scope.selectid = k;
            }
            $element.bind('click',function(){
                
                $timeout(function(){  
                    ctrl.$setViewValue($scope.selectid);
                },100);
            }); 
        }
    }
});
app.directive('fgSubmit',function($req,$timeout,$staticData){
    return{
        scope : {
            'btns':'@',
            'formData':'=',
        },
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
            
            var html = "<label class=\"mt-checkbox mt-checkbox-single mt-checkbox-outline\" ><input name=\""+column.selectid+"\" checkson checkitem=\""+data[column.selectid]+"\" type=\"checkbox\" class=\"checkboxes\" value=\""+data[column.selectid]+"\"\/><span><\/span><\/label>";
 
        }
        if(!html) return '';
         
        var func = $interpolate(html);
        var result = func(data);
    
 
        //var result = $compile(result)($scope);
  
        return result; 
         
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
                'noticAction':'=',
                'defaultSearch':'=',
            },
            templateUrl:function($scope,iElement,attrs){
                return _view('directive.datatable');
            },
            link:function($scope){
                //$scope.funcs();

            },
            controller:['$scope','$element','$req','$compile','$timeout','$parse','$window',function($scope,$element,$req,$compile,$timeout,$parse,$window){ 
                //初始化参数 
                
                $scope.length = '10';
                $scope.resultStatus = '读取中...';
                $scope.start = 0;
                $scope.page = 1; 
                $scope.data = {};
                $scope.$watch('noticAction',function(action){ 
                    if(action == 'refresh'){
                        $scope.noticAction = '';
                        $scope.getData();
                    }
                });
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
                        if($scope.oper[$scope.operAction] == '推送'){
                            $window.location.href = '#/pushs/push/'+$scope.selectids;
                            return;
                        }
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
                cl(123);
                $scope.getData = function(){
                    $scope.loading.status = 1;
                    $scope.postparams['start'] = $scope.start;
                    $scope.postparams['length'] = $scope.length;
                    $scope.postparams['page'] = $scope.page;
                    //添加搜索数据
                    $element.find(".form-filter").each(function(){
 
                        $scope.postparams[$(this).attr('name')] = $(this).val();
                    });
                    cl($scope.postparams);
                    $req.g($scope.mod,$scope._a,$scope.postparams).success(function(responce){ 
                        $scope.loading.status = 0;
                        $scope.data = responce.result; 
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
                            $("[click]").click(function(){
                                var c = $(this).attr('click');
                                var f = (c.substr(0,c.indexOf("("))); 
                                eval("$scope.funcs."+c);
                            });
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