<?php
namespace Home\Controller;

use Think\Controller;
use Think\Model;

class IndexController extends Controller
{
    private $_resultModel;
    private $_lotteryModel;
    private $_lotteries;
    private $_lotteryNum;

    public function _initialize()
    {
        $this->_resultModel = D('LotteryResults');
        //$this->_lotteryModel = D('lottery');
        $lotteries = getLotteries();
        $this->_lotteries = $lotteries['data'];
        $this->_lotteryNum = $lotteries['count'];
    }

    public function index()
    {
        #$this->lecai();
        $this->show();
    }

    public function getLotteryResult()
    {

        $lotteries = getLotteries();
        $resultModel = D('gather_results');
        foreach ($lotteries as $k => $v) {
            $result = getherResult($v['apiUrl']);
            $lottoResult = $resultModel->where('lottery_id=' . $v['id'] . ' and expect=' . $result['expect'])->find();

            if ($result['expect'] > $lottoResult['expect']) {
                $data = array(
                    'lottery_id' => $v['id'],
                    'expect' => $result['expect'],
                    'opencode' => $result['opencode'],
                    'opentime' => $result['opentime'],
                    'opentimestamp' => $result['opentimestamp'],
                    'gather_time' => time()
                );
                $resultModel->data($data)->add();
            }
        }
        $this->ajaxReturn(1);
    }

    public function runLotteryInfo()
    {
        $lotteryNameData = [];
        //初始化彩种
        $lotteries = getLotteries();
        if(!$lotteries['count']) exit('No Lottery'); 
        foreach($lotteries['data'] as $v) $lotteryNameData[$v['id']] = $v['title'];
        $this->lotteryNameData = $lotteryNameData;

        //初始化待开奖
        $lotteryIds = array_keys($lotteryNameData);
        $lotteryData = [];
        foreach($lotteryIds as $lottery_id){
           $lotteryData[$lottery_id] = $this->_resultModel->where(['lottery_id'=>$lottery_id,'status'=>0])->find();
           if(!$lotteryData[$lottery_id]){
                $lotteryData[$lottery_id] = $this->saveIssue($lottery_id);

           }
           $lotteryData[$lottery_id]['title'] = $lotteryNameData[$lottery_id];
        }

        
        $this->assign('lotteryName', $lotteryNameData);
        $this->assign('lottery', $lotteryData);
        $this->display();
    }

    public function disposeRunLottery()
    {
         
        $lotteryId = I('GET.lottery_id');
        $issue = I('GET.issue');
         
        if (!$lotteryId || !$issue) {
            $this->ajaxReturn(0);
        }
         
        //开奖 调取封装
        $re = $this->runLottery($lotteryId, $issue);
        if (!$re) {
            $this->ajaxReturn(0);
        }

        if ($re) {//1.如成功则保存开奖结果、修改数据表当前期状态、2.存入新的下一期数据
            $this->_resultModel->where(['lottery_id' => $lotteryId,'issue'=>$issue])->save(['status' => 1]);//只修改状态 未存入其它结果，待定

            $this->saveIssue($lotteryId);

            $lotteriesResult = $this->_resultModel->where(['status' => 0])->select();
            $this->ajaxReturn($lotteriesResult);

        } else {
            $this->ajaxReturn(0);
        }
    }

    //开奖
    private function runLottery($lotteryId, $issue)
    {
        //1.获取接口开奖信息  2.计算开奖是否符合规则（是或否）
        //返回开奖期数组 或空数组 （包含如：中奖号码，当前期号或账号）
        return true;
    }

    private function saveIssue($lotteryId)
    {
        
        $expect = getIssue(['game_id' => $lotteryId]);
        
        //做保护 避免请求时传回与上一期相同的值
        if($expect['startTime'] > time() || $expect['endTime'] < time()) return false;

        $data = [
            'lottery_id' => $lotteryId,
            'starttime' => $expect['startTime'],
            'endtime' => $expect['endTime'],
            'status' => 0,
            'issue' => $expect['issue'],
            'addTime' => time()
        ]; 
        $data['id'] = $this->_resultModel->data($data)->add();

        return $data;
    }

//    public function work()
//    {
//        $laiyuan = I('GET.laiyuan');
//
//        $laiyuan();
//        echo 1;
//    }


}