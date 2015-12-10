Ext.ns('Wlj.frame.functions.app.widgets');

/**
 * 左边面板对象
 */
Wlj.frame.functions.app.widgets.LeftEdgeView = Ext.extend(Ext.Panel,{
	layout : 'accordion',
	autoScroll : true,
	initComponent : function(){
		Wlj.frame.functions.app.widgets.LeftEdgeView.superclass.initComponent.call(this);
	},
	render : function(container, position){
		Wlj.frame.functions.app.widgets.LeftEdgeView.superclass.render.call(this,container, position);
	}
});
Ext.reg('leftedgeview', Wlj.frame.functions.app.widgets.LeftEdgeView);

/**
 * 右边面板对象
 */
Wlj.frame.functions.app.widgets.RightEdgeView = Ext.extend(Ext.Panel,{
	layout : 'accordion',
	autoScroll : true,
	initComponent : function(){
		Wlj.frame.functions.app.widgets.RightEdgeView.superclass.initComponent.call(this);
	},
	render : function(container, position){
		Wlj.frame.functions.app.widgets.RightEdgeView.superclass.render.call(this,container, position);
	}
});
Ext.reg('rightedgeview', Wlj.frame.functions.app.widgets.RightEdgeView);

/**
 * 顶部面板对象
 */
Wlj.frame.functions.app.widgets.TopEdgeView = Ext.extend(Ext.Panel,{
	layout : 'form',
	autoScroll : true,
	initComponent : function(){
		Wlj.frame.functions.app.widgets.TopEdgeView.superclass.initComponent.call(this);
	},
	render : function(container, position){
		Wlj.frame.functions.app.widgets.TopEdgeView.superclass.render.call(this,container, position);
	}
});
Ext.reg('topedgeview', Wlj.frame.functions.app.widgets.TopEdgeView);

/**
 * 底部面板对象
 */
Wlj.frame.functions.app.widgets.BottomEdgeView = Ext.extend(Ext.TabPanel,{
	activeTab : 0,
	autoScroll : true,
	initComponent : function(){
		Wlj.frame.functions.app.widgets.BottomEdgeView.superclass.initComponent.call(this);
	},
	render : function(container, position){
		Wlj.frame.functions.app.widgets.BottomEdgeView.superclass.render.call(this,container, position);
	}
});
Ext.reg('bottomedgeview', Wlj.frame.functions.app.widgets.BottomEdgeView);

/**
 * 通用原生表格对象封装
 */
