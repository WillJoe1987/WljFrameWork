Ext.ns('Wlj.frame.functions.app.widgets');
/**
 * 结果容器扩展面板基类;
 */
Wlj.frame.functions.app.widgets.View = Ext.extend(Ext.Panel,{
	autoEl : {
		tag : 'div',
		cls : 'wlj-view-container'
	},
	autoScroll : true,
	layout : 'fit',
	_defaultTitle : 'hello world',
	initComponent : function(){
		Wlj.frame.functions.app.widgets.View.superclass.initComponent.call(this);
		this.addEvents({
			movein : true,
			moveout : true,
			beforeloadrecord : true,
			loadrecord : true
		});
	},
	render : function(container, position){
		this.width = this.vs.width;
		Wlj.frame.functions.app.widgets.View.superclass.render.call(this,container, position);
	}
});
Ext.reg('basicview', Wlj.frame.functions.app.widgets.View);

/**
 * 查询结果系统扩展面板基类
 */
Wlj.frame.functions.app.widgets.RView = Ext.extend(Wlj.frame.functions.app.widgets.View,{
	_defaultTitle : 'Rview',
	ownerDomain : false,
	ownerApp : false,
	hideTitle : false,
	suspended : false,
	vs : false,
	tabIco : false,
	
	assistantView : false,
	
	initComponent : function(){
		this.width = this.vs.width;
		if(this.title){
			this._defaultTitle = this.title;
		}else{
			this.title = this._defaultTitle;
		}
		this.iconCls='hide-wvc-right';
		this.headerCssClass='wvc-header';
		if(!this.ownerDomain.suspendViews){
			delete this.title;
		}
		Wlj.frame.functions.app.widgets.RView.superclass.initComponent.call(this);
		var _this = this;
		if(_this.ownerDomain.needTbar){
			_this.togogleButton = this.ownerDomain.getTopToolbar().addButton({
				text : _this._defaultTitle,
				enableToggle : true,
				hidden : _this.hideTitle,
				iconCls : _this.tabIco,
				handler : function(){
					if(_this.ownerDomain.currentView === _this){
						if(_this.ownerDomain.suspendViews){
							_this.ownerDomain.hideCurrentView();
						}else{
							_this.ownerDomain.gridMoveIn();
						}
					}else{
						var result = _this.ownerDomain.showView(_this);
						if(result === false){
							_this.togogleButton.toggle( false );
						}
					}
				}
			});
		}
	},
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.RView.superclass.onRender.call(this, ct, position);
		var _this  = this;
		if(_this.suspended){
			_this.header.on('click', function(e,t,o){
				e.stopEvent();
				if(_this.ownerDomain.suspendViews){
					_this.ownerDomain.hideCurrentView();
				}else{
					_this.ownerDomain.gridMoveIn();
				}
			});
		}
		if(_this.assistantView){
			if(!_this.assistantView.width){
				_this.assistantView.width = ct.getViewSize().width - _this.width;
			}
//			_this.assistantView.baseCls = 'wlj-view-container';
//			//_this.assistantView.iconCls='hide-wvc-right';
//			_this.assistantView.headerCssClass='wvc-header';
			_this.assistantView.height = ct.getViewSize().height;
			var av = new Ext.Panel(_this.assistantView);
			av.majorView = this;
			this.assistantView = av;
			av.render(ct);
			av.setHeight(_this.height);
			av.el.applyStyles({
				top:0+'px',
				position : 'absolute',
				marginLeft : (-av.width)+'px'
			});
			av.header.on('click', function(){
				_this.hideAssistant();
			});
		}
	},
	getIndex : function(){
		return this.ownerDomain.getTotleViewIndex(this);
	},
	setValues : function(object){
		if(!this.contentPanel){
			return false;
		}
		var cp = this.contentPanel;
		if(!cp.getForm || !cp.getForm()){
			return false;
		}
		var form = cp.getForm();
		form.setValues(object);
	},
	showAssistant : function(){
		if(this.assistantView && !this.assistantView.moveined){
			this.assistantView.el.animate({
				marginLeft : {to : 0, from : -this.assistantView.width}
			},
			.35,
			null,      
			'easeOut', 
			'run' );
			this.assistantView.moveined = true;
		}
	},
	hideAssistant : function(){
		if(this.assistantView && this.assistantView.moveined){
			this.assistantView.el.animate({
				marginLeft : {from : 0, to : -this.assistantView.width}
			},
			.35,
			null,      
			'easeOut', 
			'run' );
			this.assistantView.moveined = false;
		}
	}
});
Ext.reg('resultview', Wlj.frame.functions.app.widgets.RView);

