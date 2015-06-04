(function() {
	function linkVersionControl(url){
		document.write('<link rel="stylesheet" type="text/css" href="' + basepath + url+'?ver='+__frameVersion+'"/>');
	}
	function scriptVersionControl(url){
		document.write('<script type="text/javascript" src="' + basepath + url+'?ver='+__frameVersion+'"></script>');
	}

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
	scriptVersionControl("/contents/frameControllers/Wlj.function.all-v1.0.x-min.js"); 
    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj-frame-function-header.js");
    scriptVersionControl("/contents/frameControllers/widgets/app/Wlj-frame-function-api.js");
    scriptVersionControl("/contents/frameControllers/systemPatch.js");
    
})();