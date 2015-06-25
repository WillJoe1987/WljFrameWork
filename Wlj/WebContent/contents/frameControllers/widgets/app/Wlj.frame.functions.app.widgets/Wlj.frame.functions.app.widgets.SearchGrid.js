Ext.ns('Wlj.frame.functions.app.widgets');

Wlj.frame.functions.app.widgets.SearchGrid = Ext.extend(Ext.Panel, {
	
	pageSize : 10,
	pagable : true,
	easingStrtegy : false,
	store : false,
	currentParams : {},
	autoScroll : false,
	rnWidth : 40,
	needRN : false,
	columnGroups : false,
	
	beresized : function(p,aw,ah,rw,rh){
		var h = parseInt(ah, 10);
		var titleH = this.titleTile.titleTile.el.getViewSize().height;
		var bbarH = this.bbar ? this.bbar.getViewSize().height : 0;
		var bh = h - titleH - 2 - bbarH;
		var w = parseInt(aw, 10);
		if(this.lockingViewBuilder){
			w = w - this.lockingViewBuilder.viewWidth;
		}
		if(Ext.isNumber(bh)){
			this.scrollElement.applyStyles({
				height : bh + 'px'
			});
			if(this.lockingViewBuilder){
				this.lockingViewBuilder.onResize(bh);
			}
		}
		if(Ext.isNumber(w)){
			this.dynaticElement.applyStyles({
				width : w + 'px'
			});
		}
	},
	onColumnResize : function(index, res, width, height, e, name, totleWidth){
		this.store.fields.get(name).resutlWidth = width;
		this.searchDomain.dataFields[index-1].resutlWidth = width;
		this.getLayoutTarget().applyStyles({
			width : totleWidth + 'px'
		});
		var rows = this.getRows();
		var len = rows.length;
		for(var i=0;i<len;i++){
			rows[i].style.width = totleWidth+'px';
			rows[i].childNodes[index].style.width = width+'px';
		}
	},
	initComponent : function(){
		var _this = this;
		if(this.pagable){
			this.pageSizeCombo = new Ext.form.ComboBox({
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : ['value', 'text'],
					data : [ [ 10, '10条/页' ], 
					         [ 20, '20条/页' ], 
					         [ 50, '50条/页' ],
					         [ 100, '100条/页' ], 
					         [ 250, '250条/页' ],
					         [ 500, '500条/页' ],
					         [ 1000, '1000条/页'] ]
				}),
				width:80,
				valueField : 'value',
				displayField : 'text',
				value : _this.pageSize,
				editable : false,
				listeners : {
					select : function(combo, record, index){
						var ps = parseInt(combo.getValue());
						_this.currBar.pageSize = ps;
						_this.searchDomain.pageSize = ps;
						_this.pageSize = ps;
						_this._APP.searchDomain.searchHandler();
					}
				}
			});
			
			this.bbar = new Wlj.frame.functions.app.widgets.PagingToolbar({
				pageSize : _this.pageSize,
				store : _this.store,
				displayInfo : true,
				emptyMsg : "没有符合条件的记录",
				items : ['-', '&nbsp;&nbsp;',this.pageSizeCombo],
				listeners:{
					'beforechange':function(a,b){
						if(!_this._APP.searchDomain.searchPanel.getForm().isValid()){
							Ext.Msg.alert("提示",'请填写必要的查询条件');
							return false;
						}
						pars = _this._APP.searchDomain.searchPanel.getForm().getFieldValues();
						for(var key in pars){
							if(!pars[key]){
								delete pars[key];
							}
						}
						var a = _this._APP.setSearchParams(pars,false,true);
						if(a!=undefined&&!a){
							return false;
						}
					}
				}
			});
			this.currBar = this.bbar;
			this.bbarCfg = {
					cls : 'yc-grid-footer'
			};
		}
		Wlj.frame.functions.app.widgets.SearchGrid.superclass.initComponent.call(this);
		if(!this.store){
			return;
		}
		this.initDataEvent();
	},
	
	destroy : function(){
		this.pageSizeCombo.destroy();
		this.pageSizeCombo = false;
		this.currBar.destroy();
		this.currBar = false;
		this.store = false;
		this.currentParams = {};
		Ext.destroy(this.hdElement);
		Ext.destroy(this.scrollElement);
		Ext.destroy(this.dtElement);
		delete this.hdElement;
		delete this.scrollElement;
		delete this.dtElement;
		Wlj.frame.functions.app.widgets.SearchGrid.superclass.destroy.call(this);
	},
	
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.SearchGrid.superclass.onRender.call(this, ct, position);
		this.initElements();
		this.on('resize',this.beresized);
	},
	createTbarMenu : function(added){
		var tbars = this.searchDomain.createTbarMenu();
		if(tbars.length > 0){
			added.push.apply(added, tbars);
			added.push('-');
		}
	},
	onMetaAdd : function(field){
		this.titleTile.onMetaAdd(field);
	},
	onMetaAddByIndex : function(addField, theIndex){
		this.titleTile.onMetaAddByIndex(addField, theIndex);
	},
	onMetaRemove : function(field){
		this.titleTile.onMetaRemove(field);
		this.dtElement.dom.style.width = this.titleTile.recordWidth+'px';
	},
	onContextMenu : function(eve, html, obj, added){
		var row = Ext.fly(html).parent('.ygc-row');
		
		if(row){
			if(!row.hasClass('ygc-row-selected')){
				this.onRowClick(eve, html, obj);
			}
			this.createTbarMenu(added);
		}
		
		var gmenus = WLJUTIL.contextMenus.grid;
		for(var key in gmenus){
			var amenu = {};
			amenu.text = gmenus[key].text;
			amenu.handler = gmenus[key].fn.createDelegate(this);
			added.push(amenu);
		}
		added.push('-');
		this.searchDomain.onContextMenu(eve,added);
	},
	initEvents : function(){
		this.addEvents({
			recorddelete : true,
			recordselect : true,
			rowdblclick : true
		});
		var _this = this;
		this.getLayoutTarget().on('click',function(eve, html, obj){
				_this.onRowClick(eve, html, obj);
		});
		this.getLayoutTarget().on('dblclick', function(eve, html, obj){
			eve.stopEvent();
			_this.onRowDblclick(eve, html, obj);
		});
		this.getLayoutTarget().on('mousedown', function(eve, html, obj){
			eve.stopEvent();
			if(Ext.fly(html).hasClass('ygc-cell-no') || Ext.fly(html).hasClass('ygc-row')){
				return false;
			}
			_this.createDragGhost(eve, html, obj);
		});
		this.el.on('contextmenu',function(eve, html, obj){
			eve.stopEvent();
			_this.onContextMenu(eve, html, obj, []);
		});
	},
	onRowClick : function(eve, html, obj){
		var _this = this;
		var row = Ext.fly(html).hasClass('ygc-row')?Ext.fly(html):Ext.fly(html).parent('.ygc-row');
		if(!row){
			return false;
		}
		var rowIndex = parseInt(row.dom.getAttribute('rowIndex'));
		if(Ext.fly(html).hasClass('ygc-cell-no')){
			if(!row.hasClass('ygc-row-selected')){
				row.addClass('ygc-row-selected');
				_this.fireEvent('recordselect',this.store.getAt(rowIndex), this.store, html);
			}else{
				row.removeClass('ygc-row-selected');
			}
			return;
		}else{
			if(!row.hasClass('ygc-row-selected')){
				_this.clearSelect();
				row.addClass('ygc-row-selected');
				_this.fireEvent('recordselect',this.store.getAt(rowIndex), this.store, html);
			}else{
				_this.clearSelect();
				row.removeClass('ygc-row-selected');
			}
		}
	},
	onRowDblclick : function(eve, html, obj){
		var _this = this;
		var row = Ext.fly(html).parent('.ygc-row');
		var rowIndex = parseInt(row.dom.rowIndex);
		if(!row.hasClass('ygc-row-selected')){
			this.onRowClick(eve, html, obj);
		}
		_this.fireEvent('rowdblclick',html, this.store.getAt(rowIndex));
	},
	createDragGhost : function(eve, html, obj){
		var data = this.getCellData(html);
		if(this.store.fields.get(data.name).enableCondition === false){
			return false;
		}
		var ds = new Wlj.frame.functions.app.widgets.CellDD(Ext.fly(html), {
			dragData : {tile:{data:data}},
			ddGroup : 'searchDomainDrop'
		});
		ds.handleMouseDown(eve, ds);
	},
	initElements : function(){
		var Element = Ext.Element;
		var body = this.body;
		
		
		this.lockedElement = body.createChild({
			tag : 'div',
			style : 'width:10%;float:left;min-height:1px;'
		});
		
		this.dynaticElement = body.createChild({
			tag : 'div',
			style : 'width:89%;float:left;'
		});
		
		this.hdElement = this.dynaticElement.createChild({
			tag : 'div',
			cls : 'yc-grid-header',
			id : 'gridhdElement',
			style : 'width:100%;overflow:hidden;'
		});
		this.scrollElement = this.dynaticElement.createChild({
			tag : 'div',
			style : 'overflow-y:auto;'
		});
		this.dtElement = this.scrollElement.createChild({
			tag : 'div',
			style : 'min-height:1px;overflow-x:auto;'
		});
		
		this.createFieldsTitle();
	},
	getCellData : function(html){
		var row = Ext.fly(html).parent('.ygc-row');
		var rowIndex = parseInt(row.dom.getAttribute('rowIndex'));
		if(!Ext.fly(html).hasClass("ygc-cell")){
			html = Ext.fly(html).parent(".ygc-cell").dom;
		}
		var colIndex = Array.prototype.indexOf.call(row.dom.childNodes, html);
		var cellDT = this.titleTile.titleTile.items.itemAt(colIndex).data;
		cellDT.value = this.store.getAt(rowIndex).get(cellDT.name);
		return cellDT;
	},
	getLayoutTarget : function(){
		return this.dtElement;
	},
	createFieldsTitle : function(){
		var bwrap = this.bwrap;
		var body = this.body;
		var _this = this;
		this.titleTile = new Wlj.frame.functions.app.widgets.TitleTile({
			store : _this.store,
			vs : _this.vs,
			_APP : _this._APP,
			rnWidth : _this.rnWidth,
			searchGridView : _this,
			needRN : _this.needRN,
			easingStrtegy : _this.easingStrtegy,
			columnGroups : _this.columnGroups ? _this.columnGroups : false
		});
		this.titleTile.titleTile.render(this.hdElement);
		/**
		 * for the locking part.
		 */
		this.titleHeight = this.titleTile.titleTile.el.getViewSize().height;
		var hasLocking  = false;
		var len = this.store.fields.items.length;
		for(var i=0;i<len;i++){
			if(this.store.fields.items[i].lockingView === true){
				hasLocking = true;
				break;
			}
		}
		if(hasLocking){
			this.lockingViewBuilder = new Wlj.frame.functions.app.widgets.LockingTitles(this.lockedElement, this);
		}
		this.hdElement.applyStyles({
			height : this.titleHeight
		});
		this.titleTile.titleTile.el.applyStyles({
			top : 0,
			left : 0,
			marginTop : 0,
			marginLeft : 0
		});
		this.dtElement.applyStyles({
			width : this.titleTile.titleTile.el.getViewSize().width
		});
		this.scrollElement.on('scroll',function(){
			_this.synHDScroll();
			_this.synCKScroll();
		});
	},
	
	synCKScroll : function(){
		if(this.lockingViewBuilder){
			var sc = this.lockingViewBuilder.columnContainers;
			var top = this.scrollElement.dom.scrollTop;
			/**
			 * TODO use css property:margin-top . to be refix.
			 */
			for(var i=0;i<sc.length;i++){
				sc[i].dom.style.marginTop = -top;
			}
		}
	},
	
	synHDScroll : function(){
		var innerHd = this.hdElement.dom ;
		var scrollLeft = this.scrollElement.dom.scrollLeft;
		innerHd.scrollLeft = scrollLeft;
		innerHd.scrollLeft = scrollLeft; // second time for IE (1/2 time first fails, other browsers ignore)
		
//		if(innerHd.scrollLeft<scrollLeft){
//			innerHd.style.marginLeft = (innerHd.scrollLeft-scrollLeft) + 'px'
//		}else{
//			if(parseInt(innerHd.style.marginLeft)!=0){
//				innerHd.style.marginLeft = 0;
//			}
//		}
	},
	booterDataElements : function(store, records){
		var _this = store.resultContainer;
		_this.clearRows();
		_this.titleTile.bootEls();
	},
	hasRows : function(){
		var ltEl = this.getLayoutTarget();
		if(ltEl.dom.firstChild){
			return true;
		}else return false;
	},
	clearRows : function(){
		var _this = this;
		_this.getLayoutTarget().dom.innerHTML = '';
	},
	getRows : function(){
		var _this = this;
		if(!_this.hasRows()){
			return [];
		}else{
			return this.getLayoutTarget().dom.childNodes;
		}
	},
	initDataEvent : function(){
		if(!this.store){
			this.initStore();
		}
		if(this.store){
			this.store.on('add', this.onDataAdd);
			this.store.on('load', this.onDataLoad);
			this.store.on('exception', this.onExceptionLoad);
			this.store.on('beforeload', this.onBeforeLoad);
			this.store.on('remove', this.onDataRemove);
			this.store.on('clear', this.onDataClear);
			this.store.resultContainer = this;
		}
	},
	onDataAdd : function(store, records, index){
		var _this = store.resultContainer;
		_this.booterDataElements(store, records);
	},
	onDataLoad : function(store, records, option){
		var _this = store.resultContainer;
		_this.totalLength = store.totalLength;
		_this.booterDataElements(store, records);
		_this._APP.unmaskRegion('resultDomain');
		_this._APP.enableConditionButton(WLJUTIL.BUTTON_TYPE.SEARCH);
		
		/**
		 * TODO adjust the problem:data be added twice.
		 */
		if(_this.lockingViewBuilder){
			_this.lockingViewBuilder.clearDataEls();
			_this.lockingViewBuilder.bootDataEls();
		}
	},
	onExceptionLoad : function(store, records, option){
		var _this = this.resultContainer;
		_this._APP.unmaskRegion('resultDomain');
		_this._APP.enableConditionButton(WLJUTIL.BUTTON_TYPE.SEARCH);
	},
	onBeforeLoad : function(store, option){
		var _this = store.resultContainer;
		delete option.add;
		store.removeAll();
		if(_this.getLayoutTarget())
			_this.getLayoutTarget().innerHTML = '';
		_this._APP.maskRegion('resultDomain',_this.searchDomain.loadMaskMsg);
		_this._APP.disableConditionButton(WLJUTIL.BUTTON_TYPE.SEARCH);
	},
	onDataRemove : function(store, record, index){
		store.resultContainer.getLayoutTarget().dom.removeChild(store.resultContainer.getLayoutTarget().dom.childNodes[index]);
	},
	onDataClear : function(store){
		if(store.resultContainer.getLayoutTarget())
			store.resultContainer.getLayoutTarget().dom.innerHTML = '';
		if(store.resultContainer.lockingViewBuilder){
			store.resultContainer.lockingViewBuilder.clearDataEls();
		}
	},
	turnToCurrentPage : function(callbackFn){
		var _this = this;
		if(!this.store || !this.store.load){
			return false;
		}
		var pars = this.currentParams;
		this.store.baseParams = {"condition":Ext.encode(pars)};
		this.store.load({
			params : {
				start : 0 ,
				limit : _this.pageSize
			},callback : function(){
				if(!_this.searchDomain.gridLockedHole){
					if(!_this.searchDomain.gridLockedOnce){
						_this.searchDomain.gridMoveIn();
					}else{
						_this.searchDomain.gridLockedOnce = false;
					}
				}
				if(_this.searchDomain.suspendViews){
					if(!_this.searchDomain.alwaysLockCurrentView){
						_this.searchDomain.hideCurrentView();
					}
				}
				if(Ext.isFunction(callbackFn)){
					callbackFn();
				};
			}
		});
	},
	getSelected : function(){
		var _this = this;
		_this.selected = [];
		this.el.select('.ygc-row-selected').each(function(se){
			_this.selected.push(_this.store.getAt(parseInt(se.getAttribute('rowIndex'))));
		});
		return _this.selected;
	},
	selectByIndex : function(index){
		var _this = this;
		if(Ext.isNumber(index)){
			this.clearSelect();
			if(this.el.select('.ygc-row').item(parseInt(index)))
				this.el.select('.ygc-row').item(parseInt(index)).addClass('ygc-row-selected');
		}else if(Ext.isArray(index)){
			if(index.length>0){
				this.clearSelect();
				Ext.each(index, function(i){
					if(_this.el.select('.ygc-row').item(parseInt(i)))
						_this.el.select('.ygc-row').item(parseInt(i)).addClass('ygc-row-selected');
				});
			}
		}
	},
	clearSelect : function(){
		this.el.select('.ygc-row-selected').removeClass('ygc-row-selected');
	},
	antiSelect : function(){
		var rws = this.getLayoutTarget().select('.ygc-row', true);
		rws.each(function(el){
			if(!el.hasClass('ygc-row-selected')){
				el.addClass('ygc-row-selected');
			}else{
				el.removeClass('ygc-row-selected');
			}
		});
	},
	allSelect : function(){
		this.getLayoutTarget().select('.ygc-row').addClass('ygc-row-selected');
	},
	sort : function(dataIndex, info){
		this.titleTile.updateSortIcon(dataIndex, info);
		this.store.sort(dataIndex, info);
		this.booterDataElements(this.store);
	},
	showFields : function(fields){
		var indexes = this.getFieldsIndex(fields);
		for(var i=0;i<indexes.length;i++){
			this.store.fields.get(indexes[i]).hidden = false;
			this.searchDomain.dataFields[indexes[i]].hidden = false;
		}
		this.titleTile.showFields(indexes);
		var rows = this.getRows();
		for(var i=0;i<rows.length;i++){
			for(var c=0; c<indexes.length; c++){
				if(indexes[c]>=0 && indexes[c] < rows[i].childNodes.length){
					rows[i].childNodes[indexes[c]+1].style.display='block';
				}
			}
			rows[i].style.width = this.titleTile.recordWidth+'px';
		}
		this.dtElement.dom.style.width = this.titleTile.recordWidth+'px';
	},
	hideFields : function(fields){
		var indexes = this.getFieldsIndex(fields);
		for(var i=0;i<indexes.length;i++){
			this.store.fields.get(indexes[i]).hidden = true;
			this.searchDomain.dataFields[indexes[i]].hidden = true;
		}
		this.titleTile.hideFields(indexes);
		var rows = this.getRows();
		for(var i=0;i<rows.length;i++){
			for(var c=0; c<indexes.length; c++){
				if(indexes[c]>=0 && indexes[c] < rows[i].childNodes.length){
					rows[i].childNodes[indexes[c]+1].style.display='none';
				}
			}
			rows[i].style.width = this.titleTile.recordWidth+'px';
		}
		this.dtElement.dom.style.width = this.titleTile.recordWidth+'px';
	},
	getFieldsIndex : function(fields){
		var fnames = [];
		var findexes = [];
		if(Ext.isArray(fields)){
			fnames = fields;
		}else{
			fnames = [fields];
		}
		for(var i=0; i<fnames.length; i++){
			var index = this.store.fields.indexOf(this.store.fields.get(fnames[i]));
			if(index >= 0){
				findexes.push(index);
			}
		}
		return findexes;
	},
	nextPageHandler : function(){
		if(!this.currBar.next.disabled){
			this.currBar.moveNext();
		}
	},
	prePageHandler : function(){
		if(!this.currBar.prev.disabled){
			this.currBar.movePrevious();
		}
	},
	firstPageHandler : function(){
		if(!this.currBar.first.disabled)
			this.currBar.moveFirst();
	},
	lastPageHandler : function(){
		if(!this.currBar.last.disabled)
			this.currBar.moveLast(); 
	},
	refreshPageHandler : function(){
	},
	setFieldTitle : function(cfg){
		this.titleTile.setFieldTitle(cfg);
	}
});
Ext.reg('searchgridview', Wlj.frame.functions.app.widgets.SearchGrid);
Wlj.frame.functions.app.widgets.TitleTile = function(cfg){
	Ext.apply(this,cfg);
	Wlj.frame.functions.app.widgets.TitleTile.superclass.constructor.call(this);
	this.resumeColumnGroup();
	this.createTitle();
	this.createRecordTileEl();
};
Ext.extend(Wlj.frame.functions.app.widgets.TitleTile, Ext.util.Observable, {
	
	alwaysField : true,
	float : 'left',
	
	lineHeight : 27,
	defaultFieldWidth : 150,
	rnWidth : 40,
	needRN : false,
	easingStrtegy : false,
	multiSelectSeparator : ',',
	grouped : false,
	groupLevels : 0, 
	columnGroups : false,
	
	getTitleClass : function(field){
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			return dataType.getTitleClass();
		}
		return '';
	},
	
	resumeColumnGroup : function(){
		this.CTO = [];
		if(!this.columnGroups || !Ext.isArray(this.columnGroups) || !this.columnGroups.length > 0){
			this.grouped = false;
			this.columnGroups = false;
			return;
		}
		var groupTmp = [] ;
		Ext.each(this.columnGroups, function(group){
			if(Ext.isArray(group) && group.length > 0)
				groupTmp.push(group);
		});
		if(groupTmp.length == 0){
			this.grouped = false;
			this.columnGroups = false;
			return;
		}
		this.grouped = true;
		this.columnGroups = groupTmp;
		this.groupLevels = this.columnGroups.length;
		return;
	},
	
	createTitle : function(){
		var _this = this;
		_this.recordWidth = 0;
		var fields = this.store.fields;
		var fieldsTiels = [];
		this.indexTile = new Wlj.widgets.search.tile.Tile({
			ownerW : 10,
			removeable : false,
			dragable : false,
			baseSize : _this.lineHeight,
			baseWidth : _this.rnWidth,
			baseMargin : 0,
			hidden : !this.needRN,
			cls : 'ygh-hd',
			float : 'left',
			html : '序号'
		});
		this.indexTile.on('afterrender', function(itile){
			itile.el.on('click',function(){
				if(!itile.__ALLS){
					_this.store.resultContainer.allSelect();
					itile.__ALLS=true;
				}else{
					_this.store.resultContainer.clearSelect();
					itile.__ALLS=false;
				}
			});
		});
		fieldsTiels.push(this.indexTile);
		if(this.needRN){
			_this.recordWidth = parseInt(_this.recordWidth) + parseInt(this.indexTile.baseMargin)*2 + parseInt(_this.rnWidth) + 12;
		}
		
		fields.each(function(field){
			var tf = _this.createFieldTile(field);
			if(tf){
				fieldsTiels.push(tf);
			}
		});
		var tile = new Wlj.widgets.search.tile.Tile({
			ownerW : 10,
			ownerWI : -10,
			removeable : false,
			dragable : false,
			baseSize : _this.lineHeight * (_this.groupLevels + 1),//duochong
			baseWidth : _this.recordWidth,
			baseMargin : 1,
			recordView : this,
			cls : 'ygh-container',
			float : 'left',
			style : {
				//border : '1px solid #000',
				overflowX :'hidden'
			},
			pos_size : {
				TX : 0,
				TY : 0,
				TW : 1,
				TH : 1
			},
			items : fieldsTiels,
			listeners : {
				afterrender : function(tileThis){
					tileThis.el.on('contextmenu', function(eve, html, obj){
						eve.stopEvent();
						tileThis.recordView.onTitleContextMenu(eve, html, obj, []);
					});
					if(!_this.grouped)
						_this.initColumnDD();
					_this.buildGroupedTitles();
					for(var i=0;i<_this.groupLevels;i++){
						_this.CTO[i].dom = tileThis.el.insertHtml('afterBegin', _this.CTO[i].buildEl());
					}
				}
			}
		});
		_this.titleTile = tile;
	},
	buildGroupedTitles : function(){
		for(var i=0;i<this.groupLevels;i++){
			this.CTO.push(new Wlj.frame.functions.app.widgets.ComplexTitle(this, i));
		}
	},
	createDataIndexEl : function(){
		var _this = this;
		var display = 'block';
		if(!this.needRN) display = 'none';
		var indexHTML = '<div class="ygc-cell ygc-cell-no" style="display:'+display+';width:'+_this.rnWidth+'px;position: relative; margin: 0px; float: left; height: 27px;">'+
			'{index+1}' + 
			'</div>';
		return indexHTML;
	},
	createFieldEl : function(tf){
		var _this=  this;
		var fieldHTML = '';
		if(tf.text && tf.gridField !== false){
				fieldHTML =
					'<tpl for="'+tf.name+'">'+
					'<div title="{title}" class="ygc-cell '+_this.getFieldClass(tf)+'" style="position: relative; margin: 0px; width: '+
					(tf.resutlWidth?tf.resutlWidth:_this.defaultFieldWidth)+'px; float: left; height: 27px; '+(tf.hidden?'display:none;':'')+'">'+
					'{display}'+
					'</div>'+
					'</tpl>';
				return fieldHTML;
		}
		return '';
	},
	createRecordTileEl : function(){
		var _this = this;
		var store = this.store;
		var fields = store.fields;
		var ElBuffer = [];
		var createString = '<div class="ygc-row {oddc}" style="position: relative; overflow-x: hidden; margin: 0px; width: '+this.recordWidth+'px; float: left; height: 27px;" rowIndex="{index}">';
		ElBuffer.push(createString);
		ElBuffer.push(this.createDataIndexEl());
		ElBuffer.push('<tpl for="data">');
		fields.each(function(tf){
			ElBuffer.push(_this.createFieldEl(tf));
		});
		ElBuffer.push('</tpl>');
		ElBuffer.push('</div>');
		_this.recordTemplate = new Ext.XTemplate(ElBuffer.join(''),{
			formatFieldData : function(field, data){
				var dataFormat = '&nbsp;';
				if(data){
					dataFormat = data;
				}
				if(Ext.isFunction(field.viewFn)){
					dataFormat = field.viewFn(dataFormat);
				}
				return dataFormat;
			}
		});
	},
	bootEls : function(){
		var _this = this;
		var dc = this.store.getCount();
		
		if(!_this.easingStrtegy || 
		   !_this.easingStrtegy.type || 
		   !_this.easingStrtegy.firstStep || 
		   !Ext.isFunction(_this[_this.easingStrtegy.type+'DataLineRender']) ||
		   dc <= _this.easingStrtegy.firstStep){
			_this.defaultDataLineRender();
		}else{
			_this[_this.easingStrtegy.type+'DataLineRender'].call(_this, _this.easingStrtegy.initialConfig);
		}
	},
	defaultDataLineRender : function(){
		var _this = this;
		var grid = this.searchGridView;
		var layoutEl = grid.getLayoutTarget();
		var store = this.store;
		store.data.each(function(item, index, length){
			var oddc = index % 2 ===0 ? "ygc-row-odd" : "";
			var data = _this.buildData(item);
			_this.recordTemplate.append(layoutEl, {
				oddc : oddc,
				index : index,
				data : data
			});
		});
	},
	settimeoutDataLineRender : function(initialConfig){
		var _this = this;
		var grid = this.searchGridView;
		var layoutEl = grid.getLayoutTarget();
		var store = this.store;
		var firstStep = this.easingStrtegy.firstStep ?  this.easingStrtegy.firstStep : 50;
		store.data.each(function(item, index, length){
			var oddc = index % 2 ===0 ? "ygc-row-odd" : "";
			var data = _this.buildData(item);
			if(index < firstStep){
				_this.recordTemplate.append(layoutEl, {
					oddc : oddc,
					index : index,
					data : data
				});
			}else{
				setTimeout(function(){
					_this.recordTemplate.append(layoutEl, {
						oddc : oddc,
						index : index,
						data : data
					});
				},1);
			}
		});
	},
	
	buildData : function(record){
		var _this = this;
		var dataObj = {};
		record.fields.each(function(tf){
			var fData = _this.formatFieldData(tf,_this.translateFieldData(tf, record.get(tf.name)));
			dataObj[tf.name] = {
					display : fData,
					title : tf.noTitle===true?tf.text:record.get(tf.name)
			};
		});
		return dataObj;
	},
	getFieldClass : function(field){
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			return dataType.getFieldClass();
		}
		return '';
	},
	
	formatFieldData : function(field, data){
		var dataFormat = '&nbsp;';
		if(data){
			dataFormat = data;
		}
		if(Ext.isFunction(field.viewFn)){
			dataFormat = field.viewFn(dataFormat);
		}
		return dataFormat;
	},
	translateFieldData : function(field, data){
		var app = this._APP;
		var reData = '&nbsp';
		if(field.translateType){
			if (field.multiSelect) {
				var separator = field.multiSeparator?field.multiSeparator:this.multiSelectSeparator;
				var de = app.translateLookupByMultiKey(field.translateType, data, separator);
			} else {
				var de = app.translateLookupByKey(field.translateType, data);
			}
			if(de){
				reData = de;
			}
		}else{
			reData = data;
		}
		
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			if(reData !== '&nbsp'){
				reData = dataType.formatFn(reData);
				dataType = null;
			}
		}
		return reData;
	},
	initColumnDD : function(){
		var _this = this;
		this.DropZone = new Ext.dd.DropZone(_this.titleTile.el.dom, {
			ddGroup : 'searchDomainDrop',
			notifyDrop  : function(ddSource, e, data){
				var px = e.getXY()[0];
				var py = e.getXY()[1];
				var newIndex = 0;
				var tf = _this.titleTile.el.first().first('.ygh-hd');
				while(tf){
					if(px <= tf.getRight()){
						break;
					}else{
						tf = tf.next();
						newIndex ++;
					}
				}
				setTimeout(function(){
					_this.setColumnOrder(data.tile.data.name,newIndex);
				},50);
			}
		});	
	},
	createFieldTile : function(tf){
		var _this = this;
		if( tf.text && tf.gridField !== false){
			var tfHTML = '<div title="'+tf.text+'" class="ygh-hd-text">'+tf.text+'</div>';
			var fTile = new Wlj.widgets.search.tile.Tile({
				ownerW : 10,
				removeable : false,
				dragable : !(tf.enableCondition === false),
				defaultDDGroup : 'searchDomainDrop',
				baseSize : _this.lineHeight,
				baseWidth : tf.resutlWidth ? tf.resutlWidth : _this.defaultFieldWidth,
				float : 'left',
				cls : 'ygh-hd '+_this.getTitleClass(tf),
				baseMargin : 0,
				html : tfHTML,
				data : {
					name : tf.name,
					value : ''
				},
				clearSortIcon : function(){
					this.el.first().removeClass('ygh-hd-order-desc');
					this.el.first().removeClass('ygh-hd-order-asc');
				},
				addSortIcon : function(info){
					this.el.first().addClass('ygh-hd-order-'+info);
				},
				listeners : {
					afterrender : function( tileThis ){
						tileThis.el.on('click',function(eve){
							eve.stopEvent();
							if(!tileThis.el.first().hasClass('ygh-hd-order-desc')){
								_this._APP.sortByDataIndex(tileThis.data.name,'desc');
							}else{
								_this._APP.sortByDataIndex(tileThis.data.name,'asc');
							}
						});
						tileThis.el.on('contextmenu',function(eve, html, obj){
							eve.stopEvent();
							_this.onTitleFieldContextMenu(eve, html, obj, []);
						});
						this.RESIZEABLE = new Ext.Resizable(this.el, {
							handles : 'e',
							height : this.el.getHeight(),
							width : this.el.getWidth()
						});
						this.RESIZEABLE.on('resize',function(res, width, height, e){
							e.stopEvent();
							var index = _this.titleTile.items.indexOf(tileThis);
							_this.onColumnResize(index, res, width, height, e, tileThis.data.name);
						});
						if(this.dragable){
							this.dd.startDrag = function(){
								this.tile.el.applyStyles({
									display:''
								});
								this.proxy.getEl().dom.innerText = this.tile.el.dom.innerText;
							};
						}
						if(tf.hidden){
							this.hide();
						}
					}
				}
			});
			if(!tf.hidden){
				_this.recordWidth = parseInt(_this.recordWidth) + parseInt(fTile.baseMargin)*2 + parseInt(fTile.baseWidth) + 12;
			}
			return fTile;
		}
		return false;
	},
	onColumnResize : function(index, res, width, height, e, name){
		var recordWidth = parseInt(this.recordWidth) - parseInt(this.titleTile.items.get(index).baseWidth) + parseInt(width);
		var minaWidth = - parseInt(this.titleTile.items.get(index).baseWidth) + parseInt(width);
		this.titleTile.items.get(index).baseWidth = width;
		this.titleTile.items.get(index).initialConfig.baseWidth = width;
		this.recordWidth = recordWidth;
		this.titleTile.baseWidth = recordWidth;
		this.titleTile.get(index).el.applyStyles({
			width : width + 'px'
		});
		this.titleTile.el.applyStyles({
			width : recordWidth + 'px'
		});
		Ext.fly(this.titleTile.layoutEl).applyStyles({
			width : recordWidth + 'px'
		});
		this.searchGridView.onColumnResize(index, res, width, height, e, name, recordWidth);
		this.createRecordTileEl();
		if(this.CTO[0]){
			this.CTO[0].columnResize(index,minaWidth);
		}
	},
	setColumnOrder : function(name, index){
		var tile = null;
		this.titleTile.items.each(function(it){
			if(it.data && it.data.name === name){
				tile = it;
			}
		});
		var oldIndex = this.titleTile.items.indexOf(tile);
		var ic = tile.initialConfig;
		this.titleTile.remove(tile);
		this.titleTile.insert(index,new Wlj.widgets.search.tile.Tile(ic));
		this.titleTile.doLayout();
		var rows = this.searchGridView.getRows();
		for(var i=0;i<rows.length;i++){
			var tNode = rows[i].removeChild(rows[i].childNodes[oldIndex]);
			rows[i].childNodes[index-1].insertAdjacentElement('afterEnd', tNode);
		}
		var df = this.searchGridView.searchDomain.dataFields;
		var mf = false;
		for(var i=0;i<df.length;i++){
			if(df[i].name === name){
				mf = df[i];
				break;
			}
		}
		if(mf){
			df.remove(mf);
			df.splice(index-1,0,mf);
			this.searchGridView.searchDomain.storeMetaChange();
		}
		this.createRecordTileEl();
	},
	onMetaAdd : function(field){
		var addedTile = this.createFieldTile(field);
		var addedTile = this.titleTile.add(addedTile);
		this.resetWidth();
		this.titleTile.doLayout();
		this.createRecordTileEl();
		var addedTemp = new Ext.XTemplate(
				'<div class="ygc-cell" style="position: relative; margin: 0px; width: '+
				(field.resutlWidth ? field.resutlWidth : this.defaultFieldWidth)+'px; float: left; height: 27px;">'+
				'</div>');
		var rows = this.searchGridView.getRows();
		var len = rows.length;
		for(var i=0;i<len;i++){
			addedTemp.append(rows[i]);
			rows[i].style.width = this.recordWidth+'px';
		}
		
	},
	onMetaAddByIndex : function(addField, theIndex){
		var addedTile = this.createFieldTile(addField);
		var addedTile = this.titleTile.insert(theIndex+1, addedTile);
		this.resetWidth();
		this.titleTile.doLayout();
		this.createRecordTileEl();
	},
	onMetaRemove : function(field){
		var theTiles = this.titleTile.findBy(function(i){if(i.data && field===i.data.name)return true;return false;});
		if(theTiles.length>0){
			var theTile = theTiles[0];
			if(!theTile.hidden){
				this.recordWidth = parseInt(this.recordWidth) - (parseInt(theTile.baseMargin) * 2 + parseInt(theTile.baseWidth) + 12);
			}
			this.titleTile.remove(theTile);
			this.resetWidth();
			this.titleTile.doLayout();
			this.createRecordTileEl();
			var row = this.searchGridView.getRows();
			var len = row.length;
			for(var i=0;i<len;i++){
				row[i].style.width = this.recordWidth+'px';
			}
		}
	},
	resetWidth : function(){
		this.titleTile.el.applyStyles({
			width : this.recordWidth+'px'
		});
		Ext.fly(this.titleTile.getLayoutTarget()).applyStyles({
			width : this.recordWidth+'px'
		});
	},
	clearSortIcons : function(){
		this.titleTile.items.each(function(f){
			if(f.clearSortIcon){
				f.clearSortIcon.call(f);
			}
		});
	},
	updateSortIcon : function(dataIndex, info){
		this.titleTile.items.each(function(f){
			if(f.clearSortIcon){
				f.clearSortIcon.call(f);
			}
			if(f.data && f.data.name === dataIndex && f.addSortIcon){
				f.addSortIcon.call(f, info);
			}
		});
	},
	showFields : function(dataIndexes){
		var _this = this;
		Ext.each(dataIndexes, function(di){
			var f = _this.titleTile.items.get(di+1);
			if(f && f.hidden){
				_this.recordWidth = parseInt(_this.recordWidth) + (parseInt(f.baseMargin) * 2 + parseInt(f.baseWidth) + 12);
				f.show();
				if(_this.CTO[0]){
					_this.CTO[0].columnResize(di+1, (parseInt(f.baseMargin) * 2 + parseInt(f.baseWidth) + 12));
				}
			}
		});
		this.titleTile.doLayout();
		_this.resetWidth();
		this.createRecordTileEl();
	},
	hideFields : function(dataIndexes){
		var _this = this;
		Ext.each(dataIndexes, function(di){
			var f = _this.titleTile.items.get(di+1);
			if(f && !f.hidden){
				_this.recordWidth = parseInt(_this.recordWidth) - (parseInt(f.baseMargin) * 2 + parseInt(f.baseWidth) + 12);
				f.hide();
				if(_this.CTO[0]){
					_this.CTO[0].columnResize(di+1, -(parseInt(f.baseMargin) * 2 + parseInt(f.baseWidth) + 12));
				}
			}
		});
		_this.resetWidth();
		this.createRecordTileEl();
	},
	onTitleContextMenu : function(eve, html, obj, added){
		this.searchGridView.onContextMenu(eve, html, obj, added);
	},
	onTitleFieldContextMenu : function(eve, html, obj, added){
		this.onTitleContextMenu(eve, html, obj, added);
	},
	destroy : function(){
		this.titleTile.removeThis();
	},
	setFieldTitle : function(cfg){
		var fieldTile = this.titleTile.items.find(function(t){
			if(t.data && t.data.name==cfg.name)
				return true;
		});
		if(!fieldTile){
			return false;
		}
		fieldTile.data.text = cfg.text;
		fieldTile.el.select('.ygh-hd-text').first().dom.title= cfg.text;
		fieldTile.el.select('.ygh-hd-text').first().dom.innerText= cfg.text;
		var cField = this._APP.getConditionField(cfg.name);
		if(cField){
			cField.setLabelText(cfg.text);
		}
	}
});

