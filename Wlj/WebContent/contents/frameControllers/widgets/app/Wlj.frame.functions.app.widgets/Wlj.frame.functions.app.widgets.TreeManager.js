Ext.ns('Wlj.frame.functions.app.widgets');
Wlj.frame.functions.app.widgets.TreeManager = Ext.extend(Ext.util.Observable, {
	loaded : false,
	constructor : function(cfg){
		this.loaders = {};
		this.treesCfg = {};
		this.dataStores = {};
		Wlj.frame.functions.app.widgets.TreeManager.superclass.constructor.call(this, cfg);
	},
	addLoader : function(key, cfg){
		if(!Ext.isString(key)){
			Ext.warn('错误','loader的key值设置失败，应配置为String类型。');
			return false;
		}
		if(!cfg.url){
			Ext.warn('错误','loader['+key+']创建失败，没有URL');
			return false;
		}
		if(this.loaders[key]){
			Ext.warn('错误','key['+key+']:已存在对应loader对象，请修改key值');
			return false;
		}
		var _this = this;
		var loader = new Wlj.frame.functions.app.widgets.ArrayTreeLoader(cfg);
		Ext.Ajax.request({
			url : cfg.url,
			method:'GET',
			success:function(response){
				var nodeArra = Ext.util.JSON.decode(response.responseText);
				if(Ext.isString(loader.jsonRoot)){
					try{
						loader.nodeArray = eval('nodeArra.'+loader.jsonRoot);
					}catch(e){
						loader.nodeArray = nodeArra;
					}
				}else{
					loader.nodeArray = nodeArra;
				}
				
				var children = loader.loadAll();
				var lookupstore = new Ext.data.JsonStore({
					fields : [{
						name : 'key',
						mapping : 'id'
					},{
						name : 'value',
						mapping : 'text'
					}],
					data : loader.nodeArray
				});
				_this.dataStores[key] = lookupstore;
				Ext.each(loader.supportedTrees,function(atree){
					atree.appendChild(children);
				});
				if(Ext.isFunction(cfg.callback)){
					cfg.callback.apply(loader,[loader]);
				}
			}
		});
		this.loaders[key] = loader;
		return loader;
	},
	initTree : function(key, cfg){
		if(!Ext.isString(key)){
			Ext.warn('tree的key值设置失败，应配置为String类型。');
			return false;
		}
		if(this.treesCfg[key]){
			Ext.warn('key['+key+']:已存在对应tree面板配置，请修改key值');
			return false;
		}
		this.treesCfg[key] = cfg;
		return cfg;
	},
	/**
	 * cfg : string/object
	 */
	createTree : function(cfg){
		if(!this.loaded){
			this.loadTreesCfgs();
		}
		if(Ext.isString(cfg)){
			var treeCfg = this.treesCfg[cfg];
			if(!treeCfg){
				Ext.warn('['+cfg+']:未查找到相关树形结构配置！');
				return false;
			}
			if(treeCfg.loaderKey && !treeCfg.resloader){
				treeCfg.resloader = this.loaders[treeCfg.loaderKey];
			}
			
			var reTreeCfg = Ext.apply({
				autoScroll : true
			},treeCfg);
			
			if(reTreeCfg.rootCfg){
				reTreeCfg.root = new Ext.tree.AsyncTreeNode(reTreeCfg.rootCfg);
			}
			return new Wlj.frame.functions.app.widgets.TreePanel(reTreeCfg);
		}else{
			if(!cfg.key){
				Ext.warn('树形面板配置没有key字段，请为其配置string类型唯一key值！');
				return false;
			}
			if(this.initTree(cfg.key, cfg)){
				return this.createTree(cfg.key);
			}
		}
	},
	loadTreesCfgs : function(){
		this.checkTreesCfgs();
		this.loaded = true;
		Ext.log('初始化树形结构管理器！');
		var loaderCfgs = window.treeLoaders;
		var treesCfg = window.treeCfgs;
		if(Ext.isArray(loaderCfgs)){
			Ext.each(loaderCfgs, function(l){
				TreeManager.addLoader(l.key,l);
			});
			if(Ext.isArray(treesCfg)){
				Ext.each(treesCfg, function(t){
					TreeManager.initTree(t.key,t);
				});
			}
		}
	},
	checkTreesCfgs : function(){
		Ext.log('树形结构配置检查，treeLoaders|treeCfgs');
		var loaderKeyMap = {};
		if(!Ext.isArray(window.treeLoaders)){
			Ext.log('无树形结构数据源配置[treeLoaders],或配置结构不正确');
			window.treeLoaders = false;
			window.treeCfgs = false;
		}else{
			Ext.log('发现['+treeLoaders.length+']个树形结构数据源配置:');
			for(var tli =0; tli<treeLoaders.length;tli++){
				var tl = treeLoaders[tli];
				if(!tl.key){
					Ext.warn('第['+tli+']个树形结构数据源无key属性；将被忽略');
					continue;
				}
				if(!tl.url){
					Ext.warn('第['+tli+']个树形结构数据源无url属性；将被忽略');
					continue;
				}
				if(!tl.parentAttr){
					Ext.warn('第['+tli+']个树形结构数据源无parentAttr属性；将被忽略');
					continue;
				}
				if(!tl.locateAttr){
					Ext.warn('第['+tli+']个树形结构数据源无locateAttr属性；将被忽略');
					continue;
				}
				if(!tl.rootValue){
					Ext.warn('第['+tli+']个树形结构数据源无rootValue属性；将被忽略');
					continue;
				}
				if(!tl.textField){
					Ext.warn('第['+tli+']个树形结构数据源无textField属性；将被忽略');
					continue;
				}
				if(!tl.idProperties){
					Ext.warn('第['+tli+']个树形结构数据源无idProperties属性；将被忽略');
					continue;
				}
				loaderKeyMap[tl.key] = tl;
			}
			Ext.log('树形结构数据源配置检查完毕');
		}
		if(!Ext.isArray(window.treeCfgs)){
			Ext.log('无树形面板配置[treeCfgs],或配置结构不正确');
			window.treeCfgs = false;
		}else{
			Ext.log('发现['+treeCfgs.length+']个树形面板配置:');
			for(var tci=0;tci<treeCfgs.length;tci++){
				var tc = treeCfgs[tci];
				if(!tc.key){
					Ext.warn('第['+tci+']个树形面板无key属性；将被忽略');
					continue;
				}
				if(tc.loaderKey){
					if(!loaderKeyMap[tc.loaderKey]){
						Ext.warn('第['+tci+']个树形面板关联数据源不存在，请检查loaderKey属性！');
					}
				}
			}
			Ext.log('树形面板配置检查完毕');
		}
		Ext.log('树形结构配置treeLoaders|treeCfgs检查完毕');
	}
});

TreeManager = new Wlj.frame.functions.app.widgets.TreeManager();