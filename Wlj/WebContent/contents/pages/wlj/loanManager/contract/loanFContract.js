/**
 * 合同管理
 */

imports([
         '/contents/pages/loanCommon/wlj.common.loan.CustomerChooser.js',
         '/contents/pages/wlj/loanManager/loanWidgetsOnce.js',
         '/contents/pages/wlj/loanManager/loan.util.js'
]);
Wlj.frame.functions.app.widgets.TitleTile.prototype.defaultFieldWidth = 75;
Ext.form.NumberField.prototype.enableKeyEvents = true;
Ext.form.NumberField.prototype.listeners = {};
Ext.form.NumberField.prototype.listeners.keydown = function(field, e){
	if(getCurrentView().contentPanel && getCurrentView().contentPanel.getForm){
		loan.util.formulas.buildResult.call(getCurrentView().contentPanel, field.name);
	}
};
lookupTypes = ['LOAN_CONTRACT_STAT','LOAN_00001',{
		TYPE : 'PRODUCTS',
		url : '/loanfproduct.json',
		key : 'ID',
		value : 'PROD_NAME',
		jsonRoot : 'json.data'
	},{
		TYPE : 'USER',
		url : '/usermanagequery.json',
		key : 'ACCOUNT_NAME',
		value : 'USER_NAME',
		jsonRoot : 'json.data'
	},{
		TYPE : 'ORG',
		url : '/systemUnit-query.json',
		key : 'ID',
		value : 'ORG_NAME',
		jsonRoot : 'json.data'
}];

url=basepath+'/loanfcontract.json';

fields = [{name:'CONT_ID',text:'合同ID',hidden:true},
{name:'CONT_NO',text:'合同编号',searchField:true,allowBlank:false},
{name:'CONT_NAME',text:'合同名称',searchField:true,allowBlank:false},
{name:'CUST_ID',text:'客户号',hidden:true},
{name:'CUST_NAME',text:'客户名称',searchField:true,xtype:'loancustomerchooser',hiddenName:'CUST_ID',callback:function(a,b){
	  getCurrentView().contentPanel.getForm().findField('MANAGER').setValue(b[0].get('MANAGER'));
	  getCurrentView().contentPanel.getForm().findField('IDENT_NO').setValue(b[0].get('IDENT_NO'));
	  getCurrentView().contentPanel.getForm().findField('FK_AREA').setValue(b[0].get('ORG_ID'));
  }},
{name:'IDENT_NO',text:'证件号码',searchField:true,readOnly:true},//无字段
{name:'MANAGER',text:'客户经理',searchField:true,translateType:'USER',readOnly:true},//无字段
{name:'INDUSTRY',text:'行业'},
{name:'FROM_CONT_ID',text:'原合同编号',gridField:false},
{name:'APPROVE_STAT',text:'审批状态',gridField:false,translateType:'LOAN_00001',readOnly:true},
{name:'CONT_STAT',text:'合同状态',translateType:'LOAN_CONTRACT_STAT',searchField:true,readOnly:true},
{name:'CJR_ID',text:'出借人编码'},
{name:'CJR_NAME',text:'出借人姓名',searchField:true},
{name:'FK_AREA',text:'放款地区编码',gridField:false,translateType:'ORG',readOnly:true},
{name:'FK_AREA_NAME',text:'放款地区名称',gridField:false,hidden:true},
{name:'PRODUCT_ID',text:'产品',translateType:'PRODUCTS',allowBlank:false},
{name:'FK_ACCOUNT',text:'放款卡账号',gridField:false},	
{name:'FK_DATE',text:'放款日期',dataType:'date',searchField:true},
{name:'FK_AMT',text:'放款金额',dataType:'money'},
{name:'FK_TERM',text:'放款期限',dataType:'numberNoDot'},
{name:'INT_YEAR',text:'年利息',dataType:'rate'},
{name:'TOTAL_BJ',text:'应还本金',dataType:'money'},
{name:'SS_BJ',text:'实收本金'},
{name:'TOTAL_INT',text:'应收利息',gridField:false,dataType:'money'},
{name:'ACT_INT',text:'实收利息',gridField:false,dataType:'money'},
{name:'XYPG_RATE',text:'信用评估费率',gridField:false,dataType:'rate'},
{name:'Y_XYPG_FEE',text:'应收信用评估费',gridField:false,dataType:'money'},
{name:'S_XYPG_FEE',text:'实收信用评估费',gridField:false,dataType:'money'},
{name:'EXE_DUE_DAYS',text:'逾期天数'},
{name:'PLAN_DUE_DAYS',text:'计息逾期天数'},
{name:'IF_XYGL_FEE',text:'是否收取用信用管理费',gridField:false},
{name:'XYGL_RATE',text:'信用管理费率',gridField:false,dataType:'rate'},
{name:'Y_XYGL',text:'应收信用管理费'},
{name:'S_XYGL',text:'实收应用管理费'},
{name:'C_XYGL',text:'差额信用管理费'},
{name:'IF_DUE_INT',text:'逾期利息费A状态',gridField:false},
{name:'DUE_RATE',text:'逾期利息率A',gridField:false,dataType:'rate'},
{name:'Y_DUE_INT',text:'应收逾期利息费'},
{name:'S_DUE_INT',text:'实收逾期利息费'},
{name:'C_DUE_INT',text:'差额逾期利息费'},
{name:'IF_XGZNJ',text:'信用管理费滞纳金状态',gridField:false},
{name:'XGZNJ_RATE',text:'信用管理费滞纳金率',gridField:false,dataType:'rate'},
{name:'Y_XGZNJ',text:'应收信用管理费滞纳金'},
{name:'S_XGZNJ',text:'实收信用管理费滞纳金'},
{name:'C_XGZNJ',text:'差额信用管理费滞纳金'},
{name:'CEZFY',text:'差额总费用'},
{name:'YSHKZJE',text:'应收还款总金额'},
{name:'SSHKZJE',text:'实收还款总金额'},
{name:'CKCE',text:'还款差额：'},
{name:'CKZ',text:'参考值'},
{name:'IF_FP',text:'是否开票',gridField:false},
{name:'MEMO',text:'备注',gridField:false},
{name:'CREATE_DATE',text:'创建日期',dataType:'date'},
{name:'CREATE_USER',text:'创建人',translateType:'USER'}];



