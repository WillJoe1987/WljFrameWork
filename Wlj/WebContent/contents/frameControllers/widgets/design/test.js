/**
 * @description 生态圈定义页面
 * @author:guochi
 * @since:2015-02-28
 * @checkedby:
 */
imports([ '/contents/pages/common/commonExtPanel.js',
		'/contents/pages/com.yucheng.bcrm/com.yucheng.bcrm.js',
		'/contents/pages/common/Com.yucheng.bcrm.common.OrgField.js', // 机构放大镜
]);

/** 本地数据字典 */
var localLookup = {
	'ECOSPHERE_TYPE' : [ {
		key : '1',
		value : '企业集群'
	}, {
		key : '2',
		value : '生态圈'
	} ],
	'ECOSPHERE_LEV' : [ {
		key : '1',
		value : '总行级'
	}, {
		key : '2',
		value : '区域级(跨分行)'
	}, {
		key : '3',
		value : '分行级'
	} ],
	'ECOSPHERE_TYP' : [ {
		key : '1',
		value : '集团金融'
	}, {
		key : '2',
		value : '机构金融'
	}, {
		key : '3',
		value : '供应链金融'
	}, {
		key : '4',
		value : '产业金融'
	}, {
		key : '5',
		value : '综合金融'
	}, {
		key : '6',
		value : '园区金融'
	}, {
		key : '7',
		value : '社区金融'
	}, {
		key : '8',
		value : '商圈金融'
	}, {
		key : '9',
		value : '商会金融'
	} ]
};

// WLJUTIL.alwaysLockCurrentView = true;// 由于在保存之后，还需要操作附件列表，所以本功能页面锁定悬浮面板滑出
var lookupTypes = [ 'SHARE_FLAG' ];// 共享范围

var url = basepath + '/ecosphereManager.json';

var fields = [ {
	name : 'ID',
	text : '生态圈编号',
	hidden : true
}, {
	name : 'ECOSPHERE_NAME',
	text : '生态圈名称',
	resutlFloat : 'right',
	resutlWidth : 120,
	searchField : true
}, {
	name : 'ECOSPHERE_TYPE',
	text : '生态圈类型',
	allowBlank : false,
	translateType : 'ECOSPHERE_TYPE',
	searchField : true
}, {
	name : 'ECOSPHERE_TYP',
	text : '生态圈细分',
	resutlFloat : 'right',
	translateType : 'ECOSPHERE_TYP',
	resutlWidth : 120
}, {
	name : 'ECOSPHERE_DESC',
	text : '生态园描述',
	resutlWidth : 150,
	xtype : 'textarea'
}, {
	name : 'ECOSPHERE_LEV',
	text : '生态圈等级',
	resutlWidth : 70,
	translateType : 'ECOSPHERE_LEV',
	resutlFloat : 'right',
	searchField : true
}, {
	name : 'MEMBER_NUM',
	text : '成员数',
	resutlWidth : 70,
	resutlFloat : 'right'
}, {
	name : 'ORG_NAME',
	text : '归属机构',
	gridField : true,
	xtype : 'orgchoose',
	hiddenName : 'ORG_ID',
	searchType : 'SUBTREE'/* ,checkBox:true */,
	searchField : true
}, {
	name : 'MGR',
	text : '客户经理',
	resutlWidth : 70,
	resutlFloat : 'right',
	searchField : true
}, {
	name : 'CORE_ENTERPRISE',
	text : '核心企业',
	resutlWidth : 70,
	resutlFloat : 'right',
	searchField : false
}, {
	name : 'CREATE_DATE',
	text : '创建时间',
	resutlWidth : 70,
	resutlFloat : 'right',
	searchField : false
}, {
	name : 'CREATE_USER',
	text : '创建人',
	resutlWidth : 70,
	resutlFloat : 'right',
	searchField : false
}

];

var tbar = [ {
	text : '收起',
	handler : function() {
		collapseSearchPanel();
	}
}, {
	text : '展开',
	handler : function() {
		expandSearchPanel();
	}
}, {
	text : 'designer',
	handler : function() {
		collapseSearchPanel();
		showCustomerViewByTitle('designer');
	}
}, {
	text : '对公客户比较式营销',
	handler : function() {
		collapseSearchPanel();
		showCustomerViewByTitle('对公客户比较式营销');
	}

} ];

