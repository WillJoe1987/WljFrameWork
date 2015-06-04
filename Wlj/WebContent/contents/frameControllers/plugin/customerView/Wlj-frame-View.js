/***
 * 视图管理类
 * 
 */
(function(){
ViewMgr = function(){
	 //TODO 初始化设置
};
/***
 * 校验客户是否存在
 * @param cfg
 * @return
 */
ViewMgr.prototype.validatorCustomer = function(cfg){
	var flag = true;
	if (cfg.validator == true) {
		Wlj.SyncAjax.request({
			url :  basepath + '/PerCustomerBaseQueryAction.json?custId='+cfg.viewId,
			method : 'GET',
			success : function(response) {
				var customerData = Ext.util.JSON.decode(response.responseText).json.data;
				if(customerData.length < 1) {
					flag = false;
				}
			},
			failure : function() {
				Ext.MessageBox.alert("提示","校验客户是否存在失败！");
				flag = false;
			}
		});
	}
	return flag;
};
ViewMgr.prototype.openView = function(cfg){
	var _this = this;
	if(cfg.viewId == null || cfg.viewId == '' || cfg.viewId == undefined || cfg.viewId == 'null') {
		Ext.MessageBox.alert("提示","请设置视图ID值！");
		return;
	}
	
	var viewId = cfg.viewId;
	if(cfg.viewName == null) {
		cfg.viewName = '客户视图';
	}
			
	if(cfg.viewType == 'CUST' || cfg.viewType == null || cfg.viewType == '' || cfg.viewId == undefined || cfg.viewId == 'null') {
		cfg._custId = cfg.viewId;
		cfg.viewType = 'CUST';
		if(!_this.validatorCustomer(cfg)) {
			Ext.MessageBox.alert("提示","请检查客户是否存在:客户ID=["+cfg.viewId+"]！");
			return ;
		}
	} else if(cfg.viewType == 'PROD') {
		cfg._prodId = cfg.viewId;
	}
	var params = Ext.urlEncode(cfg);
	parent._APP.openWindow({
		name : '客户视图：' + viewId,
		action : basepath + '/contents/frameControllers/plugin/customerView/customerView.jsp?' + params,
		resId : 'view_' + viewId,
		id : 'task_'+viewId
	});
};
window.Wlj.viewMgr = new ViewMgr();
window.openCustomerView = function(cfg){
	if(typeof cfg === "string"){
		window.Wlj.viewMgr.openView({
			viewId : cfg
		});
	}else{
		if(!cfg || !cfg.viewId){
			return false;
		}else{
			window.Wlj.viewMgr.openView(cfg);
		}
	}
	
};
})();
