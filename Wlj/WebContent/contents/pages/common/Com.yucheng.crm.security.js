/**
 * 认证前台管理器
 * @author CHANGZH
 * @since 2012-12-04
 */
Ext.ns("Com.yucheng.crm.security");

Com.yucheng.crm.security.Util = {
		isCloseWinAfterInitRole : true,						//关闭窗体前是否必须选定角色
		isForceShowRoleInfo : false,						//强制显示角色选窗口(可实现有权限的角色切换)
		isRemoveRoleTab : true,								//初始化完权限及菜单时，是否移除角色tab页签
		isShowStepBtn : false,								//是否显示上一步下一步按钮名称
		preStepName : '上一步',								//上一步按钮名称
		nextStepName : '下一步'  							//下一步按钮名称
	};
SECUTILS = Com.yucheng.crm.security.Util;
Com.yucheng.crm.security.SecurityBooter = function(indexBooter){
	
	var _this = this;
	/**初始化indexBooter*/
	_this.setSecIndex(indexBooter);
	/**权限是否已经初始化过，刷新时判断使用*/
	if (JsContext._roleId.length > 0) {
		_this.grantsLoaded = true;
	}
	/**初始化*/
	_this.init();	
};
Com.yucheng.crm.security.SecurityBooter.prototype.secIndex = null;//indexBooter
Com.yucheng.crm.security.SecurityBooter.prototype.grantsLoaded = false;//权限是否已经初始化
Com.yucheng.crm.security.SecurityBooter.prototype.tabPanel = null;//标签页
Com.yucheng.crm.security.SecurityBooter.prototype.secMainWindow = null;//主窗体
Com.yucheng.crm.security.SecurityBooter.prototype.stepBtns = null;//上下跳转按钮
Com.yucheng.crm.security.SecurityBooter.prototype.tabItems = [];//标签panel数组
/**
 * 初始化UI
 * @return
 */
Com.yucheng.crm.security.SecurityBooter.prototype.init = function() {
	var _this = this;
	
	/**是否要add单角色登录处理panel*/
	if (JsContext._roleId.length == 0 || SECUTILS.isForceShowRoleInfo) {
		var singleRoleLoginpanel  = new Com.yucheng.crm.security.SecListUnit();	
		/**单角色登录引用indexBooter*/
		singleRoleLoginpanel.setSecIndex(_this.getSecIndex());
		/**单角色登录引用SecMainWin*/
		singleRoleLoginpanel.setSecMainWin(_this);		
		singleRoleLoginpanel.setPanelConfig({ index : 1 });
		/**单角色登录初始化*/
		singleRoleLoginpanel.init();
		/**填加到secWin中*/
		_this.add(singleRoleLoginpanel);
	}
	/**是否要add登录认证策略处理panel*/
	if (JsContext._secMsgType != null && JsContext._secMsgType != '') {
		var loginStrategyPanel = new Com.yucheng.crm.security.SecUnit();
		if (JsContext._secMsgType === '0') {
			loginStrategyPanel.setHtml("<iframe id=thisIframe border=0 style='border:0 solid #000;height:100%;width:100%;' src="+loginStrategyPanel.pswChangeUrl+"></iframe>");
		} else if (JsContext._secMsgType === '1') {
			loginStrategyPanel.setHtml('<span>'+JsContext._secMsg+'</span>');
		}
		loginStrategyPanel.setTitle('认证策略信息');
		/**登录认证策略初始化*/
		loginStrategyPanel.init();
		/**填加到secWin中*/
		_this.add(loginStrategyPanel);
	}
	_this.show();
	
};

/**
 * IndexBooter set
 * @return
 */
Com.yucheng.crm.security.SecurityBooter.prototype.setSecIndex = function(index) {
	var _this = this;
	_this.secIndex = index;
};
/**
 * IndexBooter get
 * @return
 */
