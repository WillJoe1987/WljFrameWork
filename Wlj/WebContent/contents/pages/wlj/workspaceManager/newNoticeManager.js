/**
 * 公告管理
 * 2014/04/29
 * dongyi
 */
imports([
        '/contents/pages/com.yucheng.bcrm/com.yucheng.bcrm.js',
        '/contents/pages/common/Com.yucheng.bcrm.common.Annacommit.js',//附件信息
        '/contents/pages/common/Com.yucheng.crm.common.ImpExpNew.js',//导出
        '/contents/pages/common/Com.yucheng.bcrm.common.OrgField.js'// 机构放大镜
        ]);
var needGrid = true;
var createView = !JsContext.checkGrant('notice_create');//是否启用新增面板
var editView = !JsContext.checkGrant('notice_modify');//是否启用修改面板
var detailView = !JsContext.checkGrant('notice_detail');//是否启用详情面板
var formViewers = true;
var lookupTypes = ['IF_FLAG',//“是否标志” 数据字典项
                   'NOTICE_LEV',//“公告级别标志” 数据字典项
                   'READ_FLAG',//“阅读标志” 数据字典项
                   'NOTICE_PUB',//"发布标志" 数据字典项
                   'SH_STATUS'];//审批状态

var url = basepath+'/noticequery.json';//公告查询
var comitUrl = basepath+'/workplatnotice.json';//公告维护

var ifCharge = "fbsh";
var roleCodes = __roleCodes;// 当前用户拥有的据角色编码
if (roleCodes != null && roleCodes != "") {
	var roleArrs = roleCodes.split('$');
	for ( var i = 0; i < roleArrs.length; i++) {
		if (roleArrs[i] == "R311" || roleArrs[i] == "R201" || 
				roleArrs[i] == "R202" || roleArrs[i] == "R107" || roleArrs[i] == "R108" || roleArrs[i] == "R109" ||
				roleArrs[i] == "R119" || roleArrs[i] == "R122" || roleArrs[i] == "R123" || roleArrs[i] == "R124" || roleArrs[i] == "R126"){
			ifCharge = "fb";
		}
	}
}

//机构树加载条件
var condition = {
	searchType : 'SUBTREE' // 查询子机构
};

//加载机构树
var treeLoaders = [ {
	key : 'ORGTREELOADER',
	url : basepath + '/commsearch.json?condition=' + Ext.encode(condition),
	parentAttr : 'SUPERUNITID',
	locateAttr : 'UNITID',
	jsonRoot : 'json.data',
	rootValue : JsContext._orgId,
	textField : 'UNITNAME',
	idProperties : 'UNITID'
} ,{
	key : 'BLINETREELOADER',
	url : basepath + '/businessLineTree.json',
	parentAttr : 'PARENT_ID',
	locateAttr : 'BL_ID',
	jsonRoot : 'json.data',
	rootValue : '0',
	textField : 'BL_NAME',
	idProperties : 'BL_ID'
}];


//树配置
var treeCfgs = [ {
	key : 'ORGTREE',
	loaderKey : 'ORGTREELOADER',
	autoScroll : true,
	rootCfg : {
		expanded : true,
		id : JsContext._orgId,
		text : JsContext._unitname,
		autoScroll : true,
		children : [],
		UNITID : JsContext._orgId,
		UNITNAME : JsContext._unitname
	}
},{
	key : 'BLTREE',
	loaderKey : 'BLINETREELOADER',
	autoScroll : true,
	rootCfg : {
		expanded : true,
		id : '0',
		text : '归属业务条线',
		autoScroll : true,
		children : []
	}
} ];
WLJUTIL.alwaysLockCurrentView = true;//由于在保存之后，还需要操作附件列表，所以本功能页面锁定悬浮面板滑出

