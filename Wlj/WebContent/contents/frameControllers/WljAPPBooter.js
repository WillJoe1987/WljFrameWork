(function() {
	function linkVersionControl(url){
		document.write('<link rel="stylesheet" type="text/css" href="' + basepath + url+'?ver='+__frameVersion+'"/>');
	}
	function scriptVersionControl(url){
		document.write('<script type="text/javascript" src="' + basepath + url+'?ver='+__frameVersion+'"></script>');
	}
	/**
	 * runMod: 【debug:调试模式，run：运行模式，dev开发模式】
	 */
	var runMod = 'dev';
//    var scripts = document.getElementsByTagName('script'),
//        localhostTests = [
//            /^localhost$/,
//            /\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:\d{1,5})?\b/ // IP v4
//        ],
//        host = window.location.hostname,
//        isDevelopment = null,
//        queryString = window.location.search,
//        test, path, i, ln, scriptSrc, match;
//
//    for (i = 0, ln = scripts.length; i < ln; i++) {
//        scriptSrc = scripts[i].src;
//
//        match = scriptSrc.match(/bootstrap\.js$/);
//
//        if (match) {
//            path = scriptSrc.substring(0, scriptSrc.length - match[0].length);
//            break;
//        }
//    }
//
//    if (queryString.match('(\\?|&)debug') !== null) {
//        isDevelopment = true;
//    }
//    else if (queryString.match('(\\?|&)nodebug') !== null) {
//        isDevelopment = false;
//    }
//
//    if (isDevelopment === null) {
//        for (i = 0, ln = localhostTests.length; i < ln; i++) {
//            test = localhostTests[i];
//
//            if (host.search(test) !== -1) {
//                isDevelopment = true;
//                break;
//            }
//        }
//    }
//
//    if (isDevelopment === null && window.location.protocol === 'file:') {
//        isDevelopment = true;
//    }
	linkVersionControl("/contents/wljFrontFrame/styles/search/searchcss/common.css");
	linkVersionControl("/contents/wljFrontFrame/styles/search/searchcss/base_frame.css");
	linkVersionControl("/contents/wljFrontFrame/styles/search/searchthemes/"+__theme+"/frame.css");
	if(__wordsize === 'ra_normal'){
		linkVersionControl("/contents/wljFrontFrame/styles/search/searchcss/font_normal.css");
	}else{
		linkVersionControl("/contents/wljFrontFrame/styles/search/searchcss/font_big.css");
	}
	
	if(runMod=='dev'){
		scriptVersionControl("/contents/frameControllers/Wlj-SyncAjax.js");
		scriptVersionControl("/contents/frameControllers/Wlj-frame-base.js");
		scriptVersionControl("/contents/frameControllers/Wlj-memorise-base.js");
		scriptVersionControl("/contents/frameControllers/Wlj-view-base.js");
		scriptVersionControl("/contents/frameControllers/Wlj-search-APP.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/header.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/search.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/tiles.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/menu.js");
//		scriptVersionControl("/contents/frameControllers/widgets/search/legiMenu.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/window.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/service.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/plugins.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/TileExtra.js");
		scriptVersionControl("/contents/frameControllers/widgets/search/tips.js");
		scriptVersionControl("/contents/frameControllers/widgets/views/index/grid/grid.js");
	}else if(runMod=='debug'){
		scriptVersionControl("/contents/frameControllers/Wlj.index.all-v1.0.x-debug.js");
	}else{
		scriptVersionControl("/contents/frameControllers/Wlj.index.all-v1.0.x-min.js");
	}
	
	scriptVersionControl("/contents/frameControllers/Wlj-search-APP-cfg.js");
	scriptVersionControl("/contents/pages/common/Com.yucheng.crm.common.CustFlow.js");
	scriptVersionControl("/contents/pages/common/Com.yucheng.crm.common.FusionChartPanel.js");
	scriptVersionControl("/FusionCharts/FusionCharts.js");
	scriptVersionControl("/contents/pages/common/Com.yucheng.crm.security.win8.js");
	scriptVersionControl("/contents/frameControllers/plugin/customerView/Wlj-frame-View.js");	
})();