Com.yucheng.crm.security.SecurityBooter.prototype.getSecIndex = function() {
	var _this = this;
	return _this.secIndex;
};
/**
 * 显示 MainWin 
 * @return
 */
Com.yucheng.crm.security.SecurityBooter.prototype.show = function() {
	var _this = this;
	//是否显示SEC窗体
	if (_this.isShow()) {
		//主窗体只包含认证页签时需要正常初始化菜单
		if(JsContext._roleId.length > 0) {
			/**初始化菜单*/
			_this.getSecIndex().initMenus();
		}
		/**显示SEC窗体*/
		_this.showMainWin(_this.tabItems);
	} else {
		/**初始化菜单*/
		_this.getSecIndex().initMenus();
	}
};
/***
 * 增加主窗体tapItem
 **/
Com.yucheng.crm.security.SecurityBooter.prototype.addTabItem = function(p){
	var _this = this;
	_this.getTabPanel().add(p);  
	_this.getTabPanel().doLayout();
	_this.getSecMainWin().doLayout();
};
/***
 * 移除主窗体tapItem
 **/
Com.yucheng.crm.security.SecurityBooter.prototype.removeTabItem = function(p){
	var _this = this;
	/**移除tap页签，当前页签数为1时隐藏SECWIN*/
	if (_this.getTabPanel().items.length == 1) {
		_this.getSecMainWin().hide();
		_this.tabItems = [];
	}	
	_this.getTabPanel().remove(p); 
	_this.getTabPanel().doLayout();
	_this.getSecMainWin().doLayout();
};
/***
 * 移除主窗体所有tapItem
 **/
Com.yucheng.crm.security.SecurityBooter.prototype.removeTabItems = function(){
	var _this = this;
	/**移除tap页签*/
	//for (var i = 0; i < _this.tabItems.length; i ++ ){
		//_this.getTabPanel().remove(_this.tabItems[i].panel);
	//}
	_this.getTabPanel().removeAll();
	_this.getTabPanel().doLayout();
	_this.getSecMainWin().doLayout();
};
/***
 * 显示主窗口
 **/
Com.yucheng.crm.security.SecurityBooter.prototype.showMainWin = function(tabItems){
	var _this = this;
	_this.removeTabItems();
	/**将有序tap页签，添加到SECWIN*/
	for (var i = 0; i < tabItems.length; i ++ ){
		_this.addTabItem(tabItems[i].panel);
	}
	/**显示SECWIN*/
	_this.getSecMainWin().show();
};
/***
 * 取得TabPanel
 **/
Com.yucheng.crm.security.SecurityBooter.prototype.getTabPanel = function(){
	var _this = this;
	/**tabPanel未初始化时,新建TabPanel对象*/
    if(_this.tabPanel == null)
    {
    	_this.tabPanel = new Ext.TabPanel(
        {
        	id: 'securityTabPanel',activeTab: 0,width:500,height:400,enableTabScroll:true,deferredRender:false,layoutOnTabChange:true
        }
        );
    	/**将tabPanel添加到SECWIN*/
    	_this.getSecMainWin().add(_this.tabPanel);
    }
    /**返回TabPanel对象*/
    return _this.tabPanel;
};
/***
 * 取得主窗体SecMainWin
 **/
