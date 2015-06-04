(function(){
	/***
	 * 磁贴中url中请将客户id条件值拼接上
	 * 客户ID值为：_custId
	 */
	var store = new Ext.data.JsonStore({
	    url:  basepath + '/PerCustomerBaseQueryAction.json?custId='+_custId,
	    root: 'json.data',
	    fields: [
	        'CUST_ID', 'CUST_ZH_NAME', 'CUST_EN_NAME', 'CERT_TYPE', 'CERT_NUM', 'SEX_ORA', 'FOLK_ORA', 'MARRG_STATUS_ORA'
	    ]
	});
	store.load();
	var tpl = new Ext.XTemplate(
			 '<div class="yc-cvHeader">',
			 '<div class="yc-cvhContainer">',
			 '<tpl for=".">',
			 '<div class="yc-cvhUser">',
			 '<span class="yc-cvhuName">{CUST_ZH_NAME}({CUST_EN_NAME})</span>',
			 '<span class="yc-cvhuSNM">{SEX_ORA}，{FOLK_ORA}，{MARRG_STATUS_ORA}</span>',
			 '</div>',
			 '<div class="yc-cvhUserInfo">',
			 '<div class="yc-cvhuiList"><label>客户编号：</label><span title={CUST_ID}>{CUST_ID}</span></div>',
			 '<div class="yc-cvhuiList"><label>证件类型：</label><span title={CERT_TYPE}>{CERT_TYPE}</span></div>',
			 '<div class="yc-cvhuiList"><label>证件号码：</label><span title={CERT_NUM}>{CERT_NUM}</span></div>',
			 '<div class="yc-cvhuiList"><label>基础评级：</label><span title="显著客户">显著客户</span></div>',
			 '<div class="yc-cvhuiList"><label>贡献度评级：</label><span title="四星客户">四星客户</span></div>',
			 '<div class="yc-cvhuiList"><label>两地客户标示：</label><span title="商旅客户">商旅客户</span></div>',
			 '</div>',
			 '</tpl>',
			 '</div>',
			 '</div>'
	);
	var tileBox = new Ext.Panel({
	    cls : 'yc-cvHeader',
	    collapsible : false,
	    layout : 'fit',
	    items : new Ext.DataView({
	        store: store,
	        tpl: tpl,
	        multiSelect: true,
	        emptyText: '<div class="yc-cvHeader">'+
	        '<div class="yc-cvhContainer">'+
	        '<div class="yc-cvhUser">'+
	        '<span class="yc-cvhuName">没有客户数据</span>'+
	        '</div>'+
	        '</div>'+
	        '</div>'
	    })
	});
	return tileBox;
})();