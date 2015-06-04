Ext.ns('Wlj.widgets.search.service');

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
