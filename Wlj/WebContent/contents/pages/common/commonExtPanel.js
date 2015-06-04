/**
 * 定义命名空间
 */
Ext.namespace("Mis.Ext");

/*
 * CRUD面板基类
 */

Mis.Ext.CrudPanel = Ext.extend(Ext.Panel,{
	
	closable : true,

	autocroll : true,

	layout : "border",

	frame : true,
	
	//查询form的高度的默认值，定以后将覆盖
	seFormHeight : 80,

    //列表的高度的默认值，定以后将覆盖
	gridHeight : false,
	
	//列表的宽的默认值，定以后将覆盖
	gridWidth : false,

	//弹出窗口高度的默认值，定以后将覆盖
	winHeight : 480,

	//弹出窗口宽度的默认值，定以后将覆盖
	winWidth : 800,

	// 查询的url
	stUrl : false,

	// dem数据
	demoData : false,

	// 新增的URL
	addUrl : false,
	//新增按钮控制点ID，如果不定义，则新增按钮不控制
	addGrant : false,
	//新增按钮名称
	addButton : "新增",
	// 修改的URL
	updateUrl : false,
	updateGrant : false,
	updateButton : "修改",
	// 查看的URL
	detailUrl : false,
	detailGrant : false,
	detailButton : "查看",
	// 删除的URL
	deUrl : false,
	delGrant : false,
	delButton : "删除",
	// 保存的时候调用的URL
	opUrl : false,

	// 复选框
	sm : false,

	// 扩展的按钮
	buts : false,
	
	//扩展按钮在默认按钮的前面展示
	butsFirst : false,

	// 是否采用复选框
	checkbox : false,
	
	// 是否采用单选框
	singleSelect : false, 
	
	// 分页每页显示的记录数
	pagesize : false,
	//Grid定义
	grid : false,
	//列要素
	gclms : null,
	
	//form要素
	fclms : false,
	formColums : false,
	// 查询要素
	selectItems : false,

	// 主键
	primary : false,
	
	//新增修改详情form的属性
	baseForm : false,
	
	//查询form的属性
	seBaseForm : false,
	
	//是否需要双击显示详情，默认为显示，定义为false后，无此功能
	dbclick : true,
	
	//create方法的扩展方法
	createFun : false,
	
	//edit方法的扩展方法
	editFun : false,
	
	//查看详情方法的扩展方法
	detailFun : false,
	
	//2012-12-02添加：新增、修改保存时扩展方法,主要用于客户端校验以及Form表单内容的组织
	saveSubmitFun : false,
	
	//查询出详细信息后的扩展方法
	afterSeOneFun : false,
	
	//是否进入页面就加载数据
	defaultLoad : true,
	
	//是否引入合计项
	summary : false,
	
	//插件
	plugins : false,
	
	// gridPanel上的cm
	gclm : function() {

		// 完成表格的字段配置
		var mapping = [], column = [];

		// 增加行号
		column.push(new Ext.grid.RowNumberer({
			header : 'No.',
			width : 28
		}));

		if (this.checkbox)
		{
			column.push(this.sm = new Ext.grid.CheckboxSelectionModel());
		}
		if (this.singleSelect)
		{
			Mis.Ext.CheckboxSelectionModel = Ext.extend(Ext.grid.CheckboxSelectionModel, {
				singleSelect:true
			});
			
			column.push(this.sm = new Mis.Ext.CheckboxSelectionModel());
		}
		var cLength=0;
		var tWidth=this.gridWidth ? this.gridWidth : document.body.clientWidth-60;
		Ext.each(this.gclms, function(item) {
			if (item.header) 
				cLength=cLength+1;
		});
		// 配置查询结果列表字段信息
		Ext.each(this.gclms, function(item) {
			if (item.name) {
				var mCfgTemp = {
					name : item.name
				};
				// 如果是日期字段
				if (mCfgTemp.type == 'date') {
					Ext.applyIf(mCfgTemp, {
						dateFormat : 'Y-m-d'
					});
				};
				// 如果需要映射
				if (item.mapping) {
					Ext.applyIf(mCfgTemp, {
						mapping : item.mapping
					});
				};
				mapping.push(mCfgTemp);
				// 定义列
				if (item.header) {
					var cCfgTemp = {
						sortable : true,
						dataIndex : item.name,
						width : (item.width ? item.width : tWidth/cLength)
					};
					if (item.type == 'int')
						Ext.applyIf(cCfgTemp, {
							renderer : Mis.Ext.FormatInt
						});
					else if (item.type == 'float')
						Ext.applyIf(cCfgTemp, {
							renderer : Mis.Ext.FormatFloat,
							align : 'right'
						});
					else if (item.type == 'percent')
						Ext.applyIf(cCfgTemp, {
							renderer : Mis.Ext.FormatPercent,
							align : 'right'
						});
					else if (item.type == 'date')
						Ext.applyIf(cCfgTemp, {
							renderer : function(value){
							
								if(value!=undefined&&value.time!=undefined)
									return new Date(value.time).format('Y-m-d');
								else
									return "";						
							}
						});
					else if (item.type == 'mapping')
						Ext.applyIf(cCfgTemp, {
							renderer : function(value){
							
								
								if(value==undefined)
									return "";
								else{
									if("number"==typeof(value))
										value=value.toString();	
									var no = item.store.findBy(function(record) { 
										return  record.get(item.mappingkey) == value;
									});
									return no > -1 ? item.store.getAt(no).get(item.mappingvalue) : value;
								} 
							}
						});
					Ext.apply(cCfgTemp, item);
					column.push(cCfgTemp);
				}
				;
			}
			;
		});
		
		var cCfg = new Ext.grid.ColumnModel(column);
		cCfg.defaultSortable = true;
		var mCfg = new Ext.data.Record(mapping);
		var clmCfg = {
			cCfg : cCfg,
			mCfg : mCfg
		};
		this.clmCfg = clmCfg;

	},	
	
    //操作按钮
	tbars : function(buts) {
		var butItems = [];
		var defaultButs = [];
		if (this.updateUrl) {
			defaultButs.push({//查看按钮，若定义修改url时，展示详情按钮
				text : this.detailButton,
				iconCls : 'detailIconCss',
				tooltip : this.detailButton,
				handler : this.detail,
				scope : this
			});
			defaultButs.push('-');
		};
		if (this.addUrl) {
			defaultButs.push({//新增按钮
				text : this.addButton,
				iconCls : 'addIconCss',
				tooltip : this.addButton,
				disabled:JsContext.checkGrant(this.addGrant),
				handler : this.create,
				scope : this
			});
			defaultButs.push('-');
		};
		if (this.updateUrl) {
			defaultButs.push({//修改按钮
				text : this.updateButton,
				iconCls : 'editIconCss',
				tooltip : this.updateButton,
				disabled:JsContext.checkGrant(this.updateGrant),
				handler : this.edit,
				scope : this
			});
			defaultButs.push('-');
		};
		if (this.deUrl) {//删除按钮
			defaultButs.push({
				text : this.delButton,
				iconCls : 'deleteIconCss',
				tooltip : this.delButton,
				disabled:JsContext.checkGrant(this.delGrant),
				handler : this.removeFun,
				scope : this
			});
			defaultButs.push('-');
		};
		if (this.detailUrl) {//查看按钮，查看详情一般没有url，故通常不执行
			defaultButs.push({
				text : this.detailButton,
				iconCls : 'detailIconCss',
				tooltip : this.detailButton,
				handler : this.detail,
				scope : this
			});
			defaultButs.push('-');
		};
		
		// 扩展的按钮
		if (this.buts) {
			if(this.butsFirst)
				butItems.push(buts);
			else
				defaultButs.push(buts);
		}
		butItems.push(defaultButs);
		return (butItems ? new Ext.Toolbar(butItems) : false);
	},
	
	//弹出的窗口
	initWin : function() {
		var win = new Ext.Window({
			plain : true,
			layout : 'fit',
			resizable : true,
			draggable : true,
			closable : true,
			closeAction : 'hide',
			modal : true, // 模态窗口
			shadow : true,
			loadMask : true,
			maximizable : true,
			collapsible : true,
			titleCollapse : true,
			border : false,
			width : this.winWidth,
			height : this.winHeight,
			buttonAlign : "center",
			title : this.title,
			items : [ this.fp ],
			buttons : [ this.winButs]
		});
		return win;
	},
	// 显示（新增/修改/详情）窗口
	showWin : function() {
		if (!this.win) {
			if (!this.fp) {
				var fromCof = {frame : true,autoScroll : true,reader : this.reader};
				if(this.baseForm)
					Ext.applyIf(fromCof, this.baseForm);
				}
			    if(this.fclms)
			    	Ext.applyIf(fromCof, {items : this.fclms});
			    if(this.formColums)
			    	Ext.applyIf(fromCof, {items : this.formColums()});
				this.fp = new Ext.form.FormPanel(fromCof);
			}
			this.win = this.initWin();
			
			// 窗口关闭时，数据重新加载
			this.win.on("close", function() {
				this.win.hide();
			}, this);
		this.win.show();
	},

	// 创建（新增/修改）窗口
	create : function() {
		this.opUrl = this.addUrl;
	    var winButsArray = [];
	    winButsArray.push({text : "保存",handler : this.save, scope : this});
	    winButsArray.push({text : "清空",handler : this.reset,scope : this});
	    winButsArray.push({text : "关闭",handler : this.closeWin,scope : this});
		this.winButs = winButsArray;
		this.showWin();
		this.reset();
		if(this.createFun)
			this.createFun();
		
	},

	// 数据保存[（新增/修改）窗口]
	save : function() {
		if (this.opUrl == null || this.opUrl == '') {
			Ext.Msg.alert('提示', '链接为空，无法执行数据操作！');
			return false;
		}
		if (!this.fp.form.isValid()) {
			Ext.Msg.alert('提示', '输入不合法，请重新输入！');
			return false;
		}
		//调用自定义的验证方法
		if(this.saveSubmitFun){
			//如果校验不通过返回false,其他情况均返回true
			var returnFlag=this.saveSubmitFun();
			if(!returnFlag)
				return false;
		}
		Ext.Ajax.request({
			url : this.opUrl,
			method : 'POST',
			form : this.fp.form.id,
			scope : this,
			waitMsg : '正在保存数据,请等待...', // 显示读盘的动画效果，执行完成后效果消失
			success : function() {
				this.grid.getEl().unmask();
				Ext.Msg.alert('提示', '操作成功！');
				this.loadCurrData();
			},
			failure : function(a, b) {
				this.grid.getEl().unmask();
				if (a.responseText != ''){
					var t = Ext.decode(a.responseText);
					Ext.Msg.alert('提示', t.msg);
				}else{
					Ext.Msg.alert('提示', '操作失败！');
				}
				this.loadCurrData();
			}
		});
		this.closeWin();
	},

	// （新增/修改/详情）窗口上的清空
	reset : function() {
		if (this.win)
			this.fp.form.reset();
	},

	// （新增/修改/详情）窗口上的关闭
	closeWin : function() {
		if (this.win)
			this.win.hide();
	},
	
	//查询数据库一条记录
	seOneRecord : function(id){
		var afterSeOneFun = this.afterSeOneFun;
		var primary = this.primary;
		var mappingId;
		Ext.each(this.clmCfg.mCfg.data, function(item) {
			if (item.name == primary) {
				mappingId = item.mapping;
				return false;
			}
		});
		this.fp.getForm().load({
			 restful:true,	
		     url:this.stUrl,
		     params:{
		    	 'condition':'{"'+primary+'":"'+id+'"}'
		     },
		     method: 'GET',
		     success : function(a) {
					if(afterSeOneFun)
						afterSeOneFun(a.reader.jsonData.json.data[0]);

				}
		});
	},

	// 选中一行点击修改，
	edit : function() {
		if (this.grid.selModel.hasSelection()) {
			var records = this.grid.selModel.getSelections();// 得到被选择的行的数组
			var recordsLen = records.length;// 得到行数组的长度
			if (recordsLen > 1) {
				Ext.Msg.alert("系统提示信息", "请选择其中一条记录进行修改！");
			} else {
				var record = this.grid.getSelectionModel()
						.getSelected();
				var id = record.get(this.primary);
				this.opUrl = this.updateUrl;
				var winButsArray = [];
				winButsArray.push({text : "保存",handler : this.save, scope : this});
				winButsArray.push({text : "关闭",handler : this.closeWin,scope : this});
	    		this.winButs = winButsArray;
	    		this.showWin();
	    		if(this.editFun)
					this.editFun();
	    		if(this.stUrl)
	    			this.seOneRecord(id);
	    		else if(this.demoData)
	    			this.fp.getForm().loadRecord(record);
				
			}
		} else {
			Ext.Msg.alert("提示", "请先选择要修改的记录！");
		}
	},

	// 选中一行点击详情或双击，
	detail : function() {
		if (this.grid.selModel.hasSelection()) {
			var records = this.grid.selModel.getSelections();// 得到被选择的行的数组
			var recordsLen = records.length;// 得到行数组的长度
			if (recordsLen > 1) {
				Ext.Msg.alert("系统提示信息", "请选择其中一条记录！");
			} else {
				var record = this.grid.getSelectionModel()
				.getSelected();
				var id = record.get(this.primary);;
				var winButsArray = [];
				winButsArray.push({text : "关闭",handler : this.closeWin,scope : this});
	    		this.winButs = winButsArray;
	    		this.showWin();
	    		if(this.detailFun)
					this.detailFun();
	    		if(this.stUrl)
	    			this.seOneRecord(id);
	    		else if(this.demoData)
	    			this.fp.getForm().loadRecord(record);
				
			}
		} else {
			Ext.Msg.alert("提示", "请先选择要查看的记录！");
		}
	},

	// 加载数据
	loadCurrData : function(flag) {
		if (this.stUrl) {
			
			if (flag != 0 && this.selectForm) {
				if(!this.selectForm.form.isValid()){
					return false;
				}
				var conditionStr = this.selectForm.getForm().getValues(false);
				this.store.baseParams = {
					"condition" : Ext.encode(conditionStr)
				};
			};
			//映射数据字典
			var oraMap = {};
			Ext.each(this.gclms, function(item) {
				if (item.header)
				{
					oraMap[item.name]=item.mapping;
				}
			});
			this.store.setBaseParam('oraMap', Ext.encode(oraMap));
			if(!this.pagesize){
				this.store.load();
			}else{
				this.store.load({
					params : {
						start : 0,
						limit : parseInt(this.pagesize_combo.getValue())
					}
				});
			}
		} else if (this.demoData)
			this.store.loadData(this.demoData);
	},

	// 删除,pid为主键值
	removeFun : function(pid) {
		if (this.grid.selModel.hasSelection()) {
			Ext.MessageBox.confirm('系统提示信息','确定要删除所选的记录吗？',function(buttonobj) {
				if (buttonobj == 'yes'&& this.primary) {
									var records = this.grid.selModel
											.getSelections();// 得到被选择的行的数组
									var selectLength = records.length;// 得到行数组的长度
									var idStr = '';
									for ( var i = 0; i < selectLength; i++) {
										selectRe = records[i];
										tempId = selectRe.get(this.primary);
										idStr += tempId;
										if (i != selectLength - 1)
											idStr += ',';
									};
									Ext.Ajax.request({
												url : this.deUrl,
												params : {
													idStr : idStr
												},
												waitMsg : '正在保存数据,请等待...', // 显示读盘的动画效果，执行完成后效果消失
												method : 'POST',
												scope : this,
												success : function() {
													this.grid.getEl().unmask();
													Ext.Msg.alert('提示', '操作成功！');
													this.loadCurrData();
													},
												failure : function(a, b) {
												this.grid.getEl().unmask();
												if (a.responseText != ''){
													var t = Ext.decode(a.responseText);
													Ext.Msg.alert('提示', t.msg);
												}else{
													Ext.Msg.alert('提示', '操作失败！');
												}
												this.loadCurrData();
												}
											});
								}
							}, this);
		} else {
			Ext.Msg.alert("提示", "请先选择要删除的行!");
		}
	},

	// 初始化GRID面板
	initComponent : function() {//增加合计功能后解决页面报错问题  
		Mis.Ext.CrudPanel.superclass.initComponent.call(this);
		this.gclm();
		var selectFormConf = {
				labelAlign : 'right',
				region : 'north',
				buttonAlign : 'center',
				height:this.seFormHeight,
				split : true,
				buttons : [
				           {text : '查询',handler : function() {this.stUrl = this.ownerCt.ownerCt.ownerCt.stUrl;this.ownerCt.ownerCt.ownerCt.loadCurrData();}},
				           {text : '重置',handler : function() {this.ownerCt.ownerCt.ownerCt.selectForm.getForm().reset();}} //如果在Tab页上使用，添加id,会出现bug
				           ]};
		if (this.selectItems)
        {
			Ext.apply(selectFormConf,{items : this.selectItems});
			if(this.seBaseForm)
				Ext.apply(selectFormConf,this.seBaseForm);
			this.selectForm = new Ext.form.FormPanel(selectFormConf);
			this.add(this.selectForm);
		}
		//查询结果Reader
		this.reader = new Ext.data.JsonReader({
			successProperty : 'success',
			messageProperty : 'message',
			root : 'json.data',
			totalProperty : 'json.count'
		}, this.clmCfg.mCfg.data);
		var storeConfig = {
			reader : this.reader
		};
		if (this.stUrl) {
			Ext.apply(storeConfig, {
				restful : true,
				proxy : new Ext.data.HttpProxy({
					url : this.stUrl
				})
			});
		}
		this.store = new Ext.data.Store(storeConfig);
		/**
		 * Refresh the url of proxy api configration, especially when there is a parameter in the url.
		 * Modified at 2012-4-11
		 */
		if(!this.demoData){
			this.store.proxy.on('beforeload',function(){
				//this method will just refresh the READ action.
				this.setApi( Ext.data.Api.actions.read, this.url ); 
				//this method will refresh all the action url.
				//this.setUrl(this.url,true);
			});
		}
		//增加合计项
		if(this.summary){
			this.plugins = new Ext.ux.grid.GridSummaryCurd();
		}
		
		//计算Grid的自适应高度
		var gridHeight = this.gridHeight ? this.gridHeight : document.body.clientHeight-this.seFormHeight-30;
		//定义Grid配置项
		var gridConfig = {
			store : this.store,
			cm : this.clmCfg.cCfg,
			region : 'center',
			height : gridHeight,
			trackMouseOver : false,
			loadMask : true,
			stripeRows : true
		};
		if (this.sm)
			Ext.applyIf(gridConfig, {sm : this.sm});
		//增加按钮配置
		if (this.tbars(this.buts))
			Ext.applyIf(gridConfig, {tbar : this.tbars(this.buts)});

		//增加分页配置
		if (this.pagesize){
		
			// 每页显示条数下拉选择框
			pagesize_combo = new Ext.form.ComboBox({
				name : 'pagesize',
				triggerAction : 'all',
				mode : 'local',
				store : new Ext.data.ArrayStore({
					fields : [ 'value', 'text' ],
					data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
								[ 100, '100条/页' ], [ 250, '250条/页' ],
								[ 500, '500条/页' ] ]
				}),
				valueField : 'value',
				displayField : 'text',
				value : this.pagesize,
				editable : false,
				width : 85
			});
			this.pagesize_combo = pagesize_combo;
			var bbar = new Ext.PagingToolbar({
//								pageSize : this.pagesize,
				pageSize : parseInt(this.pagesize_combo.getValue()),
				store : this.store,
				displayInfo : true,
				displayMsg : '显示{0}条到{1}条,共{2}条',
				emptyMsg : "没有符合条件的记录",
				items : [ '-', '&nbsp;&nbsp;', this.pagesize_combo ]
			});
			this.pagebar = bbar;
			var _panel = this;
			// 改变每页显示条数reload数据
			this.pagesize_combo.on("select", function(comboBox) {
				_panel.pagebar.pageSize = parseInt(this.getValue()),
				_panel.store.reload({
					params : {
						start : 0,
						limit : parseInt(this.getValue())
					}
				});
			});
			Ext.applyIf(gridConfig, {
				bbar : this.pagebar
			});
		}

		//初始化GridPanel
		var grid = new Ext.grid.GridPanel(gridConfig);
		// 双击时执行详细信息展示
		if(this.dbclick)
			grid.on("celldblclick", this.detail, this);
		this.grid = grid;
		this.add(this.grid);
		
		// 首次进入页面默认加载数据(移到最后是修改选择分页页数后点击查询，分页不生效问题)
		if(this.defaultLoad)
			this.loadCurrData(0);
		//this.fclms=this.formColums;
		//2012-12-02	最后调用父类afterRender方法，解决IE8label对其问题
		Mis.Ext.CrudPanel.superclass.afterRender.call(this);
		
		
	}
});

