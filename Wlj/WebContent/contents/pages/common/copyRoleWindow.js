var _roleCodeGloble = "";
var copyToNewRoleForm = new Ext.form.FormPanel({
		labelWidth:90,
		title:'复制并生成新角色',
		frame:true,
		enableDD  : true,
		animate : false,
		useArrows : false,
		border : false,
//		autoScroll:true,
		region : 'west',
		labelAlign:'middle',
		buttonAlign:'center',
		weight:150,
		height:420,
		items:[{
			layout:'column',
			items:[/*{
				columnWidth : 1	,
				layout : 'form',
				items:[{
					frame:true,
				    xtype: 'panel',
				    height:300,
				    id : 'roleNameLab',
				    html: "<span style='font-size:14px'>※两种复制方式：<br/>1.复制为新角色<br/>2.复制授权到已有角色</span>"
				}]
			},*/{
				columnWidth : 1,
				layout : 'form',
				items:[{
					fieldLabel:'新角色名称',
					xtype:'textfield',
					id:'newRoleName',
					allowBlank:false,
					labelStyle:'text-align:right;',
					anchor:'80%'
				}]
			},{
				columnWidth : 1	,
				layout : 'form',
				items:[{
					fieldLabel:'新角色编码',
					xtype:'textfield',
					allowBlank:false,
					id:'newRoleCode',
					labelStyle:'text-align:right;',
					anchor:'80%'
				}]
			}
			
			]
		}],
		buttons:[{
			text:'确定',
			handler:function(){
				if(!copyToNewRoleForm.getForm().isValid())
				{
					Ext.Msg.alert('提示','请输入完整！');
					return false;
				}
				var newRoleName = Ext.getCmp('newRoleName').getValue();
				var newRoleCode = Ext.getCmp('newRoleCode').getValue();
//				return;
				Ext.Ajax.request({//执行保存设置
					//增量数据操作url
					url : basepath + '/roleManagerQuery!copyNewRole.json?oldRoleCode='+_roleCodeGloble+'&newRoleCode='+newRoleCode+'&newRoleName='+newRoleName,
					method:'GET',
					success:function(response){
						Ext.Msg.alert('提示','操作成功！');
						copyRoleWin.hide();
						copyNewRoleWin.hide();
//						roleStore.load();
					},
					failure:function(){
						Ext.Msg.alert('提示','操作失败！');
					}
				});
			}
		},{
			text:'取消',
			handler:function(){
				copyNewRoleWin.hide();
			}
		}]
	});

var roleSelTbar = new Ext.Toolbar({
	items : ['-',{
		text : '复制到选定角色',
		iconCls : 'detailIconCss',
		handler : function() {
			if(roleSelGrid.getSelectionModel().selections.length>0){
				var _record = roleSelGrid.getSelectionModel().getSelections();
				var roleIds = "";
				for ( var i = 0; i < _record.length; i++) {
					if(i*1 == 0)
					{
						roleIds += _record[i].data.id;
					} else {
						roleIds = roleIds + ',' + _record[i].data.id;
					}
				}
				Ext.Ajax.request({//执行保存设置
					//增量数据操作url
					url : basepath + '/roleManagerQuery!copyRoleToRole.json?oldRoleCode='+_roleCodeGloble+'&toRoleCodes='+roleIds,
					method:'GET',
					success:function(response){
						Ext.Msg.alert('提示','操作成功！');
						copyRoleWin.hide();
						copyNewRoleWin.hide();
//						roleStore.load();
					},
					failure:function(){
						Ext.Msg.alert('提示','操作失败！');
					}
				});
			}else{
				Ext.Msg.alert("操作提示","请选择角色！");
			}
		}
	},'-',{
		text : '复制并生成新角色',
		iconCls : 'addIconCss',
		handler : function() {
		copyNewRoleWin.show();
	}},'-',{
		text : '关闭',
		iconCls : 'resetIconCss',
		handler : function() {
		copyRoleWin.hide();
	}}]
});

