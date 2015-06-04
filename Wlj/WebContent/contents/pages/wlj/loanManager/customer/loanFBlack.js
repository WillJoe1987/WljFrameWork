imports([
         '/contents/pages/loanCommon/wlj.common.loan.CustomerChooser.js'
]);
url = basepath+'/loanfblack.json';

Wlj.frame.functions.app.widgets.ResultContainer.prototype.createViewText = '添加黑名单客户';

lookupTypes = ['LOAN_CUST_BLACK_STAT','LOAN_00001'];

fields = [{name:'ID',text:'序号',hidden : true},
          {name:'CUST_NAME',text:'客户名称',xtype: 'loancustomerchooser',searchField:true,hiddenName:'CUST_ID',singleSelected:true,allowBlank:false},
          {name:'CUST_ID',text:'客户编号',allowBlank:false},
          {name:'IDENT_TYPE',text:'证件类型',hidden:true},
          {name:'IDENT_NO',text:'证件号',allowBlank:false},
          {name:'BLACK_STAT',text:'黑名单状态',translateType:'LOAN_CUST_BLACK_STAT'},
          {name:'REASON',text:'原因'},
          {name:'APPROVE_STAT',text:'审批状态',translateType: 'LOAN_00001'},
          {name:'COMMIT_USER',text:'提交人'},
          {name:'COMMIT_USER_NAME',text:'提交人'},
          {name:'COMMIT_DATE',text:'提交日期',dataType:'date'}];

var createView = true;
var editView = false;
var detailView = false;

createFormViewer = [{
	fields : ['ID','CUST_ID','CUST_NAME','IDENT_TYPE','IDENT_NO'],
	fn : function(ID,CUST_ID,CUST_NAME,IDENT_TYPE,IDENT_NO){
		CUST_ID.readOnly = true;
		IDENT_NO.readOnly = true;
		CUST_NAME.callback = function(field, selects){
			if(Ext.isArray(selects) && selects.length>0){
				getCurrentView().contentPanel.getForm().findField("IDENT_NO").setValue(selects[0].get("IDENT_NO"));
			}else{
				getCurrentView().contentPanel.getForm().findField("IDENT_NO").setValue(null);
			}
		};
		return [ID,CUST_NAME,CUST_ID,IDENT_TYPE,IDENT_NO];
	}
},{
	fields : ['BLACK_STAT','APPROVE_STAT'],
	fn : function(BLACK_STAT,APPROVE_STAT){
		BLACK_STAT.value = '0';
		APPROVE_STAT.value = 1;
		APPROVE_STAT.readOnly = true;
		return [BLACK_STAT,APPROVE_STAT];
	}
},{
	columnCount : 1,
	fields : ['REASON'],
	fn : function(REASON){
		REASON.xtype = 'textarea';
		return [REASON];
	}
},{
	fields : ['COMMIT_USER','COMMIT_USER_NAME','COMMIT_DATE'],
	fn : function(COMMIT_USER,COMMIT_USER_NAME,COMMIT_DATE){
		COMMIT_USER.hidden = true;
		COMMIT_DATE.value = new Date();
		COMMIT_USER.value = JsContext._userId;
		COMMIT_USER_NAME.value =  JsContext._username;
		COMMIT_USER_NAME.readOnly = true;
		COMMIT_DATE.readOnly = true;
		return [COMMIT_USER,COMMIT_USER_NAME,COMMIT_DATE];
	}
}];


tbar = [{
	text : '移除黑名单客户',
	handler : function(){
		if(!hasSelected()){
			Ext.Msg.alert("提示","请至少选择一条记录移除！");
			return false;
		}
		var selects= getAllSelects();
		Ext.debug(selects.length);
		var idStr = [];
		Ext.each(selects, function(s){
			Ext.debug(s.get("ID"));
			idStr.push(s.get("ID"));
		});
		comitData({
			id_Str : idStr.join(',')
		},basepath+'/loanfblack!batchDestroy.json');
	}
}];