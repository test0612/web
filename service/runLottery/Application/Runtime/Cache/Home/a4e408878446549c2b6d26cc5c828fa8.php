<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>彩票开奖</title>
    <script type="text/javascript" src="/runLottery/Public/js/jquery.js"></script>
    <script type="text/javascript" src="/runLottery/Public/bootstrap/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="/runLottery/Public/Angular/angular.min.js"></script>
    <link rel="stylesheet" href="/runLottery/Public/bootstrap/css/bootstrap.min.css"/>
    <script>
        var lotteryData = <?php echo json_encode($lottery);?>; 
        var lotteryNameData = <?php echo json_encode($lotteryNameData);?>; 
    </script>
</head>

<body>
<!--home-->
<div class="home" ng-app="myApp" ng-controller="myCtrl">
    <div class="article pull-left">
        <div class="ac_top1">
            <div class="ac_top1 form_top">
                <table class="table table-striped">
                    <thead>
                    <tr>
                        <th>彩种ID</th>
                        <th>彩种名称</th>
                        <th>期号</th>
                        <th>开奖时间</th>
                        <th>状态</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr ng-repeat="v in lotteryData">
                        <td>{{v.lottery_id}}</td>
                        <td>{{lotteryNameData[v.lottery_id]}}</td>
                        <td>{{v.issue}}</td>
                        <td>{{v.time_remaining}}秒</td>
                        <td>{{v.status}}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
<script>
    var app = angular.module('myApp', []);
    app.controller('myCtrl', function ($scope, $interval, $http) {
        $scope.lotteryData = lotteryData;
        $scope.lotteryNameData = lotteryNameData; 
        $scope.minustime = function() {
            $.each($scope.lotteryData, function (k, v) {
                var timestamp = Date.parse(new Date());
                timestamp = timestamp / 1000;
                v.time_remaining = v.endtime - timestamp;
                v.time_remaining -= 1;

                if (v.time_remaining > 0) {
                    v.status = '待开奖';
                } else {
                    if ((Math.abs(v.time_remaining)) % 5 == 0) {
                        //请求服务器开奖
                        $http({
                            method: 'get',
                            url: "<?php echo U('Index/disposeRunLottery');?>",
                            params: {lottery_id: v.lottery_id,issue: v.issue}
                        }).success(function (req) {
                            if (req !=0) {
                                //显示下一期内容
                                $scope.lotteryData = req;
                            }
                        });

                    }
                    v.status = '正在开奖';
                }
            });
        };

        $interval(function () {
            $scope.minustime();
        }, 1000);

    });



</script>
</body>
</html>