searchDomainCfg = {
	title : '查询条件',
//	collapsible : true,
//	condtionFields : ['CJR_ID',{
//		name : 'cfe',
//		text : '开始日期',
//		dataType : 'date'
//	},{
//		name : 'dw',
//		text : 'sdf',
//		translateType:'LOAN_00001'
//	}],
	fieldFn : function(A,B,C,D,E,F,G,H,I,J){
		return [A,B,C,D,E,F,G,H,I,J];
	}
};


var createView = true;
var editView = true;
var detailView = false;

var formViewers = [{
	fields : ['CONT_ID','CONT_NO','CONT_NAME','CUST_ID','CUST_NAME','FROM_CONT_ID','APPROVE_STAT','CONT_STAT','CJR_ID','CJR_NAME','FK_AREA','FK_AREA_NAME','PRODUCT_ID','FK_ACCOUNT','FK_DATE','FK_AMT','FK_TERM','INT_YEAR','TOTAL_BJ','SS_BJ','TOTAL_INT','ACT_INT','XYPG_RATE','Y_XYPG_FEE','S_XYPG_FEE','EXE_DUE_DAYS','PLAN_DUE_DAYS','IF_XYGL_FEE','Y_XYGL','S_XYGL','C_XYGL','IF_DUE_INT','DUE_RATE','Y_DUE_INT','S_DUE_INT','C_DUE_INT','IF_XGZNJ','XGZNJ_RATE','Y_XGZNJ','S_XGZNJ','C_XGZNJ','CEZFY','YSHKZJE','SSHKZJE','CKCE','CKZ','IF_FP','MEMO','CREATE_DATE','CREATE_USER'],
	fn : function(CONT_ID,CONT_NO,CONT_NAME,CUST_ID,CUST_NAME,FROM_CONT_ID,APPROVE_STAT,CONT_STAT,CJR_ID,CJR_NAME,FK_AREA,FK_AREA_NAME,PRODUCT_ID,FK_ACCOUNT,FK_DATE,FK_AMT,FK_TERM,INT_YEAR,TOTAL_BJ,SS_BJ,TOTAL_INT,ACT_INT,XYPG_RATE,Y_XYPG_FEE,S_XYPG_FEE,EXE_DUE_DAYS,PLAN_DUE_DAYS,IF_XYGL_FEE,Y_XYGL,S_XYGL,C_XYGL,IF_DUE_INT,DUE_RATE,Y_DUE_INT,S_DUE_INT,C_DUE_INT,IF_XGZNJ,XGZNJ_RATE,Y_XGZNJ,S_XGZNJ,C_XGZNJ,CEZFY,YSHKZJE,SSHKZJE,CKCE,CKZ,IF_FP,MEMO,CREATE_DATE,CREATE_USER){
		return [CONT_ID,CONT_NO,CONT_NAME,CUST_ID,CUST_NAME,FROM_CONT_ID,APPROVE_STAT,CONT_STAT,CJR_ID,CJR_NAME,FK_AREA,FK_AREA_NAME,PRODUCT_ID,FK_ACCOUNT,FK_DATE,FK_AMT,FK_TERM,INT_YEAR,TOTAL_BJ,SS_BJ,TOTAL_INT,ACT_INT,XYPG_RATE,Y_XYPG_FEE,S_XYPG_FEE,EXE_DUE_DAYS,PLAN_DUE_DAYS,IF_XYGL_FEE,Y_XYGL,S_XYGL,C_XYGL,IF_DUE_INT,DUE_RATE,Y_DUE_INT,S_DUE_INT,C_DUE_INT,IF_XGZNJ,XGZNJ_RATE,Y_XGZNJ,S_XGZNJ,C_XGZNJ,CEZFY,YSHKZJE,SSHKZJE,CKCE,CKZ,IF_FP,MEMO,CREATE_DATE,CREATE_USER];
	}
}];
formCfgs = {
		suspendFitAll : true
};
var createFormViewer = [{
	fields : ['CONT_ID','CONT_NO','CONT_NAME','PRODUCT_ID','CREATE_DATE','CREATE_USER'],
	fn :function(CONT_ID,CONT_NO,CONT_NAME,PRODUCT_ID,CREATE_DATE,CREATE_USER){
		CREATE_USER.readOnly=true;
		CREATE_USER.value=JsContext._userId;
		CREATE_DATE.readOnly=true;
		CREATE_DATE.value=new Date();
		return [CONT_ID,CONT_NO,CONT_NAME,PRODUCT_ID,CREATE_DATE,CREATE_USER];
	}
},{
	fields : ['CUST_ID','CUST_NAME','IDENT_NO','MANAGER','FK_AREA','FK_AREA_NAME','FK_ACCOUNT','INDUSTRY'],
	fn :function(CUST_ID,CUST_NAME,IDENT_NO,MANAGER,FK_AREA,FK_AREA_NAME,FK_ACCOUNT,INDUSTRY){
		return [CUST_ID,CUST_NAME,IDENT_NO,MANAGER,FK_AREA,FK_AREA_NAME,FK_ACCOUNT,INDUSTRY];
	}
},{
	fields : ['FROM_CONT_ID','APPROVE_STAT','CONT_STAT'],
	fn : function(FROM_CONT_ID,APPROVE_STAT,CONT_STAT){
		APPROVE_STAT.value = 1;
		CONT_STAT.value=0;
		return [FROM_CONT_ID,APPROVE_STAT,CONT_STAT];
	}
},{
	fields : ['CJR_ID','CJR_NAME'],
	fn : function(CJR_ID,CJR_NAME){
		return [CJR_ID,CJR_NAME];
	}
},{
	fields : ['FK_DATE','FK_AMT','FK_TERM','INT_YEAR','TOTAL_BJ','TOTAL_INT','ACT_INT','XYPG_RATE','Y_XYPG_FEE','S_XYPG_FEE','IF_XYGL_FEE','XYGL_RATE','IF_DUE_INT','DUE_RATE','IF_XGZNJ','XGZNJ_RATE','IF_FP','MEMO'],
	fn : function(FK_DATE,FK_AMT,FK_TERM,INT_YEAR,TOTAL_BJ,TOTAL_INT,ACT_INT,XYPG_RATE,Y_XYPG_FEE,S_XYPG_FEE,IF_XYGL_FEE,XYGL_RATE,IF_DUE_INT,DUE_RATE,IF_XGZNJ,XGZNJ_RATE,IF_FP,MEMO){
		return [FK_DATE,FK_AMT,FK_TERM,INT_YEAR,TOTAL_BJ,TOTAL_INT,ACT_INT,XYPG_RATE,Y_XYPG_FEE,S_XYPG_FEE,IF_XYGL_FEE,XYGL_RATE,IF_DUE_INT,DUE_RATE,IF_XGZNJ,XGZNJ_RATE,IF_FP,MEMO];
	}
}];