Com.yucheng.crm.security.SecurityBooter.prototype.getSecMainWin = function(){
	var _this = this;
	/**SecMainWin未初始化时,新建SecMainWin对象*/
    if(_this.secMainWindow == null)
    {
    	_this.secMainWindow = new Ext.Window({
    	  	layout : 'fit',
    	  	id : 'securityMainWin',
    	    height : 400,
    	    width:900,
    		buttonAlign : 'center',
    		draggable : true,//是否可以拖动
    		closable : true,// 是否可关闭
    		modal : true,
    	    autoScroll:true,
    		closeAction : 'hide',
    		collapsible : true,// 是否可收缩
    		titleCollapse : true,
    		border : false,
    		animCollapse : true,
    		pageY : 20,
    		//animateTarget : parent.Ext.getBody(),
    		constrain : true,
    		tbar : _this.getStepBtns(),
    		items : [_this.getTabPanel()],
    	    listeners:{
						"beforehide" : function(){ 
    						/**SecMainWin关闭前检验*/
				    		return _this.beforeHide();
						} 
			 },
    	    buttons : [
//    					{
//    						text : '关闭',
//    						handler : function() {
//    							_this.secMainWindow.hide();
//    						}
//    					} 
    					]
    	});
    }
    /**返回SecMainWin对象*/
    return _this.secMainWindow;
};
/**
 * 关闭前检验
 * @return
 */
Com.yucheng.crm.security.SecurityBooter.prototype.beforeHide = function() {
	var _this = this;
	/**初始化权限是否已完成和配置判断*/
	if (!_this.grantsLoaded && SECUTILS.isCloseWinAfterInitRole) {
		Ext.Msg.alert('初始化权限提醒','关闭前请选定角色信息！');
		return false;
	} else {
		return true;
	}
};

/**
 * 是否要显示secWin
 * @return
 */
Com.yucheng.crm.security.SecurityBooter.prototype.isShow = function() {
	var _this = this;
	/**判断是否要显示secWin，页签数大于0时，返回true*/
	if (_this.tabItems.length > 0) {
		return true;
	} else {
		return false;
	}
};

/**
 * 上一步下一步按钮TBAR
 * @return
 */
Com.yucheng.crm.security.SecurityBooter.prototype.getStepBtns = function() {
	var _this = this;
	/**判断是配置了TBAR对象*/
	if (SECUTILS.isShowStepBtn) {
		/**TBAR未初始化时，新建TBAR对象*/
		if (_this.stepBtns == null) {
			_this.stepBtns = [{
				text : SECUTILS.preStepName,
				handler:function(a,b,c,d){
					_this.activate(-1);
				}
			},'-',{
				text : SECUTILS.nextStepName,
				handler:function(a,b,c,d){
					_this.activate(1);
				}
			}];
		}
	}
	/**返回TBAR*/
	return _this.stepBtns;
};
/**
 * 页签选择方法
 * @param 0:第一个页签 1: 下一个页签 -1: 上一个页签
 * 说明： 此方法可用于tabpanel自身处理完成方法后调用
 */
Com.yucheng.crm.security.SecurityBooter.prototype.activate = function(n){
	var _this = this;
	/**为0时跳转到第一个页签*/
    if (n == 0) {
    	_this.getTabPanel().activate(0);
        return;
    }
    var ctxItem = _this.getTabPanel().getActiveTab();
    var i = 0;
    /**查找关跳转目标页签*/
    _this.getTabPanel().items.each(function(item){
        if (item.id == ctxItem.id) {
        	if (i + n < _this.getTabPanel().items.length 
        	    && i + n >= 0) {
        		_this.getTabPanel().activate(i + n);
        	}
        }
        i++;
    });
};
/**
 * 将页签panelObject有序添加到tabItems数组中
 * 
 * @param : o:{panelConfig , panel}  panelConfig 为panel配置信息;panel tab页签对象
 * 			如 o:{{index:1,...}, panel} 中 index 为显示排序号
 */
Com.yucheng.crm.security.SecurityBooter.prototype.add = function(o){
	if (o.panelConfig == null || o.panel == null) {
		return;
	}
	var _this = this;
    var panel = o.panel;
    var index = 0;
    var panelConfig = o.panelConfig;
    if (panelConfig != null) {
    	index = panelConfig.index;
    }
    /**tabItems中没有页签时直接push*/
    if (_this.tabItems.length == 0 || index == null) {
    	_this.tabItems.push(o);
    } else {
    	var item = _this.tabItems[0];
    	/**将页签按index序号添加到有序tabItems数组的头或尾*/
    	if (index < item.panelConfig.index && index != 0) {
    		var tempTabItems = [];
        	tempTabItems.push(o);
    		_this.tabItems = tempTabItems.concat(_this.tabItems);
		} else {
			_this.tabItems.push(o);
		}
    }
};
/**
 * security SecUnit
 * @return
 */
