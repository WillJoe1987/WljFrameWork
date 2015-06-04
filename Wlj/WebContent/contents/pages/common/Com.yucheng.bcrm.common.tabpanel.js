/**
 * @description 
 *   新框架tabs页签js公共调用类,方法面签内容按新框架风格编写,
 *   引用此js的jsp编写风格参照：/contents/pages/common/Com.yucheng.bcrm.common.tabpanel.demo.jsp
 *   注：把上面jsp的内容复制一份出来,只需要要编写var tabs里面的内容即可
 * @author helin
 * @since 2014-07-21
 */
Ext.onReady(function(){
	window.CUSTVIEW ={
		CURRENT_VIEW_URL:''
	};
    var tapItems = [];
    if(!tabs || tabs.length <= 0){
    	Ext.Msg.alert('提示','tabs参数配置不正确！');
    	return false;
    }
    
    var builtfunctionurl = function(baseUrl){
		var url = false;
		if(baseUrl.indexOf('.jsp') < 0 ){
			url = basepath + '/contents/frameControllers/view/Wlj-view-function.jsp';
		}else{
			url = basepath + baseUrl.split('.jsp')[0]+'.jsp';
		}
		var turl = baseUrl.indexOf('?')>=0 ? baseUrl + '&resId='+JsContext._resId : baseUrl + '?resId='+JsContext._resId ;
		url += '?' + turl.split('?')[1] + '&busiId='+_busiId+'&custId='+_custId + getUrlParam();
		return url;
	};
	
	var getUrlParam = function(){
		var rturl = '';
		var parms = '';
		if (window.location.search) {
			parms = Ext.urlDecode(window.location.search);
		}
		var viewId = parms['?viewId']?parms['?viewId']:parms['viewId'];
		if (typeof viewId != "undefined") {
			rturl += '&viewId='+viewId;
		}
		var viewType = parms['?viewType']?parms['?viewType']:parms['viewType'];
		if (typeof viewType != "undefined") {
			rturl += '&viewType='+viewType;
		}
		var busiName = parms['?busiName']?parms['?busiName']:parms['busiName'];
		if (typeof busiName != "undefined") {
			rturl += '&busiName='+busiName;
		}
		return rturl;
	}
	
    for(var i=0;i<tabs.length;i++){
    	if(i==0){
    		window.CUSTVIEW.CURRENT_VIEW_URL = tabs[i].url;
    	}
    	tapItems.push({
    		id : 'subtab-'+i ,
    		title : tabs[i].title,
    		html:'<iframe id="contentFrame" name="contentFrame" src="'+builtfunctionurl(tabs[i].url)+'" width="100%" height="100%" frameborder="no" scrolling="auto"></iframe>'
    	})
    }
    
    var tp = new Ext.TabPanel({
        id: 'main-tabs',
        minTabWidth:20,
        enableTabScroll : true,
        activeTab: 0,
        items: tapItems,
		listeners: {
	        'tabchange': function(tabPanel, tab){
	        	var idArr = tab.id.split("-");
	        	window.CUSTVIEW.CURRENT_VIEW_URL = tabs[idArr[1]].url;
	        }
	    }
	});
    
	var viewport = new Ext.Viewport({
		layout : 'fit',
		frame : true,
		items : [tp]
	});
});