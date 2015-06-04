/**
 * Ajax patch. 
 * Make the ajax request, to create a script tag.
 **/
Ext.apply(Ext.Ajax,{
	loadCfgs : [],
	loading : false,
	loadedCaches : {},
	request : function(config){
		var url = config.url;
		if(!url) return false;
		var method = config.method;
		if(!method)method='GET';
		if(method=='GET' || method=='get'){
			this.createTag(config);
		}else{
		}
	},
	createTag : function(config){
		var _this = this;
		if(_this.loading){
			_this.loadCfgs.push(config);
		}else {
			_this.loading = true;
			_this.activeRequest = {};
			if(config.url.indexOf('.json')<0){
				return false;
			}
			if(this.busiTag){
				this.busiTag.removeNode(true);
				this.busiTag = false;
			}
			_this.busiTag = document.createElement('script');
			_this.busiTag.type = "text/javascript";
		
			var url =  config.url.split('/');
			var urlKey = url[url.length-1];
			if(_this.loadedCaches[urlKey]){
				var response = _this.buildResponse(urlKey,config);
				if(Ext.isFunction(config.callback)){
					config.callback.call(Ext.Ajax, response, config, true);
				}else if (Ext.isFunction(config.success)){
					config.success.call(Ext.Ajax, response, config, true);
				}
				if(_this.loadCfgs.length == 0 ) {
					_this.loading = false;
					return;
				}else{
					_this.loading = false;
					_this.createTag(_this.loadCfgs.pop());
				}
				return;
			}else{
				_this.busiTag.src = '../../jsons/'+urlKey;
				if(Ext.isIE6 || Ext.isIE7 || Ext.isIE8 || Ext.isIE9 || Ext.isIE10){
					_this.busiTag.onreadystatechange = function(){
						if(_this.busiTag.readyState == 'loaded' || _this.busiTag.readyState == "complete"){
							_this.buildCache(urlKey);
							var response = _this.buildResponse(urlKey,config);
							if(Ext.isFunction(config.callback)){
								config.callback.call(Ext.Ajax, response, config, true);
							}else if (Ext.isFunction(config.success)){
								config.success.call(Ext.Ajax, response, config, true);
							}
							window.responseText = false;
							if(_this.loadCfgs.length == 0 ) {
								_this.loading = false;
								return;
							}else{
								_this.loading = false;
								_this.createTag(_this.loadCfgs.pop());
							}
						}
					};
				}else{
					_this.busiTag.onload = function(){
						_this.buildCache(urlKey);
						var response = _this.buildResponse(urlKey,config);
						if(Ext.isFunction(config.callback)){
							config.callback.call(Ext.Ajax, response, config, true);
						}else if (Ext.isFunction(config.success)){
							config.success.call(Ext.Ajax, response, config, true);
						}
						window.responseText = false;
						if(_this.loadCfgs.length == 0 ) {
							_this.loading = false;
							return;
						}else{
							_this.loading = false;
							_this.createTag(_this.loadCfgs.pop());
						}
					};
				}
				document.body.appendChild(_this.busiTag);
			}
		}
	},
	buildCache : function(urlKey){
		var _this = this,
			cache = this.loadedCaches,
			res = window.responseText;
		if(Ext.isEmpty(res)){
			res = {};
		}else if(Ext.isString(res)){
			res = Ext.decode(res);
		}
		if(res){
			cache[urlKey] = res;
		}
	},
	buildResponse : function(urlKey,config){
		var response = {};
		var conditionedData;
		
		var limit,start,end;
		var resObj = {};
		resObj.json = {};
		if(config.params){
			if(Ext.isNumber(config.params.limit)){
				limit = config.params.limit;
			}
			if(Ext.isNumber(config.params.start)){
				start = config.params.start;
			}
			if(Ext.isNumber(limit)&&Ext.isNumber(start)){
				end = start + limit;
			}
		}
		if(config.params && config.params.condition){
			conditionedData = this.filterData(urlKey,Ext.decode(config.params.condition));
		}else{
			conditionedData = this.loadedCaches[urlKey].json.data;
		}
		var data;
		if(limit && end && this.loadedCaches[urlKey].json.data){
			data = conditionedData.slice(start, end);
			resObj.json.start = start;
			resObj.json.limit = limit;
		}else{
			data = conditionedData;
		}
		resObj.json.count = conditionedData.length;
		resObj.json.data = data;
		
		response.responseText = Ext.encode(resObj);
		return response;
	},
	filterData : function(urlKey, conditons){
		var theData = this.loadedCaches[urlKey].json.data;
		var resData = [];
		Ext.each(theData, function(d){
			var res = true;
			for(c in conditons){
				if(Ext.isEmpty(conditons[c])){
					continue;
				}
				if(d[c] != conditons[c]){
					res = false;
					break;
				}
			}
			if(res){
				resData.push(d);
			}
		});
		return resData;
	}
});

Ext.apply(Ext.data.Store.prototype, {
	load : function(option){
		var url = this.proxy.url;
		var config = {};
		config.url = url;
		var _this = this;
		Ext.apply(config, option);
		if(this.baseParams.condition){
			if(!config.params) config.params = {};
			config.params.condition = this.baseParams.condition;
		}
		config.callback = function(a,b,c,d){
			_this.loadData(Ext.decode(a.responseText));
			_this.fireEvent('load',_this, _this.getRange(),config);
			_this.fireEvent('datachanged',_this);
		};
        Ext.Ajax.createTag(config);
	},
	reload : function(option){
		this.load(option);
	}
});




