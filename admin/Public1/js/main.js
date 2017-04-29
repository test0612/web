/***
Metronic AngularJS App Main Script
***/
angular.module('Scope.safeApply',[]).run(function($rootScope){$rootScope.$safeApply=function(){var $scope,fn,force=false;if(arguments.length==1){var arg=arguments[0];if(typeof arg=='function'){fn=arg;}
else{$scope=arg;}}
else{$scope=arguments[0];fn=arguments[1];if(arguments.length==3){force=!!arguments[2];}}
$scope=$scope||this;fn=fn||function(){};if(force||!$scope.$$phase){$scope.$apply?$scope.$apply(fn):$scope.apply(fn);}
else{fn();}};});


/* Metronic App */
var app = angular.module("app", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    'ngKeditor',
    'Scope.safeApply',
]);
function FH(responce){
    if(responce['errormsg'] && typeof responce['errormsg'] != 'undefined'){
        showMsg({'msg':responce['errormsg'],'type':'error'});
        return;
    }
    showMsg({'msg':'操作完成','type':'ok'});
    return;
}
app.controller('msgbox', function($scope,$req,$stateParams,$staticData) {
    $scope.back = function(){
        history.back();
    }
    $scope.reload = function(){
        location.reload();
    }
});
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
        istr = "<i class='icon-close' style='color:red;margin-right:15px;font-size:30px;line-height:40px;vertical-align: middle;'></i> ";
        mbtn('close');
    }
    if(param['type'] == 'ok' || param['type'] == 'success'){
        istr = "<i class='icon-check' style='color:green;margin-right:15px;font-size:30px;line-height:40px;vertical-align: middle;'></i> ";
        mbtn('goon,back');
    }
    var box = $("#msgbox").find(".modal-dialog");
    
 
    var dh = parseInt($(window).height());

    box.css('marginTop',((dh)/3));
    var h = parseInt($('#modalcontent').height());
    $("#msgcontent").html(istr+param['msg']);
    $("#msgbox").modal();
    
}
function jError($msg){
    showMsg({'msg':$msg,'type':'error'});
    return;
}
function jSuccess($msg){
    showMsg({'msg':$msg,'type':'success'});
    return;
}
app.factory('$req',function($http,$rootScope){
    
    return {
        a: function(m,a,p,func){ 
            var $http = $http({
                url : DATA_URL+'g' + "&_m="+m+"&_a="+a,
                method : 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                data : p
            }); 
            return $http;
        },
        g: function(m,a,p,func){
            p = p ? p : {};
            p['isadmin'] = 1;
            var http = $http({
                url : DATA_URL+'g' + "&_m="+m+"&_a="+a,
                method : 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                data : p
            });
            if(typeof func == 'function'){
                http.success(function(responce){
                    if(responce['errormsg']){
                        jError(responce['errormsg']);
                    }else{
                        func(responce['result']);
                    }
                })
            }else{
                return http;
            }
        },
        p: function(m,a,p){
            p['lang'] = $rootScope.LANG;
            return $http({
                url : DATA_URL+'p' + "&_m="+m+"&_a="+a,
                method : 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                data : p
            });
        },
        t:function(m,a,p,func){
            var result = {};
            $.ajax({
                url : DATA_URL+'g' + "&_m="+m+"&_a="+a,
                cache : false,
                async:false,
                dataType:'json',
                type:'post',
                data:p,
                success:function(r){ 
                    result = r; 
                }
            });
            if(typeof func != 'undefined'){
                return func(result['result']);
            }
            return {
                success:function(func){
                    func(result);
                }
            };
        },
        s: function(m,a,p){
            p['lang'] = $rootScope.LANG;
            return $http({
                url : DATA_URL+'s' + "&_m="+m+"&_a="+a,
                method : 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                transformRequest : function(obj){
                    var str = [];
                    for(var p in obj){
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join('&');
                },
                params : p
            });
        },
        //自动表单处理
        FH: function(m,a,p,func){
           
            var http = $http({
                url : DATA_URL+'g' + "&_m="+m+"&_a="+a,
                method : 'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                data : p
            }).success(function(responce){
                if(typeof func == 'function' && responce.status == 1){ 
                    func(responce.result);
                }else{
                    FH(responce);
                }
                
            });
            
        },
    }
});
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
app.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    }); 
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
app.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
app.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
app.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
app.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
app.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
    $scope.$on('$includeContentLoaded', function() { 
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
app.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
app.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
app.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);
function _view(tpl,params){ 
    var url = TPL_URL + tpl;
    cl(url);

    return url;
}

function _u(tpl,params){
    var urls = [];
    urls.push('#');
    urls.push(tpl);
    for( i in params){
        var v = params[i];
        urls[i] = v;
    }
    return urls.join('/');
} 
/* Setup Rounting For All Pages */
app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/users/check_truename"); 
    $stateProvider
        .state('auction_store_detail',{
            url:'/auction/store_detail/{id:[0-9]{1,99}}',
            templateUrl:function(){
                cl(123);
                return _view('auction.store_detail.main');
            },
            controller:'auction_store_detail'
        })
        .state('auction_store_detail.info',{
            url:'/info',
            templateUrl:function(){ 
                return _view('auction.store_detail.info');
            },
            controller:'auction_store_detail.info'
        })
        .state('auction_store_detail.agoods',{
            url:'/agoods',
            templateUrl:function(){ 
                return _view('auction.store_detail.agoods');
            },
            controller:'auction_store_detail.agoods'
        })
         
        .state('route',{ 
            url:"/{params:[0-9.:a-zA-Z_/=]{0,9999}}",
            templateUrl:function($stateParams){

                var params = $stateParams.params.split('/');
                var urls = [];
                for(var i in params){
                    var v = params[i];
                    if(v.indexOf('=') > 0){

                        var kv = v.split('=');
                        $stateParams[kv[0]] = kv[1];
                    }else{
                        urls.push(v);
                    }
                } 
                $stateParams.tpl = urls.join('.'); 
                return _view($stateParams.tpl);
            }, 
        })
    ;

    return;
    

  

}]);

app.factory('$staticData',function($req){
    var data = {};
    return {
        init : function(ids){
             
            $req.t('StaticData','g',{'ids':ids}).success(function(responce){

                for(var i in responce['result']){
                    var v = responce['result'][i]; 
                    data[i] = v;
                } 
            });
        },
        getKV:function(name){ 
            var result = {};  
            var k = typeof k !='undefined' ? k : data[name]['k'];
            var v = typeof v !='undefined' ? v : data[name]['v']; 
            for(var i in data[name]['data']){
                var vv = data[name]['data'][i]; 
                result[vv[k]] = vv[v];
            }
            return result;
        },
        getData:function(name){
            var result = {};  
            return data[name]['data']; 
        }
    }
});
/* Init global settings and run the app */
app.run(["$rootScope", "settings", "$state", "$staticData", function($rootScope, settings, $state,$staticData) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $staticData.init('sex,check_status,AgoodType,status,pay_group,AgoodParam,taskMod,taskAction'); 
}]);