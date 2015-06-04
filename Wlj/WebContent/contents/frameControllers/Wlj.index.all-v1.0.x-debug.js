/**
 * 同步AJAX对象
 * 
 */
(function(){
	var Wlj = {};
	if(!window.Wlj){
		window.Wlj = Wlj;
	}
	
	SyncAjax = function() {
		var _this = this;
		_this.initialize();
	};
	Ext.extend(SyncAjax, Ext.util.Observable);
	SyncAjax.prototype.disableCachingParam = '_dc';
	SyncAjax.prototype.method   = 'GET';//默认为GET方法
	SyncAjax.prototype.success  = false;
	SyncAjax.prototype.failure  = false;
	/***
	 * 初始化方法
	 * @return
	 */
	SyncAjax.prototype.initialize  = function(){
		var _this = this;
		this.addEvents({
			/**SyncAjax对象初始化**/
			/**
			 * SyncAjax 请求之前触发；
			 * params ：  
			 * return ：  
			 */
			beforeRequest : true,
			/**
			 * SyncAjax 请求之后触发；
			 * params ：  
			 */
			afterRequest : true,
			/**
			 * SyncAjax 请求异常触发；
			 * params ：  
			 */
			requestException : true,
			/**
			 * SyncAjax 请求成功触发；
			 * params ：  
			 */
			requestSucess : true,
			/**
			 * SyncAjax 请求失败触发；
			 * params ：  
			 */
			requestFailure : true
		});
	};
	/***
	 * 同步AJAX请求
	 */
	SyncAjax.prototype.request = function(cfg){
		var _this = this;
		var xhr;
		var value;
		try {
			if (window.ActiveXObject) {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
		    } else if (window.XMLHttpRequest) {
		    	xhr = new XMLHttpRequest();
		    }
			if (cfg.url.indexOf('?') > 0) {
				cfg.url = cfg.url + '&' +  Ext.urlEncode(cfg.params);
			} else {
				cfg.url = cfg.url + '?' +  Ext.urlEncode(cfg.params);
			}
			cfg.url = Ext.urlAppend(cfg.url, this.disableCachingParam + '=' + (new Date().getTime()));
			xhr.open(_this.method, cfg.url, false);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			var initFlag = _this.fireEvent('beforeRequest', this);
			if(initFlag === false){
				Ext.error('beforeRequest事件阻止了SyncAjax 请求!');
				return false;
			}
			xhr.send(null);
			_this.fireEvent('afterRequest', this);
			if (xhr.status == 200) {
				var _this = this;
				_this.fireEvent('requestSucess', this);
				if(Ext.isFunction(cfg.success)){ 
					cfg.success(xhr);
				}
			} else {
				var _this = this;
				Ext.log('Wlj.SyncAjax.syncRequest异常:[' + xhr.statusText + ']');
				_this.fireEvent('requestFailure', this);
				if(Ext.isFunction(cfg.failure)){ 
					cfg.failure(xhr);
				}
			}			
		} catch (eo) {
			Ext.log('Wlj.syncRequest异常');
			_this.fireEvent('syncException', this);
		} 
	}; 
	window.Wlj.SyncAjax = new SyncAjax();
})();

//var Wlj = {};
//window.Wlj = Wlj;
/**
 * 
 */
Wlj.version = {
	major : '1',
	subject : '0',
	patch : '0',
	fullVersion : '1.0.0',
	fullName : 'Walk Lonely Javascript',
	buildDate : '20131104',
	describe : 'Release 1.0.0 beta, based on Ext 3.3.1'
};

Wlj.tools = {
	namespace : function(){
		var o, d;
		Ext.each(arguments, function(v) {
			d = v.split(".");
			o = window[d[0]] = window[d[0]] || {};
			Ext.each(d.slice(1), function(v2){
				o = o[v2] = o[v2] || {};
			});
		});
		return o;
	},
	imports : function(files, callback){
		if(Ext.isArray(files)){
			if(files.length == 0){
				if(Ext.isFunction(callback)){
					callback.call(Wlj);
				}
			}else{
				Wlj.tools.load(files.pop(),function(){
					Wlj.tools.imports(files, callback);
				});
			}
		}else{
			Wlj.tools.load(files,callback);
		}
		
	},
	load : function(file, callback){
		//同步方式加载JS文件
		Wlj.SyncAjax.request({
			url : basepath + file, 
			callback : callback,
			success : function(response) {
				var _this = this;
				window.execScript ? window.execScript(response.responseText) : window.eval(response.responseText);
				if(Ext.isFunction(callback)){
					callback.call(Wlj);
				}
			}
		});
 	}
};

window.imports = Wlj.tools.imports;
Ext.ns('Wlj.memorise');
Wlj.memorise.Tile = function(){
	this.tiles = new Ext.util.MixedCollection();
	this.tilesData = new Ext.util.MixedCollection();
	var _this = this;
	this.tiles.on('add',function(){
		_this.onAdd();
	});
	this.tiles.on('remove',function(){
		_this.renderIndex --;
	});
	this.tilesData.on('add',function(){
		_this.onAddData();
	});
	this.tilesData.on('remove',function(){
		_this.dataLoadIndex --;
	});
	Wlj.memorise.Tile.superclass.constructor.call(this);
	this.renderIndex = 0;
	this.dataLoadIndex = 0;
	this.loading = false;
	this.dataLoading = false;
};

Ext.extend(Wlj.memorise.Tile, Ext.util.Observable, {
	addTile : function(tile){
		this.tiles.add(tile);
	},
	addDataCfg : function(cfg){
		this.tilesData.add(cfg);
	},
	loadJs : function(){
		var _this = this;
		_this.loading = true;
		var tile = _this.tiles.itemAt(_this.renderIndex);
		if(!tile){
			_this.loading = false;
			_this.loadData();
			return false;
		}else{
			if(!tile.jsUrl || !tile.tileSize){
				_this.renderIndex++;
				_this.loadJs();
			}else{
				var vs = tile.el.getViewSize(false);
				Ext.Ajax.request({
					method:'get',
					url : basepath + tile.jsUrl,
					success : function(response){
						tile.removeAll();
						tile.contentObject = window.eval ? window.eval(response.responseText) : window.execScript(response.responseText);
						if(tile.contentObject){
							if(Ext.isArray(tile.contentObject)){
								Ext.each(tile.contentObject,function(tc){
									tc.setSize(vs.width, vs.height);
								});
							}else{
								tile.contentObject.setSize(vs.width, vs.height);
							}
							tile.add(tile.contentObject);
							tile.doLayout();
						}
						_this.renderIndex++;
						_this.loadJs();
					},
					failure : function(response){
						_this.renderIndex++;
						_this.loadJs();
					}
				});
			}
		}
	},
	
	loadData : function(){
		var _this = this;
		_this.dataLoading = true;
		var dataCfg = _this.tilesData.itemAt(_this.dataLoadIndex);
		if(!dataCfg){
			_this.dataLoading = false;
			return false;
		} else {
			function cb(responseText){
				
				_this.dataLoadIndex ++;
				if(Ext.isFunction(dataCfg.dataCb)){
					dataCfg.dataCb.call(dataCfg.controlPanel,dataCfg.controlPanel, responseText);
				}
				_this.loadData();
			}
			if(dataCfg.store){
				dataCfg.store.load({
					params : {
						start : 0,
						limit : dataCfg.controlPanel.dataSize?dataCfg.controlPanel.dataSize:7
					},
					callback : function(){
						cb();
					}
				});
			}else {
				Ext.apply(dataCfg,{
					success : function(response){
						cb(response.responseText);
					},
					failure : function(){
						cb();
					}
				});
				Ext.Ajax.request(dataCfg);
			}
		}
	},
	onAddData : function(cfg){
		var _this = this;
		if(_this.loading){
			return;
		}else {
			if(_this.dataLoading){
				return;
			}else {
				_this.loadData();
			}
		}
	},
	onAdd : function(tile){
		var _this = this;
		if(_this.loading){
			return;
		}else{
			_this.loadJs();
		}
	},
	getTileBy : function(property, value){
		
	}
});

Wlj.memorise.TileController = new Wlj.memorise.Tile();
Wlj.TileMgr = Wlj.memorise.TileController;

/**任务管理器**/
Wlj.memorise.Task = function(){
	this.taskIdGen = 'task_tile_';
	this.tasks = new Ext.util.MixedCollection();
	var _this = this;
	this.tasks.on('add',function(index,task,key){
		_this.onAddTask(task);
	});
};
Ext.extend(Wlj.memorise.Task, Ext.util.Observable, {
	
	addTask : function(task){
		this.tasks.add(task);
	},
	removeTask : function(task){
		if(this.windowObject){
			var tile = this.windowObject.get(this.taskIdGen+task.id);
			if(tile){
				tile.ownerCt.remove(tile,true);
			}
		}
		this.tasks.remove(task);
	},
	getTask : function(id){
		return this.tasks.get(id);
	},
	onAddTask : function(task){
		this.toFront();
		if(this.windowObject){
			this.windowObject.add(this.createTaskTile(task,false));
			this.windowObject.doLayout();
		}
	},
	toFront : function(){
		if(this.windowObject){
			this.windowObject.toFront();
		}
	},
	createTaskTile : function(task,delay){
		var _this = this;
		var onetile = new Wlj.widgets.search.tile.Tile({
			id : _this.taskIdGen+task.id,
			cls : 'tile_c1',
			baseMargin : 2,
			ownerW :  10,
			ownerH : 20,
			baseSize :  686-4,
			baseHeight : 34,
			baseWidth : 20,
			taskObject : task,
			pos_size : {
				TX : 0,
				TY : _this.tasks.indexOf(task),
				TH : 1,
				TW : 1
			},
			html : '<br>&nbsp;'+task.name,
			listeners : {
				afterrender : function(t){
					var delayTime = delay ? (t.ownerCt.items.indexOf(t))*150 : 0;
					setTimeout(function(){
						t.el.animate({
							width : {
								from : 20,
								to : 686-4
							}
							
						},.35,
						null,
						'easeOut',
						'run');
					},delayTime);
				}
			},
			removeThis : function(){
				
				var index = this.ownerCt.items.indexOf(this);
				var ownerCt = this.ownerCt;
				this.ownerCt.remove(this,true);
				for(var i=index;i<ownerCt.items.getCount();i++){
					var item = ownerCt.items.itemAt(i);
					item.moveToPoint({
						x : item.pos_size.TX,
						y : item.pos_size.TY - 1
					});
				}
				task.close();
			}
		});
		return onetile;
	},
	
	showTasks : function(){
		var _this = this;

		if(this.windowObject){
			this.windowObject.toFront(true);
			return;
		}

		function createTaskTiles(){
			var tiles = [];
			_this.tasks.each(function(task){
				tiles.push(_this.createTaskTile(task,true));
			});
			return tiles;
		}
		this.windowObject = new Ext.Window({
			id : '_TASK_MANAGER',
			top:200,
			left:200,
			title : '任务管理器',
			height : 400,
			width : 700,
			appObject : _APP,
			manager : _APP.taskBar.windowManager
		});
		this.windowObject.on('show',function(window){
			window.add(createTaskTiles());
			window.doLayout();
		});
		this.windowObject.on('close',function(window){
			_this.windowObject = false;
		});
		this.windowObject.show();
	}
});

Wlj.memorise.TaskController = new Wlj.memorise.Task();
Wlj.TaskMgr = Wlj.memorise.TaskController;

Wlj.memorise.Service = function(){
	this.services = new Ext.util.MixedCollection();
};
Ext.extend(Wlj.memorise.Service, Ext.util.Observable, {
	
	addService : function(service){
		this.services.add(service);
	},
	removeService : function(service){
		/**
		 * TODO a remove service logic;
		 */
	},
	stopService : function(service){
		/**
		 * TODO a stop service logic;
		 */
	},
	createServiceWindow : function(){
		var _this = this;
		var cols = parseInt(_this.services.getCount()/7)+1;
		function createServiceItem(){
			var items = [];
			_this.services.each(function(ser){
				var index = _this.services.indexOf(ser);
				var ty = parseInt(index/7);
				var tx = parseInt(index%7);
				var item = new Wlj.widgets.search.service.PageServiceItem({
					ownerH : 20,
					ownerW : 100,
					serviceObject : ser
				});
				items.push(item);
			});
			return items;
		}
		
		this.serviceWindow = new Ext.Window({
			maximized : true,
			closeAction : 'hide',
			autoScroll : true,
			title : '服务管理器',
			items : [new Wlj.widgets.search.service.PageServiceContainer({
				width : 68 * cols,
				items : createServiceItem()
			})],
			listeners: {
				hide : function(){
					Ext.getBody().unmask();
				}
			}
		});
	},
	showServiceWindow : function(){
		if(!this.serviceWindow){
			this.createServiceWindow();
		}
		Ext.getBody().mask();
		this.serviceWindow.show();
		this.serviceWindow.el.setOpacity(.9);
	},
	findServiceByID : function(id){
		return this.services.get('service_'+id);
	}
});

Wlj.memorise.ServiceController = new Wlj.memorise.Service();
Wlj.ServiceMgr = Wlj.memorise.ServiceController;Ext.ns('Wlj.view');
/**
 * 视图工厂
 * @class Wlj.view.View
 * @extends Ext.util.Observable
 */
Wlj.view.View = Ext.extend(Ext.util.Observable,{
	viewId: 'view$-$',
	resId : 0,
	viewType: 0, //视图类型：0客户视图,1客户群视图,2集团客户视图,3客户经理视图,4产品视图,5团队视图
	viewUrl: '',
	constructor: function(config){
        Wlj.view.View.superclass.constructor.call(this, config)
    },
    /**
     * 打开视图方法
     * @param {} viewType 视图类型: 0客户视图,1客户群视图,2集团客户视图,3客户经理视图
     * @param {} id	客户号或客户群号
     * @param {} name 客户名称或客户群名称
     */
	openViewWindow : function(viewType,id,name){
		this.viewType = viewType;
		this.resId = this.viewId + this.viewType +'$-$' + id;
		_APP.taskBar.openWindow({
			name : Wlj.view.View.VIEW_PRE_NAME[this.viewType] + name,
			action : basepath + Wlj.view.View.VIEW_BASE_URL[this.viewType],
			resId : this.resId,
			id : 'task_'+this.resId,
			serviceObject : false
		});
	}
});

Wlj.view.ViewController = new Wlj.view.View();
Wlj.ViewMgr = Wlj.view.ViewController;

Wlj.view.View.VIEW_BASE_URL = [
	'/contents/frameControllers/view/Wlj-custview-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp'
];
Wlj.view.View.VIEW_PRE_NAME = [
	'客户：',
	'客户群：',
	'集团：',
	'客户经理：',
	'产品：',
	'团队：'
];Ext.ns('Wlj.search');

Wlj.search.App = function(){
	var _this = this;
	
	_this.userId = JsContext._userId;
	_this.orgName = JsContext._unitname;
	_this.orgId = JsContext._orgId;
	_this.userName = __userCname;
	_this.roleNames = __roleNames;
	_this.defaultTileGroupCount = APPUTIL.defaultTileGroupCount;
	if(_this.defaultTileGroupCount<1){
		_this.defaultTileGroupCount = 1;
	}
	_this.viewAdjust = APPUTIL.viewAdjust;
	_this.autoCreateGroup = APPUTIL.autoCreateGroup;
	_this.defaultTileGroupOwnerH = APPUTIL.defaultTileGroupOwnerH; 
	_this.defaultTileGroupOwnerW = APPUTIL.defaultTileGroupOwnerW;	
	_this.defaultIndexTileWidthUnit = APPUTIL.defaultIndexTileWidthUnit;
	_this.defaultIndexTileHeightUnit = APPUTIL.defaultIndexTileHeightUnit;
	_this.defaultIndexTileMarginUnit = APPUTIL.defaultIndexTileMarginUnit;
	_this.containerLeft = APPUTIL.containerLeft;
	_this.groupMargin = APPUTIL.groupMargin;
	
	_this.groupWidth = _this.defaultIndexTileWidthUnit * _this.defaultTileGroupOwnerW + (_this.defaultIndexTileMarginUnit*2)*(_this.defaultTileGroupOwnerW+3);
	_this.groupHeight = _this.defaultIndexTileHeightUnit * _this.defaultTileGroupOwnerH + (_this.defaultIndexTileMarginUnit*2)*(_this.defaultTileGroupOwnerH+3);
	
	_this.headerHeight = APPUTIL.headerHeight;
	_this.headerTopMargin = APPUTIL.headerTopMargin;
	_this.headerButtomMargin = APPUTIL.headerButtomMargin;
	_this.taskbarHeight = APPUTIL.taskbarHeight;
	if(APPUTIL.headerFunctions === 'menuRoot'){
		_this.headerType = 'menu';
		_this.headerRoot = '0';
	}else if(APPUTIL.headerFunctions.indexOf('res') === 0){
		_this.headerType = 'menu';
		_this.headerRoot = APPUTIL.headerFunctions.split(':')[1];
	}else{
		_this.headerType = 'funtion';
		_this.headerRoot = Wlj.search.App.HEADERBUTTONS;
	}
	this.menuHeaderCount = APPUTIL.menuHeaderCount;
	
	_this.size = Ext.getBody().getViewSize();
	
	_this.buildSizePosition();
	if(_this.viewAdjust){
		_this.viewSizeAdjust();
	}
	/***新UI增加登录认证控制*/
	_this.initSecurityBooter();							//认证管理初始化
	
	_this.needSearchArea = APPUTIL.needSearchArea;
	
};

