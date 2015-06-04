//销售部客户分配


Wlj.frame.functions.app.widgets.ResultContainer.prototype.editViewText = '分配客户经理';
var url = basepath + '/loanfcustomer.json';
var commitUrl = basepath + '/loanfcustomer!custBelongSv.json';
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
              {name:'CREATOR', text : '分配人',translateType:'USER'},
              {name:'CREATE_DATE',text:'分配日期',dataType:'date'}
              ];
var editView = true;

editFormViewer = [{
	fields : ['CUST_ID','CUST_NAME','IDENT_TYPE','IDENT_NO','CUST_TYPE','ORG_ID','ORG_NAME','MANAGER','MANAGER_NAME','IF_XD','INDUSTRY','CREATOR','CREATE_DATE'],
	fn : function(CUST_ID,CUST_NAME,IDENT_TYPE,IDENT_NO,CUST_TYPE,ORG_ID,ORG_NAME,MANAGER,MANAGER_NAME,IF_XD,INDUSTRY,CREATOR,CREATE_DATE){
		IF_XD.hidden=true;
		INDUSTRY.hidden=true;
		CREATOR.hidden=true;
		CREATE_DATE.hidden=true;
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
viewshow = function(view){
	if(view == getEditView()){
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