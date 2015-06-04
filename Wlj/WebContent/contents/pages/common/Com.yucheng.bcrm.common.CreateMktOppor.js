Ext.ns('Com.yucheng.bcrm.common');
/**
 * 创建商机组件
 * @author geyu
 * @since 2014-7-20
 */
Com.yucheng.bcrm.common.CreateMktOppor = Ext.extend(Ext.Window,{
	type:'',//1gefi,2geifi
	title:'创建商机',
	plain : true,
	layout : 'fit',
	width : 750,
	height : 520,
	resizable : true,
	draggable : true,
	closable : true,
	closeAction : 'hide',
	modal : true, // 模态窗口
	loadMask : true,
	maximizable : true,
	collapsible : true,
	titleCollapse : true,
	buttonAlign : 'right',
	border : false,
	constrain : true,
	groupId:false,
	groupName:'',
	isgroup:false,
	iscust:false,
	custId:'',
	custName:'', 
	custType:'',
	custStat:'',
	prodId:'',
	prodName:'',
	mgrId:'',
	mgrName:'',
	orgId:'',
	orgName:'',
	linkMan:'',
	initComponent : function(){
		var _this = this;
        Com.yucheng.bcrm.common.CreateMktOppor.superclass.initComponent.call(this);
//        _this.custSelectPartAdd = new Com.yucheng.bcrm.common.CustomerQueryField({
//        	fieldLabel : '*客户名称',
//        	labelWidth : 100,
//        	name : 'custName',
//        	custtype : '',// 客户类型:1:对私,2:对公,不设默认全部
//        	custStat : '',// 客户状态:1:正式,2:潜在,不设默认全部
//        	singleSelected : true,// 单选复选标志
//        	editable : false,
//        	allowBlank : false,
//        	blankText : '此项为必填项，请检查！',
//        	anchor : '90%',
//        	hiddenName : 'custId',
//        	callback : function() {// 回调方法，给其它字段设置相关属性值
//        		
//        	}
//        });
     // "客户状态"下拉框
        _this.chanceTypeStore = new Ext.data.Store({
        	restful : true,
        	autoLoad : true,
        	proxy : new Ext.data.HttpProxy({
//        		url : basepath + '/lookup.json?name=CUSTOMER_STATUS'
        		url : basepath + '/lookup.json?name=XD000084'
        	}),
        	reader : new Ext.data.JsonReader({
        		root : 'JSON'
        	}, [ 'key', 'value' ]),
        	listeners :{
    			load :function(){
					//设置默认客户类型
    				var custStatField = _this.opporPanel.getForm().findField('custType');
    				if(custStatField){
	    				if(!Ext.isEmpty(_this.custStat)){
	    					custStatField.setValue(_this.custStat);
	    					custStatField.setReadOnly(true);
						}else {
							custStatField.setReadOnly(false);
						}
    				}
    			}
    		}
        	
        });
     //"商机来源"下拉框
        _this.opporSourceStore = new Ext.data.Store({
        	restful : true,
        	autoLoad : true,
        	proxy : new Ext.data.HttpProxy({
        		url : basepath + '/lookup.json?name=BUSI_CHANCE_SOURCE'
        	}),
        	reader : new Ext.data.JsonReader({
        		root : 'JSON'
        	}, [ 'key', 'value' ]),
        	listeners :{
    			load :function(){
					//设置默认客户类型
    				var opporSourceField = _this.opporPanel.getForm().findField('opporSource');
    				if(opporSourceField){
    					opporSourceField.setValue(_this.opporPanel.getForm().findField('opporSource').getValue());
    					//opporSourceField.setReadOnly(true);
    				}
    			}
    		}
        });
     // "商机类型"下拉框
        _this.chanceStatStore = new Ext.data.Store({
        	restful : true,
        	autoLoad : true,
        	proxy : new Ext.data.HttpProxy({
        		url : basepath + '/lookup.json?name=BUSI_CHANCE_TYPE'
        	}),
        	reader : new Ext.data.JsonReader({
        		root : 'JSON'
        	}, [ 'key', 'value' ])
        });
        
     // "客户类别"下拉框
        _this.chanceCategoryStore = new Ext.data.Store({
        	restful : true,
        	autoLoad : true,
        	proxy : new Ext.data.HttpProxy({
        		url : basepath + '/lookup.json?name=XD000080'
        	}),
        	reader : new Ext.data.JsonReader({
        		root : 'JSON'
        	}, [ 'key', 'value' ]),
        	listeners :{
    			load :function(){
					//设置默认客户类型
    				var custTypField = _this.opporPanel.getForm().findField('custCategory');
    				if(custTypField){
	    				if(!Ext.isEmpty(_this.custType)){
							custTypField.setValue(_this.custType);
							custTypField.setReadOnly(true);
						}else {
							custTypField.setReadOnly(false);
						}
    				}
    			}
    		}
        });
        /**
         * 
         * '商机客户来源下拉框'
         */
        _this.custSourceStore = new Ext.data.ArrayStore({
    		fields : [ 'key', 'value'  ],
    		data : [ [ '1', '客户' ], [ '2', '客户群' ] ]
    	});
        var ifgroup;
        var custStr = "";

        
        
        _this.opporPanel = new Ext.form.FormPanel({
        	labelWidth : 100,
        	height : 250,
        	frame : true,
        	autoScroll : true,
        	labelAlign : 'right',
        	buttonAlign : "center",
        	items : [ {
        		layout : 'column',
        		items : [ {
        			columnWidth : .5,
        			layout : 'form',
        			items : [ {
        				xtype : 'textfield',
        				fieldLabel : ' <span style="color:red">*</span>商机名称',
        				allowBlank : false,
        				blankText : '此项为必填项，请检查！',
        				name : 'opporName',
        				anchor : '90%'
        			},new Ext.form.ComboBox({
        				hiddenName : 'custSource',
        				name:'custSource',
        				fieldLabel : ' <span style="color:red">*</span>商机客户来源',
        				labelStyle : 'text-align:right;',
        				triggerAction : 'all',
        				store : _this.custSourceStore,
        				displayField : 'value',
        				valueField : 'key',
        				mode : 'local',
        				forceSelection : true,
        				emptyText : '请选择 ',
        				resizable : true,
        				anchor : '90%',
        				listeners:{
        					'select':function(){
        						if(this.value=='1'){
        							_this.opporPanel.getForm().findField('custName').setVisible(true);
        							_this.opporPanel.getForm().findField('executeUserName').setVisible(true);
        							_this.opporPanel.getForm().findField('executeOrgName').setVisible(true);
        							_this.opporPanel.getForm().findField('custType').setVisible(true);
        							_this.opporPanel.getForm().findField('custCategory').setVisible(true);
        							_this.opporPanel.getForm().findField('custContactName').setVisible(true);
        							_this.opporPanel.getForm().findField('custGroup').setVisible(false);
        							_this.opporPanel.buttons[1].show();
        							ifgroup=false;
        						}else if(this.value=='2'){
        							_this.opporPanel.getForm().findField('custName').setVisible(false);
        							_this.opporPanel.getForm().findField('executeUserName').setVisible(false);
        							_this.opporPanel.getForm().findField('executeOrgName').setVisible(false);
        							_this.opporPanel.getForm().findField('custType').setVisible(false);
        							_this.opporPanel.getForm().findField('custCategory').setVisible(false);
        							_this.opporPanel.getForm().findField('custContactName').setVisible(false);
        							_this.opporPanel.getForm().findField('custGroup').setVisible(true);
        							_this.opporPanel.buttons[1].hide();
        							ifgroup=true;
        						}
        					}
        				}
        			}), new Com.yucheng.crm.common.ProductManage({
        				xtype : 'productChoose',
        				fieldLabel : ' <span style="color:red">*</span>商机产品',
        				labelStyle : 'text-align:right;',
        				name : 'prodName',
        				hiddenName : 'prodId',
        				singleSelect : false,
        				allowBlank : false,
        				blankText : '此项为必填项，请检查！',
        				anchor : '90%'
        			}), {
        				xtype : 'datefield',
        				fieldLabel : ' <span style="color:red">*</span>商机开始日期',
        				format : 'Y-m-d',
        				editable : true,
        				name : 'opporStartDate',
        				allowBlank : false,
        				blankText : '此项为必填项，请检查！',
        				anchor : '90%'
        			}, new Com.yucheng.bcrm.common.MktActivityCommonQuery({
        				xtype : 'activityQuery',
        				fieldLabel : '营销活动名称',
        				labelStyle : 'text-align:right;',
        				name : 'mktActivName',
        				hiddenName : 'mktActivId',
        				singleSelect : false,
        				anchor : '90%'
        			}),
        			//{name: 'custName',fieldLabel:'客户名称',width:233,hiddenName: 'custId',xtype: 'customerquery',custtype: '1',singleSelected: true,editable: false,allowBlank: false}
        			
        			new Com.yucheng.bcrm.common.CustomerQueryField({
        				fieldLabel : ' <span style="color:red">*</span>客户名称',
        				labelStyle : 'text-align:right;',
        				name : 'custName',
        				hiddenName : 'custId',
        				singleSelected : true,
        				allowBlank : false,
        				anchor : '90%',
        				callback : function(a,b) {
        					_this.opporPanel.getForm().findField('custCategory').setValue(b[0].data.CUST_TYPE);
        					_this.opporPanel.getForm().findField('custType').setValue(b[0].data.POTENTIAL_FLAG);
        					_this.opporPanel.getForm().findField('custContactName').setValue(b[0].data.LINKMAN_NAME);
        					_this.opporPanel.getForm().findField('executeOrgName').setValue(b[0].data.ORG_NAME);
        					_this.opporPanel.getForm().findField('executeOrgId').setValue(b[0].data.ORG_ID);
        					_this.opporPanel.getForm().findField('executeUserName').setValue(b[0].data.MGR_NAME);
        					_this.opporPanel.getForm().findField('executeUserId').setValue(b[0].data.MGR_ID);
        					var vm= b[0].data.MGR_ID.substring(0,2);
        					if(vm!='VM'){//如果客户有正式客户经理，则商机执行人默认为正式客户经理，商机执行机构为客户归属机构，且不能更改
        						_this.opporPanel.getForm().findField('executeUserName').setDisabled(true);
        						_this.opporPanel.getForm().findField('executeOrgName').setDisabled(true);
       					  	};
       					  	if(vm=='VM'){//如果客户挂在虚拟客户经理名下，则商机执行机构，商机执行人可选择
       					  		_this.opporPanel.getForm().findField('executeUserName').setDisabled(false);
       					  		_this.opporPanel.getForm().findField('executeOrgName').setDisabled(false);
       					  	};	
        				}
        			}),
        			 new Com.yucheng.bcrm.common.CustGroup({
         				xtype : 'custgroupquery',
         				fieldLabel : ' <span style="color:red">*</span>客户群',
         				labelStyle : 'text-align:right;',
         				hidden:true,
         				name : 'custGroup',
         				hiddenName : 'custGroup',
         				singleSelect : false,
         				anchor : '90%',
         				callback:function(a,b){
         					 custStr=a.custStr;
         				}
         			}),
        			new Ext.form.ComboBox({
        				hiddenName : 'custType',
        				name:'custType',
        				fieldLabel : ' <span style="color:red">*</span>客户状态',
        				labelStyle : 'text-align:right;',
        				triggerAction : 'all',
        				store : _this.chanceTypeStore,
        				displayField : 'value',
        				valueField : 'key',
        				mode : 'local',
        				emptyText : '请选择 ',
        				resizable : true,
        				readonly : true,
        				anchor : '90%'
        			}),new Com.yucheng.crm.common.OrgUserManage({
        				xtype : 'userchoose',
        				fieldLabel : ' <span style="color:red">*</span>商机执行人',
        				name : 'executeUserName',
        				hiddenName:'executeUserId',
        				readonly : true,
        				anchor : '90%'
        			}), {
        				xtype : 'numberfield',
        				fieldLabel : '预计金额(元)',
        				name : 'planAmount',
        				labelStyle : 'text-align:right;',
        				value : '0',
        				anchor : '90%'
        			} ]
        		}, {
        			columnWidth : .5,
        			layout : 'form',
        			items : [new Ext.form.ComboBox({
        				hiddenName : 'opporSource',
        				fieldLabel : ' <span style="color:red">*</span>商机来源',
        				labelStyle : 'text-align:right;',
        				triggerAction : 'all',
        				store : _this.opporSourceStore,
        				displayField : 'value',
        				valueField : 'key',
        				mode : 'local',
        				forceSelection : true,
        				emptyText : '请选择 ',
        				resizable : true,
        				anchor : '90%'
        			}), new Ext.form.ComboBox({
        				hiddenName : 'opporType',
        				fieldLabel : ' <span style="color:red">*</span>商机类型',
        				labelStyle : 'text-align:right;',
        				triggerAction : 'all',
        				store : _this.chanceStatStore,
        				displayField : 'value',
        				valueField : 'key',
        				mode : 'local',
        				forceSelection : true,
        				emptyText : '请选择 ',
        				resizable : true,
        				anchor : '90%'
        			}), {
        				xtype : 'datefield',
        				fieldLabel : ' <span style="color:red">*</span>商机有效期',
        				format : 'Y-m-d',
        				editable : true,
        				name : 'opporDueDate',
        				allowBlank : false,
        				blankText : '此项为必填项，请检查！',
        				anchor : '90%'
        			}, {
        				xtype : 'datefield',
        				fieldLabel : ' <span style="color:red">*</span>商机完成日期',
        				format : 'Y-m-d',
        				editable : true,
        				name : 'opporEndDate',
        				allowBlank : false,
        				blankText : '此项为必填项，请检查！',
        				anchor : '90%'
        			},new Com.yucheng.bcrm.common.MktTaskTarget({
        				xtype:'mktTaskTarget',
        				fieldLabel : '营销任务指标名称',
        				labelStyle : 'text-align:right;',
        				name : 'mktActivName',
        				hiddenName : 'mktTargetId',
        				singleSelect : false,
        				anchor : '90%'
        			}),
        			new Ext.form.ComboBox({
        				hiddenName : 'custCategory',
        				name:'custCategory',
        				fieldLabel : ' <span style="color:red">*</span>客户类型',
        				labelStyle : 'text-align:right;',
        				triggerAction : 'all',
        				store : _this.chanceCategoryStore,
        				displayField : 'value',
        				valueField : 'key',
        				mode : 'local',
        				forceSelection : true,
        				emptyText : '请选择 ',
        				resizable : true,
        				readonly : true,
        				anchor : '90%'
        			}), {
        				xtype : 'textfield',
        				fieldLabel : '客户联系人',
        				name : 'custContactName',
        				readonly : true,
        				anchor : '90%'
        			},new Com.yucheng.bcrm.common.OrgField({
        				xtype : 'orgchoose',
        				fieldLabel : ' <span style="color:red">*</span>商机执行机构',
        				name : 'executeOrgName',
        				hiddenName:'executeOrgId',
        				readonly : true,
        				anchor : '90%'
        			}), {
        				xtype : 'numberfield',
        				fieldLabel : '费用预算(元)',
        				name : 'planCost',
        				value : '0',
        				labelStyle : 'text-align:right;',
        				anchor : '90%'
        			} ]
        		} ]
        	}, {
        		layout : 'form',
        		items : [ {
        			xtype : 'textarea',
        			fieldLabel : ' <span style="color:red">*</span>商机内容',
        			name : 'opporContent',
        			anchor : '95%'
        		}, {
        			xtype : 'textarea',
        			fieldLabel : '商机备注',
        			name : 'memo',
        			anchor : '95%'
        		} ]
        	} ],
        	buttons : [ {
        		text : '保存',
        		handler : function(){
        			var executeUserName= _this.opporPanel.getForm().findField('executeUserName').getValue();
        			var executeOrgName= _this.opporPanel.getForm().findField('executeOrgName').getValue();
        			var OPPOR_DUE_DATE_P= _this.opporPanel.getForm().findField('opporDueDate').getValue();
 				   	var OPPOR_START_DATE_P= _this.opporPanel.getForm().findField('opporStartDate').getValue();
 				   	var OPPOR_END_DATE_P= _this.opporPanel.getForm().findField('opporEndDate').getValue();
 				   	var OPPOR_CUST_SOURCE= _this.opporPanel.getForm().findField('custSource').getValue();
 				   	var OPPOR_SOURCE= _this.opporPanel.getForm().findField('opporSource').getValue();
 				   	debugger;
 				   	var GROUP_ID = _this.groupId;
 				   if(OPPOR_CUST_SOURCE=='1' && OPPOR_SOURCE=='0'){
					   if(!_this.validateForm("CUST","手动创建")){
						   return false;
					   }
				   }else if(OPPOR_CUST_SOURCE=='1' && OPPOR_SOURCE!='0'){
					   if(!_this.validateForm("CUST","其他")){
						   return false;
					   }
				   }else if(OPPOR_CUST_SOURCE=='2' && OPPOR_SOURCE=='0' ){
					   if(!_this.validateForm("CUSTGROUP","手动创建")){
						   return false;
					   }
				   }else if(OPPOR_CUST_SOURCE=='2' && OPPOR_SOURCE!='0'){
					   if(!_this.validateForm("CUSTGROUP","其他")){
						   return false;
					   }
				   }
 				   	if(!dateValidate(OPPOR_START_DATE_P,OPPOR_END_DATE_P,OPPOR_DUE_DATE_P)){
					   return false;
 				   	}
            		var saveUrl = '';
//            		debugger;
            		saveUrl = basepath + '/mktBusiOpporOperationAction!'
            			+ 'saveOrUpdateBusiOppor.json?flag=true&&groupId='+GROUP_ID+'&&executeUserName='+executeUserName+'&&executeOrgName='+executeOrgName+'&&ifgroup='+ifgroup+'&&custStr='+custStr;
            		
            		Ext.Ajax.request({
            			url : saveUrl,
            			method : 'POST',
            			form : _this.opporPanel.getForm().id,
            			waitMsg : '正在保存数据,请等待...',
            			success : function(response) {
            				Ext.Msg.alert('提示', '保存成功！');
//            				if(!ifGroup&&!ifProd){//如果是视图部分的，不查询
//            					store.load({
//            						params : {
//            							start : 0,
//            							limit : bbar.pageSize
//            						}
//            					});
//            				}
            			},
            			failure : function(response) {
            				Ext.Msg.alert('提示', '保存失败！');
            			}
            		});
            		_this.hide();
        			
        		}
        	}, {
        		text : '提交',
        		handler : function(){
        			var executeUserName= _this.opporPanel.getForm().findField('executeUserName').getValue();
        			var executeOrgName= _this.opporPanel.getForm().findField('executeOrgName').getValue();
        			var OPPOR_DUE_DATE_P= _this.opporPanel.getForm().findField('opporDueDate').getValue();
 				   	var OPPOR_START_DATE_P= _this.opporPanel.getForm().findField('opporStartDate').getValue();
 				   	var OPPOR_END_DATE_P= _this.opporPanel.getForm().findField('opporEndDate').getValue();
 				   	var OPPOR_CUST_SOURCE= _this.opporPanel.getForm().findField('custSource').getValue();
 				   	var OPPOR_SOURCE= _this.opporPanel.getForm().findField('opporSource').getValue();
 				   if(OPPOR_CUST_SOURCE=='1' && OPPOR_SOURCE=='0'){
					   if(!_this.validateForm("CUST","手动创建")){
						   return false;
					   }
				   }else if(OPPOR_CUST_SOURCE=='1' && OPPOR_SOURCE!='0'){
					   if(!_this.validateForm("CUST","其他")){
						   return false;
					   }
				   }else if(OPPOR_CUST_SOURCE=='2' && OPPOR_SOURCE=='0' ){
					   if(!_this.validateForm("CUSTGROUP","手动创建")){
						   return false;
					   }
				   }else if(OPPOR_CUST_SOURCE=='2' && OPPOR_SOURCE!='0'){
					   if(!_this.validateForm("CUSTGROUP","其他")){
						   return false;
					   }
				   }
 				   	if(!dateValidate(OPPOR_START_DATE_P,OPPOR_END_DATE_P,OPPOR_DUE_DATE_P)){
					   return false;
 				   	}
        			var saveUrl = basepath + '/mktBusiOpporOperationAction!'
        			+ 'submitBusiOppor.json?flag=true&&executeUserName='+executeUserName+'&&executeOrgName='+executeOrgName;
        	Ext.Ajax.request({
        		url : saveUrl,
        		method : 'POST',
        		form : _this.opporPanel.getForm().id,
        		waitMsg : '正在保存数据,请等待...',
        		success : function(response) {
        			// Ext.Msg.alert('提示', '提交成功！');
        			var msg = response.responseText;
        			if (msg != null && msg != "") {
        				if (msg.substring(0, 1) == "0") {
        					msg = "商机成功分配给客户经理“" + msg.substring(1) + "”。";
        				} else if (msg.substring(0, 1) == "1") {
        					msg = "商机成功分配给机构“" + msg.substring(1) + "”。";
        				}
        			}
        			Ext.Msg.alert('提示', msg);
        			store.load({
        				params : {
        					start : 0,
        					limit : bbar.pageSize
        				}
        			});
        		},
        		failure : function(response) {
        			Ext.Msg.alert('提示', '提交失败！');
        		}
        	});
        	_this.hide();
        		}
        	}, {
        		text : '关闭',
        		handler : function() {
        			_this.hide();
        		}
        	} ]
        	
        });
        if(_this.isgroup){
        	_this.opporPanel.getForm().findField('custName').setVisible(false);
			_this.opporPanel.getForm().findField('executeUserName').setVisible(false);
			_this.opporPanel.getForm().findField('executeOrgName').setVisible(false);
			_this.opporPanel.getForm().findField('custType').setVisible(false);
			_this.opporPanel.getForm().findField('custCategory').setVisible(false);
			_this.opporPanel.getForm().findField('custContactName').setVisible(false);
			_this.opporPanel.getForm().findField('custGroup').setVisible(true);
			_this.opporPanel.getForm().findField('custSource').setValue('2');
			_this.opporPanel.getForm().findField('custSource').setReadOnly(true);
			_this.opporPanel.buttons[1].hide();
			ifgroup=true;
        }
        if(_this.iscust){
        	_this.opporPanel.getForm().findField('custName').setVisible(true);
			_this.opporPanel.getForm().findField('executeUserName').setVisible(true);
			_this.opporPanel.getForm().findField('executeOrgName').setVisible(true);
			_this.opporPanel.getForm().findField('custType').setVisible(true);
			_this.opporPanel.getForm().findField('custCategory').setVisible(true);
			_this.opporPanel.getForm().findField('custContactName').setVisible(true);
			_this.opporPanel.getForm().findField('custGroup').setVisible(false);
			_this.opporPanel.getForm().findField('custSource').setValue('1');
			_this.opporPanel.getForm().findField('custSource').setReadOnly(true);
			_this.opporPanel.buttons[1].show();
			ifgroup=false;
        }
        _this.add(_this.opporPanel);
        _this.doLayout();
        
        
        
    },
    onRender : function(ct, position){
        Com.yucheng.bcrm.common.CreateMktOppor.superclass.onRender.call(this, ct, position);
    },
    afterRender : function(){
    	var _this = this;
    	Com.yucheng.bcrm.common.CreateMktOppor.superclass.afterRender.call(this);
    	_this.opporPanel.getForm().findField('custName').setValue(_this.custName);
        _this.opporPanel.getForm().findField('custId').setValue(_this.custId);
        _this.opporPanel.getForm().findField('prodName').setValue(_this.prodName);
        _this.opporPanel.getForm().findField('prodId').setValue(_this.prodId);
        _this.opporPanel.getForm().findField('executeUserName').setValue(_this.mgrName);
        _this.opporPanel.getForm().findField('executeUserId').setValue(_this.mgrId);
        _this.opporPanel.getForm().findField('executeOrgId').setValue(_this.orgId);
        _this.opporPanel.getForm().findField('executeOrgName').setValue(_this.orgName);
        _this.opporPanel.getForm().findField('custContactName').setValue(_this.linkMan);
        _this.opporPanel.getForm().findField('custCategory').setValue(_this.custType);
        _this.opporPanel.getForm().findField('custType').setValue(_this.custStat);
        _this.opporPanel.getForm().findField('custGroup').setValue(_this.groupId);
        _this.opporPanel.getForm().findField('custGroup').setRawValue(_this.groupName);
        _this.opporPanel.getForm().findField('opporSource').setValue('0');
        
    },
    listeners:{
    	show:function(){
    	}
    },
    validateForm:function(P,K){
    	var _this = this;
		var OPPOR_NAME=_this.opporPanel.getForm().findField("opporName").getValue();
		var OPPOR_TYPE=_this.opporPanel.getForm().findField("opporType").getValue();
		var PROD_ID=_this.opporPanel.getForm().findField("prodId").getValue();
		var OPPOR_DUE_DATE=_this.opporPanel.getForm().findField("opporDueDate").getValue();
		var OPPOR_START_DATE=_this.opporPanel.getForm().findField("opporStartDate").getValue();
		var OPPOR_END_DATE=_this.opporPanel.getForm().findField("opporEndDate").getValue();
		var CUST_ID=_this.opporPanel.getForm().findField("custId").getValue();
		var CUST_CATEGORY=_this.opporPanel.getForm().findField("custCategory").getValue();
		var CUST_TYPE=_this.opporPanel.getForm().findField("custType").getValue();
		var EXECUTE_USER_ID=_this.opporPanel.getForm().findField("executeUserId").getValue();
		var EXECUTE_ORG_ID=_this.opporPanel.getForm().findField("executeOrgId").getValue();
		var OPPOR_CONTENT=_this.opporPanel.getForm().findField("opporContent").getValue();
		var CUST_GROUP=_this.opporPanel.getForm().findField("custGroup").getValue(); 
		if(P=='CUST' && K=='手动创建'){
			if(OPPOR_NAME=='' || OPPOR_TYPE=='' || PROD_ID=='' || OPPOR_DUE_DATE=='' || OPPOR_START_DATE=='' || OPPOR_END_DATE=='' 
				|| CUST_ID=='' || CUST_CATEGORY=='' || CUST_TYPE=='' ||  EXECUTE_USER_ID=='' || EXECUTE_ORG_ID=='' || OPPOR_CONTENT=='' ){
				
				 Ext.MessageBox.alert('系统提示信息', '请正确输入各项必要信息！');
   	    		 return false;
			} 
		}
		if(P=='CUST' && K!='手动创建'){
			if(OPPOR_NAME=='' || OPPOR_TYPE==''  || OPPOR_DUE_DATE=='' || OPPOR_START_DATE=='' || OPPOR_END_DATE=='' 
				|| CUST_ID=='' || CUST_CATEGORY=='' || CUST_TYPE=='' ||  EXECUTE_USER_ID=='' || EXECUTE_ORG_ID=='' || OPPOR_CONTENT==''){
				 Ext.MessageBox.alert('系统提示信息', '请正确输入各项必要信息！');
		    		 return false;
			}
		}
		if(P=='CUSTGROUP' && K=='手动创建'){
			if(OPPOR_NAME=='' || OPPOR_TYPE=='' || PROD_ID==''  || OPPOR_DUE_DATE=='' || OPPOR_START_DATE=='' || OPPOR_END_DATE=='' 
				  || OPPOR_CONTENT=='' || CUST_GROUP==''){
				 Ext.MessageBox.alert('系统提示信息', '请正确输入各项必要信息！');
		    		 return false;
			}
		}
		if(P=='CUSTGROUP' && K!='手动创建'){
			if(OPPOR_NAME=='' || OPPOR_TYPE=='' || OPPOR_DUE_DATE=='' || OPPOR_START_DATE=='' || OPPOR_END_DATE=='' 
				  || OPPOR_CONTENT=='' || CUST_GROUP==''){
				 Ext.MessageBox.alert('系统提示信息', '请正确输入各项必要信息！');
		    		 return false;
			}
		}
		
		return true;
	}
    
});

function dateValidate(OPPOR_START_DATE_P,OPPOR_END_DATE_P,OPPOR_DUE_DATE_P){
	// 1、商机“开始日期”不能晚于“完成日期”
	if (OPPOR_START_DATE_P >= OPPOR_END_DATE_P) {
		Ext.Msg.alert('提示', '商机“开始日期”不能晚于或等于“完成日期”！');
		return false;
	}
	// 2、商机“开始日期”不能晚于“商机有效期”
	if (OPPOR_START_DATE_P >= OPPOR_DUE_DATE_P) {
		Ext.Msg.alert('提示', '商机“开始日期”不能晚于或等于“商机有效期”！');
		return false;
	}
	// 3、商机“完成日期”不能晚于“商机有效期”
	if (OPPOR_END_DATE_P >= OPPOR_DUE_DATE_P) {
		Ext.Msg.alert('提示', '商机“完成日期”不能晚于或等于“商机有效期”！');
		return false;
	}
	return true;
}

Ext.reg('createoppor',Com.yucheng.bcrm.common.CreateMktOppor);

