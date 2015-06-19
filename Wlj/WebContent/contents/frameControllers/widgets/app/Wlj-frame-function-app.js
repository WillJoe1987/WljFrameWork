Ext.ns('Wlj.frame.functions.app');
/** 
 * 页面整体APP对象
 */	
Wlj.frame.functions.app.App = function(cfg){
	Ext.log('开始构建APP');
	this.buildSpecilPatch();
	this.pageSize = WLJUTIL.defaultPagesize;
	this.tbar = [];
	
	this.needRN = WLJUTIL.needRN;
	this.rnWidth = WLJUTIL.rnWidth;
	this.contextMenuAble = WLJUTIL.contextMenuAble;
	
	if(WLJUTIL.easingStrategy.indexOf(WLJUTIL.dataLineEasing)>=0){
		this.easingStrtegy = {};
		this.easingStrtegy.type = WLJUTIL.dataLineEasing;
		this.easingStrtegy.firstStep = WLJUTIL.firstStep;
		this.easingStrtegy.initialConfig = WLJUTIL[WLJUTIL.dataLineEasing];
	}else{
		this.easingStrtegy = false;
	}
	
	this.edgeVies = {
		top : false,
		left : false,
		right : false,
		buttom : false
	};
	
	this.createView = false;
	this.editView = false;
	this.detailView = false;
	
	this.createFormViewer = false;
	this.editFormViewer = false;
	this.detailFormViewer = false;
	
	this.createValidates = false;
	this.editValidates = false;
	
	this.createLinkages = false;
	this.editLinkages = false;
	
	this.needGrid = true;
	this.needTbar = true;
	
	Ext.apply(this,cfg);
	
	if(this.needGrid === false){
		this.needCondition = false;
		this.needTbar = false;
	}
	
	this.searchTileBaseheight = this.needCondition? 100 : -8;
	if(!this.comitUrl){
		this.comitUrl = this.url;
	}
	
	if(this.createView){
		if(!this.createFormViewer){
			this.createFormViewer = this.formViewers;
		}
		if(!this.createValidates){
			this.createValidates = this.validates;
		}
		if(!this.createLinkages){
			this.createLinkages = this.linkages;
		}
	}
	
	if(this.editView){
		if(!this.editFormViewer){
			this.editFormViewer = this.formViewers;
		}
		if(!this.editValidates){
			this.editValidates = this.validates;
		}
		
		if(!this.editLinkages){
			this.editLinkages = this.linkages;
		}
	}
	
	if(this.detailView){
		if(!this.detailFormViewer){
			this.detailFormViewer = this.formViewers;
		}
	}
	this.initEvents();
	//this.initTreeManager();
	Wlj.frame.functions.app.App.superclass.constructor.call(this);
	this.initAPI();
	var initable = this.fireEvent('beforeinit', this);
	
	if(initable === false){
		Ext.error('beforeinit事件阻止APP构建，APP构建结束!');
		return false;
	}
	if(!this.lookupTypes){
		this.lookupTypes = [];
	}
	this.prepareLookup();
	this.init();
};

Ext.extend(Wlj.frame.functions.app.App,Ext.util.Observable);

/**数据转换类型
 * TO_JAVA : 数据key值转换为驼峰命名法;
 * TO_SQL ：数据key值转换为大写下划线分隔形式;
 * NO_TRANS : 不做任何转换
 * */
Wlj.frame.functions.app.App.prototype.TRANS_TYPE = {
		TO_JAVA : 1,
		TO_SQL : 2,
		NO_TRANS : 3
};
/**查询条件默认转换方式**/
Wlj.frame.functions.app.App.prototype.SEARCHFIELDTRANS = Wlj.frame.functions.app.App.prototype.TRANS_TYPE.NO_TRANS;
/**查询结果列默认转换方式**/
//Wlj.frame.functions.app.App.prototype.RESULTFIELDTRANS = Wlj.frame.functions.app.App.prototype.TRANS_TYPE.NO_TRANS;
/**新增修改表单提交转换方式**/
Wlj.frame.functions.app.App.prototype.VIEWCOMMITTRANS =  Wlj.frame.functions.app.App.prototype.TRANS_TYPE.TO_JAVA;

/**
 * 页面边缘区域：上下左右基础配置;
 */
Wlj.frame.functions.app.App.prototype.edgeViewBaseCfg = {
		left : {
			layout : 'accordion',
			xtype : 'panel',
			width : 200,
			height : 'auto',
			frame : true,
			region : 'west',
			collapsible : true
		},
		right : {
			layout : 'accordion',
			xtype : 'panel',
			width : 200,
			height : 'auto',
			frame : true,
			region : 'east',
			collapsible : true
		},
		top : {
			layout : 'form',
			xtype : 'form',
			height : 100,
			frame : true,
			width : 'auto',
			region : 'north',
			defaultType : 'textfield',
			collapsible : true
		},
		buttom : {
			xtype : 'tabpanel',
			height : 100,
			frame : true,
			width : 'auto',
			region : 'south',
			collapsible : true,
			activeTab : 0
		}
};
/**
 * 页面初始化
 * @return
 */
Wlj.frame.functions.app.App.prototype.init = function(){
	this.vs = Ext.getBody().getViewSize();
	Ext.log('开始构建APP内部对象');
	this.buildEdgeViews();
	this.buildMajor();
	this.render();
	
	this.fireEvent('afterinit', this);
	Ext.log('APP构建结束！');
	this.clearSite();
	if(WLJUTIL.pluginTrigger){
		this.plugins = {};
		if(Wlj.frame.functions.plugin){
			for(var key in Wlj.frame.functions.plugin){
				Ext.log('加载插件【'+key+'】！');
				var tp =  new Wlj.frame.functions.plugin[key]({
					appObject : this
				});
				if(!tp.destroyed){
					this.plugins[key] = tp;
					Ext.log('插件【'+key+'】已装载');
				}else {
					Ext.log('插件【'+key+'】未装载');
				}
			}
		}
	}
};
/**
 * 清除window域配置
 * @return
 */
Wlj.frame.functions.app.App.prototype.clearSite = function(){
	
	window.needCondition = true;
	window.needTbar = true;
	window.needGrid = true;
	window.url = false;
	window.comitUrl = false;
	window.fields = false;
	window.createView = false;
	window.editView = false;
	window.detailView = false;
	window.createFormViewer = false;
	window.editFormViewer = false;
	window.detailFormViewer = false;
	window.lookupTypes = false;
	window.localLookup = false;
	window.createValidates = false;
	window.editValidates = false;
	window.createLinkages = false;
	window.editLinkages = false;
	window.edgeVies = false;
	window.customerView = false;
	window.listeners = false;
	window.tbar = false;
	window.createFormCfgs = false;
	window.editFormCfgs = false;
	window.detailFormCfgs = false;
	
	window.searchDomainCfg = false;
	window.resultDomainCfg =false;
	
	window.formViewers = false;
	window.formCfgs = false;
	window.validates = false;
	window.linkages = false;
	
	window.beforeinit  =  false;
	window.afterinit  =  false;
	window.beforeconditioninit  =  false;
	window.afterconditioninit  =  false;
	window.beforeconditionrender  =  false;
	window.afterconditionrender  =  false;
	window.beforeconditionadd  =  false;
	window.conditionadd  =  false;
	window.beforeconditionremove  =  false;
	window.conditionremove  =  false;
	window.beforedyfieldclear  =  false;
	window.afterdyfieldclear  =  false;
	window.beforeconditioncollapse  =  false;
	window.afterconditioncollapse  =  false;
	window.beforeconditionexpand  =  false;
	window.afterconditionexpand  =  false;
	window.recordselect  =  false;
	window.rowdblclick  =  false;
	window.load  =  false;
	window.beforesetsearchparams  =  false;
	window.setsearchparams  =  false;
	window.beforeresultinit  =  false;
	window.afterresultinit  =  false;
	window.beforeresultrender  =  false;
	window.afterresultrender  =  false;
	window.beforecreateviewrender  =  false;
	window.aftercreateviewrender  =  false;
	window.beforeeditviewrender  =  false;
	window.aftereditviewrender  =  false;
	window.beforedetailviewrender  =  false;
	window.afterdetailviewrender  =  false;
	window.beforeviewshow  =  false;
	window.viewshow  =  false;
	window.beforeviewhide  =  false;
	window.viewhide  =  false;
	window.beforevalidate  = false;
	window.validate  =  false;
	window.beforecommit  =  false;
	window.afertcommit  =  false;
	window.beforeeditload  =  false;
	window.aftereditload  =  false;
	window.beforedetailload  =  false;
	window.afterdetailload  =  false;
	window.beforetophide  =  false;
	window.tophide  =  false;
	window.beforetopshow  =  false;
	window.topshow  =  false;
	window.beforelefthide  =  false;
	window.lefthide  =  false;
	window.beforeleftshow  =  false;
	window.leftshow  =  false;
	window.beforebuttomhide  =  false;
	window.buttomhide  =  false;
	window.beforebuttomshow  =  false;
	window.buttomshow  =  false;
	window.beforerighthide  =  false;
	window.righthide  =  false;
	window.beforerightshow  =  false;
	window.rightshow  =  false;
	window.lookupinit  =  false;
	window.locallookupinit  =  false;
	window.alllookupinit  =  false;
	window.beforelookupreload  =  false;
	window.lookupreload  =  false;
	window.beforetreecreate  =  false;
	window.treecreate  =  false;
};
/**
 * 销毁方法
 * @return
 */
