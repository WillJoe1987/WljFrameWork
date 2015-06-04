
/**
 *重写组件管理器注册与移除方法，使其在WLJ页面对象控制器内同时存在记录 
 */
Ext.apply(Ext.ComponentMgr, {
	register:function(c){
		Ext.ComponentMgr.all.add(c);
		if(Wlj.ext.app.CurrentURL!=undefined && Wlj.ext.app.CurrentURL!=''){
			if(Wlj.ext.app.PrintedObject[Wlj.ext.app.CurrentURL]){
				Wlj.ext.app.PrintedObject[Wlj.ext.app.CurrentURL].push(c);
			}else{
				Wlj.ext.app.PrintedObject[Wlj.ext.app.CurrentURL] = new Array();
				Wlj.ext.app.PrintedObject[Wlj.ext.app.CurrentURL].push(c);
			}
		}
	},
	unregister : function(c){
		if(Wlj.ext.app.CurrentURL!=undefined && Wlj.ext.app.CurrentURL!=''){
			if(Wlj.ext.app.PrintedObject[Wlj.ext.app.CurrentURL]){
				Wlj.ext.app.PrintedObject[Wlj.ext.app.CurrentURL].remove(c);
			}
		}
		Ext.ComponentMgr.all.remove(c);
    }
});
/**
 *重写Store管理器注册与移除方法，使其在WLJ页面对象控制器内同时存在记录 
 */
Ext.apply(Ext.StoreMgr,{
	register : function(){
    	for(var i = 0, s; (s = arguments[i]); i++){
    		this.add(s);
    		if(Wlj.ext.app.CurrentURL!=undefined && Wlj.ext.app.CurrentURL!=''){
    			if(Wlj.ext.app.PrintedStore[Wlj.ext.app.CurrentURL]){
    				Wlj.ext.app.PrintedStore[Wlj.ext.app.CurrentURL].push(s);
    			}else{
    				Wlj.ext.app.PrintedStore[Wlj.ext.app.CurrentURL]=new Array();
    				Wlj.ext.app.PrintedStore[Wlj.ext.app.CurrentURL].push(s);
    			}
    		}
    	}	
	},
	unregister : function(){
		for(var i = 0, s; (s = arguments[i]); i++){
			if(Wlj.ext.app.CurrentURL!=undefined && Wlj.ext.app.CurrentURL!=''){
				if(Wlj.ext.app.PrintedStore[Wlj.ext.app.CurrentURL]){
					Wlj.ext.app.PrintedStore[Wlj.ext.app.CurrentURL].remove(s);
				}
			}
			this.remove(this.lookup(s));
		}
	}
});
