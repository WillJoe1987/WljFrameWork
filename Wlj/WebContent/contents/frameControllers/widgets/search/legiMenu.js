Ext.ns('Wlj.widgets.search.menu');
Wlj.widgets.search.menu.MenuItem = Ext.extend(Ext.Container,{
	autoEl : 'li',
	id : '',
	name : '',
	isLeaf : true,
	enableTile : true,
	defaultType : 'wljmenuitem',
	displayTemplate : new Ext.XTemplate(
		'<a class="yc-mmLink" href="javascript:void(0);">',
			'{name}',
		'</a>'),
	tileTemplate : new Ext.XTemplate('<div style="position:absolute;"></div>'),
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
		this.el.on('mouseenter',function(event){
			event.stopEvent();
			_this.el.child('.yc-mmLink').addClass('yc-mmLink-selected');
			_this.showSubs();
		});
		this.el.on('mouseleave',function(event){
			event.stopEvent();
			_this.el.child('.yc-mmLink').removeClass('yc-mmLink-selected');
		});
	},
	showSubs : function(){
		var _this = this;
		if(!this.subContainer){
			var datas = this.getSubDatas();
			this.subContainer = new Wlj.widgets.search.menu.SubMenuContainer({
				secondMenus : datas,
				appObject : _this.appObject
			});
			this.add(this.subContainer);
			this.doLayout();
		}
		if(this.ownerCt.displayedSub){
			this.ownerCt.displayedSub.hideSubs();
		}
		
		this.ownerCt.displayedSub = this;
		this.subContainer.show();
		
	},
	hideSubs : function(){
		if(this.subContainer)
			this.subContainer.hide();
	},
	hideAll : function(){
		if(this.subContainer)
			this.subContainer.hide();
	},
	initSubMenus : function(){
		this.inited = true;
		this.add(this.getSubDatas());
		this.doLayout();
	},
	getSubDatas : function(){
		return this.appObject.createSubMenuCfg(this.ID);
	},
	getLayoutTarget : function(){
		return this.el;
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
		var el = document.createElement('div');
		el.style.width = TW*128+8*(TW-1);
		el.style.height = TH*128+8*(TH-1);
		el.className = 'x-panel-ghost ' + (cls ? cls : '');
		if(this.header){
			el.appendChild(this.tileTemplate.apply());
		}
		Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(TH*128+8*(TH-1));
		el.style.width = TW*128+8*(TW-1) + 'px';
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

Wlj.widgets.search.menu.SubMenuContainer = Ext.extend(Ext.Container,{
	ownerMajor : false,
	secondMenus : false,
	currentGroupIndex : 0,
	autoEl : {
		tag : 'div',
		cls : 'yc-mmContainer'
	},
	leftTemplate : new Ext.XTemplate('<div class="ym-mmc-left" style="">',
									'</div>'),
	rightTemplate : new Ext.XTemplate('<div class="ym-mmc-right" style="">',
									'</div>'),
	layoutTemplate : new Ext.XTemplate('<div class="yc-mmcContent" />'),
	initComponent : function(){
		if(!this.secondMenus){
			return false;
		}
		Wlj.widgets.search.menu.SubMenuContainer.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		Wlj.widgets.search.menu.SubMenuContainer.superclass.onRender.call(this, ct, position);
		this.leftEl = this.leftTemplate.append(this.el,{},true);
		this.layoutEl = this.layoutTemplate.append(this.el,{});
		this.rightEl = this.rightTemplate.append(this.el,{},true);
		var _this = this;
		Ext.each(this.secondMenus, function(g){
			_this.add(new Wlj.widgets.search.menu.SecondMenuItem({
				menuData : g,
				appObject : _this.appObject
			}));
		});
		this.doLayout();
		this.groupCount = Math.ceil(this.items.getCount()/4);
		this.rightEl.on('click',function(e){
			e.stopEvent();
			_this.nextGroup();
		});
		this.leftEl.on('click', function(e){
			e.stopEvent();
			_this.preGroup();
		});
		this.on('show', function(e){
			_this.initWheeling();
		});
		this.on('hide',function(e){
			_this.destroyWheeling();
		});
		this.refreshGroupIco();
	},
	getLayoutTarget : function(){
		return this.layoutEl;
	},
	nextGroup : function(){
		if(this.currentGroupIndex < this.groupCount-1){
			var crtMn = 4 * this.currentGroupIndex;
			for(var i=0; i<4 && crtMn+i<this.items.getCount(); i++){
				this.items.itemAt(crtMn+i).hide();
			}
			this.currentGroupIndex += 1;
			this.refreshGroupIco();
		}
	},
	preGroup : function(){
		var crtMn = 4 * this.currentGroupIndex;
		if(this.currentGroupIndex > 0){
			for(var i=1;i<5 && crtMn-i<this.items.getCount();i++){
				this.items.itemAt(crtMn-i).show();
			}
			this.currentGroupIndex -= 1;
			this.refreshGroupIco();
		}
	},
	refreshGroupIco : function(){
		if(this.currentGroupIndex === this.groupCount-1){
			this.rightEl.setVisible(false);
		}else{
			this.rightEl.setVisible(true);
		}
		if(this.currentGroupIndex === 0){
			this.leftEl.setVisible(false);
		}else{
			this.leftEl.setVisible(true);
		}
	},
	rollingHandler : function(e){
		e.stopEvent();
		var delta = e.getWheelDelta();
		if(!this.con.rolling){
			this.con.rolling = true;
			if(delta<0){
				this.con.nextGroup();
			}else{
				this.con.preGroup();
			}
			this.con.rolling=false;
		}else{
			return;
		}
	},
	initWheeling : function(){
		this.el.con = this;
		this.el.on('mousewheel',this.rollingHandler);
	},
	destroyWheeling : function(){
		this.el.con = false;
		delete this.el.con;
		this.el.un('mousewheel',this.rollingHandler);
	}
});

Wlj.widgets.search.menu.SecondMenuItem = Ext.extend(Ext.Container,{
	menuData : false,
	parentItem : false,
	autoEl : {
		tag : 'div',
		cls : 'yc-mmcGroup'
	},
	menuNameTemplate : new Ext.XTemplate('<ul>',
											'<li title="{name}" >{name}</li>',
										'</ul>'),
	layoutTempalte : new Ext.XTemplate('<li><ul></ul></li>'),
	initComponent : function(){
		if(!this.menuData){
			return false;
		}
		Wlj.widgets.search.menu.SecondMenuItem.superclass.initComponent.call(this);
		Ext.apply(this, this.menuData);
		if(this.appObject.findMenuDataByProperty('PARENT_ID', this.menuData.ID)===false){
			this.hasSub = false;
		}else{
			this.hasSub = true;
			this.subMenuDatas = this.appObject.createSubMenuCfg(this.menuData.ID);
		}
	},
	onRender : function(ct, position){
		Wlj.widgets.search.menu.SecondMenuItem.superclass.onRender.call(this, ct, position);
		this.titleEl = this.menuNameTemplate.append(this.el, {
			name : this.menuData.NAME
		});
		if(this.hasSub){
			this.layoutEl = this.layoutTempalte.append(this.titleEl,{});
			var _this = this;
			Ext.each(this.subMenuDatas, function(smd){
				_this.add(new Wlj.widgets.search.menu.ThirdSubMenuItem({
					menuData : smd,
					appObject : _this.appObject
				}));
			});
			_this.doLayout();
		}else{
			this.createDD();
		}
	},
	afterRender : function(){
		Wlj.widgets.search.menu.ThirdSubMenuItem.superclass.afterRender.call(this);
		var _this = this;
		this.el.on('click', function(e, h, o){
			e.stopEvent();
			_this.clickHanler();
		});
	},
	getLayoutTarget : function(){
		if(this.layoutEl)
			return this.layoutEl.firstChild;
		else
			return this.el;
	},
	clickHanler : function(){
		if(this.menuData.ACTION){
			Wlj.ServiceMgr.findServiceByID(this.menuData.ID).execute();
		}
	},
	createGhost : function(cls, useShim, appendTo){
		var size = this.appObject.translateSize(this.menuData.DEFAULT_SIZE);
		var TW = size.TW;
		var TH = size.TH;
		var el = document.createElement('div');
		el.style.width = TW*128+8*(TW-1);
		el.style.height = TH*128+8*(TH-1);
		el.className = 'x-panel-ghost ' + (cls ? cls : '');
		if(this.header){
			el.appendChild(this.tileTemplate.apply());
		}
		Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(TH*128+8*(TH-1));
		el.style.width = TW*128+8*(TW-1) + 'px';
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

Wlj.widgets.search.menu.ThirdSubMenuItem = Ext.extend(Ext.Container, {
	menuData : false,
	parentItem : false,
	autoEl : {
		tag : 'li'
	},
	menuNameTemplate : false,
	layoutTemplate : new Ext.XTemplate('<li style="display:none;"><ul></ul></li>'),
	initComponent : function(){
		Wlj.widgets.search.menu.ThirdSubMenuItem.superclass.initComponent.call(this);
		if(!this.menuData)
			return false;
		Ext.apply(this, this.menuData);
		if(this.appObject.findMenuDataByProperty('PARENT_ID', this.menuData.ID)===false){
			this.hasSub = false;
			this.menuNameTemplate = new Ext.XTemplate('<i title="{name}" href="javascript:void(0);">{name}</i>');
		}else{
			this.hasSub = true;
			this.subMenuDatas = this.appObject.createSubMenuCfg(this.menuData.ID);
			this.menuNameTemplate = new Ext.XTemplate('<span>{name}</span>');
		}
	},
	onRender : function(ct, position){
		Wlj.widgets.search.menu.ThirdSubMenuItem.superclass.onRender.call(this, ct, position);
		this.menuNameTemplate.append(this.el,{
			name:this.menuData.NAME
		});
		if(this.hasSub){
			this.el.addClass('yc-mmgParent yc-mmgpClose');
			this.el.set({
				title : this.menuData.NAME
			});
		}else{
			this.createDD();
		}
	},
	afterRender : function(){
		Wlj.widgets.search.menu.ThirdSubMenuItem.superclass.afterRender.call(this);
		var _this = this;
		this.el.on('click', function(e, h, o){
			e.stopEvent();
			_this.clickHanler();
		});
	},
	getLayoutTarget : function(){
		if(this.layoutEl)
			return this.layoutEl.firstChild;
		else
			return this.el;
	},
	expand : function(){
		if(!this.hasExpanded){
			if(this.hasSub){
				this.layoutEl = this.layoutTemplate.insertAfter(this.el);
				var _this = this;
				Ext.each(this.subMenuDatas, function(smd){
					_this.add(new Wlj.widgets.search.menu.ThirdSubMenuItem({
						menuData : smd,
						appObject : _this.appObject
					}));
				});
				_this.doLayout();
				this.hasExpanded = true;
			}
		}
		if(this.hasSub){
			this.el.removeClass('yc-mmgpClose');
			this.el.addClass('yc-mmgpOpen');
			this.layoutEl.style.display = 'inline';
		}
	},
	collapse : function(){
		if(this.hasSub){
			this.el.addClass('yc-mmgpClose');
			this.el.removeClass('yc-mmgpOpen');
			this.layoutEl.style.display = 'none';
		}
	},
	clickHanler : function(){
		if(this.hasSub){
			if(this.el.hasClass('yc-mmgpClose')){
				this.expand();
			}else{
				this.collapse();
			}
		}
		if(this.menuData.ACTION){
			Wlj.ServiceMgr.findServiceByID(this.menuData.ID).execute();
		}
	},
	createGhost : function(cls, useShim, appendTo){
		var size = this.appObject.translateSize(this.menuData.DEFAULT_SIZE);
		var TW = size.TW;
		var TH = size.TH;
		var el = document.createElement('div');
		el.style.width = TW*128+8*(TW-1);
		el.style.height = TH*128+8*(TH-1);
		el.className = 'x-panel-ghost ' + (cls ? cls : '');
		if(this.header){
			el.appendChild(this.tileTemplate.apply());
		}
		Ext.fly(el.appendChild(document.createElement('ul'))).setHeight(TH*128+8*(TH-1));
		el.style.width = TW*128+8*(TW-1) + 'px';
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

Wlj.widgets.search.menu.MenuComponent = Ext.extend(Ext.Container, {
	autoEl : {
		tag : 'div',
		cls : 'yc-mainMenu'
	},
	enableTile : true,
	defaultType : 'wljmenuitem',
	componentTemplate : new Ext.XTemplate('<ul/>'),
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