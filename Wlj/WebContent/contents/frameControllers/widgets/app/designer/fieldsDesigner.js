var formCfgMenu = new Ext.menu.Menu( {
	formCfgFn:function(type) {
		var viewType = type+'View';
		var viewHandler = type + 'FormViewer';
		var df = Wlj.frame.functions.preview.DataInterface;
		var selectItems=formCfgGrid.getSelectionModel().getSelections();
		if(selectItems.length<1){
			alert('未选择字段！');
			return false;
		}
		var fields =[];
		Ext.each(selectItems, function(si){
			fields.push(si.data.name);
		});
		var codeLine = [];
		codeLine.push("{\n\t");
		codeLine.push("fields : ['"+fields.join("','")+"'],\n\t");
		codeLine.push("fn : function("+fields.join(",")+"){\n\t\t");
		codeLine.push("return ["+fields.join(",")+"];\n\t");
		codeLine.push("}\n");
		codeLine.push("}");
		if(df[viewHandler].defined){
			var gjson =  codeLine.join('');
			this.addGroup(type, gjson);
			return;
		}
		var fieldObj =eval("("+ '['+codeLine.join('')+']'+")");
		setDateInterfaceValue([viewHandler,viewType],[fieldObj,true]);
		formViewContainer.showCode(type);
	},
	addGroup : function(propertyName,groupJson){
		var groupObject= eval("("+groupJson+")");
		var df = Wlj.frame.functions.preview.DataInterface;
		df.formViewers.addGroup.call(df[propertyName+'FormViewer'],groupObject);
		formViewContainer.showCode(propertyName);
	},
	items : [{
		text : '生成新增面板配置',
		handler : function() {
			this.ownerCt.formCfgFn('create');
		}
	}, {
		text : '生成修改面板配置',
		handler : function() {
			this.ownerCt.formCfgFn('edit');
		}
	},{
		text : '生成详情面板配置',
		handler : function() {
			this.ownerCt.formCfgFn('detail');
		}
	}]
});
var fieldSm = new Ext.grid.CheckboxSelectionModel;
var fieldsStore = new Ext.data.ArrayStore({
	idIndex : 1,
	fields : [{name : 'fieldCode'},
	          {name : 'name'},
	          {name : 'text'}],
	data : []
});
var formCfgGrid = new Ext.grid.GridPanel({
	stripeRows : true,
	tbar : [{
		text : '勾选字段，选择生成的面板代码',
		menu:formCfgMenu
	}],
	store : fieldsStore,
	frame : true,
	sm:fieldSm,
	cm : new Ext.grid.ColumnModel([fieldSm,
	    {header : '字段NAME属性',dataIndex : 'name',width : 125,sortable : true},
	    {header : '字段名称',dataIndex : 'text',width : 150,sortable : true}
	])
});


