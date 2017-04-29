/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
	'ngKeditor',
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
 
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: ANGULAR_URL+'assets',
        globalPath: ANGULAR_URL+'assets/global',
        layoutPath: ANGULAR_URL,
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
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
MetronicApp.controller('HeaderController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', function($state, $scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);


/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/config/conf/");  

    $stateProvider
		.state('welcome', {
            url: "/welcome",
            templateUrl: viewurl("welcome"),
            controller: "welcome",
        })
 
		.state('arcs_list', {
            url: "/arcs/list",
            templateUrl: viewurl("arcs.list"),
            controller: "arcsList",
        })
		.state('arcs_detail', {
            url: "/arcs/detail/{catalog_id:[0-9a-zA-Z]{1,9}}/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("arcs.detail"),
            controller: "arcsDetail",
        })
		.state('catalogs_single', {
            url: "/catalogs/single/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("catalogs.single"),
            controller: "catalogs_single",
        })
		.state('config', {
            url: "/config",
            templateUrl: viewurl("config.index"),
            controller: "config",
        })
        .state('catalogs_arcs45', {
            url: "/catalogs/arcs/45",
            templateUrl: viewurl("catalogs.arcs"),
            controller: "catalogs_arcs45",
        })
		.state('catalogs_arcs', {
            url: "/catalogs/arcs/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("catalogs.arcs"),
            controller: "catalogs_arcs",
        })
		.state('leaders_arcs', {
            url: "/leaders/arcs/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("leaders.arcs"),
            controller: "leadersArcs",
        })
		.state('leaders_detail', {
            url: "/leaders/detail/{catalog_id:[0-9a-zA-Z]{1,9}}/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("leaders.detail"),
            controller: "leadersDetail",
        })
		.state('dongtai_arcs', {
            url: "/dongtai/arcs/{catalog_id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("inc.datatable_page"),
            controller: "dongtaiArcs",
        })
		.state('dongtaiDetail', {
            url: "/dongtai/detail/{catalog_id:[0-9a-zA-Z]{1,9}}/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("dongtai.detail"),
            controller: "dongtaiDetail",
        })
		.state('joinusArcs', {
            url: "/joinus/arcs/{catalog_id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("catalogs.arcs"),
            controller: "joinusArcs",
        })
		.state('joinusDetail', {
            url: "/joinus/detail/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("joinus.detail"),
            controller: "joinusDetail",
        })
		.state('videos', {
            url: "/videos/detail/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("videos.detail"),
            controller: "videosDetail",
        })
		.state('thumbs', {
            url: "/catalogs/thumbs/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("catalogs.thumbs"),
            controller: "catalogsThumbs",
        })
        .state('areasList', {
            url: "/areas/list/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("catalogs.arcs"),
            controller: "areasList",
        })
        .state('areasDetail', {
            url: "/areas/detail/{catalogid:[0-9a-zA-Z]{1,9}}/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl("areas.detail"),
            controller: "areasDetail",
        })
        .state('focuslist', {
            url: "/catalogs/focuslist",
            templateUrl:viewurl("catalogs.arcs"),
            controller: "focusList",
        })
        .state('configConf', {
            url: "/config/conf/",
            templateUrl:viewurl("config.conf"),
            controller: "configConf",
        })
        
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
	$rootScope.LANG = LANG;
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
	$rootScope.navs = [];
	$rootScope.changeLang = function(lang){
		$rootScope.LANG = lang;
	}
}]);
var app = MetronicApp;


app.factory('$req',function($http,$rootScope){
	
	return {
		g: function(m,a,p){
			p['lang'] = $rootScope.LANG;
			return $http({
				url : '?m=Manager&c=Data&a=g' + "&_m="+m+"&_a="+a,
				method : 'GET',
				headers: {'Content-Type':'application/x-www-form-urlencoded'},
				params : p
			});
		},
		p: function(m,a,p){
			p['lang'] = $rootScope.LANG;
			return $http({
				url : '?m=Manager&c=Data&a=p' + "&_m="+m+"&_a="+a,
				method : 'POST',
				headers: {'Content-Type':'application/x-www-form-urlencoded'},
				data : p
			});
		},
		s: function(m,a,p){
			p['lang'] = $rootScope.LANG;
			return $http({
				url : '?m=Manager&c=Data&a=s' + "&_m="+m+"&_a="+a,
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
		FH: function(m,a,p){
			p['lang'] = $rootScope.LANG;
			$http({
				url : '?m=Manager&c=Data&a=s' + "&_m="+m+"&_a="+a,
				method : 'POST',
				data: p,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
				transformRequest : function(obj){
					var str = [];
					for(var p in obj){
						str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
					}
				 
					return str.join('&');
				},
	 
			}).success(function(responce){
				FH(responce);
			});
		},
	}
});
function FH(responce){
	if(responce['errormsg'] && typeof responce['errormsg'] != 'undefined'){
		showMsg({'msg':responce['errormsg'],'type':'error'});
		return;
	}
	showMsg({'msg':'操作完成','type':'ok'});
	return;
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
 
