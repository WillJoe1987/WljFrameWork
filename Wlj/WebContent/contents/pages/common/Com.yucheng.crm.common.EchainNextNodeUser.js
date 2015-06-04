Ext.ns('Com.yucheng.crm.common');

/**
 * 同时提交多个流程至下一节点办理人,仅限于全行客户查询处使用
 * @class Com.yucheng.crm.common.EchainNextNodeUser
 * @extends Ext.Window
 */
Com.yucheng.crm.common.EchainNextNodeUser = Ext.extend(Ext.Window, {
	wfArr : [],
	instanceId : '',	//流程实例号
	nodeId : '',		//流程当前节点
	nextNodeId : '',	//流程下一节点
	nextNodeUser : '',	//流程下一办理人
	width : 500,
    height : 240,
    layout : 'fit',
    title: '指定下一办理人',
    resizable : false,
    collapsible : false,
    draggable : true,
    closeAction : 'close',
    modal : true, 
    animCollapse : false,
    maximizable : true,
    border : false,
	animateTarget : Ext.getBody(),
    closable : true,
    isHideFlag: false,//是否直接点击X，手动关闭“下一办理人”窗口
    constrain : true,
    buttonAlign:'center',
	initComponent : function(){
		var _this = this;
		
		/**
		 * 指定流程下一节点办理人（提交流程申请）
		 */
		_this.rightSlectNextNodePanel = new Ext.FormPanel({
			frame : true,
			buttonAlign:'center',
			autoScroll : true,
			labelAlign:'right',
			items : []
		});
		Ext.Ajax.request({
			url : basepath + '/EchainCommon!getNodeUserList.json',
			method : 'GET',
			params : {
				InstanceID: _this.instanceId,
				nodeID : _this.nextNodeId
			},
			waitMsg : '正在查询下一节点用户,请等待...', // 显示读盘的动画效果，执行完成后效果消失
			success : function(b) {
				var nextUserList = Ext.decode(b.responseText);
				if(nextUserList.nodeUsers.length>0){
					var radioName = _this.nextNodeId+'RadioGroup';
					var nodemulteitFlagFlag = 'CheckboxGroup';
					if(nextUserList.multeitFlag != 'n'){
						nodemulteitFlagFlag = 'RadioGroup';
					}
					nextUserListcheck ='';
					for(var i = 0; i<nextUserList.nodeUsers.length;i++){
						if(nodemulteitFlagFlag=='CheckboxGroup'){
							radioName=_this.nextNodeId+i;
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
					_this.rightSlectNextNodePanel.add(nextUserListcheckbox);
	//				selectNextNodeWindow.buttons[0].show();
					_this.rightSlectNextNodePanel.doLayout();
					_this.add(_this.rightSlectNextNodePanel);
					_this.doLayout();
					_this.show();
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
		
		Com.yucheng.crm.common.EchainNextNodeUser.superclass.initComponent.call(_this);
	},
	onRender : function(ct, position){
		var _this = this;
		Com.yucheng.crm.common.EchainNextNodeUser.superclass.onRender.call(this, ct, position);
	},
	/**
	 * @param {} instanceId 流程实例号
	 * @param {} nodeId	当前节点id
	 * @param {} nextNodeId	下一节点id
	 * @param {} nextNodeUser	下一办理人id
	 */
	OneWfCompleteJob : function(){
		var _this = this;
		
		if(_this.instanceId == '' || _this.instanceId == undefined){
			Ext.Msg.alert('提示','流程实例号不能为空！');
			return false;
		}
		if(_this.nodeId == '' || _this.nodeId == undefined){
			Ext.Msg.alert('提示','流程当前节点不能为空！');
			return false;
		}
		if(_this.nextNodeId == '' || _this.nextNodeId == undefined){
			Ext.Msg.alert('提示','流程下一办理节点不能为空！');
			return false;
		}
		if(_this.nextNodeUser == '' || _this.nextNodeUser == undefined){
			Ext.Msg.alert('提示','流程下一办理人不能为空！');
			return false;
		}
		if(_this.wfArr.length > 1){
			for(var i=0;i<_this.wfArr.length;i++){
				Ext.Ajax.request({
					url : basepath + '/EchainCommon!wfCompleteJob.json',
					method : 'GET',
					params : {
						instanceID: _this.wfArr[i].instanceid,
						nodeID : _this.wfArr[i].currNode,
						nodeStatus:0,
						nextNodeID: _this.wfArr[i].nextNode,
						nextNodeUser: _this.nextNodeUser
					},
					waitMsg : '正在提交申请,请等待...', // 显示读盘的动画效果，执行完成后效果消失
					success : function(a) {
						var returnText=Ext.decode(a.responseText);
						Ext.Msg.alert('提示','指定下一办理人成功!');
						_this.isHideFlag = true;
						_this.hide();
					},
					failure : function() {
						Ext.Msg.alert('提示', '指定下一办理人失败!' );
						_this.isHideFlag = false;
						_this.hide();
					}
				});
			}
		}else{
			Ext.Ajax.request({
				url : basepath + '/EchainCommon!wfCompleteJob.json',
				method : 'GET',
				params : {
					instanceID: _this.instanceId,
					nodeID : _this.nodeId,
					nodeStatus:0,
					nextNodeID: _this.nextNodeId,
					nextNodeUser: _this.nextNodeUser
				},
				waitMsg : '正在提交申请,请等待...', // 显示读盘的动画效果，执行完成后效果消失
				success : function(a) {
					var returnText=Ext.decode(a.responseText);
					Ext.Msg.alert('提示','指定下一办理人成功!');
					_this.isHideFlag = true;
					_this.hide();
				},
				failure : function() {
					Ext.Msg.alert('提示', '指定下一办理人失败!' );
					_this.isHideFlag = false;
					_this.hide();
				}
			});
		}
		
	},
	buttons:[{
	    text: '提交',
	    handler:function(){
	    	var _this = this.ownerCt.ownerCt;
	    	if(!_this.rightSlectNextNodePanel.getForm().isValid()){
	            Ext.MessageBox.alert('提示', '请选择下一办理人！');
	            return false;
	        }
	    	_this.nextNodeUser ='';
	        if(_this.rightSlectNextNodePanel.items.items.length>0){//是否存在办理人
				for(var i=0;i<_this.rightSlectNextNodePanel.items.items.length;i++){//循环办理人列表
					var ifselectnextnodeUser = false;
					var selectnextUserList = '';
					for(var m=0;m<_this.rightSlectNextNodePanel.items.items[i].items.items.length;m++){
	        			if(_this.rightSlectNextNodePanel.items.items[i].items.items[m].checked==true){
	        				ifselectnextnodeUser=true;
	        				if(selectnextUserList==''){
	        					selectnextUserList =_this.rightSlectNextNodePanel.items.items[i].items.items[m].inputValue;
	        				}else {
	        					selectnextUserList = selectnextUserList+';'+_this.rightSlectNextNodePanel.items.items[i].items.items[m].inputValue;
	        				}
	        			}
	        		}
					_this.nextNodeUser=_this.nextNodeUser+selectnextUserList;
					if(!ifselectnextnodeUser){
						 Ext.MessageBox.alert('提示', '请选择办理人！');
			             return false;
					}
				}
			}
	       	_this.OneWfCompleteJob();
	   	 }
    }],
	listeners:{
    	viewshow:function(){
    		this.isHideFlag = false;
    	},
    	beforehide:function(){
    		var _this = this;
    		if(!_this.isHideFlag){
    			//关闭Ext.Msg.wait.....,是否直接点击X，手动关闭“下一办理人”窗口
    			//Ext.Msg.alert('提示','流程未提交至下一办理人，后续可在[待办工作]中手动提交!');
				Ext.MessageBox.confirm('提示','您确定撤销办理吗?',function(buttonId){
					if(buttonId.toLowerCase() == "no"){
						return;
					}
					if(_this.wfArr.length > 1){
						for(var i=0;i<_this.wfArr.length;i++){
							Ext.Ajax.request({
								url : basepath + '/EchainCommon!wfCancel.json',
								method : 'GET',
								params:{
									instanceID: _this.wfArr[i].instanceid,
									nodeID: _this.wfArr[i].currNode
							    },
								success : function(response) {
									Ext.Msg.alert("提示", Ext.util.JSON.decode(response.responseText).tip);
									_this.isHideFlag = true;
									_this.hide();
							    },
							    failure : function(){
							    	Ext.Msg.alert("提示", '操作失败，后续可在[待办工作]中撤销办理');
							    	_this.isHideFlag = true;
									_this.hide();
							    }
							});
						}
					}else{
						Ext.Ajax.request({
							url : basepath + '/EchainCommon!wfCancel.json',
							method : 'GET',
							params:{
								instanceID:_this.instanceId,
								nodeID:_this.nodeId
						    },
							success : function(response) {
								Ext.Msg.alert("提示", Ext.util.JSON.decode(response.responseText).tip);
								_this.isHideFlag = true;
								_this.hide();
						    },
						    failure : function(){
						    	Ext.Msg.alert("提示", '操作失败，后续可在[待办工作]中撤销办理');
						    	_this.isHideFlag = true;
								_this.hide();
						    }
						});
					}
				});
				return false;
    		}
    		try{
				reloadCurrentData();
			}catch(e){
			}
			_this.isHideFlag = false;
    	}
    }
});

/**
 * 可选择的用户列表(警告：必须在流程初始化后调用此方法，否则将会报系统错误)
 * @param {} ret
 * @param {} instanceId //流程实例id
 * @param {} nextNodeId //流程下一办理节点id
 * @param {} nodeId //流程当前节点id
 */
window.selectUserListNew = function(wfArr,instanceId,nodeId,nextNodeId){
	var selWin =new Com.yucheng.crm.common.EchainNextNodeUser({
		wfArr : wfArr,
		instanceId : instanceId,
		nodeId :nodeId,
		nextNodeId : nextNodeId
	});
};