Wlj.frame.functions.app.widgets.ComplexTitle = function(gridTitle, level){
	this.level = level;
	this.gridTitle = gridTitle;	
	this.groups = this.gridTitle.columnGroups[this.level];
	for(var i=0; i<this.groups.length; i++){
		if(i==0){
			if(this.level === 0 )
				this.groups[i].toColumn = this.groups[i].includeCount;
			else
				this.groups[i].toColumn = this.groups[i].includeCount - 1;
		}else{
			if(Ext.isNumber(this.groups[i].includeCount)){
				this.groups[i].toColumn = this.groups[i].includeCount + this.groups[i-1].toColumn;
			}else{
				if(this.level === 0 )
					this.groups[i].toColumn = this.gridTitle.titleTile.items.getCount();
				else 
					this.groups[i].toColumn = this.gridTitle.CTO[this.level - 1].groups.length-1;
			}
		}
		if(this.level === 0){
			if(this.groups[i].toColumn >= this.gridTitle.titleTile.items.getCount()){
				this.groups[i].toColumn = this.gridTitle.titleTile.items.getCount();
				this.groups = this.groups.slice(0 , i+1);
				break;
			}
		}else{
			if(this.groups[i].toColumn >= this.gridTitle.CTO[this.level - 1].groups.length-1){
				this.groups[i].toColumn = this.gridTitle.CTO[this.level - 1].groups.length-1;
				this.groups = this.groups.slice(0 , i+1);
				break;
			}
		}
	}
	Wlj.frame.functions.app.widgets.ComplexTitle.superclass.constructor.call(this);
	this.height = this.gridTitle.lineHeight;
	this.paddingLeft = this.gridTitle.needRN ? (this.gridTitle.rnWidth + 12) : 0;
	this.buildContainer();
	this.buildCell();
	this.processCells();
};
Ext.extend(Wlj.frame.functions.app.widgets.ComplexTitle, Ext.util.Observable, {
	containerTemplate : false,
	cellTemplate : false,
	zeroWidth : 13,
	buildContainer : function(){
		this.containerTemplate = new Ext.XTemplate('<div style="height:'+this.height+'px;padding-left:'+this.paddingLeft+'px;width:100%;">{innerGroups}</div>');
	},
	buildCell : function(){
		this.cellTemplate = new Ext.XTemplate('<div class="ygh-hd" style="text-align:center;height:'+this.height+'px;width:{width}px;float: left;display:{display};">{groupTitle}</div>');
	},
	processCells : function(){
		var _this = this;
		if(this.level === 0){
			var ftIndex = 0;
			var grpIndex = 0;
			this.gridTitle.titleTile.items.each(function(ft){
				if(ftIndex === 0) {
					ftIndex ++;
					return;
				}
				var gb = _this.groups[grpIndex];
				if(!gb) return;
				if(!Ext.isArray(gb.defaultColumn)){
					gb.defaultColumn = [];
				}
				if(Ext.isNumber(gb.width) && gb.width > 0){
					gb.width += ft.hidden ? 0 : (ft.baseMargin + ft.baseWidth + 12);
				}else{
					gb.width = ft.hidden ? 0 : ft.baseMargin + ft.baseWidth;
				}
				if(ft.hidden !== true ){
					gb.defaultColumn.push(ftIndex -1);
				}
				ftIndex ++;
				if(ftIndex > gb.toColumn){
					grpIndex ++ ;
				}
				return;
			});
		}else{
			var ftIndex = 0;
			var grpIndex = 0;
			Ext.each(this.gridTitle.CTO[_this.level-1].groups , function(ft){
				var gb = _this.groups[grpIndex];
				if(!gb)return;
				if(!Ext.isArray(gb.defaultColumn)){
					gb.defaultColumn = [];
				}
				if(Ext.isNumber(gb.width) && gb.width > 0){
					gb.width += ft.display === 'none' ? 0 : ft.width +12;
				}else{
					gb.width = ft.display === 'none' ? 0 : ft.width;
				}
				if(ft.display !== 'none' ){
					gb.defaultColumn.push(ftIndex);
				}
				ftIndex ++;
				if(ftIndex > gb.toColumn){
					grpIndex ++ ;
				}
				return;
			});
		}
		Ext.each(this.groups, function(g){
			if(g.width<_this.zeroWidth){
				g.display = 'none';
				g.width = 0;
			}else{
				g.display = 'block';
			}
		});
	},
	buildEl : function(){
		var cells = [];
		for(var i = 0; i<this.groups.length; i++){
			var g = this.groups[i];
			cells.push(this.cellTemplate.apply(g))
		}
		return this.containerTemplate.apply({
			innerGroups : cells.join('')
		});
	},
	columnResize : function(index , minaWidth){
		var refixedIndex = this.getBelongGroup(index);
		var refixedNode = this.dom.childNodes[refixedIndex];
		if(!refixedNode) return;
		var finalWidth = parseInt(refixedNode.style.width) + minaWidth;
		if(finalWidth < 0){
			finalWidth = 0;
			refixedNode.style.display = 'none';
		}else{
			if(refixedNode.style.display == 'none'){
				finalWidth -= 12;
				refixedNode.style.display = '';
			}
		}
		refixedNode.style.width = finalWidth + 'px';
		var nextLevel = this.gridTitle.CTO[this.level+1];
		if(!nextLevel) return;
		nextLevel.columnResize(refixedIndex, minaWidth);
	},
	getBelongGroup : function(index){
		var belongs = 0;
		while(this.groups[belongs].toColumn < index){
			belongs ++;
		}
		return belongs ;
	},
	expandGroup : function(index){
		if(this.level == 0){
			this.gridTitle.searchGridView.showFields(this.groups[index].defaultColumn);
		}else{
			var useLevel = this.gridTitle.CTO[this.level - 1];
			var len = this.groups[index].defaultColumn.length;
			for(var i=0; i< len ; i++){
				useLevel.expandGroup(this.groups[index].defaultColumn[i]);
			}
		}
	},
	collapseGroup : function(index){
		if(this.level == 0){
			this.gridTitle.searchGridView.hideFields(this.groups[index].defaultColumn);
		}else{
			var useLevel = this.gridTitle.CTO[this.level - 1];
			var len = this.groups[index].defaultColumn.length;
			for(var i=0; i< len ; i++){
				useLevel.collapseGroup(this.groups[index].defaultColumn[i]);
			}
		}
	}
});