Com.yucheng.crm.security.SecUnit = function() {
	var _this = this;
	
};
//修改密码页面内容URL
Com.yucheng.crm.security.SecUnit.prototype.pswChangeUrl = basepath + '/contents/pages/systemManager/userManage/changePassWord.jsp';
Com.yucheng.crm.security.SecUnit.prototype.html = null;//提示信息
Com.yucheng.crm.security.SecUnit.prototype.panelConfig = null;//配置信息
Com.yucheng.crm.security.SecUnit.prototype.panel = null;//tab页签的panel
Com.yucheng.crm.security.SecUnit.prototype.title = '';//标题
/***
 * SecUnit 初始化
 **/
Com.yucheng.crm.security.SecUnit.prototype.init = function() {
	var _this = this;
	/**提示信息初始化*/
	if (_this.getHtml() == null){
		_this.setHtml('<span>'+JsContext._secMsg+'</span>');
	}
	/**配置信息初始化*/
	if (_this.getPanelConfig() == null){
		_this.setPanelConfig({ index : 10 });
	}
	/**页签panel初始化*/
	if (_this.getPanel() == null){
		_this.setPanel(new Ext.Panel({
			title:_this.getTitle(),
			frame : true,
			layout : 'fit',
			html: _this.getHtml()
		}));
	}	
};
/***
 * SecUnit  TABPANEL对象中HTML属性信息初始化
 * @param : html 面板中HTML属性信息
 **/
Com.yucheng.crm.security.SecUnit.prototype.setHtml = function(html) {
	var _this = this;
	_this.html = html;
};
/***
 * SecUnit  取得TABPANEL对象中HTML属性信息
 **/
Com.yucheng.crm.security.SecUnit.prototype.getHtml = function() {
	var _this = this;
	return _this.html;
};
/***
 * SecUnit  取得TABPANEL对象标题
 **/
Com.yucheng.crm.security.SecUnit.prototype.getTitle = function() {
	var _this = this;
	return _this.title;
};
/***
 * SecUnit  title 初始化
 * @param : title为TABPANEL对象标题
 **/
Com.yucheng.crm.security.SecUnit.prototype.setTitle = function(title) {
	var _this = this;
	_this.title = title;
};
/***
 * SecUnit  配置panelConfig 初始化
 * @param : panelConfig为页签panelObject:{panelConfig , panel} 对象中的属性 
 * 			panelConfig作用为提供panel配置信息;panel tab页签面板对象
 * 			例： panelConfig :{index:1,...} 中 index 为显示排序号
 */

Com.yucheng.crm.security.SecUnit.prototype.setPanelConfig = function(panelConfig) {
	var _this = this;
	_this.panelConfig = panelConfig;
};
/***
 * SecUnit  配置panelConfig get方法
 **/
Com.yucheng.crm.security.SecUnit.prototype.getPanelConfig = function() {
	var _this = this;
	return _this.panelConfig;
};
/***
 * SecUnit  页签panel初始化
 * @param ：panel页签面板
 **/
Com.yucheng.crm.security.SecUnit.prototype.setPanel = function(panel) {
	var _this = this;
	_this.panel = panel;
};
/***
 * SecUnit  取得页签panel
 **/
