Ext.ns('Wlj.frame.functions.plugin');
Wlj.frame.functions.plugin.Initflow = function(config){
	if(!config.appObject.needCondition){
		return this.destroyed = true;
	}
	this.appObject = config.appObject;
	this.initialView();
};
Ext.extend(Wlj.frame.functions.plugin.Initflow, Ext.util.Observable, {
	initialView : function(){
		var searchPanel = this.appObject.searchDomain.searchPanel;
		var _this = this;
		
		/**
		 * TODO 添加发起流程的按钮：
		 * 		点击该按钮能够填出新增发起流程的面板。
		 * 		弹出面板：包含业务信息，以及流程信息。
		 * 		
		 */
		searchPanel.addButton({
			text : '发起业务申请'
		}, function(){
			_this.buildInitialWindow();
		}, this);
		
		/**
		 * TODO 构建本功能内部与本人相关的流程实例信息
		 * 		列表链接后台根据resId查询的方法；
		 * 		靠后。。。
		 */
		
	},
	
	
	getBuilt : function(){
		
	},
	
	/**
	 * 构建发起面板（新增流程面板）
	 */
	buildInitialWindow : function(){
		var taskMgr = parent.Wlj?parent.Wlj.TaskMgr:undefined;
		var p = parent;
		for(var i=0;i<10 && !taskMgr;i++){
			p = p.parent;
			taskMgr = p.Wlj?p.Wlj.TaskMgr:undefined;
		}
		var data = getAllSelects();
		this.dataStr = false;
		if(data.length>0){
			this.dataStr = data[0].data;
		}
		var _this = this;
		if(!_this.initialWindow){
			_this.initialPanel = new Wlj.frame.functions.plugin.Initflow.BizAppPanel({
				relResId : JsContext._resId,
				afterOpFn : function(){
					_this.initialWindow.hide();
					if(typeof reloadCurrentData == 'function'){
						reloadCurrentData();
					}
				}
			});
			_this.initialWindow = new Ext.Window({
				width : 800,
				height : 'auto',
				title : '发起业务申请',
				modal : true,
				layout : 'form',
				closeAction : 'hide',
				buttonAlign : 'center',
				/**
				 * TODO 1、面板内容包括路程的一些基本信息；
				 * 		2、以及业务数据的展示信息。（之前构建的数据信息,根据当前获取的数据展示。这个展示需要王印协助，明天給席晓勇展示的时候，可以固定写死几个字段，把数据展示一下就可以。）
				 * 		3、最好可以先把你的那个地铁图放一个上去，固定死就好，用于展示已经经过的节点。鼠标浮动的时候，可以任意展示一个信息小框就可以。用于展示该节点会办个人的意见。类似QQ聊天记录一样逐行展示即可。
				 */
				//html : '功能：'+taskMgr.getTask('task_'+JsContext._resId).name+'<br>'+this.dataStr,
				items : [_this.initialPanel],
				
				buttons : [{
					text : '提交',
					handler : function(){
						/**
						 * TODO initial to the workflow
						 * 		resId : JsContext._resId
						 * 		resName : taskMgr.getTask('task_'+JsContext._resId).name
						 * 		data : getAllSelects()
						 * 		附件？
						 * 		
						 */
						_this.initialPanel.saveBusiFn();
					}
				},{
					text : '取消',
					handler : function(){
						_this.initialWindow.hide();
					}
				}]
			});
			_this.initialWindow.on('hide',function(){
				_this.initialPanel.resetpanel();
			});
		}
		_this.initialWindow.show();
	}
});