/**
 * 系统扩展面板类：用于新增、修改、详情
 */
Wlj.frame.functions.app.widgets.CView = Ext.extend(Wlj.frame.functions.app.widgets.RView,{
	_defaultTitle : 'Cview',
	baseType : false,
	openValidate : true,
	svButton : true,
	fields : false,
	validates : false,
	linkages : false,
	formButtons : false,
	//layout : 'form',
	autoValidateText : '字段校验失败，请检查输入项!',
	
	suspendFitAll : false,
	
	toBeValidate : true,
	
	record : false,
	initComponent : function(){
		Wlj.frame.functions.app.widgets.CView.superclass.initComponent.call(this);
		this.width = this.vs.width;
		this.buildContent();
		this.add(this.contentPanel);
		var bt = this.baseType.toLowerCase();
		this.ownerDomain.fireEvent('before'+bt+'render', this);
	},
	destory : function(){
		this.contentPanel = false;
		Wlj.frame.functions.app.widgets.CView.superclass.destory.call(this);
	},
	
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.CView.superclass.onRender.call(this,ct,position);
		this.fireEvent('afterviewrender', this);
	},
	initEvents : function(){
		this.addEvents({
			beforevalidate :true,
			validate : true,
			afterviewrender : true
		});
	},
	setRecord : function(record){
		this.record = record;
		if(this.rendered === true){
			var loadrecordable = this.fireEvent('beforeloadrecord', this, this.record);
			if(loadrecordable === false){
				return false;
			}
			this.contentPanel.getForm().reset();
			if(this.record){
				this.contentPanel.getForm().loadRecord(this.record);
			}
			this.fireEvent('loadrecord', this, this.record);
		}
	},
	reset : function(){
		if(this.contentPanel && this.contentPanel.getForm()){
			this.contentPanel.getForm().reset();
		}
	},
	buildContent : function(){
		var _this = this;
		this.contentPanel = new Ext.form.FormPanel({
			items : this.buildFormField(),
			frame:true,
			height : 'auto',
			autoScroll : true,
			buttonAlign : 'center',
			layout : 'form',
			buttons : _this.buildButtons()
		});
	},
	buildButtons : function(){
		var _this = this;
		var buttons = [];
		if(_this.svButton){
			var svButtonCfg = {
				text : '保存',
				cls:'simple-btn',
				overCls:'simple-btn-hover',
				handler : function(){
					if(_this.openValidate){
						var validateAble = _this.fireEvent('beforevalidate',_this,_this.contentPanel);
						if(validateAble === false){
							return false;
						}
						if(!_this.contentPanel.getForm().isValid()){
							Ext.MessageBox.alert('提示', _this.autoValidateText);
							return false;
						}
						var error = _this.validateData();
						_this.fireEvent('validate',_this,_this.contentPanel,error);
						if(!error.passable){
							Ext.Msg.alert('提示',error.info);
							return;
						}
					}
					var data = _this.contentPanel.getForm().getFieldValues();
					_this.ownerApp.comitData(data);
				}
			};
			buttons.push(svButtonCfg);
		}
		if(Ext.isArray(_this.formButtons)){
			Ext.each(_this.formButtons,function(fb){
				if(Ext.isString(fb.text)){
					if(Ext.isFunction(fb.fn)){
						fb.handler = function(){
							fb.fn.call(_this, _this.contentPanel, _this.contentPanel.getForm());
						};
					}else{
						fb.handler = Ext.emptyFn;
					}
					buttons.push(fb);
				}
			});
		}
		return buttons.length>0?buttons:false;
	},
	
	//private
	createColumnsCfg : function(columnCount, fields){
		var columnsCfg = [];
		var _this = this;
		for(var i=0; i< columnCount;i++){
			var cfg = {};
			cfg.layout = 'form';
			cfg.columnWidth = 1/columnCount;
			cfg.items = [];
			columnsCfg.push(cfg);
		}
		Ext.each(fields, function(f){
			if(Ext.isObject(f)){
				if(Ext.instanceOf(f,'container')){
					/**
					 * TODO special optional config for containers or subclassed of container.
					 */
				}else{
					f.fieldLabel  = f.text ? f.text : f.name;
					f.xtype = f.xtype ? f.xtype : 'textfield';
					f.hidden = typeof f.hidden === 'boolean' ? f.hidden : f.text ? false : true;
					f.anchor = f.anchor ? f.anchor : '90%';
					if(f.allowBlank === false){
						f.fieldLabel = WLJTOOL.addBlankFlag(f.fieldLabel);
					}
					if(f.translateType){
						f.xtype = f.multiSelect?'lovcombo':'combo';
						f.store = _this.ownerApp.lookupManager[f.translateType];
						if(!f.store){
							Ext.error('字段【'+f.text+'】的数据字典映射项store【'+f.translateType+'】获取错误，请检查[lookupTypes|localLookup]项配置');
							return false;
						}
						f.valueField = 'key';
						f.displayField = 'value';
						f.editable = typeof f.editable === 'boolean' ? f.editable : false;
						f.forceSelection = true;
						f.triggerAction = 'all';
						f.mode = 'local';
						f.hiddenName = f.name;
						f.separator = f.multiSeparator?f.multiSeparator:_this.ownerDomain.multiSelectSeparator;
					}else{
						f.name = f.name;
						if(f.dataType && WLJDATATYPE[f.dataType]){
							f.xtype = WLJDATATYPE[f.dataType].getFieldXtype();
							Ext.applyIf(f, WLJDATATYPE[f.dataType].getFieldSpecialCfg());
						}
					}		
					var changeListeners = {
							change : function(field,newValue,oldValue){
						_this.linkaging(field,newValue,oldValue);
					}
					};
					if(!f.listeners){
						f.listeners = changeListeners;
					}else{
						Ext.apply(f.listeners,changeListeners);
					}
				}
				var columnI = fields.indexOf(f) % columnCount;
				columnsCfg[columnI].items.push(f);
			}
		});
		return columnsCfg;
	},
	buildFormField : function(){
		var _this = this;
		var groups = _this.formViewer;
		var groupPanels = [];
		var vs = _this.vs;
		var columnCount = vs.width > 1024 ? 4:3;
		if(vs.width < 800 ){
			columnCount = 2;
		}
		if(vs.width < 500){
			columnCount = 1;
		}
		var allFields = _this.fields;
		Ext.each(groups, function(g){
			var gFs = g.fields;
			var gColumnCount = columnCount;
			if(g.columnCount){
				gColumnCount = g.columnCount;
			}
			var panelFieldsCfg = _this.getFieldsByName(gFs);
			if(!panelFieldsCfg){
				return;
			}
			
			var items;
			if(Ext.isFunction(g.fn)){
				try{
					items = g.fn.apply(_this, panelFieldsCfg);
				}catch(Werror){
					Ext.error('['+_this._defaultTitle+']面板第['+groups.indexOf(g)+']个字段组渲染出错,字段组将以默认顺序解析。见【formViewers|createFormViewer|editFormViewer|detailFormViewer】，TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
					items = panelFieldsCfg;
				}
			}else{
				items = panelFieldsCfg;
			}
			items.length = panelFieldsCfg.length;
			var tItems = new Array();
			for(var ti=0; ti<items.length; ti++){
				if(Ext.isObject(items[ti]) && items[ti].hidden !== true){
					if( _this.baseType === "detailView" ){
						items[ti].readOnly = true;
					}
					tItems.push(items[ti]);
				}else continue;
			}
			items = _this.createColumnsCfg(gColumnCount,tItems);
			delete tItems;
			var lines = Math.ceil(gFs.length/gColumnCount);
			var panelCfg = {};
			panelCfg.xtype = 'panel';
			panelCfg.layout = 'column';
			if (g.labelWidth) {
				panelCfg.labelWidth = g.labelWidth;
			}
			panelCfg.items = items;
			groupPanels.push(panelCfg);
		});
		Ext.each(allFields,function(af){
			if(af.hidden || !af.text){
				af.xtype = 'textfield';
				af.hidden = true;
				groupPanels.push(af);
			}
		});
		return groupPanels;
	},
	getFieldsByName : function(name){
		if(!this.fields){
			return false;
		}
		if(!name){
			return false;
		}
		var _this = this;
		if(Ext.isArray(name)){
			var fields = new Array(name.length);
			Ext.each(_this.fields,function(f){
				if(name.indexOf(f.name)>=0){
					fields[name.indexOf(f.name)] = f;
				}
			});
			return fields.length>0?fields:false;
		}else if(Ext.isString(name)){
			for(var i=0;i< this.fields.length; i++){
				var field = this.fields[i];
				if(field.name === name){
					return field;
				}
			}
		}
		return false;
	},
	validateData : function(){
		var _this = this;
		var result = {
				passable : true,
				info : '',
				addInfo : function(info){
			result.info += '<br>' + info;
		}
		};
		if(!_this.toBeValidate){
			return result;
		}
		var vas = this.validates;
		if(!vas){
			return result;
		}
		var panel = _this.contentPanel;
		if(!panel.getForm()){
			return result;
		}
		var values = panel.getForm().getFieldValues();
		var _this = this;	
		
		Ext.each(vas,function(v){
			if(Ext.isFunction(v.fn)){
				var arrays = [];
				Ext.each(v.dataFields,function(vf){
					arrays.push(values[vf]);
				});
				try{
					if( v.fn.apply(v,arrays) === false){
						result.passable = false;
						result.addInfo(v.desc);
					}
				}catch(Werror){
					Ext.error('['+_this._defaultTitle+']面板校验规则['+v.desc+']:运行错误，校验结果将按照失败计算。见【validates|createValidates|editValidates】，TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
					result.passable = false;
					result.addInfo(v.desc);
				}
			}else{
				Ext.warn('['+_this._defaultTitle+']面板校验规则['+v.desc+']函数配置有误，或者中途被改变，校验结果将按照成功计算');
			}
		});
		return result;
	},
	linkaging : function(field,newValue,oldValue){
		var _this = this;
		if(!_this.linkages){
			return;
		}
		var name = field.name;
		var _linkage = _this.linkages[name];
		if(!_linkage){
			return false;
		}
		var linkedFields = _this.getLinkFields(_linkage.fields);
		var allerror = '字段:';
		var haserror = false;
		Ext.each(linkedFields, function(lf){
			if(lf.noFieldError){
				haserror = true;
				allerror += '['+lf.name+']';
			}
		});
		if(haserror){
			Ext.error('['+_this._defaultTitle+']面板['+name+']字段联动错误。'+allerror+'不在定义的字段中。见【linkages|createLinkages|editLinkages】中fields属性');
		}
		linkedFields.unshift(field);
		try{
			_linkage.fn.apply(_this,linkedFields);
		}catch(Werror){
			Ext.error('['+_this._defaultTitle+']面板['+name+']字段联动逻辑运行错误。见【linkages|createLinkages|editLinkages】中fn属性，TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
		}
	},
	getLinkFields : function(o){
		if(!Ext.isArray(o)){
			return false;
		}
		var linkFields = [];
		var _this = this;
		Ext.each(o, function(of){
			var ofo = _this.contentPanel.getForm().findField(of);
			if(ofo){
				linkFields.push(ofo);
			}else{
				linkFields.push({
					name : of,
					noFieldError : 'field:['+of+'] is not found!'
				});
			}
		});
		return linkFields;
	}
});
Ext.reg('cview', Wlj.frame.functions.app.widgets.CView);

/**
 * 结果容器扩展面板类，用户自定义扩展面板均采用此类面板做为容器；
 */
Wlj.frame.functions.app.widgets.BView = Ext.extend(Wlj.frame.functions.app.widgets.RView  ,{
	_defaultTitle : 'Bview',
	ownerDomain : false,
	ownerApp : false,
	vs : false,
	initComponent : function(){
		/***
		 * TODO fit all
		 */
		this.width = this.vs.width;
		Wlj.frame.functions.app.widgets.BView.superclass.initComponent.call(this);
	},
	getCustomerViewIndex : function(){
		return this.ownerDomain.getCustomerViewIndex(this);
	}
});
Ext.reg('buisnessview', Wlj.frame.functions.app.widgets.BView);

Wlj.frame.functions.app.widgets.FormView = Ext.extend(Wlj.frame.functions.app.widgets.BView ,{
	
	autoLoadSeleted : false,
	formButtons : false,
	
	initComponent : function(){
		delete this.buttons;
		Wlj.frame.functions.app.widgets.FormView.superclass.initComponent.call(this);
		this.buildContentObject();
		var _this = this;
		if(this.autoLoadSeleted){
			this.on('movein', function(rec){
				_this.loadRecord(rec);
			});
		}
		this.on('moveout', function(){
			_this.reset();
		});
	},
	buildContentObject : function(){
		var _this = this;
		this.resolveButtons();
		this.contentPanel = new Ext.form.FormPanel({
			items : _this.createGroups(),
			frame:true,
			height : 'auto',
			autoScroll : true,
			buttonAlign : 'center',
			labelAlign : 'center',
			layout : 'form',
			buttons : _this.formButtons
		});
		this.add(this.contentPanel);
	},
	resolveButtons : function(){
		var buts = this.formButtons;
		var _this = this;
		Ext.each(buts,function(b){
			delete b.handler;
			b.ownerView = _this;
			if(Ext.isFunction(b.fn)){
				b.handler = function(){
					b.fn.call(_this, _this.contentPanel, _this.contentPanel.getForm());
				};
			}
		});
	},
	createGroups : function(){
		var groupPanels = [];
		var groupCfgs = this.groups;
		var _this = this;
		Ext.each(groupCfgs, function(g){
			groupPanels.push(_this.createGroupPanel(g));
		});
		return groupPanels;
	},
	createGroupPanel : function(groupCfg){
		var panelCfg = {};
		var vs = this.vs;
		var columnCount;
		if(vs.width>1024){
			columnCount = 4;
		}else if(vs.width > 800){
			columnCount = 3;
		}else if(vs.width > 500){
			columnCount = 2;
		}else{
			columnCount = 1;
		}
		if(Ext.isNumber(groupCfg.columnCount)){
			columnCount = groupCfg.columnCount;
		}
		var fields = groupCfg.fields;
		panelCfg.layout = 'column';
		if (groupCfg.labelWidth) {
			panelCfg.labelWidth = groupCfg.labelWidth;
		}
		panelCfg.items = new Array();
		for(var i=0;i<columnCount;i++){
			panelCfg.items.push({
				layout : 'form',
				columnWidth : 1/columnCount
			});
		}
		var fieldsCfg = this.getFieldsCfg(fields);
		if(Ext.isFunction(groupCfg.fn)){
			try{
				fieldsCfg = groupCfg.fn.apply(this, fieldsCfg);
			}catch(Werror){
				fieldsCfg = fieldsCfg;
			}
		}else{
			fieldsCfg = fieldsCfg;
		}
		if(!fieldsCfg){
			fieldsCfg=[];
		}
		var fluse = fieldsCfg.length -1;
		while(fluse >=0 ){
			if(!Ext.isObject(fieldsCfg[fluse])){
				fieldsCfg.remove(fieldsCfg[fluse]);
			}
			fluse -- ;
		}
		for(var i=0;i<fieldsCfg.length; i++){
			if(!panelCfg.items[i%columnCount].items){
				panelCfg.items[i%columnCount].items=[];
			}
			panelCfg.items[i%columnCount].items.push(fieldsCfg[i]);
		}
		return panelCfg;
	},
	getFieldsCfg : function(fields){
		var result = [];
		var _this = this;
		if(Ext.isArray(fields)){
			Ext.each(fields, function(field){
				var f = false;
				if(Ext.isEmpty(field)){
					f = false;
				}else if(Ext.isString(field)){
					f =  _this.ownerApp.copyFieldsByName(field);
				}else{
					f =  field;
				}
				if(f){
					f.fieldLabel  = f.text ? f.text : f.name;
					f.xtype = f.xtype ? f.xtype : 'textfield';
					f.hidden = f.text ? false : true;
					f.anchor = f.anchor ? f.anchor : '90%';
					if(f.allowBlank === false){
						f.fieldLabel = WLJTOOL.addBlankFlag(f.fieldLabel);
					}
					if(f.translateType){
						f.xtype = f.multiSelect?'lovcombo':'combo';
						f.store = _this.ownerApp.lookupManager[f.translateType];
						if(!f.store){
							Ext.error('字段【'+f.text+'】的数据字典映射项store【'+f.translateType+'】获取错误，请检查[lookupTypes|localLookup]项配置');
							return false;
						}
						f.valueField = 'key';
						f.displayField = 'value';
						f.editable = typeof f.editable === 'boolean' ? f.editable : false;
						f.forceSelection = true;
						f.triggerAction = 'all';
						f.mode = 'local';
						f.hiddenName = f.name;
						f.separator = f.multiSeparator?f.multiSeparator:_this.ownerDomain.multiSelectSeparator;
					}else{
						f.name = f.name;
						if(f.dataType && WLJDATATYPE[f.dataType]){
							f.xtype = WLJDATATYPE[f.dataType].getFieldXtype();
							Ext.applyIf(f, WLJDATATYPE[f.dataType].getFieldSpecialCfg());
						}
					}
				}
				result.push(f);
			});
		}
		return result;
	},
	getFormPanel : function(){
		return this.contentPanel();
	},
	reset : function(){
		if(this.contentPanel && this.contentPanel.getForm()){
			this.contentPanel.getForm().reset();
		}
	},
	loadRecord : function(record){
		this.reset();
		if(record){
			this.contentPanel.getForm().loadRecord(record);
		}
	},
	getFieldByName : function(name){
		return this.contentPanel.getForm().findField(name);
	},
	getValues : function(asString){
		if(asString === true){
			return this.contentPanel.getForm().getValues(true);
		}else{
			return this.contentPanel.getForm().getValues(false);
		}
	}
});
Ext.reg('rformview', Wlj.frame.functions.app.widgets.FormView);


Wlj.frame.functions.app.widgets.GridView = Ext.extend(Wlj.frame.functions.app.widgets.BView, {
	
	url : false,
	fields : false,
	pageable : true,
	grideditable : false,
	isCsm : true,
	isRn : true,
	buttons : false,
	jsonCount : 'json.count',
	jsonRoot : 'json.data',
	
	initComponent : function(){
		Wlj.frame.functions.app.widgets.GridView.superclass.initComponent.call(this);
		this.collectFileds();
		this.buildStore();
		if(this.pageable){
			this.buildPagingBar();
		}
		this.buildGrid();
		this.add(this.grid);
	},
	
	collectFileds : function(){
		var fieldsCfg = [];
		var _this = this;
		if(Ext.isArray(_this.fields.fields)){
			Ext.each(_this.fields.fields, function(f){
				if(Ext.isString(f)){
					var fCFG = _this.ownerApp.copyFieldsByName(f);
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
						
						fieldsCfg.push(fCFG);
					}
				}else if(Ext.isObject(f)){
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
		
		var i= fieldsCfg.length - 1;
		while(i>=0){
			if(!fieldsCfg[i]){
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
		this.pagingCombo =  new Ext.form.ComboBox({
	        name : 'pagesize',
	        triggerAction : 'all',
	        mode : 'local',
	        store : new Ext.data.ArrayStore({
	            fields : ['value', 'text'],
	            data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
							[ 100, '100条/页' ], [ 250, '250条/页' ],
							[ 500, '500条/页' ] ]
	        }),
	        valueField : 'value',
	        displayField : 'text',
	        value: 20,
	        editable : false,
	        width : 85
	    });
		this.pagingbar = new Ext.PagingToolbar({
			pageSize : parseInt(this.pagingCombo.getValue()),
			store : this.store,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',       
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', this.pagingCombo]
		});
		
		this.pagingCombo.on("select", function(comboBox) {
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
			_this.csm = new Ext.grid.CheckboxSelectionModel();
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
				store : _this.store,
				frame : true,
				clicksToEdit:1,
				tbar : _this.createTbarCfg(),
				viewConfig : {
					autoFill : false 
				},
				cm : new Ext.grid.ColumnModel(_this.fields.fields),
				sm : _this.isCsm?_this.csm:null,
				footer : false,
				bbar : _this.pageable ? _this.pagingbar : false
			});
		}else{
			this.grid = new Ext.grid.GridPanel({
				store : _this.store,
				frame : true,
				tbar : _this.createTbarCfg(),
				viewConfig : {
					autoFill : false 
				},
				cm : new Ext.grid.ColumnModel(_this.fields.fields),
				sm : _this.isCsm?_this.csm:null,
				footer : false,
				bbar : _this.pageable ? _this.pagingbar : false
			});
		}
	},	
	getStore : function(){
		return this.store;
	},
	getGrid : function(){
		return this.grid;
	},
//	nextpage : function(){},
//	prepage : function(){},
//	firstpage : function(){},
//	lastpage : function(){},
//	currentpage : function(){},
	setParameters : function(params){
		delete this.currentParams;
		delete this.store.baseParams;
		this.currentParams = params;
		this.store.baseParams = params;
		if(this.pageable){
			this.store.load({
				params : {
					start : 0,
					limit : this.pagingbar.pageSize                                                      
				}
			});
		}else{
			this.store.load();
		}
	},
	getSeleted : function(){}
});
Ext.reg('rgridview', Wlj.frame.functions.app.widgets.GridView);