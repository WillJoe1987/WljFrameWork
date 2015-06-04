Ext.ns('Wlj.search');

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
	_this.needSearchArea = APPUTIL.needSearchArea;
	_this.initMenus();
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
	this.thumberContainer = new Wlj.widgets.search.window.TaskThumberContainer({
		renderTo : Ext.getBody(),
		manager : this.taskBar.windowManager
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
/**
 * 展示某任务的数据缩略图，如该任务对象内部并没有启用略缩图插件，则无任何响应。
 * 具体开关见：Wlj-frame-function-app-cfg.js中pluginTrigger配置项
 * @param task
 * @return void
 */
Wlj.search.App.prototype.showTaskThumber = function(task){
	var thumbers = task.getGridThumber();
	if(!thumbers){
		return false;
	}
	this.thumberContainer.show();
	this.thumberContainer.toFront();
	this.thumberContainer.setTask(task);
};
/**
 * 隐藏略缩图窗口
 * @return
 */
Wlj.search.App.prototype.hideTaskThumber = function(){
	this.thumberContainer.hide();
};