Com.yucheng.crm.security.SecUnit.prototype.getPanel = function() {
	var _this = this;
	return _this.panel;
};
/**
* security SecListUnit
*/
Com.yucheng.crm.security.SecListUnit = function(config) {
	Com.yucheng.crm.security.SecListUnit.superclass.constructor.call(this, Ext.applyIf(config, {		
	}));
};
Ext.extend(Com.yucheng.crm.security.SecListUnit,Com.yucheng.crm.security.SecUnit,{
	secMainWin : null,				//secMainWin
	secIndex : null,				//indexBooter
	roleInfoStore : null,  			//store
	roleInfoRecord : null,			//store行信息
	roleInfoUrl : null,				//查询store的URL
	roleColumns : null, 			//列表的列信息
	panel : null,					//页签panel
	init : function(){
		var _this = this;
		/**设置title*/
		_this.setTitle('请选择一个角色');
		/**是否设置了个性业务配置*/
		if (_this.getPanelConfig() == null){
			/** 页签panelObject:{panelConfig , panel}  panelConfig 为panel配置信息;panel tab页签对象
			 * 	panelConfig :{index:1,...} 中 index 为显示排序号
			 */
			_this.setPanelConfig({ index : 0 });
		}
		/**是否非默认行信息*/
		if (_this.getRoleInfoRecord() == null) {		
			_this.setRoleInfoRecord(Ext.data.Record.create([ 
	                                 	    {name: 'id', mapping: 'ROLE_ID'},
	                                  	    {name: 'roleId', mapping: 'ROLE_ID'},
	                                  	    {name: 'roleName', mapping: 'ROLE_NAME'}
	                                  		]));
		}
		/**是否非默认列信息*/
		if (_this.getRoleColumns() == null) {		
			_this.setRoleColumns(new Ext.grid.ColumnModel([{
												header : 'id',
												dataIndex : 'id', 
												sortable : true,
												hidden : true,
												width : 120
											},{
												header : '角色编号',
												dataIndex : 'roleId', 
												sortable : true,
												hidden : true,
												width : 150
											},{
												header : '角色名称',
												dataIndex : 'roleName', 
												sortable : true,
												width : 120
											}]));
		}
		/**是否非默认URL信息*/
		if (_this.getRoleInfoUrl() == null) {	
			_this.setRoleInfoUrl(basepath + '/loginRolesInfo.json?userId=' + JsContext._userId);
		}
		/**是否非默认store信息*/
		if (_this.getRoleInfoStore() == null) {
			_this.setRoleInfoStore(new Ext.data.Store({
				restful : true,
				autoLoad : true,
				proxy : new Ext.data.HttpProxy({
					url : _this.getRoleInfoUrl(),
					method:'GET',
					success:function(){
						_this.getSecMainWin().getSecIndex().mainMask.hide();
					}
				}),
				reader : new Ext.data.JsonReader({
					successProperty: 'success',
			        idProperty: 'ID',
			        messageProperty: 'message',
					root : 'json.data',
					totalProperty : 'json.count'
				}, _this.getRoleInfoRecord())
			}));	
		}
		/**是否非默认panel信息*/
		if (_this.getPanel() == null){
			_this.setPanel(new Ext.grid.GridPanel({
				id :'roleGrid',
				store : _this.getRoleInfoStore(),
				frame : true,
				title : '请选择一个角色',
				cm : _this.getRoleColumns(),
				stripeRows : true,
				region : 'center',
				frame : true,
				tbar : [{
					text:'选定',
					handler:function(grid, e){//选定角色方法
						_this.rowDBClick(_this.getPanel().getSelectionModel());
					}
				}],
				viewConfig : { //强制fit,禁用滚动条
				 	forceFit:true,
				 	autoScroll:false
				},
				listeners : {
					'rowdblclick' : function(grid, rowIndex, e) {
						/**双击行事件*/
						_this.rowDBClick(_this.getPanel().getSelectionModel());
					}
				}
			}));
		}
	},
	/**双击行及选定事件*/
	rowDBClick : function(selModel) {
		var _this = this;
		_this.getSecMainWin().getSecIndex().mainMask.show();
		/**判断是否有选中行*/
		if (!selModel.hasSelection()) {
			Ext.Msg.alert("提示","请选中一个角色！", function() {});   
			return;
		}		
		_this.initGrant(selModel.getSelected().get('id'));

	},
	/**权限信息初始化*/
	initGrant : function(currentRoleIds){
		if (currentRoleIds == null) {
			Ext.Msg.alert('初始化权限提醒','当前角色Id为空无法初始化权限信息！');
		}
		var _this = this;
		Ext.Ajax.request({
			url:basepath+'/initMenuGrant.json?roleIds='+currentRoleIds,
			method:'GET',
			async: false,
			success:function(a,b,c,d){
				/**菜单信息清空*/
				_this.getSecIndex().__mainMenuObj = [];
				_this.getSecIndex().destroyRelateTabs(0);
				_this.getSecIndex().indexMenuClick();
				/**菜单信息初始化*/
				_this.getSecIndex().initMenus();
				/**权限初始化完成标识置为true*/
				_this.getSecMainWin().grantsLoaded = true;
				/**初始化完权限及菜单时，是否移除角色tab页签*/
				if (SECUTILS.isRemoveRoleTab) {
					_this.getSecMainWin().removeTabItem(_this.getPanel());
				}
			},
			failure:function(a,b,d,c){
				Ext.Msg.alert('初始化权限提醒','初始化权限信息失败！');
			}
		});
	},
	/**
	 * 查询store的URL初始化
	 * @param : roleInfoUrl 查询store的URL
	 */
	setRoleInfoUrl : function(roleInfoUrl) {
		var _this = this;
		return _this.roleInfoUrl = roleInfoUrl;
	},
	/**
	 * 取得store的URL
	 */
	getRoleInfoUrl : function() {
		var _this = this;
		return _this.roleInfoUrl;
	},
	/**
	 * store行信息初始化
	 * @param : roleInfoRecord为store行信息
	 */
	setRoleInfoRecord : function(roleInfoRecord) {
		var _this = this;
		return _this.roleInfoRecord = roleInfoRecord;
	},
	/**
	 * 取得store行信息初始化
	 */
	getRoleInfoRecord : function() {
		var _this = this;
		return _this.roleInfoRecord;
	},
	/**
	 * store初始化
	 * @param : roleInfoStore列表数据
	 */
	setRoleInfoStore : function(roleInfoStore) {
		var _this = this;
		return _this.roleInfoStore = roleInfoStore;
	},
	/**
	 * 取得store
	 */
	getRoleInfoStore : function() {
		var _this = this;
		return _this.roleInfoStore;
	},
	/**
	 * panel初始化
	 * @param : panel 页签的panel对象
	 */
	setPanel : function(panel) {
		var _this = this;
		return _this.panel = panel;
	},
	/**
	 * 取得页签panel初始化
	 */
	getPanel : function() {
		var _this = this;
		return _this.panel;
	},
	/**
	 * 取得角色列表列信息
	 */
	getRoleColumns : function() {
		var _this = this;
		return _this.roleColumns;
	},
	/**
	 * 角色列表列信息初始化
	 * @param : roleColumns 角色列表列信息
	 */
	setRoleColumns : function(roleColumns) {
		var _this = this;
		return _this.roleColumns = roleColumns;
	},
	/**
	 * 设置indexBooter
	 * @param : secIndex 角色列表列信息
	 */
	setSecIndex : function(secIndex) {
		var _this = this;
		return _this.secIndex = secIndex;
	},
	/**
	 * 取得indexBooter
	 */
	getSecIndex : function() {
		var _this = this;
		return _this.secIndex;
	},
	/**
	 * 设置SecMainWin
	 * @param : secMainWin security主窗体
	 */
	setSecMainWin : function(secMainWin) {
		var _this = this;
		return _this.secMainWin = secMainWin;
	},
	/**
	 * 取得SecMainWin
	 */
	getSecMainWin : function() {
		var _this = this;
		return _this.secMainWin;
	}		
});