Wlj.frame.functions.app.widgets.LockingTitles = function(el, grid){
	this.el = el;
	this.gridView = grid;
	this.store = this.gridView.store;
	Wlj.frame.functions.app.widgets.LockingTitles.superclass.constructor.call(this);
	this.titleHeight = this.gridView.titleHeight;
	this.viewWidth = 0;
	this.lockingColumns = new Ext.util.MixedCollection();
	this.columnContainers = [];
	this.initialColumns();
	if(this.lockingColumns.getCount() == 0){
		Ext.error('no locking column！');
		return false;
	}
	this.headerContaienr = new Ext.XTemplate('<div style="width:'+this.viewWidth+'px;height:'+this.titleHeight+'px;"></div>');
	this.dataContainer = new Ext.XTemplate('<div style="overflow:hidden;"></div>');
	/**
	 * TODO need?
	 */
	this.dataScrollContaienr = new Ext.XTemplate('<div style="height:auto;"></div>');
	this.columnTemplate = new Ext.XTemplate('<div style="width:{width}px;height:auto;float:left;"></div>');
	this.cellTemplate = new Ext.XTemplate('<div class="ygc-cell ygc-row {fieldClass} {oddc}" style="width:100%;height:'+this.lineHeight+'px;">{data}</div>');
	this.initialElements();
};
Ext.extend(Wlj.frame.functions.app.widgets.LockingTitles, Ext.util.Observable, {
	lineHeight : 27,
	defaultFieldWidth : 150,
	initialColumns : function(){
		var fields = this.store.fields;
		var _this = this;
		fields.each(function(field){
			if(field.lockingView && field.text && !field.hidden){
				_this.lockingColumns.add(field);
				var widthToAdd = field.width ? field.width : _this.defaultFieldWidth;
				_this.viewWidth = _this.viewWidth + widthToAdd + 12;
			}
		});
	},
	initialElements : function(){
		this.headerContaienr = this.headerContaienr.append(this.el,{},true);
		this.dataContainer = this.dataContainer.append(this.el,{},true);
		this.dataScrollContaienr = this.dataScrollContaienr.append(this.dataContainer , {}, true);
		this.el.applyStyles({
			width : this.viewWidth + 'px'
		});
		this.buildHeader();
	},
	onResize : function(h){
		if(!Ext.isNumber(h)){
			return;
		}
		this.dataContainer.applyStyles({
			height : h + 'px'
		});
	},
	buildHeader : function(){
		var _this = this;
		var fieldsTiels = [];
		_this.lockingColumns.each(function(field){
			fieldsTiels.push(_this.createFieldTile(field));
		});
		
		var tile = new Wlj.widgets.search.tile.Tile({
			ownerW : 10,
			ownerWI : -10,
			removeable : false,
			dragable : false,
			baseSize : _this.titleHeight,
			baseWidth : _this.viewWidth,
			baseMargin : 1,
			recordView : this,
			cls : 'ygh-container',
			float : 'left',
			style : {
				overflowX :'hidden'
			},
			pos_size : {
				TX : 0,
				TY : 0,
				TW : 1,
				TH : 1
			},
			items : fieldsTiels,
			listeners : {
				afterrender : function(tileThis){
					//_this.initColumnDD();
				}
			}
		});
		_this.titleTile = tile;
		_this.titleTile.render(this.headerContaienr);
	},
	createFieldTile : function(tf){
		var _this = this;
		var tfHTML = '<div title="'+tf.text+'" class="ygh-hd-text">'+tf.text+'</div>';
		var fTile = new Wlj.widgets.search.tile.Tile({
			ownerW : 10,
			removeable : false,
			dragable : !(tf.enableCondition === false),
			defaultDDGroup : 'searchDomainDrop',
			baseSize : _this.titleHeight,
			baseWidth : tf.resutlWidth ? tf.resutlWidth : _this.defaultFieldWidth,
			float : 'left',
			cls : 'ygh-hd '+_this.getTitleClass(tf),
			baseMargin : 0,
			html : tfHTML,
			data : {
				name : tf.name,
				value : ''
			},
			clearSortIcon : function(){
				this.el.first().removeClass('ygh-hd-order-desc');
				this.el.first().removeClass('ygh-hd-order-asc');
			},
			addSortIcon : function(info){
				this.el.first().addClass('ygh-hd-order-'+info);
			},
			listeners : {
				afterrender : function( tileThis ){
//					tileThis.el.on('click',function(eve){
//						eve.stopEvent();
//						if(!tileThis.el.first().hasClass('ygh-hd-order-desc')){
//							_this._APP.sortByDataIndex(tileThis.data.name,'desc');
//						}else{
//							_this._APP.sortByDataIndex(tileThis.data.name,'asc');
//						}
//					});
//					tileThis.el.on('contextmenu',function(eve, html, obj){
//						eve.stopEvent();
//						_this.onTitleFieldContextMenu(eve, html, obj, []);
//					});
					if(this.dragable){
						this.dd.startDrag = function(){
							this.tile.el.applyStyles({
								display:''
							});
							this.proxy.getEl().dom.innerText = this.tile.el.dom.innerText;
						};
					}
				}
			}
		});
		_this.buildColumnContainer(tf);
		return fTile;
	},
	buildColumnContainer : function(tf){
		var _this = this;
		var width =  tf.resutlWidth ? tf.resutlWidth : _this.defaultFieldWidth;
		width = parseInt(width)+12
		this.columnContainers.push(this.columnTemplate.append(this.dataScrollContaienr, {
			width : width
		},true));
	},
	getTitleClass : function(field){
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			return dataType.getTitleClass();
		}
		return '';
	},
	bootDataEls : function(){
		var _this = this;
		var store = this.store;
		store.data.each(function(item, index, length){
			_this.buildData(item);
		});
	},
	buildData : function(record){
		var _this = this;
		_this.lockingColumns.each(function(tf){
			var fData = _this.formatFieldData(tf,_this.translateFieldData(tf, record.get(tf.name)));
			var fieldClass = _this.getFieldClass(tf);
			var index = record.store.indexOf(record);
			var oddc = index % 2 ===0 ? "ygc-row-odd" : "";
			_this.cellTemplate.append(
					_this.columnContainers[_this.lockingColumns.indexOf(tf)],
					{
						fieldClass : fieldClass,
						data : fData,
						oddc : oddc
					});
		});
	},
	clearDataEls : function(){
		Ext.each(this.columnContainers,function(column){
			column.dom.innerHTML = '';
		});
	},
	translateFieldData : function(field, data){
		var app = this.gridView._APP;
		var reData = '&nbsp';
		if(field.translateType){
			if (field.multiSelect) {
				var separator = field.multiSeparator?field.multiSeparator:this.multiSelectSeparator;
				var de = app.translateLookupByMultiKey(field.translateType, data, separator);
			} else {
				var de = app.translateLookupByKey(field.translateType, data);
			}
			if(de){
				reData = de;
			}
		}else{
			reData = data;
		}
		
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			if(reData !== '&nbsp'){
				reData = dataType.formatFn(reData);
				dataType = null;
			}
		}
		return reData;
	},
	formatFieldData : function(field, data){
		var dataFormat = '&nbsp;';
		if(data){
			dataFormat = data;
		}
		if(Ext.isFunction(field.viewFn)){
			dataFormat = field.viewFn(dataFormat);
		}
		return dataFormat;
	},
	getFieldClass : function(field){
		var dataType = field.dataType;
		if(dataType && WLJDATATYPE[dataType]){
			dataType = WLJDATATYPE[dataType];
			return dataType.getFieldClass();
		}
		return '';
	}
});

