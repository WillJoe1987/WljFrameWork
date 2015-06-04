Ext.ns('Com.yucheng.bcrm.common');
/**
 * 客户选择放大镜
 * @author ZM
 * @since 2012-11-08
 */
Com.yucheng.bcrm.common.CustGroup = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    onRender : function(ct, position){
		Com.yucheng.bcrm.common.CustGroup.superclass.onRender.call(this, ct, position);
		if(this.hiddenName){
			var ownerForm = this;
			while(ownerForm.ownerCt && !Ext.instanceOf(ownerForm.ownerCt,'form')){				//根据条件查询放大镜控件的最外层容器
				ownerForm = ownerForm.ownerCt;
			};
			if(Ext.instanceOf(ownerForm.ownerCt,'form')){										//判断父容器是否为form类型
				ownerForm = ownerForm.ownerCt;
				if(ownerForm.getForm().findField(this.hiddenName)){								//如果已经创建隐藏域
					this.hiddenField = ownerForm.getForm().findField(this.hiddenName);
					this.groupId=ownerForm.ownerCt.groupId;
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
	allowDtGroup:true,//是否可以查询动态客户群
    singleSelected:false,//记录标志 true单选,false多选
    callback:false,
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
    groupId:'',
	listeners:{//增加鼠标点击放大镜输入框触发onTrigger2Click事件
		focus:function(){
			if(!this.disabled){ //禁用的放大镜不允许弹出选择
				this.onTrigger2Click();
			}
		}
	},
    onTrigger2Click : function(){
    	var _this=this;
    	if(_this.oCustomerQueryWindow){
    		_this.oCustomerQueryWindow.show();
    		return;
    	}
    	if(this.disabled){
    		return;
    	}
    	var oThisSearchField=_this;
    	
  	//客户群分类
	 _this.customergroupTypeStore = new Ext.data.Store({
		restful : true,
		sortInfo : {field : 'key',direction : 'ASC'},
		autoLoad : true,
		proxy : new Ext.data.HttpProxy({
			url : basepath + '/lookup.json?name=CUSTOMER_GROUP_TYPE'
		}),
		reader : new Ext.data.JsonReader({
			root : 'JSON'
		}, [ 'key', 'value' ])
	});
     //客户来源
     _this.customerSourceTypeStore = new Ext.data.Store({
		restful : true,
		sortInfo : {field : 'key',direction : 'ASC'},
		autoLoad : true,
		proxy : new Ext.data.HttpProxy({
			url : basepath + '/lookup.json?name=CUSTOMER_SOURCE_TYPE'
		}),
		reader : new Ext.data.JsonReader({
			root : 'JSON'
		}, [ 'key', 'value' ])
	});
     //群成员类型
     _this.groupMemeberTypeStore = new Ext.data.Store({
		restful : true,
		sortInfo : {field : 'key',direction : 'ASC'},
		autoLoad : true,
		proxy : new Ext.data.HttpProxy({
			url : basepath + '/lookup.json?name=GROUP_MEMEBER_TYPE'
		}),
		reader : new Ext.data.JsonReader({
			root : 'JSON'
		}, [ 'key', 'value' ])
	});
    //客户群共享范围
	_this.shareFlagStore = new Ext.data.Store({
		restful : true,
		sortInfo : {field : 'key',direction : 'ASC'},
		autoLoad : true,
		proxy : new Ext.data.HttpProxy({
			url : basepath + '/lookup.json?name=SHARE_FLAG'
		}),
		reader : new Ext.data.JsonReader({
			root : 'JSON'
		}, [ 'key', 'value' ])
	});
    	_this.oCustomerQueryForm = new Ext.form.FormPanel({
			frame : true, //是否渲染表单面板背景色
			labelAlign : 'middle', // 标签对齐方式
			buttonAlign : 'center',
			region:'north',
			width : 1000,
			items : [{
				layout : 'column',
				border : false,
				items : [{
					columnWidth : .33,
					layout : 'form',
					labelWidth : 60, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
						fieldLabel : '客户群编号',
						name : 'CUST_BASE_NUMBER',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:right;',
						anchor : '90%'
					}]
				},{
					columnWidth : .33,
					layout : 'form',
					labelWidth: 60, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
						fieldLabel : '客户群名称',
						name : 'CUST_BASE_NAME',
						xtype : 'textfield', // 设置为数字输入框类型
						labelStyle: 'text-align:right;',
						anchor : '90%'
					}]
				},{
					columnWidth : .33,
					layout : 'form',
					labelWidth: 60, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
							store : _this.customergroupTypeStore,
							xtype : 'combo', 
							labelStyle: 'text-align:right;',
							resizable : true,
							fieldLabel : '客户群分类',
							name : 'GROUP_TYPE',
							hiddenName : 'GROUP_TYPE',
							valueField : 'key',
							displayField : 'value',
							mode : 'local',
							editable :false,
							typeAhead : true,
							forceSelection : true,
							triggerAction : 'all',
							emptyText : '请选择',
	                        selectOnFocus : true,
	                        hidden : true,
							anchor : '90%'
							}]
				},{
					columnWidth : .33,
					layout : 'form',
					labelWidth: 60, // 标签宽度
					defaultType : 'textfield',
					border : false,
					items : [{
							store : _this.groupMemeberTypeStore,
							xtype : 'combo', 
							labelStyle: 'text-align:right;',
							resizable : true,
							fieldLabel : '群成员类型',
							name : 'GROUP_MEMBER_TYPE',
							hiddenName : 'GROUP_MEMBER_TYPE',
							valueField : 'key',
							displayField : 'value',
							mode : 'local',
							editable :false,
							typeAhead : true,
							forceSelection : true,
							triggerAction : 'all',
							emptyText : '请选择',
	                        selectOnFocus : true,
							anchor : '90%'
							}]
				}]
			}],
			buttons : [{
				text : '查询',
				handler : function() {
					_this.oCustomerQueryStore.on('beforeload', function() {
						var conditionStr =  _this.oCustomerQueryForm.getForm().getValues(false);
						this.baseParams = {
								allowDtGroup:_this.allowDtGroup,
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
				}
			}]
		});
		
		_this.oCustomerQueryForm.getForm().findField("CUST_BASE_NUMBER").setValue(_this.groupId);

    _this.oCustomerInfoForm = new Ext.form.FormPanel({
            frame : true,
            title : '基本信息',
            buttonAlign : "center",
            id:'info1',
            region : 'center',
            layout:'column',
            autoScroll : true,
            labelWidth : 140,
            items : [ {
                layout : 'column',
                items : [ {
                    columnWidth : .50,
                    layout : 'form',
                    items : [ {
                        xtype : 'textfield',
                        labelStyle : 'text-align:right;',
                        width : 134,
                        fieldLabel : '<span style="color:red">*</span>客户群名称',
                        allowBlank : false,
                        name : 'custBaseName',
                        anchor : '99%'
                    },{
						store : _this.customerSourceTypeStore,
						xtype : 'combo', 
						resizable : true,
						fieldLabel : '<span style="color:red">*</span>客户来源',
						hiddenName : 'custFrom',
						name : 'custFrom',
						valueField : 'key',
						labelStyle : 'text-align:right;',
						displayField : 'value',
						mode : 'local',
						allowBlank : false,
						width : 100,
						forceSelection : true,
						triggerAction : 'all',
						emptyText : '请选择',
						anchor : '99%'
					},{
						store : _this.groupMemeberTypeStore,
						xtype : 'combo', 
						resizable : true,
						fieldLabel : '<span style="color:red">*</span>群成员类型',
						hiddenName : 'groupMemberType',
						name : 'groupMemberType',
						valueField : 'key',
						labelStyle : 'text-align:right;',
						displayField : 'value',
						allowBlank : false,
						mode : 'local',
						width : 100,
						editable :false,
						forceSelection : true,
						triggerAction : 'all',
						emptyText : '请选择',
						anchor : '99%'
					}]
                },{
                    columnWidth : .50,
                    layout : 'form',
                    items : [ {
						store : _this.customergroupTypeStore,
						xtype : 'combo', 
						resizable : true,
						fieldLabel : '<span style="color:red">*</span>客户群分类',
						hiddenName : 'groupType',
						name : 'groupType',
						valueField : 'key',
						allowBlank : false,
						labelStyle : 'text-align:right;',
						displayField : 'value',
						mode : 'local',
						width : 134,
						editable :false,
						forceSelection : true,
						triggerAction : 'all',
						emptyText : '请选择',
						anchor : '99%'
					},{
                        xtype : 'datefield',
                        fieldLabel : '创建时间',
                        format : 'Y-m-d',
                        readOnly:true,
                        labelStyle : 'text-align:right;',
                        name : 'custBaseCreateDate',
                        anchor : '99%'
                    } , {
						store : _this.shareFlagStore,
						xtype : 'combo', 
						resizable : true,
						fieldLabel : '<span style="color:red">*</span>共享范围',
						hiddenName : 'shareFlag',
						name : 'shareFlag',
						valueField : 'key',
						labelStyle : 'text-align:right;',
						displayField : 'value',
						allowBlank : false,
						mode : 'local',
						width : 100,
						editable :false,
						forceSelection : true,
						triggerAction : 'all',
						emptyText : '请选择',
						anchor : '99%'
					},{
                        xtype : 'textfield',
                        labelStyle : 'text-align:right;',
                        width : 100,
                        hidden:true,
                        fieldLabel : 'ID',
                        name : 'id',
                        anchor : '99%'
                    },{
                        xtype : 'textfield',
                        labelStyle : 'text-align:right;',
                        width : 100,
                        hidden:true,
                        fieldLabel : '群编号',
                        name : 'custBaseNumber',
                        anchor : '99%'
                    },{
                        xtype : 'textfield',
                        fieldLabel : '创建人',
                        hidden:true,
                        name : 'custBaseCreateName',
                        anchor : '99%'
                    },{
                        xtype : 'textfield',
                        fieldLabel : '创建机构',
                        hidden:true,
                        name : 'custBaseCreateOrg',
                        anchor : '99%'
                    }  ]
                },{
                    columnWidth : 1,
                    layout : 'form',
                    items : [ {
                        xtype : 'textarea',
                        labelStyle : 'text-align:right;',
                        fieldLabel : '客户群描述',
                        name : 'custBaseDesc',
                        anchor : '99%'
                    } ]
                } ]
            }],
            buttons:[
            {
    			text : '保存',
    			handler : function() {
    			if (! _this.oCustomerInfoForm.getForm().isValid()) {
                    Ext.MessageBox.alert('提示','输入有误,请检查输入项');
                    return false;
                };
    				Ext.Msg.wait('正在保存，请稍后......','系统提示');
    			Ext.Ajax.request({
    				url : basepath + '/customergroupinfo.json',
    				params : {
    				operate:'add'
    				},
    				method : 'POST',
    				form : _this.oCustomerInfoForm.getForm().id,
    				waitMsg : '正在保存数据,请等待...', // 显示读盘的动画效果，执行完成后效果消失
    				success : function() {
    					Ext.Msg.alert('提示', '操作成功');
    					_this.oCustomerInfoWindow.hide();
    					_this.oCustomerQueryStore.reload({
			    			params : {
			    				start : 0,
			    				limit : parseInt(_this.oPagesizeCombo.getValue())
			    				}
			    		});
    				},
    				failure : function(response) {
    					var resultArray = Ext.util.JSON.decode(response.status);
    				       if(resultArray == 403) {
    				           Ext.Msg.alert('系统提示', response.responseText);
    				  } else{
    					Ext.Msg.alert('提示', '操作失败,失败原因:' + response.responseText);
    				}}
    			});
    		}}]
        });	
		     // 修改窗口展示的from
     _this.oCustomerInfoPanel = new Ext.Panel( {
        labelWidth : 140,
        height : 300,
        layout : 'fit',
        autoScroll : true,
        buttonAlign : "center",
        items : [ _this.oCustomerInfoForm ]
    });
		//新建客户群
    _this.oCustomerInfoWindow = new Ext.Window({
    	layout : 'fit',
        draggable : true,
        closable : true,
        closeAction : 'close',
        modal : true,
        width : 1000,
        height : 350,
        loadMask : true,
        border : false,
        items : [ {
            buttonAlign : "center",
            layout : 'fit',
            items : [_this.oCustomerInfoPanel]
        }
        ]
    });
		
		//客户群列模型 start *******************************
    	_this.sm = new Ext.grid.CheckboxSelectionModel({singleSelect:oThisSearchField.singleSelected});

    	// 定义自动当前页行号
    	_this.rownum = new Ext.grid.RowNumberer({
    		header : 'No.',
    		width : 28
    	});
    	// 定义列模型
    	_this.cm = new Ext.grid.ColumnModel([_this.rownum,_this.sm, 
    		{header : '客户群ID',dataIndex : 'ID',sortable : true,width : 100,hidden:true,hideable:false},
    	    {header : '客户群编号',dataIndex : 'CUST_BASE_NUMBER',sortable : true,hidden:true,width : 100},
    	    {header : '客户群名称',dataIndex : 'CUST_BASE_NAME',width : 150,sortable : true},
    	    {header : '客户群分类',dataIndex : 'GROUP_TYPE_ORA',sortable : true,width : 100}, 
            {header : '客户来源',dataIndex : 'CUST_FROM_ORA',sortable : true,width : 100},
            {header : '群成员类型',dataIndex : 'GROUP_MEMBER_TYPE_ORA',sortable : true,width : 100},
    	    {header : '客户群描述',dataIndex : 'CUST_BASE_DESC',width : 150,sortable : true},
    	    {header : '创建时间',dataIndex : 'CUST_BASE_CREATE_DATE',width : 80,sortable : true},
    	    {header : '创建人',dataIndex : 'USER_NAME',width : 80,sortable : true},
    	    {header : '创建机构',dataIndex : 'CUST_BASE_CREATE_ORG',width : 80,sortable : true,hidden:true,hidden:true}
    	]);
    	//客户群列模型end ******************************************
    	
    	//群成员列模型 start &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    	    _this.oBaseMemberSm = new Ext.grid.CheckboxSelectionModel();

    	// 定义自动当前页行号
    	_this.oBaseMemberRownum = new Ext.grid.RowNumberer({
    		header : 'No.',
    		width : 28
    	});
    	// 定义列模型
    	_this.oBaseMemberCm = new Ext.grid.ColumnModel([_this.oBaseMemberRownum,_this.oBaseMemberSm, 
    		{header : 'ID',dataIndex : 'ID',sortable : true,width : 100,hidden:true,hideable:false},
    	    {header : '客户编号',dataIndex : 'CUST_ID',sortable : true,width : 100},
    	    {header : '客户名称',dataIndex : 'CUST_ZH_NAME',width : 200,sortable : true}
    	]);
    	//群成员列模型 end &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    	
    	
	_this.oCustomertbar = new Ext.Toolbar({

				items : [{
					text : '创建客户群',
					iconCls :'addIconCss',
					handler : function() {
						_this.oCustomerInfoForm.form.reset();
						_this.oCustomerInfoWindow.show();
					}
				}
				]
			});
			//客户群查询store
    	_this.oCustomerQueryStore = new Ext.data.Store({
    		restful:true,	
    		proxy : new Ext.data.HttpProxy({url:basepath+'/querycustomerbaseinfo.json'}),
    		reader: new Ext.data.JsonReader({
    			totalProperty : 'json.count',
    			root:'json.data'
    		}, [
    			{name: 'ID'},
    		    {name: 'CUST_BASE_NUMBER'},
    		    {name: 'CUST_BASE_NAME'},
    		    {name: 'CUST_BASE_CREATE_DATE'},
    		    {name: 'CUST_BASE_DESC'},
    		    {name: 'USER_NAME'},
    		    {name: 'CUST_FROM'},
    		    {name: 'GROUP_TYPE'},
    		    {name: 'GROUP_MEMBER_TYPE'},
    		    {name: 'CUST_BASE_CREATE_ORG'},
    		    {name: 'CUST_FROM_ORA'},
    		    {name: 'GROUP_TYPE_ORA'},
    		    {name: 'GROUP_MEMBER_TYPE_ORA'}
    		    ])
    	});
    	
    	//群成员查询store
    	_this.oBaseMemberStore = new Ext.data.Store({
    		restful:true,	
    		proxy : new Ext.data.HttpProxy({url:basepath+'/groupmemberedit.json'}),
    		reader: new Ext.data.JsonReader({
    			totalProperty : 'json.count',
    			root:'json.data'
    		}, [
    			{name: 'ID'},
    		    {name: 'CUST_ID'},
    		    {name: 'CUST_ZH_NAME'},
    		    {name: 'CUST_TYP'}
    		    ])
    	});
		//客户群分页栏 start&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
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
    	//客户群分页栏end &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    	
    	//群成员分页栏 start*******************************************************************
    	
    	_this.oBaseMembersizeCombo = new Ext.form.ComboBox({
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
    	_this.oBaseMembernumber = parseInt(_this.oBaseMembersizeCombo.getValue());
    	_this.oBaseMembersizeCombo.on("select", function(comboBox) {
    		_this.oBaseMemberBbar.pageSize = parseInt(_this.oBaseMembersizeCombo.getValue()),
    		_this.oBaseMemberStore.load({
    			params : {
    				start : 0,
    				limit : parseInt(_this.oBaseMembersizeCombo.getValue())
    			}
    		});
    	});
    	_this.oBaseMemberBbar = new Ext.PagingToolbar({
    		pageSize : _this.oBaseMembernumber,
    		store : _this.oBaseMemberStore,
    		displayInfo : true,
    		displayMsg : '显示{0}条到{1}条,共{2}条',
    		emptyMsg : "没有符合条件的记录",
    		items : ['-', '&nbsp;&nbsp;', _this.oBaseMembersizeCombo]
    	});
    	//群成员分页栏 end*******************************************************************
    	
    	// 群成员表格实例
    	_this.oBaseMemberGrid = new Ext.grid.GridPanel({
    		title : '客户群成员列表',
    		height : 265,
			width:1000,
			region:'center',
			frame : true,
			autoScroll : true,
			store : _this.oBaseMemberStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : _this.oBaseMemberCm, // 列模型
			sm : _this.oBaseMemberSm, // 复选框
//			tbar:_this.oCustomertbar,
			bbar:_this.oBaseMemberBbar,
			viewConfig:{
    			forceFit:false,
    			autoScroll:true
    		},
    		loadMask : {
    			msg : '正在加载表格数据,请稍等...'
    		}
    	});
    	
		// 客户群表格实例
    	_this.oCustomerQueryGrid = new Ext.grid.GridPanel({
    		title : '客户群列表',
    		height : 275,
			width:1000,
			region:'center',
			frame : true,
			autoScroll : true,
			store : _this.oCustomerQueryStore, // 数据存储
			stripeRows : true, // 斑马线
			cm : _this.cm, // 列模型
			sm : _this.sm, // 复选框
//			tbar:_this.oCustomertbar,
			bbar:_this.oCustomerQueryBbar,
			viewConfig:{
    			forceFit:false,
    			autoScroll:true
    		},
    		loadMask : {
    			msg : '正在加载表格数据,请稍等...'
    		},
    		listeners:{
    		click:function(){
    			if(_this.oCustomerQueryGrid.getSelectionModel().selections.items.length>0){
    			 _this.oBaseMemberStore.on('beforeload', function() {
				this.baseParams = {
				querySign:'queryGroupMember',
				groupId: _this.oCustomerQueryGrid.getSelectionModel().selections.items[0].data.ID
				  };
			    });
			     _this.oBaseMemberStore.on('beforeload', function() {
				this.baseParams = {
				querySign:'queryGroupMember',
				groupId: _this.oCustomerQueryGrid.getSelectionModel().selections.items[0].data.ID
				  };
			    });
			    _this.oBaseMemberStore.on('load',function(){
			    _this.oBaseMemberSm.selectAll();   
			    });
			 _this.oBaseMemberStore.load({
				params : {
				start : 0,
				limit : parseInt(_this.oBaseMembersizeCombo.getValue())
				}
				});
    			} 
    			}

    		}
    	});

    	
    	//客户群维护窗口展示的from
    _this.oCustomerQueryPanel = new Ext.Panel( {
        layout : 'fit',
        autoScroll : true,
        buttonAlign : "center",
        items : [{
				 layout : 'column',
				 border : false,
				 items : [{
		        	 columnWidth : .55,
		        	 layout : 'form',
		        	 border : false,
		        	 items : [{
			             region : 'north',
			             height : 90,
			             layout : 'fit',
			             items : [ _this.oCustomerQueryForm ]
			         		},{
			             region : 'center',
			             layout : 'fit',
			             height : 300,
			             items : [  _this.oCustomerQueryGrid]
			             	}]
				         	},{
			        	 columnWidth : .45,
			        	 layout : 'form',
			        	 border : false,
			        	 items : [{
			             region : 'center',
			             layout : 'fit',
			             height : 380,
			             items : [ _this.oBaseMemberGrid ]
			             	}]
					         }
				         ]
					}]
    });
    	
    	_this.oCustomerQueryWindow=new Ext.Window({
    		title : '客户群查询',
    		closable : true,
    		resizable : true,
    		height:455,
    		width:1013,
    		draggable : true,
    		closeAction : 'hide',
    		modal : true, // 模态窗口 
    		border : false,
    		closable : true,
            layout : 'fit',
            items : [_this.oCustomerQueryPanel],
            listeners : {
    			'show':function(){
					_this.oCustomerQueryForm.form.reset();
					_this.oCustomerQueryStore.removeAll();
					if(_this.autoLoadFlag)
						_this.oCustomerQueryStore.load();
    			}    			
    		},
//    		items : [_this.oCustomerQueryForm,_this.oCustomerQueryGrid,_this.oBaseMemberGrid],
    		buttonAlign:'center',
    		buttons:[{
    			text:'确定',
    			handler:function(){
    				var sName='';
    				var checkedNodes;
    				var groupMemberNodoes;
    				var __custIdStr='';
    				var __custZhNameStr='';
    				if(!(_this.oCustomerQueryGrid.getSelectionModel().selections==null)){
    					if(oThisSearchField.hiddenField){
    						checkedNodes = _this.oCustomerQueryGrid.getSelectionModel().selections.items;
						if(oThisSearchField.singleSelected&&checkedNodes.length>1){
							Ext.Msg.alert('提示', '您只能选择一个客户群');
							return ;
						}else if(oThisSearchField.singleSelected&&checkedNodes.length<1){
							Ext.Msg.alert('提示', '您没有选择任何客户群');
							return ;
						}
						//start 获取到所选客户群对应的群成员
						groupMemberNodoes=_this.oBaseMemberGrid.getSelectionModel().selections.items;
						if(groupMemberNodoes.length<1){//判定若没有选择客户群成员，默认把成员全部加入
						for(var i=0;i<_this.oBaseMemberStore.getCount();i++){
							__custIdStr+=_this.oBaseMemberStore.data.items[i].data.CUST_ID;
							__custZhNameStr+=_this.oBaseMemberStore.data.items[i].data.CUST_ZH_NAME;
							if(i+1<_this.oBaseMemberStore.getCount()){
								__custIdStr+=',';
								__custZhNameStr+=',';
							}
						}	
						}else{//判定若选择了客户群成员，则把所选成员加入
							for(var j=0;j<groupMemberNodoes.length;j++){
							__custIdStr+=groupMemberNodoes[j].data.CUST_ID;
							__custZhNameStr+=groupMemberNodoes[j].data.CUST_ZH_NAME;
							if(j+1<groupMemberNodoes.length){
							__custIdStr+=',';
							__custZhNameStr+=',';
							}
							}
						}
						//end
						
						for(var i=0;i<checkedNodes.length;i++){
							if(i==0){
								sName=checkedNodes[i].data.CUST_BASE_NAME;
								oThisSearchField.hiddenField.setValue(checkedNodes[i].data.CUST_BASE_NUMBER);
							}else{
								sName=sName+','+checkedNodes[i].data.CUST_BASE_NAME;
								oThisSearchField.hiddenField.setValue(_this.hiddenField.value+','+checkedNodes[i].data.CUST_BASE_NUMBER);
							}
						}
						oThisSearchField.setRawValue(sName);
						if(checkedNodes.length==1){//如果单选，则设置该客户相应的附属属性
							oThisSearchField.custBaseId=checkedNodes[0].data.ID;//客户群ID
							oThisSearchField.custBaseNumber=checkedNodes[0].data.CUST_BASE_NUMBER;//客户群编号
							oThisSearchField.custBaseName=checkedNodes[0].data.CUST_BASE_NAME;//客户群名称
							oThisSearchField.custStr=__custIdStr;//客户群成员编号
							oThisSearchField.custStr1=__custZhNameStr;//客户群成员名称
						}
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
	_this.oCustomerQueryStore.on('beforeload', function() {
						var conditionStr =  _this.oCustomerQueryForm.getForm().getValues(false);
						this.baseParams = {
								allowDtGroup:_this.allowDtGroup,
								"condition":Ext.encode(conditionStr)
						};
					});
					_this.oCustomerQueryStore.reload({
						params : {
							start : 0,
							limit : _this.oCustomerQueryBbar.pageSize
						}
					});
    return;
    }
});
Ext.reg('custgroupquery',Com.yucheng.bcrm.common.CustGroup);