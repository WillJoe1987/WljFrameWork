imports([
	'/contents/pages/loanCommon/wlj.common.loan.ContractChooser.js',
	'/contents/pages/wlj/loanManager/loan.util.js'
]);
Wlj.frame.functions.app.widgets.ResultContainer.prototype.createViewText = '新增分配关系';
Wlj.frame.functions.app.widgets.ResultContainer.prototype.editViewText = '修改分配关系';
url=basepath+'/loanfcontractbelong.json';

lookupTypes = ['LOAN_CONTRACT_BELONG_TYPE',{
	TYPE : 'USER',
	url : '/usermanagequery.json',
	key : 'ACCOUNT_NAME',
	value : 'USER_NAME',
	jsonRoot : 'json.data',
	autoLoadItems : false
}];

fields = [{name:'BELONG_ID',text:'归属ID',hidden:true},
          {name:'BELONG_TYPE',text:'部门', translateType:'LOAN_CONTRACT_BELONG_TYPE',allowBlank :false},
          {name:'CONT_ID',text:'合同ID',hidden:true},
          {name:'CONT_NAME',text:'合同名称',searchField:true,xtype:'loancustomerchooser',hiddenName:'CONT_ID',allowBlank :false},
          {name:'BELONG_USER',text:'归属人',translateType:'USER',hidden:true,allowBlank :false},
          {name:'BELONG_USER_NAME', text:'归属人' },
          {name:'ASSIGN_DATE',text:'分配日期',dataType:'date'},
          {name:'ASSIGN_USER',text:'分配人',hidden:true},
          {name:'ASSIGN_USER_NAME',text:'分配人'}];

searchDomainCfg = {
	title : '查询条件',
	fieldFn : function(CONT_NAME){
		CONT_NAME.singleSelected = true;
		return [CONT_NAME];
	}
};

var createView = true;
var editView = true;
var detailView = false;

var editFormViewer = [{
	fields : ['BELONG_ID','CONT_NAME','CONT_ID','BELONG_TYPE','BELONG_USER','BELONG_USER_NAME'],
	fn : function(BELONG_ID,CONT_NAME,CONT_ID,BELONG_TYPE,BELONG_USER,BELONG_USER_NAME){
		BELONG_USER_NAME.hidden = true;
		BELONG_USER.hidden = false;
		BELONG_TYPE.readOnly = true;
		CONT_NAME.xtype = 'textfield';
		CONT_NAME.readOnly = true;
		//CONT_NAME.findType = 2;
		return [BELONG_ID,BELONG_TYPE,CONT_NAME,CONT_ID,BELONG_USER,BELONG_USER_NAME];
	}
},{
	fields : ['ASSIGN_DATE','ASSIGN_USER','ASSIGN_USER_NAME'],
	fn : function(ASSIGN_DATE,ASSIGN_USER,ASSIGN_USER_NAME){
		ASSIGN_USER_NAME.readOnly = true;
		ASSIGN_DATE.readOnly = true;
		ASSIGN_USER.readOnly = true;
		ASSIGN_DATE.text = '当前修改日期';
		ASSIGN_USER_NAME.text = '当前修改人';
		return [ASSIGN_DATE,ASSIGN_USER,ASSIGN_USER_NAME];
	}
}];

var createFormViewer = [{
	fields : ['BELONG_ID','CONT_NAME','CONT_ID','BELONG_TYPE','BELONG_USER','BELONG_USER_NAME'],
	fn : function(BELONG_ID,CONT_NAME,CONT_ID,BELONG_TYPE,BELONG_USER,BELONG_USER_NAME){
		BELONG_USER_NAME.hidden = true;
		BELONG_USER.hidden = false;
		CONT_NAME.findType = 2;
		return [BELONG_ID,BELONG_TYPE,CONT_NAME,CONT_ID,BELONG_USER,BELONG_USER_NAME];
	}
},{
	fields : ['ASSIGN_DATE','ASSIGN_USER','ASSIGN_USER_NAME'],
	fn : function(ASSIGN_DATE,ASSIGN_USER,ASSIGN_USER_NAME){
		ASSIGN_DATE.value = new Date();
		ASSIGN_USER.value = JsContext._userId;
		ASSIGN_USER_NAME.value =  JsContext._username;
		ASSIGN_USER_NAME.readOnly = true;
		ASSIGN_DATE.readOnly = true;
		ASSIGN_USER.readOnly = true;
		return [ASSIGN_DATE,ASSIGN_USER,ASSIGN_USER_NAME];
	}
}];

linkages = {
	BELONG_TYPE	: {
		fields : ['BELONG_USER','BELONG_USER_NAME', 'CONT_NAME'],
		fn : function(BELONG_TYPE,BELONG_USER,BELONG_USER_NAME,CONT_NAME){
			var belongOrg = loan.util.orgDepartmentIds.findByBelongType(BELONG_TYPE.getValue());
			CONT_NAME.belongType = BELONG_TYPE.getValue();
			if(belongOrg){
				BELONG_USER.setValue(null);
				BELONG_USER_NAME.setValue(null);
				CONT_NAME.setReadOnly(false);
				BELONG_USER.setReadOnly(false);
				reloadLookup('USER',{
					params : {
						condition : Ext.encode({
							ORG_ID : belongOrg
						})
					}
				});
			}else{
				BELONG_USER.setValue(null);
				BELONG_USER_NAME.setValue(null);
				CONT_NAME.setReadOnly(true);
				BELONG_USER.setReadOnly(true);
			}
		}
	},
	BELONG_USER : {
		fields : ['BELONG_USER_NAME'],
		fn : function(BELONG_USER,BELONG_USER_NAME){
			BELONG_USER_NAME.setValue(BELONG_USER.getRawValue());
		}
	}
};
viewshow = function(view){
	if(view==getCreateView()){
		var CONT_NAME = view.contentPanel.getForm().findField('CONT_NAME');
		var BELONG_USER = view.contentPanel.getForm().findField('BELONG_USER');
		CONT_NAME.setReadOnly(true);
		BELONG_USER.setReadOnly(true);
	}else if(view = getEditView()){
		var BELONG_TYPE = view.contentPanel.getForm().findField('BELONG_TYPE');
		var ASSIGN_DATE = view.contentPanel.getForm().findField('ASSIGN_DATE');
		var ASSIGN_USER = view.contentPanel.getForm().findField('ASSIGN_USER');
		var ASSIGN_USER_NAME = view.contentPanel.getForm().findField('ASSIGN_USER_NAME');
		var belongOrg = loan.util.orgDepartmentIds.findByBelongType(BELONG_TYPE.getValue());
		reloadLookup('USER',{
			params : {
				condition : Ext.encode({
					ORG_ID : belongOrg
				})
			}
		});
		ASSIGN_DATE.value = new Date();
		ASSIGN_USER.value = JsContext._userId;
		ASSIGN_USER_NAME.value =  JsContext._username;
		
		
	}
};