Wlj.search.App.prototype.initMenus = function(){
	
	var _this = this;
	Ext.Ajax.request({
		url:basepath+'/indexinit.json',
		method:'GET',
		success:function(a,b,c,d){
			var menus = Ext.util.JSON.decode(a.responseText).json.data;
			_this.menus = menus;
			_this.bootViews();
		},
		failure:function(a,b,d,c){
		}
	});
	
	_this.reqIndex = 0;
	
};
Wlj.search.App.prototype.bootViews = function(){
	
	this.bootHeader();
	this.bootTiles();
	if(this.needSearchArea){
		this.bootSearchArea();
	}
	this.bootTaskBar();
	this.bootServices();
	this.bootTheme();
	var items = [];
	if(this.needSearchArea){
		items = [this.headerBar,this.tileContainer,this.mainContainer,this.taskBar];
	}else{
		items = [this.headerBar,this.tileContainer,this.taskBar];
	}
	
	this.viewPort = new Ext.Viewport({
		items:items,
		cls:'main_bg'
	});
	this.resetContaienrWidth();
	this.viewShowAdjust();
	var _this = this;
	window.onresize = function(){
		_this.size = Ext.getBody().getViewSize();
		_this.viewSizeAdjust();
		_this.tileContainer.setHeight(_this.tileContainerHeight);
	};
};

Wlj.search.App.prototype.bootHeader = function(){
	var _this = this;
	this.userInfoComponent = new Wlj.widgets.search.header.UserInfo({
		userName : _this.userName,
		userRole : _this.roleNames,
		userOrg : _this.orgName,
		appObject : this
	});
	
	
	if(_this.headerType === 'funtion'){
		this.headerFunctions =  new Wlj.widgets.search.header.MainFunction({
			items : Wlj.search.App.HEADERBUTTONS,
			appObject : this
		});
	}else if(_this.headerType === 'menu'){
		var mainMenuCfgs = _this.getMenuDataByProperty('PARENT_ID',_this.headerRoot);
		
		var mainFunctions = [];
		
		if(APPUTIL.needStartOBack){
			mainFunctions.push(Wlj.search.App.HEADERBUTTONS[0]);
			mainFunctions.push(Wlj.search.App.HEADERBUTTONS[1]);
		}
		
		for(var i=0;i<mainMenuCfgs.length && i< _this.menuHeaderCount; i++){
			var mmc = mainMenuCfgs[i];
			var mc = {
					name : mmc.NAME,
					acls:'lv1',
//					iconcls : 'icon'+Math.ceil(Math.random()*7),
					iconcls : 'icon'+mmc.ICON,
					cssText : '',
					cls : '',
					menuRoot : mmc.ID,
					functionName : 'Wlj.widgets.search.header.MenuFunction'
			};
			mainFunctions.push(mc);
		}
		this.headerFunctions =  new Wlj.widgets.search.header.MainFunction({
			items : mainFunctions,
			appObject : this
		});
	}
	
	this.headerBar = new Wlj.widgets.search.header.HeadBar({
		y : this.headerTopMargin,
		height : this.headerHeight,
		items:[this.headerFunctions,this.userInfoComponent],
		appObject : this
	});
};

Wlj.search.App.prototype.bootTiles = function(){

	var _this = this;
	
	this.tileContainer = new Wlj.widgets.search.tile.TileContainer({
		height : _this.tileContainerHeight + 1,
		items:[],
		x : _this.containerLeft,
		y : _this.containerTop,
		appObject : this
	});
	_this.createGroup(_this.defaultTileGroupCount-1);
	Ext.Ajax.request({
		url : basepath+'/usertile.json',
		method : 'GET',
		success : function(response){
			_this.tileData = Ext.decode(response.responseText).json.data;
			Ext.each(_this.tileData,function(td){
				var md = _this.getMenuDataByProperty('MOD_FUNC_ID',td.MODULE_ID);
				if(md && md.length>0){
					md[0].TILE_COLOR = td.TILE_COLOR?td.TILE_COLOR:md[0].TILE_COLOR;
					md[0].TILE_LOGO = td.TILE_ICON?td.TILE_ICON:md[0].TILE_LOGO;
					delete td.TILE_ICON;
					Ext.apply(td,md[0]);
				}
				td.DEFAULT_URL = td.DEFAULT_URL?td.DEFAULT_URL:td.SPARE_ONE;
				var group = td.GROUP_SEQ ? parseInt(td.GROUP_SEQ,10) : 0;
				if(_this.autoCreateGroup || group < _this.defaultTileGroupCount){
					var tile = _this.createTile(_this.createTileCfg(td),group);
				}
			});
			_this.tileContainer.doLayout();
			_this.resetContaienrWidth();
		}
	});
};

Wlj.search.App.prototype.bootSearchArea = function(){
	
	var _this = this;
	
	this.searchComponent = new Wlj.widgets.search.search.SearchComponent({
		appObject : this
	});
	
	this.shortTypeComponent = new Wlj.widgets.search.search.ShortTitle({
		name : '我的常用功能',
		appObject : this
	});
	
	this.shortContainer = new  Wlj.widgets.search.search.ShortContainer({
		items : [this.shortTypeComponent],
		appObject : this,
		listeners : {
			afterrender : function(c){
				Ext.Ajax.request({
					url : basepath+'/comfunctionset.json',
					method : "GET",
					success : function(response){
						userSetting = Ext.util.JSON.decode(response.responseText);
						var userModule = userSetting.returns.data;
						var showCount = 8 > userModule.length ? userModule.length : 8;
						for(var i=0; i< showCount; i++){
							var menuData = _this.getMenuDataByProperty('ID',userModule[i].MODULE_ID);
							if(menuData && menuData.length>0){
								var md = {};
								md.id = 'short_'+menuData[0].ID;
								md.name = menuData[0].NAME;
								md.action = menuData[0].ACTION;
								md.appObject = _this;
								md.icon = menuData[0].TILE_LOGO ? menuData[0].TILE_LOGO : 'ico-t-'+Math.floor(Math.random()*100+1);
								md.tileColor = menuData[0].TILE_COLOR ? menuData[0].TILE_COLOR : 'tile_c'+Math.floor(Math.random()*10+1);
								md.autoEl = {
									tag : 'div',
									cls : 'tile w190h1 short_fun ' + md.tileColor
								};
								md.menuData = menuData[0];
								var ms = new Wlj.widgets.search.search.ModeShort(md);
								if(i == 4){
									ms.style = {
										marginLeft : 128 + 12
									};
								}
								_this.shortContainer.add(ms);
							}
						}
						_this.shortContainer.doLayout();
						return;
					}
				});
			}
		}
	});
	
	this.mainContainer = new Wlj.widgets.search.search.SearchMainContainer({
		hidden : true,
		hieght : _this.searchContainerTop+1,
		y : _this.searchContainerTop,
		items : [this.searchComponent,this.shortContainer],
		appObject : this
	});
};

Wlj.search.App.prototype.bootTaskBar = function(){
	this.taskBar = new Wlj.widgets.search.window.TaskBar({
		hidden : !!this.needSearchArea,
		height : this.taskbarHeight,
		appObject : this
	});
};

Wlj.search.App.prototype.bootServices = function(){
	this.ServiceMgr = Wlj.ServiceMgr;
	Ext.each(this.menus,function(menu){
		if(menu.ACTION){
			new Wlj.widgets.search.service.PageService(menu);
		}
	});
	Wlj.ServiceMgr.createServiceWindow();
};

Wlj.search.App.prototype.bootTheme = function(){
	var _this = this;
	Ext.getBody().applyStyles({
		background: "url("+basepath+__background+") fixed center"
	});
};

Wlj.search.App.prototype.onContextMenu = function(e, added){

	if(added.length>0){
		new Ext.menu.Menu({
			items: added
		}).showAt(e.getXY());
	}
};

Wlj.search.App.prototype.resetContaienrWidth = function(){
	var groupCount = this.tileContainer.items.length;
	var containerWidth = this.groupWidth*groupCount+this.groupMargin*(groupCount+1);
	this.tileContainer.layoutEl.style.width = containerWidth+'px';
};

Wlj.search.App.prototype.viewSizeAdjust = function(){
	var _this = this;
	var headerTopMine = 26;
	var headerButtumJust = 0;
	
	if(this.groupHeight > this.tileContainerHeight - 20){
		var minuHeight = this.groupHeight - this.tileContainerHeight + 20;
		var headerTopMarginC = this.headerTopMargin - headerTopMine;
		var headerButtumMrginC = this.headerButtomMargin - headerButtumJust;
		if(headerTopMarginC >= minuHeight){
			this.headerTopMargin = this.headerTopMargin - minuHeight;
		}else{
			if(headerButtumMrginC >= minuHeight - headerTopMarginC){
				this.headerButtomMargin = this.headerButtomMargin - (minuHeight - headerTopMarginC);
			}else{
				this.headerButtomMargin = headerButtumJust;
			}
			this.headerTopMargin = headerTopMine;
		}
		this.buildSizePosition();
	}
};
Wlj.search.App.prototype.viewShowAdjust = function(){
	var _this = this;
	//**
	//** 特别的，当默认只有一屏瓷贴，且不在自动创建新的瓷贴组，且瓷贴组宽度小于屏幕宽度时，将采用瓷贴组居中策略。
	//**
	//**
	if(_this.autoCreateGroup === false && _this.defaultTileGroupCount === 1 && _this.groupWidth < _this.size.width-20){
		var gLeft =  parseInt((_this.size.width - _this.groupWidth)/2);
		_this.tileContainer.items.first().el.applyStyles({
			left : gLeft+'px'
		});
	}
};

Wlj.search.App.prototype.buildSizePosition = function(){
	var _this = this;
	_this.tileContainerHeight = _this.size.height - _this.headerTopMargin - _this.headerHeight - _this.headerButtomMargin ;
	
	if(!APPUTIL.needSearchArea){
		_this.tileContainerHeight = _this.tileContainerHeight - _this.taskbarHeight;
	}
	_this.containerTop = _this.headerTopMargin + _this.headerButtomMargin;
	_this.searchContainerHeight = _this.tileContainerHeight ;
	_this.searchContainerTop = _this.containerTop;
};
/**********************************************API******************************************/

Wlj.search.App.prototype.openWindow = function(cfg){
	this.ShowSearchArea();
	this.taskBar.openWindow(cfg);
};

Wlj.search.App.prototype.ShowSearchArea = function(){
	if(!!!this.needSearchArea){
		return false;
	}
	this.tileContainer.hide();
	this.mainContainer.show();
	this.taskBar.show();
	if(this.headerFunctions.headerFun.get('backFunction'))
		this.headerFunctions.headerFun.get('backFunction').show();
	if(this.headerFunctions.headerFun.get('startFunction'))
		this.headerFunctions.headerFun.get('startFunction').hide();
};

Wlj.search.App.prototype.HideSearchArea = function(){
	if(!!!this.needSearchArea){
		return false;
	}
	this.tileContainer.show();
	this.mainContainer.hide();
	this.taskBar.hide();
	if(this.headerFunctions.headerFun.get('backFunction'))
		this.headerFunctions.headerFun.get('backFunction').hide();
	if(this.headerFunctions.headerFun.get('startFunction'))
		this.headerFunctions.headerFun.get('startFunction').show();
};

/*******************************************MENU DATA API*********************************************/
/**
 * 根据指定字段值，获取菜单数据，生成新的内存单元，用于页面对象创建
 */
Wlj.search.App.prototype.getMenuDataByProperty = function(field, value){
	var returns = [];
	var menus = this.menus;
	var _this = this;
	if(!field || !value){
		return false;
	}
	Ext.each(menus, function(m){
		if(m[field] == value){
			var r = {};
			Ext.apply(r,m);
			returns.push(r);
		}
	});
	return returns.length==0?false:returns;
};
/**
 * 根据指定字段值，获取菜单数据，不生成新的内存单元，用于标识位判断
 */
Wlj.search.App.prototype.findMenuDataByProperty = function(field, value){
	var returns = [];
	var menus = this.menus;
	var _this = this;
	if(!field || !value){
		return false;
	}
	Ext.each(menus, function(m){
		if(m[field] == value){
			returns.push(m);
		}
	});
	return returns.length==0?false:returns;
};

Wlj.search.App.prototype.createRootMenuCfg = function(){
	return this.createSubMenuCfg('0');
};

Wlj.search.App.prototype.createSubMenuCfg = function(id){
	var roots = [];
	var _this = this;
	var menudata = this.getMenuDataByProperty('PARENT_ID',id);
	if(menudata){
		Ext.each(menudata, function(m){
			m.id = 'mmid_'+m.ID;
			m.name = m.NAME;
			m.isLeaf = _this.findMenuDataByProperty('PARENT_ID',m.ID) === false ;
			m.action = m.ACTION;
			m.appObject = _this;
			roots.push(m);
		});
	}
	return roots.length == 0 ? false : roots;
};

/******************************************INDEX TILE API****************************************/
Wlj.search.App.prototype.createGroup = function(index){
	
	var _this = this,
		tileContainer = _this.tileContainer,
		len = tileContainer.items.length;
	var groupAdded = false;
	if(typeof index !== 'number'){
		var group = new Wlj.widgets.search.tile.TileGroup({
			id : 'group_'+len,
			index : len ,
			items : [],
			width : this.groupWidth,
			height : this.groupHeight,
			groupMargin : this.groupMargin,
			appObject : this
		});
		groupAdded = group;
	} else {
		index = parseInt(index);
		if(index >= len){
			for (var i = len;i<=index;i++){
				tileContainer.add(new Wlj.widgets.search.tile.TileGroup({
					id: 'group_'+i,
					index: i ,
					items : [],
					width : this.groupWidth,
					height : this.groupHeight,
					groupMargin : this.groupMargin,
					appObject : this
				}));
			}
		}
		groupAdded =  tileContainer.items.itemAt(index);
	}
	tileContainer.doLayout();
	
	return groupAdded;
};

Wlj.search.App.prototype.createTile = function(tileCfg, groupIndex){
	var _this = this;
	
	var group = groupIndex;
	if(typeof group === 'undefined'){
		group = 0;
	}
	var groupObject = _this.createGroup(group);
	groupObject.add(new Wlj.widgets.search.tile.IndexTile(tileCfg));	
};

Wlj.search.App.prototype.createTileCfg = function(menuData, specialCfg){
	var _this = this;
	var td = menuData;
	Ext.applyIf(td,specialCfg);
	var posX = parseInt(td.POS_X ? td.POS_X : 0, 10),
		posY = parseInt(td.POS_Y ? td.POS_Y : 0, 10),
		tileLogo = td.TILE_LOGO ? td.TILE_LOGO : 'ico-t-'+Math.floor(Math.random()*100+1),
		tileSize = td.TILE_SIZE ? td.TILE_SIZE : td.DEFAULT_SIZE ? td.DEFAULT_SIZE : false,
		tileColor = td.TILE_COLOR ? td.TILE_COLOR : 'tile_c'+Math.floor(Math.random()*10+1),
		jsUrl = td.DEFAULT_URL ? td.DEFAULT_URL : false,
		tileName = td.NAME,
		cls = 'tile '+tileColor;
	if(!jsUrl){
		tileSize = false;
	}
	var sizeObject = _this.translateSize(tileSize);
	var tileCfg = {
		tileLogo : tileLogo,
		tileSize : tileSize,
		tileName : tileName,
		tileColor : tileColor,
		baseWidth : _this.defaultIndexTileWidthUnit,
		baseHeight : _this.defaultIndexTileHeightUnit,
		baseMargin : _this.defaultIndexTileMarginUnit,
		ownerW : _this.defaultTileGroupOwnerW,
		ownerH : _this.defaultTileGroupOwnerH,
		autoEl:{
			tag:'div',
			cls : cls
		},
		jsUrl : jsUrl ,
		pos_size : {
			TW : sizeObject.TW ,
			TH : sizeObject.TH ,
			TX : posX ,
			TY : posY 
		},
		appObject : _this,
		menuData : td
	};
	return tileCfg;
};

Wlj.search.App.prototype.translateSize = function(code){
	switch(code){
		case 'TS_00': return {
			TW : 6,
			TH : 3
		};
		case 'TS_01': return {
			TW : 3,
			TH : 3
		};
		case 'TS_02': return {
			TW : 2,
			TH : 3
		};
		case 'TS_03': return {
			TW : 3,
			TH : 2
		};
		case 'TS_04': return {
			TW : 1,
			TH : 3
		};
		case 'TS_05': return {
			TW : 3,
			TH : 1
		};
		case 'TS_06': return {
			TW : 2,
			TH : 2
		};
		case 'TS_07': return {
			TW : 1,
			TH : 2
		};
		case 'TS_08': return {
			TW : 2,
			TH : 1
		};
		default : return {
			TW : 1,
			TH : 1
		};
	}
};
Wlj.search.App.prototype.translateSizeCode = function(TW, TH){
	
	var size = [TW,TH];
	
	switch (Ext.encode(size)){
	    case Ext.encode([6,3]) : return 'TS_00';
		case Ext.encode([3,3]) : return 'TS_01';
		case Ext.encode([2,3]) : return 'TS_02';
		case Ext.encode([3,2]) : return 'TS_03';
		case Ext.encode([1,3]) : return 'TS_04';
		case Ext.encode([3,1]) : return 'TS_05';
		case Ext.encode([2,2]) : return 'TS_06';
		case Ext.encode([1,2]) : return 'TS_07';
		case Ext.encode([2,1]) : return 'TS_08';
		default : return '000';
	}
	
};
Wlj.search.App.prototype.securityBooter = null;
/**
 * security 认证管理初始化
 * @return
 */
Wlj.search.App.prototype.initSecurityBooter = function(){
	var _this = this;
	if (_this.securityBooter == null) {
		_this.securityBooter = new Com.yucheng.crm.security.SecurityBooter(_this);
	}
	
	return _this.securityBooter;
};/**
 * 搜索模式顶层工具栏
 */
