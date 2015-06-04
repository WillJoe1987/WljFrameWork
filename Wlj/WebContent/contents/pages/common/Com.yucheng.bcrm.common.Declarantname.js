/**
 * @description 申报人选择器
 * @author dongyi
 * @since 2014-07-16
 */
Ext.ns('Com.yucheng.bcrm.common');
Com.yucheng.bcrm.common.Declarantname = Ext.extend(Ext.form.TwinTriggerField, {
	
	initComponent : function(){
		Com.yucheng.bcrm.common.Declarantname.superclass.initComponent.call(this);
	},

	onRender : function(ct, position){
		Com.yucheng.bcrm.common.Declarantname.superclass.onRender.call(this, ct, position);
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
	declarantName: '',//申报人
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
		if(_this.relaPartyInfoWindow){
			_this.relaPartyInfoWindow.show();
			return;
		}
		/**
		 * 查询方法定义
		 */
		var searchFunction = function(){
			var parameters = _this.relaPartyInfoPanel.getForm().getFieldValues(false);
			_this.relaPartyInfoStore.removeAll();
			_this.relaPartyInfoStore.load({
				params:{
					'condition':Ext.encode(parameters),
					start:0,
					limit: parseInt(_this.pagesize_combo.getValue())
				}
			});
		};
		var searchField = _this;
		/**
		 * 
		 */
		_this.relaPartyInfoPanel = new Ext.form.FormPanel({//查询panel
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
						{xtype:'textfield',name:'DECLARANT_NAME',fieldLabel:'申报人',anchor:'90%'}
					]
				},{
					columnWidth:.5,
					layout:'form',
					items:[
						{xtype:'textfield',name:'IDENT_NO',fieldLabel:'申报人证件号码',anchor:'90%'}
					]
				}]
			}],
			buttons:[{
				text:'查询',
				handler:searchFunction
			},{
				text:'重置',
				handler:function(){
					_this.relaPartyInfoPanel.getForm().reset();
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
		_this.relaPartyInfoCm = new Ext.grid.ColumnModel([
		    _this.rownum,sm,
		    {header:'关联方编号',dataIndex:'MAIN_ID',width:100,sortable : true,hidden:true},
		    {header:'申报人名称',dataIndex:'DECLARANT_NAME',width:100,sortable : true},
		    {header:'申报人属性',dataIndex:'DECLARANT_ATTR',width:150,sortable : true,hidden:true},
		    {header:'申报人证件类型',dataIndex:'IDENT_TYPE',width:100,sortable : true,hidden:true},
		    {header:'申报人证件号码',dataIndex:'IDENT_NO',width:100,sortable : true},
		    {header:'申报人电话号码',dataIndex:'TEL',width:100,sortable : true,hidden:true},
		    {header:'申报人邮箱',dataIndex:'EMAIL',width:100,sortable : true,hidden:true},
		    {header:'申报人联系地址',dataIndex:'CONTACT_ADDR',width:100,sortable : true,hidden:true},
		    {header:'申报人与银行关系',dataIndex:'DECLARANT_BANK_REL',width:100,sortable : true,hidden:true}
		]);
		_this.relaPartyInfoRecord = new Ext.data.Record.create([
			{name:'MAIN_ID'},
		    {name:'DECLARANT_NAME'},
		    {name:'DECLARANT_ATTR'},
		    {name:'IDENT_TYPE'},
		    {name:'IDENT_NO'},
		    {name:'TEL'},
		    {name:'EMAIL'},
		    {name:'CONTACT_ADDR'},
		    {name:'DECLARANT_BANK_REL'}
		]);
		_this.relaPartyInfoReader = new Ext.data.JsonReader({
			totalProperty:'json.count',
			root:'json.data'
		}, _this.relaPartyInfoRecord);
		
		_this.relaPartyInfoProxy = new Ext.data.HttpProxy({
			url:basepath+'/DeclarantNameQuery.json'
		});
		_this.relaPartyInfoStore = new Ext.data.Store({
			restful : true,
			proxy : _this.relaPartyInfoProxy,
			reader :_this.relaPartyInfoReader,
			recordType: _this.relaPartyInfoRecord
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
			store : _this.relaPartyInfoStore,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			emptyMsg : "没有符合条件的记录",
			items : ['-', '&nbsp;&nbsp;', _this.pagesize_combo]
		});
		/**
		 * 指标选择grid定义
		 */
		_this.relaPartyInfoGrid =  new Ext.grid.GridPanel({//grid
			frame:true,
			autoScroll : true,
			bbar:_this.bbar,
			stripeRows : true, // 斑马线
			store:_this.relaPartyInfoStore,
			loadMask:true,
			cm :_this.relaPartyInfoCm,
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
		_this.relaPartyInfoWindow=new Ext.Window({
			title : '申报人选择',
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
			animaterelaPartyInfo : Ext.getBody(),
			constrain : true,
			layout:'border',
			buttonAlign:'center',
			items:[_this.relaPartyInfoPanel,_this.relaPartyInfoGrid],
			buttons:[{
				/**
				 * 选定指标操作
				 */
				text : '选定',
				handler : function() {
					var checkedNodes = _this.relaPartyInfoGrid.getSelectionModel().selections.items;
					if(_this.singleSelect && checkedNodes.length > 0) {
						_this.setValue(checkedNodes[0].data.DECLARANT_NAME);
						if(_this.hiddenField){
							_this.hiddenField.setValue(checkedNodes[0].data.RELATE_ID);
						}
					}else{
						var sName='';
						var json = '';
						if(checkedNodes.length > 0){
							json = json + checkedNodes[0].data.RELATE_ID;
							sName = sName + checkedNodes[0].data.DECLARANT_NAME;
						}
						for(var i=1;i<checkedNodes.length;i++){
							json = json + ',' + checkedNodes[i].data.RELATE_ID;
							sName = sName + ',' + checkedNodes[i].data.DECLARANT_NAME;
						}
						_this.setValue(sName);
						if(_this.hiddenField){
							_this.hiddenField.setValue(json);
						}
					};
					_this.relaPartyInfoWindow.hide();
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
					_this.relaPartyInfoWindow.hide();
				}
			}]
		});
		/**
		 * 添加事件监听,在隐藏指标面板时移除面板数据
		 */
		_this.relaPartyInfoWindow.on('hide',function(){
			_this.relaPartyInfoPanel.getForm().reset();
			_this.relaPartyInfoStore.removeAll();
		});
		_this.relaPartyInfoWindow.on('show',function(){
			searchFunction();
		});
		_this.relaPartyInfoWindow.show();
		return;
	}
});
Ext.reg('declarantnamechoose',Com.yucheng.bcrm.common.Declarantname);