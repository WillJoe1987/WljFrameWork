
Ext.ns('loan.contract');

loan.contract.products = {
	10086:'P10086',
	10087:'P10087',
	10088:'P10088'
};

loan.contract.contproperties = {
	PdefaultFiels : {
		CONT_NO:{text:"合同编号"},
		CONT_NAME:{text:'合同名称'},
		PRODUCT_ID:{text:"产品ID"},
		CREATE_DATE:{text:"创建日期"},
		CREATE_USER:{text:"创建人"},
		CUST_NAME:{text:'客户名称'},
		IDENT_NO:{text:'证件编号'},
		MANAGER:{text:'客户经理'},
		FK_AREA : {text : '放款地区名称'},
		FK_ACCOUNT:{text:'放款账号'},
		FROM_CONT_ID:{text:'原合同编号'},
		APPROVE_STAT:{text:'审批状态'},
		CONT_STAT:{text:'合同状态'},
		CJR_ID:{text:'借款人编号'},
		CJR_NAME:{text:'借款人名称'}
	},
	P10086:{
		CONT_NO:{text:'合同编号'},
		CONT_NAME:{text:'合同名称'},
		//CUST_ID:{text:'客户号'},
		PRODUCT_ID:{text:'产品类型'},
		CUST_NAME:{text:'客户名称'},
		MANAGER : {text:'客户经理'},
		INDUSTRY : {text:'行业'},
		FK_DATE:{text:'放款日期'},
		CJR_ID:{text:'出借人编码'},
		CJR_NAME:{text:'出借人姓名'},
		FK_AREA:{text:'放款地区'},
		//FK_AREA_NAME:{text:'放款地区名称'},
		FK_AMT:{text:'放款金额'},
		FK_TERM:{text:'放款期限'},
		INT_YEAR:{text:'年利率'},
		TOTAL_INT:{text:'应收利息'},
		FK_ACCOUNT:{text:'放款卡账号'},
		XYPG_RATE:{text:'信用评估费率A'},
		Y_XYPG_FEE:{text:'应收信用评估费A'},
		S_XYPG_FEE:{text:'实收信用评估费A'},
		XYGL_RATE : {text:'信用管理费率A'},
		IF_XYGL_FEE:{text:'是否收取用信用管理费A'},
		Y_XYGL:{text:'应收信用管理费A'},
		S_XYGL:{text:'实收应用管理费A'},
		C_XYGL:{text:'差额信用管理费A'},
		IF_FP:{text:'是否开票'},
		MEMO:{text:'备注'},
		IF_DUE_INT:{text:'逾期利息费状态A'},
		DUE_RATE:{text:'逾期利息率A'},
		Y_DUE_INT:{text:'应收逾期利息费A'},
		S_DUE_INT:{text:'实收逾期利息费A'},
		C_DUE_INT:{text:'差额逾期利息费A'},
		CONT_STAT:{text:'项目状态'},
		FROM_CONT_ID:{text:'原合同编号'},
		CREATE_DATE:{text:'创建日期'},
		CREATE_USER:{text:'创建人'}
	},
	P10087:{
		//CONT_ID:{text:"合同IDB"},
		CONT_NO:{text:"合同编号"},
		CONT_NAME:{text:'合同名称'},
		//CUST_ID:{text:"客户号"},
		CUST_NAME:{text:"客户名称"},
		INDUSTRY : {text:'行业'},
		MANAGER : {text:'客户经理'},
		PRODUCT_ID:{text:"产品类型"},
		FK_DATE:{text:'放款日期'},
		CJR_ID:{text:'出借人编码'},
		CJR_NAME:{text:'出借人姓名'},
		FK_AREA:{text:'放款地区编码'},
		//FK_AREA_NAME:{text:'放款地区名称'},
		FK_AMT:{text:'放款金额'},
		FK_TERM:{text:'放款期限'},
		INT_YEAR:{text:'年利率'},
		TOTAL_INT:{text:'应收利息'},
		FK_ACCOUNT:{text:'放款卡账号'},
		XYPG_RATE:{text:'信用评估费率B'},
		Y_XYPG_FEE:{text:'应收信用评估费B'},
		S_XYPG_FEE:{text:'实收信用评估费B'},
		XYGL_RATE : {text:'信用管理费率B'},
		IF_XYGL_FEE:{text:'是否收取用信用管理费B'},
		Y_XYGL:{text:'应收信用管理费B'},
		S_XYGL:{text:'实收应用管理费B'},
		C_XYGL:{text:'差额信用管理费B'},
		IF_DUE_INT:{text:'逾期利息费状态B'},
		DUE_RATE:{text:'逾期利息率B'},
		Y_DUE_INT:{text:'应收逾期利息费B'},
		S_DUE_INT:{text:'实收逾期利息费B'},
		C_DUE_INT:{text:'差额逾期利息费B'},
		IF_FP:{text:'是否开票'},
		MEMO:{text:'备注'},
		CONT_STAT:{text:"项目状态"},
		FROM_CONT_ID:{text:"原合同编号"},
		CREATE_DATE:{text:"创建日期"},
		CREATE_USER:{text:"创建人"}
	},
	P10088:{
		CONT_NO:{text:"合同编号"},
		CONT_NAME:{text:'合同名称'},
		//CUST_ID:{text:"客户号"},
		CUST_NAME:{text:"客户名称"},
		INDUSTRY : {text:'行业'},
		MANAGER : {text:'客户经理'},
		PRODUCT_ID:{text:"产品类型"},
		FK_DATE:{text:'放款日期'},
		CJR_ID:{text:'出借人编码'},
		CJR_NAME:{text:'出借人姓名'},
		FK_AREA:{text:'放款地区编码'},
		//FK_AREA_NAME:{text:'放款地区名称'},
		FK_AMT:{text:'放款金额'},
		FK_TERM:{text:'放款期限'},
		INT_YEAR:{text:'年利率'},
		TOTAL_INT:{text:'应收利息'},
		FK_ACCOUNT:{text:'放款卡账号'},
		XYPG_RATE:{text:'信用评估费率C'},
		Y_XYPG_FEE:{text:'应收信用评估费C'},
		S_XYPG_FEE:{text:'实收信用评估费C'},
		XYGL_RATE : {text:'信用管理费率C'},
		IF_XYGL_FEE:{text:'是否收取用信用管理费C'},
		Y_XYGL:{text:'应收信用管理费C'},
		S_XYGL:{text:'实收应用管理费C'},
		C_XYGL:{text:'差额信用管理费C'},
		IF_FP:{text:'是否开票'},
		MEMO:{text:'备注'},
		IF_XGZNJ:{text:"信用管理费滞纳金状态C"},
		XGZNJ_RATE:{text:"信用管理费滞纳金率C"},
		Y_XGZNJ :{text:'应收信用管理费滞纳金C'},
		S_XGZNJ : {text : '实收信用管理费滞纳金C'},
		C_XGZNJ : {text : '差额信用管理费滞纳金C'},
		CONT_STAT:{text:"项目状态"},
		FROM_CONT_ID:{text:"原合同编号"},
		CREATE_DATE:{text:"创建日期"},
		CREATE_USER:{text:"创建人"}
	},
	getStoreFields : function(){
		var fields = [];
		loan.contract.form.getForm().items.each(function(f){
			fields.push(f.name);
		});
		return fields;
	}
};

