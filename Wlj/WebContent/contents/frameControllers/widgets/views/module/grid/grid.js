Ext.ns('Wlj.widgets.views.module.grid');
/**
 * eg.
 * new Wlj.widgets.views.module.grid.GridPanel({
		title : 'echain表格定义',
		url : basepath + '/queryWfiSignTaskWfiSignVoteAction.json',
		pageable : true,
		fields: [
			{name : 'sv_exe_user_displayname',text : '任务执行人',width : 120,sortable : true},
			{name : 'sv_result',text : '投票结果',width : 100,sortable : true},//WF_SIGN_RESULT
			{name : 'sv_status',text : '任务状态',width : 100,sortable : true},//WF_SIGN_STATUS
			{name : 'sv_advice',text : '意见',width : 120,sortable : true}
		],
		gridButtons:[{
			text : '新增',
			fn : function(grid){
			
			}
		}]
	})
 * @param {} cfg
 */
Wlj.widgets.views.module.grid.GridPanel = function(cfg){
	Ext.apply(this,{
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
		jsonCount : 'json.count',
		jsonRoot : 'json.data'
	});
	Ext.apply(this,cfg);
	this.init();
};
Wlj.widgets.views.module.grid.GridPanel.prototype.init = function(){
	this.collectFileds();
	this.buildStore();
	if(this.pageable){
		this.buildPagingBar();
	}
	this.buildGrid();
};
Wlj.widgets.views.module.grid.GridPanel.prototype.collectFileds = function(){
	var fieldsCfg = [];
	var _this = this;
	if(Ext.isArray(_this.fields)){
		Ext.each(_this.fields, function(f){
			if(Ext.isObject(f)){
				if(f.name){
					f.header = f.text;
					if(!f.text){
						f.hidden = true;
					}
					f.dataIndex = f.name;
					f.width = f.width ? f.width : 100;
					f.sortable = typeof f.sortable == 'boolean' ? f.sortable : true;
					fieldsCfg.push(f);
				}
			}else{
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
	_this.fields = fieldsCfg;
};
Wlj.widgets.views.module.grid.GridPanel.prototype.buildStore = function(){
	var _this = this;
	_this.store = new Ext.data.Store({
		restful:true,	
        proxy : new Ext.data.HttpProxy({url:_this.url}),
        reader : new Ext.data.JsonReader({
        	totalProperty : _this.jsonCount,
        	root : _this.jsonRoot
        },_this.fields)
	});
};
Wlj.widgets.views.module.grid.GridPanel.prototype.buildPagingBar = function(){
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
        value: 20,
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
};
Wlj.widgets.views.module.grid.GridPanel.prototype.createTbarCfg = function(){
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
};
Wlj.widgets.views.module.grid.GridPanel.prototype.buildGrid = function(){
	var _this = this;
	if(_this.isCsm){
		_this.csm = new Ext.grid.CheckboxSelectionModel({
			singleSelect : _this.singleSelect
		});
		_this.fields.unshift(_this.csm);
	}
	if(_this.isRn){
		_this.rn = new Ext.grid.RowNumberer({
	        header : 'No.',
	        width : 35
		});
		_this.fields.unshift(_this.rn);
	}
	if(this.grideditable){
		this.grid = new Ext.grid.EditorGridPanel({
			title : _this.title,
			height : _this.height,
			store : _this.store,
			frame : true,
			clicksToEdit : 1,
			tbar : _this.createTbarCfg(),
			viewConfig : {
				autoFill : false 
			},
			cm : new Ext.grid.ColumnModel(_this.fields),
			sm : _this.isCsm ? _this.csm : null,
			region : _this.region,
			footer : false,
			bbar : _this.pageable ? _this.pagingbar : false,
			listeners : this.gridlisteners
		});
	}else{
		this.grid = new Ext.grid.GridPanel({
			title : _this.title,
			height : _this.height,
			store : _this.store,
			frame : true,
			tbar : _this.createTbarCfg(),
			viewConfig : {
				autoFill : false 
			},
			cm : new Ext.grid.ColumnModel(_this.fields),
			sm : _this.isCsm ? _this.csm : null,
			footer : false,
			bbar : _this.pageable ? _this.pagingbar : false,
			listeners : this.gridlisteners
		});
	}
};
Wlj.widgets.views.module.grid.GridPanel.prototype.loadFn = function(params,callback){
	delete this.currentParams;
	delete this.store.baseParams;
	this.currentParams = params;
	this.store.baseParams = params;
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
};


/**
 * eg.
 * var grid = new Wlj.widgets.views.module.grid.ComboGrid({
		name : 'grid',
		fieldLabel : '机构选择',
		url : basepath + '/systemUnit-query.json',
		singleSelect : false,
		anchor : '50%',
		showField : 'ORG_NAME',
		hideField : 'ORG_ID',
		fields: [
			{name : 'ORG_ID',text : '机构号',width : 120,sortable : true},
			{name : 'ORG_NAME',text : '机构名称',width : 100,sortable : true}
		]
	});
 * 下拉表格组件
 */
Wlj.widgets.views.module.grid.ComboGrid = Ext.extend(Ext.form.ComboBox, {
	showField : false,
	hideField : false,
	singleSelect : true,
	fields : false,
	url : false,
	pageable : false,
	isCsm : false,
	isRn : false,
	isQp : false,     //是否展示查询区域
	qpField : false,  //查询字段
	afterGridLoad : Ext.emptyFn,
	jsonCount : 'json.count',
	jsonRoot : 'json.data',
	
	anchor : '95%',
	mode : 'local',
	editable : false,
	resizable :false,
	forceSelection:true,
	triggerAction : 'all',
	maxHeight : 200,
	minHeight : 200,
	minListWidth : 390,
	onSelect : Ext.emptyFn,
	assertValue : Ext.emptyFn,
	
	initComponent : function(){
		this.store = new Ext.data.SimpleStore({
			fields : [],
			data : [[]]
		});
		this.tplId = 'innerContainer_'+this.id;
		this.tpl =  "<tpl for='.'><div id='"+this.tplId+"'></div></tpl>";
		this.isCsm = !this.singleSelect;
		if (this.pageable) {
			this.minListWidth = 490;
		}
		Wlj.widgets.views.module.grid.ComboGrid.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		Wlj.widgets.views.module.grid.ComboGrid.superclass.onRender.call(this, ct, position);
		var _this = this;
		_this.buildQueryPanel();
		_this.buildGrid();
		_this.innerPanel = new Ext.Panel({
			layout : 'form',
			items : []
		});
		if(_this.isQp){
			_this.innerPanel.add(_this.queryPanel);
		}
		_this.innerPanel.add(_this.innerGrid);
	},
	expand : function(){
		Wlj.widgets.views.module.grid.ComboGrid.superclass.expand.call(this);
		if(!this.innerPanel.rendered){
			this.innerPanel.render(this.tplId);
			this.innerPanel.setHeight(this.maxHeight);
		}
	},
	rowClickFn : function(grid,rowIndex,e){
		var _this = this;
		var selectRecords = _this.getSelections();
		var showField  = this.showField;
		var hideField = this.hideField;
		var hidevalue = '';
		if(_this.singleSelect){
			hidevalue = selectRecords[0].data[hideField];
		} else {
			hidevalue = this.getSelectValueByProp(hideField);
		}
		this.setValue(hidevalue,selectRecords);
		if(this.singleSelect){
			this.collapse();
		}
	},
	setValue : function(hidevalue, selectRecords){
		var selectRecords  = selectRecords ? selectRecords : this.selectRowsByProp(this.hideField,hidevalue);
		if(selectRecords.length < 1){
			this.showValue = hidevalue;
			Ext.form.ComboBox.superclass.setValue.call(this, hidevalue);
		}else{
			var showvalue = '';
			if(this.singleSelect){
				showvalue = selectRecords[0].data[this.showField];
			}else{
				showvalue = this.getSelectValueByProp(this.showField);
			}
			this.showValue = showvalue;
			Ext.form.ComboBox.superclass.setValue.call(this, hidevalue);
			
			this.el.dom.value = showvalue;
		}
		this.lastSelectionText = this.showValue;
	},
	getValue : function(){
		return this.value ? this.value : this.showValue;
	},
	getShowValue : function(){
		return this.showValue;
	},
	clearValue : function(){
		Wlj.widgets.views.module.grid.ComboGrid.superclass.clearValue.call(this);
		if (_this.gridowner){
			this.innerGrid.getSelectionModel().clearSelections();
		}
	},
	// private
	onViewClick : function(doFocus){},
	getSelections : function(){
		return this.innerGrid.getSelectionModel().getSelections();
	},
	selectRowsByProp : function(field,value){
		var _this = this;
		if (!_this.gridowner || value == '' || value == undefined || value == null){
			return [];
		}
		if (_this.singleSelect){
			var tDataIndex = _this.gridowner.store.findExact(field,value);
			if(tDataIndex >= 0){
				_this.innerGrid.getSelectionModel().selectRow(tDataIndex);
			}
		} else {
			var valueArr = value.split(',');
			var tempArr = [];
			for (var i = 0; i < valueArr.length; i++) {
				var tDataIndex = _this.gridowner.store.findExact(field,valueArr[i]);
				if(tDataIndex >= 0){
					tempArr.push(tDataIndex);
				}
			}
			if(tempArr.length > 0){
				_this.innerGrid.getSelectionModel().selectRows(tempArr);
			}
		}
		return _this.getSelections();
	},
	getSelectValueByProp : function(field){
		var value = '';
		var selectRecords = this.getSelections();
		for (var i = 0; i < selectRecords.length; i++) {
			if (i == 0){
				value = selectRecords[i].data[field];
			}else{
				value = value +','+ selectRecords[i].data[field];
			}
		}
		return value;
	},
	buildGrid : function(){
		var _this = this;
		_this.gridowner = new Wlj.widgets.views.module.grid.GridPanel({
			height : _this.maxHeight - _this.queryHeight,
			singleSelect : this.singleSelect,
			fields : this.fields,
			url : this.url,
			pageable : this.pageable,
			isCsm : this.isCsm,
			isRn : this.isRn,
			jsonCount : this.jsonCount,
			jsonRoot : this.jsonRoot,
			gridlisteners : {
				rowclick : function(grid,rowIndex,e){
					_this.rowClickFn(grid,rowIndex,e);
				},
				render : function(grid){
					if(_this.getValue() != ''){
						_this.setValue(_this.getValue());
					}
				}
			}
		});
		_this.gridowner.loadFn({},function(){
			if(_this.innerGrid.rendered && _this.getValue() != ''){
				_this.setValue(_this.getValue());
			}
			_this.afterGridLoad();
		});
		_this.innerGrid = _this.gridowner.grid;
	},
	buildQueryPanel : function(){
		var _this = this;
		if(!_this.isQp || !_this.qpField){
			_this.isQp = false;
			_this.queryHeight = 0;
			return;
		}
		_this.queryHeight = 30;
		_this.qpField.xtype = _this.qpField.xtype?_this.qpField.xtype : 'textfield';
		_this.qpField.fieldLabel = _this.qpField.text;
		delete _this.qpField.text;
		_this.qpField.labelStyle = 'text-align:right;';
		_this.qpField.anchor = '95%';
		_this.queryPanel = new Ext.form.FormPanel({
			height : _this.queryHeight,
			layout : 'column',
			items : [{
				layout : 'form',
				columnWidth : 0.8,
				items : [_this.qpField]
			},{
				layout : 'form',
				width : 50,
				items : [{
					xtype : 'button',
					text : '查询',
					style: { marginTop : '5px' },
					handler : function(){
						_this.gridowner.loadFn({
							condition : Ext.encode(_this.queryPanel.getForm().getFieldValues())
						},function(){
							if(_this.innerGrid.rendered && _this.getValue() != ''){
								_this.setValue(_this.getValue());
							}
							_this.afterGridLoad();
						});
					}
				}]
			},{
				layout : 'form',
				width : 50,
				items : [{
					xtype : 'button',
					text : '重置',
					style: { marginTop : '5px' },
					handler : function(){
						_this.queryPanel.getForm().reset();
						_this.gridowner.loadFn({},function(){
							if(_this.innerGrid.rendered && _this.getValue() != ''){
								_this.setValue(_this.getValue());
							}
							_this.afterGridLoad();
						});
					}
				}]
			}]
		});
	}
});
Ext.reg('combogrid', Wlj.widgets.views.module.grid.ComboGrid);