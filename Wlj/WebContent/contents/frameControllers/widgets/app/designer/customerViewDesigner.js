fieldsAddWindow = Ext.extend(Ext.Window,{
	layout:'border',
	width : 800,
	title : '自定义字段',
	height : 500,
	closeAction : 'hide',
	initComponent : function(){
		fieldsAddWindow.superclass.initComponent.call(this);
		var _this = this;
		this.gridField = new Ext.util.MixedCollection();
		
		var fieldSm = new Ext.grid.CheckboxSelectionModel({
			listeners : {
				rowselect : function(sm, index, record){
					_this.addField(record.get('name'));
				},
				rowdeselect : function(sm, index, record){
					_this.removeField(record.get('name'));
				}
			}
		});
		this.currentFields = new Ext.grid.GridPanel({
			stripeRows : true,
			store : fieldsStore,
			frame : true,
			region : 'west',
			title : '元数据字段',
			width : 200,
			sm:fieldSm,
			cm : new Ext.grid.ColumnModel([fieldSm,
			    {header : 'NAME属性',dataIndex : 'name',width : 100,sortable : true},
			    {header : '字段名称',dataIndex : 'text',width : 100,sortable : true}
			])
		});
		this.add(this.currentFields);
		this.fieldForm = new Ext.FormPanel({
			frame : true,
			title : '自定义字段',
			layout : 'column',
			items : [{
				columnWidth : .5,
				layout : 'form',
				items : [{
					xtype : 'textfield',
					fieldLabel : 'NAME',
					name : 'name'
				},{
					xtype : 'textfield',
					fieldLabel : 'TEXT',
					name : 'text'
				}]
			},{
				columnWidth : .5,
				layout : 'form',
				items : [{
					xtype : 'textfield',
					fieldLabel : 'translateType',
					name : 'translateType'
				}]
			}],
			buttons : [{
				text : 'add',
				handler : function(){
					var fieldCfg = _this.fieldForm.getForm().getValues();
					_this.addField(_this.fieldForm.getForm().getValues());
				}
			},{
				text : 'remove',
				handler : function(){
					_this.removeField(_this.fieldForm.getForm().findField('name').getValue());
				}
			}]
		});
		this.fieldScript = new Wlj.functions.preview.util.BasicEditor();
		
		this.add(new Ext.Panel({
			region: 'center',
			layout : 'form',
			items : [this.fieldForm,this.fieldScript]
		}));
	},
	addField : function(fieldName){
		if(this.checkExsit(fieldName)){
			return false;
		}
		if(Ext.isString(fieldName)){
			this.gridField.add(fieldName,fieldName);
			this.refreshCode();
			return true;
		}else if(Ext.isObject(fieldName)){
			this.gridField.add(fieldName.name, fieldName);
			this.refreshCode();
			return true;
		}else return false;
	},
	removeField : function(field){
		if(Ext.isString(field)){
			if(this.checkExsit(field)){
				this.gridField.removeKey(field);
				this.refreshCode();
				return true;
			}else if(Ext.isObject(field)){
				if(this.checkExsit(field)){
					this.gridField.removeKey(field.name);
					this.refreshCode();
					return true;
				}
			}else if(Ext.isNumber(field)){
				if(field<this.gridField.getCount()){
					this.gridField.removeAt(field);
					this.refreshCode();
					return true;
				}
			}
		}
		return false;
	},
	checkExsit : function(field){
		var fieldName;
		if(Ext.isString(field)){
			fieldName = field;
		}else if(Ext.isObject(field) && field.name){
			fieldName = field.name;
		}else return true;
		if(this.gridField.get(fieldName)){
			return true;
		}
		return false;
	},
	refreshCode : function(){
		var code = '[\n\t';
		var codeArray = [];
		this.gridField.each(function(gf){
			if(typeof gf === 'string'){
				codeArray.push('"'+gf+'"');
			}else if(typeof gf === 'object'){
				codeArray.push(Ext.encode(gf));
			}
		});
		code += codeArray.join(',\n\t');
		code += '\n]';
		this.fieldScript.setCode(code);
	},
	listeners : {
		hide : function( thisWindow){
			thisWindow.ownerField.setValue(thisWindow.fieldScript.getCode());
			thisWindow.fieldForm.getForm().reset();
			thisWindow.fieldScript.setCode('');
		},
		show : function( thisWindow){
			var _this = this;
			var fields = eval(thisWindow.ownerField.getValue());
			Ext.each(fields, function(field){
				_this.addField(field);
			});
			this.refreshCode();
		}
	}
});

fieldCreatorArea = Ext.extend(Ext.form.TextArea, {
	listeners : {
		focus : function(ta){
			if(!this.fieldsEditWindow){
				this.fieldsEditWindow = new fieldsAddWindow({
					ownerField : this
				});
			}
			this.fieldsEditWindow.show();
		}
	}
});