loan.contract.planproperties = {
	P10086:{},
	P10087:{},
	P10088:{}	
};

loan.contract.form = new Ext.form.FormPanel({
	layout : 'column',
	region : 'center',
	autoScroll : 'auto',
	items : [{
		"layout":"form",
		"columnWidth":0.5,
		"items":[{
			"name":"CONT_ID","text":"合同ID","fieldLabel":"合同ID","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"CUST_ID","text":"客户号","fieldLabel":"客户号","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"FROM_CONT_ID","text":"原合同编号","fieldLabel":"原合同编号","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"CONT_STAT","text":"合同状态","fieldLabel":"合同状态","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"CJR_NAME","text":"出借人姓名","fieldLabel":"出借人姓名","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"FK_AREA_NAME","text":"放款地区名称","fieldLabel":"放款地区名称","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"FK_ACCOUNT","text":"放款卡账号","fieldLabel":"放款卡账号","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"FK_AMT","text":"放款金额","fieldLabel":"放款金额","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"INT_YEAR","text":"年利率","fieldLabel":"年利率","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"TOTAL_INT","text":"应收利息","fieldLabel":"应收利息","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"XYPG_RATE","text":"信用评估费率","fieldLabel":"信用评估费率","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"S_XYPG_FEE","text":"实收信用评估费","fieldLabel":"实收信用评估费","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"XYGL_RATE","text":"信用管理费率","fieldLabel":"信用管理费率","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"DUE_RATE","text":"逾期利息率A","fieldLabel":"逾期利息率A","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"XGZNJ_RATE","text":"信用管理费滞纳金率","fieldLabel":"信用管理费滞纳金率","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"MEMO","text":"备注","fieldLabel":"备注","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"CREATE_USER","text":"创建人","fieldLabel":"创建人","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		}]
	},{
		"layout":"form",
		"columnWidth":0.5,
		"items":[{
			"name":"CONT_NO","text":"合同编号","fieldLabel":"合同编号","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"CUST_NAME","text":"客户名称","searchField":true,"fieldLabel":"客户名称","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"APPROVE_STAT","text":"审批状态","fieldLabel":"审批状态","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"CJR_ID","text":"出借人编码","fieldLabel":"出借人编码","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"FK_AREA","text":"放款地区编码","fieldLabel":"放款地区编码","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"PRODUCT_ID","text":"产品ID","fieldLabel":"产品ID","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"FK_DATE","text":"放款日期","fieldLabel":"放款日期","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"FK_TERM","text":"放款期限","fieldLabel":"放款期限","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"TOTAL_BJ","text":"应还本金","fieldLabel":"应还本金","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"ACT_INT","text":"实收利息","fieldLabel":"实收利息","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"Y_XYPG_FEE","text":"应收信用评估费","fieldLabel":"应收信用评估费","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"IF_XYGL_FEE","text":"是否收取用信用管理费","fieldLabel":"是否收取用信用管理费","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"IF_DUE_INT","text":"逾期利息费A状态","fieldLabel":"逾期利息费A状态","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"IF_XGZNJ","text":"信用管理费滞纳金状态","fieldLabel":"信用管理费滞纳金状态","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"IF_FP","text":"是否开票","fieldLabel":"是否开票","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		},{
			"name":"CREATE_DATE","text":"创建日期","fieldLabel":"创建日期","xtype":"textfield","hidden":false,"anchor":"90%","listeners":{}
		}]
	}],
	buttonAlign : 'left',
	buttons : [{
		text : '还款列表',
		handler : function(){
			if(!getCustomerViewByTitle('合同列表').assistantView.moveined){
				getCustomerViewByTitle('合同列表').showAssistant();
				loan.contract.hkplanStore.reload({
					params : {
						condition : Ext.encode({
							CONT_ID : loan.contract.form.getForm().findField('CONT_ID').getValue()
						})
					}
				});
			}
			else{
				getCustomerViewByTitle('合同列表').hideAssistant();
			}
		}
	},{
		text : 'computer',
		handler : function(){
			loan.util.formulas.excute.call(loan.contract.form, 'TOTAL_INT');
		}
	}],
	setContractRecord : function(cRecord){
		this.getForm().loadRecord(cRecord);
		this.setProductId(cRecord.get('PRODUCT_ID'));
		if(getCustomerViewByTitle('合同列表').assistantView.moveined){
			loan.contract.hkplanStore.reload({
				params : {
					condition : Ext.encode({
						CONT_ID : loan.contract.form.getForm().findField('CONT_ID').getValue()
					})
				}
			});
		}
	},
	setProductId : function(productId){
		var pId = productId;
		if(!pId || !loan.contract.contproperties['P'+pId]){
			pId = 'defaultFiels';
		}
		this.getForm().items.each(function(ite){
			ite.hide();
			if(loan.contract.contproperties['P'+pId][ite.name]){
				ite.show();
				ite.setLabelText(loan.contract.contproperties['P'+pId][ite.name].text);
			}
		});
	}
});
loan.contract.store = new Ext.data.Store({
	restful:true,   
	autoLoad :false,
	proxy : new Ext.data.HttpProxy({
		url : basepath+'/loanfcontract.json'
	}),
	reader : new Ext.data.JsonReader({
		idProperty : 'CONT_ID',
		root : 'json.data'
	}, loan.contract.contproperties.getStoreFields())
});

loan.contract.gridRowSelect = new Ext.grid.RowSelectionModel({
	singleSelect : true,
	listeners : {
		rowselect : function(sm , index, e){
			loan.contract.form.setContractRecord(sm.grid.store.getAt(index));
		}
	}
});

loan.contract.grid = new Ext.grid.GridPanel({
    //title : 'grid',
    frame : true,
    width : 110,
    store : loan.contract.store, 
    sm : loan.contract.gridRowSelect,
    region : 'west',
    stripeRows : true, 
    columns: [
              {header: '合同编号', width: 110,menuDisabled: true,sortable: false,dataIndex: 'CONT_ID'}
          ],
    viewConfig : {
    },
    loadMask : {
        msg : '...'
    }
});
loan.contract.container = new Ext.Panel({
	layout : 'border',
	items : [loan.contract.grid,loan.contract.form]
});


loan.contract.hkplanStore = new Ext.data.Store({
	restful:true,   
	autoLoad :false,
	proxy : new Ext.data.HttpProxy({
		url : basepath+'/loanfhkplan.json'
	}),
	reader : new Ext.data.JsonReader({
		idProperty : 'ID',
		root : 'json.data'
	}, ['ID','CONT_ID','HK_TEAM_NO','PLAN_DATE','EXE_DATE','ACT_DATE','XYGL_RATE','Y_XYGL','S_XYGL','R_XYGL','C_XYGL','XGZNJ_RATE','Y_XGZNJ','S_XGZNJ','R_XGZNJ','C_XGZNJ','EXE_DUE_DAYS','PLAN_DUE_DAYS','DUE_RATE','Y_DUE_INT','S_DUE_INT','R_DUE_INT','C_DUE_INT','C_TOTAL_FEE','Y_BJ','S_BJ','Y_INT','S_INT','REF','TODO_AMT','DONE_AMT','CHA_AMT','HK_STAT','MEMO'])
});


loan.contract.hkplanGrid  = new Ext.grid.GridPanel({
    frame : true,
    store : loan.contract.hkplanStore, 
    stripeRows : true, 
    columns: [{"name":"ID","text":"序号","header":"序号","dataIndex":"ID"},{"name":"CONT_ID","text":"合同编号","searchField":true,"header":"合同编号","dataIndex":"CONT_ID"},{"name":"HK_TEAM_NO","text":"还款期","header":"还款期","dataIndex":"HK_TEAM_NO"},{"name":"PLAN_DATE","text":"计划还款日期","header":"计划还款日期","dataIndex":"PLAN_DATE"},{"name":"EXE_DATE","text":"执行还款日期","header":"执行还款日期","dataIndex":"EXE_DATE"},{"name":"ACT_DATE","text":"实际还款日","header":"实际还款日","dataIndex":"ACT_DATE"},{"name":"XYGL_RATE","text":"信用管理费率","header":"信用管理费率","dataIndex":"XYGL_RATE"},{"name":"Y_XYGL","text":"应收信用管理费","header":"应收信用管理费","dataIndex":"Y_XYGL"},{"name":"S_XYGL","text":"实收信用管理费","header":"实收信用管理费","dataIndex":"S_XYGL"},{"name":"R_XYGL","text":"减免后信用管理费","header":"减免后信用管理费","dataIndex":"R_XYGL"},{"name":"C_XYGL","text":"差额信用管理费","header":"差额信用管理费","dataIndex":"C_XYGL"},{"name":"XGZNJ_RATE","text":"信用管理费滞纳金率","header":"信用管理费滞纳金率","dataIndex":"XGZNJ_RATE"},{"name":"Y_XGZNJ","text":"应收信用管理费滞纳金","header":"应收信用管理费滞纳金","dataIndex":"Y_XGZNJ"},{"name":"S_XGZNJ","text":"实收信用管理费滞纳金","header":"实收信用管理费滞纳金","dataIndex":"S_XGZNJ"},{"name":"R_XGZNJ","text":"减免后应收信用管理费滞纳金","header":"减免后应收信用管理费滞纳金","dataIndex":"R_XGZNJ"},{"name":"C_XGZNJ","text":"差额信用管理费滞纳金","header":"差额信用管理费滞纳金","dataIndex":"C_XGZNJ"},{"name":"EXE_DUE_DAYS","text":"执行逾期天数","header":"执行逾期天数","dataIndex":"EXE_DUE_DAYS"},{"name":"PLAN_DUE_DAYS","text":"计息逾期天数","header":"计息逾期天数","dataIndex":"PLAN_DUE_DAYS"},{"name":"DUE_RATE","text":"逾期利息率","header":"逾期利息率","dataIndex":"DUE_RATE"},{"name":"Y_DUE_INT","text":"应收逾期利息费","header":"应收逾期利息费","dataIndex":"Y_DUE_INT"},{"name":"S_DUE_INT","text":"实收逾期利息费","header":"实收逾期利息费","dataIndex":"S_DUE_INT"},{"name":"R_DUE_INT","text":"减免后应收逾期利息费","header":"减免后应收逾期利息费","dataIndex":"R_DUE_INT"},{"name":"C_DUE_INT","text":"差额逾期利息费","header":"差额逾期利息费","dataIndex":"C_DUE_INT"},{"name":"C_TOTAL_FEE","text":"差额总费用","header":"差额总费用","dataIndex":"C_TOTAL_FEE"},{"name":"Y_BJ","text":"应还本金","header":"应还本金","dataIndex":"Y_BJ"},{"name":"S_BJ","text":"实收本金","header":"实收本金","dataIndex":"S_BJ"},{"name":"Y_INT","text":"应收利息","header":"应收利息","dataIndex":"Y_INT"},{"name":"S_INT","text":"实收利息","header":"实收利息","dataIndex":"S_INT"},{"name":"REF","text":"参考值","header":"参考值","dataIndex":"REF"},{"name":"TODO_AMT","text":"当期应还金额","header":"当期应还金额","dataIndex":"TODO_AMT"},{"name":"DONE_AMT","text":"当期实收金额","header":"当期实收金额","dataIndex":"DONE_AMT"},{"name":"CHA_AMT","text":"当期实收金额","header":"当期实收金额","dataIndex":"CHA_AMT"},{"name":"HK_STAT","text":"还款状态（正常、逾期）","header":"还款状态（正常、逾期）","dataIndex":"HK_STAT"},{"name":"MEMO","text":"还款状态（正常、逾期）","header":"还款状态（正常、逾期）","dataIndex":"MEMO"}],
    viewConfig : {
		autoFill : false 
    },
    loadMask : {
        msg : '正在加载表格数据,请稍等...'
    }
});


