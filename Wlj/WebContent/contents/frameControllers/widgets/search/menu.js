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
});