Wlj.frame.functions.app.widgets.NativeGrid = Ext.extend(Ext.Panel,{
	title : false,
	height : 'auto',
	fields : false,
	gridButtons : false,
	url : false,
	pageable : true,
	grideditable : false,
	isCsm : true,
	isRn : true,
	buttons : false,
	gridlisteners : false,
	singleSelect : false,
	region : false,
	layout : 'fit',
	stripeRows : true,
	jsonCount : 'json.count',
	jsonRoot : 'json.data',
	pagesize : 20,
	initComponent : function(){
		Wlj.frame.functions.app.widgets.NativeGrid.superclass.initComponent.call(this);
		this.setOwnerApp();
		this.collectFileds();
		this.buildStore();
		if(this.pageable){
			this.buildPagingBar();
		}
		this.buildGrid();
		this.add(this.grid);
	},
	setOwnerApp : function(){
		if(!this.appObject){
			this.appObject = this.ownerCt ? this.ownerCt.appObject : false;
			if(!this.appObject){
				Ext.warn('APP对象未渲染,后续使用APP对象可能存在问题');
			}
		}
	},
	collectFileds : function(){
		var fieldsCfg = [];
		var _this = this;
		if(Ext.isArray(_this.fields.fields)){
			Ext.each(_this.fields.fields, function(f){
				if(Ext.isString(f)){
					if(!_this.appObject){
						Ext.error('APP对象未渲染,不能使用field string配置');
						return false;
					}
					var fCFG = _this.appObject.copyFieldsByName(f);
					if(fCFG){
						fCFG.header = fCFG.text;
						if(!fCFG.text){
							fCFG.hidden = true;
						}
						fCFG.dataIndex = fCFG.name;
						delete fCFG.xtype;
						if(fCFG.dataType && WLJDATATYPE[fCFG.dataType]){
							fCFG.type = WLJDATATYPE[fCFG.dataType].getStoreType();
							Ext.applyIf(fCFG, WLJDATATYPE[fCFG.dataType].getStoreSpecialCfg());
						}
						fCFG.width = fCFG.resutlWidth ? fCFG.resutlWidth : 100;
						fCFG.sortable = typeof fCFG.sortable == 'boolean' ? fCFG.sortable : true;
						fieldsCfg.push(fCFG);
					}
				} else if(Ext.isObject(f)){
					if(f.name){
						f.header = f.text;
						if(!f.text){
							f.hidden = true;
						}
						f.dataIndex = f.name;
						delete f.xtype;
						if(f.dataType && WLJDATATYPE[f.dataType]){
							f.type = WLJDATATYPE[f.dataType].getStoreType();
							Ext.applyIf(f, WLJDATATYPE[f.dataType].getStoreSpecialCfg());
						}
						f.width = f.width ? f.width : 100;
						f.sortable = typeof f.sortable == 'boolean' ? f.sortable : true;
						fieldsCfg.push(f);
					}
				} else {
					fieldsCfg.push(false);
				}
			});
		}
		
		if(Ext.isFunction(_this.fields.fn)){
			try{
				fieldsCfg = _this.fields.fn.apply(this, fieldsCfg);
			}catch(Werror){
				fieldsCfg = fieldsCfg;
			}
		}else{
			fieldsCfg = fieldsCfg;
		}
		
		var i = fieldsCfg.length - 1;
		while (i >= 0) {
			if (!fieldsCfg[i]) {
				fieldsCfg.remove(fieldsCfg[i]);
			}
			i--;
		}
		_this.fields.fields = fieldsCfg;
	},
	buildStore : function(){
		var _this = this;
		_this.store = new Ext.data.Store({
			restful:true,	
	        proxy : new Ext.data.HttpProxy({url:_this.url}),
	        reader : new Ext.data.JsonReader({
	        	totalProperty : _this.jsonCount,
	        	root : _this.jsonRoot
	        },_this.fields.fields)
		});
	},
	buildPagingBar : function(){
		var _this = this;
		_this.pagingCombo =  new Ext.form.ComboBox({
	        name : 'pagesize',
	        triggerAction : 'all',
	        mode : 'local',
	        store : new Ext.data.ArrayStore({
				fields : ['value', 'text'],
	            data : [
	            	[ 10, '10条/页' ], [ 20, '20条/页' ], 
	            	[ 50, '50条/页' ], [ 100, '100条/页' ],
	            	[ 250, '250条/页' ],[ 500, '500条/页' ] 
	            ]
	        }),
	        valueField : 'value',
	        displayField : 'text',
	        value: _this.pagesize,
	        editable : false,
	        width : 85
	    });
		_this.pagingbar = new Ext.PagingToolbar({
			pageSize : parseInt(_this.pagingCombo.getValue()),
			store : _this.store,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',       
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', _this.pagingCombo]
		});
		_this.pagingCombo.on("select", function(comboBox) {
			_this.pagingbar.pageSize = parseInt(comboBox.getValue()),
	        _this.store.reload({
	            params : {
	                start : 0,
	                limit : parseInt(comboBox.getValue())
	            }
	        });
	    });
	},
	createTbarCfg : function(){
		var tbs = [];
		var _this = this;
		if(Ext.isArray(_this.gridButtons)){
			Ext.each(_this.gridButtons, function(gb){
				if(Ext.isFunction(gb.fn)){
					gb.handler = function(){
						gb.fn.call(_this, _this.grid);
					};
				}
				tbs.push(gb);
			});
		}
		return tbs.length>0 ? tbs : false;
	},
	buildGrid : function(){
		var _this = this;
		if(_this.isCsm){
			_this.csm = new Ext.grid.CheckboxSelectionModel({
				singleSelect : _this.singleSelect
			});
			_this.fields.fields.unshift(_this.csm);
		}
		if(_this.isRn){
			_this.rn = new Ext.grid.RowNumberer({
		        header : 'No.',
		        width : 35
			});
			_this.fields.fields.unshift(_this.rn);
		}
		if(this.grideditable){
			this.grid = new Ext.grid.EditorGridPanel({
				height : _this.height,
				store : _this.store,
				frame : true,
				stripeRows : _this.stripeRows,
				clicksToEdit : 1,
				tbar : _this.createTbarCfg(),
				viewConfig : {
					autoFill : false 
				},
				cm : new Ext.grid.ColumnModel(_this.fields.fields),
				sm : _this.isCsm ? _this.csm : null,
				region : _this.region,
				footer : false,
				bbar : _this.pageable ? _this.pagingbar : false,
				listeners : this.gridlisteners
			});
		}else{
			this.grid = new Ext.grid.GridPanel({
				height : _this.height,
				store : _this.store,
				frame : true,
				stripeRows : _this.stripeRows,
				tbar : _this.createTbarCfg(),
				viewConfig : {
					autoFill : false 
				},
				cm : new Ext.grid.ColumnModel(_this.fields.fields),
				sm : _this.isCsm ? _this.csm : null,
				footer : false,
				bbar : _this.pageable ? _this.pagingbar : false,
				listeners : this.gridlisteners
			});
		}
	},	
	getStore : function(){
		return this.store;
	},
	getGrid : function(){
		return this.grid;
	},
	setParameters : function(params,callback){
		delete this.currentParams;
		delete this.store.baseParams;
		var builtParams = this.buildParams.call(this, params);
		if(builtParams) {
			this.currentParams = builtParams;
			this.store.baseParams = builtParams;
		}else{
			this.currentParams = params;
			this.store.baseParams = {
					condition : Ext.encode(params)
			};
		}
		if(this.pageable){
			this.store.load({
				params : {
					start : 0,
					limit : this.pagingbar.pageSize                                                      
				},
				callback : callback
			});
		}else{
			this.store.load({
				callback : callback
			});
		}
	},
	buildParams : Ext.emptyFn
});
Ext.reg('nativegrid', Wlj.frame.functions.app.widgets.NativeGrid);