Wlj.frame.functions.app.App.prototype.destroy = function(){
	if(this.infoDD){
		this.infoDD.removeAllListeners();
		Ext.destroy(this.infoDD);
		this.infoDD = false;
	}
	this.destroyLookups();
	this.clearAPI();
	this.purgeListeners();
	this.viewPort.destroy();
	/********************************/
	this.majorPanel = null;
	this.searchDomain = null;
	this.resultDomain = null;
	this.fields = null;
	this.customerView = false;
	this.edgeVies = {
		top : false,
		left : false,
		right : false,
		buttom : false
	};
	
	window._app = null;
};
/**
 * 初始化事件
 * @return
 */
Wlj.frame.functions.app.App.prototype.initEvents = function(){
	Ext.log('初始化APP对象事件！');
	this.addEvents({
		/**APP初始化**/
		/**
		 * APP初始化之前触发；
		 * params ： app：当前APP对象；
		 * return ： false：阻止页面初始化；默认为true；
		 */
		beforeinit : true,
		/**
		 * APP初始化之后触发；
		 * params ： app：当前APP对象；
		 */
		afterinit : true,
		
		
		/**查询条件域事件**/
		/**
		 * 查询条件域对象初始化之前触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		beforeconditioninit : true,
		/**
		 * 查询条件域对象初始化之后触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		afterconditioninit : true,
		/**
		 * 查询条件域对象渲染之前触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		beforeconditionrender : true,
		/**
		 * 查询条件域对象渲染之后触发；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		afterconditionrender : true,
		/**
		 * 当数据字段被动态拖动到查询条件框时触发;
		 * params : fCfg：添加之前默认生成的数据项配置；
		 * 			columnIndexT：将要被添加的列数；
		 * 			searchPanel：查询条件form面板；
		 * return ：false阻止条件添加事件；默认为true；
		 */
		beforeconditionadd : true,
		/**
		 * 当数据字段被添加为查询条件后触发
		 * params : field：被添加后的字段对象；
		 * 			searchPanel：查询面板表单；
		 */
		conditionadd : true,
		/**
		 * 当一个动态数据条件被移除前触发
		 * params : field：将要被移除的查询条件字段对象；
		 * 			searchPanel：查询条件面板对象；
		 * return : false，阻止移除事件；默认为true；
		 */
		beforeconditionremove : true,
		/**
		 * 当一个动态数据条件被移除后触发
		 * params : searchPanel被移除字段后的查询条件表单；
		 */
		conditionremove : true,
		/**
		 * 当动态数据条件被全部移除前触发；
		 * params ：searchDomain：查询域对象；
		 * 			searchpanel：查询条件面板；
		 * 			dyfield：移除前动态字段数组；
		 */
		beforedyfieldclear : true,
		/**
		 * 当动态数据条件被全部移除后触发；
		 * params ：searchDomain：查询域对象；
		 * 			searchpanel：查询条件面板；
		 * 			dyfield：移除后动态字段数组；
		 */
		afterdyfieldclear : true,
		/**
		 * 查询条件域收起前触发；
		 * params：panel：查询条件域面板；
		 * return：false：阻止查询条件域收起事件，默认为true，
		 */
		beforeconditioncollapse : true,
		/**
		 * 查询条件域收起后触发；
		 * params：panel：查询条件域面板；
		 */
		afterconditioncollapse : true,
		/**
		 * 查询条件域收展开触发；
		 * params：panel：查询条件域面板；
		 * return：false：阻止查询条件域展开事件，默认为true，
		 */
		beforeconditionexpand : true,
		/**
		 * 查询条件域展开后触发；
		 * params：panel：查询条件域面板；
		 */
		afterconditionexpand : true,
		/**
		 * 当一个查询条件域字段被赋值前触发；
		 * params： field：字段对象；
		 * 			dataInfo：字段元数据；
		 * 			value ：字段值；
		 * return ： false：阻止setValue事件触发；默认为true；
		 */
		beforecondtitionfieldvalue : true,
		/**
		 * 当一个查询条件域字段被赋值后触发；
		 * params： field：字段对象；
		 * 			dataInfo：字段元数据；
		 * 			value ：字段值；
		 */
		condtitionfieldvalue : true,
		
		/**查询结果域操作**/
		/**
		 * 数据行被选择时触发；
		 * params : record:被选择的数据对象；
		 * 			store:数据所在数据源对象;
		 * 			tile:结果面板中数据行的瓷贴对象;
		 */
		recordselect : true,
		/**
		 * 数据行双击事件；
		 * params : tile:被双击数据行瓷贴对象；
		 * 			record：被双击数据对象；
		 */
		rowdblclick : true,
		load : false,
		/**
		 * 设置当前查询条件前触发；
		 * params : params:追加查询条件项；
		 * 			forceLoad：是否强制刷新当前数据；
		 * 			add：是否清理之前查询条件；
		 * 			transType：查询条件key值转换类型
		 * return ：false：阻止查询条件设置动作；默认为true；
		 */
		beforesetsearchparams : true,
		/**
		 * 设置当前查询条件之后，数据刷新之前触发；
		 * params : params:追加查询条件项；
		 * 			forceLoad：是否强制刷新当前数据；
		 * 			add：是否清理之前查询条件；
		 * 			transType：查询条件key值转换类型
		 */
		setsearchparams : true,
		/**
		 * 查询结果域对象初始化之前触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		beforeresultinit : true,
		/**
		 * 查询结果域对象初始化之后触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		afterresultinit : true,
		/**
		 * 查询结果域对象渲染之前触发，此时对象尚未渲染；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		beforeresultrender : true,
		/**
		 * 查询结果域对象渲染之后触发；
		 * params ：con：查询条件面板对象；
		 * 			app：当前APP对象；
		 */
		afterresultrender : true,
		
		
		/**查询结果域附加面板事件**/
		/**
		 * 新增面板渲染之前触发
		 * params : view:新增面板对象
		 */
		beforecreateviewrender : true,
		/**
		 * 新增面板渲染之后触发
		 * params : view:新增面板对象
		 */
		aftercreateviewrender : true,
		/**
		 * 修改面板渲染之前触发
		 * params : view:修改面板对象
		 */
		beforeeditviewrender : true,
		/**
		 * 修改面板渲染之后触发
		 * params : view:修改面板对象
		 */
		aftereditviewrender : true,
		/**
		 * 详情面板渲染之前触发
		 * params : view:详情面板对象
		 */
		beforedetailviewrender : true,
		/**
		 * 详情面板渲染之后触发
		 * params : view:详情面板对象
		 */
		afterdetailviewrender : true,
		/**
		 * 结果域面板滑入前触发：
		 * params：theview : 当前滑入面板；
		 * return： false，阻止面板滑入操作；默认为true；
		 */
		beforeviewshow : true,
		/**
		 * 结果域面板滑入后触发：
		 * params：theview ： 当前滑入面板；
		 */
		viewshow : true,
		/**
		 * 结果域面板滑出前触发；
		 * params：theview ：当前滑出面板；
		 * return：false，阻止面板滑出操作；默认为ture；
		 */
		beforeviewhide : true,
		/**
		 * 结果域面板滑出后触发：
		 * params：theview ： 当前滑出面板；
		 */
		viewhide : true,
		/**
		 * 新增、修改面板提交之前数据校验前置事件
		 * params : view:面板对象；
		 * 			panel:面板对象内部form表单面板对象；
		 * return : false，阻止校验以及提交；
		 */
		beforevalidate :true,
		/**
		 * 新增、修改面板提交之前数据校验后置事件
		 * params : view:面板对象；
		 * 			panel:面板对象内部form表单面板对象；
		 * 			error：校验结果，布尔型
		 */
		validate : true,
		/**
		 * 数据提交之前触发
		 * params : data:提交的数据对象；
		 * 			cUrl：提交地址；
		 * return ： false，阻止提交动作；默认为true
		 */
		beforecommit : true,
		/**
		 * 数据提交之后触发
		 * params : data:提交的数据对象；
		 * 			cUrl：提交地址；
		 * 			result：提交成功失败结果，布尔型；
		 */
		afertcommit : true,
		/**
		 * 修改表单滑入，加载当前选择数据之前触发；
		 * params ：view：修改表单；
		 * 			record ：当前选择的数据；
		 * return ： false：阻止数据加载事件，默认为true；
		 */
		beforeeditload : false,
		/**
		 * 修改表单滑入，加载当前选择数据之后触发；
		 * params ：view：修改表单；
		 * 			record ：当前选择的数据；
		 */
		aftereditload : false,
		/**
		 * 详情表单滑入，加载当前选择数据之前触发；
		 * params ：view：详情表单；
		 * 			record ：当前选择的数据；
		 * return ： false：阻止数据加载事件，默认为true；
		 */
		beforedetailload : true,
		/**
		 * 详情表单滑入，加载当前选择数据之后触发；
		 * params ：view：详情表单；
		 * 			record ：当前选择的数据；
		 */
		afterdetailload : true,
		
		
		/**边缘面板事件**/
		beforetophide : false,
		tophide : false,
		beforetopshow : false,
		topshow : false,
		beforelefthide : false,
		lefthide : false,
		beforeleftshow : false,
		leftshow : false,
		beforebuttomhide : false,
		buttomhide : false,
		beforebuttomshow : false,
		buttomshow : false,
		beforerighthide : false,
		righthide : false,
		beforerightshow : false,
		rightshow : false,
		
		
		/**数据字典事件**/
		/**
		 * 一个远程数据字典项被加载完毕之后触发;
		 * params : key:字典项类型键值；
		 * 			store:数据字典store；
		 */
		lookupinit : true,
		/**
		 * 一个本地数据字典项被加载完毕之后触发;
		 * params : key:字典项类型键值；
		 * 			store:数据字典store；
		 */
		locallookupinit : true,
		/**
		 * 数据字典项全部加载完毕之后触发;
		 * params : lookupManager：数据字典管理器
		 */
		alllookupinit : true,
		/**
		 * 数据字典reload之前触发；
		 * params ：type：数据字典类型编码；
		 * 			lStore：数据字典store
		 * 			config ：reload配置;
		 * return : 返回false阻止事件发生；默认为true；
		 */
		beforelookupreload : true,
		/**
		 * 数据字典reload之后触发；
		 * params ：type：数据字典类型编码；
		 * 			lStore：数据字典store;
		 * 			records : 更新的数据数组；
		 * 			config ：reload配置;
		 * 			succeed ：数据reload结果标志位；
		 */
		lookupreload : true,
		
		/**属性面板事件**/
		beforetreecreate : false,
		treecreate : false
	});
};
/**
 * 构建API句柄
 * @return
 */
