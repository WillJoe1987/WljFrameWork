Ext.ns('Wlj.commonView');

Wlj.commonView = function(cfg) {
	var _this = this;
	if(cfg.headerData != null && cfg.headerData != '' && cfg.headerData != undefined && cfg.headerData != 'null' && cfg.headerData != 'undefined') {
		_this.headerData = cfg.headerData;
	}
	_this.contentData = cfg.contentData;
	_this.viewId = cfg.viewId;
	_this.viewType = cfg.viewType;
	_this.init();
	
	
};
Wlj.commonView.prototype.Msg = '视图基本信息加载失败';
Wlj.commonView.prototype.viewType = 'CUST';// 'CUST'：客户；'PROD'：产品视图
Wlj.commonView.prototype.viewId = false;// 'CUST'：客户；'PROD'：产品视图
Wlj.commonView.prototype.header = null;
Wlj.commonView.prototype.maxDetailNum = 3;
Wlj.commonView.prototype.detailWins = [];
Wlj.commonView.prototype.content = null;
Wlj.commonView.prototype.headerData = {};
Wlj.commonView.prototype.contentData = null;
Wlj.commonView.prototype.defaultBaseWidth = 159;
Wlj.commonView.prototype.defaultBaseHeight = 81;


/***
 * 视图初始化
 * @return
 */
Wlj.commonView.prototype.viewInit = function() {
	var _this = this;
	if (_this.viewType == 'CUST') {
		Ext.Ajax.request({
			url : basepath + '/PerCustomerBaseQueryAction.json?custId='+_custId,
			method : 'GET',
			success : function(response) {
				_this.headerData = Ext.util.JSON.decode(response.responseText).json.data[0];
				_this.init();
			},
			failure : function() {
				Ext.MessageBox.alert("提示", _this.Msg);
			}
		});
	} else if (_this.viewType == 'PROD') {
		//TODO 产品视图处理逻辑
		
	}
};
/***
 * 视图初始化
 * @return
 */
Wlj.commonView.prototype.init = function() {
	var _this = this;
	var bodysize = Ext.getBody().getViewSize();
	var tileWidth = parseInt((bodysize.width) / _this.defaultBaseWidth);
	_this.headerData.TW = tileWidth;
	_this.headerData.TH = 1;
	
	/**
	 * 初始化视图头部
	 */
	_this.header = new Wlj.commonView.header({
		bodysize : bodysize,
		height : 128,
		items : [headerData]
	});
	_this.addHeader();
	/**
	 * 初始化视图正文
	 */
	_this.content = new Wlj.commonView.content({
		bodysize : bodysize,
		contentWidth : tileWidth,
		width : bodysize.width,
		height : bodysize.height - 128	
	});
	for ( var i = 0; i < contentData.length; i++) {
		_this.addTile(contentData[i]);
	}
};
/***
 * 客户视图窗口大小变化时调用
 * @param viewport, adjWidth, adjHeight, rawWidth, rawHeight
 * @return
 */
Wlj.commonView.prototype.reSize = function(viewport, adjWidth, adjHeight, rawWidth, rawHeight) {
	var _this = this;
	if(adjWidth != 'auto') {
		_this.header.setWidth(adjWidth);
		_this.content.setWidth(adjWidth);
		_this.content.setHeight(adjHeight - _this.header.height);
	}
};
/***
 * 增加明细窗口
 * @param cfg 明细窗口配置信息
 * @return
 */
Wlj.commonView.prototype.addWin = function(cfg) {
	var _this = this;
	var win = new Wlj.commonView.detailWin();
	win.setTitle(cfg.tileName);
	_this.addDetailPanel(win , cfg.DETAIL_URL);
	win.doLayout();
	win.show();
	_this.detailWins.push(win);
};
/***
 * 
 * @param window 详细窗口
 * @param url 详细内容链接
 * @return
 */
