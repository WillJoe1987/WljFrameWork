Ext.ns('Wlj.widgets.views.index.grid');
Wlj.widgets.views.index.grid.TileGrid = Ext.extend(Ext.DataView, {
	dataSize : 7,
	title : 'TileGrid',
	root : 'json.data',
	columns : false,
	url : false,
	emptyText : 'sfd',
	exceptionText : '数据服务异常',
	itemSelector : 'div.w2h2',
	emptyInnerText : '暂无数据',
	initComponent : function(){
		var columns = this.columns;
		var fileds = [];
		var idProperty = false;
		var _this = this;
		Ext.each(columns, function(col){
			fileds.push(col.columnName);
			if(col.key === true){
				idProperty = col.columnName;
			}
			if(col.convert){
				fileds.push({name:col.columnName,convert:col.convert});
			}else{
				fileds.push(col.columnName);
			}
		});
		if(this.url && this.columns){
			this.store = new Ext.data.JsonStore({
				autoDestroy : true,
				url : this.url,
				root : this.root,
				restful : true,  
				idProperty : idProperty,
				fields : fileds,
				listeners :  {
					exception : function(misc){
						_this.exceptionTpl.append(_this.el);
					}
				}
			});
		}else {
			this.store = new Ext.data.ArrayStore({
			    autoDestroy: true,
			    fields: [
			       'company'
			    ]
			});
		}
		this.createTemplate();
		this.createExceptionTempalte();
		this.emptyTextCreate();
		Wlj.widgets.views.index.grid.TileGrid.superclass.initComponent.call(this);
	},
	createExceptionTempalte : function(){
		var _this = this;
		var templateString = '';
		templateString += '<div class="w2h2" >';
		templateString += this.titleHTML();
		templateString += '<div class="tile_notice_list tile_content">';
		templateString += '<ul class="in_sys_ul">';
		templateString += '<li>';
		templateString += '<div class="in_sys_line">';
		templateString += '<p class="in_sys_p">';
		templateString += '<span class="time">';
		templateString += this.exceptionText;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		templateString += '</li>';
		templateString += '</ul>';
		templateString += '</div>';
		templateString += '</div>';
		this.exceptionTpl = new Ext.XTemplate(templateString);
	},
	emptyTextCreate : function(){
		var _this = this;
		var title = _this.title;
		var templateString = '';
		templateString += '<div class="w2h2" >';
		templateString += this.titleHTML();
		templateString += '<div class="tile_notice_list tile_content">';
		templateString += '<ul class="in_sys_ul">';
		templateString += '<li>';
		templateString += '<div class="in_sys_line">';
		templateString += '<p class="in_sys_p">';
		templateString += '<span class="time">';
		templateString += this.emptyInnerText;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		templateString += '</li>';
		templateString += '</ul>';
		templateString += '</div>';
		templateString += '</div>';
		this.emptyText = templateString;
	},
	titleHTML : function(){
		var _this = this;
		var title = this.title;
		var templateString = '';
		templateString += '<div class="tile_tip_tit" >';
		templateString += '<p class="tit" >';
		templateString += '<span class=icon>';
		templateString += title;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		return templateString;
	},
	createTemplate : function(){
		var _this = this;
		var title = _this.title;
		var columns = this.columns;
		var showColumns = [];
		
		var templateString = '';
		templateString += '<div class="w2h2" >';
		templateString += this.titleHTML();
		/***************************body***************************/
		if(this.url && this.columns){
			Ext.each(columns, function(col){
				if(col.show){
					showColumns.push(col);
				}
			});
			templateString += '<div class="tile_notice_list tile_content">';
			templateString += '<ul class="in_sys_ul">';
			templateString += '<tpl for=".">';
			templateString += '<li>';
			templateString += '<div class="in_sys_line">';
			templateString += '<p class="in_sys_p">';
			templateString += '<span class="time">';
			var date = showColumns.shift();
			templateString += '{'+date.columnName+'}';
			templateString += '</span>';
			templateString += '<span class="type_red">';
			templateString += '</span>';
			var title = showColumns.shift();
			if(title && title.columnName){
				templateString += '<a title="{'+title.columnName+'}" href="javascript:void(0);" class="tit">';
				templateString += '{'+title.columnName+'}';
				templateString += '</a>';
			}
			templateString += '</p>';
			templateString += '</div>';
			templateString += '</li>';
			templateString += '</tpl>';
			templateString += '</ul>';
			templateString += '</div>';
		}
		templateString += '</div>';
		this.tpl = new Ext.XTemplate(templateString);
	},
	listeners : {
		afterrender : function(){
			if(this.url && this.columns){
				Wlj.TileMgr.addDataCfg({
					controlPanel : this,
					store : this.store
				});
			} else {
				this.tpl.append(this.el);
			}
			var _this = this;
			this.el.on('click',function(){
				_this.ownerCt.clickFire();
			});
		}
	}
});

/**
 * 首页3X3表格
 * eg.
 * var grid = new Wlj.widgets.views.index.grid.MaxTileGrid({
 *		needheader :true,
 *		dataSize : 10,
 *		title : '机构贷款客户增长TOP10',
 *		url : basepath+'/orgCreAddTopN.json',
 *		columns : [
 *			{header : '客户号',columnName : 'CUST_ID',show : true},
 *			{header : '客户名称',columnName : 'CUST_NAME',show : true,width : 148},
 *			{header : '贷款时点余额（折人民币）',columnName : 'BAL',show : true,align : 'right',convert : money('0,0.00')}
 *		]
 *	});
 *
 * @class Wlj.widgets.views.index.grid.MaxTileGrid
 * @extends Ext.DataView
 */
