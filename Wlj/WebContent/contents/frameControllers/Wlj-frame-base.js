//var Wlj = {};
//window.Wlj = Wlj;
/**
 * 
 */
Wlj.version = {
	major : '1',
	subject : '0',
	patch : '0',
	fullVersion : '1.0.0',
	fullName : 'Walk Lonely Javascript',
	buildDate : '20131104',
	describe : 'Release 1.0.0 beta, based on Ext 3.3.1'
};

Wlj.tools = {
	namespace : function(){
		var o, d;
		Ext.each(arguments, function(v) {
			d = v.split(".");
			o = window[d[0]] = window[d[0]] || {};
			Ext.each(d.slice(1), function(v2){
				o = o[v2] = o[v2] || {};
			});
		});
		return o;
	},
	imports : function(files, callback){
		if(Ext.isArray(files)){
			if(files.length == 0){
				if(Ext.isFunction(callback)){
					callback.call(Wlj);
				}
			}else{
				Wlj.tools.load(files.pop(),function(){
					Wlj.tools.imports(files, callback);
				});
			}
		}else{
			Wlj.tools.load(files,callback);
		}
		
	},
	load : function(file, callback){
		//同步方式加载JS文件
		Wlj.SyncAjax.request({
			url : basepath + file, 
			callback : callback,
			success : function(response) {
				var _this = this;
				window.execScript ? window.execScript(response.responseText) : window.eval(response.responseText);
				if(Ext.isFunction(callback)){
					callback.call(Wlj);
				}
			}
		});
 	}
};

window.imports = Wlj.tools.imports;
