/**
 * 滞纳金减免
 */
lookupTypes = ['LOAN_00001','LOAN_ZNJ_TYPE',{
			TYPE : 'CONTRACTS',
			url : '/loanfcontract.json',
			key : 'CONT_ID',
			value : 'CONT_NO',
			jsonRoot : 'json.data'
},{
	TYPE : 'HKPLANS',
	url : '/loanfhkplan.json',
	key : 'ID',
	value : 'HK_TEAM_NO',
	autoLoadItems : false,
	jsonRoot : 'json.data'
}];

url = basepath + '/loanfznjreduce.json';
fields = [
	        {name:'ID',text:'流水号'},
	        {name:'CONT_ID',text:'合同编号',translateType:'CONTRACTS',searchField:true},
			{name:'PLAN_ID',text:'还款计划表序号',translateType:'HKPLANS'},
			{name:'ZNJ_TYPE',text:'滞纳金类型',translateType:'LOAN_ZNJ_TYPE'},
			{name:'TODO_AMT',text:'应缴滞纳金',dataType:'money'},
			{name:'REDUCE_AMT',text:'本次减免金额',dataType:'money'},
			{name:'REDUCE_USER',text:'发起人'},
			{name:'REDUCE_DATE',text:'发起日期',dataType:'date'},
			{name:'APPROVE_STAT',text:'审核状态',translateType:'LOAN_00001'}];


var createView = true;
var editView = true;
var detailView = false;

var formViewers = [{
	fields : ['ID','CONT_ID','PLAN_ID','ZNJ_TYPE','TODO_AMT','REDUCE_AMT','REDUCE_USER','REDUCE_DATE','APPROVE_STAT'],
	fn : function(ID,CONT_ID,PLAN_ID,ZNJ_TYPE,TODO_AMT,REDUCE_AMT,REDUCE_USER,REDUCE_DATE,APPROVE_STAT){
		return [ID,CONT_ID,PLAN_ID,ZNJ_TYPE,TODO_AMT,REDUCE_AMT,REDUCE_USER,REDUCE_DATE,APPROVE_STAT];
	}
}];
var createFormViewer = [{
	fields : ['ID','CONT_ID','PLAN_ID','ZNJ_TYPE','TODO_AMT','REDUCE_AMT','REDUCE_USER','REDUCE_DATE','APPROVE_STAT'],
	fn : function(ID,CONT_ID,PLAN_ID,ZNJ_TYPE,TODO_AMT,REDUCE_AMT,REDUCE_USER,REDUCE_DATE,APPROVE_STAT){
		ID.readOnly = true;
		REDUCE_USER.readOnly = true;
		REDUCE_DATE.readOnly = true;
		APPROVE_STAT.readOnly = true;
		REDUCE_USER.value = JsContext._userId;
		APPROVE_STAT.value = 1;
		return [ID,CONT_ID,PLAN_ID,ZNJ_TYPE,TODO_AMT,REDUCE_AMT,REDUCE_USER,REDUCE_DATE,APPROVE_STAT];
	}
}];
var editFormViewer = [{
	fields : ['ID','CONT_ID','PLAN_ID','ZNJ_TYPE','TODO_AMT','REDUCE_AMT','REDUCE_USER','REDUCE_DATE','APPROVE_STAT'],
	fn : function(ID,CONT_ID,PLAN_ID,ZNJ_TYPE,TODO_AMT,REDUCE_AMT,REDUCE_USER,REDUCE_DATE,APPROVE_STAT){
		ID.readOnly = true;
		REDUCE_USER.readOnly = true;
		REDUCE_DATE.readOnly = true;
		APPROVE_STAT.readOnly = true;
		return [ID,CONT_ID,PLAN_ID,ZNJ_TYPE,TODO_AMT,REDUCE_AMT,REDUCE_USER,REDUCE_DATE,APPROVE_STAT];
	}
}];


linkages = {
	CONT_ID : {
		fields : ['PLAN_ID'],
		fn : function(CONT_ID, PLAN_ID){
			var contId = CONT_ID.getValue();
			PLAN_ID.setValue(null);
			reloadLookup('HKPLANS',{
				params : {
					condition : Ext.encode({
						CONT_ID : contId
					})
				}
			});
		}
	}
};
viewshow = function(view){
	if(view == getCreateView()){
		view.maxReback = false;
		getCreateView().contentPanel.getForm().setValues({
			MAX_REBACK:''
		});
		Ext.Ajax.request({
			url : basepath + '/skls!getLSLong.json',
			method : 'get',
			success : function(response){
				var ids = Ext.decode(response.responseText).LSLong;
				getCreateView().contentPanel.getForm().setValues({
					ID : ids.split("$")[0],
					REDUCE_DATE : ids.split("$")[1]
				});
			},
			failure : function(){
				Ext.Msg.alert('提示','流水号获取失败，请稍后重试！');
				hideCurrentView();
			}
		});
	}
};