Wlj.commonView.prototype.addDetailPanel = function(window, url) {
	
	window.detailUrl = url;
	if (url.indexOf('.jsp') < 0) {
		url = '/contents/frameControllers/plugin/customerView/view-function.jsp'
			+ '?url=' + url 
			+ '&viewId=' + this.viewId;
		window.add(new Ext.Panel({
			html : "<iframe border=0 style='border:0 solid #000;height:100%;width:100%;' src="
				+ basepath + url 
				+"></iframe>"
		}));
	} else {
		if (url.indexOf('?') > 0) {
			url += '&viewId=' + this.viewId;
		} else {
			url += '?viewId=' + this.viewId;
		}
		if(this.viewType == 'CUST') {
			url += '&_custId=' + this.viewId;
		} else if(this.viewType == 'PROD') {
			url += '&_prodId=' + this.viewId;
		} else {
			url += '&_custId=' + this.viewId;
		}
		window.add(new Ext.Panel({
			html : "<iframe border=0 style='border:0 solid #000;height:100%;width:100%;' src="
				+ basepath + url
				+"></iframe>"
		}));
	}

};
/***
 * 增加头部内容
 * @param cfg header配置信息
 * @return
 */
Wlj.commonView.prototype.addHeader = function() {
	var _this = this;
	var cfg = _this.headerData;
	if (_this.viewType == 'CUST') {
		var headerTile = {};
		if (cfg.html) {
			headerTile = new Wlj.widgets.search.tile.NegativeTile({
				//cls : 'yc-cvhContainer',
				ownerW : 30,
				tileSize : true,
				removeable : true,
				baseSize : 118,
				baseWidth : _this.defaultBaseWidth,
				baseHeigth : _this.defaultBaseHeight,
				dragable : false,
				baseMargin : 3,
				tileName : '客户视图头部',
				pos_size : {
					TX : 0,
					TY : 0,
					TW : cfg.TW,
					TH : cfg.TH
				},
				html : cfg.html
			});
		} else {
			headerTile = new Wlj.widgets.search.tile.NegativeTile({
				//cls : 'yc-cvhContainer',
				ownerW : 30,
				tileSize : true,
				removeable : true,
				baseSize : 118,
				baseWidth : _this.defaultBaseWidth,
				baseHeigth : _this.defaultBaseHeight,
				dragable : false,
				baseMargin : 3,
				tileName : '客户视图头部',
				jsUrl : '/contents/frameControllers/plugin/customerView/viewHeaderTile.js',
				pos_size : {
					TX : 0,
					TY : 0,
					TW : cfg.TW,
					TH : cfg.TH
				},
				appObject : _this
			});
		}
		_this.header.add(headerTile);
	} else if (_this.viewType == 'PROD') {
		//TODO 产品视图处理逻辑
	}
	
};
/***
 * 增加磁贴
 * @param cfg 磁贴配置信息
 * @return
 */
