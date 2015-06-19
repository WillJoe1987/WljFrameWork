
imports([
		'/contents/frameControllers/widgets/app/designer/designerConfig.js',
		'/contents/frameControllers/widgets/app/preview/Wlj-frame-function-preview-scripts.js',
		'/contents/frameControllers/widgets/app/preview/Wlj-frame-function-preview-dataInterface.js',
		'/contents/frameControllers/widgets/app/designer/fieldsDesigner.js',
		'/contents/frameControllers/widgets/app/designer/tbarDesigner.js',
		'/contents/resource/ext3/ux/Ext.ux.grid.GroupPropertyGrid.js',
		'/contents/frameControllers/widgets/app/designer/formcfgDesignerBar.js',
		'/contents/frameControllers/widgets/app/designer/desiner-lookupdesigner.js',
		'/contents/frameControllers/widgets/app/designer/customerViewDesigner.js',
		'/contents/frameControllers/widgets/app/designer/TreeDesigner.js',
		'/contents/frameControllers/widgets/app/designer/edgeViewsDesigner.js'
		]);

url = basepath + '/loanfznjreduce.json';
var dataInterface = Wlj.frame.functions.preview.DataInterface;
var setDateInterfaceValue = function(name,value){
	Wlj.frame.functions.preview.DataInterface.setValue(name,value);
	codePanel.setCodeArray(Wlj.frame.functions.preview.DataInterface);
	codePanel.createCode();
}; 
var tbarHanlerEditor = new Wlj.functions.preview.util.BasicEditor({
	tbar : [{
		text: '生效',
		handler : function(){
			if(Ext.isNumber(tbarHanlerEditor.tbarButtonIndex)){
				var trec = toolbarButtonsStore.getAt(tbarHanlerEditor.tbarButtonIndex);
				trec.set('handler',tbarHanlerEditor.getCode());
				trec.commit();
			}
		}
	}]
});
var lookupTypes = [{//自定义数据字典种类ID下拉框
	TYPE : 'LOOKUP_ID',
	url : '/lookupMappingQuery.json',
	key : 'F_NAME',
	value : 'F_NAME',
	jsonRoot : 'json.data'
}];
fields = [ {
	name : 'URL',
	text : '查询地址',
	nallowBlank : false
}, {
	name : 'COMMIT_URL',
	text : '提交地址'
},{
	name : 'autoLoadGrid',
	text : '是否自动查询数据',
	xtype : 'checkbox',
	checked  : true
},{
	name : 'needCondition',
	text : '是否需要查询条件面板',
	xtype : 'checkbox',
		checked :true
},{
	name : 'needGrid',
	text : '是否需要主列表',
	xtype : 'checkbox',
	checked :true
},{
	name : 'needTbar',
	text : '是否需要工具栏',
	xtype : 'checkbox',
	checked :true
},{
	name : 'localLookup',
	text : '本地数据字典'
},{
	name : 'lookupTypes',
	text : '远程数据字典'
}];
needCondition = false;
needGrid = false;

var createView = false;
var editView = false;
var detailView = false;

//新增、修改、详情设计面板
var formViewContainer = new Ext.Panel({
	layout : 'form',
	autoScroll : true,
	createFormCoder : function(type){
		if(!this.rendered) return;
		if(this[type]){
			return this[type];
		}else{
			var formcfgbar = new Wlj.frame.designer.FormCfgDesignerBar({
				ownerView : this,
				ownerType : type
			});
			this[type] = new Wlj.functions.preview.util.BasicEditor({
				tbar : formcfgbar,
				formType : type,
				title : type,
				height : 300
			});
			this.add(this[type]);
			this.doLayout();
		}
	},
	setCode : function(type,code){
		if(!this[type]){
			this.createFormCoder(type);
		}
		this[type].setCode(code);
	},
	showCode : function(type){
		if(!this[type]){
			this.createFormCoder(type);
		}
		var flagHandler = type+'View';
		var viewerHandler = type + 'FormViewer';
		var cfgHandler = type + 'FormCfgs';
		
		var flagCode = Wlj.frame.functions.preview.DataInterface.getCode(flagHandler)?Wlj.frame.functions.preview.DataInterface.getCode(flagHandler):'';
		var viewerCode = Wlj.frame.functions.preview.DataInterface.getCode(viewerHandler)?Wlj.frame.functions.preview.DataInterface.getCode(viewerHandler):'';
		var cfgCode = Wlj.frame.functions.preview.DataInterface.getCode(cfgHandler)?Wlj.frame.functions.preview.DataInterface.getCode(cfgHandler):'';
		this[type].setCode(flagCode+viewerCode+cfgCode);
	}
});

var CURDPanel = new Ext.Panel({
	layout : 'border',
	items : [ {
		region : 'west',
		width : 300,
		layout : 'fit',
		items : [ formCfgGrid ]
	}, {
		region : 'center',
		layout : 'fit',
		items : [formViewContainer]
	} ]
});
///////////////////////////////////////////////////////////////