//// 列选择模型
var _sm = new Ext.grid.CheckboxSelectionModel();
//// 定义自动当前页行号
var _rownum = new Ext.grid.RowNumberer({
	header : 'No.',
	width : 28
});
//角色栏列模型
var roleSelCm = new Ext.grid.ColumnModel([_rownum,_sm,{
	hidden : true,
	dataIndex : 'id'
},{
	dataIndex : 'roleId', 
	hidden : true
},{
	dataIndex : 'roleCode',
	hidden:true
},{
	hidden :true,
	dataIndex : 'roleType'
},{
	header : '角色名称',
	sortable : true,
	width : 230,
	dataIndex : 'roleName'
}]);

//获取角色url
var _roleProxy = new Ext.data.HttpProxy({
    url : basepath + '/roleManagerQuery!getAuthRoles.json'
});

//角色记录
var _RoleRecord = Ext.data.Record.create([
    {name: 'id', mapping: 'ID'},
    {name: 'roleCode', mapping: 'ROLE_CODE'},                                   
    {name: 'roleId', mapping: 'ROLE_ID'},  
    {name: 'roleName', mapping: 'ROLE_NAME'},
    {name: 'roleType', mapping: 'ROLE_TYPE'},
    {name: 'roleTypeOra', mapping: 'ROLE_TYPE_ORA'},
    {name: 'accountId', mapping: 'ACCOUNT_ID'},
    {name: 'appId', mapping: 'APP_ID'}
]);

//角色数据读取
var _roleReader = new Ext.data.JsonReader({
	successProperty: 'success',
	idProperty: 'id',
	messageProperty: 'message',
	totalProperty: 'json.count',
	root : 'json.data'
},_RoleRecord);

//角色store
var _roleStore = new Ext.data.Store({
    restful : true,
    autoLoad : true,
    proxy : _roleProxy,
    reader : _roleReader,
    recordType:_RoleRecord
});
//角色栏选择grid
var roleSelGrid = new Ext.grid.GridPanel({
//  region : 'west',
	height:420,
	enableDD  : true,
	animate : false,
	useArrows : false,
	autoScroll:true,
	border : false,
	split:true,
	title : '复制权限到已有角色',
    store : _roleStore, 
    tbar : roleSelTbar,
    cm : roleSelCm,
    sm : _sm,
    stripeRows : true, 
    viewConfig : {
    }
});

var accordion = new Ext.Panel({//用于页签展示的Panel
//	region:'east',
	margins:'0 5 0 0',
	split:true,
	width: 750,
	height:390,
	autoWidth:true,
	layout:'accordion',
	items: [ copyToNewRoleForm,roleSelGrid]
});
var copyNewRoleWin = new Ext.Window({
	id:'copyNewRoleWin',
	title:'复制角色',
	width:400,
	height:250,
	closeAction:'hide',
	autoScroll:true,
	closable:true,
	maximizable:false,
	animCollapse:false,
	constrainHeader:true,
	modal:true,
	frame:true,
	layout:'fit',
	items:[
	       copyToNewRoleForm
    ]
});
//复制角色窗口
var copyRoleWin = new Ext.Window({
	id:'copyRoleWin',
	title:'复制角色',
	width:400,
	height:450,
	closeAction:'hide',
	autoScroll:true,
	closable:true,
	maximizable:false,
	animCollapse:false,
	constrainHeader:true,
	modal:true,
	frame:true,
	layout:'fit',
	items:[
//		{
//			layout:'border',
//			items : [ copyToNewRoleForm,roleCopyToRoleForm]
//		}
		{
			layout:'column',
			items:[
			/*{
				columnWidth : 1,
				layout : 'form',
				items:[
				    {
				    	xtype:'panel',
				    	frame:true,
					    items:[
						{
							frame:true,
						    xtype: 'label',
						    id : 'roleNameLab',
						    text: "<span style='color:red font-size=24'>两种复制方式：<br/>1.复制为新角色<br/>2.复制授权到已有角色</span>"
						}]
				    }
				]
	       	},{	
				columnWidth : 1,
				layout : 'form',
				items:[accordion]
			},{	
				columnWidth : .5,
				layout : 'form',
				items:[copyToNewRoleForm]
			},*/
			{
				columnWidth : 1,
				layout : 'form',
				items:[roleSelGrid]
			}
			]
		}
	]
});