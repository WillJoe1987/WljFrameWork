/**
 * @Author Will Joe 
 * @Date 2011-11-21
 */

var JsContext = {
	/**
	 *@ Grant static values.  
	 */
	add:"ADD",
	del:"DELETE",
	mod:"MODIFY",
	vie:"VIEW",
	ROOT_UP_ORG_ID:'0000',	//机构树根机构UP_ORG_ID
	/**
	 * @ Our context for front pages, or js files.
	 */	
	initContext : function(){
		this._userId=__userId;
		this._orgId=__units;
		this._resId=__resId;
		this._unitname = __unitname;
		this._roleId=__roles.split('$');
		Ext.each(this._roleId,function(r){
			if(r==""){
				JsContext._roleId.remove(r);
			}
		});
		this._grants = __grants;
		//this._errMsgMap = __errMsgMap;
//		this._appId = __appId;
//		if (typeof(__loginType) != 'undefined')
//			this._loginType = __loginType;
//		if (typeof(__secMsgType) != 'undefined')
//			this._secMsgType = __secMsgType;
//		if (typeof(__secMsg) != 'undefined')
//			this._secMsg = __secMsg;
//		if (typeof(__themeColorId) != 'undefined')
//			this._themeColorId = __themeColorId;
	},
	/**
	 * @ Check if current user has grant of the parameter string.
	 * @param grant
	 * @returns {Boolean}
	 * 返回true 代表无权限
	 */
	checkGrant : function(grant){
		//公共封装的新增、修改、删除按钮判断是否增加权限控制，默认grant为false,如果页面不给addGrant\updateGrant\delGrant赋值，则默认不控制
		if(grant==false)
			return false;
		//如果授权功能点为空，则不显示按钮，无权限
		if(this._grants.length==0){
			return true;
		}
		//在授权列表中，显示按钮，有权限
		if(this._grants.indexOf(grant)>=0){
			return false;
		}
		//无权限
		return true;
	}
};

var SEARCHTYPE = {
	SUBTREE:'SUBTREE',
	SUBORGS:'SUBORGS',
	PARENT:'PARENT',
	PARPATH:'PARPATH',
	ALLORG:'ALLORG',
	ORGUSER:'ORGUSER',
	SUBUSER:'SUBUSER',
	SUBUSER_MAX:'SUBUSER_MAX',
	ALLUSER:'ALLUSER'
	 /* 查询子机构树；
	 * 查询直接子机构；
	 * 查询父机构；
	 * 查询所有父、祖机构；
	 * 查询所有机构;
	 * 查询当前机构用户；
	 * 查询子机构用户；
	 * 查询子机构用户（含当前机构用户）；
	 * 查询全部机构用户.
	 */		
};

function commSearch(searchType){
	this.res = false;
}