var fields = [
  		    {name: 'NOTICE_ID',text:'公告序号',searchField: false,hidden:true},
  		    {name: 'PUBLISHED',text : '发布状态',resutlFloat:'right', translateType : 'NOTICE_PUB',resutlWidth:60},
  		    {name: 'STATUS',text : '审核状态',resutlFloat:'right', translateType : 'SH_STATUS',resutlWidth:60},
  		    {name: 'IS_READ',text : '阅读标记',resutlFloat:'right', translateType : 'READ_FLAG',searchField: true,resutlWidth:60},
  		    {name: 'NOTICE_TITLE', text : '公告标题',allowBlank:false,resutlWidth:350, searchField: true, viewFn : function(data){
  		    	return '<b>'+data+'</b>';
  		    }},
  		    {name: 'NOTICE_LEVEL', text : '重要程度',resutlFloat:'right', translateType : 'NOTICE_LEV'},
  		    {name: 'CREATOR_NAME',text:'创建人',resutlWidth:100,gridField:false},
  		    {name: 'PUB_ORG_NAME',text:'发布机构',resutlWidth:120,xtype:'wcombotree',innerTree:'ORGTREE',showField:'text',hideField:'UNITID',editable:false},
//  		    {name: 'PUB_ORG_NAME',text:'发布机构',resutlWidth:120,xtype:'orgchoose',hiddenName:'PUB_ORG',searchType:'SUBTREE'},
  		    {name: 'PUBLISHER_NAME',text : '发布人',resutlFloat:'right',searchField: true,resutlWidth:100},
  		    {name: 'PUBLISH_TIME',text:'发布日期',format:'Y-m-d',xtype:'datefield',resutlWidth:80},
  		    {name: 'ACTIVE_DATE', text : '有效期',format:'Y-m-d',resutlFloat:'right',xtype : 'datefield',dataType : 'date',resutlWidth:80,allowBlank:false},
  		    {name: 'ANN_COUNT',text:'附件个数',resutlWidth:60},
  		    {name: 'TOP_ACTIVE_DATE',text:'置顶时间至',format:'Y-m-d',xtype:'datefield',dataType : 'date',gridField:true},  
  		    {name: 'NOTICE_CONTENT',resutlWidth:350,gridField:false,xtype:'textarea'},
  		    
  		    {name: 'PUBLISHER',hidden:true},
  		    {name: 'PUBLISH_ORG',hidden:true,gridField:false},
  		    {name: 'IS_TOP', text : '是否置顶',value:'0',resutlFloat:'right',translateType : 'IF_FLAG',gridField:true,allowBlank:false,
  		    	listeners:{
  		    		select:function(combo,record){
  		    			var v = this.getValue();
  		    			if(v=='1'){//1是0否
  		    				getCurrentView().contentPanel.getForm().findField('TOP_ACTIVE_DATE').setVisible(true);
  		    				getCurrentView().contentPanel.getForm().findField('TOP_ACTIVE_DATE').allowBlank = false;
  		    			}else if(v=='0'){
  		    				getCurrentView().contentPanel.getForm().findField('TOP_ACTIVE_DATE').setVisible(false);
  		    				getCurrentView().contentPanel.getForm().findField('TOP_ACTIVE_DATE').allowBlank = true;
  		    			}
  					}
	        	}},
	       {name: 'PUBLISH_TIME_START',searchField: true,format:'Y-m-d',xtype:'datefield',editable:false,dataType : 'date',gridField:false},
  		   {name: 'PUBLISH_TIME_END',searchField: true,format:'Y-m-d',xtype:'datefield',editable:false,dataType : 'date',gridField:false},
  		   {name: 'MODULE_TYPE',hidden:true},
  		   {name: 'NOTICE_TYPE',hidden:true},
  		   {name: 'CREATOR',hidden:true},
  		   {name: 'RECEIVE_ORG',hidden:true},
  		   {name: 'RECEIVE_ORG_NAME',text:'接收机构',gridField:true,xtype:'wcombotree',innerTree:'ORGTREE', showField:'text',hideField:'UNITID',editable:false},
//  		   {name: 'RECEIVE_ORG_NAME',text:'接收机构',gridField:true,xtype:'orgchoose',hiddenName:'RECEIVE_ORG',searchType:'SUBTREE'},
  		   {name: 'TEST',hidden:true}  
  		];