Wlj.frame.functions.plugin.Initflow.BizAppPanel = Ext.extend(Ext.Panel,{
	relResId : false,
	editable : true,
	afterOpFn : Ext.emptyFn,
	requiredLabel : '<font color=red>*</font>',
	frame : true,
	layout : 'form',
	afterRender : function(){
		var _this = this;
		_this.buildInfoPanel();
		if(_this.editable){
			_this.buildAttachPanel();
			_this.setDefaultBizAppData();
		}else{
			_this.setEditableFn();
			_this.buildAttachGrid();
		}
		Wlj.frame.functions.plugin.Initflow.BizAppPanel.superclass.afterRender.call(_this);
	},
	buildInfoPanel : function(){
		var _this = this;
		_this.zbBizCateStore = new Ext.data.Store({
    		sortInfo: {
	    	    field: 'key',
	    	    direction: 'ASC'
	    	},
    		restful : true,   
    		autoLoad : true,
    		proxy : new Ext.data.HttpProxy({
    				url :basepath+'/lookup.json?name=ZB_BIZ_CATE'
    		}),
    		reader : new Ext.data.JsonReader({
    			root : 'JSON'
    		}, [ 'key', 'value' ])
    	});
		_this.infopanel = new Ext.form.FormPanel({
			frame : true,
			layout : 'column',
			items : [{
				layout : 'form',
				columnWidth : 0.5,
				items : [
					{xtype:'textfield',name: 'APP_TITLE',fieldLabel: _this.requiredLabel + '标题',labelStyle: 'text-align:right;',allowBlank: false,anchor : '90%'},
					{xtype:'textfield',name: 'CREATE_USER_NAME',fieldLabel: '申请人',labelStyle: 'text-align:right;',cls:'x-readOnly',readOnly:true,anchor : '90%'},
					{xtype:'textfield',name: 'CREATE_ORG_NAME',fieldLabel: '申请人所属机构',labelStyle: 'text-align:right;',cls:'x-readOnly',readOnly:true,anchor : '90%'}
				]
			},{
				layout : 'form',
				columnWidth : 0.5,
				items : [
					{xtype:'combo',name: 'APP_TYPE',hiddenName : 'APP_TYPE',fieldLabel : _this.requiredLabel + '业务申请类型',labelStyle: 'text-align:right;',triggerAction : 'all',forceSelection:true,mode : 'local',
						store : _this.zbBizCateStore,displayField : 'value',valueField : 'key',typeAhead : true,editable:false,allowBlank: false,resizable : true,anchor : '90%'},
					{xtype:'datefield',name: 'CREATE_TIME',fieldLabel: '申请日期',labelStyle: 'text-align:right;',format:'Y-m-d',cls:'x-readOnly',readOnly:true,anchor : '90%'}
				]
			},{
				layout : 'form',
				columnWidth : 0.99,
				items : [
					{xtype:'textfield',name: 'REL_RES_ID',hidden:true},
					{xtype:'textfield',name: 'REL_BIZ_ID',hidden:true},
					{xtype:'textarea',name: 'DESCRIPTION',fieldLabel: _this.requiredLabel + '描述',labelStyle: 'text-align:right;',allowBlank: false,anchor : '96%'}
				]
			}]
		});
		_this.add(_this.infopanel);
	},
	buildAttachPanel : function(){
		var _this = this;
		_this.attachpanel = new Ext.form.FormPanel({
			getFieldValues : function(){
				return {};
			},
			height : 60,
			fileUpload : true,
			dataName:'file',
			frame:true,
			relaId : '',/**关联数据ID*/
			modinfo : 'bizapp',/**modinfo: bizapp:业务申请;customer:客户;infomation:资讯;*/
			items : [
				{xtype : 'textfield',name : 'attachname',inputType : 'file',multiple : 'multiple',fieldLabel : '附件名称',labelStyle: 'text-align:right',anchor:'95%'}
			]
		});
		_this.add(_this.attachpanel);
	},
	buildAttachGrid : function(){
		var _this = this;
		_this.attachgrid = new Wlj.widgets.views.module.grid.GridPanel({
			url : basepath + '/queryanna.json',
			height : 150,
			pageable : false,
			isCsm : false,
			fields: [
				{name : 'ANNEXE_ID',text : '附件ID',hidden:true},
				{name : 'RELATION_INFO',text : 'RELATION_INFO',hidden : true},
				{name : 'RELATIOIN_MOD',text : 'RELATIOIN_MOD',hidden : true},
				{name : 'ANNEXE_NAME',text : '附件名称',width : 200},
				{name : 'ANNEXE_SIZE',text : '附件大小(字节)',hidden : true},
				{name : 'LOAD_COUNT',text : '下载次数',width : 60,sortable : true},
				{name : 'CLIENT_NAME',text : '附件上传者姓名',width : 120,sortable : true},
				{name : 'CREATE_TIME',text : '附件上传时间',width : 110,sortable : true},
				{name : 'LAST_LOAD_TIME',text : '最近下载时间',width : 110,sortable : true},
				{name : 'LAST_LOADER',text : '最近下载者姓名',width : 120,sortable : true},
				{name : 'PHYSICAL_ADDRESS',text : '物理文件名',hidden : true}
			],
			gridButtons:[{
				text : '下载',
				fn : function(grid){
					var selectLength = grid.getSelectionModel().getSelections().length;
					if(selectLength != 1){
						Ext.Msg.alert('提示','请先选择一条记录');
						return false;
					}
					var selectRecord = grid.getSelectionModel().getSelections()[0];
					var annexeName = selectRecord.data.ANNEXE_NAME;
					var fileNameStr = selectRecord.data.PHYSICAL_ADDRESS;
					var annexeId = selectRecord.data.ANNEXE_ID;
					var relationMod = selectRecord.data.RELATIOIN_MOD;
					var relationInfo = selectRecord.data.RELATION_INFO;
					window.open( basepath+'/AnnexeDownload?filename='+fileNameStr+'&annexeName='+annexeName,'', 'height=100, width=200, top=300, left=500, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
					Ext.Ajax.request({
						url : basepath + '/workplatannexe.json',
						method : 'POST',
						params : {
							annexeId : annexeId
						},
						success : function(a, b) {
							_this.attachgrid.loadFn({
								condition : Ext.encode({relationMod : relationMod,relationInfo : relationInfo})
							});
						},
						failure : function(a, b) {
						}
					});
				}
			}]
		});
		_this.add({
			xtype : 'fieldset',
			title : '附件列表',
			anchor : '96%',
			items : [_this.attachgrid.grid]
		});
	},
	uploadFiles : function(callback){
		var _this = this;
		var mods = _this.attachpanel.modinfo;
	    var reins = _this.attachpanel.relaId;
		var attachname = _this.attachpanel.getForm().findField('attachname').getValue();
		if(attachname == "" || attachname == undefined || mods==undefined ||mods=='' || !_this.attachpanel.getForm().isValid()){
			if(typeof callback === 'function'){
				callback.call(_this);
			}
			return false;
		}
    	_this.attachpanel.getForm().submit({
            url : basepath + '/FileUpload',
            success : function(form,o){
				var _tempFileName = Ext.util.JSON.decode(o.response.responseText).realFileName;
                var simpleFileName = attachname.substring(attachname.lastIndexOf("\\")+1, attachname.length);
                Ext.Ajax.request({
					url : basepath + '/workplatannexe.json',
					method : 'POST',
					params : {
						annexeName : simpleFileName,
						physicalAddress : _tempFileName,
						relationInfo : reins,
						relationMod : mods,
						annexeSize : _annaSize,
						clientName : __userName
					},
					success : function(a, b) {
						if(typeof callback === 'function'){
							callback.call(_this);
						}
					},
					failure : function(a, b) {
					}
				});
            },
            failure : function(form, o){
            	if (o.result.reason == "SizeLimitExceeded"){
					Ext.Msg.alert('操作提示', '文件上传失败,文件超出最大限制!');
            	} else{
					Ext.Msg.alert('操作提示', '文件上传失败!');
            	}
            }
        });
        return true;
	},
	setDefaultBizAppData : function(){
		var _this = this;
		_this.infopanel.getForm().findField('CREATE_USER_NAME').setValue(__userName);
		_this.infopanel.getForm().findField('CREATE_ORG_NAME').setValue(__unitname);
		_this.infopanel.getForm().findField('CREATE_TIME').setValue(new Date().format('Y-m-d'));
		_this.infopanel.getForm().findField('REL_RES_ID').setValue(_this.relResId);
	},
	setEditableFn : function(){
		if(!this.editable){
			var form = this.infopanel.getForm();
			var fieldArr = ['APP_TITLE','APP_TYPE','DESCRIPTION'];
			for(var i=0;i<fieldArr.length;i++){
				form.findField(fieldArr[i]).setReadOnly(true);
				form.findField(fieldArr[i]).addClass('x-readOnly');
			}
		}
	},
	resetpanel : function(){
		var _this = this;
		_this.infopanel.getForm().reset();
		_this.attachpanel.getForm().reset();
	},
	saveBusiFn : function(){
		var _this = this;
		if(!_this.infopanel.getForm().isValid()){
			Ext.Msg.alert('提示','输入错误或存在漏输入项,请检查！');
			return;
		}
		var comitData = _this.infopanel.getForm().getFieldValues();
		comitData = translateDataKey(comitData,_app.VIEWCOMMITTRANS);
		Ext.Msg.wait('正在保存...请稍等！');
		Ext.Ajax.request({
			url : basepath + '/bizAppInfo.json',
			method : 'POST',
			params : comitData,
			success:function(response){
				_this.attachpanel.relaId = Ext.util.JSON.decode(response.responseText).json;
				_this.uploadFiles(_this.initWorkFlow);
			},
			failure : function(response){
				Ext.Msg.alert('提示', '保存流程操作失败,请联系系统管理员!');
			}
		});
	},
	initWorkFlow : function(){
		var _this = this;
		var busiDataObj = _this.infopanel.getForm().getFieldValues()
		var paramObj = {
			bizappflowflag : true,
			bizTableName : 'F_WP_BIZAPP_INFO',	//申请业务表名，注意此业务表中必须包含字段：WF_APPR_STS，用于流程流转时更新状态
			pkCol : 'APP_BIZ_ID',			//申请业务表主键字段
			pkValue : _this.attachpanel.relaId,//申请流水号
			wfiStatus : '000',			//提交流程时，业务当前的审批状态,000 待发起
			applType : busiDataObj.APP_TYPE,				//申请类型
			commentContent : busiDataObj.DESCRIPTION,	//初始化流程意见，实际发起流程此字段可选
			
			inputId : __userName,
			applyDate : new Date().format('Y-m-d'),
			inputBrId : __unitname,
			cusName : busiDataObj.APP_TITLE
		};
		/**
		 * _ECHAINMGR.initEchainWork流程初始化方法
		 * 业务提交，发起流程说明：
		 * 1. 设置emp表单元素
		 * 	必须有：
		 * paramObj = {
		 *	bizTableName : '',	//申请业务表名，注意此业务表中必须包含字段：WF_APPR_STS，用于流程流转时更新状态
		 *	pkCol : '',			//申请业务表主键字段
		 *	pkValue : '',		//申请流水号
		 *	wfiStatus : '000',	//提交流程时，业务当前的审批状态,000 待发起
		 *	applType : '',		//申请类型
		 *	commentContent : '' //初始化流程意见，实际发起流程此字段可选
		 *	//更多参数说明,见_ECHAINMGR.initEchainWork方法说明
		 * }
		 *	@param busiDataObj业务数据对象
		 *	@param callbackFn 调用初始化流程成功之后回调
		 */
		_ECHAINMGR.initEchainWork(paramObj,function(){
			//保存成功之后不作操作???
			_this.afterOpFn();
		});
	}
});
