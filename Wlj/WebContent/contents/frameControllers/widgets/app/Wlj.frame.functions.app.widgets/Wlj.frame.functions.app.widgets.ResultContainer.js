Ext.ns('Wlj.frame.functions.app.widgets');

/**
 * 页面查询结果列表容器;
 */
Wlj.frame.functions.app.widgets.ResultContainer = Ext.extend(Ext.Panel, {
	
	needGrid : true,
	needTbar : true,
	autoLoadGrid : true,
	
	singleSelect : false,
	multiSelectSeparator : false,
	
	gridLockedHole : false,
	gridLockedOnce : false,
	
	hoverXY : false,
	
	suspendViews : false,
	suspendViewsWidth : 0,
	alwaysLockCurrentView : false,
	
	tbarButtonAlign : 'left',
	tbarViewAlign : 'left',
	
	needRN : false,
	rnWidth : false,
	
	CREATE_VIEW:'createView',
	EDIT_VIEW:'editView',
	DETAIL_VIEW:'detailView',
	GRID_VIEW : 'gridView',
	
	createView : true,
	editView : true,
	detailView : true,
	
	createFieldsCopy : false,
	editFieldsCopy : false,
	detailFieldsCopy :false,
	
	createFormViewer : false,
	editFormViewer : false,
	detailFormViewer : false,
	
	createValidates : false,
	editValidates : false,
	
	createLinkages : false,
	editLinkages : false,
	
	createViewText : '新增',
	editViewText : '修改',
	detailViewText : '详情',	
	gridViewText : '列表',
	
	pageSize : 10,
	
	url : false,
	dataFields : [],
	jsonRoot : 'json.data',
	jsonCount : 'json.count',
	
	store : false,
	currentParams : {},
	formButtons : false,
	
	resultDomainCfg : false,
	pagSrollingLevel : 'top',
	
	viewPanel : {
		createView : false,
		editView : false,
		detailView : false
	},
	
	easingStrtegy : false,
	/**
	 * resize事件
	 */
	beresized : function(p,aw,ah,rw,rh){
		var h = parseInt(ah, 10), w = parseInt(aw, 10);
		var vh,vw;
		var _this = this;
		if(Ext.isNumber(h)){
			if(_this.needTbar){
				var theight = this.tbar.getViewSize().height;
				vh = h - theight;/**to check**/
			}else{
				vh = h;
			}
			if(!this._APP.needCondition){
				vh = vh - 8;
			}
			if(vh < 0){
				vh = 0;
			}
		}
		if(Ext.isNumber(w)){
			vw = w;
		}
		Ext.iterate(this.viewPanel, function(key, panel){
			if(panel){
				if(vh)
					panel.setHeight(vh);
				if(vw){
					if(panel.rendered){
						if(!_this.suspendViews)
							panel.setWidth(vw);
						if(panel !== _this.currentView){
							panel.el.applyStyles({
								left : vw + 'px'
							});
						}else{
							panel.el.applyStyles({
								left : (vw - panel.el.getViewSize().width) + 'px'
							});
						}
					}
				}
			}
		});
		Ext.each(this.customerViewPanels, function(panel){
			if(vh){
				panel.setHeight(vh);
				if(panel.assistantView && panel.assistantView.setHeight){
					panel.assistantView.setHeight(vh);
				}
			}
			if(vw){
				if(panel.rendered){
					if(!_this.suspendViews)
						panel.setWidth(vw);
					if(panel !== _this.currentView){
						panel.el.applyStyles({
							left : vw + 'px'
						});
					}else{
						panel.el.applyStyles({
							left : (vw - panel.el.getViewSize().width) + 'px'
						});
					}
				}
			}
		});
		if(this.needGrid){
			if(vh)
				this.searchGridView.setHeight(vh);
			if(vw){
				this.searchGridView.setWidth(vw);
				if(this.gridOuted){
					Ext.fly(this.searchGridView.el).applyStyles({
						marginLeft : -vw + 'px'
					});
				}
			}
		}
	},
	
	initComponent : function(){
		var _this = this;
		_this.validateFieldsCfg();
		_this._APP.fireEvent('beforeresultinit', _this, _this._APP);
		if(_this.needTbar){
			var pbs = [];
			if(_this.tbarButtonAlign === 'right'){
				pbs.push('->');
			}
			if(Ext.isArray(this.tbar)){
				for(var i=0;i<this.tbar.length;i++){
					if(Ext.isObject(this.tbar[i]) && this.tbar[i].text){
						if(!this.tbar[i].iconCls){
							this.tbar[i].iconCls = 'ico-w-'+Math.ceil(Math.random()*100);
						}
						pbs.push(this.tbar[i]);
					}
				}
			}
			if(_this.tbarViewAlign === 'right'){
				if(_this.tbarButtonAlign !== 'right'){
					pbs.push('->');
				}else{
					if(pbs.length>0)
						pbs.push('-');
				}
			}else{
				if(pbs.length>0){
					pbs.push('-');
				}
			}
			
			if(!_this.suspendViews)
				pbs.push({
					text : this.gridViewText,
					hidden : !this.needGrid,
					handler : function(){
						_this.gridMoveIn();
					},
					listeners : {
						afterrender : function(button){
							_this.gridButton = button;
							_this.gridButton.toggle(true,true);
						}
					}
				});
			this.tbar = pbs;
		}else{
			delete this.tbar;
		}
		Wlj.frame.functions.app.widgets.ResultContainer.superclass.initComponent.call(this);
		_this._APP.fireEvent('afterresultinit', _this, _this._APP);
		_this._APP.fireEvent('beforeresultrender', _this, _this._APP);
	},
	validateFieldsCfg : function(){
		var dfs = this.dataFields;
		var targetFs = [];
		for(var i=0;i<dfs.length; i++){
			if(!dfs[i].name){
				continue;
			}else{
				if(!dfs[i].text){
					dfs[i].text = dfs[i].name;
					dfs[i].hidden = true;
				}
				targetFs.push(dfs[i]);
			}
		}
		this.dataFields = targetFs;
	},
	onRender : function(ct, position){
		var _this = this;
		this.width = this.vs.width;
		this.height = this.vs.height;
		Wlj.frame.functions.app.widgets.ResultContainer.superclass.onRender.call(this, ct, position);
		if(this.needGrid){
			this.initStore();
			this.searchGridView = new Wlj.frame.functions.app.widgets.SearchGrid({
				store : this.store,
				searchDomain : this,
				_APP : this._APP,
				hoverXY : this.hoverXY,
				pageSize : this.pageSize,
				needRN : this.needRN,
				rnWidth : this.rnWidth,
				easingStrtegy : this.easingStrtegy,
				columnGroups : (this.resultDomainCfg && this.resultDomainCfg.columnGroups) ? this.resultDomainCfg.columnGroups : false,
				pagSrollingLevel : this.pagSrollingLevel
			});
			this.add(this.searchGridView);
			this.searchGridView.on('recordselect', function(record, store,tile){
				_this.fireEvent('recordselect', record, store,tile);
				if(_this.currentView){
					var showable = _this.fireEvent('beforeviewshow',_this.currentView);
					if(showable === false){
						return false;
					}else{
						if(_this.currentView.hasListener('moveout')){
							_this.currentView.fireEvent('moveout');
						}
						if(_this.currentView.hasListener('movein')){
							_this.currentView.fireEvent('movein',record);
						}
						_this.fireEvent('viewshow',_this.currentView);
					}
				}
			});
			this.searchGridView.on('rowdblclick', function(tile, record){
				_this.fireEvent('rowdblclick', tile, record);
			});
			this.searchGridView.on({
				beforefieldlock : {
					fn : function(tf){
						return _this.fireEvent('beforefieldlock', tf);
					},
					scope : _this,
					delay : 0
				},
				beforefieldunlock : {
					fn : function(tf){
						return _this.fireEvent('beforefieldunlock', tf);
					},
					scope : _this,
					delay : 0
				},
				fieldlock : {
					fn : function(tf){
						_this.fireEvent('fieldlock', tf);
					},
					scope : _this,
					delay : 0
				},
				fieldunlock : {
					fn : function(tf){
						_this.fireEvent('fieldunlock', tf);
					},
					scope : _this,
					delay : 0
				}
			});
		}
		this.initViews();
		if(this.needGrid){
			if(this.autoLoadGrid){
				var pars = this._APP.searchDomain.searchPanel.getForm().getFieldValues();
				for(var key in pars){
					if(!pars[key]){
						delete pars[key];
					}
				}
				this._APP.setSearchParams(pars,true,true);
			}
		}else{
			this.showView(this.firstView());
		}
		this.initEvents();
		var _this = this;
		this.el.on('contextmenu', function(eve){
			eve.stopEvent();
			_this.onContextMenu(eve, []);
		});
	},
	afterRender : function(){
		Wlj.frame.functions.app.widgets.ResultContainer.superclass.afterRender.call(this);
		this._APP.fireEvent('afterresultrender', this, this._APP);
	},
	initEvents : function(){
		this.addEvents({
			beforeviewshow : true,
			viewshow : true,
			beforeviewhide : true,
			viewhide : true,
			recorddelete : true,
			beforevalidate :true,
			validate : true,
			recordselect : true,
			beforecreateviewrender : true,
			aftercreateviewrender : true,
			beforeeditviewrender : true,
			aftereditviewrender : true,
			beforedetailviewrender : true,
			afterdetailviewrender : true,
			rowdblclick : true,
			beforefieldlock : true,
			beforefieldunlock : true,
			fieldlock : true,
			fieldunlock : true
		});
		this.on('resize',this.beresized);
	},
	initViews : function(){
		var thisVs = this.vs;
		var _this = this;
		
		var supportWidth = 0;
		if(!this.suspendViews){
			supportWidth = thisVs.width - 12;
		}else{
			if(this.suspendViewsWidth>thisVs.width-12-this.rnWidth){
				supportWidth = thisVs.width-12-this.rnWidth -30;
			}else{
				supportWidth= this.suspendViewsWidth;
			}
		}
		
		function buildWidth(supportWidth, vscontainer, formCfg){
			if(formCfg.suspendFitAll){
				return vscontainer.width;
			}else if(Ext.isNumber(formCfg.suspendWidth)){
				if(formCfg.suspendWidth>1){
					return formCfg.suspendWidth;
				}else{
					return vscontainer.width * formCfg.suspendWidth;
				}
			}else{
				return supportWidth;
			}
		}
		if(this[this.CREATE_VIEW]){
			var CVIEWCFG = {
				ownerDomain : this,
				ownerApp : this._APP,
				vs : {
					height : thisVs.height - 37,
					width : _this.suspendViews ? buildWidth(supportWidth, thisVs, this.createFormCfgs) : supportWidth
				},
				title : this[this.CREATE_VIEW+'Text'],
				formViewer : this.createFormViewer,
				fields : this.createFieldsCopy,
				validates : this.createValidates,
				linkages : this.createLinkages,
				baseType : this.CREATE_VIEW,
				suspended : this.suspendViews,
				tabIco : 'ico-w-6'
			};
			Ext.apply(CVIEWCFG,this.createFormCfgs);
			this.viewPanel[this.CREATE_VIEW] = new Wlj.frame.functions.app.widgets.CView(CVIEWCFG);
			this.viewPanel[this.CREATE_VIEW].on({
				moveout : {
					fn : this.viewPanel[this.CREATE_VIEW].reset,
					scope : this.viewPanel[this.CREATE_VIEW],
					delay : 0
				},
				beforevalidate : {
					fn : function(view, panel){
						return _this.fireEvent('beforevalidate', view, panel);
					},
					scope : _this,
					delay : 0
				},
				validate : {
					fn : function(view, panel, error){
						_this.fireEvent('validate', view, panel,error);
					},
					scope : _this,
					delay : 0
				},
				afterviewrender : {
					fn : function(view){
						_this.fireEvent('aftercreateviewrender', view);
					},
					scope : _this,
					delay : 0
				}
			});
			//this.viewPanel[this.CREATE_VIEW].render(this.body);
		}
		if(this[this.EDIT_VIEW]){
			var EVIEWCFG = {
				ownerDomain : this,
				ownerApp : this._APP,
				vs : {
					height : thisVs.height - 37,
					width : _this.suspendViews ? buildWidth(supportWidth, thisVs, this.editFormCfgs) : supportWidth
				},
				title : this[this.EDIT_VIEW+'Text'],
				formViewer : this.editFormViewer,
				fields : this.editFieldsCopy,
				validates : this.editValidates,
				linkages : this.editLinkages,
				baseType : this.EDIT_VIEW,
				suspended : this.suspendViews,
				tabIco : 'ico-w-79'
			};
			Ext.apply(EVIEWCFG, this.editFormCfgs);
			this.viewPanel[this.EDIT_VIEW] =new Wlj.frame.functions.app.widgets.CView(EVIEWCFG);
			this.viewPanel[this.EDIT_VIEW].on({
				moveout : {
					fn : this.viewPanel[this.EDIT_VIEW].reset,
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				movein : {
					fn : this.viewPanel[this.EDIT_VIEW].setRecord,
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				beforeloadrecord : {
					fn : function(view, record){
						return _this._APP.fireEvent('beforeeditload', view, record);
					},
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				loadrecord : {
					fn : function(view, record){
						_this._APP.fireEvent('aftereditload', view, record);
					},
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				beforevalidate : {
					fn : function(view, panel){
						return _this.fireEvent('beforevalidate', view, panel);
					},
					scope : _this,
					delay : 0
				},
				validate : {
					fn : function(view, panel, error){
						_this.fireEvent('validate', view, panel,error);
					},
					scope : _this,
					delay : 0
				},
				afterviewrender : {
					fn : function(view){
						_this.fireEvent('aftereditviewrender', view);
					},
					scope : _this,
					delay : 0
				}
			});
			//this.viewPanel[this.EDIT_VIEW].render(this.body);
		}
		if(this[this.DETAIL_VIEW]){
			var DVIEWCFG = {
				ownerDomain : this,
				ownerApp : this._APP,
				svButton : false,
				vs : {
					height : thisVs.height - 37,
					width :_this.suspendViews ? buildWidth(supportWidth, thisVs, this.detailFormCfgs) : supportWidth
				},
				title : this[this.DETAIL_VIEW+'Text'],
				formViewer : this.detailFormViewer,
				fields : this.detailFieldsCopy,
				baseType : this.DETAIL_VIEW,
				suspended : this.suspendViews,
				tabIco : 'ico-w-27'
			};
			Ext.apply(DVIEWCFG, this.detailFormCfgs);
			this.viewPanel[this.DETAIL_VIEW] =new Wlj.frame.functions.app.widgets.CView(DVIEWCFG);
			this.viewPanel[this.DETAIL_VIEW].on({
				moveout : {
					fn : this.viewPanel[this.DETAIL_VIEW].reset,
					scope : this.viewPanel[this.DETAIL_VIEW],
					delay : 0
				},
				movein : {
					fn : this.viewPanel[this.DETAIL_VIEW].setRecord,
					scope : this.viewPanel[this.DETAIL_VIEW],
					delay : 0
				},
				beforeloadrecord : {
					fn : function(view, record){
						return _this._APP.fireEvent('beforedetailload', view, record);
					},
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				loadrecord : {
					fn : function(view, record){
						_this._APP.fireEvent('afterdetailload', view, record);
					},
					scope : this.viewPanel[this.EDIT_VIEW],
					delay : 0
				},
				afterviewrender : {
					fn : function(view){
						_this.fireEvent('afterdetailviewrender', view);
					},
					scope : _this,
					delay : 0
				}
			});
			//this.viewPanel[this.DETAIL_VIEW].render(this.body);
		}
		this.createCustomerViews();
	},
	clearViews : function(){
		
		this.createFormViewer = false;
		this.createFieldsCopy = false;
		this.createFormCfgs = false;
		
		this.editFormViewer = false;
		this.editFieldsCopy = false;
		this.editFormCfgs = false;
		
		this.detailFormViewer = false;
		this.detailFieldsCopy = false;
		this.detailFormCfgs = false;
		
	},
	createCustomerViews : function(){
		var customerViewCfg = this._APP.customerView;
		if(!Ext.isArray(customerViewCfg)){
			return;
		}
		var _this = this;
		var thisVs = this.el.getViewSize();
		
		var supportWidth = 0;
		if(!this.suspendViews){
			supportWidth = thisVs.width;
		}else{
			if(this.suspendViewsWidth>thisVs.width-12-this.rnWidth){
				supportWidth = thisVs.width-12-this.rnWidth -30;
			}else{
				supportWidth= this.suspendViewsWidth;
			}
		}
		
		Ext.each(customerViewCfg, function(cvc){
			if(!_this.customerViewPanels){
				_this.customerViewPanels = [];
			}
			var vTitile = cvc.title;
			var viewType = cvc.type;
			delete cvc.title;
			
			function buildWidth(supportWidth, vscontainer, formCfg){
				if(formCfg.suspendFitAll){
					return vscontainer.width;
				}else if(Ext.isNumber(formCfg.suspendWidth)){
					if(formCfg.suspendWidth>1){
						return formCfg.suspendWidth;
					}else{
						return vscontainer.width * formCfg.suspendWidth;
					}
				}else{
					return supportWidth;
				}
			}
			
			var cvcCfg = {
				title : vTitile? vTitile : 'Bview',
				vs : {
					height : thisVs.height - (_this.needTbar ? 37 : 0),
					width : _this.suspendViews? buildWidth(supportWidth, thisVs, cvc) : supportWidth
				},
				ownerDomain : _this,
				ownerApp : _this._APP,
				suspended : _this.suspendViews
			};
			Ext.apply(cvcCfg, cvc);
			
			if(!cvcCfg.tabIco){
				cvcCfg.tabIco = 'ico-w-'+Math.ceil(Math.random()*100);
			}
			
			var cvcp = false;
			if(viewType === 'form'){
				cvcp = new Wlj.frame.functions.app.widgets.FormView(cvcCfg);
			}else if(viewType === 'grid'){
				cvcp = new Wlj.frame.functions.app.widgets.GridView(cvcCfg);
			}else{
				cvcp = new Wlj.frame.functions.app.widgets.BView(cvcCfg);
			}
			_this.customerViewPanels.push(cvcp);
			//cvcp.render(_this.body);
		});
	},
	showView : function(viewType){
		if(!viewType){
			return;
		}
		var hideable = this.hideCurrentView();
		if(hideable === false){
			return false;
		}
		if(this.needGrid){
			this.gridMoveOut();
		}
		var thisVs = this.el.getViewSize();
		if(!viewType.rendered){
			viewType.render(this.body);
			viewType.el.applyStyles({
				left :  thisVs.width + 'px'
			});
		}
		var showable = this.fireEvent('beforeviewshow',viewType);
		if(showable === false){
			return false;
		}
		/***
		 * TODO FIT ALL
		 */
		var viewVs = viewType.el.getViewSize();
		var ccEl = viewType.el;
		ccEl.animate({
			left : {
				to : thisVs.width - viewVs.width,
				from : thisVs.width
			}
		},
		0.5,
		null,
		null,
		'run');
		this.currentView = viewType;
		viewType.fireEvent('movein',this.searchGridView?this.searchGridView.getSelected()[this.searchGridView.getSelected().length-1]:'');
		if(this.needTbar){
			this.currentView.togogleButton.toggle(true,true);
		}
		this.fireEvent('viewshow',this.currentView);
	},
	hideCurrentView : function(){
		if(this.currentView){
			var hideable = this.fireEvent('beforeviewhide',this.currentView);
			if(hideable === false){
				return false;
			}
			/**
			 * TODO FIT ALL
			 */
			var thisVs = this.el.getViewSize();
			var cvEl = this.currentView.el;
			cvEl.animate({
				left:{from:cvEl.getLeft(),to:thisVs.width}
			},
			0.5,
			null,
			'easeOut',
			'run');
			this.currentView.fireEvent('moveout');
			this.fireEvent('viewhide',this.currentView);
			if(this.currentView.assistantView){
				this.currentView.hideAssistant();
			}
			if(this.needTbar){
				this.currentView.togogleButton.toggle(false,true);
			}
			this.currentView = false;
		}
	},
	initStore : function(){
		var url = this.url;
		if(!url){
			return;
		}
		var fields = this.createStoreFields();
		var jsonRoot = this.jsonRoot;
		var jsonCount = this.jsonCount;
		var store = new Ext.data.Store({
			restful:true,	
	        proxy : new Ext.data.HttpProxy({url:url}),
	        reader : new Ext.data.JsonReader({
	        	totalProperty : jsonCount,
	        	root : jsonRoot
	        },fields)
		});
		this.store = store;
	},
	createStoreFields : function(){
		var fields = this.dataFields;
		var sFields = [];
		Ext.each(fields, function(f){
			if(f.dataType && WLJDATATYPE[f.dataType]){
				f.type = WLJDATATYPE[f.dataType].getStoreType();
				Ext.applyIf(f, WLJDATATYPE[f.dataType].getStoreSpecialCfg());
			}
			//if(f.gridField !== false){
				sFields.push(f);
			//}
		});
		return sFields;
	},
	gridMoveOut : function(){
		if(this.gridLockedHole){
			return;
		}
		var _this = this;
		var layTargetEl = Ext.fly(_this.getLayoutTarget());
		_this.searchGridView.el.animate({
			marginLeft : {from : 0, to : -layTargetEl.getViewSize().width}
		},
		.35,
		 null,      
		 'easeOut', 
		'run' );
		_this.gridOuted = true;
		if(this.needTbar){
			_this.gridButton.toggle(false,true);
		}
	},
	gridMoveIn : function(){
		if(this.gridLockedHole){
			return;
		}
		var _this = this;
		_this.hideCurrentView();
		var layTargetEl = Ext.fly(_this.getLayoutTarget());
		_this.searchGridView.el.animate({
			marginLeft : {to : 0, from : -layTargetEl.getViewSize().width}
		},
		.35,
		 null,      
		 'easeOut', 
		'run' );
		_this.gridOuted = false;
		if(this.needTbar){
			_this.gridButton.toggle(true,true);
		}
	},
	destroy : function(){
		for(var key in this.viewPanel){
			if(this.viewPanel[key].destroy){
				this.viewPanel[key].destroy();
				this.viewPanel[key] = false;
			}
		}
		this.clearViews();
		this.currentView = false;
		if(Ext.isArray(this.customerViewPanels)){
			for(var i=0;i<this.customerViewPanels.length;i++){
				this.customerViewPanels[i].destroy();
			}
			delete this.customerViewPanels;
		}
		if(this.searchGridView && this.searchGridView.destroy){
			this.searchGridView.destroy();
			this.searchGridView = null;
		}
		if(this.store){
			this.store.removeAll();
			this.store.destroy();
			this.store = null;
		}
		this.url = false;
		this.dataFields = [];
		this.jsonRoot = 'json.data';
		this.jsonCount = 'json.count';
		this.currentParams = {};
		Wlj.frame.functions.app.widgets.ResultContainer.superclass.destroy.call(this);
		
	},
	onMetaAdd : function(field){
		this.dataFields.push(field);
		this.onMetaChange();
		this.searchGridView.onMetaAdd(field);
	},
	onMetaAddAfter : function(addField, theField){
		var theIndex = this.getFieldIndex(theField);
		this.dataFields.splice(theIndex+1,0,addField);
		this.onMetaChange();
		this.searchGridView.onMetaAddByIndex(addField, theIndex+1);
	},
	onMetaAddBefore : function(addField, theField){
		var theIndex = this.getFieldIndex(theField);
		this.dataFields.splice(theIndex,0,addField);
		this.onMetaChange();
		this.searchGridView.onMetaAddByIndex(addField, theIndex);
	},
	getFieldIndex : function(theField){
		for(var i=0; i<this.dataFields.length; i++){
			if(this.dataFields[i].name === theField){
				return i;
			}
		}
		return i;
	},
	onMetaRemove : function(field){
		for(var i=0;i<this.dataFields.length;i++){
			if(this.dataFields[i].name === field){
				if(this.dataFields[i].lockingView == true){
					Ext.warn('警告','锁定字段不能被移除');
					return false;
				}
				this.dataFields.remove(this.dataFields[i]);
				break;
			}
		}
		this.searchGridView.onMetaRemove(field);
		this.onMetaChange();
	},
	storeMetaChange : function(){
		var readerMeta = {
			totalProperty : this.jsonCount,
			root : this.jsonRoot,
			fields : this.createStoreFields()
		};
		this.store.reader.onMetaChange(readerMeta);
	},
	onMetaChange : function(){
		this.storeMetaChange();
		var rs = [];
		if(this.store.getCount()>0){
			rs = this.store.reader.readRecords(this.store.reader.jsonData);
		}
		this.store.removeAll();
		if(rs.success && rs.totalRecords>0){
			this.store.loadRecords( rs, this.store.lastOptions , true);
		}
	},
	/*******************public API***************/
	nextPageHandler : function(){
		this.searchGridView.nextPageHandler();
	},
	prePageHandler : function(){
		this.searchGridView.prePageHandler();
	},
	firstPageHandler : function(){
		this.searchGridView.firstPageHandler();
	},
	lastPageHandler : function(){
		this.searchGridView.lastPageHandler();
	},
	gridViewHandler : function(){
		this.gridMoveIn();
	},
	getTotleViewIndex : function(view){
		var index = -1;
		if(this.viewPanel[this.CREATE_VIEW]){
			if(view === this.viewPanel[this.CREATE_VIEW]){
				return index + 1;
			}else{
				index++;
			}
		}
		if(this.viewPanel[this.EDIT_VIEW]){
			if(view === this.viewPanel[this.EDIT_VIEW]){
				return index + 1;
			}else{
				index++;
			}
		}
		if(this.viewPanel[this.DETAIL_VIEW]){
			if(view === this.viewPanel[this.DETAIL_VIEW]){
				return index + 1;
			}else{
				index++;
			}
		}
		var cvi = this.getCustomerViewIndex(view);
		return index+cvi+1;
	},
	getCustomerViewIndex : function(view){
		return this.customerViewPanels.indexOf(view);
	},
	getViewByTotleIndex : function(index){
		if(!Ext.isNumber(index)){
			return false;
		}
		var ci = parseInt(index);
		if(this.viewPanel[this.CREATE_VIEW]){
			if(ci == 0){
				return this.viewPanel[this.CREATE_VIEW];
			}
			ci--;
		}
		if(this.viewPanel[this.EDIT_VIEW]){
			if(ci == 0){
				return this.viewPanel[this.EDIT_VIEW];
			}
			ci--;
		}
		if(this.viewPanel[this.DETAIL_VIEW]){
			if(ci == 0){
				return this.viewPanel[this.DETAIL_VIEW];
			}
			ci--;
		}
		return this.customerViewPanels[ci] ? this.customerViewPanels[ci] : false;
	},
	firstView : function(){
		if(this.viewPanel[this.CREATE_VIEW])
			return this.viewPanel[this.CREATE_VIEW];
		if(this.viewPanel[this.EDIT_VIEW])
			return this.viewPanel[this.EDIT_VIEW];
		if(this.viewPanel[this.DETAIL_VIEW])
			return this.viewPanel[this.DETAIL_VIEW];
		if(this.customerViewPanels.length > 0)
			return this.customerViewPanels[0];
		return false;
	},
	showNextView : function(){
		var nextView = this.getViewByTotleIndex(this.getTotleViewIndex(this.currentView)+1);
		if(nextView){
			this.showView(nextView);
		}else{
			this.showView(this.firstView());
		}
	},
	createTbarMenu : function(){
		var tbarMenus = [];
		if(this.needTbar){
			this.topToolbar.items.each(function(button){
				if(button.text && button.handler && !button.hidden){
					var menuCfg = {};
					menuCfg.text = button.text;
					menuCfg.tbutton = button;
					menuCfg.handler = button.handler;
					tbarMenus.push(menuCfg);
				}
			});
		}
		return tbarMenus;
	},
	onContextMenu : function(eve, added){
		this._APP.onContextMenu(eve, added);
	}
});
Ext.reg('resultcontainer', Wlj.frame.functions.app.widgets.ResultContainer);

