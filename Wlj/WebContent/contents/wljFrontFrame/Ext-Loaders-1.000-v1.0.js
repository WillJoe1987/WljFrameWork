(function(){
	Ext.app.ScriptLoader = function(config){
		this.loadedScripts = [];
		this.disableCaching = false;
		this.loadMask = null;
		this.timeout = false;
		this.isLoading = false;
		Ext.apply(this, config);
	    Ext.app.ScriptLoader.superclass.constructor.call(this);
	};
	Ext.extend(Ext.app.ScriptLoader,Ext.util.Observable,{
		showMask : function(){
			if (!this.loadMask){
				this.loadMask = new Ext.LoadMask(Ext.getBody());
				this.loadMask.show();
			}
		},

		hideMask : function(){
			if(this.loadMask){
				this.loadMask.hide();
				this.loadMask = null;
			}
		},
		
		pushCache : function(response){
			var cache = {};
			cache.url = response.argument.url;
			cache.file = response.responseText;
			if(this.loadedScripts.length>this.cacheSize){
				this.loadedScripts.shift();
				this.loadedScripts.push(cache);
			}else{
				this.loadedScripts.push(cache);
			}
		},
		
		getCache : function(url){
			var u = 0;
			while(u<this.loadedScripts.length){
				if(this.loadedScripts[u].url==url){
					return this.loadedScripts[u];
				}
				u++;
			}
			return false;
		},
		
		getCacheSize : function(){
			if(this.loadedScripts)
				return this.loadedScripts.length;
			else
				return 0;
		},
		
		processCache : function(cfg){
			this.isLoading = false;
			this.hideMask();
			window.execScript ? window.execScript(this.getCache(cfg.url).file) : window.eval(this.getCache(cfg.url).file);
			if(typeof cfg.callback == 'function'){
				cfg.callback.call(cfg.scope);
			}
		},
		
		processSuccess : function(response){
			this.isLoading = false;
			this.hideMask();
			if(this.disableCaching)
				this.pushCache(response);
			window.execScript ? window.execScript(response.responseText) : window.eval(response.responseText);
			if(typeof response.argument.callback == 'function'){
				response.argument.callback.call(response.argument.scope, response);
			}
		},
		
		processFailure : function(response){
			this.isLoading = false;
			this.hideMask();
			Ext.MessageBox.show({
				title: '应用错误', 
				msg: 'JS类库文件加载错误。', 
				closable: false, 
				icon: Ext.MessageBox.ERROR, 
				minWidth: 200
			});
			setTimeout(function(){
				Ext.MessageBox.hide(); 
			}, 3000);
		},
		
		load : function(url, callback){
			if(this.isLoading){
				Ext.Msg.alert("提示","正在加载js文件，请勿点击过快！");
				return null;
			}
			this.isLoading = true;
			var cfg, callerScope;
			if(typeof url == 'object'){
				cfg = url;
				url = cfg.url;
				callback = callback || cfg.callback;
				callerScope = cfg.scope;
				cfg.callback = callback;
			}
			this.showMask();
			if(this.disableCaching){
				if(this.getCache(url)!==false){
					this.processCache(cfg);
					return null;
				}
			}
			Ext.Ajax.request({
				url: url,
				success: this.processSuccess,
				failure: this.processFailure,
				scope: this,
				timeout: this.timeout || Ext.Ajax.timeout,
				disableCaching: this.disableCaching,
				argument: {
					'url': url,
					'scope': callerScope || window,
					'callback': callback,
					'options': cfg
	          	}
			});
		}
	});
})();
Ext.ScriptLoader = new Ext.app.ScriptLoader({
	version : '1.0',
	cacheSize : 10,
	disableCaching : true,
	/**
	 * @param o: 请求参数config，其中必输属性为：
	 * 				scripts：为一个js文件名数组，取工程目录下绝对路径，脚本加载器会根据数组顺序，以此加载、执行该属性中声明的js文件；
	 * 				finalCallback : 为js文件全部加载执行成功之后的回调函数，该回调函数将会接收到最后一个js文件的响应对象作为参数。
	 * 			 调用例子：
	 * 			Ext.ScriptLoader.loadScript({        
				scripts: [
				          basepath + '/contents/commonjs/wljMemories/Wlj-Ext-Application-Contance-1.000-v1.0.js',
				          basepath + '/contents/commonjs/wljMemories/Wlj-Ext-Patch-1.000-v1.0.js',
				          basepath + '/contents/pages/customer/customerManager/menuOfCorporateCustomers.js'
				          ],        
				finalCallback: function(response) {  
					
				}
			});
	 */
	loadScript : function(o){
		if(!Ext.isArray(o.scripts)){
			o.scripts = [o.scripts];
		}
		o.url = o.scripts.shift();
		if (o.scripts.length == 0){
			delete o.callback;
			this.load(o, o.finalCallback);
		}else{
			o.scope = this;
			this.load(o, function(){
				this.loadScript(o);
			});
		}
	}
});