createLinkages = {
	PRODUCT_ID : {
		fields : ['CONT_ID'],
		fn : function(PRODUCT_ID, CONT_ID){
			var produtList = ['10086','10087','10088'];
			if(produtList.indexOf(PRODUCT_ID.getValue())<0){
				return false;
			}
			loan.contract.form.setProductId.call(getCreateView().contentPanel,PRODUCT_ID.getValue());
			var form = getCreateView().contentPanel.getForm();
			if(PRODUCT_ID.getValue() == '10086'){
				form.findField('INT_YEAR').setValue(loan.util.config.rateYearA);
				form.findField('XYPG_RATE').setValue(loan.util.config.XYPGFLA);
			}else if (PRODUCT_ID.getValue() == '10087'){
				form.findField('INT_YEAR').setValue(loan.util.config.rateYearB);
				form.findField('XYPG_RATE').setValue(loan.util.config.XYPGFLB);
			}else if(PRODUCT_ID.getValue() == '10088'){
				form.findField('INT_YEAR').setValue(loan.util.config.rateYearC);
				form.findField('XYPG_RATE').setValue(loan.util.config.XYPGFLC);
			}
		}
	}
};


var tbar = [{
	text : '创建还款计划',
	handler : function(){
		if(!getSelectedData()){
			Ext.Msg.alert('提示','请选择一条合同记录！');
			return false;
		}
	
		Ext.Ajax.request({
			url : basepath+'/loanfcontract!getIfHKPlan.json',
			method : 'get',
			params : {
				CONT_ID : getSelectedData().get('CONT_ID')
			},
			success : function(r){
				var pc = parseInt(Ext.decode(r.responseText).data[0].PC);
				if(pc<1){
					Ext.Ajax.request({
						url : basepath+'/loanfcontract!craateHKPlan.json',
						method : 'get',
						params : {
							CONT_ID : getSelectedData().get('CONT_ID')
						},
						success : function(r){},
						failure : function(r){}
					});
					
					Ext.Msg.alert('提示','创建还款计划！');
					return true;
				}else{
					Ext.Msg.alert('提示','该合同已有还款计划，请勿重复创建！');
					return false;
				}
			},
			failure : function(r){
				Ext.Msg.alert('提示','获取还款计划信息失败，请稍后重试！');
				return false;
			}
		});
	}
}];

