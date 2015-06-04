/**
 * 放大镜查询机构用户
 * @author:wangwan
 * @since:2012.11.08
 */
Ext.ns('Com.yucheng.crm.common');
Com.yucheng.crm.common.OrgUserManage_VIPSP = Ext.extend(Ext.form.TwinTriggerField, {
	initComponent : function(){
		Com.yucheng.crm.common.OrgUserManage_VIPSP.superclass.initComponent.call(this);
	},

	onRender : function(ct, position){
		Com.yucheng.crm.common.OrgUserManage_VIPSP.superclass.onRender.call(this, ct, position);
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
	singleSelect:'',
	callback:false,
	userId:'',
	orgId:'', 
	validationEvent:false,
	validateOnBlur:false,
	trigger1Class:'x-form-clear-trigger',
	trigger2Class:'x-form-search-trigger',
	hideTrigger1:true,
	width:180,
	searchType:'SUBTREE',//默认查询辖内机构
	searchRoleType:'',//默认查询全部角色信息
	searchRoleCj:'',//要查询角色的层级
	hasSearch : false,
	paramName : 'query',
	onTrigger2Click : function(){
		var _this= this;
		if(_this.orgUserManageWindow){
			_this.orgUserManageWindow.show();
			return;
		}
		var searchFunction = function(){
			var parameters = _this.orgUserSearchPanel.getForm().getFieldValues();
			_this.orgUserManageInfoStore.removeAll();
			_this.orgUserManageInfoStore.load({
				params:{
					'condition':Ext.util.JSON.encode(parameters),
					start:0,
					limit: parseInt(_this.pagesize_combo.getValue())
				}
			});
		};
		var searchField = _this;
		_this.loader = new Com.yucheng.bcrm.ArrayTreeLoader({
			checkField : 'ASTRUE',
			parentAttr : 'SUPERUNITID',
			locateAttr : 'root',//UNITID
			rootValue : (this.searchType=='ALLORG')?'100000000':JsContext._orgId,//'100000000'
			textField : 'UNITNAME',
			idProperties : 'ID'
		});
		var condition = {searchType:this.searchType};
		var filter = false;
		/***********************机构树********************************/
		Ext.Ajax.request({
			url : basepath + '/commsearch.json?condition='+Ext.encode(condition),
			method:'GET',
			success:function(response){
				var nodeArra = Ext.util.JSON.decode(response.responseText).json.data;
				_this.loader.nodeArray = nodeArra;
				var children = _this.loader.loadAll();
				_this.orgUserManageTreeForShow.appendChild(children);
			},failure:function(a,b,c){}
		});
		var s2 = new String('所有机构');
		_this.orgUserManageTreeForShow = new Com.yucheng.bcrm.TreePanel({
			width:'25%',
			heigth: 400,
			/**虚拟树形根节点*/
			root: new Ext.tree.AsyncTreeNode({
				id :(this.searchType=='ALLORG')?'100000000':JsContext._orgId,
				text:(this.searchType=='ALLORG')?'全部机构':JsContext._unitname,
				expanded:true,
				autoScroll:true,
				children:[]
			}),
			resloader:_this.loader,
			region:'west',
			split:true,
			listeners:{
				'click':function(node){
					_this.orgUserManageInfoStore.removeAll();
					var id = node.id;
					var orgid = node.attributes.UNITID;
					Ext.getCmp('treenode').setValue(id);//
					searchFunction();
				}		
			}	
		});

		_this.orgUserPanel = new Ext.form.FormPanel({//查询panel
			width:'25%',
			height:150,
			frame:true,
			autoScroll : true,
			region:'west',
			split:true,
			items:[_this.orgUserManageTreeForShow]
		});
		var condition_role ={searchForRoleType:this.searchRoleType};
		_this.typeStore = new Ext.data.Store({  
			restful:true,   
			autoLoad :true,
			proxy : new Ext.data.HttpProxy({
				url :basepath+'/roleQuery.json'
			}),
			reader : new Ext.data.JsonReader({
				root : 'json.data'
			}, [ 'ROLE_ID', 'ROLE_NAME' ])
		});
		_this.typeStore.baseParams = {
				'condition':Ext.util.JSON.encode(condition_role)
		};
			    		
		_this.orgUserSearchPanel = new Ext.form.FormPanel({//查询panel
			title:'选择审批人',
			height:100,
			labelWidth:100,//label的宽度
			labelAlign:'right',
			frame:true,
			autoScroll : true,
			region:'north',
			split:true,
			items:[{
				layout:'column',
				items:[{
					columnWidth:.4,
					layout:'form',
					items:[{
						xtype:'textfield',
						name:'USER_NAME',
						fieldLabel:'用户姓名',
						anchor:'100%'
					}]
				},{
					columnWidth:.5,
					layout:'form',
					items:[{
						store : _this.typeStore,
						xtype : 'combo',
						name : 'ROLE_ID',
						hiddenName : 'ROLE_ID',
						labelStyle: 'text-align:right;',
						fieldLabel : '用户角色',
						valueField : 'ROLE_ID',
						displayField : 'ROLE_NAME',
						mode : 'local',
						typeAhead : true,
						forceSelection : true,
						triggerAction : 'all',
						emptyText : '请选择',
						selectOnFocus : true,
						anchor : '90%'
					}]
				},{
					columnWidth:.5,
					layout:'form',
					items:[{
						xtype:'textfield',
						name:'TREE_STORE',
						hiddenName :'TREE_STORE',
						id:'treenode',
						fieldLabel:'机构节点',
						anchor:'90%',
						hidden:true,
						value:JsContext._orgId
					}]
				},{
					columnWidth:.5,
					layout:'form',
					items:[{
						xtype : 'combo',
						name : 'ROLE_ID2',
						hiddenName : 'ROLE_ID2',
						fieldLabel : '用户角色',
						anchor : '90%',
						hidden:true,
						value:this.searchRoleType
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
					_this.orgUserManageInfoStore.load({
						params:{
							start:0,
							limit: parseInt(_this.pagesize_combo.getValue())
						}
					});
				}
			}]
		});
		//复选框
		var sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect:_this.singleSelect
		});
		// 定义自动当前页行号
		_this.rownum = new Ext.grid.RowNumberer({
			header : 'No.',
			width : 28
		});
		_this.orgUserInfoColumns = new Ext.grid.ColumnModel([//gridtable中的列定义
		    _this.rownum,sm,
		    {header:'ID',dataIndex:'id',id:'id',width:100,sortable : true,hidden : true},
		    {header:'用户ID',dataIndex:'userId',id:"userId",width:100,hidden:true,sortable : true},
		    {header:'用户姓名',dataIndex:'userName',id:'userName',width:120,sortable : true},
		    {header:'所属机构ID',dataIndex:'orgId',id:'orgId',width:100,hidden:true,sortable : true},	
		    {header:'所属机构',dataIndex:'orgName',id:'orgName',width:120,sortable : true,hidden:false},	
		    {header:'角色',dataIndex:'role',id:'role',width:130,hidden:false,sortable : true}
		]);
		_this.orgUserInfoRecord = new Ext.data.Record.create([
		    {name:'id',mapping:'ID'},
		    {name:'userId',mapping:'ACCOUNT_NAME'},
		    {name:'userName',mapping:'USER_NAME'},
		    {name:'orgId',mapping:'ORG_ID'},
		    {name:'orgName',mapping:'ORG_NAME'},
		    {name:'role',mapping:'ROLE_NAME'}
		]);
		_this.orgUserInfoReader = new Ext.data.JsonReader({//读取json数据的panel
			totalProperty:'json.count',
			root:'json.data'
		}, _this.orgUserInfoRecord);
		
		_this.orgUserManageProxy = new Ext.data.HttpProxy({
			url:basepath+'/orgusermanageVipsp.json'
		});
		_this.orgUserManageInfoStore = new Ext.data.Store({
			restful : true,
			baseParams:{
				'role_id':this.searchRoleType,
				'org_id':JsContext._orgId,
				'role_cj':this.searchRoleCj
			},
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
//			title : '选择审批人',
			closable : true,
			plain : true,
			resizable : false,
			collapsible : false,
			height:400,
			width:700,
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
			items:[
//			       _this.orgUserPanel,
			    {
					region:'center',
					layout:'border',
					items:[_this.orgUserSearchPanel,
					    {
							region:'center',
							layout:'fit',
							items:[_this.orgUserManageGrid]
					    }]				
			    }],
			buttons:[{ 
				text : '选定',
				handler : function() {
					var checkedNodes = _this.orgUserManageGrid.getSelectionModel().selections.items;
					if(_this.singleSelect && checkedNodes.length > 0) {
						_this.setValue(checkedNodes[0].data.userName);
						if(_this.hiddenField){ // 2013-04-18 ZM
							_this.hiddenField.setValue(checkedNodes[0].data.userId);
						}
						_this.orgId=checkedNodes[0].data.orgId;
					}else{
						var sName='';
						var json = '';
						if(checkedNodes.length > 0){
								json = json + checkedNodes[0].data.userId;
								sName = sName + checkedNodes[0].data.userName;
							}
						for(var i=1;i<checkedNodes.length;i++){
								json = json + ',' + checkedNodes[i].data.userId;
								sName = sName + ',' + checkedNodes[i].data.userName;
						};
						_this.setValue(sName);
						if(_this.hiddenField){
							_this.hiddenField.setValue(json);
						}
					};
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
//	---	_this.orgUserManageInfoStore.load();
			searchFunction(); // 2013-04-19 ZM 修复机构用户放大镜默认查询分页问题
		});
		_this.orgUserManageWindow.show();
//		searchFunction();
		return;
	}
});
Ext.reg('userchoose',Com.yucheng.crm.common.OrgUserManage_VIPSP);