var fieldsPropertyGrid = new Ext.grid.PropertyGrid({
	width : 300,
	autoHeight : true,
	propertyNames : {
		tested : 'QA',
		borderWidth : 'Border Width'
	},
	source : {
		'(name)' : 'Properties Grid',
		grouping : false,
		autoFitColumns : true,
		productionQuality : false,
		SERVICE_LEVEL : '男',
		created : new Date(Date.parse('2006-10-15')),
		tested : false,
		version : 0.01,
		出生日期 : '2015-5-26',
		borderWidth : 1
	},
	customEditors : {
		SERVICE_LEVEL : new Ext.grid.GridEditor(new Ext.form.ComboBox({
			editable : false,
			mode : "local",
			triggerAction : "all",
			displayField : 'text',
			store : new Ext.data.SimpleStore({
				fields : [ 'value', 'text' ],
				data : [ [ '0', '全国' ], [ '1', '省级' ], [ '2', '市级' ],
						[ '3', '县级' ], [ '4', '乡镇' ], [ '5', '其他' ] ]
			})
		})),
		"出生日期" : new Ext.grid.GridEditor(new Ext.form.DateField({
			format : 'Y-m-d',
			selectOnFocus : true,
			allowBlank : false
		}))
	},
	viewConfig : {
		forceFit : true,
		scrollOffset : 2
	// the grid will never have scrollbars
	},
	listeners : {
		beforerender : function() {
			this.getColumnModel().dateFormat = "Y-m-d";
		}

	}
})
var jsonSource = {
	Wljbase: {
		name:'',
		hidden:false,
		text:'',
		viewFn:'',
		dataType:'',
		xtype:'textfield',
		cmTypes:'',
		translateType:'',
		noTitle:false
	},
	grid:{
		gridField:true,
		resutlWidth:150
	},
	searchField:{
		searchField:false,
		cAllowBlank:true,
		enableCondition:true
	},
	wcombotree : {
		innerTree:'',
		showField:'',
		hideField:''
	},
	combox:{
		multiSelect:false,
		multiSeparator:'',
		editable:false
	}
};