Wlj.widgets.views.index.grid.MaxTileGrid = Ext.extend(Ext.DataView, {
	needheader :false,
	dataSize : 7,
	title : 'MaxTileGrid',
	root : 'json.data',
	columns : false,
	url : false,
	emptyText : 'sfd',
	exceptionText : '数据服务异常',
	emptyInnerText : '暂无数据',
	itemSelector : 'div.w3h3',
	initComponent : function(){
		var columns = this.columns;
		var fileds = [];
		var idProperty = false;
		Ext.each(columns, function(col){
			if(col.key === true){
				idProperty = col.columnName;
			}
			if(col.convert){
				fileds.push({name:col.columnName,convert:col.convert});
			}else{
				fileds.push(col.columnName);
			}
		});
		if(this.url && this.columns){
			this.store = new Ext.data.JsonStore({
				autoDestroy : true,
				url : this.url,
				root : this.root,
				restful : true,  
				idProperty : idProperty,
				fields : fileds,
				listeners :  {
					exception : function(misc){
						_this.exceptionTpl.append(_this.el);
					}
				}
			});
		}else {
			this.store = new Ext.data.ArrayStore({
			    autoDestroy: true,
			    fields: [
			       'company'
			    ]
			});
		}
		this.createTemplate();
		this.createExceptionTempalte();
		this.emptyTextCreate();
		Wlj.widgets.views.index.grid.MaxTileGrid.superclass.initComponent.call(this);
	},
	titleHTML : function(){
		var _this = this;
		var title = this.title;
		var templateString = '';
		templateString += '<div class="tile_grid_tit" >';
		templateString += '<p class="tit" >';
		templateString += '<span class=icon>';
		templateString += title;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		return templateString;
	},
	createExceptionTempalte : function(){
		var _this = this;
		var templateString = '';
		templateString += '<div class="w3h3" >';
		templateString += this.titleHTML();
		templateString += '<div class="tile_grid_list tile_content">';
		templateString += '<ul class="in_sys_ul">';
		templateString += '<li>';
		templateString += '<div class="in_sys_line">';
		templateString += '<p class="in_sys_p">';
		templateString += '<span class="time">';
		templateString += this.exceptionText;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		templateString += '</li>';
		templateString += '</ul>';
		templateString += '</div>';
		templateString += '</div>';
		this.exceptionTpl = new Ext.XTemplate(templateString);
	},
	emptyTextCreate : function(){
		var _this = this;
		var title = _this.title;
		var templateString = '';
		templateString += '<div class="w3h3" >';
		templateString += this.titleHTML();
		templateString += '<div class="tile_grid_list tile_content">';
		templateString += '<ul class="in_sys_ul">';
		templateString += '<li>';
		templateString += '<div class="in_sys_line">';
		templateString += '<p class="in_sys_p">';
		templateString += '<span class="time">';
		templateString += this.emptyInnerText;
		templateString += '</span>';
		templateString += '</p>';
		templateString += '</div>';
		templateString += '</li>';
		templateString += '</ul>';
		templateString += '</div>';
		templateString += '</div>';
		this.emptyText = templateString;
	},
	createTemplate : function(){
		var _this = this;
		var title = _this.title;
		var columns = this.columns;
		var showColumns = [];
		
		var templateString = '';
		templateString += '<div class="w3h3" >';
		/***************************title***************************/
		templateString += this.titleHTML();
		/***************************body***************************/
		if(this.url && this.columns){
			Ext.each(columns, function(col){
				col.width = col.width?col.width:100;
				col.align = col.align?col.align:'left';
				if(col.show){
					showColumns.push(col);
				}
			});
		
			templateString += '<div class="tile_grid_list tile_content" >';
			templateString += '<ul class="in_sys_ul">';
			
			if(this.needheader){
				templateString += '<li>';
				templateString += '<div class="in_sys_line">';
				templateString += '<p class="in_sys_p">';
				
				for(var i=0;i<showColumns.length;i++){
					var col = showColumns[i];
					if(i >0){
						templateString += '<span class="type_red"></span>';
					}
					if(col && col.header){
						templateString += '<a title="'+col.header+'" class="tit" style="width:'+col.width+'px;display:inline;">'+col.header+'</a>';
					}
				}
				templateString += '</p>';
				templateString += '</div>';
				templateString += '</li>';
			}
			
			templateString += '<tpl for=".">';
			templateString += '<li>';
			templateString += '<div class="in_sys_line">';
			templateString += '<p class="in_sys_p">';
			for(var i=0;i<showColumns.length;i++){
				var col = showColumns[i];
				if(i >0){
					templateString += '<span class="type_red"></span>';
				}
				if(col && col.columnName){
					templateString += '<a title="{'+col.columnName+'}" href="javascript:void(0);" class="tit" style="width:'+col.width+'px;display:inline;text-align:'+col.align+';">{'+col.columnName+'}</a>';
				}
			}
			templateString += '</p>';
			templateString += '</div>';
			templateString += '</li>';
			templateString += '</tpl>';
			templateString += '</ul>';
			templateString += '</div>';
				
		}
		templateString += '</div>';
		this.tpl = new Ext.XTemplate(templateString);
	},
	listeners : {
		afterrender : function(){
			if(this.url && this.columns){
				Wlj.TileMgr.addDataCfg({
					controlPanel : this,
					store : this.store
				});
			} else {
				this.tpl.append(this.el);
			}
			var _this = this;
			this.el.on('click',function(){
				_this.ownerCt.clickFire();
			});
		},
		beforedestroy : function(){
			var index = false;
			for(var i=0;i<Wlj.TileMgr.tilesData.getCount();i++){
				if(Wlj.TileMgr.tilesData.get(i).controlPanel === this){
					Wlj.TileMgr.tilesData.removeAt(i);
					return true;
				}
			}
			return true;
		}
	}
});
