/**
 * 指定流程下一节点办理人（提交流程申请）
 */
var rightSlectNextNodePanel = new Ext.FormPanel({
	instanceId:'',//流程实例id
	nodeId:'',//流程当前节点id
	nextnodeId:'',//流程下一办理节点id
	nextnodeName:'',//流程下一办理节点名称
	frame : true,
//	region : 'center',
	buttonAlign:'center',
	autoScroll : true,
//	title:'下一审批步骤',
	labelAlign:'right',
	items : []
});

/**
 * 指定流程下一节点办理人window
 */
var selectNextNodeWindow = new Ext.Window({
    width : 500,
    height :240,
    layout:'fit',
    title:'指定下一办理人',
    closable : false,
    resizable : false,
    collapsible : false,
    draggable : true,
    closeAction : 'hide',
    modal : true, 
    animCollapse : false,
    maximizable : true,
    border : false,
	animateTarget : Ext.getBody(),
    closable : true,
    isHideFlag: false,//是否直接点击X，手动关闭“下一办理人”窗口
    constrain : true,
    buttonAlign:'center',
    items : [rightSlectNextNodePanel],
    listeners:{
    	viewshow:function(){
    		selectNextNodeWindow.isHideFlag = false;
    	},
    	hide:function(){
    		if(!selectNextNodeWindow.isHideFlag){
    			//关闭Ext.Msg.wait.....,是否直接点击X，手动关闭“下一办理人”窗口
    			//Ext.Msg.alert('提示','流程未提交至下一办理人，后续可在[待办工作]中手动提交!');
				Ext.MessageBox.confirm('提示','您确定撤销办理吗?',function(buttonId){
					if(buttonId.toLowerCase() == "no"){
						return;
					}
					Ext.Ajax.request({
						url : basepath + '/EchainCommon!wfCancel.json',
						method : 'GET',
						params:{
							instanceID:rightSlectNextNodePanel.instanceId,
							nodeID:rightSlectNextNodePanel.nodeId
					    },
						success : function(response) {
							Ext.Msg.alert("提示", Ext.util.JSON.decode(response.responseText).tip);
							selectNextNodeWindow.isHideFlag = true;
							selectNextNodeWindow.hide();
					    },
					    failure : function(){
					    	Ext.Msg.alert("提示", '操作失败，后续可在[待办工作]中撤销办理');
					    	selectNextNodeWindow.isHideFlag = true;
							selectNextNodeWindow.hide();
					    }
					});
				});
				return false;
    		}
    		try{
				reloadCurrentData();
			}catch(e){
			}
			selectNextNodeWindow.isHideFlag = false;
    	}
    },
	buttons:[{
	    text: '提交',
	    handler:function(){
	    	if(!rightSlectNextNodePanel.getForm().isValid()){
	            Ext.MessageBox.alert('提示', '请选择下一办理人！');
	            return false;
	        }
	    	var nextNodeUser ='';
	        if(rightSlectNextNodePanel.items.items.length>0){//是否存在办理人
				for(var i=0;i<rightSlectNextNodePanel.items.items.length;i++){//循环办理人列表
					var ifselectnextnodeUser = false;
					var selectnextUserList = '';
					for(var m=0;m<rightSlectNextNodePanel.items.items[i].items.items.length;m++){
	        			if(rightSlectNextNodePanel.items.items[i].items.items[m].checked==true){
	        				ifselectnextnodeUser=true;
	        				if(selectnextUserList==''){
	        					selectnextUserList =rightSlectNextNodePanel.items.items[i].items.items[m].inputValue;
	        				}else {
	        					selectnextUserList = selectnextUserList+';'+	rightSlectNextNodePanel.items.items[i].items.items[m].inputValue;
	        				}
	        			}
	        		}
					nextNodeUser=nextNodeUser+selectnextUserList;
					if(!ifselectnextnodeUser){
						 Ext.MessageBox.alert('提示', '请选择办理人！');
			             return false;
					}
				}
			}
	//			alert('instanceId：'+rightSlectNextNodePanel.instanceId +'\nnodeId：'+rightSlectNextNodePanel.nodeId+
	//			'\nnextNodeId：'+rightSlectNextNodePanel.nextnodeId+'\nnextNodeUser：'+nextNodeUser);
	       	 OneWfCompleteJob(rightSlectNextNodePanel.instanceId,rightSlectNextNodePanel.nodeId
	        	,rightSlectNextNodePanel.nextnodeId,nextNodeUser);
	   	 }
    }]
});

/**
 * 可选择的用户列表(警告：必须在流程初始化后调用此方法，否则将会报系统错误)
 * @param {} instanceId //流程实例id
 * @param {} nextnodeId //流程下一办理节点id
 * @param {} nextnodeName //下一办理节点名称
 * @param {} nodeId //流程当前节点id
 */
