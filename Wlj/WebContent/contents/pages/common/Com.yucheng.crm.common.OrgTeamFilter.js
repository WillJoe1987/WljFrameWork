/**
 * 放大镜查询机构团队
 * @author:zh_haining
 * @since:2014-10-29
 *  */
Ext.ns('Com.yucheng.crm.common');
Com.yucheng.crm.common.OrgTeamFilter = Ext.extend(Ext.form.TwinTriggerField, {
	initComponent : function(){
		Com.yucheng.crm.common.OrgTeamFilter.superclass.initComponent.call(this);
	},

	onRender : function(ct, position){
		Com.yucheng.crm.common.OrgTeamFilter.superclass.onRender.call(this, ct, position);
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
	teamId:'',
	orgId:'', 
	validationEvent:false,
	validateOnBlur:false,
	trigger1Class:'x-form-clear-trigger',
	trigger2Class:'x-form-search-trigger',
	hideTrigger1:true,
	width:180,
	searchType:'SUBTREE',//默认查询辖内机构
	searchRoleType:'',//默认查询全部角色信息
	hasSearch : false,
	paramName : 'query',
	listeners:{//增加鼠标点击放大镜输入框触发onTrigger2Click事件
		focus:function(){
			this.onTrigger2Click();
		}
	},
	editable:false,
	onTrigger2Click : function(){
		var _this= this;
		if(_this.orgTeamManageWindow){
			_this.orgTeamManageWindow.show();
			return;
		}
		var searchFunction = function(){
			var parameters = _this.orgTeamSearchPanel.getForm().getFieldValues();
			_this.orgTeamManageInfoStore.removeAll();
			_this.orgTeamManageInfoStore.load({
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
			width:250,
			heigth: 400,
			autoScroll : true,
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
					_this.orgTeamManageInfoStore.removeAll();
					var id = node.id;
					var orgid = node.attributes.UNITID;
					Ext.getCmp('treenode').setValue(id);//
					searchFunction();
				}		
			}	
		});

		_this.orgTeamPanel = new Ext.form.FormPanel({//查询panel
			width:'25%',
			height:150,
			frame:true,
			autoScroll : true,
			region:'west',
			split:true,
			layout:'fit',
			items:[_this.orgUserManageTreeForShow]
		});
		_this.orgTeamSearchPanel = new Ext.form.FormPanel({//查询panel
			title:'团队查询',
			height:120,
			labelWidth:80,//label的宽度
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
						name:'TEAM_ID',
						fieldLabel:'团队编号',
						anchor:'90%'
					}]
				},{
					columnWidth:.4,
					layout:'form',
					items:[{
						xtype:'textfield',
						name:'TEAM_NAME',
						fieldLabel:'团队名称',
						anchor:'90%'
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
				}]
			}],
			buttonAlign:'center',
			buttons:[{
				text:'查询',
				handler:searchFunction
			},{
				text:'重置',
				handler:function(){
					_this.orgTeamSearchPanel.getForm().reset();
					_this.orgTeamManageInfoStore.load({
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
			width : 32
		});
		_this.orgUserInfoColumns = new Ext.grid.ColumnModel([
		    _this.rownum,sm,
		    {header:'ID',dataIndex:'id',id:'id',width:100,sortable : true,hidden : true},
		    {header:'团队编号',dataIndex:'teamId',id:"teamId",width:100,sortable : true},
		    {header:'团队名称',dataIndex:'teamName',id:'teamName',width:200,sortable : true},
		    {header:'所属机构编号',dataIndex:'orgId',id:'orgId',width:100,sortable : true,hidden:false},	
		    {header:'所属机构名称',dataIndex:'orgName',id:'orgName',width:200,sortable : true,hidden:false}
		]);
		_this.orgUserInfoRecord = new Ext.data.Record.create([
		    {name:'id',mapping:'ID'},
		    {name:'teamId',mapping:'TEAM_ID'},
		    {name:'teamName',mapping:'TEAM_NAME'},
		    {name:'orgId',mapping:'ORG_ID'},
		    {name:'orgName',mapping:'ORG_NAME'}
		]);
		_this.orgUserInfoReader = new Ext.data.JsonReader({//读取json数据的panel
			totalProperty:'json.count',
			root:'json.data'
		}, _this.orgUserInfoRecord);
		
		_this.orgUserManageProxy = new Ext.data.HttpProxy({
			url:basepath+'/orgTeamManageAction.json'
		});
		_this.orgTeamManageInfoStore = new Ext.data.Store({
			restful : true,
			baseParams:{
				'role_id':this.searchRoleType,
				'org_id':JsContext._orgId
			},
			proxy : _this.orgUserManageProxy,
			reader :_this.orgUserInfoReader,
			recordType: _this.orgUserInfoRecord
		});
		_this.orgTeamManageInfoStore.on('beforeload',function(){
			var parameters = _this.orgTeamSearchPanel.getForm().getFieldValues();
			_this.orgTeamManageInfoStore.baseParams = {
					'condition':Ext.util.JSON.encode(parameters),
					'role_id':_this.searchRoleType,
					'org_id':JsContext._orgId
			};
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
			_this.orgTeamManageInfoStore.load({
				params : {
					start : 0,
					limit : parseInt(_this.pagesize_combo.getValue())
				}
			});
		});
		_this.bbar = new Ext.PagingToolbar({
			pageSize : number,
			store : _this.orgTeamManageInfoStore,
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
			store:_this.orgTeamManageInfoStore,
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
			
		_this.orgTeamManageWindow=new Ext.Window({
			title : '机构团队管理',
			closable : true,
			plain : true,
			resizable : false,
			collapsible : false,
			height:400,
			width:900,
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
			items:[_this.orgTeamPanel,
			    {
					region:'center',
					layout:'border',
					items:[_this.orgTeamSearchPanel,
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
						_this.setValue(checkedNodes[0].data.teamName);
						if(_this.hiddenField){ 
							_this.hiddenField.setValue(checkedNodes[0].data.teamId);
						}
						_this.orgId=checkedNodes[0].data.orgId;
					}else{
						var sName='';
						var json = [];
						if(checkedNodes.length > 0){
								json.push(checkedNodes[0].data.teamId);
								sName = sName + checkedNodes[0].data.teamName;
							}
						for(var i=1;i<checkedNodes.length;i++){
								json.push(checkedNodes[i].data.teamId);
								sName = sName + ',' + checkedNodes[i].data.teamName;
						};
						_this.setValue(sName);
						if(_this.hiddenField){
							_this.hiddenField.setValue(json);
						}
					};
					if(undefined != json && undefined != sName)
					{
						_this.Id = json;
						_this.setRawValue(sName);
					}
					_this.orgTeamManageWindow.hide();
					if (typeof searchField.callback == 'function') {
						searchField.callback(checkedNodes);
					}
				}
			},{
				text : '取消',
				handler : function() {
					searchField.setRawValue('');
					_this.orgTeamManageWindow.hide();
					_this.hiddenField.setValue('');
				}
			}]
		}); 
		_this.orgTeamManageWindow.on('hide',function(){
			_this.orgTeamSearchPanel.getForm().reset();
			_this.orgTeamManageInfoStore.removeAll();
		});
		_this.orgTeamManageWindow.on('show',function(){
			searchFunction(); 
		});
		_this.orgTeamManageWindow.show();
		return;
	}
});
Ext.reg('teamchoose',Com.yucheng.crm.common.OrgTeamFilter);