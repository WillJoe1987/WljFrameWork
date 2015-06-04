Ext.ns('Wlj.widgets.search.search');
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
		Ext.each(Wlj.search.App.SEARCHTYPES,function(i){
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
Ext.reg('searchmaincontainer', Wlj.widgets.search.search.SearchMainContainer);