var selectUserList = function(instanceId,nodeId,nextnodeId,nextnodeName){
	rightSlectNextNodePanel.instanceId = instanceId,
	rightSlectNextNodePanel.nodeId = nodeId;
	rightSlectNextNodePanel.nextnodeId = nextnodeId;
	rightSlectNextNodePanel.nextnodeName = nextnodeName;
	//清除上一次的用户列表
	rightSlectNextNodePanel.removeAll();
	Ext.Ajax.request({
		url : basepath + '/EchainCommon!getNodeUserList.json',
		method : 'GET',
		params : {
			InstanceID:instanceId,
			nodeID : nextnodeId
		},
		waitMsg : '正在查询下一节点用户,请等待...', // 显示读盘的动画效果，执行完成后效果消失
		success : function(b) {
			var nextUserList = Ext.decode(b.responseText);
			if(nextUserList.nodeUsers.length>0){
				var radioName = nextnodeId+'RadioGroup';
				var nodemulteitFlagFlag = 'CheckboxGroup';
				if(nextUserList.multeitFlag != 'n'){
					nodemulteitFlagFlag = 'RadioGroup';
				}
				nextUserListcheck ='';
				for(var i = 0; i<nextUserList.nodeUsers.length;i++){
					if(nodemulteitFlagFlag=='CheckboxGroup'){
						radioName=nextnodeId+i;
					}
					//判断是角色还是用户
					var tempStr = nextUserList.nodeUsers[i].userId==''?'':nextUserList.nodeUsers[i].userId;
					var tempType = tempStr.split('.')[0];
					if(tempType == 'R'){
						continue;
					}
					if(i==0 || nextUserListcheck ==''){
						nextUserListcheck = '{name:\''+radioName+'\',inputValue:\''+nextUserList.nodeUsers[i].userId+'\',boxLabel:\''+nextUserList.nodeUsers[i].userName+'\',checked:true}';
					}else{
						nextUserListcheck = nextUserListcheck+',{name:\''+radioName+'\',inputValue:\''+nextUserList.nodeUsers[i].userId+'\',boxLabel:\''+nextUserList.nodeUsers[i].userName+'\'}';
					}
				}
				eval('var nextUserListcheckbox = new Ext.form.'+nodemulteitFlagFlag+'({'+
						'allowBlank :\'false\','+
						'columns:3,' +
						'hideLabel :true,' +
						'anchor : \'95%\',' +
						'items : ['+nextUserListcheck+']});');
				rightSlectNextNodePanel.add(nextUserListcheckbox);
//				selectNextNodeWindow.buttons[0].show();
				rightSlectNextNodePanel.doLayout();
				selectNextNodeWindow.show();
			}else{
				Ext.Msg.alert('提示', '暂无符合条件的流程办理人员，后续可在[待办工作]中手动提交!' );
				try{
					reloadCurrentData();
				}catch(e){
				}
			}
		},
		failure : function() {
			Ext.Msg.alert('提示', '未找到下一办理人!' );
		}
	});
};

/**
 * 
 * @param {} instanceId 流程实例号
 * @param {} nodeId	当前节点id
 * @param {} nextNodeId	下一节点id
 * @param {} nextNodeUser	下一办理人id
 */
var OneWfCompleteJob=function(instanceId,nodeId,nextNodeId,nextNodeUser){
	if(instanceId == '' || instanceId == undefined){
		Ext.Msg.alert('提示','流程实例号不能为空！');
		return false;
	}
	if(nodeId == '' || nodeId == undefined){
		Ext.Msg.alert('提示','流程当前节点不能为空！');
		return false;
	}
	if(nextNodeId == '' || nextNodeId == undefined){
		Ext.Msg.alert('提示','流程下一办理节点不能为空！');
		return false;
	}
	if(nextNodeUser == '' || nextNodeUser == undefined){
		Ext.Msg.alert('提示','流程下一办理人不能为空！');
		return false;
	}
	Ext.Ajax.request({
		url : basepath + '/EchainCommon!wfCompleteJob.json',
		method : 'GET',
		params : {
			instanceID:instanceId,
			nodeID :nodeId,
			nodeStatus:0,
			nextNodeID:nextNodeId,
			nextNodeUser:nextNodeUser
		},
		waitMsg : '正在提交申请,请等待...', // 显示读盘的动画效果，执行完成后效果消失
		success : function(a) {
			var returnText=Ext.decode(a.responseText);
			//Ext.Msg.alert('提示','提交申请成功,下一节点:'+returnText.nextNodeName+',下一办理人:'+returnText.nextUserName);
			Ext.Msg.alert('提示','指定下一办理人成功!');
			selectNextNodeWindow.isHideFlag = true;
			selectNextNodeWindow.hide();
		},
		failure : function() {
			Ext.Msg.alert('提示', '指定下一办理人失败!' );
			selectNextNodeWindow.isHideFlag = false;
			selectNextNodeWindow.hide();
		}
	});
};
