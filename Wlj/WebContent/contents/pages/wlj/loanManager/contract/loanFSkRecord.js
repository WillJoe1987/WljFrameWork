/**
 * 收款查询
 */

lookupTypes = ['LOAN_00001',{
			TYPE : 'CONTRACTS',
			url : '/loanfcontract.json',
			key : 'CONT_ID',
			value : 'CONT_NO',
			jsonRoot : 'json.data'
}];

url = basepath+'/loanfskrecord.json';

fields = [{name:'ID',text:'流水号'},
          {name:'CONT_ID',text:'合同编号',searchField:true,translateType : 'CONTRACTS',editable :true},
          {name:'SK_DATE',text:'收款日期',dataType:'date',readOnly : true},
          {name:'SK_AMT',text:'收款金额',dataType:'money'},
          {name:'SK_USER',text:'收款人'},
          {name:'SK_USER_NAME',text:'收款人名称'},
          {name:'APPROVE_STAT',text:'审核状态',translateType : 'LOAN_00001'},
          {name:'MAX_REBACK',text:'最大还款额度',xtype:'displayfield'}
          ];

var createView = true;
var editView = true;
var detailView = false;

var formViewers = [{
	fields : ['ID','SK_DATE','SK_USER','SK_USER_NAME','APPROVE_STAT'],
	fn : function(ID,SK_DATE,SK_USER,SK_USER_NAME,APPROVE_STAT){
		ID.readOnly=true;
		SK_DATE.readOnly=true;
		SK_USER.readOnly=true;
		SK_USER_NAME.readOnly=true;
		APPROVE_STAT.readOnly=true;
		SK_USER.value=JsContext._userId;
		SK_USER_NAME.value = JsContext._username;
		APPROVE_STAT.value = '1';
		return [ID,SK_DATE,SK_USER,SK_USER_NAME,APPROVE_STAT];
	}
},{
	fields : ['CONT_ID','SK_AMT'],
	fn : function(CONT_ID,SK_AMT){
		return [CONT_ID,SK_AMT];
	}
},{
	columnCount : 1,
	fields : ['MAX_REBACK'],
	fn : function(MAX_REBACK){
		return [MAX_REBACK];
	}
}];



createLinkages = {
	CONT_ID : {
		fields : ['MAX_REBACK'],
		fn : function(CONT_ID,MAX_REBACK){
			Ext.Ajax.request({
				url : basepath + '/loanfskrecord!getMaxReback.json',
				method : 'get',
				params : {
					condition : Ext.encode({
						CONT_ID :CONT_ID.getValue()
					})
				},
				success : function(response){
					var maxReback = Ext.decode(response.responseText).maxReback;
					getCreateView().maxReback = maxReback;
					if(maxReback>0){
						MAX_REBACK.setValue('该合同最大还款额度为【<font color=red>'+maxReback+'</font>】,还款金额请勿超过该额度！');
					}else{
						MAX_REBACK.setValue('该合同最大还款额度为【<font color=red>'+maxReback+'</font>】,已无法追加还款！');
					}
				},
				failure : function(){
					MAX_REBACK.setValue('未查询到该合同剩余最大还款额度！');
				}
			});
		}
	}
};

beforeviewshow = function(view){
	if(view == getEditView()){
		if(!getSelectedData()){
			Ext.Msg.alert("提示",'请选择一条还款记录修改！');
			return false;
		}
		if(getSelectedData().get('APPROVE_STAT')=='3'){
			Ext.Msg.alert("提示",'已审核还款记录不能修改！');
			return false;
		}
	}
};

beforevalidate = function(view, panel){
	if(view.maxReback){
		var SKAMT = panel.getForm().findField('SK_AMT');
		if(SKAMT){
			if(SKAMT.getValue()){
				if(view.maxReback < SKAMT.getValue()){
					Ext.Msg.alert('提示','还款金额超出最大还款金额，请重新输入！');
					SKAMT.setValue(0);
					return false;
				}
			}else if(SKAMT.getValue() == 0){
				Ext.Msg.alert('提示','还款金额为0，请重新输入！');
				SKAMT.setValue(0);
				return false;
			}else{
				Ext.Msg.alert('提示','无还款金额，请重新输入！');
				SKAMT.setValue(0);
				return false;
			}
		}
	}else if(view.maxReback == 0){
		Ext.Msg.alert('提示','该合同已结清！');
		SKAMT.setValue(0);
		return false;
	}
};

viewshow = function(view){
	if(view == getCreateView()){
		view.maxReback = false;
		getCreateView().contentPanel.getForm().setValues({
			MAX_REBACK:''
		});
		Ext.Msg.alert('提示','流水号获取失败，请稍后重试！');
		/*Ext.Ajax.request({
			url : basepath + '/skls!getLSLong.json',
			method : 'get',
			success : function(response){
				var ids = Ext.decode(response.responseText).LSLong;
				getCreateView().contentPanel.getForm().setValues({
					ID : ids.split("$")[0],
					SK_DATE : ids.split("$")[1]
				});
			},
			failure : function(){
				Ext.Msg.alert('提示','流水号获取失败，请稍后重试！');
				hideCurrentView();
			}
		});*/
	}else if(view == getEditView()){
		view.maxReback = false;
		var CONT_ID = view.contentPanel.getForm().findField('CONT_ID');
		var MAX_REBACK = view.contentPanel.getForm().findField('MAX_REBACK');
		MAX_REBACK.setValue('未查询到该合同剩余最大还款额度！');
		/*Ext.Ajax.request({
			url : basepath + '/loanfskrecord!getMaxReback.json',
			method : 'get',
			params : {
				condition : Ext.encode({
					CONT_ID :CONT_ID.getValue()
				})
			},
			success : function(response){
				var maxReback = Ext.decode(response.responseText).maxReback;
				view.maxReback = maxReback;
				if(maxReback>0){
					MAX_REBACK.setValue('该合同最大还款额度为【<font color=red>'+maxReback+'</font>】,还款金额请勿超过该额度！');
				}else{
					MAX_REBACK.setValue('该合同最大还款额度为【<font color=red>'+maxReback+'</font>】,已无法追加还款！');
				}
			},
			failure : function(){
				MAX_REBACK.setValue('未查询到该合同剩余最大还款额度！');
			}
		});*/
	}
};
tbar = [{
	text : '提交审核',
	handler : function(){
		if(!getSelectedData()){
			Ext.Msg.alert('提示','请选择需要审批的收款记录');
			return false;
		}
		if(getSelectedData().get('APPROVE_STAT')=='3'){
			Ext.Msg.alert('提示','该记录已审批通过，请勿重复提交！');
			return false;
		}
		Ext.Ajax.request({
			url : basepath + '/loanfskrecord!submitToWF.json',
			method : 'get',
			params : {
				condition : Ext.encode({
					ID : getSelectedData().get("ID")
				})
			},
			success :function(reuset){
				Ext.Msg.alert('提示','提交成功,待审批！');
			}
		});
	}
}];