Ext.ns('Com.yucheng.crm.common');
/**
 * 产品放大镜
 * @author songxs
 * @modefy luyy 2014-07-01
 * @since 2012-12-17
 */
Com.yucheng.crm.common.ProductManage = Ext.extend(Ext.form.TwinTriggerField, {
	
	initComponent : function(){
		Com.yucheng.crm.common.ProductManage.superclass.initComponent.call(this);
	},

	onRender : function(ct, position){
		Com.yucheng.crm.common.ProductManage.superclass.onRender.call(this, ct, position);
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
	prodState:'',//格式：('1,2')，默认这全部查询
	riskLevel:'',
	singleSelect:'',
	fitCust:'all',//适用客户类型  all:所有  perOnly:仅对私   comOnly:仅对公   默认为所有
	callback:false,
	productId:'',
	is_per:false,
	validationEvent:false,
	validateOnBlur:false,
	trigger1Class:'x-form-clear-trigger',
	trigger2Class:'x-form-search-trigger',
	hideTrigger1:true,
	width:180,
	hasSearch : false,
	paramName : 'query',
	listeners:{//增加鼠标点击放大镜输入框触发onTrigger2Click事件
		focus:function(){
			if(!this.disabled){ //禁用的放大镜不允许弹出选择
				this.onTrigger2Click();
			}
		}
	},
	onTrigger2Click : function(){
		if(this.disabled){ //禁用的放大镜不允许弹出选择
			return;
		}
		var _this= this;
		var searchFunction = function(){
			var selectRe;
			var tempId;
			var idStr = '';
			if(productLeftTreeForShow.getChecked()){
				for(var i=0;i<productLeftTreeForShow.getChecked().length;i++){
					selectRe = productLeftTreeForShow.getChecked()[i];
					tempId = selectRe.id;
					idStr += tempId;
					if( i != productLeftTreeForShow.getChecked().length-1)
	                		idStr += ',';
				}
			}
			var parameters = productSearchPanel.getForm().getValues(false);
			productManageInfoStore.removeAll();
			productManageInfoStore.baseParams = {
					'condition':Ext.util.JSON.encode(parameters)
			};
				productManageInfoStore.load({
					params:{
						'idStr':idStr,
						fitCust:_this.fitCust,
						start:0,
						limit: parseInt(spagesize_combo.getValue())
					}
				});
			
		};
		var searchField = this;
		var loader = new Com.yucheng.bcrm.ArrayTreeLoader({
			checkField : 'ASTRUE',//选择字段
			parentAttr : 'CATL_PARENT',
			locateAttr : 'root',//UNITID
			rootValue :'0',
			textField : 'CATL_NAME',
			idProperties : 'CATL_CODE'//节点点击事件句柄
		});
		var condition = {searchType:this.searchType};
		var filter = false;
		var _url='';
		if(_this.is_per){
			_url=basepath + '/perProductCatlTreeAction.json';//查询对私产品
		}else{
			_url=basepath + '/productCatlTreeAction.json';
		}
		Ext.Ajax.request({//产品树数据加载
			url :_url ,
			method:'GET',
			success:function(response){
				var nodeArra = Ext.util.JSON.decode(response.responseText).json.data;
				loader.nodeArray = nodeArra;
				var children = loader.loadAll();
				Ext.getCmp('productLeftTreeForShow').appendChild(children);
			}
		});
			
		var productLeftTreeForShow = new Com.yucheng.bcrm.TreePanel({//左侧显示的树
			id:'productLeftTreeForShow',
			height : document.body.clientHeight,
			width : 200,
			autoScroll:true,
			checkBox : true, //是否现实复选框：
			_hiddens : [],
			resloader:loader,//加载产品树
			region:'west',//布局位置设置
			split:true,
			root: new Ext.tree.AsyncTreeNode({//设置根节点
				id:'root',
				expanded:true,
				text:'银行产品树',
				autoScroll:true,
				children:[]
			}),
			listeners:{
				'checkchange' : function(node, checked) {
					if (checked) {
						var childNodes = node.childNodes;
						for ( var i = 0; i < childNodes.length; i++) {
							childNodes[i].getUI().toggleCheck(true);
						}
					} else {
						var childNodes = node.childNodes;
						for ( var i = 0; i < childNodes.length; i++) {
							childNodes[i].getUI().toggleCheck(false);
						}
					}
				}
			},
			clickFn:function(node){//单击事件，当单击树节点时触发并且获得这个节点的CATL_CODE
				if(node.attributes.CATL_CODE == undefined){
					Ext.MessageBox.alert('提示', '不能选择根节点,请重新选择 !');
					return;
				}
				if(node.attributes.id!= ''){
					productManageInfoStore.baseParams = {
							'condition':'{"CATL_CODE":"'+node.attributes.CATL_CODE+'"}'
					};
					idStr = "";
					productManageInfoStore.load({//重新加载产品列表
						params:{
						   'idStr':idStr,
						    fitCust:_this.fitCust,
							limit:parseInt(spagesize_combo.getValue()),
							start:0
						}
					});		
				}
			}
		}); 
		var _this = this;

		var productSearchPanel = new Ext.form.FormPanel({//查询panel
			title:'产品查询',
			height:60,
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
						name:'PRODUCT_ID',
						fieldLabel:'产品编号',
						anchor:'90%'
					},{
						xtype:'hidden',
						name:'PROD_STATE',
						value:this.prodState
					}]
				},{
					columnWidth:.4,
					layout:'form',
					items:[{
						xtype:'textfield',
						name:'PROD_NAME',
						fieldLabel:'产品名称',
						anchor:'90%'
					}]
				},{
					xtype:'hidden',
					name:'RISK_LEVEL',
					value:this.riskLevel
				}]
			}],
			buttonAlign:'center',
			buttons:[{
				text:'查询',
				id:'searchbutton',
				handler:searchFunction
			},{
				text:'重置',
				handler:function(){
					productSearchPanel.getForm().reset();
					productSearchPanel.getForm().setValues({
						RISK_LEVEL:_this.riskLevel,
						PROD_STATE:_this.prodState
					});
					var childNodes = productLeftTreeForShow.getChecked();
					if(productLeftTreeForShow.getChecked().length!=0){
						for(var i = 0;i<childNodes.length;i++){
							childNodes[i].getUI().toggleCheck(false);
						}
					}
					searchFunction();
				}
			}]
		});
			    	
		var tbar = new Ext.Toolbar({				
			items : [{ 
				text : '选定',
				handler : function() {
					var checkedNodes = productManageGrid.getSelectionModel().selections.items;
					if(_this.singleSelect) {
						_this.setValue(checkedNodes[0].data.productName);
						_this.hiddenField.setValue(checkedNodes[0].data.productId);
					}else{
						var sName='';
						var json = '';
						for(var i=0;i<checkedNodes.length;i++){
							if(i == 0){
								json = json + checkedNodes[i].data.productId;
								sName = sName + checkedNodes[i].data.productName;
							}else{
								json = json +',' +checkedNodes[i].data.productId;
								sName = sName + ',' + checkedNodes[i].data.productName;
							}
						};
						_this.setValue(sName);
						if(_this.hiddenField){
							_this.hiddenField.setValue(json);
						}
					};
					productManageWindow.hide();
					if (typeof searchField.callback == 'function') {
						searchField.callback(checkedNodes);
					}
				}
			},'-',{
				text : '取消',
				handler : function() {
					searchField.setRawValue('');
					productManageWindow.hide();
				}
			}]
		});
		var sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect:_this.singleSelect});    		
		var rownum = new Ext.grid.RowNumberer({
			header : 'No.',
			width : 28
		});
		var productInfoColumns = new Ext.grid.ColumnModel([rownum,sm,
	        {header :'产品编号',dataIndex:'productId',id:"productId",sortable : true,width:80},
	        {header:'产品名称',dataIndex:'productName',id:'productName',sortable : true,width:150},
	        {header :'产品状态',dataIndex:'PROD_STATE_ORA',id:"productId",sortable : true,width:80},
	        {header:'风险等级',dataIndex:'RISK_LEVEL_ORA',id:'productName',sortable : true,width:80},
	        {header:'',dataIndex:'RISK_LEVEL',hidden:true},
	        {header:'',dataIndex:'PROD_STATE',hidden:true},
	        {header:'',dataIndex:'CATL_CODE',hidden:true},
	        {header:'产品类别',dataIndex:'CATL_NAME',sortable : true,width:150},
	        {header:'适用客户',dataIndex:'TYPE_FIT_CUST',width:100,renderer:function(value){
	        	if(value == '1')
	        		return '对私';
	        	if(value == '1')
	        		return '对公';
	        	else
	        		return '对私，对公';
	        }}
	        ]);
	
		var productInfoRecord = new Ext.data.Record.create([	
		    {name:'productId',mapping:'PRODUCT_ID'},
		    {name:'productName',mapping:'PROD_NAME'},
		    {name:'PROD_STATE_ORA'},
		    {name:'RISK_LEVEL_ORA'},
		    {name:'PROD_STATE'},
		    {name:'RISK_LEVEL'},
		    {name:'CATL_CODE'},
		    {name:'CATL_NAME'},
		    {name:'TYPE_FIT_CUST'}
		    ]);
	
		var productInfoReader = new Ext.data.JsonReader({//读取json数据的panel
			totalProperty:'json.count',
			root:'json.data'
		},productInfoRecord);
	
		var productManageInfoStore = new Ext.data.Store({
			proxy:new Ext.data.HttpProxy({
				url:basepath+'/comProductTree-action.json',
				method:'GET'
			}),
			reader:productInfoReader
		});

		var spagesize_combo = new Ext.form.ComboBox({	// 每页显示条数下拉选择框
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

		spagesize_combo.on("select", function(comboBox) {// 改变每页显示条数reload数据
			bbar.pageSize = parseInt(spagesize_combo.getValue()),
			searchFunction();
		});
	
		var bbar = new Ext.PagingToolbar({	// 分页工具栏
			pageSize : parseInt(spagesize_combo.getValue()),
			store : productManageInfoStore,
			displayInfo : true,
			displayMsg : '显示{0}条到{1}条,共{2}条',
			emptyMsg : "没有符合条件的记录",
			items : [ '-', '&nbsp;&nbsp;', spagesize_combo ]
		});
	
		var productManageGrid =  new Ext.grid.GridPanel({//产品列表数据grid
			id:'productManageGrid',
			frame:true,
			autoScroll : true,
			tbar:tbar,
			bbar:bbar,
			stripeRows : true, // 斑马线
			store:productManageInfoStore,
			loadMask:true,
			cm :productInfoColumns,
			sm :sm,
			viewConfig:{
				forceFit:false,
				autoScroll:true
			},
			loadMask : {
				msg : '正在加载表格数据,请稍等...'
			}
		});
	
		var productManageWindow=new Ext.Window({
			title : '产品管理',
			closable : true,
			plain : true,
			resizable : false,
			collapsible : false,
			height:400,
			width:800,
			draggable : false,
			closeAction : 'hide',
			modal : true, // 模态窗口 
			border : false,
			autoScroll : true,
			closable : true,
			animateTarget : Ext.getBody(),
			constrain : true,
			layout:'border',
			items:[productLeftTreeForShow,{
				region:'center',
				layout:'border',
				items:[productSearchPanel,{
					region:'center',
					layout:'fit',
					items:[productManageGrid]
				}]				
			}]
		}); 
		productManageWindow.show();
		searchFunction();
		return;
	}
});
Ext.reg('productChoose',Com.yucheng.crm.common.ProductManage);