Ext.ns('Wlj.widgets.search.header');
Wlj.widgets.search.header.HeadBar = Ext.extend(Ext.Container,{
	autoEl: {
		tag : 'div'
	},
	cls : 'menu_menu_con',
	backgroundTpl :new Ext.XTemplate('<div class="main_menu"></div>'),
	defaultType : 'mainfunction',
	onRender : function(ct, position){
		Wlj.widgets.search.header.HeadBar.superclass.onRender.call(this,ct,position);
		this.backgroundTpl = new  Ext.XTemplate('<div class="main_menu" style="top:{top}px"></div>');
		/**
		 * 透明背景
		 */
		this.backgroundTpl.insertBefore(this.el,{
			top:this.y
		});
	}
});
Ext.reg('headbar',Wlj.widgets.search.header.HeadBar);
/***
 * 搜索模式顶层功能区
 */
Wlj.widgets.search.header.MainFunction = Ext.extend(Ext.BoxComponent,{
	autoEl : {
		tag : 'div',
		cls : 'main_menu_div'
	},
	functionTpl : new Ext.XTemplate(
		'<li class="main_menu_ul_li {cls}" style="{cssText}">',
    		'<a class="{acls}" href="javascript:void(0)">',
    			'<i class="{iconcls}"></i>',
    			'<i class="{wordcls}" title="{name}">{name}</i>',
    		'</a>',
    	'</li>'),
    mainTpl : new Ext.XTemplate(
    	 '<ul class="main_menu_ul"></ul>'
    ),
    items:[],
    headerFun : new Ext.util.MixedCollection(),
    onRender : function(ct, position){
		Wlj.widgets.search.header.MainFunction.superclass.onRender.call(this, ct, position);
		this.ulEl = this.mainTpl.append(this.el,{functions:[]});
		var _this = this;
		Ext.each(_this.items,function(it){
			var _fn = it.functionName ? it.functionName : 'Wlj.widgets.search.header.Function';
			_this.headerFun.add(eval('new '+_fn+'(it, _this)'));
		});
	},
	doRender : function(){
		var items = this.items;
		if(!Ext.isArray(items) || items.length == 0){
			return;
		}
		var _this = this;
		var len = items.length;
		var funBuffer = [];
		for(var it=0;it<len;it++){
			funBuffer.push(_this.functionTpl.apply(items[it]));
		}
		return funBuffer.join('');
	},
	add : function(func){
		return this.functionTpl.append(this.ulEl,func.cfg);
	}
});
Ext.reg('mainfunction', Wlj.widgets.search.header.MainFunction);

/**
 * 搜索模式顶层图标
 */
Wlj.widgets.search.header.Function = function(cfg,p){
	Ext.apply(this, cfg);
	this.id = cfg.id ? cfg.id : Ext.id('Head_fun_');
	this.parent = p;
	this.cfg = cfg;
	this.el = p.add(this);
	var _this = this;
	Ext.fly(this.el).on('click',function(event,dom,scope){
		if(Ext.isFunction(_this.handler)){
			_this.handler(_this.parent,_this,_this.el);
		}
	});
	if(Ext.isFunction(_this.overHandler)){
		Ext.fly(this.el).on('mouseenter',function(event,dom,scope){
			_this.overHandler(_this.parent,_this,_this.el);
		});
	}
	if(Ext.isFunction(_this.outHandler)){
		Ext.fly(this.el).on('mouseleave',function(event,dom,scope){
//			if(dom === _this.el) 
				_this.outHandler(_this.parent,_this,_this.el);
		});
	}
	return this;
};
Wlj.widgets.search.header.Function.prototype.show = function(){
	this.el.style.display = 'block';
};
Wlj.widgets.search.header.Function.prototype.hide = function(){
	this.el.style.display = 'none';
};

Wlj.widgets.search.header.MenuFunction = Ext.extend(Wlj.widgets.search.header.Function, {
	
	constructor : function(cfg, p){
		Wlj.widgets.search.header.MenuFunction.superclass.constructor.call(this, cfg, p);
		if(!this.menuRoot){
			this.menuRoot = '0';
		}
	},
	overHandler : function(p,_thisObj,dom){
		if(_thisObj.menuItem && _thisObj.hasSub){
			_thisObj.menuItem.show();
			return;
		}else{
			var subc = p.appObject.createSubMenuCfg(_thisObj.menuRoot);
			if(!subc){
				_thisObj.hasSub = false;
				return false;
			}
			_thisObj.hasSub = true;
			var mc = new Wlj.widgets.search.menu.MenuComponent({
				appObject : p.appObject,
				renderTo : _thisObj.el,
				items : [subc]
			});
			_thisObj.menuItem = mc;
			p.appObject.menuItem = mc;
		}
	},
	outHandler : function(p,_thisObj,dom){
		if(_thisObj.menuItem && _thisObj.hasSub){
			_thisObj.menuItem.hide();
		}
	},
	handler : function(p,f,dom){
		if(Wlj.ServiceMgr.findServiceByID(f.menuRoot)){
			Wlj.ServiceMgr.findServiceByID(f.menuRoot).execute();
		}
	}
});


/**
 * 用户信息对象
 */
Wlj.widgets.search.header.UserInfo = Ext.extend(Ext.BoxComponent, {
	autoEl:{
		tag:'div',
		cls:'user_frame'
	},
	userImg:basepath+(__userIcon !== ''?('/imgshow.json?t='+new Date().getTime()+'&path='+__userIcon):'/contents/wljFrontFrame/styles/search/searchpics/user_head.jpg'),
	welcomeText:'',
	userName : '',
	userRole : '',
	userOrg : '',
	headTpl : new Ext.XTemplate('<div class="user_head">',
		'<div class="user_head_pic"><img src="{userImg}" width="45" height="45" complete="complete"/></div>',
		'</div>'	),
	logoutTpl : new Ext.XTemplate('<div class="user_oper">',
			'<p><a class="loginout" href="'+basepath+'/j_spring_security_logout"></a></p>',
			'</div>'),
	infoTpl : new Ext.XTemplate('<div class="user_info">'
			,'<p class="user_info_p">你好，<i class="name">{userName}</i>，欢迎登录贷后管理系统！</p>'
			,'<p class="user_info_p blue"><span class="tit">岗位：</span><span>{userRole}</span></p>'
			,'<p class="user_info_p blue"><span class="tit">机构：</span><span>{userOrg}</span></p>'
			,'</div>'),
	onRender : function(ct,position){
		Wlj.widgets.search.header.UserInfo.superclass.onRender.call(this, ct, position);
		this.headTpl.append(this.el,{userImg:this.userImg});
		this.infoTpl.append(this.el,{userName:this.userName,userRole:this.userRole,userOrg:this.userOrg});
		this.logoutTpl.append(this.el);
	}
});
Ext.reg('userinfo',Wlj.widgets.search.header.UserInfo);

/**
 * 个性化设置
 */
Wlj.widgets.search.header.Customize = Ext.extend(Ext.Container,{
	autoEl : {
		tag : 'div',
		cls : 'yc-themeSettings'
	},
	themes : [],
	backgrounds : [],
	wordsizes : [],
	themeElArray : [],
	bgElArray : [],
	wordsizeElArray : [],
	containerTemplate : new Ext.XTemplate('<div class="yc-tsContent"></div>'),
	separateTemplate : new Ext.XTemplate('<div class="yc-ts-Title"><span class="yc-tstText">{text}</span></div>'),
	iconTemplate : new Ext.XTemplate(
		'<a class="yc-tscLink" href="javascript:void(0);">',
			'<img alt="" src="{icon}">',
			'<div class="yc-tsclsIco"></div>',
		'</a>'),
	wordsizeTemplate : new Ext.XTemplate('<label><input type="radio" name="ra_fontsize" />{text}</label>'),
	saveTemplate : new Ext.XTemplate('<a class="yc-tsbt" href="javascript:void(0);" title="{text}">{text}</a>'),
	onRender : function(ct, position){
		Wlj.widgets.search.header.Customize.superclass.onRender.call(this, ct, position);
		
		this.renderThemeEl();
		this.renderBackgroundEl();
		this.renderWordsizeEl();
		this.renderSaveEl();
		this.el.applyStyles({
			zIndex : 15000
		});
	},
	onShow : function(){
		var _this = this;
        Wlj.widgets.search.header.Customize.superclass.onShow.call(this);
        _this.THEME_CSS = _this.THEME_CSS?_this.THEME_CSS:(_this.themes[0]?_this.themes[0].themeName : "");
		_this.BG_ICON = _this.BG_ICON?_this.BG_ICON:(_this.backgrounds[0]?_this.backgrounds[0].reaBG : "");
		_this.WORD_SIZE = _this.WORD_SIZE?_this.WORD_SIZE:(_this.wordsizes[0]?_this.wordsizes[0].size : "");
		_this.setCustomize();
    },
	renderThemeEl : function(){
		var _this = this;
		_this.separateTemplate.append(_this.el,{
			text : '皮肤设置'
		});
		_this.themeEl = this.containerTemplate.append(_this.el,{});
		Ext.each(_this.themes,function(it){
			var iconEl = _this.iconTemplate.append(_this.themeEl,{
				icon : basepath + it.preBG
			});
			_this.themeElArray.push(iconEl);
			Ext.fly(iconEl).on('click',function(event,dom,scope){
				Ext.each(_this.themeElArray,function(el){
					Ext.fly(el).removeClass('yc-tscLinkSelected');
				});
				Ext.fly(iconEl).addClass('yc-tscLinkSelected');
				_this.THEME_CSS = it.themeName;
			});
		});
	},
	renderBackgroundEl : function(){
		var _this = this;
		_this.separateTemplate.append(_this.el,{
			text : '背景设置'
		});
		_this.bgEl = this.containerTemplate.append(_this.el,{});
		Ext.each(_this.backgrounds,function(it){
			var iconEl = _this.iconTemplate.append(_this.bgEl,{
				icon : basepath + it.preBG
			});
			_this.bgElArray.push(iconEl);
			Ext.fly(iconEl).on('click',function(event,dom,scope){
				Ext.each(_this.bgElArray,function(el){
					Ext.fly(el).removeClass('yc-tscLinkSelected');
				});
				Ext.fly(iconEl).addClass('yc-tscLinkSelected');
				Ext.getBody().applyStyles({
					background: "url("+basepath+it.reaBG+") fixed center"
				});
				_this.BG_ICON = it.reaBG;
			});
		});
	},
	renderWordsizeEl : function(){
		var _this = this;
		_this.separateTemplate.append(_this.el,{
			text : '字号设置'
		});
		_this.wordSizeEl = _this.containerTemplate.append(_this.el,{});
		Ext.each(_this.wordsizes,function(it){
			var wordsizeEL = _this.wordsizeTemplate.append(_this.wordSizeEl,{
				text : it.text
			});
			_this.wordsizeElArray.push(wordsizeEL);
			Ext.fly(wordsizeEL).on('click',function(event,dom,scope){
				_this.WORD_SIZE = it.size;
			});
		});
	},
	renderSaveEl : function(){
		var _this = this;
		new Ext.XTemplate('<div class="yc-ts-Title"></div>').append(_this.el,{});
		_this.saveConainerEl = this.containerTemplate.append(_this.el,{});
		_this.saveEl = _this.saveTemplate.append(_this.saveConainerEl,{
			text : '保存设置'
		});
		_this.resetEl = _this.saveTemplate.append(_this.saveConainerEl,{
			text : '恢复默认'
		});
		Ext.fly(_this.saveEl).on('click',function(event,dom,scope){
			if(Ext.isFunction(_this.saveHandler)){
				_this.saveHandler(_this);
			}
		});
		Ext.fly(_this.resetEl).on('click',function(event,dom,scope){
			_this.THEME_CSS = _this.themes[0]?_this.themes[0].themeName : "";
			_this.BG_ICON = _this.backgrounds[0]?_this.backgrounds[0].reaBG : "";
			_this.WORD_SIZE = _this.wordsizes[0]?_this.wordsizes[0].size : "";
			Ext.getBody().applyStyles({
				background: "url("+basepath+_this.BG_ICON+") fixed center"
			});
			_this.setCustomize();
			if(Ext.isFunction(_this.saveHandler)){
				_this.saveHandler(_this);
			}
		});
		new Ext.XTemplate('<span class="yc-tsRemark">提示：恢复默认将还原首页个性化与主题到初始状态。</span>').append(_this.saveConainerEl,{});
	},
	setCustomize : function(){
		var _this = this;
		for(var i=0;i<_this.themes.length;i++){
			Ext.fly(_this.themeElArray[i]).removeClass('yc-tscLinkSelected');
			if(_this.THEME_CSS == _this.themes[i].themeName){
				Ext.fly(_this.themeElArray[i]).addClass('yc-tscLinkSelected');
			}
		}
		for(var i=0;i<_this.backgrounds.length;i++){
			Ext.fly(_this.bgElArray[i]).removeClass('yc-tscLinkSelected');
			if(_this.BG_ICON == _this.backgrounds[i].reaBG){
				Ext.fly(_this.bgElArray[i]).addClass('yc-tscLinkSelected');
			}
		}
		for(var i=0;i<_this.wordsizes.length;i++){
			if(_this.WORD_SIZE == _this.wordsizes[i].size){
				Ext.fly(_this.wordsizeElArray[i]).child('input').dom.checked = true;
				break;
			}
		}
		
	},
	saveHandler : function(c){
		var _this = this;
		var results = {
			themeCss : c.THEME_CSS ? c.THEME_CSS:'',
			bgIcon : c.BG_ICON ? c.BG_ICON:'',
			wordSize : c.WORD_SIZE ? c.WORD_SIZE:'',
			spareOne : '',
			spareTwo : ''
		};
		Ext.Ajax.request({
			url : basepath + '/userSysCfg.json',
			method : 'POST',
			params : results,
			success : function(){
				Ext.apply(_APP.themeData,{
					THEME_CSS : c.THEME_CSS ? c.THEME_CSS:'',
					BG_ICON : c.BG_ICON ? c.BG_ICON:'',
					WORD_SIZE : c.WORD_SIZE ? c.WORD_SIZE:'',
					SPARE_ONE : '',
					SPARE_TWO : ''
				});
				document.createStyleSheet(basepath+"/contents/wljFrontFrame/styles/search/searchthemes/"+c.THEME_CSS+"/frame.css",document.styleSheets.length);
				document.createStyleSheet(basepath+"/contents/wljFrontFrame/styles/search/searchthemes/"+c.THEME_CSS+"/main.css",document.styleSheets.length+1);
				if(c.WORD_SIZE === 'ra_normal'){
					document.createStyleSheet(basepath+"/contents/wljFrontFrame/styles/search/searchcss/font_normal.css",document.styleSheets.length+2);
				}else{
					document.createStyleSheet(basepath+"/contents/wljFrontFrame/styles/search/searchcss/font_big.css",document.styleSheets.length+2);
				}
				Wlj.TaskMgr.tasks.each(function(task){
					
					task.frame.dom.contentWindow.document.createStyleSheet( basepath+"/contents/wljFrontFrame/styles/search/searchthemes/"+c.THEME_CSS+"/frame.css",task.frame.dom.contentWindow.document.styleSheets.length);
					task.frame.dom.contentWindow.document.createStyleSheet( basepath+"/contents/wljFrontFrame/styles/search/searchthemes/"+c.THEME_CSS+"/main.css",task.frame.dom.contentWindow.document.styleSheets.length+1);
					if(c.WORD_SIZE === 'ra_normal'){
						task.frame.dom.contentWindow.document.createStyleSheet( basepath+"/contents/wljFrontFrame/styles/search/searchcss/font_normal.css",task.frame.dom.contentWindow.document.styleSheets.length+2);
					}else{
						task.frame.dom.contentWindow.document.createStyleSheet( basepath+"/contents/wljFrontFrame/styles/search/searchcss/font_big.css",task.frame.dom.contentWindow.document.styleSheets.length+2);
					}
				});
				Ext.Msg.alert('提示','保存成功！');
				_this.hide();
				
			}
		});
	}
});
Ext.reg("wljcustomize",Wlj.widgets.search.header.Customize);Ext.ns('Wlj.widgets.search.search');
Wlj.widgets.search.search.SearchField = Ext.extend(Ext.form.TextField,{
	
	triggerWidth : 66,
	defautlWidth : 491,
	comfex : false,
	initComponent : function(){
		Wlj.widgets.search.search.SearchField.superclass.initComponent.call(this);
		if(!this.width)
			this.width = this.defautlWidth;
	},
	
    onRender : function(ct, position){
		this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
		Wlj.widgets.search.search.SearchField.superclass.onRender.call(this, ct, position);
		this.wrap = this.el.wrap({cls: 'search_input'});
		
		this.Wwrap = this.wrap.wrap({tag:'div',cls:'search_inner'});
		
		this.trigger = this.Wwrap.createChild(this.triggerConfig ||
				{tag: "div", alt: "", cls: "search_bt"});
		var _this = this;
		this.trigger.on('click',function(){
			_this.triggerClick();
		});
		if(this.width){
			this.wrap.applyStyles({
				width : (this.width - this.triggerWidth + 13)+'px'
			});
			this.el.applyStyles({
				width : (this.width - this.triggerWidth + 13)+'px'
			});
		}
		
		this.resizeEl = this.positionEl = this.Wwrap;
	},
	triggerClick : function(){
		this.ownerCt.doSearch();
	},
	listeners : {
		resize : function(comp, adjWidth, adjHeight, oriWidth, oriHeight){
			this.wrap.applyStyles({
				width : (adjWidth- this.triggerWidth - 6 - 6 - 1 -17 +13)+'px'
			});
			this.el.applyStyles({
				width : (adjWidth - this.triggerWidth -6 - 6 - 1 -17 + 13)+'px'
			});
			this.Wwrap.applyStyles({
				width : adjWidth+'px'
			});
		}
	}
});
Ext.reg('searchfield', Wlj.widgets.search.search.SearchField);
Wlj.widgets.search.search.SearchType = Ext.extend(Ext.BoxComponent,{
	autoEl : {
		tag : 'div',
		cls : 'search_fun'
	},
	searchUlTemplate : new Ext.XTemplate('<ul class=search_ul></ul>'),
	items : Wlj.search.App.SEARCHTYPES,
	onRender : function(ct,position){
		Wlj.widgets.search.search.SearchType.superclass.onRender.call(this,ct,position);
		this.searchUl = Ext.fly(this.searchUlTemplate.append(this.el));
		this.types = new Array();
		var types = this.types;
		var _this = this;
		Ext.each(this.items,function(i){
			types.push(new Wlj.widgets.search.search.SearchI(i,_this.searchUl,_this));
		});
		this.selectFirst();
	},
	selectFirst: function(){
		this.types[0].click();
	},
	setCurrentType : function(searchI){
		this.currentType = searchI;
	},
	getSearchType : function(){
		return this.currentType;
	}
});
Ext.reg('searchtype', Wlj.widgets.search.search.SearchType);
Wlj.widgets.search.search.SearchI = function(cfg,ct,owner){
	this.owner = owner;
	this.template = new Ext.XTemplate('<li>{name}</li>');
	Ext.apply(this,cfg);
	this.el = this.template.append(ct,{name:this.name});
	var _this = this;
	this.el.onclick = function(){
		_this.click();
	};
};
Wlj.widgets.search.search.SearchI.prototype.clearSelect = function(){
	Ext.fly(this.el).removeClass('selected');
	this.owner.setCurrentType(false);
};

