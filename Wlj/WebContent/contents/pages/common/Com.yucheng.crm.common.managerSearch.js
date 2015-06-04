/**
 * 查询支行客户经理的放大镜    查询条件中的type控制，来自与本放大镜容器中的type隐藏域
 * @author:luyy
 * @since:2014-07-08
 */
Ext.ns('Com.yucheng.crm.common');
Com.yucheng.crm.common.managerSearch = Ext.extend(Ext.form.TwinTriggerField, {
	initComponent : function(){
		Com.yucheng.crm.common.managerSearch.superclass.initComponent.call(this);
	},

	onRender : function(ct, position){
		Com.yucheng.crm.common.managerSearch.superclass.onRender.call(this, ct, position);
		if(this.hiddenName){
			var ownerForm = this;
			while(ownerForm.ownerCt && !Ext.instanceOf(ownerForm.ownerCt,'form')){				//根据条件查询放大镜控件的最外层容器
				ownerForm = ownerForm.ownerCt;
			};
			if(Ext.instanceOf(ownerForm.ownerCt,'form')){										//判断父容器是否为form类型
				ownerForm = ownerForm.ownerCt;
				if(ownerForm.getForm().findField(this.hiddenName)){								//如果已经创建隐藏域
					this.hiddenField = ownerForm.getForm().findField(this.hiddenName);
				}else {																			//如果未创建隐藏域，则根据hiddenName属性创建隐藏域
					this.hiddenField = ownerForm.add({
						xtype : 'hidden',
						id:this.hiddenName,
						name: this.hiddenName
					});
				}
			}
		}
	},
	hiddenName:false, 
	callback:false,
	orgId:'', 
	validationEvent:false,
	validateOnBlur:false,
	trigger1Class:'x-form-clear-trigger',
	trigger2Class:'x-form-search-trigger',
	hideTrigger1:true,
	width:180,
	listeners:{//增加鼠标点击放大镜输入框触发onTrigger2Click事件
		focus:function(){
			this.onTrigger2Click();
		}
	},
	editable:false,
	onTrigger2Click : function(){
		var _this= this;
		if(_this.orgUserManageWindow){
			_this.orgUserManageWindow.show();
			return;
		}
		var searchFunction = function(){
			var parameters = _this.orgUserSearchPanel.getForm().getFieldValues();
			_this.orgUserManageInfoStore.removeAll();
			//查询控制   1 支行内客户经理 2 区域内非本支行的客户经理   3区域内客户经理   4 跨区域客户经理 
			var type = _this.ownerCt.ownerCt.ownerCt.getForm().findField('type')?_this.ownerCt.ownerCt.ownerCt.getForm().findField('type').getValue():'';
			_this.orgUserManageInfoStore.load({
				params:{
					'condition':Ext.util.JSON.encode(parameters),
					type: type,
					start:0,
					limit: parseInt(_this.pagesize_combo.getValue())
				}
			});
		};
		var searchField = _this;
			    		
		_this.orgUserSearchPanel = new Ext.form.FormPanel({//查询panel
			title:'客户经理查询',
			height:110,
			labelWidth:100,//label的宽度
			labelAlign:'right',
			frame:true,
			autoScroll : true,
			region:'north',
			split:true,
			items:[{
				layout:'column',
				items:[{
					columnWidth:.5,
					layout:'form',
					items:[{
						xtype:'textfield',
						name:'USER_NAME',
						fieldLabel:'客户经理姓名',
						anchor:'90%'
					}]
				}]
			}],
			buttonAlign:'center',
			buttons:[{
				text:'查询',
				handler:searchFunction
			},{
				text:'重置',
				handler:function(){
					_this.orgUserSearchPanel.getForm().reset();
				}
			}]
		});
		//复选框
		var sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect:true
		});
		// 定义自动当前页行号
		_this.rownum = new Ext.grid.RowNumberer({
			header : 'No.',
			width : 28
		});
		_this.orgUserInfoColumns = new Ext.grid.ColumnModel([//gridtable中的列定义
		    _this.rownum,sm,
		    {header:'ID',dataIndex:'id',id:'id',width:100,sortable : true,hidden : true},
		    {header:'客户经理ID',dataIndex:'userId',id:"userId",width:100,sortable : true},
		    {header:'客户经理姓名',dataIndex:'userName',id:'userName',width:100,sortable : true},
		    {header:'所属机构ID',dataIndex:'orgId',id:'orgId',width:100,sortable : true,hidden:false},	
		    {header:'所属机构',dataIndex:'orgName',id:'orgName',width:100,sortable : true,hidden:false}
		]);
		_this.orgUserInfoRecord = new Ext.data.Record.create([
		    {name:'id',mapping:'ID'},
		    {name:'userId',mapping:'ACCOUNT_NAME'},
		    {name:'userName',mapping:'USER_NAME'},
		    {name:'orgId',mapping:'ORG_ID'},
		    {name:'orgName',mapping:'ORG_NAME'}
		]);
		_this.orgUserInfoReader = new Ext.data.JsonReader({//读取json数据的panel
			totalProperty:'json.count',
			root:'json.data'
		}, _this.orgUserInfoRecord);
		
		_this.orgUserManageProxy = new Ext.data.HttpProxy({
			url:basepath+'/managerSearch.json'
		});
		_this.orgUserManageInfoStore = new Ext.data.Store({
			restful : true,
			proxy : _this.orgUserManageProxy,
			reader :_this.orgUserInfoReader,
			recordType: _this.orgUserInfoRecord
		});
		// 每页显示条数下拉选择框
		_this.pagesize_combo = new Ext.form.ComboBox({
			name : 'pagesize',
			triggerAction : 'all',
			mode : 'local',
			store : new Ext.data.ArrayStore({
				fields : [ 'value', 'text' ],
				data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
				         [ 100, '100条/页' ], [ 250, '250条/页' ],
				         [ 500, '500条/页' ] ]
			}),
			valueField : 'value',
			displayField : 'text',
			value : '20',
			forceSelection : true,
			width : 85
		});
			
		var number = parseInt(_this.pagesize_combo.getValue());
		_this.pagesize_combo.on("select", function(comboBox) {
			_this.bbar.pageSize = parseInt(_this.pagesize_combo.getValue()),
			_this.orgUserManageInfoStore.load({
				params : {
					start : 0,
					limit : parseInt(_this.pagesize_combo.getValue())
				}
			});
		});
		_this.bbar = new Ext.PagingToolbar({
			pageSize : number,
			store : _this.orgUserManageInfoStore,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', _this.pagesize_combo]
		});
		_this.orgUserManageGrid =  new Ext.grid.GridPanel({//产品列表数据grid
			frame:true,
			autoScroll : true,
			bbar:_this.bbar,
			stripeRows : true, // 斑马线
			store:_this.orgUserManageInfoStore,
			loadMask:true,
			cm :_this.orgUserInfoColumns,
			sm :sm,
			viewConfig:{
				forceFit:false,
				autoScroll:true
			},
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			}
		});
			
		_this.orgUserManageWindow=new Ext.Window({
			title : '客户经理',
			closable : true,
			plain : true,
			resizable : false,
			collapsible : false,
			height:400,
			width:600,
			draggable : false,
			closeAction : 'hide',
			modal : true, // 模态窗口 
			border : false,
			autoScroll : true,
			closable : true,
			animateTarget : Ext.getBody(),
			constrain : true,
			layout:'border',
			buttonAlign:'center',
			items:{
					region:'center',
					layout:'border',
					items:[_this.orgUserSearchPanel,
					    {
							region:'center',
							layout:'fit',
							items:[_this.orgUserManageGrid]
					    }]				
			    },
			buttons:[{ 
				text : '选定',
				handler : function() {
					var checkedNodes = _this.orgUserManageGrid.getSelectionModel().selections.items;
					if( checkedNodes.length > 0) {
						_this.setValue(checkedNodes[0].data.userName);
						if(_this.hiddenField){ 
							_this.hiddenField.setValue(checkedNodes[0].data.userId);
						}
						_this.orgId=checkedNodes[0].data.orgId;
					}
					_this.orgUserManageWindow.hide();
					if (typeof searchField.callback == 'function') {
						searchField.callback(checkedNodes);
					}
				}
			},{
				text : '取消',
				handler : function() {
					searchField.setRawValue('');
					_this.orgUserManageWindow.hide();
				}
			}]
		}); 
		_this.orgUserManageWindow.on('hide',function(){
			_this.orgUserSearchPanel.getForm().reset();
			_this.orgUserManageInfoStore.removeAll();
		});
		_this.orgUserManageWindow.on('show',function(){
			searchFunction(); 
		});
		_this.orgUserManageWindow.show();
		return;
	}
});
Ext.reg('mangerchoose',Com.yucheng.crm.common.managerSearch);