var customerView = [{
	title : '还款计划',
	type : 'grid',
	url : basepath + '/loanfhkplan.json',
	fields : {
		fields : [
		    {name:'ID',text:'序号'},
			{name:'CONT_ID',text:'合同编号',searchField : true},
			{name:'HK_TEAM_NO',text:'还款期'},
			{name:'PLAN_DATE',text:'计划还款日期'},
			{name:'EXE_DATE',text:'执行还款日期'},
			{name:'ACT_DATE',text:'实际还款日'},
			{name:'XYGL_RATE',text:'信用管理费率'},
			{name:'Y_XYGL',text:'应收信用管理费'},
			{name:'S_XYGL',text:'实收信用管理费'},
			{name:'R_XYGL',text:'减免后信用管理费'},
			{name:'C_XYGL',text:'差额信用管理费'},
			{name:'XGZNJ_RATE',text:'信用管理费滞纳金率'},
			{name:'Y_XGZNJ',text:'应收信用管理费滞纳金'},
			{name:'S_XGZNJ',text:'实收信用管理费滞纳金'},
			{name:'R_XGZNJ',text:'减免后应收信用管理费滞纳金'},
			{name:'C_XGZNJ',text:'差额信用管理费滞纳金'},
			{name:'EXE_DUE_DAYS',text:'执行逾期天数'},
			{name:'PLAN_DUE_DAYS',text:'计息逾期天数'},
			{name:'DUE_RATE',text:'逾期利息率'},
			{name:'Y_DUE_INT',text:'应收逾期利息费'},
			{name:'S_DUE_INT',text:'实收逾期利息费'},
			{name:'R_DUE_INT',text:'减免后应收逾期利息费'},
			{name:'C_DUE_INT',text:'差额逾期利息费'},
			{name:'C_TOTAL_FEE',text:'差额总费用'},
			{name:'Y_BJ',text:'应还本金'},
			{name:'S_BJ',text:'实收本金'},
			{name:'Y_INT',text:'应收利息'},
			{name:'S_INT',text:'实收利息'},
			{name:'REF',text:'参考值'},
			{name:'TODO_AMT',text:'当期应还金额'},
			{name:'DONE_AMT',text:'当期实收金额'},
			{name:'CHA_AMT',text:'当期实收金额'},
			{name:'HK_STAT',text:'还款状态（正常、逾期）'},
			{name:'MEMO',text:'还款状态（正常、逾期）'}],
		fn :function(ID,CONT_ID,HK_TEAM_NO,PLAN_DATE,EXE_DATE,ACT_DATE,XYGL_RATE,Y_XYGL,S_XYGL,R_XYGL,C_XYGL,XGZNJ_RATE,Y_XGZNJ,S_XGZNJ,R_XGZNJ,C_XGZNJ,EXE_DUE_DAYS,PLAN_DUE_DAYS,DUE_RATE,Y_DUE_INT,S_DUE_INT,R_DUE_INT,C_DUE_INT,C_TOTAL_FEE,Y_BJ,S_BJ,Y_INT,S_INT,REF,TODO_AMT,DONE_AMT,CHA_AMT,HK_STAT,MEMO){
			return [ID,CONT_ID,HK_TEAM_NO,PLAN_DATE,EXE_DATE,ACT_DATE,XYGL_RATE,Y_XYGL,S_XYGL,R_XYGL,C_XYGL,XGZNJ_RATE,Y_XGZNJ,S_XGZNJ,R_XGZNJ,C_XGZNJ,EXE_DUE_DAYS,PLAN_DUE_DAYS,DUE_RATE,Y_DUE_INT,S_DUE_INT,R_DUE_INT,C_DUE_INT,C_TOTAL_FEE,Y_BJ,S_BJ,Y_INT,S_INT,REF,TODO_AMT,DONE_AMT,CHA_AMT,HK_STAT,MEMO];
		}
	}
}];