Wlj.frame.functions.app.widgets.CellProxy = Ext.extend(Object, {
	
	constructor : function(tile, config){
    	this.tile = tile;
    	this.id = this.tile.id +'-ddproxy';
    	Ext.apply(this, config);        
	},
	/**
	 * true:拖动的时候在容器内插入代理的节点；false：不插入。
	 */
	insertProxy : false,
    setStatus : Ext.emptyFn,
    reset : Ext.emptyFn,
    update : Ext.emptyFn,
    stop : Ext.emptyFn,
    sync: Ext.emptyFn,
    
    getEl :  function(){
		return this.ghost;
	},
	getGhost : function(){
		return this.ghost;
	},
	buildCellGhost : function(appendTo){
		var el = document.createElement('div');
			el.style.width =150 + 'px';
			el.style.height = 27 + 'px';
			el.className = 'x-panel-ghost '+this.tile.dom.className;
			el.innerHTML = '<b>'+this.tile.dom.innerText+'</b>';
			Ext.getDom(appendTo).appendChild(el);
		return Ext.get(el);
	},
	getProxy : function(){
		return this.proxy;
	},
	hide : function(){
		if(this.ghost){
			if(this.proxy){
				this.proxy.remove();
				delete this.proxy;
			}
			this.ghost.remove();
			delete this.ghost;
		}
	},
	show : function(){
		if(!this.ghost){
			this.ghost = this.buildCellGhost(Ext.getBody());
			this.ghost.setXY(this.tile.getXY());
			if(this.insertProxy){
				this.proxy = this.tile.el.insertSibling({cls:'tile'});
				this.proxy.setSize(this.tile.getSize());
			}
			//this.tile.el.dom.style.display = 'none';
		}
	},
	repair : function(xy, callback, scope){
		this.hide();
		if(typeof callback == 'function'){
			callback.call(scope || this);
		}
	},
	moveProxy : function(parentNode, before){
		if(this.proxy){
			parentNode.insertBefore(this.proxy.dom, before);
		}
	}
});

