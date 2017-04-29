<?php
namespace Common\Model;
use Think\Model;
class MModel extends Model {
    var $addfield  = [];
    var $isinnerjoin = false;
    var $tasks ;
     
    /*
    
    */
    public function getDataByID($p){
        if(is_array($p)) return $p;
        $data = $this->where(array('id'=>$p))->find();
        return $data;
    }
    public function getList($p){
        $result = array();
        if($p['order']) $this->order($p['order']);
        $result = $this->select();
        return $result;
    }
    public function getListCount($p){
        $result = array();
        $map2['user_id'] = $this->getUserID();
        if($p['order']) $this->order($p['order']);
        if($map) $this->where($map2+$map);
        $result = $this->selectCount();
        if($p['keyid'] && $result['count']){
           $result['data'] = arrayParseKey($result['data'],$p['keyid']);
        } 
        return $result;
    }
    public function tasks_c($p){
        return D('Tasks')->c($p);
    }
    public function selectList($p){
        if($p['map']){
            $this->WHERE($p['map']);
        }
        return $this->select();
    }
    public function selectLink($p){
        $pid = $p['pid'];
        $kname = $p['kname'];
        $vname = $p['vname'];
        $result = array();
        $r = $this->field("{$kname},{$vname}")->where(array('pid'=>$pid))->select();
        
        if($r) foreach($r as $v){
            $result[$v[$kname]] = $v[$vname];
        }
        return $result;
    }
    public function selectGroupID(){
        $r = $this->select();
        $result = array();
        if($r){
            foreach($r as $v){
                $result[$v['id']] = $v;
            }
        }
        return $result;
    }
    /*
     * @table 表名
     * @field 所需字段
     * @on 链接字段，本表字段=外表字段
     * @pre 字段前缀 
     */
    public function setUserID(&$p,$noerror=0){
        $user_id = D('Curuser')->getid($noerror);
    
        if($p['isadmin']){

        }else{
            $p['user_id'] = $user_id; 
        } 
        
    }
    public function getUserID(&$p,$noerror=0){
        $user_id = D('Curuser')->getid($noerror);

        return $user_id;
        if($p['isadmin']){

        }else{
            $p['user_id'] = $user_id; 
        } 
        
    }
    public function innerjoin($mod,$field=''){

        if(is_array($table)){
            $mod = $table['mod'];
            $field = $table['field'];
        }

        $bTable = $this->trueTableName;
        $wTable = D($mod)->trueTableName;
        $wPK = 'id'; 
         
       # print_r($this);
        if($wTable[strlen($wTable)-1] == 's'){
            $pre = strtolower(substr($wTable,0,strlen($wTable)-1));
        }else{
            $pre = $table;
        }
        
        $pre .= "_";
        $on = $on ? $on : ("{$wTable} ON {$bTable}.{$pre}{$wPK} = {$wTable}.{$wPK}");
        $this->JOIN($on,'INNER');
       
        //处理字段
        $field = array_filter(explode(",",$field));
 
        if($field) foreach($field as $v){

            $this->addfield[] = "{$wTable}.{$v} as {$pre}{$v}";
        } 
        $this->isinnerjoin = true;
        #$this->JOIN($table,'inner');
       # $on = explode($p['on'];
       # print_r($on);
      
    }
    public function operAction($p){
        $operAction = $p['operAction'];
        $ids = $p['ids'];

        if($operAction && $ids){
            if($operAction == 'delete'){
                $r = $this->WHERE(array("id"=>array('IN',$ids)))->delete();
                
            }
            if($operAction == 'copy'){
                $r = $this->WHERE(array("id"=>array('IN',$ids)))->select();
 
                foreach($r as $v){
                    unset($v[$this->fields['_pk']]);
                    $this->add($v);
                }
 
                
            }
        }
        return array('status'=>1);
        exit;
    }
	public function rsave($p,$rules=array()){ 
		$pk = $this->pk;
        if($rules){
            $this->_validate = $rules;
        }else{
           
        } 
        $c = parent::create($p); 
		

        $error = $this->getError();
		if($error){ 
			jError($error);
		} 
        $issave = 1;
        if($p['checksave'] && $p[$pk]){
            $issave = $this->WHERE(array($pk=>$p[$pk]))->getField($pk);

        }

		if($p[$pk] && $issave){ 
            $this->mdate = GNT();
			$r = $this->save();
            return $p[$pk];
		}else{

            $this->cdate = GNT();
			$a = $this->add();
            return $a;
		} 
	}
 