/**************控制新增修改详情面板的宽度************/
var detailFormCfgs = {
		suspendWidth: 800,
		formButtons : [{
			text : '关闭',
			fn : function(formPanel){
				 hideCurrentView();
			}
		}]
};
/*******************公告修改面板********************/
var editFormViewer = [{
	fields : ['NOTICE_ID','NOTICE_TITLE','NOTICE_LEVEL','ACTIVE_DATE','IS_TOP','RECEIVE_ORG','RECEIVE_ORG_NAME','TOP_ACTIVE_DATE'],
	fn : function(NOTICE_ID,NOTICE_TITLE,NOTICE_LEVEL,ACTIVE_DATE,IS_TOP,RECEIVE_ORG,RECEIVE_ORG_NAME,TOP_ACTIVE_DATE){
		NOTICE_TITLE.text='公告标题<font color="red">*</font>';
		ACTIVE_DATE.text = '有效期至';
		RECEIVE_ORG_NAME.text ='接收机构范围';
		NOTICE_TITLE.gridField=true;
		NOTICE_LEVEL.gridField=true;
		ACTIVE_DATE.gridField=true;
		IS_TOP.gridField=true;
		TOP_ACTIVE_DATE.gridField=true;
		RECEIVE_ORG_NAME.gridField=true;
		return [NOTICE_ID,NOTICE_TITLE,NOTICE_LEVEL,ACTIVE_DATE,IS_TOP,RECEIVE_ORG,RECEIVE_ORG_NAME,TOP_ACTIVE_DATE];
	}
},{/**公告内容富文本编辑框**/
	columnCount : 0.94 ,
	fields : ['NOTICE_CONTENT'],
	fn : function(NOTICE_CONTENT){
		NOTICE_CONTENT.text='公告内容';
		return [prodTabs1];
	}
},{/**附件信息**/
	columnCount:0.94,
	fields:['TEST'],
	fn:function(TEST){
		editAnna = createAnnGrid(false,true,false,false);
		return [editAnna];
	}
}];
/*******************公告详情面板********************/
var detailFormViewer = [{
	columnCount : 2 ,
	fields : ['NOTICE_TITLE','NOTICE_LEVEL','ACTIVE_DATE','IS_TOP','TOP_ACTIVE_DATE','RECEIVE_ORG_NAME','PUBLISHER_NAME','PUBLISH_TIME','CREATOR_NAME','PUB_ORG_NAME'],
	fn : function(NOTICE_TITLE,NOTICE_LEVEL,ACTIVE_DATE,IS_TOP,TOP_ACTIVE_DATE,RECEIVE_ORG_NAME,PUBLISHER_NAME,PUBLISH_TIME,CREATOR_NAME,PUB_ORG_NAME){
		NOTICE_TITLE.text='公告标题';
		ACTIVE_DATE.text = '有效期至';
		RECEIVE_ORG_NAME.text ='接收机构范围';
		NOTICE_TITLE.gridField=true;
		NOTICE_LEVEL.gridField=true;
		ACTIVE_DATE.gridField=true;
		IS_TOP.gridField=true;
		TOP_ACTIVE_DATE.gridField=true;
		RECEIVE_ORG_NAME.gridField=true;
		NOTICE_TITLE.readOnly = true;NOTICE_LEVEL.readOnly = true;ACTIVE_DATE.readOnly = true;IS_TOP.readOnly = true;
		TOP_ACTIVE_DATE.readOnly = true;RECEIVE_ORG_NAME.readOnly = true;PUBLISHER_NAME.readOnly = true;PUBLISH_TIME.readOnly = true;
		CREATOR_NAME.readOnly = true;PUB_ORG_NAME.readOnly = true;
		NOTICE_TITLE.cls = 'x-readOnly';NOTICE_LEVEL.cls = 'x-readOnly';ACTIVE_DATE.cls = 'x-readOnly';
		IS_TOP.cls = 'x-readOnly';TOP_ACTIVE_DATE.cls = 'x-readOnly';RECEIVE_ORG_NAME.cls = 'x-readOnly';PUBLISHER_NAME.cls = 'x-readOnly';
		PUBLISH_TIME.cls = 'x-readOnly';CREATOR_NAME.cls = 'x-readOnly';PUB_ORG_NAME.cls = 'x-readOnly';
		return [NOTICE_TITLE,NOTICE_LEVEL,ACTIVE_DATE,IS_TOP,TOP_ACTIVE_DATE,RECEIVE_ORG_NAME,PUBLISHER_NAME,PUBLISH_TIME,CREATOR_NAME,PUB_ORG_NAME];
	}
},{/**公告内容富文本编辑框**/
	columnCount : 0.94 ,
	fields : ['NOTICE_CONTENT'],
	fn : function(NOTICE_CONTENT){
		return [prodTabs2];
	}
},{/**附件信息**/
	columnCount:0.94,
	fields:['TEST'],
	fn:function(TEST){
		detailAnna = createAnnGrid(true,false,true,false);
		return [detailAnna];
	}
}];
/******************提交前数据校验**********************/
var validates = [
{
	desc : '有效期至不得小于当前日期',
	fn : function(ACTIVE_DATE){
		if(ACTIVE_DATE.format('Y-m-d')<new Date().format('Y-m-d')){
			return false;
		}
	},
	dataFields : ['ACTIVE_DATE']
}];

