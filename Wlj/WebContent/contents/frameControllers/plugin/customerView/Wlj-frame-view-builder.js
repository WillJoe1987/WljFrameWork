Ext.ns('Wlj.frame.view.app');
Wlj.frame.view.app.Builder = function(){
	Wlj.frame.view.app.Builder.superclass.constructor.call(this);
	this.codeLoad();
};
Ext.extend(Wlj.frame.view.app.Builder,Ext.util.Observable,{
	resId : false,
	codeFile : false,
	codeLoad : function(){
		this.resId = JsContext._resId;
		if(!this.resId){
			Ext.error(WERROR.NORESIDERROR);
			return false;
		}
		this.getCodeFilePage();
		if(!this.codeFile){
			Ext.error(WERROR.NOCODEFILEERROR);
			return false;
		}
		this.codeLoading();
	},
	getCodeFilePage : function(){
		this.codeFile = url;
	},
	codeLoading : function(){
		if(this.codeFile.indexOf('.jsp') >= 0){
			window.location.href = basepath + this.codeFile+'?resId='+this.resId;
		}else{
			var _this = this;
			Ext.ScriptLoader.loadScript({
				scripts: [
				          basepath + this.codeFile
				          ],
				finalCallback: function(response){
					_this.codeCheck();
				}
			});
		}
	},
	
	codeCheck : function(){
		if(!window.comitUrl){
			window.comitUrl = window.url;
		}
		if(window.createView){
			if(!window.createFormViewer){
				window.createFormViewer = window.formViewers;
			}
			if(!window.createFormCfgs){
				window.createFormCfgs = window.formCfgs;
			}
			if(!window.createValidates){
				window.createValidates = window.validates;
			}
			if(!window.createLinkages){
				window.createLinkages = window.linkages;
			}
		}
		if(window.editView){
			if(!window.editFormViewer){
				window.editFormViewer = window.formViewers;
			}
			if(!window.editFormCfgs){
				window.editFormCfgs = window.formCfgs;
			}
			if(!window.editValidates){
				window.editValidates = window.validates;
			}
			if(!window.editLinkages){
				window.editLinkages = window.linkages;
			}
		}
		if(window.detailView){
			if(!window.detailFormViewer){
				window.detailFormViewer = window.formViewers;
			}
			if(!window.detailFormCfgs){
				window.detailFormCfgs = window.formCfgs;
			}
		}
		if(Ext.isObject(window.listeners)){
			for(var key in listeners){
				if(listeners[key]===true && Ext.isFunction(window[key])){
					listeners[key] = window[key];
				}else{
					delete listeners[key] ;
				}
			}
		}
		
		this.APPCFG = {
			needCondition : window.needCondition,
			needTbar : window.needTbar,
			needGrid : window.needGrid,
			autoLoadGrid : window.autoLoadGrid,
			url : window.url,
			comitUrl : window.comitUrl,
			fields : window.fields,
			createView : window.createView,
			editView : window.editView,
			detailView : window.detailView,
			createFormViewer : window.createFormViewer,
			editFormViewer : window.editFormViewer,
			detailFormViewer : window.detailFormViewer,
			lookupTypes : window.lookupTypes,
			localLookup : window.localLookup,
			createValidates : window.createValidates,
			editValidates : window.editValidates,
			createLinkages : window.createLinkages,
			editLinkages : window.editLinkages,
			edgeVies : window.edgeVies,
			customerView : window.customerView,
			listeners : window.listeners,
			tbar : window.tbar,
			createFormCfgs : window.createFormCfgs,
			editFormCfgs : window.editFormCfgs,
			detailFormCfgs : window.detailFormCfgs
		};
		this.buildApp();
	},
	buildApp : function(){
		window._app = new Wlj.frame.functions.app.App(this.APPCFG);
	},
	clearGlobalHandler : function(){
		/**
		 * TODO To clear the handlers what are defined by developers and used by the APP object.
		 * 		Now the clearing function is defined and called by the APP object. But I don't think it's a good idea.
		 */
	},
	/**
	 * Reload current application
	 */
	reload : function(){},
	/**
	 * Change the resId property, and load the new page application.
	 * In fact, it's the logic what dose the page turning to.
	 */
	setResId : function(resId){
		window._app.destroy();
		window._app = null;
		JsContext._resId = resId;
		this.codeLoad();
	}
});
Ext.onReady(function(){
	window.APPBUILD = new Wlj.frame.view.app.Builder();
});