customerViewStore = new Ext.data.ArrayStore({
	autoDestroy: true,
	fields: [
	         {name: 'title', type: 'string'}
	         ],
	listeners : {
		add : function(store, records, index){
			customerViewDisigner.refreshStatus();
			Ext.each(records, function(record){
				var cv = Wlj.frame.functions.preview.DataInterface.customerView;
				cv.addPanel(record.get('title'));
			});
			codePanel.createCode();
		},
		update : function(store, record, option){
			var index = store.indexOf(record);
			var cv = Wlj.frame.functions.preview.DataInterface.customerView;
			cv.updatePanel(index, record.get('title'));
			codePanel.createCode();
		},
		remove : function(store, record, index){
			var cv = Wlj.frame.functions.preview.DataInterface.customerView;
			cv.removePanel(index);
			codePanel.createCode();
		}
	}
});

customerViewCm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false         
    },
    columns: [{
        id: 'commoncustomve',
        header: '面板名称',
        dataIndex: 'title',
        width: 220,
        editor: new Ext.form.TextField({
            allowBlank: false
        })
    }]
});

customerViewGrid = new Ext.grid.EditorGridPanel({
    store: customerViewStore,
    cm: customerViewCm,
    autoExpandColumn : 'commoncustomve',
    frame: true,
    clicksToEdit: 1,
    columnWidth: .15,
    height : 400,
    tbar: [{
        text: '添加面板',
        handler : function(){
            var Plant = customerViewGrid.getStore().recordType;
            var p = new Plant({
                title: '自定义面板'+customerViewStore.getCount()
            });
            customerViewStore.add(p);
            customerViewGrid.fireEvent('rowclick',customerViewGrid,customerViewStore.getCount()-1);
            customerViewDisigner.refreshStatus();
        }
    },{
    	text : '删除面板',
    	handler : function(){   	
    		customerViewGrid.store.removeAt(customerViewDisigner.cvIndex);
    		customerViewDisigner.refreshStatus();
    		delete customerViewDisigner.cvIndex;
    	}
    }],
    listeners : {
		rowclick : function(grid, index ,event){
			customerViewDisigner.refreshStatus();
			customerViewDisigner.cvIndex = index;
			var cv = Wlj.frame.functions.preview.DataInterface.customerView;
			var viewCfg = cv.value[index];
			if(viewCfg.type == 'grid'){
				customerViewDisigner.items.itemAt(0).setValue(1);
				var form = GIRDVIEW.getForm();
				form.reset();
				form.setValues({
					url : viewCfg.url,
					fields : viewCfg.fields.fields.coding()
				});
			}else if(viewCfg.type == 'form'){
				customerViewDisigner.items.itemAt(0).setValue(2);
				var form = FORMVIEW.getForm();
				form.reset();
				while(form.findField('fields')){
					FORMVIEW.remove(form.findField('fields'));
				}
				var groups = viewCfg.groups;
				Ext.each(groups, function(g){
					var f = FORMVIEW.add(new fieldCreatorArea({
						fieldLabel : '一个分组',
						name : 'fields',
						anchor : '90%'
					}));
					f.setValue(g.fields.coding());
				});
				FORMVIEW.doLayout();
			}else if(viewCfg.type == 'none'){
				customerViewDisigner.items.itemAt(0).setValue(3);
				var thecfg = {};
				Ext.apply(thecfg, viewCfg);
				delete thecfg.title;
				NONEVIEW.setCode(Object.coding(thecfg));
			}
		}
	}
});

