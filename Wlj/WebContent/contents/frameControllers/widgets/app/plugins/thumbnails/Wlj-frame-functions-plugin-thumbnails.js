Ext.ns('Wlj.frame.functions.plugin');
/**
 * 略缩图插件对象，在应用功能内部无UI修改
 * 对外提供当前数据存储对象，包括：store以及查询条件。
 */
Wlj.frame.functions.plugin.Thumbnails = function(config){
	this.appObject = config.appObject;
};
Ext.extend(Wlj.frame.functions.plugin.Thumbnails, Ext.util.Observable, {
	initialView : function(){
		
	},
	getBuilt : function(){
		return this.getThumbConfig();
	},
	getThumbConfig : function(){
		return {
			twindow : window,
			conds : this.getThumbCondition(),
			store : this.getThumbCurrentStore(),
			fields : this.getThumbGridFields()
		};
	},
	getThumbCondition : function(){
		return this.appObject.resultDomain.searchGridView.currentParams;
	},
	getThumbCurrentStore : function(){
		return this.appObject.resultDomain.searchGridView.store;
	},
	getThumbGridFields : function(){
		return this.appObject.resultDomain.searchGridView.store.fields;
	}
});

/**
 * 查询方案存储插件，与后台UserDinkAction配合使用，涉及表结构：ocrm_f_sys_user_dink；
 * 主要功能包括：初始化用户查询方案列表，调用查询方案，新增、删除查询方案。
 * 待完善：确定数据交互导致的影响；操作体验优化；约束、匹配已有方案等。
 * 详情见：readme-v4.7.20150526-1.txt
 */
Wlj.frame.functions.plugin.ConditionDink = function(config){
	this.appObject = config.appObject;
	this.initialView();
};
Ext.extend(Wlj.frame.functions.plugin.ConditionDink, Ext.util.Observable, {
	newDinkText : 'newdingking{1}',
	initialView : function(){
		var searchPanel = this.appObject.searchDomain.searchPanel;
		var _this = this;
		searchPanel.addButton({
			text : 'Dinking'
		}, function(){
			Wlj.frame.functions.plugin.ConditionDink.DINKNAMEWIN.show();
		}, this);
		this.buildDinkContainer();
		Wlj.frame.functions.plugin.ConditionDink.DINKNAMEWIN.on('hide', function(win){
			_this.getDinkedItem(win.items.first().getValue());
		});
	},
	getBuilt : Ext.emptyFn,
	buildDinkContainer : function(){
		var dinkThis = this;
		this.dinkContainer = new Ext.Panel({
			height : 400,
			width : 400,
			movedIn : false,
			layout :'form',
			title : 'dink',
			style : 'left : 800px; top: -395px; position:absolute;border: 1px solid #000;',
			renderTo : Ext.getBody(),
			afterRender : function(){
				Ext.Panel.prototype.afterRender.call(this);
				var _this = this;
				this.header.on('click', function(e){
					e.stopEvent();
					_this.hideOut();
				});
				this.el.on('mouseenter', function(e){
					e.stopEvent();
					_this.showIn();
				});
				Ext.Ajax.request({
					url : basepath + '/userdink/'+__resId+'.json',
					method : 'GET',
					success : function(response){
						var dinks = Ext.decode(response.responseText);
						while(dinks.length){
							var oneDink = dinks.shift();
							_this.add(new Wlj.frame.functions.plugin.ConditionDink.DinkItem({
								title : oneDink.title,
								dinkPlg : dinkThis,
								dinkContent : Ext.decode(oneDink.condition),
								dataId : oneDink.id
							}));
						}
						_this.doLayout();
					}
				})
			},
			showIn : function(){
				if(this.movedIn === false){
					this.el.animate({
						top : {from : -395, to : 0}
					},.35,null,'easeOut');
					this.movedIn = true;
				}
			},
			hideOut : function(){
				if(this.movedIn === true){
					this.el.animate({
						top : {from : 0, to : -395}
					},.35,null,'easeOut');
					this.movedIn = false;
				}
			}
		});
	},
	getDinkedItem : function(itemName){
		var searchPanel = this.appObject.searchDomain.searchPanel;
		var cond = searchPanel.getForm().getValues();
		for(var key in cond){
			if(Ext.isEmpty(cond[key])){
				delete cond[key];
			}
		}
		if(Ext.encode(cond) === '{}'){
			alert('no condition!');
			return false;
		}
		var theDink = this.dinkContainer.add(new Wlj.frame.functions.plugin.ConditionDink.DinkItem({
			title : itemName ? itemName : this.newDinkText,
			dinkPlg:this,
			dinkContent : cond
		}));
		this.dinkContainer.doLayout();
		this.comitDink({
			title : itemName ? itemName : this.newDinkText,
			resId : __resId,
			condition : Ext.encode(cond)
		}, theDink);
	},
	comitDink : function(obj,theDink){
		Ext.Ajax.request({
			url : basepath + "/userdink.json",
			method : 'POST',
			params : obj,
			success : function(response){
				theDink.dataId = response.responseText;
			},
			failure: function(){
				alert('failure!');
			}
		});
	}
});
/**
 * 查询方案对象。
 */
Wlj.frame.functions.plugin.ConditionDink.DinkItem = Ext.extend(Ext.Panel, {
	title : 'new dink',
	dinkContent : false,
	dinkPlg : false,
	setDinkContent : function(content){
		this.dinkContent = content;
	},
	initComponent : function(){
		this.tools = [];
		var _this = this;
		this.tools.push({
			id : 'close',
			handler : function(){
				_this.ownerCt.remove(_this);
			}
		});
		Wlj.frame.functions.plugin.ConditionDink.DinkItem.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		Wlj.frame.functions.plugin.ConditionDink.DinkItem.superclass.onRender.call(this, ct, position);
		this.body.setHeight(0);
		var _this = this;
		this.header.on('click', function(){
			for(var key in _this.dinkContent){
				if(!hasConditionField(key)){
					addConditionField(key);
				}
			}
			_this.dinkPlg.appObject.searchDomain.resetCondition(false);
			_this.dinkPlg.appObject.searchDomain.searchPanel.getForm().setValues(_this.dinkContent);
		});
		this.el.on('contextmenu', function(e){
			e.stopEvent();
			new Ext.menu.Menu({
		        items: [{
		        	text : '钉到首页'
		        }]
		    }).showAt(e.getXY());
		});
	},
	onDestroy : function(){
		if(this.dataId){
			Ext.Ajax.request({
				url : basepath + "/userdink/"+this.dataId+".json",
				method : 'DELETE',
				success : function(response){
				},
				failure: function(){
				}
			});
		}
		Wlj.frame.functions.plugin.ConditionDink.DinkItem.superclass.onDestroy.call(this);
		
	}
});

/**
 * 全局查询方案名称标题
 */
Wlj.frame.functions.plugin.ConditionDink.DINKNAMEWIN = new Ext.Window({
	title : 'title',
	closeAction : 'hide',
	width : 200,
	height :80,
	layout : 'fit',
	items : [{
		xtype : 'textfield',
		labelWidth : 0,
		anchor : '100%',
		name : 'name'
	}],
	listeners : {
		show : function(){
			this.items.first().setValue(null);
		}
	}
});

