Ext.ns('Wlj.widgets.search.tile');
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