Wlj.commonView.prototype.getTileCfg = function(cfg) {
	var _this = this;
	var td = cfg;
	var posX = parseInt(td.TX ? td.TX : 0, 10),
		posY = parseInt(td.TY ? td.TY : 0, 10),
		tileLogo = td.TILE_LOGO ? td.TILE_LOGO : 'ico-t-'+Math.floor(Math.random()*100+1),
		tileSize = td.TILE_SIZE ? td.TILE_SIZE : td.DEFAULT_SIZE ? td.DEFAULT_SIZE : false,
		tileColor = td.TILE_COLOR ? td.TILE_COLOR : 'tile_c'+Math.floor(Math.random()*10+1),
		jsUrl = td.JS_URL ? td.JS_URL : false,
		tileName = td.NAME,
		cls = 'tile '+tileColor;
	if(!jsUrl && !cfg.html){
		tileSize = false;
	}
	var sizeObject = _this.translateSize(tileSize);
	var tileCfg = {
		tileLogo : tileLogo,
		tileSize : tileSize,
		tileName : tileName,
		tileColor : tileColor,
		baseWidth : this.defaultBaseWidth,
		baseHeight : this.defaultBaseHeight,
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
	Ext.apply(tileCfg, td);
	return tileCfg;
};
Wlj.commonView.prototype.translateSize = function(code){
	switch(code){
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
Wlj.commonView.prototype.translateSizeCode = function(TW, TH){
	var size = [TW,TH];
	switch (Ext.encode(size)){
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
Wlj.commonView.prototype.addTile = function(cfg) {
	var _this = this;
	var tileCfg = {
			cls : 'yc-cvtcBox',
			ownerW : 11,
			ownerH : 30,
			removeable : true,
			interval : 5000,
			baseSize : 128,
			baseMargin : 3,
			dragable : false,
			jsUrl : basepath + cfg.jsUrl,
			newChart:cfg.newChart,
			clickFire : function() {
		
				if(cfg.DETAIL_URL == null || cfg.DETAIL_URL ==='') {
					return;
				}
				if(_this.detailWins.length > 0) {
					var flag = 0;
					for (var i = 0;i < _this.detailWins.length; i++ ) {
						if(cfg.tileName == _this.detailWins[i].title){
							flag = 1;
							if(_this.detailWins[i].isSlid){
								_this.detailWins[i].expand(false);
					        }else{
					        	_this.detailWins[i].expand();
					        }
							_this.detailWins[i].show();
							break;
						}
					} 
					if(flag == 0) {
						if(_this.detailWins.length == _this.maxDetailNum) {
							_this.detailWins[0].removeAll();
							_this.addDetailPanel(_this.detailWins[0], cfg.DETAIL_URL);
							_this.detailWins[0].setTitle(cfg.tileName);
							_this.detailWins[0].doLayout();
							_this.detailWins[0].show();
						} else {
							_this.addWin(cfg);
						}
					}
					
				} else {
					_this.addWin(cfg);
				}
			},
			listeners : {
				afterrender : function(){
					var _this = this;
					this.el.on('click',function(){
						_this.clickFire();
					});
					if(cfg.needChart){
						_this.newChart();
					}
				}
			},
			html : cfg.html
		};
	cfg = _this.getTileCfg(cfg);
	Ext.apply(tileCfg, cfg);
	if(!tileCfg.jsUrl && tileCfg.html){
		tileCfg.jsUrl = true;
	}

	var viewTile = new Wlj.widgets.search.tile.NegativeTile(tileCfg);
	_this.content.add(viewTile);
};
/***
 * 头部容器类
 */
Wlj.commonView.header = Ext.extend(Ext.Container, {
	//cls : 'yc-cvHeader',
	innerTpl : new Ext.XTemplate(' <div>','</div>'),
	layoutEl : false,
	scrolling : false,
	bodysize : false,
	scrollIndex : 0,
	onRender :  function(ct,pos){
		Wlj.commonView.header.superclass.onRender.call(this,ct,pos);
		this.layoutEl = this.innerTpl.append(this.el);
		Ext.fly(this.layoutEl).setHeight(this.height);
	},
	getLayoutTarget : function(){
		return this.layoutEl;
	}
});
/***
 * 视图内容容器类
 */
Wlj.commonView.content = Ext.extend(Ext.Container, {
	cls : 'yc-cvContainer',
	innerTpl : new Ext.XTemplate(' <div class="yc-cvTileContainer" >','</div>'),
	layoutEl : false,
	scrolling : false,
	scrollIndex : 0,
	bodysize : false,
	onRender :  function(ct,pos){
		var _this = this; 
		Wlj.commonView.content.superclass.onRender.call(this,ct,pos);
		this.layoutEl = this.innerTpl.append(this.el);
		Ext.fly(this.layoutEl).setHeight(this.height);
	},
	getLayoutTarget : function(){
		return this.layoutEl;
	},
	contentWidth : false
});

Wlj.commonView.detailWin = Ext.extend(Ext.Window, {
	  	layout : 'fit',
	  	detailUrl : false,
	    maximizable : true,
	    restore : function(ct,pos) {
			Wlj.commonView.detailWin.superclass.restore.call(this,ct,pos);
		},
		maximize : function(ct,pos) {
			Wlj.commonView.detailWin.superclass.maximize.call(this,ct,pos);
		},
		listeners : {
			'beforeshow' : function(window) {
				var vewSize =  Ext.getBody().getViewSize();
				window.setPosition(Ext.getBody().getX(), Ext.getBody().getX() + 118);
				window.setHeight(vewSize.height - 118);
				window.setWidth(vewSize.width);
			}
		},
		draggable : true,//是否可以拖动
		closable : true,// 是否可关闭
		modal : false,
	    autoScroll:true,
		closeAction : 'hide',
		collapsible : true,// 是否可收缩
		titleCollapse : true,
		border : false,
		animCollapse : true,
		pageY : 20,
		constrain : true
});