//************************************************************************************************************************************
fieldPropertiesForm = Ext.extend(Ext.FormPanel, {
	initComponent : function(){
		this.items = [];
		var _this = this;
		var dfFields = Wlj.frame.functions.preview.DataInterface.fields;
		Ext.each(dfFields.arrayModel, function(field){
			var fCfg = {};
			fCfg.name = field.name;
			fCfg.fieldLabel = field.shortComment?field.shortComment:field.name;
			fCfg.anchor = '90%';
			fCfg._defaultValue = field.defaultValue;
			var type = field.type;
			if(type === 'string'){
				fCfg.xtype = 'textfield';
				fCfg.value = Ext.isString(field.defaultValue)?field.defaultValue:null;
			}else if(type === 'int'){
				fCfg.xtype = 'numberfield';
				fCfg.value = Ext.isNumber(field.defaultValue)?field.defaultValue:null;
			}else if(type === 'boolean'){
				fCfg.xtype = 'checkbox';
				fCfg.checked = field.defaultValue;
			}else{
				fCfg.xtype = 'textarea';
			}
			
			if(fCfg.name == 'translateType'){
				fCfg.xtype = 'combo';
				fCfg.valueField = 'key';
				fCfg.displayField = 'value';
				fCfg.forceSelection = true;
				fCfg.triggerAction = 'all';
				fCfg.mode = 'local';
				fCfg.editable = true;
				fCfg.store = new Ext.data.Store({
					restful : true,
					autoLoad : true,
					proxy : new Ext.data.HttpProxy({
						url : basepath + '/lookupMappingQuery.json'
					}),
					reader : new Ext.data.JsonReader({
						root : 'json.data'
					}, [{
						name : 'key',
						mapping :'F_NAME'
					},{
						name : 'value',
						mapping : 'F_COMMENT'
					}])
				});
			}
			
			if(fCfg.name == 'dataType'){
				fCfg.xtype = 'combo';
				fCfg.valueField = 'type';
				fCfg.displayField = 'type';
				fCfg.forceSelection = true;
				fCfg.triggerAction = 'all';
				fCfg.mode = 'local';
				fCfg.editable = true;
				fCfg.store = new Ext.data.ArrayStore({
				    autoDestroy: true,
				    storeId: 'dataTypeStore',
				    idIndex: 0,  
				    fields: [
				       'type'
				    ]
				});
				var typeArray = [];
				for(var key in WLJDATATYPE){
					typeArray.push([key]);
				}
				fCfg.store.loadData(typeArray);
			}
			
			if(fCfg.name == 'innerTree'){
				fCfg.listeners = {};
				fCfg.listeners.focus = function(field){
					TREECFGWINDOW.show();
					TREECFGWINDOW.setInvoker(field);
				};
				fCfg.setTree = function(wholeTree){
					var form = _this.getForm();
					var xtype = form.findField('xtype');
					var innerTree = this;
					var showField = form.findField('showField');
					var hideField = form.findField('hideField');
					xtype.setValue('wcombotree');
					innerTree.setValue(wholeTree.tree.key);
					showField.setValue(wholeTree.loader.textField);
					hideField.setValue(wholeTree.loader.idProperties);
				}
				
			}
			
			_this.items.push(fCfg);
			if(fCfg.name == 'translateType'){
				_this.items.push(new Wlj.designer.CustomerLookup({
					name : 'custLookup',
					anchor:'90%',
					fieldLabel : '自定义字典'
				}));
			}
		});
		
		if(!this.tbar){
			this.tbar = [];
		}
		var _this = this;
		this.tbar.push({
			text : '新建',
			handler : function(){
				_this.getForm().reset();
			}
		},{
			text : '添加到字段配置',
			handler : function(){
				var fields = Wlj.frame.functions.preview.DataInterface.fields;
				var lookupTypes = Wlj.frame.functions.preview.DataInterface.lookupTypes;
				var fieldCfg = _this.getFieldCfg();
				if(Ext.isEmpty(fieldCfg.name)){
					alert('无name属性');
					return false;
				}
				var fcode = fields.addField(fieldCfg);
				if(fieldCfg.custLookup){
					fieldCfg.translateType = fieldCfg.custLookup;
					delete fieldCfg.custLookup;
				}else if(fieldCfg.translateType){
					lookupTypes.addLookup(fieldCfg.translateType);
				}
				codePanel.createCode();
				fieldsStore.loadData([[fcode,fieldCfg.name,fieldCfg.text]],true);
				_this.getForm().reset();
			}
		});
		fieldPropertiesForm.superclass.initComponent.call(this);
	},
	getFieldCfg : function(){
		var _this = this;
		var fields = _this.getForm().items;
		var cfg = {};
		fields.each(function(f){
			if(f.name){
				if(f.xtype == 'checkbox'){
					if(f._defaultValue != (!!f.checked)){
						cfg[f.name] = !!f.checked;
					}
				}else{
					if(!Ext.isEmpty(f.getValue())){
						if(f._defaultValue != f.getValue()){
							cfg[f.name] = f.getValue();
						}
					}
				}
			}
		});
		return cfg;
	}
});

var fieldGridEditor = new Ext.grid.GridPanel({
	region : 'center',
	layout : 'fit',
	stripeRows : true,
	fields : [],
	tbar : [{
		text : '修改',
		handler : function() {
			var selection = fieldGridEditor.getSelectionModel().getSelections();
			if(selection){
				selection = selection[0];
			}else{
				return ;
			}
			var fieldsCfg = Ext.decode(selection.data.fieldCode);
			_fieldPropertiesForm.getForm().reset();
			_fieldPropertiesForm.getForm().setValues(fieldsCfg);
		}
	},{
		text : '删除',
		handler : function(){
			var fields = Wlj.frame.functions.preview.DataInterface.fields;
			var selection = fieldGridEditor.getSelectionModel().getSelections()[0];
			if(selection){
				fields.removeField(fieldsStore.indexOf(selection));
				fieldsStore.remove(selection);
				codePanel.createCode();
			}
		}
	}],
	store : fieldsStore,
	frame : true,
	cm : new Ext.grid.ColumnModel( [{
		header : 'name',
		dataIndex : 'name',
		width : 100
	},{
		header : '对应代码',
		dataIndex : 'fieldCode',
		width : 2000,
		sortable : true,
		hidden : false
	} ])
});
