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
	var 	runMod = 'dev';
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
	linkVersionControl("/contents/resource/ext3/resources/css/debug.css");
	linkVersionControl("/contents/wljFrontFrame/styles/search/searchthemes/"+__theme+"/main.css");
	if(__wordsize === 'ra_normal'){
		linkVersionControl("/contents/wljFrontFrame/styles/search/searchcss/font_normal.css");
	}else{
		linkVersionControl("/contents/wljFrontFrame/styles/search/searchcss/font_big.css");
	}
	
	scriptVersionControl("/contents/frameControllers/defaultPatches.js");
	scriptVersionControl("/contents/frameControllers/widgets/app/Wlj-frame-function-app-cfg.js"); 
	if(runMod=='dev'){
		scriptVersionControl("/contents/frameControllers/Wlj-SyncAjax.js");
	    scriptVersionControl("/contents/frameControllers/Wlj-frame-base.js");
	    scriptVersionControl("/contents/frameControllers/Wlj-memorise-base.js");
	    scriptVersionControl("/contents/frameControllers/widgets/search/tiles.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj-frame-function-error.js");
	    scriptVersionControl("/contents/frameControllers/widgets/debug.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj.frame.functions.app.widgets/Wlj.frame.functions.app.widgets.ComboTree.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj.frame.functions.app.widgets/Wlj.frame.functions.app.widgets.ResultContainer.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj.frame.functions.app.widgets/Wlj.frame.functions.app.widgets.SearchContainer.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj.frame.functions.app.widgets/Wlj.frame.functions.app.widgets.SearchGrid.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj.frame.functions.app.widgets/Wlj.frame.functions.app.widgets.TreeManager.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj.frame.functions.app.widgets/Wlj.frame.functions.app.widgets.View.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj-frame-function-app.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj-frame-function-builder.js");
	    scriptVersionControl("/contents/frameControllers/widgets/app/plugins/thumbnails/Wlj-frame-functions-plugin-thumbnails.js");
	    
	}else if(runMod=='debug'){
		scriptVersionControl("/contents/frameControllers/Wlj.function.all-v1.0.x-debug.js");
	}else{
		scriptVersionControl("/contents/frameControllers/Wlj.function.all-v1.0.x-min.js"); 
	}
	
	
	
    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj-frame-function-header.js");
    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj-frame-function-api.js");
    scriptVersionControl("/contents/frameControllers/systemPatch.js");
    
})();