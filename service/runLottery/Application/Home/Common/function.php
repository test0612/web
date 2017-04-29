<?php
function gether($url, $param)
{
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_TIMEOUT, 10);

    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    if ($param['debug']) {
        curl_setopt($curl, CURLOPT_HEADER, 1);
        curl_setopt($curl, CURLOPT_REFERER, $param['REFERER']);//来源

    }

    if ($param['proxy']) {
        curl_setopt($curl, CURLOPT_PROXY, $param['proxy']);//来源
    }
    if ($param['POST']) {
        curl_setopt($curl, CURLOPT_POST, 1);
        curl_setopt($curl, CURLOPT_POSTFIELDS, implode("&", $param['POSTFIELDS']));
    }
    #curl_setopt($curl, CURLOPT_ENCODING, 'gzip,deflate');
    curl_setopt($curl, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
    if ($param['HTTPHEADER']) {
        curl_setopt($curl, CURLOPT_HTTPHEADER, $param['HTTPHEADER']);
    }
    curl_setopt($curl, CURLOPT_ENCODING, "gzip");
    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    $data = curl_exec($curl);


    curl_close($curl);
    return $data;
}

function object_array($array)
{
    if (is_object($array)) {
        $array = (array)$array;
    }
    if (is_array($array)) {
        foreach ($array as $key => $value) {
            $array[$key] = object_array($value);
        }
    }
    return $array;
}

function getherResult($url)
{
    $data = gether($url);
    $data = object_array(json_decode($data));

    $result = $data['data'];
    return $result[0];
}

function getApiInfo($action, $params = array())
{
    vendor('Hprose.HproseHttpClient');
    $client = new \HproseHttpClient(C('SERVICE_API'));
    $result = $client->g($action, $params);
    return $result;
}

//获取彩种
function getLotteries($params = [])
{
    $data = getApiInfo('Game.getNameList', $params);
    return $data ? $data : [];
}

//获取当前开奖期号
function getIssue($params)
{
    $data = getApiInfo('Game.getIssue', $params);
    return $data ? $data : [];
}