Wlj.widgets.search.search.SearchI.prototype.click = function(){
	if(this.owner.currentType)
		this.owner.currentType.clearSelect();
	this.owner.setCurrentType(this);
	Ext.fly(this.el).addClass('selected');
	if(Ext.isFunction(this.handler)){
		this.handler.call(this,this,this.el);
	}
};

Wlj.widgets.search.search.SearchI.prototype.getSearchType = function(){
	return this.searchType ? this.searchType : false;
};

Wlj.widgets.search.search.SearchI.prototype.getData = function(){
	return '';
};

Wlj.widgets.search.search.SearchComponent = Ext.extend(Ext.Container,{
	autoEl:{
		tag : 'div',
		cls : 'search'
	},
	searchTypeSelect : true,
	fLeft : 35,
	comfex : false,
	comfexFn : false,
	onRender : function(ct, position){
		Wlj.widgets.search.search.SearchComponent.superclass.onRender.call(this, ct, position);
		if(this.searchTypeSelect){
			this.searchType = new Wlj.widgets.search.search.SearchType({
				appObject : this.appObject
			});
			this.add(this.searchType );
		}
		this.searchField = new Wlj.widgets.search.search.SearchField({
			comfex : this.comfex,
			appObject : this.appObject
		});
		this.add(this.searchField );
		this.doLayout();
	},
	afterRender : function(){
		Wlj.widgets.search.search.SearchComponent.superclass.afterRender.call(this);
		if(this.comfex){
			var vs = this.el.getViewSize();
			var _this = this;
			var innerWidth= 48;
			var left = vs.width -48 ;
			var top = parseInt(vs.height/2);
			var inner = '<div sylte="position:absolute;width:'+innerWidth+'px;margin-left:'+left+'px;margin-top:'+top+'px;"><a href="#" ><font color=blue>高级查询</font></a></div>';
			this.comfexEl = this.el.createChild(inner);
			if(Ext.isFunction(this.comfexFn)){
				this.comfexEl.on('click',function(){
					_this.comfexFn();
				});
			}
		}
	},
	listeners : {
		resize : function(comp, adjWidth, adjHeight, rawWidth, rawHeight ) {
			comp.searchField.setWidth(adjWidth - comp.fLeft*2);
		}
	},
	doSearch : function(){
		if(this.searchTypeSelect !== true){
			Ext.Msg.alert("提示","请重写该对象的doSearch方法！");
			return false;
		}
		var searchType = this.searchType.getSearchType();
		var searchCondition = this.searchField.getValue();
		if(!searchType){
			Ext.Msg.alert('提示',' 请选择查询类型');
			return false;
		}
		if(!searchCondition){
			Ext.Msg.alert('提示','请添写查询条件');
			return false;
		}
		var resId = "SEARCH_"+searchType.getSearchType();
		var resultUrl = searchType.searchUrl;
		if(!resultUrl){
			return;
		}
		this.appObject.openWindow({
			name : searchType.name+'搜索:'+searchCondition,
			action : basepath + resultUrl+'?condition='+searchCondition,
			resId : resId,
			id : 'task_'+resId
		});
	},
	getValue : function(){
		return this.searchField.getValue();
	},
	setValue : function(value){
		if(value){
			this.searchField.setValue(value);
		}
	}
});
Ext.reg('searchcomponent',Wlj.widgets.search.search.SearchComponent);

Wlj.widgets.search.search.ModeShort = Ext.extend(Ext.BoxComponent,{
	autoEl : {
		tag : 'div',
		cls : 'tile w190h1 short_fun'
	},
	icon : 'ico-t-1',
	tileColor : 'tile_c1',
	name : '经营统计分析',
	ironTemplate : new Ext.XTemplate('<div class=tile_fun >',
			'<div class="tile_fun_pic {icon}">',
//			'<img width=60 hieght=60 src='+basepath+'/{icon} complete=complete />',
			'</div>',
			'<div class=tile_fun_name >',
			'<p title={name}>',
			'<i>{name}</i>',
			'</p>',
			'</div>',
			'</div>'),
	onRender : function(ct,position){
		Wlj.widgets.search.search.ModeShort.superclass.onRender.call(this,ct,position);
		var _this = this;
		_this.ironTemplate.append(_this.el,{
			name : _this.name,
			icon : _this.icon
		});
		
		_this.el.on('click', function(){
			_this.click();
		});
	},
	click :function (){
		Wlj.ServiceMgr.findServiceByID(this.menuData.ID).execute();
	}
});
Ext.reg('modeshort', Wlj.widgets.search.search.ModeShort);

Wlj.widgets.search.search.ShortTitle = Ext.extend(Wlj.widgets.search.search.ModeShort,{
	autoEl :{
		tag : 'div',
		cls : 'tile base tile_c1 short_fun'
	},
	icon : 'ico-t-1',
	tileColor : 'tile_c1',
	name : '历史记录',
	click :function (){
		return false;
	}
});
Ext.reg('shorttitle', Wlj.widgets.search.search.ShortTitle);


Wlj.widgets.search.search.ShortContainer = Ext.extend(Ext.Container,{
	autoEl : {
		tag : 'div',
		cls : 'layout_fun'
	},
	layoutElTemplate : new Ext.XTemplate('<div class=layout_fun_pos></div>'),
	onRender : function(ct,position){
		Wlj.widgets.search.search.ShortContainer.superclass.onRender.call(this,ct,position);
		this.layoutDom = this.layoutElTemplate.append(this.el);
	},
	getLayoutTarget : function(){
		return this.layoutDom;
	}
});
Ext.reg('shortcontainer' ,Wlj.widgets.search.search.ShortContainer);
Wlj.widgets.search.search.SearchMainContainer = Ext.extend(Ext.Container,{
	autoEl : {
		tag : 'div',
		cls : 'layout layout_search'
	}
});
Ext.reg('searchmaincontainer', Wlj.widgets.search.search.SearchMainContainer);Ext.ns('Wlj.widgets.search.tile');
Wlj.widgets.search.tile.TileContainer = Ext.extend(Ext.Container, {
	cls : 'layout layout_tile',
	innerTpl : new Ext.XTemplate(' <div class="layout_contents" >','</div>'),
	layoutEl : false,
	scrolling : false,
	scrollIndex : 0,
	onRender :  function(ct,pos){
		Wlj.widgets.search.tile.TileContainer.superclass.onRender.call(this,ct,pos);
		this.layoutEl = this.innerTpl.append(this.el);
		//Ext.fly(this.layoutEl).setHeight(this.height);
		var _this = this;
		this.el.on('mousewheel', function(e){
			var delta = e.getWheelDelta();
			_this.scroll(delta);
		});
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
	},
	initComponent:function(){
		Wlj.widgets.search.tile.TileContainer.superclass.initComponent.call(this);
	},
	getLayoutTarget : function(){
		return this.layoutEl;
	},
	listeners : {
		show : function(cont){
			cont.scrollIndex = 0;
		}
	},
	scroll : function(delta){
		var _this = this;
		if(this.scrolling){
			return false;
		}
		this.scrolling = true;
		if(delta<0 && this.scrollIndex < this.items.getCount()-1){
			this.scrollIndex ++ ;
		}else if(delta>0 && this.scrollIndex >0){
			this.scrollIndex --;
		}else {
			_this.scrolling = false;//修复代码
			return;
		}
		this.el.scrollTo('left', this.scrollIndex * 836, true);
		setTimeout(function(){
			_this.scrolling = false;
		},350);
	},
	onContextMenu : function(e, added){
		var tilecontainermenu = Wlj.search.App.CONTEXT_MENU.TILE_CONTAINER;
		if(added.length>0&&tilecontainermenu.length>0){
			added.push('-');
		}
		var _this = this;
		if(tilecontainermenu.length>0){
			Ext.each(tilecontainermenu, function(tcm){
				tcm.handler = tcm.fn.createDelegate(_this);
				added.push(tcm);
			});
		}
		this.appObject.onContextMenu(e, added);
	}
});
Ext.reg('tilecontainer',Wlj.widgets.search.tile.TileContainer);

Wlj.widgets.search.tile.TileGroup = Ext.extend(Ext.Panel, {
	baseCls : 'layout_position',
	width : 840,
	tileKeys : [],
	height : 432,
	groupMargin : 27,
	onRender : function(ct, position){
		Wlj.widgets.search.tile.TileGroup.superclass.onRender.call(this, ct, position);
		this.el.setLeft(this.width*this.index+this.groupMargin*(this.index+1));
		this.initEvents();
		var _this = this;
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
		this.el.applyStyles({
			border:'1px transparent  dashed'
		});
	},
	
	initEvents : function(){
		this.dd = new Wlj.widgets.search.tile.GroupDropZone(this, {
			ddGroup: 'tileDrop'
		});
	},
	
	getTileWithPoint : function(point){
		var TX = point.x,
			TY = point.y;
		var _this = this;
		var items = _this.items.items,
			len = items.length;
		var ofTiles = [];
		for(var tileIndex=0; tileIndex<len; tileIndex++){
			var tile = items[tileIndex];
			var PS = tile.pos_size;
			if(TX >= PS.TX && TX < PS.TX+PS.TW
					&& TY >= PS.TY && TY < PS.TY+PS.TH){
				ofTiles.push(tile);
			}
		}
		return ofTiles;
	},
	regTile : function(keys,tileReg){
		
		if(!this.tileKeys){
			this.tileKeys = {};
		}
		
		if(!Ext.isArray(keys)){
			return false;
		}
		var _this = this;
		Ext.each(keys,function(key){
			_this.tileKeys[Ext.encode(key)] = tileReg;
		});
	},
	unRegTile : function(keys,tile){
		if(!Ext.isArray(keys)){
			return false;
		}
		var _this = this;
		Ext.each(keys,function(key){
			delete _this.tileKeys[Ext.encode(key)];
		});
	},
	getRegedTiles : function(keys){
		if(!Ext.isArray(keys)){
			return false;
		}
		var _this = this;
		var regedTiles = [];
		Ext.each(keys,function(key){
			if(regedTiles.indexOf(_this.tileKeys[Ext.encode(key)])<0){
				regedTiles.push(_this.tileKeys[Ext.encode(key)]);
			}
		});
		return regedTiles;
	},
	onContextMenu : function(e, added){
		
		var tilegroupmenu = Wlj.search.App.CONTEXT_MENU.TILE_GROUP;
		if(added.length>0&&tilegroupmenu.length>0){
			added.push('-');
		}
		var _this = this;
		if(tilegroupmenu.length>0){
			Ext.each(tilegroupmenu, function(tgm){
				tgm.handler = tgm.fn.createDelegate(_this);
				added.push(tgm);
			});
		}
		this.ownerCt.onContextMenu(e, added);
	}
});
Ext.reg('tilegroup', Wlj.widgets.search.tile.TileGroup);

Wlj.widgets.search.tile.TileLayout = Ext.extend(Ext.layout.ContainerLayout,{
	
	type : 'tilegroup',
	renderItem : function(c, position, target){
		Wlj.widgets.search.tile.TileLayout.superclass.renderItem.call(this,c,position,target);
	},
	fixPosition : function(c,target){
		var baseX = Ext.fly(target).getX(),
			baseY = Ext.fly(target).getY();
		c.el.setX(baseX + c.el.getX());
		c.el.setY(baseY + c.el.getY());
	}
	
});
Ext.Container.LAYOUTS['tilegroup'] = Wlj.widgets.search.tile.TileLayout;

Wlj.widgets.search.tile.GroupDropZone = Ext.extend(Ext.dd.DropTarget,{
	constructor : function(group, cfg){
		this.group = group;
		Ext.dd.ScrollManager.register(group.body);
		Wlj.widgets.search.tile.GroupDropZone.superclass.constructor.call(this,group.body.dom, cfg);
		group.el.ddScrollConfig =  this.ddScrollConfig;
	},
	createEvent : function(dd,e,data,col,c, pos){
		return {
			group : this.group,
			panel : data.panel,
			columnIndex: col,
			column: c,
			position: pos,
			data: data,
			source: dd,
			rawEvent: e,
			status: this.dropAllowed
		};
	},
	notifyEnter : function(ddSource, e, data){
		this.group.el.applyStyles({
			border : '1px #d3dbea dashed'
		});
	},
	notifyOut : function(ddSource, e, data){
		this.group.el.applyStyles({
			border : '1px transparent dashed'
		});
	},
	notifyDrop : function(ddSource, e, data){
		var tile = ddSource.tile;
		var menu = ddSource.menu;
		var plugin = ddSource.plugin;
		var ghost = ddSource.proxy.ghost;
		if(tile){
			if(tile.ownerCt !==this.group){
				tile.ownerCt.remove(tile,false);
				tile.el.setLeft(16);
				tile.el.setTop(16);
				tile.pos_size.TX=0;
				tile.pos_size.TY=0;
				this.group.add(tile);
				this.group.doLayout();
			}
			var influenced = tile.moveTo(ghost.getXY());
		}else if(menu){
			var group = this.group.ownerCt.items.indexOf(this.group);
			var appObject =  this.group.appObject;
			var _x = ghost.getXY()[0] - this.group.el.getX(),
			_y = ghost.getXY()[1] - this.group.el.getY();
			var pos = {};
			pos.POS_X = Math.floor(_x/128);
			pos.POS_Y = Math.floor(_y/128);
			appObject.createTile(appObject.createTileCfg(menu,pos),group);
			appObject.tileContainer.doLayout();
		}else if(plugin){
			var group = this.group.ownerCt.items.indexOf(this.group);
			var appObject =  this.group.appObject;
			var _x = ghost.getXY()[0] - this.group.el.getX(),
				_y = ghost.getXY()[1] - this.group.el.getY();
			var pos = {};
			pos.POS_X = Math.floor(_x/128);
			pos.POS_Y = Math.floor(_y/128);
			appObject.createTile(plugin.createTileCfg(pos),group);
			appObject.tileContainer.doLayout();
		}
	}
});