var tbar = [{
	text : '删除',
	hidden:JsContext.checkGrant('notice_delete'),
	handler : function(){
	if(getSelectedData() == false){
		Ext.Msg.alert('提示','请选择一条数据！');
		return false;
	}else{
		var creator = getSelectedData().data.CREATOR;
		var isPublished = getSelectedData().data.PUBLISHED;
		var status = getSelectedData().data.STATUS;
		var allowPub = true;
		var disPubStr = "";
        if(creator!=__userId){
            allowPub=false;
            disPubStr += "【"+getSelectedData().data.NOTICE_TITLE+"】";
        }
        if(!allowPub){
            Ext.Msg.alert('提示', '记录：'+disPubStr+"不是由您创建，您无权删除。");
            return ;
        }
        if(isPublished != 'pub002'){
        	Ext.Msg.alert('提示', '记录：'+disPubStr+"已经发布,不允许删除操作!");
            return false;
        }
        if(status !="1"){
            Ext.MessageBox.alert('删除操作', '公告【'+getSelectedData().data.NOTICE_TITLE+'】在审核中，不允许删除！');
            return false;
        }
        var ID = '';
		for (var i=0;i<getAllSelects().length;i++){
			ID += getAllSelects()[i].data.NOTICE_ID;
			ID += ",";
		}
		ID = ID.substring(0, ID.length-1);
		Ext.MessageBox.confirm('提示','确定删除吗?',function(buttonId){
			if(buttonId.toLowerCase() == "no"){
			return false;
			} 
		    Ext.Ajax.request({
                url: basepath+'/workplatnotice.json',                                
                method : 'POST',
                params : {
                    methodNs : 'delete',
                    isBat : true ,
                    batString : ID,
                    noticeId:ID
                },
                success : function(){
                    Ext.Msg.alert('提示', '删除成功');
                    reloadCurrentData();
                },
                failure : function(){
                    Ext.Msg.alert('提示', '删除失败');
                    reloadCurrentData();
                }
            });
	});
}}},{text : '提交发布审核',
	id:'fbsh',
	hidden:JsContext.checkGrant('notice_pub'),
	handler : function(){
	if(getSelectedData() == false){
		Ext.Msg.alert('提示','请选择一条数据！');
		return false;
	}else{
		var noticeId=getSelectedData().data.NOTICE_ID;
		var creator = getSelectedData().data.CREATOR;
		var published = getSelectedData().data.PUBLISHED;
		var status = getSelectedData().data.STATUS;
        var allowPub = true;
        var disPubStr = "";
        if(creator!=__userId){
            allowPub=false;
            disPubStr += "【"+getSelectedData().data.NOTICE_TITLE+"】";
        }
        if(!allowPub){
            Ext.Msg.alert('提示', '记录：'+disPubStr+"不是由您创建，无法提交审核。");
            return ;
        }
        if(published=="pub001"){
            Ext.MessageBox.alert('提交审核操作', '公告【'+getSelectedData().data.NOTICE_TITLE+'】已发布，请取消选择！');
            return false;
        }
        if(status!="1"){
            Ext.MessageBox.alert('提交审核操作', '只能提交未审核的公告！');
            return false;
        }
        var noticeIds = "noticeId";
        Ext.Msg.wait('正在提交数据，请稍等...','提示');
        Ext.Ajax.request({
            url:basepath+'/customerMktTeamInformationAdd!initFlowNotice.json',//发布审核流程
            method:'GET',
            params : {
				instanceid :noticeId ,
				name:getSelectedData().data.NOTICE_TITLE,
				published:published
			},
			success : function(response) {
				 var ret = Ext.decode(response.responseText);
					var instanceid = ret.instanceid;//流程实例ID
					var currNode = ret.currNode;//当前节点
					var nextNode = ret.nextNode;//下一步节点
					selectUserList(instanceid,currNode,nextNode);//选择下一步办理人
					reloadCurrentData();
					hideCurrentView();
			},
//            params:{
//                isBat:true,
//                batString:noticeId,
//                methodNs:'publish',
//                noticeId:noticeId
//            },
//            success : function(){
//                Ext.MessageBox.alert('发布操作', '发布成功');
//                reloadCurrentData();
//            },
            failure : function(){
                Ext.MessageBox.alert('提交审核操作', '提交审核失败');
                reloadCurrentData();
            }
        });
}
	}
},{ text : '发布',
	id:'fb',
	hidden:JsContext.checkGrant('notice_pub'),
	handler : function(){
		if(getSelectedData() == false){
			Ext.Msg.alert('提示','请选择一条数据！');
			return false;
		}else{
			var noticeId=getSelectedData().data.NOTICE_ID;
			var creator = getSelectedData().data.CREATOR;
			var published = getSelectedData().data.PUBLISHED;
			var status = getSelectedData().data.STATUS;
	        var allowPub = true;
	        var disPubStr = "";
	        if(creator!=__userId){
	            allowPub=false;
	            disPubStr += "【"+getSelectedData().data.NOTICE_TITLE+"】";
	        }
	        if(!allowPub){
	            Ext.Msg.alert('提示', '记录：'+disPubStr+"不是由您创建，无法提交审核。");
	            return ;
	        }
	        if(published=="pub001"){
	            Ext.MessageBox.alert('提交审核操作', '公告【'+getSelectedData().data.NOTICE_TITLE+'】已发布，请取消选择！');
	            return false;
	        }
	        if(status!="1"){
	            Ext.MessageBox.alert('提交审核操作', '只能提交未审核的公告！');
	            return false;
	        }
	        var noticeIds = "noticeId";
	        Ext.Msg.wait('正在提交数据，请稍等...','提示');
	        Ext.Ajax.request({
	            url:basepath+'/workplatnotice.json',//发布
	            method:'POST',
	            params:{
	                isBat:true,
	                batString:noticeId,
	                methodNs:'publish',
	                noticeId:noticeId
	            },
	            success : function(){
	                Ext.MessageBox.alert('发布操作', '发布成功');
	                reloadCurrentData();
	            },
	            failure : function(){
	                Ext.MessageBox.alert('发布操作', '发布失败');
	                reloadCurrentData();
	            }
	        });
	  }
   }
},{
	text : '已阅',
	hidden:JsContext.checkGrant('notice_read'),
	handler : function(){
	if(getSelectedData() == false){
		Ext.Msg.alert('提示','请选择一条数据！');
		return false;
	}else{
		var noticeId=getSelectedData().data.NOTICE_ID;
		 var isRead = getSelectedData().data.IS_READ;
		 var isPublished = getSelectedData().data.PUBLISHED;
		 if(isPublished == "pub002"){
			 Ext.MessageBox.alert('已阅操作', '公告【'+getSelectedData().data.NOTICE_TITLE+'】未发布，请取消选择！');
             return false;
		 }
		 if(isRead=="red001"){
                Ext.MessageBox.alert('已阅操作', '公告【'+getSelectedData().data.NOTICE_TITLE+'】已阅，请取消选择！');
                return false;
            }
		   Ext.Ajax.request({
               url : basepath+'/workplatnoticeread.json',
               method : 'POST',
               params : {
                   isBat:true,
                   batString:noticeId,
                   methodNs:'create',
                   noticeId:noticeId
               },
               success : function(){
                   Ext.MessageBox.alert('已阅操作', '设置成功！');
                   reloadCurrentData();
               },
               failure : function(){
                   Ext.MessageBox.alert('已阅操作', '设置失败！');
                   reloadCurrentData();
               }
           }); 
}}
},
/**************导出*******************/
new Com.yucheng.crm.common.NewExpButton({
    formPanel : 'searchCondition',
    hidden:JsContext.checkGrant('notice_export'),
    url : basepath+'/noticequery.json'
}),{
	text : '新增',
	hidden:JsContext.checkGrant('notice_create'),
	handler : function(){
		showCustomerViewByTitle('新增');
	}
}];
var customerView = [{
	title : '新增',
	hideTitle : true,
	type : 'form',
	autoLoadSeleted : false,
	frame : true,
	groups : [{
	columnCount : 2,
	fields : [	'NOTICE_TITLE','NOTICE_LEVEL','ACTIVE_DATE','IS_TOP','RECEIVE_ORG','RECEIVE_ORG_NAME','TOP_ACTIVE_DATE'],
	fn : function(NOTICE_TITLE,NOTICE_LEVEL,ACTIVE_DATE,IS_TOP,RECEIVE_ORG,RECEIVE_ORG_NAME,TOP_ACTIVE_DATE){
		NOTICE_TITLE.text='公告标题';
		ACTIVE_DATE.text = '有效期至';
		RECEIVE_ORG_NAME.text ='接收机构范围';
		NOTICE_TITLE.gridField=true;
		NOTICE_LEVEL.gridField=true;
		ACTIVE_DATE.gridField=true;
		IS_TOP.gridField=true;
		TOP_ACTIVE_DATE.gridField=true;
		RECEIVE_ORG_NAME.gridField=true;
		return [NOTICE_TITLE,NOTICE_LEVEL,ACTIVE_DATE,IS_TOP,RECEIVE_ORG,RECEIVE_ORG_NAME,TOP_ACTIVE_DATE];
	}},{/**公告内容富文本编辑框**/
	columnCount:0.94,
	fields : ['NOTICE_CONTENT'],
	fn : function(NOTICE_CONTENT){
		NOTICE_CONTENT.text='公告内容';
		return [prodTabs];
	}
},{/**附件信息**/
	columnCount:0.94,
	fields:['TEST'],
	fn:function(TEST){
		createAnna = createAnnGrid(false,true,false,'<font color="red">(保存信息后可操作附件列表)</font>');
		return [createAnna];
	}
			}],
formButtons:[{
	id:'save',
	text : '保存',
	//保存数据					 
	fn : function(formPanel,baseform){						
		if(!baseform.isValid())
			{
				Ext.Msg.alert('提示','请输入完整！');
				return false;
			}
			var commintData = translateDataKey(baseform.getFieldValues(),_app.VIEWCOMMITTRANS);
			Ext.Msg.wait('正在提交数据，请稍等...','提示');
			Ext.Ajax.request({
 				url : basepath+'/workplatnotice.json',
 				method : 'POST',
 				params : commintData,
				success : function() {
					 Ext.Msg.alert('提示','操作成功！');
					 reloadCurrentData();
					 //保存公告内容和保存按钮隐藏，并且可对附件进行操作
					 Ext.Ajax.request({
						url : basepath+'/session-info!getPid.json',
						method : 'GET',
						success : function(a,b,v) {//返回id值，显示tbar
						    var noticeIdStr = Ext.decode(a.responseText).pid;
						    getCurrentView().setValues({
						    	NOTICE_ID:noticeIdStr
						    });
						    uploadForm.relaId = noticeIdStr;
						    createAnna.tbar.setDisplayed(true);
						    //保存公告内容
							content3.window.saveData(noticeIdStr);
							//保存按钮隐藏
							Ext.getCmp('save').hide();
							lockGrid();//锁定结果列表
				}
		});
				},
				failure : function(response) {
					var resultArray = Ext.util.JSON.decode(response.status);
			 		if(resultArray == 403) {
		           		Ext.Msg.alert('提示', response.responseText);
			 		}else{
						Ext.Msg.alert('提示', '操作失败,失败原因:' + response.responseText);
	 				}
				}
			});
		}
		}]	
}];
/**
 * 查询条件域对象渲染之后触发；
 * params ：con：查询条件面板对象；
 * 			app：当前APP对象；
 */
