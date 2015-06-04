/**
 * 同步AJAX对象
 * 
 */
(function(){
	var Wlj = {};
	if(!window.Wlj){
		window.Wlj = Wlj;
	}
	
	SyncAjax = function() {
		var _this = this;
		_this.initialize();
	};
	Ext.extend(SyncAjax, Ext.util.Observable);
	SyncAjax.prototype.disableCachingParam = '_dc';
	SyncAjax.prototype.method   = 'GET';//默认为GET方法
	SyncAjax.prototype.success  = false;
	SyncAjax.prototype.failure  = false;
	/***
	 * 初始化方法
	 * @return
	 */
	SyncAjax.prototype.initialize  = function(){
		var _this = this;
		this.addEvents({
			/**SyncAjax对象初始化**/
			/**
			 * SyncAjax 请求之前触发；
			 * params ：  
			 * return ：  
			 */
			beforeRequest : true,
			/**
			 * SyncAjax 请求之后触发；
			 * params ：  
			 */
			afterRequest : true,
			/**
			 * SyncAjax 请求异常触发；
			 * params ：  
			 */
			requestException : true,
			/**
			 * SyncAjax 请求成功触发；
			 * params ：  
			 */
			requestSucess : true,
			/**
			 * SyncAjax 请求失败触发；
			 * params ：  
			 */
			requestFailure : true
		});
	};
	/***
	 * 同步AJAX请求
	 */
	SyncAjax.prototype.request = function(cfg){
		var _this = this;
		var xhr;
		var value;
		try {
			if (window.ActiveXObject) {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
		    } else if (window.XMLHttpRequest) {
		    	xhr = new XMLHttpRequest();
		    }
			if (cfg.url.indexOf('?') > 0) {
				cfg.url = cfg.url + '&' +  Ext.urlEncode(cfg.params);
			} else {
				cfg.url = cfg.url + '?' +  Ext.urlEncode(cfg.params);
			}
			cfg.url = Ext.urlAppend(cfg.url, this.disableCachingParam + '=' + (new Date().getTime()));
			xhr.open(_this.method, cfg.url, false);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
			var initFlag = _this.fireEvent('beforeRequest', this);
			if(initFlag === false){
				Ext.error('beforeRequest事件阻止了SyncAjax 请求!');
				return false;
			}
			xhr.send(null);
			_this.fireEvent('afterRequest', this);
			if (xhr.status == 200) {
				var _this = this;
				_this.fireEvent('requestSucess', this);
				if(Ext.isFunction(cfg.success)){ 
					cfg.success(xhr);
				}
			} else {
				var _this = this;
				Ext.log('Wlj.SyncAjax.syncRequest异常:[' + xhr.statusText + ']');
				_this.fireEvent('requestFailure', this);
				if(Ext.isFunction(cfg.failure)){ 
					cfg.failure(xhr);
				}
			}			
		} catch (eo) {
			Ext.log('Wlj.syncRequest异常');
			_this.fireEvent('syncException', this);
		} 
	}; 
	window.Wlj.SyncAjax = new SyncAjax();
})();

