Ext.ns('Wlj.designer');
Wlj.designer.LookupWindow = Ext.extend(Ext.Window, {
	layout:'border',
	width : 800,
	title : '自定义字典窗口',
	height : 300,
	closeAction : 'hide',
	initComponent : function(){
		Wlj.designer.LookupWindow.superclass.initComponent.call(this);
		this.remoteLookup = new Ext.form.FormPanel({
			frame : true,
			layout : 'form',
			region:'east',
			width : 300,
			items : [{
				xtype : 'textfield',
				fieldLabel : '<font color=red>*</font>TYPE',
				anchor:'90%',
				name : 'TYPE'
			},{
				xtype : 'textfield',
				fieldLabel : 'url',
				anchor:'90%',
				name : 'url'
			},{
				xtype : 'textfield',
				fieldLabel : 'key',
				anchor:'90%',
				name : 'key'
			},{
				xtype : 'textfield',
				fieldLabel : 'value',
				anchor:'90%',
				name : 'value'
			},{
				xtype : 'textfield',
				fieldLabel : 'jsonRoot',
				anchor:'90%',
				name : 'jsonRoot'
			}]
		});
		this.localLookup = new Ext.form.FormPanel({
			frame : true,
			region : 'center',
			width : 500,
			items : [{
				xtype : 'textfield',
				fieldLabel : '<font color=red>*</font>TYPE',
				anchor:'90%',
				name : 'TYPE'
			},{
				xtype : 'textarea',
				fieldLabel : '<font color=red>*</font>datas',
				anchor:'90%',
				name : 'data'
			}]
		});
		this.add(this.remoteLookup);
		this.add(this.localLookup);
		var _this = this;
		this.addButton({text: '保存'},function(){
			_this.svLookup();
			_this.hide();
		});
	},
	svLookup:function(){
		var localLookup = this.localLookup.getForm().getValues();
		var lookupTypes = this.remoteLookup.getForm().getValues();
		if(this.validateLocal(localLookup)){
			if(this.checkExsit(localLookup.TYPE) === 'lookupTypes'){//远程字典已存在相同的字典TYPE
				return false;
			}else{
				this.svLocal(localLookup);
				codePanel.createCode();
				this.ownerField.setValue(localLookup.TYPE);
			}
		}
		if(this.validateRemote(lookupTypes)){
			if(this.checkExsit(lookupTypes.TYPE) === 'localLookup'){//本地字典已存在相同的字典TYPE
				return false;
			}else {
				this.svRemote(lookupTypes);
				codePanel.createCode();
				this.ownerField.setValue(lookupTypes.TYPE);
			}
		}
		return false;
	},
	svLocal : function(config){
		var localLookup = Wlj.frame.functions.preview.DataInterface.localLookup;
		var localLook = {};
		localLook[config.TYPE] = eval(config.data);
		localLookup.addLookup(localLook);
	},
	validateLocal : function(config){
		if(!config.TYPE || !Ext.isString(config.TYPE)){
			return false;
		}
		if(!config.data){
			return false;
		}
		try{
			var dataArray = eval(config.data);
			if(Ext.isArray(dataArray)){
				return true;
			}
			return false;
		}catch(error){
			return false;
		}
	},
	svRemote : function(config){
		var lookupTypes = Wlj.frame.functions.preview.DataInterface.lookupTypes;
		lookupTypes.addLookup(config);
	},
	validateRemote : function(lookup){
		if(!lookup.TYPE || !Ext.isString(lookup.TYPE)){
			return false;
		}
		if(lookup.url){//远程URL字典
			if(lookup.key && lookup.value){
				return true;
			}else return false;
		}
	},
	checkExsit : function(lookupType){
		var lookupTypes = Wlj.frame.functions.preview.DataInterface.lookupTypes;
		if(lookupTypes.checkExsit(lookupType)){
			return 'lookupTypes';
		}
		var localLookup = Wlj.frame.functions.preview.DataInterface.localLookup;
		if(localLookup.checkExsit(lookupType)){
			return 'localLookup';
		}
		return false;
	}
});

Wlj.designer.CustomerLookup = Ext.extend(Ext.form.TwinTriggerField, {
	trigger1Class:'x-form-clear-trigger',
	trigger2Class:'x-form-search-trigger',
	hideTrigger1:true,
	onTrigger2Click : function(){
		if(!this.lookupWindow){
			this.lookupWindow = new Wlj.designer.LookupWindow({
				ownerField : this
			});
		}
		this.lookupWindow.show();
	}
});


