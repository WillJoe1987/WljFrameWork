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