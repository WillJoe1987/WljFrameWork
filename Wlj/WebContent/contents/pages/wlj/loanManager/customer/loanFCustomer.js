
imports([
	'/contents/pages/wlj/loanManager/loanWidgetsOnce.js',
	'/contents/pages/wlj/loanManager/loan.util.js'
]);
Wlj.frame.functions.app.widgets.ResultContainer.prototype.editViewText = '客户视图';

/**
 * 导入
 */
var url = basepath + '/loanfcustomer.json';

lookupTypes = ['IF_XD','FXQ020','LOAN_CUST_TYPE',{
	TYPE : 'USER',
	url : '/usermanagequery.json',
	key : 'ACCOUNT_NAME',
	value : 'USER_NAME',
	jsonRoot : 'json.data',
	autoLoadItems : false
},{
	TYPE : 'ORG',
	url : '/systemUnit-query.json',
	key : 'ORG_ID',
	value : 'ORG_NAME',
	jsonRoot : 'json.data'
}];


var fields = [
              {name:'CUST_ID',text:'客户编号',hidden:true},
              {name:'CUST_NAME',text:'客户名称',searchField:true,allowBlank:false},
              {name:'IDENT_TYPE',text:'证件类型',hidden:true},
              {name:'IDENT_NO',text:'证件号码',searchField:true,allowBlank:false},
              {name:'CUST_TYPE',text:'客户类型',translateType:'LOAN_CUST_TYPE',hidden:true},
              {name:'ORG_ID',text:'地区',translateType:'ORG',searchField:true,allowBlank:false},
              {name:'ORG_NAME',text:'地区名称',hidden:true},
              {name:'MANAGER',text:'客户经理',translateType:'USER',searchField:true,allowBlank:false},
              {name:'MANAGER_NAME',text:'客户经理姓名',hidden:true},
              {name:'IF_XD',text:'是否续贷客户',translateType:'IF_XD',searchField:true},
              {name:'INDUSTRY', text : '行业', gridField : false,translateType:'FXQ020'},
              {name:'CREATOR', text : '创建人',translateType:'USER'},
              {name:'CREATE_DATE',text:'创建日期',dataType:'date'}
              ];


var createView = true;
var editView = true;
var detailView = false;

var formViewers = [{
	fields : ['CUST_ID','CUST_NAME','IDENT_TYPE','IDENT_NO','CUST_TYPE','ORG_ID','ORG_NAME','MANAGER','MANAGER_NAME','IF_XD','INDUSTRY','CREATOR','CREATE_DATE'],
	fn : function(CUST_ID,CUST_NAME,IDENT_TYPE,IDENT_NO,CUST_TYPE,ORG_ID,ORG_NAME,MANAGER,MANAGER_NAME,IF_XD,INDUSTRY,CREATOR,CREATE_DATE){
		IDENT_TYPE.hidden=true;
		CREATE_DATE.readOnly=true;
		CREATOR.readOnly=true;
		return [CUST_ID,CUST_NAME,IDENT_TYPE,IDENT_NO,CUST_TYPE,ORG_ID,ORG_NAME,MANAGER,MANAGER_NAME,IF_XD,INDUSTRY,CREATOR,CREATE_DATE];
	}
}];

var createFormViewer = [{
	fields : ['CUST_ID','CUST_NAME','IDENT_TYPE','IDENT_NO','CUST_TYPE','ORG_ID','ORG_NAME','MANAGER','MANAGER_NAME','IF_XD','INDUSTRY','CREATOR','CREATE_DATE'],
	fn : function(CUST_ID,CUST_NAME,IDENT_TYPE,IDENT_NO,CUST_TYPE,ORG_ID,ORG_NAME,MANAGER,MANAGER_NAME,IF_XD,INDUSTRY,CREATOR,CREATE_DATE){
		CUST_ID.hidden=true;
		CREATOR.readOnly=true;
		CREATOR.value=JsContext._userId;
		ORG_ID.editable = true;
		CREATE_DATE.readOnly=true;
		CUST_TYPE.hidden=true;
		CREATE_DATE.value=new Date();
		CUST_TYPE.value=0;
		IDENT_TYPE.hidden=true;
		return [CUST_ID,CUST_NAME,IDENT_TYPE,IDENT_NO,CUST_TYPE,ORG_ID,ORG_NAME,MANAGER,MANAGER_NAME,IF_XD,INDUSTRY,CREATOR,CREATE_DATE];
	}
}];

linkages = {
		ORG_ID : { 
			fields : ['MANAGER'],
			fn : function(ORG_ID, MANAGER){
				MANAGER.setValue(null);
				var orgId = ORG_ID.getValue();
				reloadLookup('USER',{
					params : {
						condition : Ext.encode({
							ORG_ID : orgId
						})
					}
				});
			}
		}
};

var customerView = [{
	title : '合同列表',
	items : [loan.contract.container],
	assistantView : {
		layout : 'fit',
		title : '还款计划',
		items : [loan.contract.hkplanGrid],
		frame : true
	}
}];

viewshow = function(view){
	if(view == getCustomerViewByTitle('合同列表')){
		loan.contract.store.reload({
			params : {
				condition : Ext.encode({
					CUST_ID : getSelectedData().get('CUST_ID')
				})
			},
			callback : function(){
				loan.contract.grid.getSelectionModel().selectFirstRow();
			}
		});
	}if(view == getEditView()){
		var ORG_ID = view.contentPanel.getForm().findField('ORG_ID');
		var MANAGER = view.contentPanel.getForm().findField('MANAGER');
		var orgId = ORG_ID.getValue();
		reloadLookup('USER',{
			params : {
				condition : Ext.encode({
					ORG_ID : orgId
				})
			}
		});
	}
};
beforesetsearchparams = function(params){
	params.CUST_TYPE = '0';
	return true;
};