Wlj.frame.functions.app.App.prototype.initAPI = function(){
	Ext.log('开始准备API!');
	if(typeof API === 'undefined' || !Ext.isObject(API)){
		Ext.log('NO API CONFIG, NONE API BUILT!');
		return false;
	}
	for(var key in API){
		if(API[key]){
			if(Ext.isFunction(this[key])){
				window[key] = this[key].createDelegate(this);
				Ext.log('BUILD API 【'+key+'】!');
				continue;
			}else{
				Ext.warn('API【'+key+'】准备出错，因为APP对象不具备该方法！');
				API[key] = false;
				continue;
			}
		}
	}
	Ext.log('API准备完毕！');
};
/**
 * 清除API句柄
 * @return
 */
Wlj.frame.functions.app.App.prototype.clearAPI = function(){
	for(var key in API){
		window[key] = null;
	}
};
/**
 * 事件触发逻辑
 * @return
 */
Wlj.frame.functions.app.App.prototype.fireEvent = function(){
	var eventName = arguments[0];
	var eventResult = true;
	if(!eventName){
		return eventResult;
	}
	Ext.log('触发事件：【'+arguments[0]+'】:接收到【'+(arguments.length - 1)+'】个参数！');
	if(!this.hasListener(eventName)){
		Ext.log('【'+arguments[0]+'】未绑定逻辑，事件调用结束！');
		return eventResult;
	}
	try{
		for(var i = 0;i<this.events[eventName].listeners.length;i++){
			Ext.log('fn['+i+']:'+this.events[eventName].listeners[0].fn.toString());
		}
		eventResult = Wlj.frame.functions.app.App.superclass.fireEvent.apply(this,arguments);
	}catch(Werror){
		Ext.error('事件【'+arguments[0]+'】：执行出错。TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
		eventResult = false;
	}finally{
		Ext.log('【'+arguments[0]+'】事件结束!');
		return eventResult;
	}
};
/**
 * 准备数据字典项
 * @return
 */
Wlj.frame.functions.app.App.prototype.prepareLookup = function(){
	Ext.log('开始构建数据字典项管理器！');
	this.lookupManager = {};
	var _this = this;
	Ext.log('构建本地字典项');
	for(var key in this.localLookup){
		Ext.log('构建本地字典项：['+key+']；');
		var lookups = this.localLookup[key];
		var store = new Ext.data.JsonStore({
	        fields : ['key', 'value']
	    });
		store.loadData(lookups);
		this.lookupManager[key] = store;
		_this.fireEvent('locallookupinit', key, store);
	}
	Ext.log('本地字典项构建完毕');
	Ext.log('开始构建远程字典项');
	/****************************队列递归加载模式******************************/
//	var tStoreIndex = 0;
//	function loadlookup(fCB){
//		if(tStoreIndex >= _this.lookupTypes.length){
//			fCB();
//			return;
//		}
//		var tStore = null;
//		if(Ext.isString(_this.lookupTypes[tStoreIndex])){
//			Ext.log('构建远程字典项:['+_this.lookupTypes[tStoreIndex]+'];');
//			tStore = new Ext.data.Store({
//				sortInfo:{
//					field: 'key',
//				    direction: WLJUTIL.lookupSortDirect 
//				},
//				restful:true,   
//				proxy : new Ext.data.HttpProxy({
//					url : basepath+'/lookup.json?name='+_this.lookupTypes[tStoreIndex]
//				}),
//				reader : new Ext.data.JsonReader({
//					root : 'JSON'
//				}, [ 'key', 'value' ])
//			});
//			_this.lookupManager[_this.lookupTypes[tStoreIndex]] = tStore;
//		}else{
//			var typeCfg =  _this.lookupTypes[tStoreIndex];
//			Ext.log('构建远程字典项:['+typeCfg.TYPE+'];');
//			tStore = new Ext.data.Store({
//				restful:true,   
//				proxy : new Ext.data.HttpProxy({
//					url : basepath + typeCfg.url
//				}),
//				reader : new Ext.data.JsonReader({
//					root : typeCfg.root?typeCfg.root:'json.data'
//				}, [{
//					name : 'key',
//					mapping : typeCfg.key
//				},{
//					name : 'value',
//					mapping : typeCfg.value
//				}])
//			});
//			_this.lookupManager[typeCfg.TYPE] = tStore;
//		}
//		tStore.load({
//			callback : function(){
//				_this.fireEvent('lookupinit',_this.lookupTypes[tStoreIndex],tStore);
//				tStoreIndex ++ ;
//				loadlookup(fCB);
//			}
//		});
//	}
//	loadlookup(function(){
//		Ext.log('远程字典项构建完毕');
//		_this.fireEvent('alllookupinit',_this.lookupManager);
//	});
	
	/***********************同步并发加载模式*******************************/
	var loadedNumber = 0;
	Ext.each(_this.lookupTypes, function(lt){
		var tStore = null;
		if(Ext.isString(lt)){
			Ext.log('构建远程字典项:['+lt+'];');
			tStore = new Ext.data.Store({
				sortInfo:{
					field: 'key',
				    direction: WLJUTIL.lookupSortDirect 
				},
				restful:true,   
				proxy : new Ext.data.HttpProxy({
					url : basepath+'/lookup.json?name='+lt
				}),
				reader : new Ext.data.JsonReader({
					root : 'JSON'
				}, [ 'key', 'value' ])
			});
			_this.lookupManager[lt] = tStore;
		}else{
			Ext.log('构建远程字典项:['+lt.TYPE+'];');
			tStore = new Ext.data.Store({
				restful:true,   
				proxy : new Ext.data.HttpProxy({
					url : basepath + lt.url
				}),
				reader : new Ext.data.JsonReader({
					root : lt.root?lt.root:'json.data'
				}, [{
					name : 'key',
					mapping : lt.key
				},{
					name : 'value',
					mapping : lt.value
				}])
			});
			_this.lookupManager[lt.TYPE] = tStore;
		}
		if(lt.autoLoadItems !== false){
			tStore.load({
				callback : function(){
					_this.fireEvent('lookupinit',lt,tStore);
					loadedNumber ++ ;
					if(loadedNumber == _this.lookupTypes.length){
						_this.fireEvent('alllookupinit',_this.lookupManager);
					}
				}
			});
		}
	});
	
	
	
};
/**
 * 销毁数据字典类别
 * @return
 */
Wlj.frame.functions.app.App.prototype.destroyLookups = function(){
	for(var key in this.lookupManager){
		this.lookupManager[key].destroy();
		this.lookupManager[key] = null;
	}
};
/**
 * 构建查询条件域
 * @return
 */
Wlj.frame.functions.app.App.prototype.bootSearchDomain = function(){
	var _this = this;
	Ext.log('构建查询条件域');
	this.searchDomain = new Wlj.frame.functions.app.widgets.SearchContainer(_this.createSearchCfg());
} ;
/**
 * 构建查询条件域配置信息
 * @return
 */
Wlj.frame.functions.app.App.prototype.createSearchCfg = function(){
	var _this = this;
	var itemsArray = [];
	if(_this.searchDomainCfg && Ext.isArray(_this.searchDomainCfg.condtionFields)){
		Ext.each(_this.searchDomainCfg.condtionFields, function(cf){
			var theField = false;
			if(Ext.isString(cf)){
				theField = _this.buildConditionField(_this.getFieldsByName(cf));
			}else{
				theField = _this.buildConditionField(cf);
			}
			if(theField){
				itemsArray.push(theField);
			}
		});
	}else{
		Ext.each(this.fields,function(f){
			if(f.searchField === true){
				var theField = _this.buildConditionField(f);
				if(theField){
					itemsArray.push(theField);
				}
			}
		});
	}
	if(_this.searchDomainCfg && Ext.isFunction(_this.searchDomainCfg.fieldFn)){
		itemsArray = _this.searchDomainCfg.fieldFn.apply(_this,itemsArray);
	}
	for(var i=itemsArray.length -1 ;i>=0;i--){
		if(!itemsArray[i]){
			itemsArray.remove(itemsArray[i]);
		}
	}
	var searchCfg = {
			vs : this.seearchVs,
			region : 'north',
			_APP : this,
			layout : 'fit',
			itemsArray : itemsArray,
			buttonCfg : WLJUTIL.conditionButtons,
			multiSelectSeparator : WLJUTIL.multiSelectSeparator,
			items : [],
			hidden : !this.needCondition,
			needCloseLable4DCF : WLJUTIL.needCloseLable4DCF,
			listeners : {
				beforeconditionadd : function(fCfg,columnIndexT,searchPanel){
					return _this.fireEvent('beforeconditionadd',fCfg,columnIndexT,searchPanel);
				},
				conditionadd : function(fitem,searchPanel){
					_this.fireEvent('conditionadd',fitem,searchPanel);
				},
				beforeconditionremove : function(fitem,searchPanel){
					return _this.fireEvent('beforeconditionremove',fitem,searchPanel);
				},
				conditionremove : function(searchPanel){
					_this.fireEvent('conditionremove',searchPanel);
				},
				beforedyfieldclear : function(searchDomain, searchpanel, dyfield){
					return _this.fireEvent('beforedyfieldclear', searchDomain, searchpanel, dyfield);
				},
				afterdyfieldclear : function(searchDomain, searchpanel, dyfield){
					_this.fireEvent('afterdyfieldclear', searchDomain, searchpanel, dyfield);
				},
				beforecondtitionfieldvalue : function(field, datainfo, value){
					return _this.fireEvent('beforecondtitionfieldvalue',field,datainfo,value);
				},
				condtitionfieldvalue : function(field, datainfo, value){
					_this.fireEvent('condtitionfieldvalue',field,datainfo,value);
				}
			}
		};
	if(this.searchDomainCfg){
		Ext.apply(searchCfg, this.searchDomainCfg);
	}
	return searchCfg;
};
/**
 * 构建查询结果域
 * @return
 */
Wlj.frame.functions.app.App.prototype.bootResultDomain = function(){
	Ext.log('构建查询结果域');
	this.resultDomain = new Wlj.frame.functions.app.widgets.ResultContainer(this.createResultCfg());
};
/**
 * 构建查询结果域配置信息
 * @return
 */
Wlj.frame.functions.app.App.prototype.createResultCfg = function(){
	var _this = this;
	var createResultCfg = {};
	
	createResultCfg.needRN = this.needRN;
	createResultCfg.rnWidth = this.rnWidth;
	
	createResultCfg.multiSelectSeparator = WLJUTIL.multiSelectSeparator;
	
	createResultCfg.pageSize = this.pageSize;
	createResultCfg.url = this.url;
	createResultCfg.tbar = this.tbar;
	createResultCfg.dataFields = this.getFieldsCopy();
	createResultCfg._APP = this;
	createResultCfg.loadMaskMsg = WLJUTIL.loadMaskMsg;
	createResultCfg.gridLockedHole = WLJUTIL.suspendViews ? true : false;
	createResultCfg.suspendViews = WLJUTIL.suspendViews;
	createResultCfg.alwaysLockCurrentView = WLJUTIL.alwaysLockCurrentView;
	createResultCfg.suspendViewsWidth = WLJUTIL.viewPanelsWidth;
	createResultCfg.tbarButtonAlign = WLJUTIL.tbarButtonAlign;
	createResultCfg.tbarViewAlign = WLJUTIL.tbarViewAlign;
	createResultCfg.easingStrtegy = this.easingStrtegy;
	createResultCfg.region = 'center';
	createResultCfg.vs = this.resultVs;
	createResultCfg.needGrid = !(this.needGrid === false);
	createResultCfg.needTbar = !(this.needTbar === false);
	createResultCfg.autoLoadGrid = !(this.autoLoadGrid === false);
	createResultCfg.createView = false;
	createResultCfg.editView = false;
	createResultCfg.detailView = false;
	createResultCfg.createFormCfgs = this.createFormCfgs;
	createResultCfg.editFormCfgs = this.editFormCfgs;
	createResultCfg.detailFormCfgs = this.detailFormCfgs;
	createResultCfg.resultDomainCfg = this.resultDomainCfg ? this.resultDomainCfg : false;
	createResultCfg.listeners = {
		beforeviewhide : function(theView){
			return _this.fireEvent('beforeviewhide', theView);
		},
		viewhide : function(theView){
			_this.fireEvent('viewhide', theView);
		},
		beforeviewshow : function(theView){
			return _this.fireEvent('beforeviewshow', theView);
		},
		viewshow : function(theView){
			_this.fireEvent('viewshow', theView);
		},
		recordselect : function(record, store, tile){
			_this.fireEvent('recordselect', record, store, tile);
		},
		beforevalidate : function(view, panel){
			return _this.fireEvent('beforevalidate', view, panel);
		},
		validate : function(view, panel, error){
			_this.fireEvent('validate', view, panel, error);
		},
		beforecreateviewrender : function(view){
			return _this.fireEvent('beforecreateviewrender', view);
		},
		aftercreateviewrender : function(view){
			_this.fireEvent('aftercreateviewrender', view);
		},
		beforeeditviewrender : function(view){
			return _this.fireEvent('beforeeditviewrender', view);
		},
		aftereditviewrender : function(view){
			_this.fireEvent('aftereditviewrender', view);
		},
		beforedetailviewrender : function(view){
			return _this.fireEvent('beforedetailviewrender', view);
		},
		afterdetailviewrender : function(view){
			_this.fireEvent('afterdetailviewrender', view);
		},
		rowdblclick : function(tile, record){
			_this.fireEvent('rowdblclick', tile, record);
		}
	};
	
	if(this.createView && this.createFormViewer){
		createResultCfg.createFieldsCopy = this.getFieldsCopy();
		createResultCfg.createFormViewer = this.createFormViewer;
		createResultCfg.createValidates = this.createValidates;
		createResultCfg.createLinkages = this.createLinkages;
		createResultCfg.createView = true;
	}
	
	if(this.editView && this.editFormViewer){
		createResultCfg.editFieldsCopy = this.getFieldsCopy();
		createResultCfg.editFormViewer = this.editFormViewer;
		createResultCfg.editValidates = this.editValidates;
		createResultCfg.editLinkages = this.editLinkages;
		createResultCfg.editView = true;
	}
	
	if(this.detailView && this.detailFormViewer){
		createResultCfg.detailFieldsCopy = this.getFieldsCopy();
		createResultCfg.detailFormViewer = this.detailFormViewer;
		createResultCfg.detailView = true;
	}
	
	return createResultCfg;
};
/**
 * 构建主工作区域,包括查询条件区域和查询结果列表区域
 * @return
 */
Wlj.frame.functions.app.App.prototype.buildMajor = function(){
	var left = 'left',right = 'right', top = 'top',buttom = 'buttom';
	var leftPx = 0,rightPx = 0,topPx = 0,buttomPx = 0;
	Ext.log('构建主查询区域');
	if(this.edgeVies[left])
		leftPx = this.edgeVies[left].width;
	if(this.edgeVies[right])
		rightPx = this.edgeVies[right].width;
	if(this.edgeVies[top])
		topPx = this.edgeVies[top].height;
	if(this.edgeVies[buttom])
		buttomPx = this.edgeVies[buttom].height;
	
	this.seearchVs = {
		width : this.vs.width - leftPx - rightPx,
		height : this.searchTileBaseheight
	};
	this.resultVs = {
		width : this.vs.width - leftPx - rightPx,
		height : this.vs.height - topPx - buttomPx - this.searchTileBaseheight
	};
	this.bootSearchDomain();
	this.bootResultDomain();
	var _this = this;
	this.majorPanel = new Ext.Panel({
		frame : true,
		layout : 'form',
		height : this.vs.height - topPx - buttomPx,
		width : this.vs.width - leftPx - rightPx,
		region : 'center',
		listeners : {
			resize : function(p,aw,ah,rw,rh){
				if(Ext.isNumber(aw)){
					_this.searchDomain.setWidth(aw);
					_this.resultDomain.setWidth(aw);
				}
				var mainHeight = this.body.getViewSize().height;
				
				if(_this.needCondition){
					if(Ext.isNumber(mainHeight) && _this.searchDomain.rendered){
						_this.resultDomain.setHeight(mainHeight - _this.searchDomain.el.getHeight()+8);
					}
				}else{
					if(Ext.isNumber(mainHeight)){
						_this.resultDomain.setHeight(mainHeight);
					}
				}
			}
		},
		items : [this.searchDomain,this.resultDomain]
	});
};
/**
 * 构建上下左右边缘区域
 * @return
 */
Wlj.frame.functions.app.App.prototype.buildEdgeViews = function(){
	
	var left = 'left',right = 'right', top = 'top',buttom = 'buttom';
	var viewsCfg = this.edgeVies;
	
	if(viewsCfg[left]){
		Ext.log('构建左部面板');
		viewsCfg[left].panel = this.createEdgeView(left,viewsCfg[left]);
	}
	if(viewsCfg[right]){
		Ext.log('构建右部面板');
		viewsCfg[right].panel = this.createEdgeView(right,viewsCfg[right]);
	}
	if(viewsCfg[top]){
		Ext.log('构建顶部面板');
		viewsCfg[top].panel = this.createEdgeView(top,viewsCfg[top]);
	}
	if(viewsCfg[buttom]){
		Ext.log('构建底部面板');
		viewsCfg[buttom].panel = this.createEdgeView(buttom,viewsCfg[buttom]);
	}
};
/**
 * 构建边缘区域面板配置项
 * @param viewPosition
 * @param cfg
 * @return
 */
Wlj.frame.functions.app.App.prototype.createEdgeView = function(viewPosition,cfg){
	var result = false;
	if(!cfg){
		return result;
	}
	var baseCfg = this.edgeViewBaseCfg[viewPosition];
	Ext.applyIf(cfg, baseCfg);
	result = cfg;
	var _this = this;
	if(result.listeners){
		result.listeners.afterrender = function(p){
			p.el.on('contextmenu', function(eve){
				eve.stopEvent();
				_this.onContextMenu(eve, []);
			});
		};
	}else{
		result.listeners = {
			afterrender : function(p){
				p.el.on('contextmenu', function(eve){
					eve.stopEvent();
					_this.onContextMenu(eve, []);
				});
			}
		};
	}
	return result;
};
/**
 * 渲染页面
 * @return
 */
Wlj.frame.functions.app.App.prototype.render = function(){
	var left = 'left',right = 'right', top = 'top',buttom = 'buttom';
	var _this = this;
	var items  = [];
	if(this.edgeVies[left])
		items.push(this.edgeVies[left].panel);
	if(this.edgeVies[right])
		items.push(this.edgeVies[right].panel);
	if(this.edgeVies[top])
		items.push(this.edgeVies[top].panel);
	if(this.edgeVies[buttom])
		items.push(this.edgeVies[buttom].panel);
	items.push(this.majorPanel);
	Ext.log('页面渲染！');
	this.viewPort = new Ext.Viewport({
		layout:'border',
		items : items,
		listeners : {
			afterrender : function(){
				_this.searchDomain.fixSearchHeight();
				
			}
		}
	});
//	var rTemplate = new Ext.Template(
//	'<div title="提示" class="ycl-ico"></div>');
//	
//	_this.infoDD  = Ext.get(rTemplate.append(Ext.getBody()));
//	
//	_this.infoDD.initDD('dsf');
//	
//	_this.infoDD.on('mouseup',function(e,t,o){
//		_this.infoDD.animate({
//			left : {
//				to : Ext.getBody().getWidth() - _this.infoDD.getWidth(),
//				from : _this.infoDD.getLeft()
//			}
//		},
//		0.35,
//		null,
//		'easeOut',
//		'run');
//	});
};
Wlj.frame.functions.app.App.prototype.onContextMenu = function(e,added){
	
	if(!this.contextMenuAble){
		return false;
	}
	var windowMenu = WLJUTIL.contextMenus.window;
	for(var key in windowMenu){
		var omenu = {};
		omenu.text = windowMenu[key].text;
		omenu.handler = windowMenu[key].fn.createDelegate(this);
		added.push(omenu);
	}
	new Ext.menu.Menu({
        items: added
    }).showAt(e.getXY());
};
Wlj.frame.functions.app.App.prototype.onMetaAdd = function(field){
	this.fields.push(field);
	this.resultDomain.onMetaAdd(field);
};
Wlj.frame.functions.app.App.prototype.onMetaRemove = function(field){
	var fCfg = this.getFieldsByName(field);
	if(!fCfg){
		return false;
	}
	this.fields.remove(fCfg);
	this.resultDomain.onMetaRemove(field);
};
Wlj.frame.functions.app.App.prototype.onMetaAddAfter = function(addField, theField){
	if(!this.getFieldsByName(theField)){
		this.onMetaAdd(addField);
	}else{
		this.resultDomain.onMetaAddAfter(addField, theField);
	}
};
Wlj.frame.functions.app.App.prototype.onMetaAddBefore = function(addField, theField){
	if(!this.getFieldsByName(theField)){
		this.onMetaAdd(addField);
	}else{
		this.resultDomain.onMetaAddBefore(addField, theField);
	}
};
Wlj.frame.functions.app.App.prototype.buildSpecilPatch = function(){
	Ext.util.JSON.encodeDate = function(d) {
	    return '"'+d.format(WLJUTIL.defaultDateFormat)+'"';
	};
};
Wlj.frame.functions.app.App.prototype.buildConditionField = function(f){
	var _this = this;
	if(!f || !f.name || !f.text){
		return false;
	}
	var fCfg = {};
	if(!f.xtype){
		fCfg.xtype = f.translateType?(f.multiSelect?'lovcombo':'combo'):'textfield';
	}else{
		fCfg.xtype = f.xtype;
	}
	fCfg.store = f.translateType?_this.lookupManager[f.translateType]:false;
	if(f.translateType){
		fCfg.valueField = 'key';
		fCfg.displayField = 'value';
		fCfg.editable = typeof f.editable === 'boolean' ? f.editable : false;
		fCfg.forceSelection = true;
		fCfg.triggerAction = 'all';
		fCfg.mode = 'local';
		fCfg.hiddenName = f.name;
		fCfg.separator = f.multiSeparator?f.multiSeparator:WLJUTIL.multiSelectSeparator;
	}else{
		fCfg.name = f.name;
	}
	Ext.applyIf(fCfg, f);
	delete fCfg.allowBlank;
	fCfg.fieldLabel = f.text ? f.text : f.name;
	return fCfg;
};
/******************************API***************************************/
/**
 * 设置查询条件面板尺寸
 * @param obj：{
 * 			width: 100,
 * 			hieght: 100
 * 				},高宽属性均为可选属性
 * @return
 */
Wlj.frame.functions.app.App.prototype.setSearchSize = function(obj){
	
	if(!this.needCondition){
		return false;
	}
	var sh,sw;
	if(Ext.isNumber(obj.height)){
		sh = obj.height;
	}
	if(Ext.isNumber(obj.width)){
		sw = obj.width;
	}
	var searchDomain = this.searchDomain;
	var searchPanel = this.searchDomain.searchPanel;
	var searchVs = searchDomain.el ? searchDomain.el.getViewSize() : this.seearchVs;
	var resultDomain = this.resultDomain;
	var majorVs = this.majorPanel.el ? this.majorPanel.el.getViewSize() : {height:0,width:0};
	if(Ext.isNumber(sh)){
		searchDomain.setHeight(sh);
		resultDomain.setHeight(majorVs.height - sh);
	}
	if(Ext.isNumber(sw)){
		searchDomain.setWidth(sw+'px');
	}
};
/**
 * 根据字典类型,获取字典STORE
 * @param type
 * @return
 */
Wlj.frame.functions.app.App.prototype.findLookupByType = function(type){
	if(!type){
		return false;
	}
	if(!this.lookupManager[type]){
		return false;
	}
	return this.lookupManager[type];
};
/**
 * 根据指定配置，刷行一个数据字典数据；
 * @param type
 * @param config
 * @return
 */
Wlj.frame.functions.app.App.prototype.reloadLookup = function(type, config){
	var lStore = this.findLookupByType(type);
	var _this = this;
	if(!lStore){
		return false;
	}else{
		if(!lStore.proxy){
			Ext.warn('数据字典类型【'+type+'】为本地数据字典，无法reload！');
			return false;
		}
		var ccb = config?config.callback : false;
		var cb = function(records, option, succeed){
			Ext.log('lookup store : '+type+' has bean reload!');
			_this.fireEvent('lookupreload', type, lStore, records, config, succeed);
			if(Ext.isFunction(ccb)){
				ccb.call(lStore, records, config, succeed);
			}
		};
		var reloadAble = this.fireEvent('beforelookupreload', type, lStore, config);
		if(reloadAble === false){
			return false;
		}
		var cfg = {};
		Ext.apply(cfg, config);
		cfg.callback = cb;
		try{
			lStore.reload(cfg);
		}catch(e){
			Ext.error('reload lookup '+type+' error!');
		}
	}
};
/**
 * 根据字典类型,把key转换为值
 * @param type
 * @param key
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateLookupByKey = function(type, key){
	var typeStore = this.findLookupByType(type);
	if(!typeStore){
		return key;
	}
	var tDataIndex = typeStore.findExact('key',key);
	if(tDataIndex < 0){
		return key;
	}
	var record = typeStore.getAt(tDataIndex);
	return record.get('value');
};
/**
 * 根据字典类型,把值转换为key
 * @param type
 * @param value
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateLookupByValue = function(type, value){
	var typeStore = this.findLookupByType(type);
	if(!typeStore){
		return false;
	}
	var tDataIndex = typeStore.findExact('value',value);
	if(tDataIndex < 0){
		return false;
	}
	var record = typeStore.getAt(tDataIndex);
	return record.get('key');
};
/**
 * 根据字典类型,把多个以分隔符连接的key转换为值
 * @param type
 * @param key
 * @param separator
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateLookupByMultiKey = function(type, key, separator){
	var typeStore = this.findLookupByType(type);
	if(!typeStore || !separator){
		return key;
	}
	var datas = key.split(separator);
	var returnData = '';
	Ext.each(datas,function(data){
		var tDataIndex = typeStore.findExact('key',data);
		if(tDataIndex < 0){
			returnData += data;
		} else {
			returnData += typeStore.getAt(tDataIndex).get('value');
		}
		returnData += separator;
	});
	returnData = returnData.substring(0,returnData.lastIndexOf(separator));
	return returnData;
};
/**
 * 根据字典类型,把多个以分隔符连接的值转换为key
 * @param type
 * @param value
 * @param separator
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateLookupByMultiValue = function(type, value, separator){
	var typeStore = this.findLookupByType(type);
	if(!typeStore || !separator){
		return value;
	}
	var datas = value.split(separator);
	var returnData = '';
	Ext.each(datas,function(data){
		var tDataIndex = typeStore.findExact('value',data);
		if(tDataIndex < 0){
			returnData += data;
		} else {
			returnData += typeStore.getAt(tDataIndex).get('key');
		}
		returnData += separator;
	});
	returnData = returnData.substring(0,returnData.lastIndexOf(separator));
	return returnData;
};
/**
 * 设置查询条件并刷新数据
 * @param params : 参数
 * @param forceLoad : 是否强制刷新,default : true
 * @param add : 是否清除过期条件,default : true
 * @param transType : 是否需要转换字段命名模式,默认为APP的SEARCHFIELDTRANS属性;1：转为驼峰命名;2：转为大写下划线模式;3：不做转换;
 * @return
 */
Wlj.frame.functions.app.App.prototype.setSearchParams = function(params, forceLoad, add, transType, callbackFn){
	var resultDomain = this.resultDomain;
	
	var settable = this.fireEvent('beforesetsearchparams',params, forceLoad, add, transType);
	
	if(settable === false){
		return false;
	}
	
	if(!params){
		return false;
	}
	if(add === false){
		if(!resultDomain.searchGridView.currentParams){
			resultDomain.searchGridView.currentParams = {};
		}
	}else{
		delete resultDomain.searchGridView.currentParams;
		resultDomain.searchGridView.currentParams = {};
	}
	
	var transType = transType? transType : this.SEARCHFIELDTRANS;
	
	Ext.apply(resultDomain.searchGridView.currentParams,this.translateDataKey(params,transType));
	resultDomain.searchGridView.currentPage = 0;
	this.fireEvent('setsearchparams',params, forceLoad, add, transType);
	if(forceLoad === false){
		resultDomain.searchGridView.store.baseParams = {"condition":Ext.encode(resultDomain.searchGridView.currentParams)};
	}else{
		resultDomain.searchGridView.turnToCurrentPage(callbackFn);
	}
};
/***
 * 获取查询store
 * @return
 */
Wlj.frame.functions.app.App.prototype.getResultStore = function(){
	return this.resultDomain.store;
};
/**
 * 刷新当前数据
 * @return
 */
Wlj.frame.functions.app.App.prototype.reloadCurrentData = function(){
	this.resultDomain.searchGridView.turnToCurrentPage();
};
/**
 * 获取结果域中当前选择数据对象。如无选择数据,则返回false;如选择多条数据，则返回最后一条；
 * @return
 */
Wlj.frame.functions.app.App.prototype.getSelectedData = function(){
	var selectedData = this.resultDomain.searchGridView.getSelected();
	if(selectedData.length<=0){
		return false;
	}else{
		return selectedData[selectedData.length-1];
	}
};
/**
 * 返回当前所有选择数据对象数组。如无选择数据，则返回空数组。
 * @return
 */
Wlj.frame.functions.app.App.prototype.getAllSelects = function(){
	return this.resultDomain.searchGridView.getSelected();
};
/**
 * 判断当前是否有选中的数据行
 * @return boolean
 */
Wlj.frame.functions.app.App.prototype.hasSelected = function(){
	return this.resultDomain.searchGridView.getSelected().length>0;
};
/**
 * 根据index选择数据，
 * @param index：数据行的顺序，从0开始计数；可为单个数字，也可为一个数字组成的数组，如：[1,2,3,4]
 * @return
 */
Wlj.frame.functions.app.App.prototype.selectByIndex = function(index){
	this.resultDomain.searchGridView.selectByIndex(index);
};
/**
 * 取消所有的数据行选择
 * @return
 */
Wlj.frame.functions.app.App.prototype.clearSelect = function(){
	this.resultDomain.searchGridView.clearSelect();
};
/**
 * 反选当前页数据
 * @return
 */
Wlj.frame.functions.app.App.prototype.antiSelect = function(){
	this.resultDomain.searchGridView.antiSelect();
};
/**
 * 全选当前页数据
 * @return
 */
Wlj.frame.functions.app.App.prototype.allSelect = function(){
	this.resultDomain.searchGridView.allSelect();
};
/**
 * 数据提交
 * @param data ：当前表单捕获数据,json格式;
 * @param comitUrl ：可选参数,提交URL,系统默认为app对象的提交URL
 * @param needPid ： 是否需要返回提交数据主键
 * @return
 */
Wlj.frame.functions.app.App.prototype.comitData = function(data,comitUrl,needPid){
	var cUrl = comitUrl?comitUrl:this.comitUrl;
	var commitable = this.fireEvent('beforecommit',data,cUrl);
	if(commitable === false){
		return false;
	}
	if(!cUrl){
		return false;
	}
	var commintData = this.translateDataKey(data,this.VIEWCOMMITTRANS);
	if(Ext.encode(commintData) === "{}"){
		Ext.Msg.alert('提示','提交数据为空！');
		return false;
	}
	var _this = this;
	Ext.Ajax.request({
		url : cUrl,
		method : 'POST',
		params : commintData,
		success : function(response){
			Ext.Msg.alert('提示','保存成功');
			_this.fireEvent('afertcommit',data,cUrl,true);
			if(_this.needGrid !== false){
				_this.reloadCurrentData();
			}
		},
		failure: function(){
			_this.fireEvent('afertcommit',data,cUrl,false);
		}
	});
};

Wlj.frame.functions.app.App.prototype.deleteData = function(){
	
};
/**
 * 转换数据字段名格式,对于空数据项,进行剪除。返回新副本,不变动传入参数的结构
 * @param data ： 待提交数据
 * @param transtype ： 转换类型,1：从大写下划线转换为驼峰命名;2：从驼峰命名转换为大写下划线类型;默认为1;3、不做转换;
 * @return
 */
Wlj.frame.functions.app.App.prototype.translateDataKey = function(data,transtype){
	var translateType = transtype===2?2:transtype===1?1:3;
	var finnalData = {};
	function stringTrans(string){
		if(translateType == 1){
			var strArr = string.toLowerCase().split('_');
			var result = '';
			if(strArr.length <= 0){
				return result;
			}
			for(var i=1;i<strArr.length;i++){
				strArr[i] = strArr[i].substring(0,1).toUpperCase() + strArr[i].substring(1);
			}
			result = strArr.join('');
			return result;
		}else if(translateType==2){
			if(string.length == 0){
				return false;
			}
			var len = string.length;
			var wordsArr = [];
			var start = 0;
			var cur = 0;
			while(cur < len){
				if(string.charCodeAt(cur)<= 90 && string.charCodeAt(cur) >= 65){
					wordsArr.push(string.substring(start,cur).toUpperCase());
					start = cur;
				}
				cur ++ ;
			}
			wordsArr.push(string.substring(start, len).toUpperCase());
			return wordsArr.join('_');
		}else {
			return string;
		}
	}
	for(var key in data){
		if(!data[key]){
			continue;
		}else {
			finnalData[stringTrans(key)] = data[key];
		}
	}
	return finnalData;
};
Wlj.frame.functions.app.App.prototype.reboot = function(){};
/**
 * 根据name属性,获取字段配置信息原本;
 * @param name：可为String类型或者数组;
 * @return
 */
Wlj.frame.functions.app.App.prototype.getFieldsByName = function(name){
	if(!this.fields){
		return false;
	}
	if(!name){
		return false;
	}
	var _this = this;
	if(Ext.isArray(name)){
		var fields = new Array();
		Ext.each(name,function(n){
			Ext.each(_this.fields,function(f){
				if(f.name === n){
					fields.push(f);
				}
			});
		});
		return fields.length>0?fields:false;
	}else if(Ext.isString(name)){
		for(var i=0;i< this.fields.length; i++){
			var field = this.fields[i];
			if(field.name === name){
				return field;
			}
		}
	}
	return false;
};
/**
 * 根据name属性,创建字段配置信息副本;
 * @param name：可为String类型或者数组;
 * @return
 */
Wlj.frame.functions.app.App.prototype.copyFieldsByName = function(name){
	var fields = this.getFieldsByName(name);
	if(!fields){
		return false;
	}
	if(Ext.isArray(fields)){
		var result = new Array();
		Ext.each(fields,function(f){
			var rt = {};
			Ext.apply(rt,f);
			result.push(rt);
		});
		return result;
	}else {
		var result = {};
		Ext.apply(result,fields);
		return result;
	}
};
/**
 * 创建APP对象整体基础字段配置副本
 * @return
 */
Wlj.frame.functions.app.App.prototype.getFieldsCopy = function(){
	var copy = [];
	Ext.each(this.fields,function(f){
		var cf = {};
		Ext.apply(cf,f);
		copy.push(cf);
	});
	return copy;
};
/**
 * 收起查询条件面板
 * @return
 */
Wlj.frame.functions.app.App.prototype.collapseSearchPanel = function(){
	if(this.searchDomain.WCLP){
		return false;
	}
	var collapseable = this.fireEvent('beforeconditioncollapse', this.searchDomain);
	if(collapseable === false){
		return false;
	}
	this.searchDomain.realHeight = this.searchDomain.getHeight();
	this.searchDomain.collapse();
	this.setSearchSize({
		height:0
	});
	this.searchDomain.WCLP = true;
	this.fireEvent('afterconditioncollapse',this.searchDomain);
};
/**
 * 展开查询面板
 * @return
 */
Wlj.frame.functions.app.App.prototype.expandSearchPanel = function(){
	if(!this.searchDomain.WCLP){
		return false;
	}
	var expandable = this.fireEvent('beforeconditionexpand', this.searchDomain);
	if(expandable === false){
		return false;
	}
	this.searchDomain.expand();
	if(Ext.isNumber(this.searchDomain.realHeight)){
		this.setSearchSize.defer(150,this,[{
			height:this.searchDomain.realHeight
		}]);
	}
	this.searchDomain.WCLP = false;
	this.fireEvent('afterconditionexpand', this.searchDomain);
};
/**
 * 获取边缘面板对象；
 * params ： 'left','right','top','buttom'
 */
Wlj.frame.functions.app.App.prototype.getEdgePanel = function(position){
	var pm = {
		left : 'west',
		west : 'west',
		right : 'east',
		east : 'east',
		top : 'north',
		north : 'north',
		buttom : 'south',
		south : 'south'
	};
	return (this.viewPort.rendered && this.viewPort.layout[pm[position]])?this.viewPort.layout[pm[position]].panel : false;
};
/**
 * 重置查询条件；
 * params ： deldy : 是否删除动态字段；
 */
Wlj.frame.functions.app.App.prototype.resetCondition = function(deldy){
	this.searchDomain.resetCondition(deldy);
};
/**
 * 获取当前展示信息VIEW对象,展示列表时,返回undefined;
 */
Wlj.frame.functions.app.App.prototype.getCurrentView = function(){
	return this.resultDomain.currentView;
};
/**
 * 隐藏当前展示信息VIEW对象；
 */
Wlj.frame.functions.app.App.prototype.hideCurrentView = function(){
	if(WLJUTIL.suspendViews){
		this.resultDomain.hideCurrentView();
	}else{
		this.resultDomain.gridMoveIn();
	}
};
/**
 * 获取详情VIEW,无详情面板返回false；
 */
Wlj.frame.functions.app.App.prototype.getDetailView = function(){
	return this.resultDomain.viewPanel.detailView?this.resultDomain.viewPanel.detailView:false;
};
/**
 * 获取新增VIEW,无新增面板返回false；
 */
Wlj.frame.functions.app.App.prototype.getCreateView = function(){
	return this.resultDomain.viewPanel.createView?this.resultDomain.viewPanel.createView:false;
};
/**
 * 获取修改VIEW,无修改面板返回false；
 */
Wlj.frame.functions.app.App.prototype.getEditView = function(){
	return this.resultDomain.viewPanel.editView?this.resultDomain.viewPanel.editView:false;
};
/**
 * 展示详情VIEW,无详情面板返回false；
 */
Wlj.frame.functions.app.App.prototype.showDetailView = function(){
	var detailView = this.getDetailView();
	if(!detailView || detailView == this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(detailView);
};
/**
 * 展示新增VIEW,无新增面板返回false；
 */
Wlj.frame.functions.app.App.prototype.showCreateView = function(){
	var createView = this.getCreateView();
	if(!createView || createView == this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(createView);
};
/**
 * 展示修改VIEW,无修改面板返回false；
 */
Wlj.frame.functions.app.App.prototype.showEditView = function(){
	var editView = this.getEditView();
	if(!editView || editView == this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(editView);
};
/**
 * 根据标题获取自定义信息VIEW
 * @param title : view标题
 * @return
 */
Wlj.frame.functions.app.App.prototype.getCustomerViewByTitle = function(title){
	var views = this.resultDomain.customerViewPanels;
	for(var i=0;i<views.length; i++){
		if(views[i]._defaultTitle == title){
			return views[i];
		}
	}
	return false;
};
/**
 * 根据顺序获取自定义信息VIEW
 * @param index：顺序
 * @return
 */
Wlj.frame.functions.app.App.prototype.getCustomerViewByIndex = function(index){
	var views = this.resultDomain.customerViewPanels;
	return views[index]?views[index]:false;
};
/**
 * 根据标题展示自定义信息VIEW
 * @param title：标题
 * @return
 */
Wlj.frame.functions.app.App.prototype.showCustomerViewByTitle = function(title){
	var view = this.getCustomerViewByTitle(title);
	if(!view || view === this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(view);
};
/**
 * 根据顺序展示自定义信息VIEW
 * @param index：顺序
 * @return
 */
Wlj.frame.functions.app.App.prototype.showCustomerViewByIndex = function(index){
	var view = this.getCustomerViewByIndex(index);
	if(!view || view === this.getCurrentView()){
		return false;
	}
	this.resultDomain.showView(view);
};
/**
 * 锁定查询结果列表，下一次查询结果重新加载数据时，不在执行结果列表滑入方法；相关事件也不再触发；
 * 结果列表锁定状态只能持续一次查询；包括手动调用和自动触发；
 * @return
 */
Wlj.frame.functions.app.App.prototype.lockGrid = function(){
	this.resultDomain.gridLockedOnce = true;
};
/**
 * 解锁查询结果列表锁定状态，如其为未锁定状态，则无任何影像；
 * @return
 */
Wlj.frame.functions.app.App.prototype.unlockGrid = function(){
	this.resultDomain.gridLockedOnce = false;
};
/**
 * 展示下一个面板
 * @return
 */
Wlj.frame.functions.app.App.prototype.showNextView = function(){
	this.resultDomain.showNextView();
};
/**
 * 根据字段name属性进行排序
 * @param dataIndex：字段name属性
 * @param info：可选：asc、desc；小写。
 * @return
 */
Wlj.frame.functions.app.App.prototype.sortByDataIndex = function(dataIndex, info){
	this.resultDomain.searchGridView.sort(dataIndex, info);
};
/**
 * 根据字段name属性显示该字段
 * @param fields：string/array ，可为单个字段名，也可为字段名属性
 * @return
 */
Wlj.frame.functions.app.App.prototype.showGridFields = function(fields){
	this.resultDomain.searchGridView.showFields(fields);
};
/**
 * 根据字段name属性隐藏该字段
 * @param fields：string/array ，可为单个字段名，也可为字段名属性
 * @return
 */
Wlj.frame.functions.app.App.prototype.hideGridFields = function(fields){
	this.resultDomain.searchGridView.hideFields(fields);
};
/**
 * 获取当前已隐藏的字段name属性数组
 * @return
 */
Wlj.frame.functions.app.App.prototype.getGridHiddenFields = function(){
	return this.resultDomain.searchGridView.getHiddenFields();
};
/**
 * 添加一个查询条件字段
 * @param field：String/Object:当参数为String类型的时候，系统将会根据name属性查找元数据（fields）中的配置进行添加；
 * 							   当参数Object类型的时候，系统将会根据参数本身的配置，进行添加。参数配置参加fields属性中字段配置项；
 * @return
 */
Wlj.frame.functions.app.App.prototype.addConditionField = function(field){
	this.searchDomain.addField(field);
};
/**
 * 移除一个查询条件字段
 * @param field：String/Object：当参数为String类型的时候，系统将会根据name属性移除字段；
 * 								当参数为Object类型的时候，判断其为实际的字段对象还是配置项，如为字段对象直接移除，如为配置，则根据参数的name属性移除。
 * @return
 */
Wlj.frame.functions.app.App.prototype.removeConditionField = function(field){
	this.searchDomain.removeField(field);
};
/**
 * 获取一个查询条件字段
 * @param field：String/Object：String类型则根据字段name属性获取字段；Object类型则根据参数中的name属性进行匹配。
 * @return
 */
Wlj.frame.functions.app.App.prototype.getConditionField = function(field){
	return this.searchDomain.getField(field);
};
/**
 * 判断是否存在一个查询条件字段
 * @param field：String/Object：String类型则根据字段name属性获取字段；Object类型则根据参数中的name属性进行匹配。
 * @return
 */
Wlj.frame.functions.app.App.prototype.hasConditionField = function(field){
	if(this.getConditionField(field)){
		return true;
	}else{
		return false;
	}
};
/**
 * 添加一个字段元数据,实时展现在列表对象上.不影响面板及其他,待更新
 * @param field：object，字段配置
 * @return
 */
Wlj.frame.functions.app.App.prototype.addMetaField = function(field){
	if(!Ext.isObject(field)){
		return false;
	}
	if(!field.name){
		return false;
	}
	if(this.getFieldsByName(field.name)){
		return false;
	}
	this.onMetaAdd(field);
};
/**
 * 移除一个字段元数据，实时反映在列表对象上，不影响面板及其他，待更新
 * @param field：string/object
 * @return
 */
Wlj.frame.functions.app.App.prototype.removeMetaField = function(field){
	var fieldName = '';
	if(Ext.isObject(field)){
		if(!field.name){
			return false;
		}else{
			fieldName = field.name;
		}
	}else if(Ext.isString(field)){
		fieldName = field;
	}
	this.onMetaRemove(field);
};
/**
 * 在指定字段之后添加字段。
 * @param addField：被添加字段配置；参见字段配置；
 * @param theField：指定字段name属性，string类型；如未发现指定字段，则添加至最后；
 * @return
 */
Wlj.frame.functions.app.App.prototype.addMetaAfter = function(addField, theField){
	if(!Ext.isObject(addField)){
		return false;
	}
	if(!addField.name){
		return false;
	}
	if(this.getFieldsByName(addField.name)){
		return false;
	}
	this.onMetaAddAfter(addField, theField);
};
/**
 * 在指定字段之前添加字段。
 * @param addField：被添加字段配置；参见字段配置；
 * @param theField：指定字段name属性，string类型；如未发现指定字段，则添加至最后；
 * @return
 */
Wlj.frame.functions.app.App.prototype.addMetaBefore = function(addField, theField){
	if(!Ext.isObject(addField)){
		return false;
	}
	if(!addField.name){
		return false;
	}
	if(this.getFieldsByName(addField.name)){
		return false;
	}
	this.onMetaAddBefore(addField, theField);
};
/**
 * 是否存在查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.hasConditionButton = function(but){
	return this.searchDomain.hasConditionButton(but);
};
/**
 * 禁用查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.disableConditionButton = function(but){
	this.searchDomain.disableConditionButton(but);
};
/**
 * 启用查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.enableConditionButton = function(but){
	this.searchDomain.enableConditionButton(but);
};
/**
 * 隐藏查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.hideConditionButton = function(but){
	this.searchDomain.hideConditionButton(but);
};
/**
 * 显示查询面板按钮
 * @param but:操作的按钮类型,Wlj.frame.functions.app.App.prototype.BUTTON_TYPE
 * @return
 */
Wlj.frame.functions.app.App.prototype.showConditionButton = function(but){
	this.searchDomain.showConditionButton(but);
};
/**
 * 遮罩指定区域
 * @param regions: String/Array[String]:需要遮罩的区域'left','right','top','buttom',
 * 'east','west','north','south','searchDomain','resultDomain'
 * @param message: String:遮罩提示信息
 * */
Wlj.frame.functions.app.App.prototype.maskRegion = function(regions,message){
	var _this = this;
	function mask(r){
		if (r == 'searchDomain') {
			if (_this.searchDomain) {
				_this.searchDomain.getEl().mask(message);
			}
		} else if(r == 'resultDomain') {
			if (_this.resultDomain) {
				_this.resultDomain.getEl().mask(message);
			}
		} else {
			if (_this.getEdgePanel(r)) {
				_this.getEdgePanel(r).getEl().mask(message);
			}
		}
	}
	if (regions instanceof Array) {
		regions.forEach(mask);
	} else {
		mask(regions);
	}
};
/**
 * 去遮罩指定区域
 * @param String/Array[String]:需要去遮罩的区域'left','right','top','buttom',
 * 'east','west','north','south','searchDomain','resultDomain'
 * */
Wlj.frame.functions.app.App.prototype.unmaskRegion = function(regions){
	var _this = this;
	function unmask(r){
		if (r == 'searchDomain') {
			if (_this.searchDomain) {
				_this.searchDomain.getEl().unmask();
			}
		} else if(r == 'resultDomain') {
			if (_this.resultDomain) {
				_this.resultDomain.getEl().unmask();
			}
		} else {
			if (_this.getEdgePanel(r)) {
				_this.getEdgePanel(r).getEl().unmask();
			}
		}
	}
	if (regions instanceof Array) {
		regions.forEach(unmask);
	} else {
		unmask(regions);
	}
};
/**
 * 打开客户视图
 * @param String/Object : custId 客户ID 或 {viewId :客户ID}
 */
Wlj.frame.functions.app.App.prototype.openCustomerView = function(cfg){
	if(Ext.isFunction(top.window.openCustomerView)) {
		top.window.openCustomerView(cfg);
	}
};
Wlj.frame.functions.app.App.prototype.setFieldTile = function(cfg){
	var _this = this;
	if(Ext.isArray(cfg)){
		Ext.each(cfg, function(c){
			_this.setFieldTile(c);
		});
	}else{
		if(Ext.isObject(cfg)){
			if(cfg.name && cfg.text ){
				this.resultDomain.searchGridView.setFieldTitle(cfg);
			}
		}
	}
};

Wlj.frame.functions.app.App.prototype.addStepData = function(record){
	if(!window._IM){
		return false;
	}
	var stepO = window._IM.fc.getStepContainerByResId(this.resId);
	stepO.addData(record);
};
Wlj.frame.functions.app.App.prototype.getViewTotalIndex = function(view){
	var rd = this.resultDomain;
	return view.getIndex();
};
Wlj.frame.functions.app.App.prototype.showViewByTotalIndex = function(index){
	var rd = this.resultDomain;
	rd.showView(rd.getViewByTotleIndex(index));
};
Wlj.frame.functions.app.App.prototype.getStat = function(){
	var appStat = {};
	appStat.curParams = this.resultDomain.searchGridView.currentParams;
	var alls = this.getAllSelects();
	var ss = [];
	Ext.each(alls, function(data){
		ss.push(data.store.indexOf(data));
	});
	appStat.sels = ss;
	if(this.getCurrentView()){
		var cvindex = this.getViewTotalIndex(this.getCurrentView());
		appStat.cindex = cvindex;
	}
	return appStat;
};
Wlj.frame.functions.app.App.prototype.initStat = function(stat){
	var _this= this;
	if(stat.curParams){
		this.searchDomain.searchPanel.getForm().setValues(stat.curParams);
		this.setSearchParams(stat.curParams, true,true,undefined,function(){
			if(stat.sels){
				_this.selectByIndex(stat.sels);
			}
			if(Ext.isNumber(stat.cindex)){
				_this.showViewByTotalIndex(stat.cindex);
			}
		});
	}
};
/**
 * 构建一个可以用于form表单的字段，根据fields中的配置
 * @param name
 * @return
 */
Wlj.frame.functions.app.App.prototype.buildFormField = function(name){
	var theField = this.getFieldsByName(name);
	if(!theField) return false;
	var f = {};
	Ext.apply(f, theField);
	f.fieldLabel  = f.text ? f.text : f.name;
	f.xtype = f.xtype? f.xtype : 'textfield';
	f.hidden = typeof f.hidden === 'boolean' ? f.hidden : f.text ? false : true;
	f.anchor = '90%';
	if(f.allowBlank === false){
		f.fieldLabel = WLJTOOL.addBlankFlag(f.fieldLabel);
	}
	if(f.translateType){
		f.xtype = f.multiSelect?'lovcombo':'combo';
		f.store = this.lookupManager[f.translateType];
		if(!f.store){
			Ext.error('字段【'+f.text+'】的数据字典映射项store【'+f.translateType+'】获取错误，请检查[lookupTypes|localLookup]项配置');
			return false;
		}
		f.valueField = 'key';
		f.displayField = 'value';
		f.editable = typeof f.editable === 'boolean' ? f.editable : false;
		f.forceSelection = true;
		f.triggerAction = 'all';
		f.mode = 'local';
		f.hiddenName = f.name;
		f.separator = f.multiSeparator?f.multiSeparator:WLJUTIL.multiSelectSeparator;
	}else{
		f.name = f.name;
		if(f.dataType && WLJDATATYPE[f.dataType]){
			f.xtype = WLJDATATYPE[f.dataType].getFieldXtype();
			Ext.applyIf(f, WLJDATATYPE[f.dataType].getFieldSpecialCfg());
		}
	}
	return f;
};
/**
 * 构造一个可以用于grid表头的配置，根据fields的配置
 * @param name
 * @return
 */
Wlj.frame.functions.app.App.prototype.buildGridColumn = function(name){
	var theField = this.getFieldsByName(name);
	if(!theField) return false;
	var f = {};
	Ext.apply(f, theField);
	f.header = f.text;
	if(!f.text){
		f.hidden = true;
	}
	f.dataIndex = f.name;
	delete f.xtype;
	
	if(f.dataType && WLJDATATYPE[f.dataType]){
		f.type = WLJDATATYPE[f.dataType].getStoreType();
		Ext.applyIf(f, WLJDATATYPE[f.dataType].getStoreSpecialCfg());
	}
	return f;
};
/**
 * 构造一个可以用于store中字段定义的配置，根据fields的配置
 * @param name
 * @return
 */
Wlj.frame.functions.app.App.prototype.buildStoreField = function(name){
	var theField = this.getFieldsByName(name);
	if(!theField) return false;
	var f = {};
	Ext.apply(f, theField);
	if(f.dataType && WLJDATATYPE[f.dataType]){
		f.type = WLJDATATYPE[f.dataType].getStoreType();
		Ext.applyIf(f, WLJDATATYPE[f.dataType].getStoreSpecialCfg());
	}
	return f;
};