//字段配置面板
var _fieldPropertiesForm = new fieldPropertiesForm({
	region : 'west',
	width : '400',
	autoScroll : true
});



var _metaFieldConfig = {
	title : '元数据字段',
	suspendFitAll : true,
	hideTitle : true,
	layout : 'border',
	items : [_fieldPropertiesForm,fieldGridEditor]
};

///////////////////////////////////////////////////////////////
customerView = [{
	title : '基本信息',
	hideTitle : true,
	type : 'form',
	suspendFitAll : true,
	labelWidth : 100,
	authHright:true,
	groups : [ {
		columnCount : 2,
		fields : [ 'URL', 'COMMIT_URL' ],
		fn : function(URL, COMMIT_URL) {
			URL.emptyText = 'action所对应URL。如：XXX.json';
			URL.listeners = {
				'change':function(){
					if (this.getValue() != '') {
						setDateInterfaceValue('url',this.getValue());
					}
				}};
		COMMIT_URL.emptyText = '如为空，则被置为URL的值';
		COMMIT_URL.listeners = {
				'change':function(){
					if (this.getValue() != '') {
						setDateInterfaceValue('comitUrl',this.getValue());
					}
			}};
		return [ URL, COMMIT_URL ];
	}
	},{
		labelWidth : 150,
		columnCount : 1,
		fields : ['autoLoadGrid','needCondition','needGrid','needTbar'],
		fn : function(autoLoadGrid,needCondition,needGrid,needTbar){
			autoLoadGrid.listeners={'check':function(){setDateInterfaceValue('autoLoadGrid',!Wlj.frame.functions.preview.DataInterface.autoLoadGrid.value);}};
			needCondition.listeners={'check':function(){setDateInterfaceValue('needCondition',!Wlj.frame.functions.preview.DataInterface.needCondition.value);}};
			needGrid.listeners={'check':function(){setDateInterfaceValue('needGrid',!Wlj.frame.functions.preview.DataInterface.needGrid.value);}};
			needTbar.listeners={'check':function(){setDateInterfaceValue('needTbar',!Wlj.frame.functions.preview.DataInterface.needTbar.value);}};
			return [autoLoadGrid,needCondition,needGrid,needTbar];
		}
	}]
},_metaFieldConfig, {
	title : '增删改表单',
	suspendFitAll : true,
	hideTitle : true,
	items : [ CURDPanel ]
}, {
	title : '自定义面板',
	suspendFitAll : true,
	hideTitle : true,
	layout : 'column',
	items : [customerViewGrid,customerViewDisigner]
}, {
	title : 'tbar按钮',
	suspendFitAll : true,
	hideTitle : true,
	items : [{
		xtype : 'panel',
		layout : 'column',
		items : [{
			xtype : 'panel',
			columnWidth: .3,
			layout :'fit',
			height : 400,
			items : [toolbarButtonsGrid]
		},{
			xtype : 'panel',
			columnWidth : .7,
			layout : 'fit',
			height : 400,
			items : [tbarHanlerEditor]
		}]
	}]
}, {
	title : '边缘面板',
	suspendFitAll : true,
	hideTitle : true,
	items : [westEdgeViewDisigner]
}, {
	title : '树形面板配置',
	suspendFitAll : true,
	hideTitle : true,
	items : [{
		xtype : 'panel',
		tbar : [{
			text :'sdlfkjsdf',
			handler : function(){
				TREECFGWINDOW.show();
			}
		}]
	}]
}];
	
var designerParts = new Ext.grid.GridPanel( {
	frame : true,
	store : new Ext.data.JsonStore( {
		autoDestroy : true,
		// url: 'get-images.php',
		idProperty : 'name',
		fields : [ 'name', 'desc' ]
	}),
	sm : new Ext.grid.RowSelectionModel( {
		singleSelect : true,
		listeners : {
			rowselect : function(sm, index, e) {
				showCustomerViewByIndex(index);
			}
		}
	}),

	region : 'west',
	stripeRows : true,
	columns : [ {
		header : '部件',
		width : 110,
		menuDisabled : true,
		sortable : false,
		dataIndex : 'desc'
	} ],
	viewConfig : {
		forceFit : true,
		autoFill : true
	},
	loadMask : {
		msg : '...'
	}
});
designerParts.store.loadData(Wlj.designer.designerParts);

var codePanel = new Wlj.functions.preview.util.codeGenerate({
	codeArray : Wlj.frame.functions.preview.DataInterface
});
var edgeVies = {
	left : {
		width : 200,
		layout : 'fit',
		items : [ designerParts ]
	},
	buttom : {
		height : 200,
		xtype : 'panel',
		layout : 'fit',
		collapsible : false,
		items : [ codePanel ]
	}
};

viewshow = function(view) {
	if (view.title=='基本信息'){
		view.getFieldByName('URL').setValue(dataInterface.url.value===false?'':dataInterface.url.value);
		view.getFieldByName('COMMIT_URL').setValue(dataInterface.comitUrl.value===false?'':dataInterface.comitUrl.value);
	}
};
