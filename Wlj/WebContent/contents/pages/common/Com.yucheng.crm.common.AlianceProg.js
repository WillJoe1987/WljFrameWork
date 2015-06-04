Ext.ns('Com.yucheng.bcrm.common');
/**
 * 联盟商放大镜
 * @author hujun
 * @since 2014-7-22
 * @modify 
 */
Com.yucheng.bcrm.common.AlianceProg = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    
    },
    onRender : function(ct, position){
		Com.yucheng.bcrm.common.AlianceProg.superclass.onRender.call(this, ct, position);
		if(this.hiddenName){
			var ownerForm = this;
			while(ownerForm.ownerCt && !Ext.instanceOf(ownerForm.ownerCt,'form')){				//根据条件查询放大镜控件的最外层容器
				ownerForm = ownerForm.ownerCt;
			};
			if(Ext.instanceOf(ownerForm.ownerCt,'form')){										//判断父容器是否为form类型
				ownerForm = ownerForm.ownerCt;
				if(ownerForm.getForm().findField(this.hiddenName)){								//如果已经创建隐藏域
					this.hiddenField = ownerForm.getForm().findField(this.hiddenName);
				}else {		//如果未创建隐藏域，则根据hiddenName属性创建隐藏域
					
					this.hiddenField = ownerForm.add({
						
						xtype : 'hidden',
						id:this.hiddenName,
						name: this.hiddenName
					});
				}
			}
		}
	},
	autoLoadFlag: false,
    singleSelected:false,//记录标志 true单选,false多选
    callback:false,
    alianceProgId:'', 
    alianceProgRange :'',//服务范围
    startDate:'',//合作开始日期
    endDate:'',//合作结束日期
    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',
    hiddenName:false, //用于存隐藏ID字段
    oCustomerQueryWindow : false,
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
    	var _this=this;
    	if(_this.oCustomerQueryWindow){
    		_this.oCustomerQueryWindow.show();
    		return;
    	}
    	var oThisSearchField=_this;
    	//联盟商等级
    	_this.boxstore9 = new Ext.data.Store({  
    		sortInfo: {
	    	    field: 'key',
	    	    direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
	    	},
    		restful:true,   
    		autoLoad :true,
    		proxy : new Ext.data.HttpProxy({
    				url :basepath+'/lookup.json?name=ALIANCE_PROG_LEVEL'
    		}),
    		reader : new Ext.data.JsonReader({
    			root : 'JSON'
    		}, [ 'key', 'value' ])
    	});
    	_this.boxstore9.load();
    	_this.oCustomerQueryForm = new Ext.form.FormPanel({
			frame : true, //是否渲染表单面板背景色
			labelAlign : 'middle', // 标签对齐方式
			buttonAlign : 'center',
			region:'north',
			height : 110,
			width : 1000,
			items : [{
				layout : 'column',
				border : false,
				items : [{
					columnWidth : .5,
					layout : 'form',
					labelWidth : 80, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
						fieldLabel : '联盟商代码',
						name : 'ALIANCE_PROGRAM_ID',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:right;',
						anchor : '90%'
					},new Ext.form.ComboBox({
						hiddenName : 'ALIANCE_PROG_LEVEL',
						name : 'ALIANCE_PROG_LEVEL',
						fieldLabel : '联盟商等级',
						labelStyle: 'text-align:right;',
						triggerAction : 'all',
						store : _this.boxstore9,
						displayField : 'value',
						valueField : 'key',
						mode : 'local',
						editable:false,
						forceSelection : true,
						typeAhead : true,
						emptyText:'请选择',
						resizable : true,
						anchor : '90%'
					})]
				},{
					columnWidth : .5,
					layout : 'form',
					labelWidth: 100, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
						fieldLabel : '联盟商名称',
						name : 'ALIANCE_PROGRAM_NAME',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:right;',
						anchor : '90%'
					}, new Com.yucheng.bcrm.common.OrgField({
				    	searchType:'SUBTREE',/*指定查询机构范围属性  SUBTREE（子机构树）SUBORGS（直接子机构）PARENT（父机构）PARPATH （所有父、祖机构）ALLORG（所有机构）*/
				    	fieldLabel : '服务范围',
				    	labelStyle : 'text-align:right;',
				    	name : 'SERVICE_RANGE2', 
				    	hiddenName: 'SERVICE_RANGE',   //后台获取的参数名称
				    	anchor : '90%',
				    	checkBox:true //复选标志
				    })]
				}]
			}],
			buttons : [{
				text : '查询',
				handler : function() {
					_this.oCustomerQueryStore.on('beforeload', function() {
						var conditionStr =  _this.oCustomerQueryForm.getForm().getValues(false);
						this.baseParams = {
								"condition":Ext.encode(conditionStr)
						};
					});
					_this.oCustomerQueryStore.reload({
						params : {
							start : 0,
							limit : _this.oCustomerQueryBbar.pageSize
						}
					});
				}
			},{
				text : '重置',
				handler : function() {
					_this.oCustomerQueryForm.getForm().reset();  
					_this.oCustomerQueryForm.getForm().findField('SERVICE_RANGE2').setValue('');
				}
			}]
		});
    	_this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect:oThisSearchField.singleSelected});

    	// 定义自动当前页行号
    	_this.rownum = new Ext.grid.RowNumberer({
    		header : 'No.',
    		width : 28
    	});
	    
    	// 定义列模型
    	_this.cm = new Ext.grid.ColumnModel([_this.rownum,_this.sm, 
    	    {header : '联盟商代码',dataIndex : 'ALIANCE_PROGRAM_ID',sortable : true,width : 150},
    	    {header : '联盟商名称',dataIndex : 'ALIANCE_PROGRAM_NAME',width : 200,sortable : true},
    	    {header : '联盟商等级',dataIndex : 'ALIANCE_PROG_LEVEL_ORA',width : 150,sortable : true},
    	    {header : '服务范围',dataIndex : 'SERVICE_RANGE_NAME',width : 150,sortable : true},
    	    {header : '服务范围',dataIndex : 'SERVICE_RANGE',width : 80,sortable : true,hidden:true},
    	    {header : '合作开始日期',dataIndex : 'START_DATE',width : 150,sortable : true,format:'Y-m-d'},
    	    {header : '合作结束日期',dataIndex : 'END_DATE',width : 150,sortable : true,format:'Y-m-d'}
    	]);
    	/**
    	 * 数据存储
    	 */
    	_this.oCustomerQueryStore = new Ext.data.Store({
    		restful:true,	
    		proxy : new Ext.data.HttpProxy({url:basepath+'/alianceProgramQueryAction.json'}),
    		reader: new Ext.data.JsonReader({
    			totalProperty : 'json.count',
    			root:'json.data'
    		}, [{name: 'ALIANCE_PROGRAM_ID'},
    		    {name: 'ALIANCE_PROGRAM_NAME'},
    		    {name: 'ALIANCE_PROG_LEVEL'},
    		    {name: 'ALIANCE_PROG_LEVEL_ORA'},
    		    {name: 'SERVICE_RANGE_NAME'},
    		    {name: 'SERVICE_RANGE'},
    		    {name: 'START_DATE'},
    		    {name: 'END_DATE'}
    		    ])
    	});

    	_this.oPagesizeCombo = new Ext.form.ComboBox({
    		name : 'pagesize',
    		triggerAction : 'all',
    		mode : 'local',
    		store : new Ext.data.ArrayStore({
    			fields : ['value', 'text'],
    			data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
    			         [ 100, '100条/页' ], [ 250, '250条/页' ],
    			         [ 500, '500条/页' ] ]
    		}),
    		valueField : 'value',
    		displayField : 'text',
    		value : '20',
    		editable : false,
    		width : 85
    	});
    	_this.number = parseInt(_this.oPagesizeCombo.getValue());
    	_this.oPagesizeCombo.on("select", function(comboBox) {
    		_this.oCustomerQueryBbar.pageSize = parseInt(_this.oPagesizeCombo.getValue()),
    		_this.oCustomerQueryStore.load({
    			params : {
    				start : 0,
    				limit : parseInt(_this.oPagesizeCombo.getValue())
    			}
    		});
    	});
    	_this.oCustomerQueryBbar = new Ext.PagingToolbar({
    		pageSize : _this.number,
    		store : _this.oCustomerQueryStore,
    		displayInfo : true,
    		displayMsg : '显示{0}条到{1}条,共{2}条',
    		emptyMsg : "没有符合条件的记录",
    		items : ['-', '&nbsp;&nbsp;', _this.oPagesizeCombo]
    	});
		// 表格实例
    	_this.oCustomerQueryGrid = new Ext.grid.GridPanel({
    		height : 275,
			width:1000,
			region:'center',
			frame : true,
			autoScroll : true,
			store : _this.oCustomerQueryStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : _this.cm, // 列模型
			sm : _this.sm, // 复选框
			bbar:_this.oCustomerQueryBbar,
			viewConfig:{
    			forceFit:false,
    			autoScroll:true
    		},
    		loadMask : {
    			msg : '正在加载表格数据,请稍等...'
    		}
    	});

    	_this.oCustomerQueryWindow=new Ext.Window({
    		title : '联盟商查询',
    		closable : true,
    		resizable : true,
    		height:435,
    		width:1013,
    		draggable : true,
    		closeAction : 'hide',
    		modal : true, // 模态窗口 
    		border : false,
    		closable : true,
    		layout : 'border',
    		listeners : {
    			'show':function(){
					_this.oCustomerQueryForm.form.reset();
					_this.oCustomerQueryStore.removeAll();
					if(_this.autoLoadFlag)
						_this.oCustomerQueryStore.load({//如果自动加载，需要对数据进行分页
							params : {
								start : 0,
								limit : _this.oCustomerQueryBbar.pageSize
							}
						});
    			}    			
    		},
    		items : [_this.oCustomerQueryForm,_this.oCustomerQueryGrid],
    		buttonAlign:'center',
    		buttons:[{
    			text:'确定',
    			handler:function(){
    				var sName='';
    				var checkedNodes;
    				if(!(_this.oCustomerQueryGrid.getSelectionModel().selections==null)){
    					if(oThisSearchField.hiddenField){
    						checkedNodes = _this.oCustomerQueryGrid.getSelectionModel().selections.items;
						if(oThisSearchField.singleSelected&&checkedNodes.length>1){
							Ext.Msg.alert('提示', '您只能选择一个联盟商');
							return ;
						}
						for(var i=0;i<checkedNodes.length;i++){
							if(i==0){
								sName=checkedNodes[i].data.ALIANCE_PROGRAM_NAME;
								oThisSearchField.hiddenField.setValue(checkedNodes[i].data.ALIANCE_PROGRAM_ID);
							}else{
								sName=sName+','+checkedNodes[i].data.ALIANCE_PROGRAM_NAME;
								oThisSearchField.hiddenField.setValue(_this.hiddenField.value+','+checkedNodes[i].data.ALIANCE_PROGRAM_ID);
							}
						}
						oThisSearchField.setRawValue(sName);
						if(checkedNodes.length==1){//如果单选，则设置该客户相应的附属属性
							oThisSearchField.alianceProgId=checkedNodes[0].data.ALIANCE_PROGRAM_ID;
							oThisSearchField.alianceProgRange=checkedNodes[0].data.SERVICE_RANGE;
							oThisSearchField.startDate=checkedNodes[0].data.START_DATE;
							oThisSearchField.endDate=checkedNodes[0].data.END_DATE;
						}
					}
    					/**
    					 * 如果未选择任何客户，清空隐藏域中的客户号 
    					 * by GuoChi
    					 * 2013-12-25
    					 */
    					if(_this.oCustomerQueryGrid.getSelectionModel().selections.length==0){
    						oThisSearchField.hiddenField.setValue("");
    					}	
    					
				}
				if (typeof oThisSearchField.callback == 'function') {
					oThisSearchField.callback(oThisSearchField,checkedNodes);
				}
				_this.oCustomerQueryWindow.hide();
			}
    	},{
    		text: '取消',
    		handler:function(){
				_this.oCustomerQueryWindow.hide();
    		}
    	}]	
    });
	_this.oCustomerQueryWindow.show();
    return;
    }
});
Ext.reg('alianceProgChoose',Com.yucheng.bcrm.common.AlianceProg);