    public function getOne($p){
        $pk = $this->pk; 
        if($p[$pk]){
            return $this->find($p[$pk]);
        }
        return false;
    }
    public function makeSelect($params){
        if($params['kname'] && $params['vname']){
            $r = $this->SELECT();
            $result = array();
            if($r) foreach($r as $v){
                $result[$v[$params['kname']]] = $v[$params['vname']];
            }
            return $result;
        }
    }
    public function ajaxTableSearch($p=array()){ 
        if(!$p) $p = I('POST.searchparams'); 

        $map = array();  
        if($p) foreach($p as $sk=>$s){ 
            $type = $s['type'];
            $field = $s['field'];
            $value = $s['value'] ? $s['value'] : $s['val']; 

            if(!strpos($field,".")){
                $field = $this->trueTableName.".".$field;
            }

            if($value == '*') continue;
            if($type == 'like' && $value){
                $map[$field] = array('LIKE',"%{$value}%");
            }
            if($type == 'equal' && $value){
                $map[$field] = $value;
            }
            if($type == 'in' && $value){
                $value = explode(',',$value);
                $map[$field] = array('IN',$value); ;
            }
            if($type == 'between'){
                if(strpos($value,'年')) $value = YMDtotime($value);
                if(strpos($field,'_min') && $value){
                    $karr = explode("_min",$field);
                    $map[] = $karr[0] ." >= '{$value}'";
                }
                if(strpos($field,'_max') && $value){
                    $karr = explode("_max",$field);
                    $map[] = $karr[0] ." <= '{$value}'";
                }
            }
        }
         
        return $map;
    } 
    public function ajaxTable($params=array()){
        
        //innerjoin
        $innerjoin = $params['innerjoin'];
        if($innerjoin){ 
            foreach($innerjoin as $v){
                $this->innerjoin($v['mod'],$v['field']);
            } 
        } 
        //init
        $p = $params;
        $bTable = $this->trueTableName; 
        $fields = $p['fields'];
        $fields = $fields == 'undefined' ? '' : $fields;
        $fields = $fields  ? $fields : '*'; 

        
        
        $customActionName = I("POST.customActionName");
        if($customActionName == 'del'){
            $options    =  $this->_parseOptions();
            $this->WHERE(" ID IN (".implode(",",I('POST.id')).")")->delete();
            $this->WHERE($options['where']);
        }
 
        #if(!$fields) return false;
        //搜索条件

        $searchparams = $params['searchparams'];

        if(in_array('user_id',$this->fields)){
            $a = $p;

            $this->setUserID($a);

            if($a['user_id']){
                $this->WHERE(array($this->trueTableName.'.user_id'=>$a['user_id'])); 
            } 
        }
        
        if($searchparams){
            $map = $this->ajaxTableSearch($searchparams);

            $this->where($map);
        }
        if($params['map']){
            $this->where($params['map']);
        }
        
        #exit;
        #print_r($map);
        //limit
         
        $length = $p['length'];
        $start = $p['start'];
        $page = $p['page'];
        $this->page($page,$length);

        if($fields && !$this->options['field']) $this->field($fields);
        $result = $this->selectCount(); 
        #echo D()->_sql();
        #print_r($result);
        return $result;
        //字段
        $f = array();
        $opertion = array();
        
        
        
        $options    =  $this->_parseOptions();

        $count = $this->join($options['join'])->WHERE($options['where'])->count();
         
        //查询
        $rdata = $this->select($options);
         
         
        $p = $params;
        //处理data
         
        if($rdata && false) foreach($rdata as $vp){
            $val = array();
            $row=0;
             
            foreach($vp as $k=>$v){
 
                if($p['format'][$k]){
                    $v = $p['format'][$k]($v);
                }
                $val[] = ajaxTableParseField($fields[$row++],$v,$vp);
            }
            #print_r($val);
            #exit;
            $data[] = $val;
        }
        $data = $rdata;
        $result = array();
        $result['draw'] = I('POST.draw');
        $result['count'] = $count;
        $result['recordsTotal'] = $count;
        $result['recordsFiltered'] = $count;
        $result['data'] = $data?$data:array();
        return $result;
    }
    public function selectCount($p=array()){

        $options = $this->options;
        if(!$options['order'] && in_array('cdate',$this->fields)){
            //$options['order'] = $this->trueTableName.".cdate desc"; 
            $this->order($this->trueTableName.".cdate desc");
            $options = $this->options;
        } 
        
        if(count($this->addfield)){
            $fields = $options['field'];
            if(!$fields) $fields = '*';
            if($fields{0} == '*'){
               # $fields = $this->trueTableName.".".$fields;
                
            }
            //先处理本表
            #$fields = $this->fie
            $fields = explode(",",$fields);
            $f = [];
            foreach($fields as $v){
                $f[] = $this->trueTableName.".".$v;
            }
            $fields = implode(',',$f);
            $ad = implode(",",$this->addfield); 
            $fields .= ",".$ad;

            $this->field($fields);
            $options = $this->options;
            #$this->
        } 
        $result = array(); 
        $this->options = $options;
        $result['data'] = $this->select($options);

       
        if($options['group']){
            unset($options['limit'],$options['page']);
            $options['field'] = $options['group'];
            $this->options = $options;
            $tableSql = $this->buildSql();
            unset($options['page'],$options['limit']);
            $count = $this->table($tableSql." t")->count();
        }else{
            unset($options['page'],$options['limit']);
            unset($options['order']);
            $this->options = $options;
            
            $count = $this->count();
             
        }
        
        
        $result['count'] = $count;

        return $result;
    }
    public function ajaxList(){
        $likekey = I('GET.likekey');
        $q = I('GET.q');
        $page_limit = I('GET.page_limit');
        $field = I('GET.field',$likekey?$likekey:'*');
        $join = I('GET.join');
        $maps = I('GET.map');
        $tableName = $this->getTableName();
         
        $map = array();
        if($maps) $map[] = $maps;
        //LIKE
        if($likekey){
            $likekey = explode(",",$likekey);
            $addsql = array();
            foreach($likekey as $v){
                $addsql[] = " {$tableName}.`{$v}` LIKE '%{$q}%'";
            }
            $map[] = "( ".implode(" OR ",$addsql)." )"; 
        }
        if($join){
            $this->join($join);
        }
        $result = $this->field($field)->WHERE($map)->LIMIT($page_limit)->SELECT();
        
        #echo D()->_sql();
        #print_r($result);
        #exit;
        return $result;
    }
}

