// format.renderer
Mis.Ext.FormatInt = function(v) {
	return Ext.util.Format.number('0,000');
};
Mis.Ext.FormatFloat = function(v) {
	return Ext.util.Format.number(v,'0,000.00');
};
Mis.Ext.FormatPercent = function(v) {
	return Ext.util.Format.number(v,'0,000.00%');
};
Mis.Ext.FormatCnMoney = function(v) {
	return '￥'+Ext.util.Format.number(v,'0,000.00');
};
var util={teller:{},field:{},layout:{},grid:{},form:{},Format:{},Windows:{},holiday:{workingDay:{},holiday:{}},menu:{}
};
Ext.apply(util.layout,{
	_tr:function(){
		var args=arguments,maxRows=0;
		var first=args[0],last=args[args.length-1];
		var res={ENTRY:first,EXIT:last.length>first.length?last[last.length-1]:first[first.length-1],layout:'column',items:[]};
		for(var i=0;i<args.length;i++){res.items.push({columnWidth:args[i][0].columnWidth?args[i][0].columnWidth:(1.0/args.length),layout:'form',items:args[i]});}
		return res;
	}
});
Ext.apply(util.form,{
	_td:function(item){
		var field;
		Ext.applyIf(item,{D:{},anchor:'90%',labelSeparator:'',enableKeyEvents:true,selectOnFocus:true});
		if(item.xtype=='textfield'){
			
		}else if(item.xtype=='combo'){
			//if(item.allowBlank==false)Ext.applyIf(item,{emptyText:'请选择'});
			Ext.applyIf(item,{hiddenName:item.name,mode:'local',typeAhead:true,forceSelection:true,triggerAction:'all',emptyText:'请选择',selectOnFocus:true});
		}else if(item.xtype=='datefield'&&!item.format){
			Ext.applyIf(item,{format : 'Y-m-d',editable : false});
		}/*else if(item.xtype=='htmleditor'){
			Ext.applyIf(item,{height:200,width:600});
		}else if(item.xtype=='treeselector'){//tree下第一次提供默认值不显示的问题
			item.tree=util.treePanel(item.rootNode);
			if(item.value)Ext.applyIf(item,{rawValue:DICT.treeFind(item.rootNode,item.value).text});
		}else if(item.xtype=='itemselector'){
			Ext.applyIf(item,{value:'',dataFields:['value','text'],msWidth:250,msHeight:200,valueField:'value',displayField:'text',imagePath:util.constant.uri.image+'itemselector/',toLegend:'\u5df2\u9009\u9879',fromLegend:'\u53ef\u9009\u9879'});
			var toData=[],fromData=[],v=','+item.value+',';
			var dict=(typeof(item.dict)=='string')?DICT.data[item.dict]:item.dict;
			dict.each(function(i){if(v.indexOf(','+i[0]+',')>=0)toData.push(i);else fromData.push(i)});
			field=new Ext.ComponentMgr.create(Ext.applyIf(item,{fromData:fromData,toData:toData,toTBar:[{iconCls:'icon-delete',tooltip:"\u6e05\u9664",handler:function(){field.reset.call(field);}}]}));
			return field;
		}else if(item.xtype=='numberfield'){
			if(!item.decimalPrecision)Ext.applyIf(item,{allowDecimals:false});
			Ext.applyIf(item,{allowNegative:false});
		}*/
		//if(!item.fieldLabel||item.fieldLabel=='')Ext.applyIf(item,{labelSeparator:'&nbsp;',hidden:true});
		field=new Ext.ComponentMgr.create(item);
		
		return field;
	},
	_store:function(){
		var args=arguments;var url;var key;var value;
		if(args.length==1){			
			return new Ext.data.Store({
				restful : true,
				proxy : new Ext.data.HttpProxy({
					url : basepath+args[0]
				}),
				reader : new Ext.data.JsonReader({
					root : 'JSON'
				}, [ 'key', 'value' ])
			});
		}else{
			return new Ext.data.Store({
				restful : true,
				//autoLoad : true,
				proxy : new Ext.data.HttpProxy({
					url : basepath + args[0]
				}),
				field : [args[1],args[2]],
				reader : new Ext.data.JsonReader({
				}, [{name:args[1]},{name:args[2]} ])
			});
		}
		

	}

});