var afterconditionrender = function() {
	getConditionField('PUBLISH_TIME_START').fieldLabel = "发布日期范围";
	getConditionField('PUBLISH_TIME_END').fieldLabel = "至";
};

/***对应未阅读公告 详情面板划出前 未阅变为已阅***/
var beforeviewhide = function(view) {
	if(view.baseType == "detailView"){
		 var noticeId=getSelectedData().data.NOTICE_ID;
		 var isRead = getSelectedData().data.IS_READ;
		 var isPublished = getSelectedData().data.PUBLISHED;
		 if(getSelectedData() == false){
				Ext.Msg.alert('提示','请选择一条数据');
				return false;
		 }else{
			 if (isPublished !="pub002") {//未发布 不能置为已阅
				 if(isRead=="red001"){
					 return true;
				 }else{
					 Ext.Ajax.request({
						 url : basepath+'/workplatnoticeread.json',
						 method : 'POST',
						 params : {
							 isBat:true,
							 batString:noticeId,
							 methodNs:'create',
							 noticeId:noticeId
						 },
						 success : function(){
							 reloadCurrentData();
						 },
						 failure : function(){
							 reloadCurrentData();
						 }
					 }); 
		         }
	         }
		}
	}
};

/**view 滑入前控制**/
var beforeviewshow = function(view){
	/*修改查询面板滑入时，做相应判断，并加载相关附件信息*/
	if(view.baseType=='editView'||view.baseType == 'detailView'){
			if(getSelectedData() == false){
				Ext.Msg.alert('提示','请选择一条数据');
				return false;
			}else{//加载数据
				if(view.baseType=='editView'){
					var id = getSelectedData().data.NOTICE_ID;
					var creator = getSelectedData().data.CREATOR;
					var status = getSelectedData().data.STATUS;
					var isPublished = getSelectedData().data.PUBLISHED;
					//用于上传附件信息时 创建附件临时表
					if(isPublished =='pub001'){
						uploadForm.approval = 'approval';
					}
					
					var activeDate = getSelectedData().data.ACTIVE_DATE;
					var allowPub = true;
					var disPubStr = "";
			        if(creator!=__userId){
			            allowPub=false;
			            disPubStr += "【"+getSelectedData().data.NOTICE_TITLE+"】";
			        }
			        if(!allowPub){
			            Ext.Msg.alert('提示', '记录：'+disPubStr+"不是由您创建，您无权修改。");
			            return false;
			        }
			        if( status == '2'){
			        	Ext.Msg.alert('提示', '记录：【'+getSelectedData().data.NOTICE_TITLE+'】审核中,不允许修改操作!');
			            return false;
			        }
			        //加载公告内容
			        loadQueryData();
				}
				if(view.baseType == 'detailView'){
					var noticeId=getSelectedData().data.NOTICE_ID;
					Ext.Ajax.request({
						url:basepath+'/ocrmSysRicheditInfo!indexPage.json',
						method:'GET',
						params:{
							relId:noticeId
						},
						success:function(response){
							if(Ext.decode(response.responseText).json.data.length>0){
								var context = Ext.decode(response.responseText).json.data[0].content;
								prodTabs2.body.update(context);
							}else{
								prodTabs2.body.update("暂无公告内容");
							}
						},failure:function(){
						}
					});
				}
				var	noticeIdStr=getSelectedData().data.NOTICE_ID;
			    uploadForm.relaId = noticeIdStr;
                uploadForm.modinfo = 'notice';
                var condi = {};
                condi['relationInfo'] = noticeIdStr;
                condi['relationMod'] = 'notice';
                Ext.Ajax.request({
                    url:basepath+'/queryanna.json',
                    method : 'GET',
                    params : {
                        "condition":Ext.encode(condi)
                    },
                    failure : function(a,b,c){
                        Ext.MessageBox.alert('查询异常', '查询失败！');
                    },
                    success : function(response){
                        var anaExeArray = Ext.util.JSON.decode(response.responseText);
                        if(view.baseType=='editView'){
                        	editAnna.store.loadData(anaExeArray.json.data);
	                        editAnna.getView().refresh();
                        }else{
                        	detailAnna.store.loadData(anaExeArray.json.data);
	                        detailAnna.getView().refresh();
                        }
                    }
                });
			}		
	}
	/**新增面板滑入时清空附件列表*/
	if(view._defaultTitle=='新增'){//view.baseType=='createView'
		uploadForm.relaId = '';
		uploadForm.modinfo = 'notice';
		createAnna.store.removeAll();
		createAnna.tbar.setDisplayed(false);
		 //重置公告内容为空
        loadCreateData();
        Ext.getCmp('save').show();
        view.contentPanel.getForm().findField('TOP_ACTIVE_DATE').setVisible(false);
	}
	/*附件信息列表滑入时加载相关数据附件信息*/
	if(view._defaultTitle=='附件信息'){
		if(getSelectedData() == false){
			Ext.Msg.alert('提示','请选择一条数据！');
			return false;
		}else{
			var noticeId=getSelectedData().data.NOTICE_ID;
		    uploadForm.relaId = noticeId;
            uploadForm.modinfo = 'notice';
            var condi = {};
            condi['relationInfo'] = noticeId;
            condi['relationMod'] = 'notice';
            view.store.load({
            	 params : {
            		 "condition":Ext.encode(condi)
                 }
            });
	    }
	}
//	if(view._defaultTitle=='新增'){//view.baseType=='createView'
////		debugger;
////		var c =  getSelectedData().data.IS_TOP;
////		if('1' == c){
////			view.contentPanel.getForm().findField('TOP_ACTIVE_DATE').setVisible(true);
////		}else{
//			view.contentPanel.getForm().findField('TOP_ACTIVE_DATE').setVisible(false);
////		}
//	}
};	
//新增加载公告内容
function loadCreateData() {
	//新增时，仅仅是为了将iframe里面面板的内容清空,如果是第一次则不需要清空
	if(content3.window.queryData != undefined){
		content3.window.queryData('0');
	}
}