/*****************************Tile object class , to be fixed!since 2013-9-29*******************************/
Wlj.widgets.search.tile.Tile = Ext.extend(Ext.Container, {
	
	animate : false,
	jsUrl : false,
	
	dragable : true,
	ddInitType : 'render',//mousedown
	removeable : true,
	
	
	enforceHeight : true,
	enforceWidth : true,
	
	position : 'absolute',
	float : false,
	
	insertProxy : false,
	
	ownerW : 6,
	ownerH : 3,
	
	ownerWI : 0,
	ownerHI : 0,
	
	baseSize : 128,
	baseWidth : false,
	baseHeight : false,
	
	baseMargin : 4,
	
	defaultDDGroup : 'tileDrop',
	
	tileManaged : true,
	
	tileSize : false,
	tileName : false,
	tileLogo : false,

	autoEl : {
		tag : 'div',
		cls : '',
		style:{
			position:'absolute'
		}
	},
	layoutTpl : new Ext.XTemplate('<div style="overflow-x:hidden;overflow-y:hidden; position: relative;"></div>'),
	toolTemplate : new Ext.Template(
            '<div style="position:absolute;top:0;right:0; " class="x-tool x-tool-{id}">&#160;</div>'),
    logoTemplate : new Ext.XTemplate(
    		'<div class=tile_fun >',
    			'<a href=javascript:void(0); >',
    			'<div class="tile_fun_pic {tileLogo}">',
//    				'<img width=60 height=60 src={tileLogo} complete=complete />',
    			'</div>',
    			'<div class=tile_fun_name >',
    				'<p title={tileName} >',
    					'<i>',
    						'{tileName}',
    					'</i>',
    				'</p>',
    			'</div>',
    			'</a>',
    		'</div>'
    ),
	pos_size : {
		TW : 1 ,
		TH : 1 ,
		TX : 0 ,
		TY : 0 
	},
	initPostKey : function(){
		this.posKey = [];
		for(var x=0;x< this.pos_size.TW;x++){
			for(var y=0;y< this.pos_size.TH;y++){
				var pKey = {};
				this.posKey.push({
					x : this.pos_size.TX + x,
					y : this.pos_size.TY + y
				});
			}
		}
	},
	
	initComponent : function(){
		if(this.float){
			if(!this.style){
				this.style = {};
			}
			this.style.float = this.float;
			this.style.position = 'relative';
			this.style.margin = this.baseMargin + 'px';
		}
		Wlj.widgets.search.tile.Tile.superclass.initComponent.call(this);
		this.baseWidth = this.baseWidth ? this.baseWidth : this.baseSize;
		this.baseHeight = this.baseHeight ? this.baseHeight : this.baseSize;
		this.addEvents('beforeberemoved','beremoved');
	},
	
	onRender : function(ct,position){
		Wlj.widgets.search.tile.Tile.superclass.onRender.call(this,ct,position);
		var _this = this;
		if(!this.float){
			this.buildTilePosition();
		}
		this.buildTileSize();
		this.animate = new Wlj.widgets.search.tile.Tile.Animate(this);
		this.JsLoader = Ext.ScriptLoader;
		this.initPostKey();
		this.layoutEl = this.layoutTpl.append(this.el);
		if(this.dragable && this.ddInitType === 'render'){
			this.dd = new Wlj.widgets.search.tile.Tile.DD(this, {
				ddGroup: this.defaultDDGroup,
				insertProxy : this.insertProxy
			});
		}
	},
	afterRender : function(){
		Wlj.widgets.search.tile.Tile.superclass.afterRender.call(this);
		var _this = this;
		this.el.on('mousedown', function(e,t,o){
			if(_this.dragable && !_this.dd){
				_this.dd = new Wlj.widgets.search.tile.Tile.DD(_this, {
					ddGroup: _this.defaultDDGroup,
					insertProxy : _this.insertProxy
				});
				_this.dd.handleMouseDown(e,_this.dd);
			}
		});
		if(!this.tileSize){
			if(this.tileLogo){
				this.logo = this.logoTemplate.append(this.getLayoutTarget(),{
					tileLogo : this.tileLogo,
					tileName : this.tileName
				});
				Ext.fly(this.logo).on('click',function(){
					_this.clickFire();
				});
			}
		}
		if(this.tileManaged){
			Wlj.TileMgr.addTile(this);
		}
		var _this = this;
		if(this.removeable){
			var overCls = 'x-tool-unpin';
			var t = this.toolTemplate.insertFirst(this.el,{id:'pin'});
			/***************TO FIX**********/
			t.style.zIndex = 15000;
			Ext.fly(t).addClassOnOver(overCls);
			Ext.fly(t).animate({
				opacity : {to:0,from:1}
			},1);
			Ext.fly(t).on('mouseover',function(e,t,o){
				e.stopEvent();
				Ext.fly(t).animate({
					opacity : {to:1,from:0}
				},1);
			}) ;
			Ext.fly(t).on('mouseout',function(e,t,o){
				e.stopEvent();
				Ext.fly(t).animate({
					opacity : {to:0,from:1}
				},1);
			}) ;
			Ext.fly(t).on('click',function(e,t,o){
				e.stopEvent();
				_this.removeThis();
			});
			_this.removeTool = t;
		}
	},
	moveTo : function(posXY,callback){
		var tile = this;
		var pos = tile.getXYOrder(posXY);
		var influnceTils = this.ownerCt.getRegedTiles(this.posKey);
		tile.moveToPoint(pos);
		this.initPostKey();
	},
	moveToPoint : function(pos,callback){
		
		var tile = this;
		var posLast = tile.initPosition();
		
		tile.pos_size.TX = pos.x ;
		tile.pos_size.TY = pos.y ;
		
		tile.fixPos();
		
		var posNow =  tile.initPosition();
		
		var interX = posNow.x-posLast.x;
		var interY = posNow.y-posLast.y;
		
		this.animate.moveWithRaletive(interX, interY,callback);
		
	},
	forcedMove : function(){
	},
	getXYOrder : function(xy){
		var _x = xy[0] - this.ownerCt.el.getX(),
			_y = xy[1] - this.ownerCt.el.getY();
		var pos = {};
		pos.x = Math.floor(_x/this.baseWidth);
		pos.y = Math.floor(_y/this.baseHeight);
		return pos;
	},
	buildTilePosition : function(){
		this.el.setPositioning({'position':this.position});
		this.fixPos();
		this.el.setLeft(this.initPosition().x );
		this.el.setTop(this.initPosition().y);
//		this.el.setLocation(this.initPosition().x + this.ownerCt.el.getX(),this.initPosition().y+this.ownerCt.el.getY(),true);
	},
	buildTileSize : function(){
		if(this.enforceHeight)
			this.el.dom.style.height = this.getSize().height+"px";
		if(this.enforceWidth)
			this.el.dom.style.width = this.getSize().width+"px";
	},
	getSize : function(){
		var TW = this.pos_size.TW;
		var TH = this.pos_size.TH;
		
		return {
			width : TW*this.baseWidth+(this.baseMargin*2)*(TW-1),
			height : TH*this.baseHeight+(this.baseMargin*2)*(TH-1)
 		};
	},
	setSize : function(pos){
		if(!pos)
			return;
		if(!pos.width && !pos.height)
			return;
		if(!Ext.isNumber(pos.width) && !Ext.isNumber(pos.height))
			return;
		if(Ext.isNumber(pos.width)){
			this.pos_size.TW = pos.width;
		}
		if(Ext.isNumber(pos.height)){
			this.pos_size.TH = pos.height;
		}
		/**
		 * TODO fix the tile size;
		 */
		this.buildTileSize();
	},
	
	initPosition : function(){
		var TX = this.pos_size.TX;
		var TY = this.pos_size.TY;
		return {
			x : TX * this.baseWidth + (TX + 2)*(this.baseMargin*2) ,
			y : TY * this.baseHeight + (TY + 2)*(this.baseMargin*2)
		};
	},
	setPosition : function(size){
		
		var posLast = this.initPosition();
		
		if(!size){
			return;
		}
		if(!size.x && !size.y){
			return;
		}
		if(!Ext.isNumber(size.x) && !Ext.isNumber(size.y)){
			return;
		}
		if(Ext.isNumber(size.x)){
			this.pos_size.TX = size.x;
		}
		if(Ext.isNumber(size.y)){
			this.pos_size.TY = size.y;
		}
		
		var posNow = this.initPosition();
		
		this.el.moveTo(posNow.x-posLast.x , posNow.y-posLast.y ,true);		
		/***
		 * TODO fix the tile position;
		 */
		//this.buildTilePosition();
	},
	fixPos :function(){
		var tile = this;
		var ownerWI = this.ownerWI;
		var ownerHI = this.ownerHI;
		
		if(tile.pos_size.TX < ownerWI){
			tile.pos_size.TX = ownerWI;
		}
		if(tile.pos_size.TY < ownerHI){
			tile.pos_size.TY = ownerHI;
		}
		
		if(tile.pos_size.TY + tile.pos_size.TH > tile.ownerH){
			tile.pos_size.TY = tile.ownerH - tile.pos_size.TH;
		}
		
		if(tile.pos_size.TX + tile.pos_size.TW > tile.ownerW){
			tile.pos_size.TX = tile.ownerW - tile.pos_size.TW;
		}
	},
	createGhost : function(cls, useShim, appendTo){
		var el = document.createElement('div');
		el.className = 'x-panel-ghost ' + (cls ? cls : '');
		if(this.header){
			el.appendChild(this.el.dom.firstChild.cloneNode(true));
		}
		Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(this.getSize().height);
		el.style.width = this.el.dom.offsetWidth + 'px';
		if(!appendTo){
			this.container.dom.appendChild(el);
		}else{
			Ext.getDom(appendTo).appendChild(el);
		}
		if(useShim !== false && this.el.shim !== false){
			var layer = new Ext.Layer({shadow:false, useDisplay:true, constrain:false}, el);
			layer.show();
			return layer;
		}else{
			return new Ext.Element(el);
		}
	},
	removeThis : function(){
		var _this = this;
		try{
			_this.animate.fadeOut();
			setTimeout(function(){
				if(_this.ownerCt){
					_this.ownerCt.remove(_this,true);
				}else{
					_this.destroy();
				}
			},1000);
		}catch(e){
		}
	},
	clickFire : function(){
		var _this = this;
		if(!_this.menuData){
			return;
		}
		if(!_this.menuData.ACTION || _this.menuData.ACTION == '0'){
			return;
		}
		Wlj.ServiceMgr.findServiceByID(this.menuData.ID).execute();
	},
	getLayoutTarget : function(){
		return this.layoutEl;
	},
	destroy : function(){
		if(this.dd){
			this.dd.destroy();
		}
		if(this.animate)
			Ext.destroy(this.animate);
		this.removeAll();
		this.purgeListeners();
		this.el.removeAllListeners();
		Ext.fly(this.layoutEl).remove();
		if(this.logo){
			Ext.fly(this.logo).removeAllListeners();			
			Ext.fly(this.logo).remove();
		}
		if(this.removeTool){
			Ext.fly(this.removeTool).removeAllListeners();			
			Ext.fly(this.removeTool).remove();
		}
		if(this.tileManaged){
			/**
			 * TODO remove from tile manager;
			 */
		}
		Wlj.widgets.search.tile.Tile.superclass.destroy.call(this);
	}
});
Ext.reg('tile', Wlj.widgets.search.tile.Tile);

Wlj.widgets.search.tile.NegaLayout = Ext.extend(Ext.layout.CardLayout,{
	
	renderHidden : false,
    setActiveItem : function(item){
        var ai = this.activeItem,
            ct = this.container;
        item = ct.getComponent(item);
        if(item && ai != item){
            this.activeItem = item;
            delete item.deferLayout;
            Ext.fly(ct.layoutEl).scrollTo('top', ct.items.indexOf(item)*ct.el.getHeight() , true);
            item.fireEvent('activate', item);
        }
    },
    configureItem : function(c){
    	if(c && this.container.el.getHeight() > 0){
            c.setSize(this.container.el.getViewSize());
        }
    },
	getLayoutTargetSize : function(){
		return this.container.el.getViewSize();
	}
});
Ext.Container.LAYOUTS['nega'] = Wlj.widgets.search.tile.NegaLayout;

Wlj.widgets.search.tile.NegativeTile = Ext.extend(Wlj.widgets.search.tile.Tile, {
	negativeConfig : false,
	layout : 'nega',
	interval : 1000,
	intervalId : false,
	initComponent : function(){
		Wlj.widgets.search.tile.NegativeTile.superclass.initComponent.call(this);
		this.on('afterlayout', this.reRunInterval);
	},
	onRender : function(ct, position){
		Wlj.widgets.search.tile.NegativeTile.superclass.onRender.call(this, ct, position);
	},
	afterRender : function(){
		Wlj.widgets.search.tile.NegativeTile.superclass.afterRender.call(this);
		this.layout.setActiveItem(0);
		this.el.on('mouseover', this.clearInterval.createDelegate(this));
		this.el.on('mouseout', this.reRunInterval.createDelegate(this));
	},
	scrollToNext : function(){
		var count = this.items.getCount();
		var index = this.items.indexOf(this.layout.activeItem);
		if(index < count-1){
			index ++;
		}else{
			index = 0;
		}
		this.layout.setActiveItem(index);
	},
	clearInterval : function(){
		clearInterval(this.intervalId);
		this.intervalId = false;
	},
	setInterval : function(){
		var interval = this.interval;
		var _this = this;
		if(this.items.getCount()>1){
			_this.intervalId = setInterval(function(){
				_this.scrollToNext();
			}, interval);
		}
	},
	reRunInterval : function(){
		var _this = this;
		if(_this.intervalId !== false){
			_this.clearInterval();
		}
		_this.setInterval();
	}
});
Ext.reg('negatile', Wlj.widgets.search.tile.NegativeTile);

Wlj.widgets.search.tile.ResizeTile = Ext.extend(Wlj.widgets.search.tile.NegativeTile,{
	enableResize : true,
	afterRender : function(){
		Wlj.widgets.search.tile.ResizeTile.superclass.afterRender.call(this);
		if(this.enableResize){
			this.createResizable();
		}
	},
	createResizable : function(){
		this.RESIZEABLE = new Wlj.widgets.search.tile.ResizeTile.Resizeable(this.el, {});
		this.RESIZEABLE.on('resize',this.onresize.createDelegate(this));
	},
	onresize : function(res, width, height, e){
	}
});
Ext.reg('resizetile', Wlj.widgets.search.tile.ResizeTile);

Wlj.widgets.search.tile.ResizeTile.Resizeable = Ext.extend(Ext.Resizable, {
	constructor : function(el, config){
		Wlj.widgets.search.tile.ResizeTile.Resizeable.superclass.constructor.call(this, el, config);
	},
	handles: 'se',
	preserveRatio: true,
	minWidth: 50,
	minHeight : 50,
	dynamic: true
});

Wlj.widgets.search.tile.IndexTile = Ext.extend(Wlj.widgets.search.tile.ResizeTile,{
	enableResize : false,
	enableTransSize : true,
	resizeTemplate : new Ext.Template(
    '<div style="position:absolute;bottom:0;right:0; " class="x-tool x-tool-{id}">&#160;</div>'),
    initComponent : function(){
		Wlj.widgets.search.tile.IndexTile.superclass.initComponent.call(this);
		var size = this.appObject.translateSize(this.tileSize);
		if(size.TH == undefined || size.TW == undefined || (size.TW==1&&size.TH==1)){
			this.jsUrl = false;
			this.tileSize = false;
		}
	},
	afterRender : function(){
		Ext.fly(this.layoutEl).setSize(this.el.getViewSize());
		Wlj.widgets.search.tile.IndexTile.superclass.afterRender.call(this);
		if(Ext.isEmpty(this.menuData.SUPPORT_SIZE_URL)){
			this.enableTransSize = false;
		}
		var _this = this;
		if(this.enableTransSize){
			this.supported = Ext.unzipString(this.menuData.SUPPORT_SIZE_URL,',','|');
			var t = this.resizeTemplate.insertFirst(this.el,{id:'refresh'});
			t.style.zIndex = 15000;
			Ext.fly(t).animate({
				opacity : {to:0,from:1}
			},1);
			Ext.fly(t).on('mouseover',function(e,t,o){
				e.stopEvent();
				Ext.fly(t).animate({
					opacity : {to:1,from:0}
				},1);
			}) ;
			Ext.fly(t).on('mouseout',function(e,t,o){
				e.stopEvent();
				Ext.fly(t).animate({
					opacity : {to:0,from:1}
				},1);
			}) ;
			Ext.fly(t).on('click',function(e,t,o){
				e.stopEvent();
				_this.resize();
			});
		}
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
	},
	resize : function(){
		var sizeIndex = -1;
		for(var i=0;i<this.supported.length;i++){
			if(this.supported[i][0] === this.tileSize){
				sizeIndex = i;
			}
		}
		var nextSize = false;
		var jsUrl = false;
		if(sizeIndex < this.supported.length-1){
			nextSize = this.supported[sizeIndex+1][0];
			jsUrl = this.supported[sizeIndex+1][1];
		}
		this.tileSize = nextSize;
		var sizeRe = this.appObject.translateSize(nextSize);
		this.pos_size.TW = sizeRe.TW;
		this.pos_size.TH = sizeRe.TH;
		this.jsUrl = jsUrl;
		this.reBuiltTile();
	},
	reBuiltTile : function(){
		delete this.contentObject;
		this.clearTileContent();
		this.buildTileSize();
		Ext.fly(this.getLayoutTarget()).applyStyles({
			height : this.el.getHeight(),
			width : this.el.getWidth()
		});
		if(!this.tileSize){
			if(this.tileLogo){
				var logo = this.logoTemplate.append(this.getLayoutTarget(),{
					tileLogo : this.tileLogo,
					tileName : this.tileName
				});
				Ext.fly(logo).on('click',function(){
					_this.clickFire();
				});
			}
		}
		Wlj.TileMgr.tiles.remove(this);
		Wlj.TileMgr.addTile(this);
	},
	clearTileContent : function(){
		this.removeAll();
		this.doLayout();
		this.getLayoutTarget().innerHTML = '';
	},
	onContextMenu : function(e, added){
		var indextilemenu = Wlj.search.App.CONTEXT_MENU.INDEX_TILE;
		if(added.length>0&&indextilemenu.length>0){
			added.push('-');
		}
		var _this = this;
		if(indextilemenu.length>0){
			Ext.each(indextilemenu, function(itm){
				itm.handler = itm.fn.createDelegate(_this);
				added.push(itm);
			});
		}
		this.ownerCt.onContextMenu(e, added);
	}
});
Ext.reg('indextile', Wlj.widgets.search.tile.IndexTile);


Wlj.widgets.search.tile.EditTile = Ext.extend(Wlj.widgets.search.tile.Tile,{
	tileManaged : false,
	tileLogo : false,
	baseSize : 300,
	hideLabel : true,
	innerTextTpl : new Ext.XTemplate('<div>{valueText}</div>'),
	initComponent : function(){
		Wlj.widgets.search.tile.EditTile.superclass.initComponent.call(this);
		delete this.html;
		var _this = this;
		this.contentArea = new Ext.form.TextArea({
			preventScrollbars : false,
			width:this.baseSize*this.pos_size.TW,
			height:this.baseSize*this.pos_size.TH,
			listeners : {
				blur:function(area){
					area.hide();
					_this.onAreaBlur(area);
				}
			}
		});
	},
	onRender : function(ct, position){
		Wlj.widgets.search.tile.EditTile.superclass.onRender.call(this, ct, position);
		this.contentArea.render(this.el);
		this.contentArea.hide();
		var _this = this;
		this.el.on('dblclick', function(){
			_this.contentArea.show();
			_this.contentArea.focus();
			_this.contentArea.setValue(this.valueText);
		});
		this.on('resize', this.onresize);
	},
	onresize : function(tile, aw, ah, rw, rh){
		this.contentArea.setHeight(ah);
		this.contentArea.setWidth(aw);
	},
	onAreaBlur : function(area){
		this.valueText = area.getValue();
		if(this.innerHtml)
			Ext.fly(this.innerHtml).remove();
		delete this.innerHtml;
		this.innerHtml = this.innerTextTpl.append(this.el, {
			valueText : this.valueText
		});
	}
});

