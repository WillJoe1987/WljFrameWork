TREESGRID = new Ext.grid.GridPanel({
	width : 200,
	region : 'west',
	title : '双击选择,单击修改',
	tbar : [{
		text : '删除',
		handler : function(){
			var sm = TREESGRID.getSelectionModel();
			if(!sm.hasSelection()) return false;
			TREESGRID.store.remove(sm.getSelected());
		}
	}],
	store : new Ext.data.Store({
		reader : new Ext.data.JsonReader({
			idProperty : 'key',
			fields : [{
				name : 'key'
			},{
				name : 'loaderKey'
			}]
		}),
		listeners : {
			update : function(store, records, index){
				var cl = Wlj.frame.functions.preview.DataInterface.treeCfgs;
				cl.mergerTreeCfg(records.data);
				codePanel.createCode();
			},
			add : function(store, records, index){
				var cl = Wlj.frame.functions.preview.DataInterface.treeCfgs;
				Ext.each(records, function(r){
					cl.mergerTreeCfg(r.data);
				});
				codePanel.createCode();
			},
			remove : function(store, records, index){
				var key = records.get('key');
				var cl = Wlj.frame.functions.preview.DataInterface.treeCfgs;
				cl.removeTreeCfg(key);
				codePanel.createCode();
			}
		}
	}),
	columns : [{
		header : 'key', width : 198, dataIndex : 'key'
	}],
	sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
	frame : true,
	listeners : {
		rowclick : function(grid, index, event){
			var record = grid.store.getAt(index);
			if(CONFIGURATIONPANEL.getLayout().activeItem === TREECFGPANEL){
				TREECFGPANEL.getForm().loadRecord(record);
				return;
			}
		},
		rowdblclick : function(grid, index, event){
			var record = grid.store.getAt(index);
			var cl = Wlj.frame.functions.preview.DataInterface.treeLoaders;
			var loader = cl.checkExsit(record.get('loaderKey'));
			if(!loader) return false;
			var wholeTreeCfg = {};
			wholeTreeCfg.tree = record.data;
			wholeTreeCfg.loader = loader;
			TREECFGWINDOW.getInvoker().setTree(wholeTreeCfg);
			TREECFGWINDOW.hide();
		}
	}
});
LOADSGRID = new Ext.grid.GridPanel({
	width : 200,
	region : 'east',
	title : 'LOADER列表',
	tbar : [{
		text : '删除',
		handler : function(){
			var sm = LOADSGRID.getSelectionModel();
			if(!sm.hasSelection()) return false;
			LOADSGRID.store.remove(sm.getSelected());
		}
	}],
	store : new Ext.data.Store({
		reader : new Ext.data.JsonReader({
			idProperty : 'key',
			fields : [{
				name : 'key'
			},{
				name : 'url'
			},{
				name : 'parentAttr'
			},{
				name : 'idProperties'
			},{
				name : 'textField'
			},{
				name : 'rootValue'
			}]
		}),
		listeners : {
			update : function(store, records, index){
				var cl = Wlj.frame.functions.preview.DataInterface.treeLoaders;
				cl.mergerLoader(records.data);
				codePanel.createCode();
			},
			add : function(store, records, index){
				var cl = Wlj.frame.functions.preview.DataInterface.treeLoaders;
				Ext.each(records, function(r){
					cl.mergerLoader(r.data);
				});
				codePanel.createCode();
			},
			remove : function(store, records, index){
				var key = records.get('key');
				var cl = Wlj.frame.functions.preview.DataInterface.treeLoaders;
				cl.removeLoader(key);
				codePanel.createCode();
			}
		}
	}),
	columns : [{
		header : 'key', width : 198, dataIndex : 'key'
	}],
	sm: new Ext.grid.RowSelectionModel({
		singleSelect:true
	}),
	frame : true,
	listeners : {
		rowclick :function(grid, index, event){
			var record = grid.store.getAt(index);
			if(CONFIGURATIONPANEL.getLayout().activeItem === TREECFGPANEL){
				TREECFGPANEL.getForm().findField('loaderKey').setValue(record.get('key'));
				return;
			}
			if(CONFIGURATIONPANEL.getLayout().activeItem === LOADCFGPANEL){
				LOADCFGPANEL.getForm().loadRecord(record);
				return;
			}
		}
	}
});
TREECFGPANEL = new Ext.form.FormPanel({
	title : '树形面板配置',
	items : [{
		xtype : 'textfield',
		fieldLabel : 'KEY',
		name : 'key',
		anchor : '90%',
		allowBlank : false
	},{
		xtype : 'textfield',
		fieldLabel : 'LOADER(点选左侧loader列表)',
		name : 'loaderKey',
		anchor : '90%',
		readOnly : true,
		allowBlank : false
	}],
	buttons : [{
		text : '保存',
		handler : function(){
			if(TREECFGPANEL.getForm().isValid()){
		 		var values = TREECFGPANEL.getForm().getValues();
		 		var key =  values.key;
		 		var oraginalRecord = TREESGRID.store.getById(key);
		 		if(!oraginalRecord)
		 			TREESGRID.store.add(TREESGRID.store.reader.readRecords(values).records);
		 		else{
		 			oraginalRecord.beginEdit();
		 			oraginalRecord.set('loaderKey',values.loaderKey);
		 			oraginalRecord.endEdit();
		 		}
		 		 TREECFGPANEL.getForm().reset();
		 	}
		}
	}]
});
LOADCFGPANEL = new Ext.form.FormPanel({
	title : 'LOADER配置',
	items : [{
		xtype : 'textfield',
		fieldLabel : 'KEY',
		name : 'key',
		anchor : '90%',
		allowBlank : false
	},{
		xtype : 'textfield',
		fieldLabel : 'URL',
		name : 'url',
		anchor : '90%',
		allowBlank : false
	},{
		xtype : 'textfield',
		fieldLabel : '父节点字段',
		name : 'parentAttr',
		anchor : '90%',
		allowBlank : false
	},{
		xtype : 'textfield',
		fieldLabel : '主键字段',
		name : 'idProperties',
		anchor : '90%',
		allowBlank : false
	},{
		xtype : 'textfield',
		fieldLabel : '中文名字段',
		name : 'textField',
		anchor : '90%',
		allowBlank : false
	},{
		xtype : 'textfield',
		fieldLabel : '根节点值',
		name : 'rootValue',
		anchor : '90%',
		allowBlank : false
	}],
	buttons : [{
		text : '保存',
		handler : function(){
		 	if(LOADCFGPANEL.getForm().isValid() ){
		 		var values = LOADCFGPANEL.getForm().getValues();
		 		var key =  values.key;
		 		var oraginalRecord = LOADSGRID.store.getById(key);
		 		if(!oraginalRecord)
		 			LOADSGRID.store.add(LOADSGRID.store.reader.readRecords(values).records);
		 		else{
		 			oraginalRecord.beginEdit();
		 			oraginalRecord.set('url',values.url);
		 			oraginalRecord.set('parentAttr',values.parentAttr);
		 			oraginalRecord.set('idProperties',values.idProperties);
		 			oraginalRecord.set('textField',values.textField);
		 			oraginalRecord.set('rootValue',values.rootValue);
		 			oraginalRecord.endEdit();
		 		}
		 		LOADCFGPANEL.getForm().reset();
		 	}
		}
	}]
});

CONFIGURATIONPANEL = new Ext.Panel({
	region : 'center',
	layout : 'accordion',
	items : [LOADCFGPANEL,TREECFGPANEL]
});


TREECFGWINDOW = new Ext.Window({
	width : 1000,
	height : 500,
	closeAction : 'hide',
	layout : 'border',
	items : [TREESGRID,LOADSGRID,CONFIGURATIONPANEL],
	setInvoker : function( object){
		TREECFGWINDOW.invoker = object;
	},
	getInvoker : function(){
		if(!this.invoker){
			return {
				setTree : Ext.emptyFn
			};
		}else if(!Ext.isFunction(this.invoker.setTree)){
			this.invoker.setTree = Ext.emptyFn;
			return this.invoker;
		}else return this.invoker;
	},
	clearInvoker : function(){
		this.invoker = false;
	},
	listeners : {
		hide : function(window){
			window.clearInvoker();
		}
	}
});