//修改加载公告内容
function loadQueryData() {
	if(content4.window.queryData == undefined){
		var task = new Ext.util.DelayedTask(loadQueryData); 
    	task.delay(100);
    	return false;
	}
	var id = getSelectedData().data.NOTICE_ID;
	content4.window.queryData(id);
}

/********新增面板保存数据后激活附件面板***********/
var afertcommit = function(){
	lockGrid();//锁定结果列表
	
	if(getCurrentView()._defaultTitle=='新增'){//激活附件view._defaultTitle=='新增'，getCurrentView().baseType=='createView'
		Ext.Ajax.request({
			url : basepath+'/session-info!getPid.json',
			method : 'GET',
			success : function(a,b,v) {//返回id值，显示tbar
			    var noticeIdStr = Ext.decode(a.responseText).pid;
			    getCurrentView().setValues({
			    	NOTICE_ID:noticeIdStr
			    });
			    uploadForm.relaId = noticeIdStr;
			    createAnna.tbar.setDisplayed(true);
			    //保存公告内容
				content3.window.saveData(noticeIdStr);
				//保存按钮隐藏
			}
		});
	}
	if(getCurrentView().baseType=='editView'){
		var noticeId=getSelectedData().data.NOTICE_ID;//getCurrentView().contentPanel.getForm().findField('NOTICE_ID').getValue();
		var state = getSelectedData().data.PUBLISHED; //getCurrentView().contentPanel.getForm().findField('PUBLISHED').getValue();
		//保存公告内容
		content4.window.saveData(noticeId);
	}
	
};

