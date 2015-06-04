/**
 * @description 营销任务选择器
 * @author helin
 * @since 2014-07-10
 */
Ext.ns('Com.yucheng.bcrm.common');
Com.yucheng.bcrm.common.MarketTask = Ext.extend(Ext.form.TwinTriggerField, {
	
	initComponent : function(){
		Com.yucheng.bcrm.common.MarketTask.superclass.initComponent.call(this);
	},

	onRender : function(ct, position){
		Com.yucheng.bcrm.common.MarketTask.superclass.onRender.call(this, ct, position);
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
	searchType: 'ALL',//查询类型：ALL 所有任务,PARENT 能查看到权限的任务的上级任务,CURRENT 有权限的任务,
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
		if(_this.taskWindow){
			_this.taskWindow.show();
			return;
		}
		/**
		 * 查询方法定义
		 */
		var searchFunction = function(){
			_this.taskPanel.getForm().findField('SEARCH_TYPE').setValue(_this.searchType);
			var parameters = _this.taskPanel.getForm().getFieldValues(false);
			_this.taskStore.removeAll();
			_this.taskStore.load({
				params:{
					'condition':Ext.encode(parameters),
					start:0,
					limit: parseInt(_this.pagesize_combo.getValue())
				}
			});
		};
		var searchField = _this;
		/**
		 * 任务查询面板
		 */
		_this.taskPanel = new Ext.form.FormPanel({//查询panel
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
						{xtype:'textfield',name:'TASK_ID',fieldLabel:'任务编号',anchor:'90%'}
					]
				},{
					columnWidth:.5,
					layout:'form',
					items:[
						{xtype:'textfield',name:'TASK_NAME',fieldLabel:'任务名称',anchor:'90%'},
						{xtype:'textfield',name:'SEARCH_TYPE',hidden: true}
					]
				}]
			}],
			buttons:[{
				text:'查询',
				handler:searchFunction
			},{
				text:'重置',
				handler:function(){
					_this.taskPanel.getForm().reset();
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
		_this.taskCm = new Ext.grid.ColumnModel([
		    _this.rownum,sm,
		    {header:'任务编号',dataIndex:'TASK_ID',width:100,sortable : true},
		    {header:'任务名称',dataIndex:'TASK_NAME',width:150,sortable : true},
		    {header:'任务类型ID',dataIndex:'TASK_TYPE',width:100,sortable : true,hidden:true},	
		    {header:'任务类型',dataIndex:'TASK_TYPE_ORA',width:150,sortable : true},
		    {header:'任务状态ID',dataIndex:'TASK_STAT',width:100,sortable : true,hidden:true},	
		    {header:'任务状态',dataIndex:'TASK_STAT_ORA',width:150,sortable : true},
		    {header:'执行对象类型ID',dataIndex:'DIST_TASK_TYPE',width:100,sortable : true,hidden:true},	
		    {header:'执行对象类型',dataIndex:'DIST_TASK_TYPE_ORA',width:150,sortable : true},
		    {header:'开始时间',dataIndex:'TASK_BEGIN_DATE',width:150,sortable : true},
		    {header:'结束时间',dataIndex:'TASK_END_DATE',width:150,sortable : true}
		]);
		_this.taskRecord = new Ext.data.Record.create([
		    {name:'TASK_ID'},
		    {name:'TASK_NAME'},
		    {name:'TASK_TYPE'},
		    {name:'TASK_TYPE_ORA'},
		    {name:'TASK_STAT'},
		    {name:'TASK_STAT_ORA'},
		    {name:'DIST_TASK_TYPE'},
		    {name:'DIST_TASK_TYPE_ORA'},
		    {name:'TASK_BEGIN_DATE'},
		    {name:'TASK_END_DATE'}
		]);
		_this.taskReader = new Ext.data.JsonReader({
			totalProperty:'json.count',
			root:'json.data'
		}, _this.taskRecord);
		
		_this.taskProxy = new Ext.data.HttpProxy({
			url:basepath+'/marketTask.json'
		});
		_this.taskStore = new Ext.data.Store({
			restful : true,
			proxy : _this.taskProxy,
			reader :_this.taskReader,
			recordType: _this.taskRecord
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
			store : _this.taskStore,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', _this.pagesize_combo]
		});
		/**
		 * 指标选择grid定义
		 */
		_this.taskGrid =  new Ext.grid.GridPanel({//产品列表数据grid
			frame:true,
			autoScroll : true,
			bbar:_this.bbar,
			stripeRows : true, // 斑马线
			store:_this.taskStore,
			loadMask:true,
			cm :_this.taskCm,
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
		 * 指标选择window定义
		 */
		_this.taskWindow=new Ext.Window({
			title : '营销任务选择',
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
			items:[_this.taskPanel,_this.taskGrid],
			buttons:[{
				/**
				 * 选定指标操作
				 */
				text : '选定',
				handler : function() {
					var checkedNodes = _this.taskGrid.getSelectionModel().selections.items;
					if(_this.singleSelect && checkedNodes.length > 0) {
						_this.setValue(checkedNodes[0].data.TASK_NAME);
						if(_this.hiddenField){
							_this.hiddenField.setValue(checkedNodes[0].data.TASK_ID);
						}
					}else{
						var sName='';
						var json = '';
						if(checkedNodes.length > 0){
							json = json + checkedNodes[0].data.TASK_ID;
							sName = sName + checkedNodes[0].data.TASK_NAME;
						}
						for(var i=1;i<checkedNodes.length;i++){
							json = json + ',' + checkedNodes[i].data.TASK_ID;
							sName = sName + ',' + checkedNodes[i].data.TASK_NAME;
						}
						_this.setValue(sName);
						if(_this.hiddenField){
							_this.hiddenField.setValue(json);
						}
					};
					_this.taskWindow.hide();
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
					_this.taskWindow.hide();
				}
			}]
		});
		/**
		 * 添加事件监听,在隐藏指标面板时移除面板数据
		 */
		_this.taskWindow.on('hide',function(){
			_this.taskPanel.getForm().reset();
			_this.taskStore.removeAll();
		});
		_this.taskWindow.on('show',function(){
			searchFunction();
		});
		_this.taskWindow.show();
		return;
	}
});
Ext.reg('taskchoose',Com.yucheng.bcrm.common.MarketTask);