customerViewOfGrid = Ext.extend(Ext.FormPanel, {
	frame : true,
	initComponent : function(){
		var _this = this;
		this.tbar = [{
			text : '构建代码',
			handler : function(){
				var gridConfigs = _this.getForm().getValues();
				if(Ext.isEmpty(gridConfigs.url)){
					alert('no url');
					return false;
				}
				var fields = false;
				try{
					fields = eval(gridConfigs.fields);
				}catch(error){
					alert('fields error');
					return false;
				}
				if(!Ext.isArray(fields) || fields.length <1){
					alert('no fields');
					return false
				}
				var gridCfg = {};
				gridCfg.url = gridConfigs.url;
				gridCfg.fields = {};
				gridCfg.fields.fields = fields;
				gridCfg.type = 'grid';
				var panelIndex = customerViewDisigner.cvIndex;
				var title = customerViewStore.getAt(panelIndex).get('title');
				var cv = Wlj.frame.functions.preview.DataInterface.customerView;
				cv.updatePanel(panelIndex,title,gridCfg);
				codePanel.createCode();
			}
		}];
		customerViewOfGrid.superclass.initComponent.call(this);
		if(!this.items){
			this.items = [];
		}
		var url = new Ext.form.TextField({
			name : 'url',
			fieldLabel : 'URL',
			anchor : '90%'
		});
		this.add(url);
		var fields = new fieldCreatorArea({
			name : 'fields',
			fieldLabel : '字段列表',
			anchor : '90%'
		});
		this.add(fields);
	}
});
customerViewOfForm = Ext.extend(Ext.FormPanel, {
	frame : true,
	initComponent : function(){
		if(!this.tbar){
			this.tbar = [];
		}
		var _this = this;
		this.tbar.push(new Ext.Button({
			text : '添加分组',
			handler : function(){
				_this.add(new fieldCreatorArea({
					name : 'fields',
					fieldLabel : '又一个分组',
					anchor : '90%'
				}));
				_this.doLayout();
			}
		}));
		this.tbar.push(new Ext.Button({
			text : '构建代码',
			handler : function(){
				var formConfig = _this.getForm().getValues();
				var groups = [];
				
				function buildGroup(fieldString){
					var thefields = false;
					try{
						thefields = eval(fieldString);
					}catch(error){
						alert('fields error');
						return false;
					}
					if(!Ext.isArray(thefields) || thefields.length <1){
						alert('no fields');
						return false
					}
					var theGroupCfg = {};
					theGroupCfg.fields = thefields;
					return theGroupCfg;
				}
				if(Ext.isString(formConfig.fields)){
					var farray = buildGroup(formConfig.fields);
					if(farray){
						groups.push(farray);
					}
				}else if(Ext.isArray(formConfig.fields)){
					Ext.each(formConfig.fields, function(thefields){
						var farray = buildGroup(thefields);
						if(farray){
							groups.push(farray);
						}
					});
				}
				if(groups.length < 1){
					alert('no field groups');
					return false;
				}
				var formCfg = {};
				formCfg.type = 'form';
				formCfg.groups = groups;
				var panelIndex = customerViewDisigner.cvIndex;
				var title = customerViewStore.getAt(panelIndex).get('title');
				var cv = Wlj.frame.functions.preview.DataInterface.customerView;
				cv.updatePanel(panelIndex,title,formCfg);
				codePanel.createCode();
			}
		}));
		customerViewOfForm.superclass.initComponent.call(this);
		if(!this.items){
			this.items = [];
		}
		var fields = new fieldCreatorArea({
			name : 'fields',
			fieldLabel : '分组1',
			anchor : '90%'
		});
		this.add(fields);
	}
});
var GIRDVIEW = new customerViewOfGrid({
	hidden : true
});
var FORMVIEW = new customerViewOfForm({
	hidden : true
});
var NONEVIEW = new Wlj.functions.preview.util.BasicEditor({
	tbar : [{
		text : '构建代码',
		handler : function(){
			var obj = false;
			try{
				obj = Ext.decode(NONEVIEW.getCode());
			}catch(error){
				alert(error.message);
				return false;
			}
			var panelIndex = customerViewDisigner.cvIndex;
			var title = customerViewStore.getAt(panelIndex).get('title');
			var cv = Wlj.frame.functions.preview.DataInterface.customerView;
			obj.type = 'none';
			cv.updatePanel(panelIndex,title,obj);
			codePanel.createCode();
		}
	}]
});

customerViewDisigner = new Ext.Panel({
	title : '视图设计',
	frame : true,
	columnWidth : .85,
	autoHeight : true,
	layout : 'form',
	items : [{
		xtype : 'radiogroup',
		fieldLabel : '面板类型',
		anchor : '50%',
		items : [{
			boxLabel: 'grid', name: 'rb-auto', inputValue: 1
		},{
			boxLabel: 'form', name: 'rb-auto', inputValue: 2
		},{
			boxLabel: 'none', name: 'rb-auto', inputValue: 3, checked:true
		}],
		listeners : {
			change : function(group,radio){
				var theType = radio.inputValue;
				GIRDVIEW.hide();
				FORMVIEW.hide();
				NONEVIEW.hide();
				customerViewDisigner.items.itemAt(theType).show();
				if(theType == 1){
					customerViewDisigner.viewType = 'grid';
				}else if(theType == 2){
					customerViewDisigner.viewType = 'form';
				}else {
					customerViewDisigner.viewType = 'none';
				}
			}
		}
	},GIRDVIEW,FORMVIEW,NONEVIEW],
	refreshStatus : function(){
		GIRDVIEW.hide();
		GIRDVIEW.getForm().reset();
		FORMVIEW.hide();
		FORMVIEW.getForm().reset();
		NONEVIEW.show();
		NONEVIEW.setCode('');
		this.viewType = 'none';
		this.items.itemAt(0).setValue(3);
	}
});