/**
 * 从属表格对象,关联主表可以是searchGridView,首页查询结构列表,也可以是Ext原生表格
 */
Wlj.frame.functions.app.widgets.HypotaxisGrid = Ext.extend(Wlj.frame.functions.app.widgets.NativeGrid,{
	linktable : false,
	linkfields : false,
	initComponent : function(){
		Wlj.frame.functions.app.widgets.HypotaxisGrid.superclass.initComponent.call(this);
		this.bindLinktable();
	},
	bindLinktable : function(){
		var _this = this;
		if (!_this.linktable || !_this.linkfields){
			return false;
		}
		this.collectLinkFields();
		if (_this.linktable == 'searchGridView') {
			if(!_this.appObject){
				Ext.error('APP对象未渲染,无法将从属表格关联至searchGridView');
				return false;
			}
			
			_this.appObject.resultDomain.on('selectchagne',function(){
				var selectRecords = getSelectedData();
				_this.triggerLoad(selectRecords);
			});
		} else {
			if(_this.linktable.getXType() == 'grid'){
				_this.linktable.on('selectchagne',function(){
					var selectRecords = _this.linktable.getSelectionModel().getSelections();
					if(selectRecords.length>0){
						_this.triggerLoad(selectRecords[0]);
					}else _this.triggerLoad(false);
				});
			}
		}
	},
	collectLinkFields : function(){
		var lfs = [];
		if(Ext.isArray(this.linkfields)){
			Ext.each(this.linkfields, function(f){
				if(Ext.isString(f)){
					lfs.push({field : f, value : '@'+f});
				} else if(Ext.isObject(f)){
					lfs.push(f);
				}
			});
		}
		this.linkfields = lfs;
	},
	// private 
	triggerLoad : function(selectRecords){
		var _this = this;
		if (selectRecords){
			var paramObj = {};
			for(var i=0;i<_this.linkfields.length;i++){
				var theField = _this.linkfields[i];
				var pName = theField.field;
				var pValue = theField.value;
				if(pValue.indexOf('@') == 0 ){
					var valueField = pValue.substring(1);
					pValue = selectRecords.get(valueField);
				}
				paramObj[pName] = pValue;
			}
			_this.setParameters(paramObj);
		} else {
			_this.store.removeAll();
		}
	}
});
Ext.reg('hypotaxisgrid', Wlj.frame.functions.app.widgets.HypotaxisGrid);