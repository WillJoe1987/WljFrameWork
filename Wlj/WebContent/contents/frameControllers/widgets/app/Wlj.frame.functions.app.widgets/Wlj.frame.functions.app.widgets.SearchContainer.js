Ext.ns('Wlj.frame.functions.app.widgets');
/**
 * 页面查询条件面板类
 */
Wlj.frame.functions.app.widgets.SearchContainer = Ext.extend(Ext.Panel,{
	vs : false,
	columnCount : 4,
	layout : 'fit',
	WCLP : false,
	needCloseLable4DCF : false,
	multiSelectSeparator : false,
	dyfield : new Array(),
	buttonCfg : {},
	initComponent : function(){
		var _this = this;
		_this._APP.fireEvent('beforeconditioninit',_this,_this._APP);
		this.height = this.vs.height;
		this.width = this.vs.width;
		Wlj.frame.functions.app.widgets.SearchContainer.superclass.initComponent.call(this);
		_this._APP.fireEvent('afterconditioninit',_this,_this._APP);
		_this._APP.fireEvent('beforeconditionrender',_this, _this._APP);
	},
	onRender : function(ct, position){
		var vs =  this.vs;
		var _this = this;
		var columnCount = 0;
		if(vs.width > 1024){
			columnCount = 4;
		} else {
			columnCount = 3;
		}
		this.columnCount = columnCount;
		this.createColumnItems(columnCount);
		Wlj.frame.functions.app.widgets.SearchContainer.superclass.onRender.call(this,ct,position);
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
		_this._APP.fireEvent('afterconditionrender',_this, _this._APP);
	},
	destroy : function(){
		this.dyfield = [];
		this.purgeListeners();
		this.itemsArray = null;
		this.searchPanel.purgeListeners();
		this.searchPanel = null;
		for(var key in this.buttonCfg){
			this[key+'Button'] = null;
			delete this[key+'Button'];
		}
		this.buttonCfg = {};
		this.DropZone.destroy();
		Wlj.frame.functions.app.widgets.SearchContainer.superclass.destroy.call(this);
	},
	initEvents : function(){
		this.addEvents({
			beforeconditionadd : true,
			conditionadd : true,
			beforeconditionremove : true,
			conditionremove : true,
			beforedyfieldclear : true,
			afterdyfieldclear : true,
			beforecondtitionfieldvalue : true,
			condtitionfieldvalue : true
		});
	},
	createColumnItems : function(columnCount){
		var _this = this;
		var items = this.items;
		if(!items){
			return false;
		}
		if(columnCount<1){
			return false;
		}
		var columns = new Array();
		for(var i = 0; i<columnCount;i++){
			var columnCfg = {};
			columnCfg.layout = 'form';
			columnCfg.defaultType = 'textfield';
			columnCfg.columnWidth = 1/columnCount;
			columnCfg.items = [];
			Ext.each(this.itemsArray,function(it){
				if(it.dataType && WLJDATATYPE[it.dataType]){
					it.xtype = WLJDATATYPE[it.dataType].getFieldXtype();
					Ext.applyIf(it, WLJDATATYPE[it.dataType].getFieldSpecialCfg());
				}
				if(_this.itemsArray.indexOf(it) % columnCount == i){
					if(it.cAllowBlank === false || it.allowBlank === false){
						it.allowBlank = false;
						it.fieldLabel = WLJTOOL.addBlankFlag(it.text);
					}
					it.anchor = '90%';
					columnCfg.items.push(it);
				}
			});
			columns.push(columnCfg);
		}
		var buttonCfg = _this.buttonCfg;
		var buttons = [];
		for(var key in buttonCfg){
			var cfg = {};
			Ext.apply(cfg,buttonCfg[key]);
			cfg.handler = buttonCfg[key].fn.createDelegate(this);
			_this[key+'Button'] = new Ext.Button(cfg);
			buttons.push(_this[key+'Button']);
		}
		
		_this.searchPanel = new Ext.form.FormPanel({
			frame : true,
			layout : 'column',
			items : columns,
			buttons : buttons,
			listeners : {
				'afterrender' : function(){
					_this.createDynaticSearchTarget();
					this.el.on('keydown',function(e,t,o){
						if(!e.ctrlKey && !e.altKey && e.keyCode === e.ENTER){
							e.stopEvent();
							_this.searchHandler();
						}
					});
				}
			}
		});
		_this.add(_this.searchPanel) ;
	},
	hasConditionButton : function(btn){
		if (this[btn+'Button'] && this.searchPanel.buttons.indexOf(this[btn+'Button'])> -1) {
			return true;
		}
		return false;
	},
	enableConditionButton : function(btn){
		if (this.hasConditionButton(btn)) {
			this[btn+'Button'].enable();
		}
	},
	disableConditionButton : function(btn){
		if (this.hasConditionButton(btn)) {
			this[btn+'Button'].disable();
		}
	},
	showConditionButton : function(btn){
		if (this.hasConditionButton(btn)) {
			this[btn+'Button'].show();
		}
	},
	hideConditionButton : function(btn){
		if (this.hasConditionButton(btn)) {
			this[btn+'Button'].hide();
		}
	},
	getNumberedColumn : function(max_min){
		var _this = this;
		var res = true;//true:取最大长度；false：取最小长度；
		if(max_min){
			res = true;
		}else{
			res = false;
		}
		var p = _this.searchPanel;
		var resi = 0;
		p.items.each(function(c){
			if(c.xtype !== 'hidden' && c.items){
				if(res && c.items.getCount() > p.get(resi).items.getCount()){
					resi = p.items.indexOf(c);
				}else if(!res &&  c.items.getCount() < p.get(resi).items.getCount()){
					resi = p.items.indexOf(c);
				}
			}
		});
		return resi;
	},
	fixSearchHeight : function(){
		var _this = this;
		var count = _this.searchPanel.items.get(_this.getNumberedColumn(true)).items.getCount();
		_this._APP.setSearchSize({
			height : 39 + 33 * count + 6 + (_this.title?27:0)
		});
	},
	removeAllDyField : function(){
		if(this.dyfield.length == 0){
			return false;
		}
		var clearable = this.fireEvent('beforedyfieldclear', this, this.searchPanel, this.dyfield);
		if(clearable === false){
			return false;
		}
		while(this.dyfield.length>0){
			var df = this.dyfield.pop();
			df.ownerCt.remove(df);
		}
		this.searchPanel.doLayout();
		this.fixSearchHeight();
		this.fireEvent('afterdyfieldclear', this, this.searchPanel, this.dyfield);
	},
	createDynaticSearchTarget : function(){
		var _this = this;
		this.DropZone = new Ext.dd.DropTarget(_this.searchPanel.el.dom, {
			ddGroup : 'searchDomainDrop',
			notifyDrop  : function(ddSource, e, data){
				var dataInfo = data.tile.data;
				if(dataInfo.name){
					var targetField = _this.addField(dataInfo.name);
					if(targetField.setValue){
						var setAble = _this.fireEvent('beforecondtitionfieldvalue',targetField,dataInfo,dataInfo.value);
						if(setAble){
							targetField.setValue(dataInfo.value);
							_this.fireEvent('condtitionfieldvalue',targetField,dataInfo,dataInfo.value);
						}
					}
					if(Ext.isString(dataInfo.text)){
						targetField.setLabelText(dataInfo.text);
					}
				}
			}
		});	
	},
	addField : function(fieldCfg){
		var _this = this;
		var targetField = _this.searchPanel.getForm().findField(fieldCfg);
		if(!targetField){
			var fCfg = this.getFieldCfg(fieldCfg);
			if(!fCfg) return false;
			var columnIndexT = _this.getNumberedColumn(false);
			var addable = _this.fireEvent('beforeconditionadd',fCfg,columnIndexT,_this.searchPanel);
			if(addable === false){
				return false;
			}
			var targetField = _this.searchPanel.items.get(columnIndexT).add(fCfg);
			_this.dyfield.push(targetField);
			_this.searchPanel.doLayout();
		}
		return targetField;
	},
	getFieldCfg : function(fieldCfg){
		var _this = this;
		if(Ext.isString(fieldCfg)){
			var f = _this._APP.getFieldsByName(fieldCfg);
			if(!f){
				return false;
			}
			var fCfg = _this.formatFieldCfg(f);
			return fCfg;
		}else{
			var fCfg = _this.formatFieldCfg(fieldCfg);
			return fCfg;
		}
	},
	formatFieldCfg : function(f){
		var _this = this;
		var fCfg = {};
		if(f.translateType){
			fCfg.xtype = f.multiSelect?'lovcombo':'combo';
			fCfg.store = _this._APP.lookupManager[f.translateType];
			if(!fCfg.store){
				Ext.error('字段【'+f.text+'】数据字典映射项store【'+f.translateType+'】获取错误，请检查[lookupTypes|localLookup]项配置');
				return false;
			}
			fCfg.valueField = 'key';
			fCfg.displayField = 'value';
			fCfg.editable = typeof f.editable === 'boolean' ? f.editable : false;
			fCfg.forceSelection = true;
			fCfg.triggerAction = 'all';
			fCfg.mode = 'local';
			fCfg.hiddenName = f.name;
			fCfg.separator = f.multiSeparator?f.multiSeparator:_this.multiSelectSeparator;
		}else{
			fCfg.name = f.name;
			if(f.dataType && WLJDATATYPE[f.dataType]){
				fCfg.xtype = WLJDATATYPE[f.dataType].getFieldXtype();
				Ext.applyIf(fCfg, WLJDATATYPE[f.dataType].getFieldSpecialCfg());
			}
		}
		fCfg.fieldLabel = f.text ? f.text : f.name;
		fCfg.anchor = '90%';
		Ext.applyIf(fCfg, f);
		delete fCfg.allowBlank;
		if(f.cAllowBlank === false){
			fCfg.allowBlank = false;
			fCfg.fieldLabel = WLJTOOL.addBlankFlag(f.text);
		}
		fCfg.listeners = {
			'afterrender':function(fitem){
				if(_this.needCloseLable4DCF){
					var rTemplate = new Ext.Template(
					'<div class="del-searchField"></div>');
					var t = rTemplate.insertFirst(fitem.el.parent());
					fitem.closeLabel = t;
					t.style.zIndex = 15000;
					t.onclick = function(){
						_this.removeField(fitem);
					};
				}
				_this.fixSearchHeight();
				_this.fireEvent('conditionadd',fitem,_this.searchPanel);
			}
		};
		return fCfg;
	},
	removeField : function(field){
		var _this = this;
		if(Ext.isString(field)){
			var fieldOb = this.searchPanel.getForm().findField(field);
			if(fieldOb){
				var removeable = _this.fireEvent('beforeconditionremove',fieldOb,_this.searchPanel);
				if(removeable === false){
					return false;
				}
				_this.dyfield.remove(fieldOb);
				fieldOb.ownerCt.remove(fieldOb);
				_this.searchPanel.doLayout();
				_this.fixSearchHeight();
				_this.fireEvent('conditionremove',_this.searchPanel);
			}
		}else if(Ext.isObject(field) && field.ownerCt){
			var removeable = _this.fireEvent('beforeconditionremove',field,_this.searchPanel);
			if(removeable === false){
				return false;
			}
			_this.dyfield.remove(field);
			field.ownerCt.remove(field);
			_this.searchPanel.doLayout();
			_this.fixSearchHeight();
			_this.fireEvent('conditionremove',_this.searchPanel);
		}else if(Ext.isObject(field) && !field.ownerCt){
			if(!field.name){
				return false;
			}
			var fieldOb = this.searchPanel.getForm().findField(field.name);
			if(fieldOb){
				var removeable = _this.fireEvent('beforeconditionremove',fieldOb,_this.searchPanel);
				if(removeable === false){
					return false;
				}
				_this.dyfield.remove(fieldOb);
				fieldOb.ownerCt.remove(fieldOb);
				_this.searchPanel.doLayout();
				_this.fixSearchHeight();
				_this.fireEvent('conditionremove',_this.searchPanel);
			}
		}else{
			return false;
		}
		
	},
	getField : function(field){
		var _this = this;
		if(Ext.isString(field)){
			return this.searchPanel.getForm().findField(field);
		}else if(Ext.isObject(field)){
			if(!field.name){
				return false;
			}else{
				return this.searchPanel.getForm().findField(field.name);
			}
		}else{
			return false;
		}
	},
	searchHandler : function(){
		var _this = this;
		if(!_this.searchPanel.getForm().isValid()){
			Ext.Msg.alert("提示",'请填写必要的查询条件');
			return false;
		}
		pars = _this.searchPanel.getForm().getFieldValues();
		for(var key in pars){
			if (pars[key] === "" || pars[key] === undefined || pars[key] === null){
				delete pars[key];
			}
		}
		_this._APP.setSearchParams(pars,true,true);
	},
	resetCondition : function(removeDy){
		if(removeDy===true){
			this.removeAllDyField();
		}
		this.searchPanel.getForm().reset();
	},
	resetHandler : function(){
		this.resetCondition(true);
	},
	clearHandler : function(){
		this.resetCondition(false);
	},
	onContextMenu : function(eve, added){
		var cmenus =Ext.isString(WLJUTIL.contextMenus.condition) ? eval(WLJUTIL.contextMenus.condition) : WLJUTIL.contextMenus.condition;
		for(var key in cmenus){
			var omenu = {};
			omenu.text = cmenus[key].text;
			omenu.handler = cmenus[key].fn.createDelegate(this);
			added.push(omenu);
		}
		added.push('-');
		this._APP.onContextMenu(eve, added);
	}
}); 
Ext.reg('searchcontainer', Wlj.frame.functions.app.widgets.SearchContainer);