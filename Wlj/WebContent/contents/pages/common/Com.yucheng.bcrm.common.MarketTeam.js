/**
 * @description 营销团队放大镜
 * @author helin
 * @since 2014-09-03
 */
Ext.ns('Com.yucheng.bcrm.common');
Com.yucheng.bcrm.common.MarketTeam = Ext.extend(Ext.form.TwinTriggerField, {
	
	initComponent : function(){
		Com.yucheng.bcrm.common.MarketTeam.superclass.initComponent.call(this);
	},

	onRender : function(ct, position){
		Com.yucheng.bcrm.common.MarketTeam.superclass.onRender.call(this, ct, position);
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
						name: this.hiddenName
					});
				}
			}
		}
	},
	hiddenName:false, 
	singleSelect:false,
	callback:false,
	validationEvent:false,
	validateOnBlur:false,
	trigger1Class:'x-form-clear-trigger',
	trigger2Class:'x-form-search-trigger',
	hideTrigger1:true,
	width:180,
	hasSearch : false,
	paramName : 'query',
	editable:false,
	listeners:{//增加鼠标点击放大镜输入框触发onTrigger2Click事件
		focus:function(){
			if(!this.disabled){ //禁用的放大镜不允许弹出选择
				this.onTrigger2Click();
			}
		}
	},
	onTrigger2Click : function(){
		//禁用的放大镜不允许弹出选择
		if(this.disabled){
			return ;
		}
		var _this= this;
		if(_this.teamWindow){
			_this.teamWindow.show();
			return;
		}
		/**
		 * 查询方法定义
		 */
		var searchFunction = function(){
			var parameters = _this.teamPanel.getForm().getFieldValues(false);
			_this.teamStore.removeAll();
			_this.teamStore.load({
				params:{
					'condition':Ext.encode(parameters),
					start:0,
					limit: parseInt(_this.pagesize_combo.getValue())
				}
			});
		};
		var searchField = _this;
		_this.teamTypeStore = new Ext.data.Store( {
			restful : true,
			autoLoad : true,
			sortInfo : {
		            field:'key',
		            direction:'ASC'
		        },
			proxy : new Ext.data.HttpProxy( {
				url : basepath + '/lookup.json?name=CUSTMANAGER_TEAM_TYPE'
			}),
			reader : new Ext.data.JsonReader( {
				root : 'JSON'
			},['key','value'])
		});
		/**
		 * 团队查询面板
		 */
		_this.teamPanel = new Ext.form.FormPanel({//查询panel
			height:90,
			labelWidth:100,//label的宽度
			labelAlign:'right',
			frame:true,
			autoScroll : true,
			region:'north',
			split:true,
			buttonAlign:'center',
			items:[{
				layout:'column',
				items:[{
					columnWidth:.5,
					layout:'form',
					items:[
						{xtype:'textfield',name:'MKT_TEAM_NAME',fieldLabel:'团队名称',anchor:'90%'}
					]
				},{
					columnWidth:.5,
					layout:'form',
					items:[
						{xtype : 'combo',name:'TEAM_TYPE',hiddenName : 'TEAM_TYPE',fieldLabel : '团队类型',triggerAction : 'all',
							store : _this.teamTypeStore,displayField : 'value',valueField : 'key',mode : 'local',emptyText:'请选择 ',resizable : true,anchor : '90%'}
					]
				}]
			}],
			buttons:[{
				text:'查询',
				handler:searchFunction
			},{
				text:'重置',
				handler:function(){
					_this.teamPanel.getForm().reset();
					searchFunction();
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
		_this.teamCm = new Ext.grid.ColumnModel([
		    _this.rownum,sm,
		    {header:'团队编号',dataIndex:'MKT_TEAM_ID',width:100,sortable : true},
		    {header:'团队名称',dataIndex:'MKT_TEAM_NAME',width:150,sortable : true},
		    {header:'团队类型',dataIndex:'TEAM_TYPE_ORA',width:100,sortable : true},
		    {header:'负责人',dataIndex:'TEAM_LEADER',width:100,sortable : true,hidden:true},	
		    {header:'团队人数',dataIndex:'TEAM_SCALE',width:100,sortable : true}
		]);
		_this.teamRecord = new Ext.data.Record.create([
		    {name:'MKT_TEAM_ID'},
		    {name:'MKT_TEAM_NAME'},
		    {name:'TEAM_TYPE_ORA'},
		    {name:'TEAM_LEADER_ID'},
		    {name:'TEAM_LEADER'},
		    {name:'TEAM_SCALE'}
		]);
		_this.teamReader = new Ext.data.JsonReader({
			totalProperty:'json.count',
			root:'json.data'
		}, _this.teamRecord);
		
		_this.teamProxy = new Ext.data.HttpProxy({
			url:basepath+'/customerMktTeamInformationAdd.json'
		});
		_this.teamStore = new Ext.data.Store({
			restful : true,
			proxy : _this.teamProxy,
			reader :_this.teamReader,
			recordType: _this.teamRecord
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
		//当前分页条数
		var number = parseInt(_this.pagesize_combo.getValue());
		/**
		 * 监听分页下拉框选择事件
		 */
		_this.pagesize_combo.on("select", function(comboBox) {
			_this.bbar.pageSize = parseInt(_this.pagesize_combo.getValue()),
			searchFunction();
		});
		//分页工具条定义
		_this.bbar = new Ext.PagingToolbar({
			pageSize : number,
			store : _this.teamStore,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', _this.pagesize_combo]
		});
		/**
		 * 团队选择grid定义
		 */
		_this.teamGrid =  new Ext.grid.GridPanel({//产品列表数据grid
			frame:true,
			autoScroll : true,
			bbar:_this.bbar,
			stripeRows : true, // 斑马线
			store:_this.teamStore,
			loadMask:true,
			cm :_this.teamCm,
			sm :sm,
			region:'center',
			viewConfig:{
				forceFit:false,
				autoScroll:true
			},
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			}
		});
		
		/**
		 * 团队选择window定义
		 */
		_this.teamWindow=new Ext.Window({
			title : '客户经理团队',
			closable : true,
			plain : true,
			resizable : false,
			collapsible : false,
			height:400,
			width:760,
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
			items:[_this.teamPanel,_this.teamGrid],
			buttons:[{
				/**
				 * 选定团队操作
				 */
				text : '选定',
				handler : function() {
					var checkedNodes = _this.teamGrid.getSelectionModel().selections.items;
					if(_this.singleSelect && checkedNodes.length > 0) {
						_this.setValue(checkedNodes[0].data.MKT_TEAM_NAME);
						if(_this.hiddenField){
							_this.hiddenField.setValue(checkedNodes[0].data.MKT_TEAM_ID);
						}
					}else{
						var sName='';
						var json = '';
						if(checkedNodes.length > 0){
							json = json + checkedNodes[0].data.MKT_TEAM_ID;
							sName = sName + checkedNodes[0].data.MKT_TEAM_NAME;
						}
						for(var i=1;i<checkedNodes.length;i++){
							json = json + ',' + checkedNodes[i].data.MKT_TEAM_ID;
							sName = sName + ',' + checkedNodes[i].data.MKT_TEAM_NAME;
						}
						_this.setValue(sName);
						if(_this.hiddenField){
							_this.hiddenField.setValue(json);
						}
					};
					_this.teamWindow.hide();
					if(typeof searchField.callback == 'function') {
						searchField.callback(checkedNodes);
					}
				}
			},{
				text : '取消',
				handler : function() {
					searchField.setRawValue('');
					if(searchField.hiddenField){
						searchField.hiddenField.setValue('');
					}
					_this.teamWindow.hide();
				}
			}]
		});
		/**
		 * 添加事件监听,在隐藏团队面板时移除面板数据
		 */
		_this.teamWindow.on('hide',function(){
			_this.teamPanel.getForm().reset();
			_this.teamStore.removeAll();
		});
		_this.teamWindow.on('show',function(){
			searchFunction();
		});
		_this.teamWindow.show();
		return;
	}
});
Ext.reg('teamchoose',Com.yucheng.bcrm.common.MarketTeam);