/**验证输入条件是否满足**/
var beforesetsearchparams = function(data){
	for(var key in data){
		if(data[key] instanceof Date){
			data[key] = data[key].format('Y-m-d');
		}
		if(data["PUBLISH_TIME_START"] != null && data["PUBLISH_TIME_START"] != "" && data["PUBLISH_TIME_END"] != null && data["PUBLISH_TIME_END"] != ""){
			if(data["PUBLISH_TIME_START"]>data["PUBLISH_TIME_END"]){
				 Ext.MessageBox.alert('条件异常', '开始时间应该小于等于结束时间！');
                 return false;
			}
		}else{
			return;
		}
	}
};
var afterinit = function(view){
	if(ifCharge == 'fb'){
		Ext.getCmp('fb').show();
		Ext.getCmp('fbsh').hide();
	}else{
		Ext.getCmp('fb').hide();
		Ext.getCmp('fbsh').show();
	}
}
var prodTabs = new Ext.form.FieldSet({//新增
	collapsible:true,
	title : '公告内容',
	items : [{html:'<iframe id="content3" name="content3" style="width:100%;height:370px;" frameborder="no"" src=\"'
		+ basepath + '/contents/pages/demo/docs/doc2.jsp?nodeId='+0+ '\" scrolling="auto"/> '}]
});

var prodTabs1 = new Ext.form.FieldSet({//修改
	collapsible:true,
	title : '公告内容',
	id:'panel',
	items : [{html:'<iframe id="content4" name="content4" style="width:100%;height:370px;" frameborder="no"" src=\"'
		+ basepath + '/contents/pages/demo/docs/doc2.jsp?nodeId='+0+ '\" scrolling="auto"/> '}]
});
var prodTabs2 = new Ext.form.FieldSet({//详情
	collapsible:true,
	title : '公告内容'
});

