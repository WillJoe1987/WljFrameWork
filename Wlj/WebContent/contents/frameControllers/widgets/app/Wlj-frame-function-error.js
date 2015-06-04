Ext.ns('Wlj.error');
Wlj.error.debugerConfig = {
        
                                        
	consoleInPage : !!Wlj.frame.functions.app.Util.needConsoleInPage,//是否调用页面内部日志组件显示日志
	consoleInNavigator : !!Wlj.frame.functions.app.Util.needConsoleInNavigator,//是否调用浏览器控制台显示日志
		
	ERROR : !!Wlj.frame.functions.app.Util.needError,  
	WARN :  !!Wlj.frame.functions.app.Util.needWarn,   
	INFO :  !!Wlj.frame.functions.app.Util.needInfo,   
	DEBUG : !!Wlj.frame.functions.app.Util.needDebug,  
	logLineLimit : 100,
	initLogTool : function(){
		if(!Wlj.error.debugerConfig.ERROR){
			Ext.error = Ext.emptyFn;
		}
		if(!Wlj.error.debugerConfig.WARN){
			Ext.warn = Ext.emptyFn;
		}
		if(!Wlj.error.debugerConfig.INFO){
			Ext.log = Ext.emptyFn;
		}
		if(!Wlj.error.debugerConfig.DEBUG){
			Ext.debug = Ext.emptyFn;
		}
	}
};

JDEBUG = Wlj.error.debugerConfig;
Wlj.error.J_ERRORS = {
	J_NEVERDEFINE : '变量未定义'
		
		/**
		 * 1. EvalError：eval_r()的使用与定义不一致 
2. RangeError：数值越界 
3. ReferenceError：非法或不能识别的引用数值 
4. SyntaxError：发生语法解析错误 
5. TypeError：操作数类型错误 
6. URIError：URI处理函数使用不当
		 */
		
		
};
JERROR = Wlj.error.J_ERRORS;
Wlj.error.W_ERRORS = {
	NORESIDERROR : '无resId属性',
	NOCODEFILEERROR : '无页面文件'
};
WERROR = Wlj.error.W_ERRORS;