Wlj.widgets.search.tile.TileProxy = Ext.extend(Object, {
	
	constructor : function(tile, config){
    	this.tile = tile;
    	this.id = this.tile.id +'-ddproxy';
    	Ext.apply(this, config);        
	},
	/**
	 * true:拖动的时候在容器内插入代理的节点；false：不插入。
	 */
	insertProxy : false,
    setStatus : Ext.emptyFn,
    reset : Ext.emptyFn,
    update : Ext.emptyFn,
    stop : Ext.emptyFn,
    sync: Ext.emptyFn,
    
    getEl :  function(){
		return this.ghost;
	},
	getGhost : function(){
		return this.ghost;
	},
	getProxy : function(){
		return this.proxy;
	},
	hide : function(){
		if(this.ghost){
			if(this.proxy){
				this.proxy.remove();
				delete this.proxy;
			}
			this.tile.el.dom.style.display = '';
			this.ghost.remove();
			delete this.ghost;
		}
	},
	show : function(){
		if(!this.ghost){
			this.ghost = this.tile.createGhost(this.tile.initialConfig.cls, undefined, Ext.getBody());
			this.ghost.setXY(this.tile.el.getXY());
			if(this.insertProxy){
				this.proxy = this.tile.el.insertSibling({cls:'tile'});
				this.proxy.setSize(this.tile.getSize());
			}
			this.tile.el.dom.style.display = 'none';
		}
	},
	repair : function(xy, callback, scope){
		this.hide();
		if(typeof callback == 'function'){
			callback.call(scope || this);
		}
	},
	moveProxy : function(parentNode, before){
		if(this.proxy){
			parentNode.insertBefore(this.proxy.dom, before);
		}
	}
});

Wlj.widgets.search.tile.Tile.DD = Ext.extend(Ext.dd.DragSource, {
	constructor : function(tile, cfg){
		this.tile = tile;
		this.dragData = {tile : tile};
		this.proxy = new Wlj.widgets.search.tile.TileProxy(tile, cfg);
		Wlj.widgets.search.tile.Tile.DD.superclass.constructor.call(this, tile.el, cfg);
		var h = tile.header,
			el = tile.el;
		if(h){
			this.setHandleElId(h.id);
			el = tile.header;
		}
		this.scroll = false;
	},
	showFrame: Ext.emptyFn,
    startDrag: Ext.emptyFn,
    b4StartDrag : function(x, y){
		this.proxy.show();
	},
	b4MouseDown : function(e){
		var x = e.getPageX(),
			y = e.getPageY();
		this.autoOffset(x, y);
	},
	onInitDrag : function(x, y){
		this.onStartDrag(x, y);
		return true;
	},
	createFrame : Ext.emptyFn,
	getDragEl : function(e){
		return this.proxy.ghost.dom;
	},
	endDrag : function(e){
		this.proxy.hide();
		this.tile.saveState();
	},
	autoOffset : function(x, y){
		x -= this.startPageX;
		y -= this.startPageY;
		this.setDelta(x, y);
	},
	onDrag : function(e){
	}
});


Wlj.widgets.search.tile.Tile.Animate = function(tile){
	this.tile = tile;
	this.el = tile.el;
	
	Wlj.widgets.search.tile.Tile.Animate.superclass.constructor.call(this);
};

Ext.extend(Wlj.widgets.search.tile.Tile.Animate, Ext.util.Observable, {
	
	defaultAnim : {
		duration : 300
	},
	
	fadeIn : function(dua){
		this.el.fadeIn(300);
	},
	fadeOut : function(dua){
		this.el.fadeOut(300);
	},
	moveWithRaletive : function(x,y ,callback){
		if(!this.el.dom){
			return;
		}
		var start = new Date(),
			duration = this.defaultAnim.duration,
			_this = this,
			finalLocation = _this.tile.initPosition(),
			startLocation = {
				x : parseInt(_this.el.dom.style.left),
				y : parseInt(_this.el.dom.style.top)
			};
		function doAnimate(){
			var current = new Date();
			var elapsed = current - start;
			var fraction = elapsed/duration;
			
			if(fraction >= 1){
				if(_this.el.dom){
					_this.el.applyStyles({
						top : finalLocation.y + 'px',
						left : finalLocation.x + 'px'
					});
				}
				 Ext.TaskMgr.stop(task);
				 if(Ext.isFunction(callback)){
					 try{
						 callback(_this.tile);
					 }catch(e){}
				 }
			}else{
				var currentTop = fraction * y,
					currentLeft = fraction * x;
				if(_this.el.dom){
					_this.el.applyStyles({
						top : currentTop + startLocation.y + 'px',
						left :  currentLeft + startLocation.x + 'px'
					});
				}else{
					Ext.TaskMgr.stop(task);
					 if(Ext.isFunction(callback)){
						 try{
							 callback(_this.tile);
						 }catch(e){}
					 }
				}
			}
			
		}
		
		var task = {
			run     : doAnimate,
			interval: 20,
			scope   : this
		};
		
		Ext.TaskMgr.start(task);
		
	},
	moveWithAbsolute : function(x,y){
		
		var startLeft = this.el.getLeft();
		var startTop = this.el.getTop();
		
		this.moveWithRaletive(x-startLeft,y-startTop);
		
	},
	moveWithMargin : function(x,y){
		
	}
});
Ext.ns('Wlj.widgets.search.menu');
Wlj.widgets.search.menu.MenuItem = Ext.extend(Ext.Container,{
	autoEl : 'li',
	id : '',
	name : '',
	isLeaf : true,
	enableTile : true,
	defaultType : 'wljmenuitem',
	displayTemplate : new Ext.XTemplate(
		'<a class="lv2" href="javascript:void(0);">',
			'<i class="word">',
				'<i class="ico">',
					'<imp height=16 width=16 src="'+basepath+'/contents/wljFrontFrame/styles/search/searchthemes/theme1/pics/menu_icon_fun.png" complete=complete />',
				'</i>',
				'{name}',
			'</i>',
		'</a>'),
	tileTemplate : new Ext.XTemplate('<div style="position:absolute;"></div>'),
	subTemplate : new Ext.XTemplate('<div class=lv_div style="display:none;buttom:0;" ><ul class=lv_ul></ul></div>'),
	subTrigger : new Ext.XTemplate('<i class="arr" />'),
	onRender : function(ct, position){
		if(this.ownerCt){
			this.enableTile = this.ownerCt.enableTile;
		}
		Wlj.widgets.search.menu.MenuItem.superclass.onRender.call(this, ct, position);
		this.displayEl = this.displayTemplate.append(this.el,{
			name :this.name
		});
		var _this = this;
		_this.el.applyStyles({
			zIndex : 15000
		});
		if(!this.isLeaf){
			Ext.fly(this.displayEl).addClass('arr');
			this.subTrigger.append(this.displayEl);
		}
		this.el.on('mouseenter',function(event){
			event.stopEvent();
			_this.showSubs();
		});
		this.el.on('click',function(event){
			event.stopEvent();
			_this.handler();
		});
		if(this.isLeaf && this.enableTile){
			this.createDD();
		}
	},
	showSubs : function(){
		if(!this.inited){
			this.initSubMenus();
		}
		
		if(this.ownerCt.displayedSub){
			this.ownerCt.displayedSub.hideSubs();
		}

		this.ownerCt.displayedSub = this;
		if(!this.hasSub){
			return false;
		}
		this.subEl.style.display = 'block';
		
		var _this = this;
		
		var height = Ext.fly(this.subEl.firstChild).getViewSize().height;
		var top = Ext.fly(this.subEl.firstChild).getXY()[1];
		if(height + top > _this.appObject.size.height){
			Ext.fly(this.subEl).applyStyles({
				marginTop : _this.appObject.size.height - (height + top )+'px'
			});
		}
		return;
	},
	hideSubs : function(){
		if(this.subEl){
			this.subEl.style.display = 'none';
		}
		if(!this.hasSub){
			return false;
		}
		if(this.ownerCt.displayedSub === this){
			this.ownerCt.displayedSub = false;
		}
		
		this.items.each(function(item){
			item.hideSubs();
		});
	},
	hideAll : function(){
		if(this.items.length > 0){
			this.items.each(function(item){
				item.hideAll();
			});
		}else{
			this.el.hide();
		}
		this.hideSubs();
	},
	initSubMenus : function(){
		this.inited = true;
		var subs = this.getSubDatas();
		if(subs.length>0){
			this.hasSub = true;
			this.add(subs);
			this.doLayout();
		}else{
			this.hasSub = false;
		}
	},
	getSubDatas : function(){
		return this.appObject.createSubMenuCfg(this.ID);
	},
	getLayoutTarget : function(){
		if(!this.subEl)
			this.subEl = this.subTemplate.append(this.el);
		return this.subEl.firstChild;
	},
	handler : function(){
		if(this.action){
			Wlj.ServiceMgr.findServiceByID(this.ID).execute();
		}
	},
	createGhost : function(cls, useShim, appendTo){
		var size = this.appObject.translateSize(this.DEFAULT_SIZE);
		var TW = size.TW;
		var TH = size.TH;
		var UW = this.appObject.defaultIndexTileWidthUnit;
		var UH = this.appObject.defaultIndexTileHeightUnit;
		var el = document.createElement('div');
		el.style.width = TW*UW+8*(TW-1);
		el.style.height = TH*UH+8*(TH-1);
		el.className = 'x-panel-ghost ' + (cls ? cls : '');
		if(this.header){
			el.appendChild(this.tileTemplate.apply());
		}
		Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(TH*UH+8*(TH-1));
		el.style.width = TW*UW+8*(TW-1) + 'px';
		if(!appendTo){
			this.container.dom.appendChild(el);
		}else{
			Ext.getDom(appendTo).appendChild(el);
		}
		if(useShim !== false && this.el.shim !== false){
			var layer = new Ext.Layer({shadow:false, useDisplay:true, constrain:false}, el);
			layer.show();
			return layer;
		}else{
			return new Ext.Element(el);
		}
	},
	createDD : function(){
		this.dd = new Wlj.widgets.search.menu.MenuItem.DD(this, {
			ddGroup: 'tileDrop'
		});
	}
});

Ext.reg('wljmenuitem', Wlj.widgets.search.menu.MenuItem);

Wlj.widgets.search.menu.MenuComponent = Ext.extend(Ext.Container, {
	autoEl : {
		tag : 'div',
		cls : 'lv2_div'
	},
	enableTile : true,
	defaultType : 'wljmenuitem',
	componentTemplate : new Ext.XTemplate('<ul class=lv2_ul />'),
	onRender : function(ct,position){
		Wlj.widgets.search.menu.MenuComponent.superclass.onRender.call(this, ct, position);
		this.el.applyStyles({
			zIndex : 15000
		});
		this.itemEl = this.componentTemplate.append(this.el);
	},
	
	getLayoutTarget : function(){
		return this.itemEl;
	},
	hideAll : function(){
		this.items.each(function(item){
			item.hideSubs();
		});
		this.el.hide();
	}
});
Ext.reg('menucomponent',Wlj.widgets.search.menu.MenuComponent);

Wlj.widgets.search.menu.MenuProxy = Ext.extend(Object, {
	
	constructor : function(tile, config){
    	this.menu = tile;
    	this.id = this.menu.id +'-ddproxy';
    	Ext.apply(this, config);        
	},
	/**
	 * true:拖动的时候在容器内插入代理的节点；false：不插入。
	 */
	insertProxy : false,
    setStatus : Ext.emptyFn,
    reset : Ext.emptyFn,
    update : Ext.emptyFn,
    stop : Ext.emptyFn,
    sync: Ext.emptyFn,
    
    getEl :  function(){
		return this.ghost;
	},
	getGhost : function(){
		return this.ghost;
	},
	getProxy : function(){
		return this.proxy;
	},
	hide : function(){
		if(this.ghost){
			if(this.proxy){
				this.proxy.remove();
				delete this.proxy;
			}
			this.ghost.remove();
			delete this.ghost;
		}
	},
	show : function(){
		if(!this.ghost){
			this.ghost = this.menu.createGhost(this.menu.initialConfig.cls, undefined, Ext.getBody());
			this.ghost.setXY(this.menu.el.getXY());
		}
	},
	repair : function(xy, callback, scope){
		this.hide();
		if(typeof callback == 'function'){
			callback.call(scope || this);
		}
	},
	moveProxy : function(parentNode, before){
	}
});