viewshow = function(view){
	if(view == getCustomerViewByTitle('还款计划')){
		view.store.load({
			params : {
				condition : Ext.encode({
					CONT_ID : getSelectedData().get('CONT_ID')
				})
			}
		});
	}else if(view == getEditView()){
		loan.contract.form.setProductId.call(view.contentPanel,getSelectedData().get('PRODUCT_ID'));
	}else if(view == getCreateView()){
		loan.contract.form.setProductId.call(view.contentPanel,false);
	}else if(view == getCustomerViewByTitle('信审部合同分配')){
		var selects = getAllSelects();
		var ids = '';
		var names = '';
		Ext.each(selects , function(data){
			ids += data.get('CONT_ID')+',';
			names += data.get('CONT_NAME')+',';
		});
		view.setValues({
			CONT_ID : ids,
			CONT_NAME : names
		});
	}
};

recordselect = function(){
	if(getCurrentView() === getCustomerViewByTitle('信审部合同分配')){
		var view = etCustomerViewByTitle('信审部合同分配');
		var selects = getAllSelects();
		var ids = '';
		var names = '';
		Ext.each(selects , function(data){
			ids += data.get('CONT_ID')+',';
			names += data.get('CONT_NAME')+',';
		});
		view.setValues({
			CONT_NAME : names,
			CONT_ID : ids
		});
	}
};
