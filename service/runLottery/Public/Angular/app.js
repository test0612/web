/***
 Metronic AngularJS App Main Script
 ***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngRoute",
    'angularFileUpload'
]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) 
 MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
 $ocLazyLoadProvider.config({
 cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
 });
 }]); */

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function ($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
 Layout Partials.
 By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial
 initialization can be disabled and Layout.init() should be called on page load complete as explained above.
 ***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        setTimeout(function () {
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function ($scope) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); // init footer
    });
}]);

function _u(c, a, p) {
    var pstr = '';
    if (p && typeof p != 'undefined') {
        for (var i in p) {
            pstr += i + "=" + p[i];
        }
        pstr = "&" + pstr.join("&");
    }
    return "?m=Manager&c=" + c + "&a=" + a + pstr;
}
function viewurl(tpl) {
    return "/index.php?m=Manager&c=Index&a=view&tpl=" + tpl;
}
/*
 MetronicApp.config(['$routeProvider',function($routeProvider){

 $routeProvider
 .when('/product_list',{
 templateUrl : viewurl('ajaxtable_page'),
 controller:'product_list'
 })
 .when('/product_detail',{
 templateUrl : viewurl('product_detail'),
 controller:'product_detail'
 })
 .when('/product_detail/:id',{
 templateUrl : viewurl('product_detail'),
 controller:'product_detail'
 })
 .when('/user_list/',{
 templateUrl : viewurl('ajaxtable_page'),
 controller:'user_list'
 })
 .when('/job_add',{
 templateUrl : viewurl('job_add'),
 controller:'job_add'
 })
 .when('/insurance_add',{
 templateUrl : viewurl('insurance_add'),
 controller:'insurance_add'
 })
 .when('/setting_account',{
 templateUrl : viewurl('setting_account'),
 controller:'setting_account'
 })
 .when('/account_wait',{
 templateUrl : viewurl('account_wait'),
 controller:'account_wait'
 })
 .when('/bouns_conf/:id',{
 templateUrl : viewurl('bouns.conf'),
 controller:'bouns_conf'
 })
 .when('/assess_conf',{
 templateUrl : viewurl('assess.conf'),
 controller:'assess_conf'
 })
 ;
 }]);
 */


MetronicApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	 
 
    $urlRouterProvider.otherwise(indexurl);
    $stateProvider

    // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: viewurl("dashboard"),
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            PURL + 'assets/global/plugins/morris/morris.css',
                            PURL + 'assets/admin/pages/css/tasks.css',

                            PURL + 'assets/global/plugins/morris/morris.min.js',
                            PURL + 'assets/global/plugins/morris/raphael-min.js',
                            PURL + 'assets/global/plugins/jquery.sparkline.min.js',

                            PURL + 'assets/admin/pages/scripts/index3.js',
                            PURL + 'assets/admin/pages/scripts/tasks.js',

                            PURL + 'js/controllers/DashboardController.js'
                        ]
                    });
                }]
            }
        })
        .state('pledge_back', {
            url: '/pledge_back',
            templateUrl: viewurl('money.pledge_back'),
            controller: 'pledge_back'
        })
		.state('insurance_bonuslog_list', {
            url: '/insurance_bonuslog_list',
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'insurance_bonuslog_list'
        })
        .state('money_list', {
            url: '/money_list',
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'money_list'
        })
        .state('product_list', {
            url: "/product_list",
            templateUrl: viewurl("ajaxtable_page"),
            controller: "product_list",
        })
        .state('office_list', {
            url: "/office_list",
            templateUrl: viewurl("ajaxtable_page"),
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "office_list",
        })
        .state('organ_list', {
            url: "/organ_list",
            templateUrl: viewurl("ajaxtable_page"),
            controller: "organ_list",
        })
        .state('sys_test', {
            url: "/sys_test",
            templateUrl: viewurl("sys_test"),
            controller: "sys_test",
        })
        .state('product_detail', {
            url: "/product_detail",
            templateUrl: viewurl("product_detail"),
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "product_detail",
        })
        .state('company_detail', {
            url: '/company_detail',
            templateUrl: viewurl('company.detail'),
            controller: 'company_detail'
        })
        .state('company_list', {
            url: '/company_list',
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'company_list'
        })
        .state('company_detail_id', {
            url: '/company_detail/{id:[0-9]{1,4}}',
            templateUrl: viewurl('company.detail'),
            controller: 'company_detail'
        })
        .state('office_detail', {
            url: '/office_detail',
            templateUrl: viewurl('office.detail'),
            controller: 'office_detail'
        })
        .state('organ_detail', {
            url: '/organ_detail',
            templateUrl: viewurl('organ.detail'),
            controller: 'organ_detail'
        })
        .state('product_detail_id', {
            url: "/product_detail/{id:[0-9]{1,4}}",
            templateUrl: viewurl("product_detail"),
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "product_detail",
        })
        .state('organ_detail_id', {
            url: '/organ_detail/{id:[0-9]{1,4}}',
            templateUrl: viewurl('organ.detail'),
            controller: 'organ_detail'
        })
        .state('office_detail_id', {
            url: '/office_detail/{id:[0-9]{1,4}}',
            templateUrl: viewurl('office.detail'),
            controller: 'office_detail'
        })
        .state('user_list', {
            url: "/user_list",
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'user_list'
        })
        .state('assess_list', {
            url: "/assess_list",
            templateUrl: viewurl('assess_list'),
            controller: 'assess_list'
        })
        .state('assess_zero', {
            url: "/assess_zero",
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'assess_zero'
        })
        .state('user_detail', {
            url: "/user_detail/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl('user.detail'),
            controller: 'user_detail',

        })
		.state('bouns_log', {
            url: "/bouns_log",
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'bouns_log',

        })
		.state('user_setting', {
            url: "/user_setting/{id:[0-9a-zA-Z]{1,9}}",
            templateUrl: viewurl('user.setting'),
            controller: 'user_setting',

        })
        .state('user_exceladd_step', {
            url: "/user_exceladd/{step:[a-zA-Z]{1,9}}",
            templateUrl: viewurl('user.exceladd'),
            controller: 'user_exceladd'
        })
        .state('user_exceladd', {
            url: "/user_exceladd",
            templateUrl: viewurl('user.exceladd'),
            controller: 'user_exceladd'
        })
        .state('job_add', {
            url: "/job_add",
            templateUrl: viewurl('job_add'),
            controller: 'job_add'
        })
		.state('job_add_id', {
            url: "/job_add/{id:[0-9a-zA-Z]{1,20}}",
            templateUrl: viewurl('job_add'),
            controller: 'job_add'
        })
        .state('insurance_add', {
            url: '/insurance_add',
            templateUrl: viewurl('insurance_add'),
            controller: 'insurance_add'
        })
        .state('insurance_add_id', {
            url: '/insurance_add/{id:[0-9a-zA-Z]{1,9}}',
            templateUrl: viewurl('insurance_add'),
            controller: 'insurance_add'
        })
        .state('insurance_list', {
            url: '/insurance_list',
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'insurance_list'
        })
        .state('setting_account', {
            url: '/setting_account',
            templateUrl: viewurl('setting_account'),
            controller: 'setting_account'
        })
        .state('account_wait', {
            url: '/account_wait',
            templateUrl: viewurl('Account.wait'),
            controller: 'account_wait'
        })
        .state('bouns_conf_id', {
            url: '/bouns_conf/{id:[0-9]{1,4}}',
            templateUrl: viewurl('bouns.conf'),
            controller: 'bouns_conf'
        })
		.state('relationList', {
            url: '/relationList/{id:[0-9]{1,4}}',
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'relation_list'
        })
        .state('assess_conf', {
            url: '/assess_conf',
            templateUrl: viewurl('assess.conf'),
            controller: 'assess_conf'
        })
        .state('authsGroup_detail', {
            url: '/auths/groupDetail/{id:[0-9a-zA-Z]{1,9}}',
            templateUrl: viewurl('auths.groupDetail'),
            controller: 'auth_groupDetail'
        })
        .state('auths_groupList', {
            url: '/auths/groupList',
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'auths_groupList'
        })
        .state('manager_detail', {
            url: '/manager/detail/{id:[0-9]{1,9}}',
            templateUrl: viewurl('manager.detail'),
            controller: 'managerDetail'
        })
        .state('manager_list', {
            url: '/manager/list',
            templateUrl: viewurl('ajaxtable_page'),
            controller: 'managerList'
        })
        .state('user_calibration', {
            url: '/user/calibration',
            templateUrl: viewurl('user.calibration'),
            controller: 'user_calibration'
        })
        .state('user_out', {
            url: '/user/out',
            templateUrl: viewurl('user.out'),
            controller: 'user_out'
        })
    ;

}]);
MetronicApp.service('$staticData', function ($req) {

    var data = {'test': 1};
    return {
        init: function (name) {
            if (name == 'bxlx') {
                var v = [];
                v.push({'name': '主险', 'id': 1});
                v.push({'name': '附加险', 'id': 2});
                data[name] = v;
            } else {
                $req.g(name, 'select').success(function (responce) {
                    data[name] = responce;
                });
            }
        },
        g: function (name, k, kname) {
            var r = [];
            for (var i in data[name]) {
                var v = data[name][i];
                r[v['id']] = v['name'];
            }
            return r;
            for (var i in data[name]) {

                var d = data[name][i];
                if (d[kname] == k) {
                    return d;
                }
            }
        },
        getData: function (name, k, kname) {
            return data[name];
        },
        res: function (name, k, kname) {


        },
        s: function () {
            cl('test');
        }
    }
});
//模态框
MetronicApp.service('$modal',function(){
	return {
		/*
		 * title : 标题
		 */
		show : function(params){
			this.create(params);
		},
		create : function(params){
			
			var html = '';
			html += '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">';
			html += '<div class="modal-dialog">';
			html += '<div class="modal-content">';
			html += '<div class="modal-header">';
			html += '<button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>';
			html += '<h4 class="modal-title">'+params.title+'</h4>';
			html += '</div>';
			html += '<div class="modal-body">';
			html += 'Modal body goes here';
			html += '</div>'
			html += '<div class="modal-footer">';
			html += '<button type="button" class="btn default" data-dismiss="modal">Close</button>';
			html += '<button type="button" class="btn blue">Save changes</button>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			html += '</div>';
			$("body").append(html);;
			$("#myModal").modal();
			
		}
	}
});
/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "$staticData", function ($rootScope, settings, $state, $staticData) {

    settings.layout.pageBodySolid = false;
    settings.layout.pageBodySolid = true;
    $rootScope.$state = $state; // state to be accessed from view
    $staticData.init('rank');
 
    $staticData.init('bxlx');
    $staticData.init('authGroups');
    $staticData.init('bonus');
}]);

function jsonPush(json, v) {
    cl(json);
    return;
    var max = 0;
    for (var i in json) {
        if (i > max) {
            max = i;
        }
    }
    json[max + 1] = v;
    return json;
}
function jsonLength(json) {
    var length = 0;
    for (var i in json) length++;
    return length;
}

