var propertyGrid = new Ext.ux.grid.GroupPropertyGrid({
	title : 'Properties Grid',
//	autoHeight : true,
	autoScroll:true,
	width : 500,
	source : jsonSource,
	propertyNames : {
		name : '<span style="color:red">*</span>name',
		borderWidth : 'Border Width'
	},
	customEditors : {
		SERVICE_LEVEL : new Ext.grid.GridEditor(new Ext.form.ComboBox({
			editable : false,
			mode : "local",
			triggerAction : "all",
			displayField : 'text',
			store : new Ext.data.SimpleStore({
				fields : [ 'value', 'text' ],
				data : [ [ '0', '全国' ], [ '1', '省级' ], [ '2', '市级' ],
						[ '3', '县级' ], [ '4', '乡镇' ], [ '5', '其他' ] ]
			})
		})),
		name : new Ext.grid.GridEditor(new Ext.form.TextField({
			selectOnFocus : true,
			allowBlank : false
		})),
		"出生日期" : new Ext.grid.GridEditor(new Ext.form.DateField({
			format : 'Y-m-d',
			selectOnFocus : true,
			allowBlank : false
		}))
	},
	tbar : [ {
		text : 'Group',
		handler : function() {
			propertyGrid.enableGroup();
		}
	}, '-', {
		text : 'UnGroup',
		handler : function() {
			propertyGrid.disableGroup();
		}
	},{
		text:'createFields',
		handler:function(){
			propertyGrid.getStore();
		}
	} ],
	listeners : {
		beforerender : function() {
			this.getColumnModel().dateFormat = "Y-m-d";
		}

	}
});
var customerView = [
		{
			title : '对公客户比较式营销',
			suspendFitAll : true,
			hideTitle : true,
			layout : 'fit',
			items : [ new Wlj.fields.FieldsDesigner({}) ]
		},
		{
			title : 'designer',
			suspendFitAll : true,
			hideTitle : true,
			layout : 'border',
			items : [/*{
						region : 'west',
						width : 200,
						autoScroll : true,
						labelWidth : 150,
						layout : 'form',
						items : [{
									xtype : 'checkbox',
									fieldLabel : '是否隐藏',
									name : 'hidden',
									listeners : {
										'check' : function() {
											this.designerForm = Ext
													.getCmp('designerForm');
											if (this.checked) {
												this.designerForm
														.add(new Ext.form.TextField(
																{
																	name : 'hidden',
																	fieldLabel : '是否隐藏',
																	disabled : true,
																	value : true
																}));
												this.designerForm.doLayout();
											} else {
												this.designerForm
														.remove(this.designerForm
																.getForm()
																.findField(
																		'hidden'));
												this.designerForm.doLayout();
											}
										}
									}
								},
								{
									xtype : 'checkbox',
									fieldLabel : '字段标签',
									name : 'text',
									listeners : {
										'check' : function() {
											this.designerForm = Ext
													.getCmp('designerForm');
											if (this.checked) {
												this.designerForm
														.add(new Ext.form.TextField(
																{
																	name : 'text',
																	fieldLabel : '字段标签'
																}));
												this.designerForm.doLayout();
											} else {
												this.designerForm
														.remove(this.designerForm
																.getForm()
																.findField(
																		'text'));
												this.designerForm.doLayout();
											}
										}
									}
								},
								{
									xtype : 'checkbox',
									fieldLabel : '是否查询条件',
									name : 'searchField',
									listeners : {
										'check' : function() {
											this.designerForm = Ext
													.getCmp('designerForm');
											if (this.checked) {
												this.designerForm
														.add(new Ext.form.TextField(
																{
																	name : 'searchField',
																	fieldLabel : '是否查询条件',
																	disabled : true,
																	value : true
																}));
												this.designerForm.doLayout();
											} else {
												this.designerForm
														.remove(this.designerForm
																.getForm()
																.findField(
																		'searchField'));
												this.designerForm.doLayout();
											}
										}
									}
								},
								{
									xtype : 'checkbox',
									fieldLabel : 'viewFn',
									name : 'viewFn'
								},
								{
									xtype : 'checkbox',
									fieldLabel : '数据类型',
									name : 'dataType',
									listeners : {
										'check' : function() {
											this.designerForm = Ext
													.getCmp('designerForm');
											if (this.checked) {
												this.designerForm
														.add(new Ext.form.TextField(
																{
																	name : 'dataType',
																	fieldLabel : '数据类型'
																}));
												this.designerForm.doLayout();
											} else {
												this.designerForm
														.remove(this.designerForm
																.getForm()
																.findField(
																		'dataType'));
												this.designerForm.doLayout();
											}
										}
									}
								},
								{
									xtype : 'checkbox',
									fieldLabel : '映射字典项',
									name : 'translateType',
									listeners : {
										'check' : function() {
											this.designerForm = Ext
													.getCmp('designerForm');
											if (this.checked) {
												this.designerForm
														.add(new Ext.form.TextField(
																{
																	name : 'translateType',
																	fieldLabel : '映射字典项'
																}));
												this.designerForm.doLayout();
											} else {
												this.designerForm
														.remove(this.designerForm
																.getForm()
																.findField(
																		'translateType'));
												this.designerForm.doLayout();
											}
										}
									}
								},
								{
									xtype : 'checkbox',
									fieldLabel : '列宽(150)',
									name : 'resutlWidth',
									listeners : {
										'check' : function() {
											this.designerForm = Ext
													.getCmp('designerForm');
											if (this.checked) {
												this.designerForm
														.add(new Ext.form.TextField(
																{
																	name : 'resutlWidth',
																	fieldLabel : '列宽',
																	value : 150
																}));
												this.designerForm.doLayout();
											} else {
												this.designerForm
														.remove(this.designerForm
																.getForm()
																.findField(
																		'resutlWidth'));
												this.designerForm.doLayout();
											}
										}
									}
								}, {
									xtype : 'checkbox',
									fieldLabel : 'xtype',
									name : 'xtype'
								},
								// {xtype:'checkbox',fieldLabel :'字段名称',name :
								// 'innerTree'},
								// {xtype:'checkbox',fieldLabel :'字段名称',name :
								// 'showField'},
								// {xtype:'checkbox',fieldLabel :'字段名称',name :
								// 'hideField'},
								{
									xtype : 'checkbox',
									fieldLabel : '是否在列表中展示',
									name : 'gridField'
								}, {
									xtype : 'checkbox',
									fieldLabel : '字段右键菜单',
									name : 'cmTypes'
								}, {
									xtype : 'checkbox',
									fieldLabel : '查询条件可否为空',
									name : 'cAllowBlank'
								}, {
									xtype : 'checkbox',
									fieldLabel : '下拉框可否多选',
									name : 'multiSelect'
								}, {
									xtype : 'checkbox',
									fieldLabel : '下拉框分隔符',
									name : 'multiSeparator'
								}, {
									xtype : 'checkbox',
									fieldLabel : '下拉框可否编辑',
									name : 'editable'
								}, {
									xtype : 'checkbox',
									fieldLabel : '可否拖动为动态查询条件',
									name : 'enableCondition'
								}, {
									xtype : 'checkbox',
									fieldLabel : '是否展示浮动数据内容',
									name : 'noTitle'
								} ]
					}, */{
						region : 'center',
						layout : 'fit',
						width:300,
						items : [ propertyGrid /*
												 * new Ext.form.FormPanel({
												 * id:'designerForm',
												 * layout:'form', items:[{ name :
												 * 'name', xtype:'textfield',
												 * fieldLabel :'<span
												 * style="color:red">*</span>字段名称',
												 * allowBlank:false }] })
												 */]
					}/*, {
						region : 'east',
						layout : 'fit',
						width : 800,
						items : [ fieldsPropertyGrid ]
					} */]
		},
		{
			title : 'ExtAPI',
			// hideTitle : true,
			suspendFitAll : true,
			html : '<div style="height: 100%; width: 100%;"><iframe style="height: 100%; width: 100%" src = "'
					+ basepath + '/ext-3.4.0/docs/" /></div>'
		} ];

beforeviewshow = function(a) {
	if (a == getCustomerViewByTitle('ExtAPI')) {
		collapseSearchPanel();
	}
};

// "Y年m月d日";
// grid.render("div1");
var formCfgs = {
	formButtons : [ {
		text : '关闭',
		fn : function(formPanel) {
			hideCurrentView();
		}
	} ]
};