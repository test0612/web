<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="en" data-ng-app="app">
	<head>
		<meta charset="utf-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <link href="http://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700&subset=all" rel="stylesheet" type="text/css" />
        <?php echo ($css); ?>
        <script type="text/javascript">
            var TPL_URL ='<?php echo ($TPL_URL); ?>';
            var DATA_URL = '<?php echo ($DATA_URL); ?>';
            var TIME = '<?php echo GNT();?>';
        </script>
	</head>
	<body ng-controller="AppController" class="page-header-fixed page-sidebar-closed-hide-logo page-on-load" ng-class="{'page-content-white': settings.layout.pageContentWhite,'page-container-bg-solid': settings.layout.pageBodySolid, 'page-sidebar-closed': settings.layout.pageSidebarClosed}">

        <div ng-spinner-bar class="page-spinner-bar">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>

 
        <div data-ng-include="'<?php echo ($TPL_URL); ?>inc.header'" data-ng-controller="HeaderController" class="page-header navbar navbar-fixed-top"> </div>



        <div class="clearfix"> </div>
        <div class="page-container">
            <div data-ng-include="'<?php echo ($TPL_URL); ?>inc.sidebar'" data-ng-controller="SidebarController" class="page-sidebar-wrapper"> </div>
            <!-- BEGIN CONTENT -->
        <div class="page-content-wrapper">
            <div class="page-content">
                <!-- BEGIN STYLE CUSTOMIZER(optional)  
                <div data-ng-include="'<?php echo ($TPL_URL); ?>theme-panel'" data-ng-controller="ThemePanelController" class="theme-panel hidden-xs hidden-sm">               
                </div>
                <!-- END STYLE CUSTOMIZER -->
                        
                <!-- BEGIN ACTUAL CONTENT -->
                <div ui-view class="fade-in-up">
                </div> 
                <!-- END ACTUAL CONTENT -->
            </div>  
        </div>
        <!-- END CONTENT -->
        <a href="javascript:;" class="page-quick-sidebar-toggler"><i class="icon-close"></i></a>
        <div data-ng-include="'<?php echo ($TPL_URL); ?>inc.quick-sidebar'" data-ng-controller="QuickSidebarController" class="page-quick-sidebar-wrapper"></div>


        </div>
        <div data-ng-include="'<?php echo ($TPL_URL); ?>inc.footer'" data-ng-controller="FooterController" class="page-footer">
    </div>
	    <script src="<?php echo ($PURL); ?>plugins/jquery.min.js" type="text/javascript"></script>
        <!--<script src="/public/layer/layer.js"" type="text/javascript"></script> -->
        <script src="<?php echo ($PURL); ?>plugins/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>plugins/jquery-slimscroll/jquery.slimscroll.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>plugins/jquery.blockui.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>plugins/js.cookie.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>plugins/bootstrap-switch/js/bootstrap-switch.min.js" type="text/javascript"></script>
        <!-- END CORE JQUERY PLUGINS -->
        <!-- BEGIN CORE ANGULARJS PLUGINS -->
        <script type="text/javascript">function cl(msg){console.log(msg);};</script>
        <script src="<?php echo ($PURL); ?>angularjs/angular.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>angularjs/angular-sanitize.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>angularjs/angular-touch.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>angularjs/plugins/angular-ui-router.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>angularjs/plugins/ocLazyLoad.min.js" type="text/javascript"></script>
        <script type="text/javascript" src="/Public/plugins/kindeditor/kindeditor-min.js"></script> 

        <script src="<?php echo ($PURL); ?>angularjs/plugins/ui-bootstrap-tpls.min.js" type="text/javascript"></script>
        <!-- END CORE ANGULARJS PLUGINS -->
        <!-- BEGIN APP LEVEL ANGULARJS SCRIPTS -->
        <script src="<?php echo ($PURL); ?>js/app.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>js/main.js" type="text/javascript"></script>
        <script src="/public/js/directive.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>js/controller.js" type="text/javascript"></script>
        
        <!-- END APP LEVEL ANGULARJS SCRIPTS -->
        <!-- BEGIN APP LEVEL JQUERY SCRIPTS -->
        
        <script src="<?php echo ($PURL); ?>layouts/layout/scripts/layout.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>layouts/global/scripts/quick-sidebar.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>layouts/global/scripts/quick-nav.min.js" type="text/javascript"></script>
        <script src="<?php echo ($PURL); ?>layouts/layout/scripts/demo.min.js" type="text/javascript"></script>
        <div id="msgbox" class="modal fade" tabindex="-1" data-backdrop="static" data-keyboard="false" ng-controller='msgbox'>
        <div class="modal-dialog">
            <div class="modal-content" id='modalcontent'>
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                    <h4 class="modal-title">提示</h4>
                </div>
                <div class="modal-body">
                    <p id='msgcontent' style='font-size:18px;'>
                        
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" data-dismiss="modal" mbtn='close' class="btn default">关闭</button>
                    <button type="button" data-dismiss="modal" mbtn='back' ng-click='back()' class="btn btn-primary">返回</button>
                    <button type="button" data-dismiss="modal" mbtn='goon' ng-click="reload()" class="btn green">继续</button>
                </div>
            </div>
        </div>
    </div>

	</body>
</html>