Wlj.frame.functions.app.widgets.CellDD = Ext.extend(Ext.dd.DragSource, {
	constructor : function(tile, cfg){
		this.tile = tile;
		this.proxy = new Wlj.frame.functions.app.widgets.CellProxy(tile, cfg);
		Wlj.frame.functions.app.widgets.CellDD.superclass.constructor.call(this, tile, cfg);
		var el = tile;
		this.scroll = false;
	},
	showFrame: Ext.emptyFn,
    startDrag: Ext.emptyFn,
    b4StartDrag : function(x, y){
		this.proxy.show();
	},
	b4MouseDown : function(e){
		var x = e.getPageX(),
			y = e.getPageY();
		this.autoOffset(x, y);
	},
	onInitDrag : function(x, y){
		this.onStartDrag(x, y);
		return true;
	},
	createFrame : Ext.emptyFn,
	getDragEl : function(e){
		return this.proxy.ghost.dom;
	},
	endDrag : function(e){
		this.proxy.hide();
		this.destroy();
	},
	autoOffset : function(x, y){
		x -= this.startPageX;
		y -= this.startPageY;
		this.setDelta(x, y);
	},
	onDrag : function(e){
	}
});


Wlj.frame.functions.app.widgets.PagingToolbar = Ext.extend(Ext.PagingToolbar, {
	exParams : [{
		path : 'json.total',
		defaultValue : 0
	}],
	jsonDataPath : '_this.store.reader.jsonData.',
	displayMsg : '显示{0}条到{1}条，共{2}条',
    updateInfo : function(){
        if(this.displayItem){
            var count = this.store.getCount();
            var msg = null;
            if(count == 0) msg = this.emptyMsg;
            else {
            	var fp = [];
            	fp.push(this.displayMsg);
            	fp.push(this.cursor+1);
            	fp.push(this.cursor+count);
            	fp.push(this.store.getTotalCount());
            	var _this = this;
            	Ext.each(this.exParams, function(pa){
            		var value = pa.defaultValue;
            		try{
            			value = eval(_this.jsonDataPath+pa.path);
            			if(value === undefined) value = pa.defaultValue;
            		}catch(error){}finally{
            			fp.push(value);
            		}
            	});
            	msg =  String.format.apply(this, fp);
            }
            this.displayItem.setText(msg);
        }
    }
});

