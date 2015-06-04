/**
*@description 工具包
*@author zh_haining
*@since 2014-5-20
*@checkedby 
**/

imports([
	'/contents/pages/common/Ext.ux.Notification.js'//右下角悬浮框信息提示需要引入的公共js
	]);
/**
 * 右下角信息提示悬浮框
 */
Utils = {
	// @param region 区域，可选：east,center,west
	showMsg : function(msg, error, hideDelay) {
		new Ext.ux.Notification( {
			iconCls : error ? 'x-icon-error' : 'x-icon-information',
			title : error ? '错误信息' : '提示信息',
			html : "<br><font style='font-weight:bolder;color:blue;'>" + msg
					+ '</font><br><br>',
			autoDestroy : true,
			plain : false,
			shadow : false, //提示信息消隐后,阴影还在,所以此处将阴影去掉 20140529 by km
			draggable : false,
			hideDelay : hideDelay || (error ? 5000 : 2000),
			width : 400
		}).show(document);
	},
	// @param region 区域，可选：east,center,west
	showMsgX : function(msg, error, hideDelay) {
		new Ext.ux.Notification( {
			iconCls : error ? 'x-icon-error' : 'x-icon-information',
			title : error ? '错误信息' : '提示信息',
			html : "<br><font style='font-weight:bolder;color:red;'>" + msg
					+ '</font><br><br>',
			autoDestroy : true,
			plain : false,
			shadow : false,//提示信息消隐后,阴影还在,所以此处将阴影去掉 
			draggable : false,
			hideDelay : hideDelay || (error ? 5000 : 2000),
			width : 400
		}).show(document);
	},
	/***
	 * @TODO 禁止用户拖入某些查询条件
	 * @author zh_haining
	 * @params:
	 * 		con:添加之前默认生成的数据项配置；
	 * 		arrayCn:可以拖入查询面板的中文字段数组
	 */
	forbidDragFieldsToSearchField: function(con,arrayCn){
		if(!arrayCn || !(arrayCn instanceof Array)){//如果arrayCn未定义且不为数组
			return false;
		}
		var flag = false;
		var msgStr = arrayCn.join();//将中文数组转换为字符串，默认以逗号分隔，也可以指定
		if(arrayCn && 0 < arrayCn.length){
			for(var i = 0 ; i < arrayCn.length ; i++ ){
				if(con.fieldLabel == arrayCn[i]){
					flag = true;
					break;
				}
			}
			if(!flag){
				Utils.showMsgX('只能将一下字段拖入查询面板：<br />' + msgStr ,false,5000);
			}
		}
		return flag;
	},
	/***
	 * @TODO 将日期字符串转换为规定的字符创格式(eg:2014-5-1 转化为  20140501)
	 * @author zh_haining
	 * @params:
	 * 		dateStr:2014-5-1
	 * @return 20140501
	 */
	dateStrTransTostr:function(dateStr){
		var retStr = "";
		if(null != dateStr && "" != dateStr.trim()){//如果将要转换的日期串不为空
			var array = dateStr.split('-') ;
			if(array[1].length == 1){
				array[1] = "0" + array[1] ;
			}
			if(array[2].length == 1){
				array[2] = "0" + array[2] ;
			}
			retStr = array.join('');
		}
		return retStr ;
	},
	/***
	 * @TODO 将字符串转换为规定的日期字符创格式(eg:20140501  转化为  2014-5-1)
	 * @author zh_haining
	 * @params:
	 * 		dateStr:  20140501 
	 * @return 2014-5-1
	 */
	strTransToDateStr:function(str){
		var retStr = "";
		if(str && "" != str && str.length == 8){
			retStr = str.substr(0,4) + "-" + str.substr(4,2) + "-" + str.substr(6,2) ;
		}
		return retStr ;
	}
};