Wlj.widgets.search.menu.MenuItem.DD = Ext.extend(Ext.dd.DragSource, {
	constructor : function(tile, cfg){
		this.menu = tile;
		this.dragData = {menu : tile};
		this.proxy = new Wlj.widgets.search.menu.MenuProxy(tile, cfg);
		Wlj.widgets.search.menu.MenuItem.DD.superclass.constructor.call(this, tile.el, cfg);
		var h = tile.header,
		
			el = tile.el;
		if(h){
			this.setHandleElId(h.id);
			el = tile.header;
		}
		this.scroll = false;
	},
	showFrame: Ext.emptyFn,
    startDrag: Ext.emptyFn,
    b4StartDrag : function(x, y){
		this.proxy.show();
		this.menu.appObject.menuItem.hide();
	},
	b4MouseDown : function(e){
		var x = e.getPageX(),
			y = e.getPageY();
		this.autoOffset(x, y);
	},
	onInitDrag : function(x, y){
		this.onStartDrag(x, y);
		return true;
	},
	createFrame : Ext.emptyFn,
	getDragEl : function(e){
		return this.proxy.ghost.dom;
	},
	endDrag : function(e){
		this.proxy.hide();
		this.menu.el.dom.style.visibility = "";
	},
	autoOffset : function(x, y){
		x -= this.startPageX;
		y -= this.startPageY;
		this.setDelta(x, y);
	},
	onDrag : function(e){
	}
});Ext.ns('Wlj.widgets.search.window');
Wlj.widgets.search.window.TaskBar = Ext.extend(Ext.Container,{
	autoEl:{
		tag : 'div',
		cls : 'main_task'
	},
	windowManager : new Ext.WindowGroup(),
	containerTemplate : new Ext.XTemplate(
			'<div class=main_task_div >',
				'<div class=task_box >',
				'</div>',
			'</div>'),
	onRender : function(ct, position){
		Wlj.widgets.search.window.TaskBar.superclass.onRender.call(this, ct, position);
		this.containerEl = this.containerTemplate.append(this.el);
		var _this = this;
		this.el.on('contextmenu',function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
		
	},
	getLayoutTarget : function(){
		return this.containerEl;
	},
	openWindow : function(cfg){
		var tid = cfg.id;
		var task = this.getTaskByTaskId(tid);
		
		if(task){
			task.select();
		}else {
			this.add(new Wlj.widgets.search.window.TaskItem(Ext.apply(cfg,{
				appObject : this.appObject,
				height : this.height-2
			})));
			this.doLayout();
		}
	},
	getTaskByTaskId : function(taskId){
		var task = this.items.get(taskId);
		return task ? task:false;
	},
	closeAll : function(){
		this.items.each(function(i){
			i.close();
		});
	},
	closeWithOutCurrent : function(){
		var _this = this;
		this.items.each(function(i){
			if(i!==_this.currentItem){
				i.close();
			}
		});
	},
	closeWithOut : function(theItem){
		var _this = this;
		this.items.each(function(i){
			if(i!==theItem){
				i.close();
			}
		});
	},
	onContextMenu : function(e, added){
		var tbarMenu = Wlj.search.App.CONTEXT_MENU.TASK_BAR;
		if(added.length>0 && tbarMenu.length>0){
			added.push('-');
		}
		var _this = this;
		if(tbarMenu.length>0){
			Ext.each(tbarMenu, function(tm){
				if(!tm.handler)
					tm.handler = tm.fn.createDelegate(_this);
				added.push(tm);
			});
		}
		this.appObject.onContextMenu(e, added);
	}
});
Ext.reg('taskbar', Wlj.widgets.search.window.TaskBar);
Wlj.widgets.search.window.TaskItem = Ext.extend(Ext.BoxComponent,{
	name : '任务1',
	action : 'aaaa',
	minisized : false,
	serviceObject :false,
	autoEl : {
		tag : 'div',
		cls : 'task_normal'
	},
	taskTemplate : new Ext.XTemplate(
			'<div class=bg>',
				'<p>',
					'<a title={taskName} class=tab href="javascript:void(0);" >',
						'{taskName}',
					'</a>',
				'</p>',
			'</div>'),
	closeTemplate : new Ext.XTemplate('<div class=close />'),
	initComponent : function(){
		Wlj.widgets.search.window.TaskItem.superclass.initComponent.call(this);
		Wlj.TaskMgr.addTask(this);
		if(this.serviceObject){
			this.serviceObject.paddingFlag(true);
		}
	},
	onRender : function(ct, position){
		Wlj.widgets.search.window.TaskItem.superclass.onRender.call(this, ct, position);
		var _this = this;
		var innerEl = this.taskTemplate.append(this.el,{
			taskName : this.name
		});
		this.createWindow();
		this.select(function(){
			_this.creativeCb();
		});
		this.el.on('click',function(){
			_this.itemClick();
		});
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
	},
	createWindow : function(){
		var _this = this;
		this.windowObject = new Wlj.widgets.search.window.Window({
			id : 'window' + this.resId,
			maximizable : true,
			manager : this.ownerCt.windowManager,
			resizable : true,
			minimizable : true,
			top:200,
			left:200,
			height : 400,
			width : 700,
			taskObject : this,
			appObject : this.appObject
		});
	},
	creativeCb : function(){
		this.windowObject.maximize();
		var url = this.builtfunctionurl();
		this.frame = this.windowObject.body.createChild({
			tag : 'iframe',
			style : {
				width:'100%',
				height:'100%',
				border:'none'
			},
			src : url
		});
		Wlj.TaskMgr.toFront();
	},
	builtfunctionurl : function(){
		var url = false;
		if(this.action.indexOf('.jnlp') > 0){//luyy 2014-06-10日修改以加载流程配置页面
			url = this.action.split('.jnlp')[0]+'.jnlp';
		}else if(this.action.indexOf('http://')>=0 ){
			return this.action;
		}
		else if(this.action.indexOf('.jsp') < 0 ){
			url = basepath + '/contents/frameControllers/wlj-function.jsp';
		}else{
			url = this.action.split('.jsp')[0]+'.jsp';
		}
		var turl = this.action.indexOf('?')>=0 ? this.action + '&resId='+this.resId : this.action + '?resId='+this.resId ;
		url += '?' + turl.split('?')[1];
//		_APP.reqIndex ++;
//		_secseq = __secseed + (__secsalt * _APP.reqIndex);
//		url += url.indexOf('?'>=0) ? '&sechand='+_secseq : '?sechand=' + _secseq;
		return url;
	},
	select : function(callback){
		this.minisized = false;
		if(this.ownerCt.currentItem){
			this.ownerCt.currentItem.el.removeClass('task_active');
		}
		this.ownerCt.currentItem = this;
		this.el.addClass('task_active');
		this.windowObject.show(this.el,callback);
		this.ownerCt.windowManager.bringToFront(this.windowObject) ;
	},
	blur : function(){
		this.el.removeClass('task_active');
		this.windowObject.setActive(false);
	},
	close : function(){
		this.windowObject.close();
	},
	closeOthers : function(){
		this.ownerCt.closeWithOut(this);
	},
	removeFromManager : function(){
		if(this.serviceObject){
			this.serviceObject.paddingFlag(false);
		}
		Wlj.TaskMgr.removeTask(this);
		this.ownerCt.remove(this);
	},
	itemClick : function(){
		if(this.minisized || this.windowObject !== this.windowObject.manager.getActive() ){
			this.select();
		}else{
			this.minisize();
		} 
	},
	windowClick : function(){
		this.select();
	},
	minisize : function(){
		this.minisized = true;
		this.windowObject.hide(this.el);
		this.el.removeClass('task_active');
	},
	maxisize : function(){
		this.select();
		this.windowObject.maximize();
	},
	reload : function(){
		var url = this.builtfunctionurl();
		this.frame.dom.src = url;
	},
	destroy : function(){
		this.frame.dom.src = '';
		this.el.removeAllListeners();
		this.el.remove();
		delete this.frame;
		Wlj.widgets.search.window.TaskItem.superclass.destroy.call(this);
	},
	onContextMenu : function(e, added){
		var _this = this;
		var taskMenu = Wlj.search.App.CONTEXT_MENU.TASK_ITEM;
		if(added.length>0 && taskMenu.length>0){
			added.push('-');
		}
		if(taskMenu.length>0){
			Ext.each(taskMenu, function(tm){
				tm.handler = tm.fn.createDelegate(_this);
				added.push(tm);
			});
		}
		this.ownerCt.onContextMenu(e, added);
	}
});
Ext.reg('taskitem', Wlj.widgets.search.window.TaskItem);

Wlj.widgets.search.window.Window = Ext.extend(Ext.Window, {
	guardCfg : {
	},
	guardStyle : {
		backgroundColor : '#000',
		width : '100px',
		height : '20px'
	},
	fitContainer : function(){
        var vs = this.container.getViewSize(false);
        this.setSize(vs.width, vs.height - this.appObject.taskBar.height);
    },
	onRender : function(ct, position){
		Wlj.widgets.search.window.Window.superclass.onRender.call(this, ct, position);
		this.windowBar = new Wlj.widgets.search.window.WindowBar({
			appObject : this.appObject,
			windowObject : this
		});
		this.windowBar.render(this.header.dom);
	},
	listeners : {
		activate : function(window){
    		window.taskObject.windowClick();
    	},
    	close : function(window){
    		window.taskObject.removeFromManager();
			return false;
    	},
    	minimize : function(window){
    		window.taskObject.minisize();
    	}
    },
    destroy : function(){
    	this.windowBar.destroy();
    	delete this.windowBar;
    	Wlj.widgets.search.window.Window.superclass.destroy.call(this);
    }
});
Ext.reg('wljwindow', Wlj.widgets.search.window.Window);

Wlj.widgets.search.window.WindowBar = Ext.extend(Ext.Toolbar, {
	toolbarCls : 'x-toolbar x-windowbar',
	hideBorders : true,
	initComponent : function(){
		Wlj.widgets.search.window.WindowBar.superclass.initComponent.call(this);
		this.createInnerMenuItem();
	},
	onRender : function(ct, position){
		Wlj.widgets.search.window.WindowBar.superclass.onRender.call(this,ct, position);
	},
	buildInnerMenu : function(){
		var _this = this;
		if(!window.windowRoot){
			var roots= this.appObject.createRootMenuCfg();
			Ext.each(roots,function(r){
				delete r.id;
				r.text = r.NAME;
				r.menu = [];
				r._windowObject = _this.windowObject;
				r.xtype = 'wljinnermenuitem';
			});
			window.windowRoot = roots;
		}
		this.add({
			text : '系统菜单',
			cls:'simple-btn1',
			overCls:'simple-btn1-hover',
			plain:true,
			appObject : _this.appObject,
			menu:{
				items : window.windowRoot
			}
		},{
			xtype: 'tbseparator'
		});
	},
	buildComsits : function(){
		var _this = this;
		var comsits = '';
		if(!_this.windowObject.taskObject.serviceObject){
			comsits = false;
		}else{
			comsits = _this.windowObject.taskObject.serviceObject.menuData.COMSITS;
		}
		var hasCom = comsits ? false : true;
		var comsitsMenus = [];
		if(!hasCom){
			Ext.each(comsits.split(','),function(mid){
				var cService = Wlj.ServiceMgr.findServiceByID(mid);
				if(cService && cService.menuData){
					var cMenu = {};
					Ext.apply(cMenu,cService.menuData);
					cMenu.name = cMenu.NAME;
					cMenu.isLeaf = true;
					cMenu.action = cMenu.ACTION;
					cMenu.appObject = _this.appObject;
					cMenu.text = cMenu.NAME;
					cMenu._windowObject = _this.windowObject;
					cMenu.xtype = "wljinnermenuitem";
					comsitsMenus.push(cMenu);
				}
			});
			this.add({
				text : '相关功能',
				cls:'simple-btn1',
				overCls:'simple-btn1-hover',
				hidden : hasCom,
				menu : {
					items : comsitsMenus
				}
			},{
				xtype: 'tbseparator'
			});
		}
		delete comsitsMenus;
	},
	createInnerMenuItem : function(){
		if(APPUTIL.menuInWindow){
			this.buildInnerMenu();
		}
		if(APPUTIL.buildComsits){
			this.buildComsits();
		}
		this.add(Wlj.search.App.TASKEXTENSION);
	}
});
Ext.reg('wljwindowbar', Wlj.widgets.search.window.Window);

Wlj.widgets.search.window.InnerMenu = Ext.extend(Ext.menu.Item ,{
	windowObject : false,
	initComponent : function(){
		var roots= this.appObject.createSubMenuCfg(this.ID);
		var _this = this;
		Ext.each(roots,function(r){
			r.id = r.id+'_innermenu_'+_this.id;
			r.text = r.NAME;
			r.menu = [];
			r._windowObject = _this._windowObject;
			r.xtype = 'wljinnermenuitem';
		});
		this.menu = this.isLeaf ? false : roots;
		Wlj.widgets.search.window.InnerMenu.superclass.initComponent.call(this);
	},
	handler : function(){
		if(this.ACTION){
			Wlj.ServiceMgr.findServiceByID(this.ID).execute();
		}
	}
});
Ext.reg('wljinnermenuitem', Wlj.widgets.search.window.InnerMenu);Ext.ns('Wlj.widgets.search.service');

Wlj.widgets.search.service.PageService = function(menuData){
	this.menuData = menuData;
	Wlj.widgets.search.service.PageService.superclass.constructor.call(this, this.createActionCfg());
	this.id = 'service_'+this.menuData.ID;
	Wlj.ServiceMgr.addService(this);
};

Ext.extend(Wlj.widgets.search.service.PageService, Ext.Action, {
	serviceItem : false,
	createActionCfg : function(){
		var config = {};
		config.itemId = 'service_'+this.menuData.ID;
		config.text = this.menuData.NAME;
		config.handler = Ext.emptyFn;
		return config;
	},
	execute : function(){
		var taskAction = this.menuData.ACTION.indexOf('http://')>=0 ? this.menuData.ACTION : (basepath + this.menuData.ACTION);
		var taskId = 'task_'+this.menuData.ID;
		if('1'== this.menuData.ISSAMEWIN){
			window.open(taskAction, taskId);
		}else{
			_APP.openWindow({
				name : this.menuData.NAME,
				action : taskAction,
				resId : this.menuData.ID,
				id : taskId,
				serviceObject : this
			});
		}
    },
    paddingFlag : function(flag){
    	this.serviceItem.paddingFlag(flag);
    }
});


Wlj.widgets.search.service.PageServiceItem = Ext.extend(Wlj.widgets.search.tile.Tile, {
	serviceObject : false,
	removeable : false,
	baseSize : 64,
	baseMargin : 3,
	cls : 'tile_c1',
	position:'relative',
	float : 'left',
	dragable : false,
	initComponent : function(){
		Wlj.widgets.search.service.PageServiceItem.superclass.initComponent.call(this);
		if(!this.serviceObject){
			return false;
		}
		this.html=this.serviceObject.menuData.NAME;
		this.serviceObject.serviceItem = this;
	},
	paddingFlag : function(flag){
		if(flag){
			this.cls = '';
			if(this.el){
				this.el.removeClass('tile_c1');
			}
		}else{
			this.cls = 'tile_c1';
			if(this.el){
				this.el.addClass('tile_c1');
			}
		}
	}
});


Wlj.widgets.search.service.PageServiceContainer = Ext.extend(Ext.Container, {
	autoEl : {
		tag : 'div',
		style : {
			height:'100%'
		}
	}
});

Wlj.widgets.search.service.DataService = Ext.extend(Ext.Action,{
	constructor : function(cfg){
		Wlj.widgets.search.service.DataService.superclass.constructor.call(this, cfg);
	},
	execute : function(){
		
	}
});
Ext.ns('Wlj.widgets.search.plugin');
Wlj.widgets.search.plugin.ExtraTileCfg = {};
Wlj.widgets.search.plugin.ExtraTileContainer = Ext.extend(Ext.Container, {
	autoEl : {
		tag : 'div',
		cls : 'yc-chartContainer yc-chartList'
	},
	layout: 'column',
    defaults: {
        columnWidth: 0.5
    },
	onRender : function(ct, position){
		Wlj.widgets.search.plugin.ExtraTileContainer.superclass.onRender.call(this, ct, position);
		this.el.applyStyles({
			zIndex : 15000
		});
	},
	afterRender : function(){
		Wlj.widgets.search.plugin.ExtraTileContainer.superclass.afterRender.call(this);
		this.loadCfg();
		this.doLayout();
	},
	/**
	 * @override
	 */
	loadCfg : function(){
		/**
		 * TODO load the items from CFG, and init the special dragsources.
		 */
	}
});

Wlj.widgets.search.plugin.ExtraItem = Ext.extend(Ext.Container, {
	autoEl : {
		tag : 'div'
	},
	jsUrl : false,
	sizeCode : false,
	appObject : false,
	chartTpl : new Ext.XTemplate('<div class="yc-chartDiv" title="{moduleName}">{moduleName}</div>'),
	
	initComponent : function(){
		Wlj.widgets.search.plugin.ExtraItem.superclass.initComponent.call(this);
		if(this.sizeCode){
			this.tileSize = this.appObject.translateSize(this.sizeCode);
		}
	},
	onRender : function(ct, position){
		Wlj.widgets.search.plugin.ExtraItem.superclass.onRender.call(this, ct, position);
		this.chartTpl.append(this.el,{
			moduleName : this.moduleName
		});
		this.createDD();
	},
	
	createTileCfg : function(pos){
		var cfg = {};
		cfg.jsUrl = this.jsUrl;
		cfg.pos_size = {};
		Ext.apply(cfg.pos_size,this.tileSize);
		cfg.pos_size.TX = pos.POS_X;
		cfg.pos_size.TY = pos.POS_Y;
		cfg.appObject = this.appObject;
		cfg.menuData = false;
		cfg.tileManaged = true;
		cfg.tileSize = this.sizeCode;
		
		cfg.baseWidth = this.appObject.defaultIndexTileWidthUnit;
		cfg.baseHeight = this.appObject.defaultIndexTileHeightUnit;
		cfg.baseMargin = this.appObject.defaultIndexTileMarginUnit;
		cfg.ownerW = this.appObject.defaultTileGroupOwnerW;
		cfg.ownerH = this.appObject.defaultTileGroupOwnerH;
		
		cfg.tileLogo = 'ico-t-'+Math.floor(Math.random()*100+1);
		cfg.tileColor = 'tile_c'+Math.floor(Math.random()*10+1);
		cfg.autoEl = {
			tag:'div',
			cls : 'tile '+ cfg.tileColor
		};
		return cfg;
	},
	createGhost : function(cls, useShim, appendTo){
		var size = this.tileSize?this.tileSize : {TW:1,TH:1};
		var TW = size.TW;
		var TH = size.TH;
		var el = document.createElement('div');
		var widthUnit = this.appObject.defaultIndexTileWidthUnit;
		var heightUnit = this.appObject.defaultIndexTileHeightUnit;
		var marginUnit = this.appObject.defaultIndexTileMarginUnit;
		el.style.width = TW*widthUnit+8*(TW-1);
		el.style.height = TH*heightUnit+8*(TH-1);
		el.className = 'x-panel-ghost ' + (cls ? cls : '');
		if(this.header){
			el.appendChild(this.tileTemplate.apply());
		}
		Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(TH*heightUnit+marginUnit*2*(TH-1));
		el.style.width = TW*widthUnit+marginUnit*2*(TW-1) + 'px';
		if(!appendTo){
			this.container.dom.appendChild(el);
		}else{
			Ext.getDom(appendTo).appendChild(el);
		}
		if(useShim !== false && this.el.shim !== false){
			var layer = new Ext.Layer({shadow:false, useDisplay:true, constrain:false}, el);
			layer.show();
			return layer;
		}else{
			return new Ext.Element(el);
		}
	
	},
	createDD : function(){
		this.dd = new Wlj.widgets.search.plugin.ExtraItem.DD(this, {
			ddGroup: 'tileDrop'
		});
	}
});
Wlj.widgets.search.plugin.ExtraItem.ExtraProxy = Ext.extend(Object, {
	
	constructor : function(extra, config){
    	this.plugin = extra;
    	this.id = this.plugin.id +'-ddproxy';
    	Ext.apply(this, config);        
	},
	/**
	 * true:拖动的时候在容器内插入代理的节点；false：不插入。
	 */
	insertProxy : false,
    setStatus : Ext.emptyFn,
    reset : Ext.emptyFn,
    update : Ext.emptyFn,
    stop : Ext.emptyFn,
    sync: Ext.emptyFn,
    
    getEl :  function(){
		return this.ghost;
	},
	getGhost : function(){
		return this.ghost;
	},
	getProxy : function(){
		return this.proxy;
	},
	hide : function(){
		if(this.ghost){
			if(this.proxy){
				this.proxy.remove();
				delete this.proxy;
			}
			this.ghost.remove();
			delete this.ghost;
		}
	},
	show : function(){
		if(!this.ghost){
			this.ghost = this.plugin.createGhost(this.plugin.initialConfig.cls, undefined, Ext.getBody());
			this.ghost.setXY(this.plugin.el.getXY());
		}
	},
	repair : function(xy, callback, scope){
		this.hide();
		if(typeof callback == 'function'){
			callback.call(scope || this);
		}
	},
	moveProxy : function(parentNode, before){
	}
});

Wlj.widgets.search.plugin.ExtraItem.DD = Ext.extend(Ext.dd.DragSource, {
	constructor : function(extra, cfg){
		this.plugin = extra;
		this.dragData = {plugin : extra};
		this.proxy = new Wlj.widgets.search.plugin.ExtraItem.ExtraProxy(extra, cfg);
		Wlj.widgets.search.plugin.ExtraItem.DD.superclass.constructor.call(this, extra.el, cfg);
		var h = extra.header,
			el = extra.el;
		if(h){
			this.setHandleElId(h.id);
			el = extra.header;
		}
		this.scroll = false;
	},
	showFrame: Ext.emptyFn,
    startDrag: Ext.emptyFn,
    b4StartDrag : function(x, y){
		this.proxy.show();
		
		///this.plugin.appObject.menuItem.hide();
	},
	b4MouseDown : function(e){
		var x = e.getPageX(),
			y = e.getPageY();
		this.autoOffset(x, y);
	},
	onInitDrag : function(x, y){
		this.onStartDrag(x, y);
		return true;
	},
	createFrame : Ext.emptyFn,
	getDragEl : function(e){
		return this.proxy.ghost.dom;
	},
	endDrag : function(e){
		this.proxy.hide();
		this.plugin.el.dom.style.visibility = "";
	},
	autoOffset : function(x, y){
		x -= this.startPageX;
		y -= this.startPageY;
		this.setDelta(x, y);
	},
	onDrag : function(e){
	}
});
var indexTileExtraData = [{
	moduleId : 'md-112440',
	moduleName : '机构存款趋势图',
	jsUrl : '/contents/pages/wlj/individualManager/orgDepMonth.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-112442',
	moduleName : '机构存款趋势图30天',
	jsUrl : '/contents/pages/wlj/individualManager/orgDepDay.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-112444',
	moduleName : '机构贷款趋势图',
	jsUrl : '/contents/pages/wlj/individualManager/orgCreMonth.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-112450',
	moduleName : '机构贷款趋势图30天',
	jsUrl : '/contents/pages/wlj/individualManager/orgCreDay.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-112633',
	moduleName : '机构资金净流出TOP10',
	jsUrl : '/contents/pages/wlj/individualManager/orgCustOutcomeTopN.js',
	sizeCode : 'TS_01',
	menuData : false
},{
	moduleId : 'md-112687',
	moduleName : '机构存款客户TOP10',
	jsUrl : '/contents/pages/wlj/individualManager/orgCustDepTopN.js',
	sizeCode : 'TS_01',
	menuData : false
},{
	moduleId : 'md-112689',
	moduleName : '机构贷款客户TOP10',
	jsUrl : '/contents/pages/wlj/individualManager/orgCustCreTopN.js',
	sizeCode : 'TS_01',
	menuData : false
},{
	moduleId : 'md-112691',
	moduleName : '机构资金净流入TOP10',
	jsUrl : '/contents/pages/wlj/individualManager/orgCustIncomeTopN.js',
	sizeCode : 'TS_01',
	menuData : false
},{
	moduleId : 'md-112799',
	moduleName : '机构客户数',
	jsUrl : '/contents/pages/wlj/individualManager/orgCustNum.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-112801',
	moduleName : '客户经理客户数',
	jsUrl : '/contents/pages/wlj/individualManager/mgrCustNum.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-112861',
	moduleName : '机构贡献度时点占比',
	jsUrl : '/contents/pages/wlj/individualManager/orgContribute.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-112864',
	moduleName : '客户经理贡献度占比',
	jsUrl : '/contents/pages/wlj/individualManager/mgrContribute.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-113361',
	moduleName : '机构贡献度连续12个月',
	jsUrl : '/contents/pages/wlj/individualManager/orgContributeMonth.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-113363',
	moduleName : '客户经理贡献度连续12个月',
	jsUrl : '/contents/pages/wlj/individualManager/mgrContributeMonth.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-113893',
	moduleName : '机构可发贵宾卡客户',
	jsUrl : '/contents/pages/wlj/individualManager/orgCanCard.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-113895',
	moduleName : '客户经理可发贵宾卡客户',
	jsUrl : '/contents/pages/wlj/individualManager/mgrCanCard.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-113897',
	moduleName : '机构持有贵宾卡客户',
	jsUrl : '/contents/pages/wlj/individualManager/orgHoldCard.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-113899',
	moduleName : '客户经理持有贵宾卡客户',
	jsUrl : '/contents/pages/wlj/individualManager/mgrHoldCard.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114080',
	moduleName : '机构存款产品占比（时点）',
	jsUrl : '/contents/pages/wlj/individualManager/orgDepRate.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114082',
	moduleName : '机构存款产品占比（月均）',
	jsUrl : '/contents/pages/wlj/individualManager/orgDepRateMonth.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114084',
	moduleName : '机构贷款产品占比（时点）',
	jsUrl : '/contents/pages/wlj/individualManager/orgCreRate.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114086',
	moduleName : '机构贷款产品占比（月均）',
	jsUrl : '/contents/pages/wlj/individualManager/orgCreRateMonth.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114088',
	moduleName : '客户经理存款产品占比（时点）',
	jsUrl : '/contents/pages/wlj/individualManager/mgrDepRate.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114090',
	moduleName : '客户经理存款产品占比（月均）',
	jsUrl : '/contents/pages/wlj/individualManager/mgrDepRateMonth.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114092',
	moduleName : '客户经理贷款产品占比（时点）',
	jsUrl : '/contents/pages/wlj/individualManager/mgrCreRate.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114094',
	moduleName : '客户经理贷款产品占比（月均）',
	jsUrl : '/contents/pages/wlj/individualManager/mgrCreRateMonth.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-114122',
	moduleName : '机构贷款客户增长TOP10',
	jsUrl : '/contents/pages/wlj/individualManager/orgCreAddTopN.js',
	sizeCode : 'TS_01',
	menuData : false
},{
	moduleId : 'md-114124',
	moduleName : '机构贷款客户减少TOP10',
	jsUrl : '/contents/pages/wlj/individualManager/orgCreSubTopN.js',
	sizeCode : 'TS_01',
	menuData : false
},{
	moduleId : 'md-114126',
	moduleName : '机构存款流入客户TOP10',
	jsUrl : '/contents/pages/wlj/individualManager/orgDepAddTopN.js',
	sizeCode : 'TS_01',
	menuData : false
},{
	moduleId : 'md-114128',
	moduleName : '机构存款流出客户TOP10',
	jsUrl : '/contents/pages/wlj/individualManager/orgDepSubTopN.js',
	sizeCode : 'TS_01',
	menuData : false
},{
	moduleId : 'md-117179',
	moduleName : '客户经理所辖客户等级占比',
	jsUrl : '/contents/pages/wlj/individualManager/mgrCustLevelRate.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-117170',
	moduleName : '机构所辖客户等级占比',
	jsUrl : '/contents/pages/wlj/individualManager/orgCustLevelRate.js',
	sizeCode : 'TS_03',
	menuData : false
},{
	moduleId : 'md-117171',
	moduleName : '客户分布(对公)',
	jsUrl : '/contents/pages/wlj/productManager/custProductflow.js',
	sizeCode : 'TS_00',
	menuData : false
},{
	moduleId : 'md-117172',
	moduleName : '客户分布(对私)',
	jsUrl : '/contents/pages/wlj/productManager/custProductflowPer.js',
	sizeCode : 'TS_00',
	menuData : false
}];


var indexTileExtra = Ext.extend(Wlj.widgets.search.plugin.ExtraTileContainer, {
	loadCfg : function(){
		var _this = this;
		Ext.each(indexTileExtraData, function(ited){
			//if(JsContext.checkGrant(ited.moduleId)){
				ited.appObject = _this.appObject;
				_this.add(new indexTileExtraItem(ited));
			//}
		});
	}
});

var indexTileExtraItem = Ext.extend(Wlj.widgets.search.plugin.ExtraItem, {
	tileManaged : true
});Ext.ns('Wlj.widgets.views.index.grid');
Wlj.widgets.views.index.grid.TileGrid = Ext.extend(Ext.DataView, {
	dataSize : 7,
	title : 'TileGrid',
	root : 'json.data',
	columns : false,
	url : false,
	emptyText : 'sfd',
	exceptionText : '数据服务异常',
	itemSelector : 'div.w2h2',
	emptyInnerText : '暂无数据',
	initComponent : function(){
		var columns = this.columns;
		var fileds = [];
		var idProperty = false;
		var _this = this;
		Ext.each(columns, function(col){
			fileds.push(col.columnName);
			if(col.key === true){
				idProperty = col.columnName;
			}
			if(col.convert){
				fileds.push({name:col.columnName,convert:col.convert});
			}else{
				fileds.push(col.columnName);
			}
		});
		if(this.url && this.columns){
			this.store = new Ext.data.JsonStore({
				autoDestroy : true,
				url : this.url,
				root : this.root,
				restful : true,  
				idProperty : idProperty,
				fields : fileds,
				listeners :  {
					exception : function(misc){
						_this.exceptionTpl.append(_this.el);
					}
				}
			});
		}else {
			this.store = new Ext.data.ArrayStore({
			    autoDestroy: true,
			    fields: [
			       'company'
			    ]
			});
		}
		this.createTemplate();
		this.createExceptionTempalte();
		this.emptyTextCreate();
		Wlj.widgets.views.index.grid.TileGrid.superclass.initComponent.call(this);
	},
	createExceptionTempalte : function(){
		var _this = this;
		var templateString = '';
		templateString += '<div class="w2h2" >';
		templateString += this.titleHTML();
		templateString += '<div class="tile_notice_list tile_content">';
		templateString += '<ul class="in_sys_ul">';
		templateString += '<li>';
		templateString += '<div class="in_sys_line">';
		templateString += '<p class="in_sys_p">';
		templateString += '<span class="time">';
		templateString += this.exceptionText;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		templateString += '</li>';
		templateString += '</ul>';
		templateString += '</div>';
		templateString += '</div>';
		this.exceptionTpl = new Ext.XTemplate(templateString);
	},
	emptyTextCreate : function(){
		var _this = this;
		var title = _this.title;
		var templateString = '';
		templateString += '<div class="w2h2" >';
		templateString += this.titleHTML();
		templateString += '<div class="tile_notice_list tile_content">';
		templateString += '<ul class="in_sys_ul">';
		templateString += '<li>';
		templateString += '<div class="in_sys_line">';
		templateString += '<p class="in_sys_p">';
		templateString += '<span class="time">';
		templateString += this.emptyInnerText;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		templateString += '</li>';
		templateString += '</ul>';
		templateString += '</div>';
		templateString += '</div>';
		this.emptyText = templateString;
	},
	titleHTML : function(){
		var _this = this;
		var title = this.title;
		var templateString = '';
		templateString += '<div class="tile_tip_tit" >';
		templateString += '<p class="tit" >';
		templateString += '<span class=icon>';
		templateString += title;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		return templateString;
	},
	createTemplate : function(){
		var _this = this;
		var title = _this.title;
		var columns = this.columns;
		var showColumns = [];
		
		var templateString = '';
		templateString += '<div class="w2h2" >';
		templateString += this.titleHTML();
		/***************************body***************************/
		if(this.url && this.columns){
			Ext.each(columns, function(col){
				if(col.show){
					showColumns.push(col);
				}
			});
			templateString += '<div class="tile_notice_list tile_content">';
			templateString += '<ul class="in_sys_ul">';
			templateString += '<tpl for=".">';
			templateString += '<li>';
			templateString += '<div class="in_sys_line">';
			templateString += '<p class="in_sys_p">';
			templateString += '<span class="time">';
			var date = showColumns.shift();
			templateString += '{'+date.columnName+'}';
			templateString += '</span>';
			templateString += '<span class="type_red">';
			templateString += '</span>';
			var title = showColumns.shift();
			if(title && title.columnName){
				templateString += '<a title="{'+title.columnName+'}" href="javascript:void(0);" class="tit">';
				templateString += '{'+title.columnName+'}';
				templateString += '</a>';
			}
			templateString += '</p>';
			templateString += '</div>';
			templateString += '</li>';
			templateString += '</tpl>';
			templateString += '</ul>';
			templateString += '</div>';
		}
		templateString += '</div>';
		this.tpl = new Ext.XTemplate(templateString);
	},
	listeners : {
		afterrender : function(){
			if(this.url && this.columns){
				Wlj.TileMgr.addDataCfg({
					controlPanel : this,
					store : this.store
				});
			} else {
				this.tpl.append(this.el);
			}
			var _this = this;
			this.el.on('click',function(){
				_this.ownerCt.clickFire();
			});
		}
	}
});

/**
 * 首页3X3表格
 * eg.
 * var grid = new Wlj.widgets.views.index.grid.MaxTileGrid({
 *		needheader :true,
 *		dataSize : 10,
 *		title : '机构贷款客户增长TOP10',
 *		url : basepath+'/orgCreAddTopN.json',
 *		columns : [
 *			{header : '客户号',columnName : 'CUST_ID',show : true},
 *			{header : '客户名称',columnName : 'CUST_NAME',show : true,width : 148},
 *			{header : '贷款时点余额（折人民币）',columnName : 'BAL',show : true,align : 'right',convert : money('0,0.00')}
 *		]
 *	});
 *
 * @class Wlj.widgets.views.index.grid.MaxTileGrid
 * @extends Ext.DataView
 */
Wlj.widgets.views.index.grid.MaxTileGrid = Ext.extend(Ext.DataView, {
	needheader :false,
	dataSize : 7,
	title : 'MaxTileGrid',
	root : 'json.data',
	columns : false,
	url : false,
	emptyText : 'sfd',
	exceptionText : '数据服务异常',
	emptyInnerText : '暂无数据',
	itemSelector : 'div.w3h3',
	initComponent : function(){
		var columns = this.columns;
		var fileds = [];
		var idProperty = false;
		Ext.each(columns, function(col){
			if(col.key === true){
				idProperty = col.columnName;
			}
			if(col.convert){
				fileds.push({name:col.columnName,convert:col.convert});
			}else{
				fileds.push(col.columnName);
			}
		});
		if(this.url && this.columns){
			this.store = new Ext.data.JsonStore({
				autoDestroy : true,
				url : this.url,
				root : this.root,
				restful : true,  
				idProperty : idProperty,
				fields : fileds,
				listeners :  {
					exception : function(misc){
						_this.exceptionTpl.append(_this.el);
					}
				}
			});
		}else {
			this.store = new Ext.data.ArrayStore({
			    autoDestroy: true,
			    fields: [
			       'company'
			    ]
			});
		}
		this.createTemplate();
		this.createExceptionTempalte();
		this.emptyTextCreate();
		Wlj.widgets.views.index.grid.MaxTileGrid.superclass.initComponent.call(this);
	},
	titleHTML : function(){
		var _this = this;
		var title = this.title;
		var templateString = '';
		templateString += '<div class="tile_grid_tit" >';
		templateString += '<p class="tit" >';
		templateString += '<span class=icon>';
		templateString += title;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		return templateString;
	},
	createExceptionTempalte : function(){
		var _this = this;
		var templateString = '';
		templateString += '<div class="w3h3" >';
		templateString += this.titleHTML();
		templateString += '<div class="tile_grid_list tile_content">';
		templateString += '<ul class="in_sys_ul">';
		templateString += '<li>';
		templateString += '<div class="in_sys_line">';
		templateString += '<p class="in_sys_p">';
		templateString += '<span class="time">';
		templateString += this.exceptionText;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		templateString += '</li>';
		templateString += '</ul>';
		templateString += '</div>';
		templateString += '</div>';
		this.exceptionTpl = new Ext.XTemplate(templateString);
	},
	emptyTextCreate : function(){
		var _this = this;
		var title = _this.title;
		var templateString = '';
		templateString += '<div class="w3h3" >';
		templateString += this.titleHTML();
		templateString += '<div class="tile_grid_list tile_content">';
		templateString += '<ul class="in_sys_ul">';
		templateString += '<li>';
		templateString += '<div class="in_sys_line">';
		templateString += '<p class="in_sys_p">';
		templateString += '<span class="time">';
		templateString += this.emptyInnerText;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		templateString += '</li>';
		templateString += '</ul>';
		templateString += '</div>';
		templateString += '</div>';
		this.emptyText = templateString;
	},
	createTemplate : function(){
		var _this = this;
		var title = _this.title;
		var columns = this.columns;
		var showColumns = [];
		
		var templateString = '';
		templateString += '<div class="w3h3" >';
		/***************************title***************************/
		templateString += this.titleHTML();
		/***************************body***************************/
		if(this.url && this.columns){
			Ext.each(columns, function(col){
				col.width = col.width?col.width:100;
				col.align = col.align?col.align:'left';
				if(col.show){
					showColumns.push(col);
				}
			});
		
			templateString += '<div class="tile_grid_list tile_content" >';
			templateString += '<ul class="in_sys_ul">';
			
			if(this.needheader){
				templateString += '<li>';
				templateString += '<div class="in_sys_line">';
				templateString += '<p class="in_sys_p">';
				
				for(var i=0;i<showColumns.length;i++){
					var col = showColumns[i];
					if(i >0){
						templateString += '<span class="type_red"></span>';
					}
					if(col && col.header){
						templateString += '<a title="'+col.header+'" class="tit" style="width:'+col.width+'px;display:inline;">'+col.header+'</a>';
					}
				}
				templateString += '</p>';
				templateString += '</div>';
				templateString += '</li>';
			}
			
			templateString += '<tpl for=".">';
			templateString += '<li>';
			templateString += '<div class="in_sys_line">';
			templateString += '<p class="in_sys_p">';
			for(var i=0;i<showColumns.length;i++){
				var col = showColumns[i];
				if(i >0){
					templateString += '<span class="type_red"></span>';
				}
				if(col && col.columnName){
					templateString += '<a title="{'+col.columnName+'}" href="javascript:void(0);" class="tit" style="width:'+col.width+'px;display:inline;text-align:'+col.align+';">{'+col.columnName+'}</a>';
				}
			}
			templateString += '</p>';
			templateString += '</div>';
			templateString += '</li>';
			templateString += '</tpl>';
			templateString += '</ul>';
			templateString += '</div>';
				
		}
		templateString += '</div>';
		this.tpl = new Ext.XTemplate(templateString);
	},
	listeners : {
		afterrender : function(){
			if(this.url && this.columns){
				Wlj.TileMgr.addDataCfg({
					controlPanel : this,
					store : this.store
				});
			} else {
				this.tpl.append(this.el);
			}
			var _this = this;
			this.el.on('click',function(){
				_this.ownerCt.clickFire();
			});
		},
		beforedestroy : function(){
			var index = false;
			for(var i=0;i<Wlj.TileMgr.tilesData.getCount();i++){
				if(Wlj.TileMgr.tilesData.get(i).controlPanel === this){
					Wlj.TileMgr.tilesData.removeAt(i);
					return true;
				}
			}
			return true;
		}
	}
});
