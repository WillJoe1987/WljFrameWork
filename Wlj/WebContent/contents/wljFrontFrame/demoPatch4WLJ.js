/**adapter for resId**/
__resId=Ext.urlDecode(document.location.search.substring(1)).resId;
/**
 *	adapter for prepareLookup items;
 **/
 if( Wlj.frame){
	Wlj.frame.functions.app.App.prototype.prepareLookup = function(){
		Ext.log('开始构建数据字典项管理器！');
		this.lookupManager = {};
		var _this = this;
		Ext.log('构建本地字典项');
		for(var key in this.localLookup){
			Ext.log('构建本地字典项：['+key+']；');
			var lookups = this.localLookup[key];
			var store = new Ext.data.JsonStore({
				fields : ['key', 'value']
			});
			store.loadData(lookups);
			this.lookupManager[key] = store;
			_this.fireEvent('locallookupinit', key, store);
		}
		Ext.log('本地字典项构建完毕');
		Ext.log('开始构建远程字典项');
		/***********************同步并发加载模式*******************************/
		Ext.each(_this.lookupTypes, function(lt){
			var tStore = null;
			if(Ext.isString(lt)){
				Ext.log('构建远程字典项:['+lt+'];');
				tStore = new Ext.data.JsonStore({
					sortInfo:{
						field: 'key',
						direction: WLJUTIL.lookupSortDirect 
					},		
					root: 'items',
					idProperty: 'key',  
					fields : ['key', 'value']
				});
				_this.lookupManager[lt] = tStore;
			}else{
				Ext.log('构建远程字典项:['+lt.TYPE+'];');
				tStore = new Ext.data.Store({
					restful:true,   
					proxy : new Ext.data.HttpProxy({
						url : basepath + lt.url
					}),
					reader : new Ext.data.JsonReader({
						root : lt.root?lt.root:'json.data'
					}, [{
						name : 'key',
						mapping : lt.key
					},{
						name : 'value',
						mapping : lt.value
					}])
				});
				_this.lookupManager[lt.TYPE] = tStore;
			}
			if(lt.autoLoadItems !== false){
				if(Ext.isString(lt)){
					tStore.loadData(_lookups[lt]);
					_this.fireEvent('lookupinit',lt,tStore);
				}else{
					tStore.load({
						callback : function(){
							_this.fireEvent('lookupinit',lt,tStore);
						}
					});
				}
			}
		});
	};
	Wlj.frame.functions.app.Builder.prototype.includeFiles = false;
	Wlj.frame.functions.app.Builder.prototype.codeLoad = function(){
		this.resId = __resId;
		if(!this.resId){
			Ext.error(WERROR.NORESIDERROR);
			return false;
		}
		this.getCodeFilePage();
		if(!this.codeFile){
			Ext.error(WERROR.NOCODEFILEERROR);
			return false;
		}
		var _this =this;
		if(this.includeFiles && this.includeFiles.length>0){
			Wlj.tools.imports(this.includeFiles,function(){
				_this.codeLoading();
			});
		}else{
			_this.codeLoading();
		}
	};
	Wlj.frame.functions.app.Builder.prototype.getCodeFilePage = function(){
		if(parent.Wlj){
			if(parent.Wlj.ServiceMgr.services.get('service_'+this.resId)){
				var theService = parent.Wlj.ServiceMgr.services.get('service_'+this.resId);
				this.codeFile = theService.menuData.ACTION;
				if(theService.menuData.IMPORTS){
					this.includeFiles = theService.menuData.IMPORTS.split(',');
				}
			}else{
				var searchType = this.resId.substring(7);
				if(parent.Wlj){
					for(var i=0;i<parent.Wlj.search.App.SEARCHTYPES.length;i++){
						if(searchType === parent.Wlj.search.App.SEARCHTYPES[i].searchType){
							this.codeFile = parent.Wlj.search.App.SEARCHTYPES[i].searchUrl;
							break;
						}
					}
				}
			}
		}else if(parent.booter){
			var menu = parent.booter.findMenuDataById(this.resId);
			if(menu){
				this.codeFile = menu.ACTION;
				if(menu.IMPORTS){
					this.includeFiles = menu.IMPORTS.split(',');
				}
			}
		}
	};
};
Ext.apply(Wlj.tools, {
	libLoading : false,
	imports : function(files, callback){
		if(Ext.isArray(files)){
			Wlj.tools.libLoading = true;
			if(files.length == 0){
				Wlj.tools.libLoading = false;
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
		var _this = this;
		_this.busiTag = document.createElement('script');
		_this.busiTag.type = "text/javascript";
		_this.busiTag.src = '../..'+file;
		if(Ext.isIE6 || Ext.isIE7 || Ext.isIE8 || Ext.isIE9 || Ext.isIE10){
			_this.busiTag.onreadystatechange = function(){
				if(_this.busiTag.readyState == 'loaded' || _this.busiTag.readyState == "complete"){
					if(Ext.isFunction(callback)){
						callback.call(Wlj);
					}
				}
			};
		}else{
			_this.busiTag.onload = function(){
				if(Ext.isFunction(callback)){
					callback.call(Wlj);
				}
			};
		}
		document.childNodes[1].childNodes[0].appendChild(_this.busiTag);
 	}
});
window.imports = Ext.emptyFn;

if(Wlj.memorise && Wlj.memorise.Tile){
	Ext.apply(Wlj.memorise.Tile.prototype, {
		loadJs : function(){
			var _this = this;
			_this.loading = true;
			var tile = _this.tiles.itemAt(_this.renderIndex);
			if(!tile){
				_this.loading = false;
				_this.loadData();
				return false;
			}else{
				if(!tile.jsUrl || !tile.tileSize){
					_this.renderIndex++;
					_this.loadJs();
				}else{
					var vs = tile.el.getViewSize(false);
					Wlj.tools.imports('../'+basepath + tile.jsUrl,function(){
						tile.removeAll();
						tile.contentObject = window.tileObject;
						if(tile.contentObject){
							if(Ext.isArray(tile.contentObject)){
								Ext.each(tile.contentObject,function(tc){
									tc.setSize(vs.width, vs.height);
								});
							}else{
								tile.contentObject.setSize(vs.width, vs.height);
							}
							tile.add(tile.contentObject);
							tile.doLayout();
						}
						_this.renderIndex++;
						_this.loadJs();
					});
				}
			}
		}
	});
}
if(Wlj.search){
	Wlj.widgets.search.window.TaskItem.prototype.defaultWljPage = '/contents/frameControllers/wlj-function.html';
};
