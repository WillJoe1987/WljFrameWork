/**
 * 条件、查询项展示面板
 */


Ext.ns('Com.yucheng.crm.query');

/**
 * 查询条件常量
 */
Com.yucheng.crm.query.Util = {
	optypes :{
		INCLUDE : [['等于', '0002'],['包含', '0000']],
		COMPARE : [['大于', '0001'], ['等于', '0002'], ['小于', '0003'], ['大于等于', '0004'], ['小于等于', '0005']],
		EQUAL : [['等于', '0002']],
		ALL : [['包含', '0000'],['大于', '0001'], ['等于', '0002'], ['小于', '0003'], ['大于等于', '0004'], ['小于等于', '0005']]
	},
	types : {
		VARCHAR2:'QUERYUTIL.optypes.INCLUDE',
		DATE:'QUERYUTIL.optypes.COMPARE',
		NUMBER:'QUERYUTIL.optypes.COMPARE',
		DECIMAL:'QUERYUTIL.optypes.COMPARE',
		INTEGER:'QUERYUTIL.optypes.COMPARE',
		VARCHAR:'QUERYUTIL.optypes.INCLUDE',
		CHAR:'QUERYUTIL.optypes.INCLUDE',
		BIGINT:'QUERYUTIL.optypes.COMPARE'
	},
	orderTypes : new Ext.data.SimpleStore({
		fields : ['name', 'code'],
		data : [['不排序', '0'],['正序', '1'],['逆序', '2']]
	}),
	custBaseInfo : {
		dbTable :'ACRM_F_CI_CUSTOMER',
		idColumn : 'CUST_ID',
		nameColumn : 'CUST_NAME',
		typeColumn : 'CUST_TYPE',
		dbNode : false,
		idNode : false,
		nameNode : false,
		typeNode : false
	},
	prodBaseInfo : {
		dbTable : 'OCRM_F_PD_PROD_INFO',
		idColumn : 'PRODUCT_ID',
		nameColumn : 'PROD_NAME',
		dbNode : false,
		idNode : false,
		nameNode : false
	}
};
QUERYUTIL = Com.yucheng.crm.query.Util;

Com.yucheng.crm.query.QeuryPanel = Ext.extend(Ext.FormPanel, {
	height :400,
	labelAlign: 'top',
	bodyStyle:'padding:0px 0px 0px 5px',
	autoHeight : true,
	autoWidth : false
});
/**
 * 查询条件面板类
 */
Com.yucheng.crm.query.SearchPanel = Ext.extend(Com.yucheng.crm.query.QeuryPanel, {
	
	conditions : new Array(),
	initComponent : function(){
		Com.yucheng.crm.query.SearchPanel.superclass.initComponent.call(this);
		this.add(new Ext.Panel({
			html:'<table><tr><td style= "text-align:center;width:80px;font-size:12px;">属性 </td><td style= "text-align:center;width:170px;font-size:12px;">操作符</td><td style= "text-align:center;width:170px;font-size:12px;">属性值</td><td></td></tr></table> '
		}));
	},
	/**
	 * 添加一个查询条件
	 * @param node:数据字段节点，从数据集树上获取
	 * @param op : 可选参数，查询条件操作符
	 * @param value : 可选参数，查询条件值
	 */
	addItems : function(node,op,value){
		
		for(var n=0;n<this.conditions.length;n++){
//			if(this.conditions[n].nodeInfo === node){
//				Ext.Msg.alert('提示','该列已选');
//				return false;
//			}
		}
		
		var si = new Com.yucheng.crm.query.SearchItem({
			nodeInfo:node,
			oprater :op,
			conditionValue : value
		});
		this.conditions.push(si);
		this.add(si);
		this.doLayout();
	},
	/**
	 * 移除一个查询条件项
	 * @param item:查询条件面板
	 */
	removeItem : function(item){
		this.conditions.remove(item);
		this.remove(item);
	},
	/**
	 * 移除所有查询条件
	 */
	removeAllItems : function(){
		var _this = this;
		while(_this.conditions.length>0){
			_this.removeItem(_this.conditions[0]);
		}
	},
	/**
	 * 获取查询条件
	 */
	getConditionsAttrs : function(){
		var _this = this;
		var conditions = new Array();
		Ext.each(_this.conditions, function(con){
			var conAtt = {};
			conAtt.ss_col_item = con.columnId.substring(1);
			conAtt.ss_col_op = con.oprater;
			conAtt.ss_col_value = con.conditionValue;
			conditions.push(conAtt);
		});
		return conditions;
	}
});
/**
 * 查询条件项面板
 */
Com.yucheng.crm.query.SearchItem = Ext.extend(Ext.Panel,{
	nodeInfo : false, //关联数据字段节点
	oprater: null,	//条件操作符
	conditionValue:null,//条件值
	
	valueStore : false,
	/**
	 * 对象构建方法，初始化面板各数据属性，根据字段类型以及字典编码，创建操作符、字段值下拉框数据源（store）
	 */
	initComponent : function(){
    	if(!this.nodeInfo){
    		return false;
    	}
    	this.textName = this.nodeInfo.text;
    	this.columnId = this.nodeInfo.id;
    	this.columnName = this.nodeInfo.attributes.ENAME;
    	this.columnType  = this.nodeInfo.attributes.CTYPE;
    	this.datasetId = this.nodeInfo.attributes.PARENT_ID;
    	this.opstore = new Ext.data.SimpleStore({
    		fields : ['name', 'code']
    	});
    	this.opstore.loadData(this.nodeInfo.attributes.NOTES?QUERYUTIL.optypes.EQUAL:eval(QUERYUTIL.types[this.columnType]));
    	if(this.nodeInfo.attributes.NOTES){
    		this.valueStore = new Ext.data.Store({
    			restful:true,
    			proxy : new Ext.data.HttpProxy({
    				url :basepath+'/lookup.json?name='+this.nodeInfo.attributes.NOTES
    			}),
    			reader : new Ext.data.JsonReader({
    				root : 'JSON'
    			}, [ 'key', 'value' ])
    		});
    	}
    	
    	Com.yucheng.crm.query.SearchItem.superclass.initComponent.call(this);
	},
	/**
	 * 销毁方法，对象销毁时触发，销毁对象所创建的数据源
	 */
	onDestroy :function(){
		var _this = this;
		if(_this.valueStore)
			_this.valueStore.destroy();
		if(_this.opstore){
			_this.opstore.destroy();
		}
		Com.yucheng.crm.query.SearchItem.superclass.onDestroy.call(this);
	},
	/**
	 * 渲染方法，对象渲染时（首次展示）触发，创建字段名、操作符、条件值展示框。
	 */
	onRender : function(ct, position){
		
		var _this = this;
		_this.nameField = new Ext.form.DisplayField({
			emptyText : '',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			hideLabel:true,
			xtype : 'displayfield',
			name : 'attributeName_' + id,
			anchor : '95%',
			value : _this.textName
		});
		_this.opField = new Ext.form.ComboBox({
			hiddenName:'operateName_'+id,
			hideLabel:true,
			allowBlank : false,
			labelStyle: 'text-align:right;',
			triggerAction : 'all',
			store : _this.opstore,
			displayField : 'name',
			valueField : 'code',
			mode : 'local',
			forceSelection : true,
			typeAhead : true,
			emptyText:'请选择',
			resizable : true,
			anchor : '95%',
			value : _this.oprater,
			listeners : {
				select : function(combo,record,index){
					_this.oprater = record.data.code;
				}
			}
		});
		if(_this.nodeInfo.attributes.CTYPE == 'DATE'){
			_this.valueField = new Ext.form.DateField({
				allowBlank : false,
				hideLabel:true,
				labelStyle: 'text-align:right;',
				format:'Y-m-d', //日期格式化
				name : 'attributeValueName_' + id,
				anchor:'95%',
				value : _this.conditionValue,
				listeners : {
					select : function(combo,date){
						_this.conditionValue = date.format('Y-m-d');
					}
				}
			});
		} else if (_this.valueStore){
			_this.valueField = new Ext.form.ComboBox({
				hiddenName:'operateName_'+id,
				hideLabel:true,
				allowBlank : false,
				labelStyle: 'text-align:right;',
				triggerAction : 'all',
				store : _this.valueStore,
				displayField : 'value',
				valueField : 'key',
				mode : 'local',
				forceSelection : true,
				typeAhead : true,
				emptyText:'请选择',
				resizable : true,
				anchor : '95%',
//				value : _this.conditionValue,
				listeners : {
					select : function(combo,record,index){
						_this.conditionValue = record.data.key;
					}
				}
			});
			_this.valueStore.load({callback:function(){
				_this.valueField.setValue( _this.conditionValue);
			}});
		} else {
			_this.valueField = new Ext.form.TextField({
				emptyText : '',
				editable : false,
				triggerAction : 'all',
				allowBlank : false,
				hideLabel : true,
				name : 'attributeValueName_' + id,
				labelStyle : 'text-align:right;',
				xtype : 'textfield',
				anchor : '95%',
				value : _this.conditionValue,
				listeners : {
					change : function(field,newValue,oldValue){
						_this.conditionValue = field.getValue();
					}
				}
			});
		}
		this.add(new Ext.Panel({
			items : [{
				layout : 'column',
				border : false,
				items : [{
					columnWidth : .15,
					layout : 'form',
					border : false,
					items : [_this.nameField]
				}, {
					columnWidth : .30,
					layout : 'form',
					border : false,
					items : [_this.opField]
				}, {
					columnWidth : .30,
					layout : 'form',
					border : false,
					items : [_this.valueField]
				}, {
					columnWidth : .021,
					layout : 'form',
					border : false,
					items : []
				}, {
					columnWidth : .079,
					layout : 'form',
					border : false,
					items : [{ 
						xtype: 'button', 
						text: '删除', 
						scope: this, 
						handler: function(){ 
							_this.ownerCt.removeItem(_this);
						} 
					}]
				}
			]}]
		}));
		
		Com.yucheng.crm.query.SearchItem.superclass.onRender.call(this, ct, position);
	}
});

/**
 * 查询结果列面板
 */
Com.yucheng.crm.query.ColumnsPanel = Ext.extend(Com.yucheng.crm.query.QeuryPanel, {
	
	resultColumns : new Array(),	//查询结果面板数组
	selectModel : new Ext.grid.CheckboxSelectionModel(),//公用复选框
    resultNumber : new Ext.grid.RowNumberer({	//数据行号框
        header : 'No.',
        width : 28
    }),
    /**
     * 构造方法，创建面板头
     */
    initComponent:function(){
		Com.yucheng.crm.query.ColumnsPanel.superclass.initComponent.call(this);
		this.add(new Ext.Panel({
			layout : 'column',
			border : false,
			items : [{
				html:'<table><tr><td style= "text-align:center;width:80px;font-size:12px;">名称 </td><td style= "text-align:center;width:170px;font-size:12px;">排序方式</td><td></td></tr></table> '
			}]
		}));
	},
	onRender : function(ct, position){
		Com.yucheng.crm.query.ColumnsPanel.superclass.onRender.call(this, ct, position);
	},
	
	/**
	 * 添加一个结果列
	 * @param node:字段节点对象；
	 * @param sortType:排序属性；
	 * @param hidden:是否隐藏字段；
	 * @param override:只有当值为：false时，不会改变hidden属性；
	 */
	addItems : function(node,sortType,hidden,override){
		
		var _this = this;
		for(var n=0;n<this.resultColumns.length;n++){
			if(this.resultColumns[n].nodeInfo === node){
				
				if(override === false){
					this.resultColumns[n].columnTotle = 'BASE';
				}else if(override !== false){
					this.resultColumns[n].show();
				}
				return false;
			}
		}
		var tSort = 0;
		if(sortType){
			tSort = sortType;
		}
		
		var columnTotle = 0;
		if( node === QUERYUTIL.custBaseInfo.idNode 
				|| node === QUERYUTIL.custBaseInfo.nameNode 
				|| node === QUERYUTIL.custBaseInfo.typeNode ){
			columnTotle = "BASE";
		}else {
			Ext.each(_this.resultColumns,function(rc){
				if(rc.nodeInfo.attributes.ENAME == node.attributes.ENAME){
					columnTotle ++;
				}
			});
		}
		var ci = new Com.yucheng.crm.query.ColumnsItem({
			nodeInfo:node,
			sortType:tSort,
			hidden:hidden,
			columnTotle:columnTotle
		});
		this.resultColumns.push(ci);
		this.add(ci);
		this.doLayout();
	},
	/**
	 * 移除一个结果字段面板
	 */
	removeItem : function(columnItem){
		this.resultColumns.remove(columnItem);
		this.remove(columnItem);
	},
	/**
	 * 移除所有结果字段
	 */
	removeAllItems : function(){
		var _this = this;
		while(_this.resultColumns.length>0){
			_this.removeItem(_this.resultColumns[0]);
		}
	},
	/**
	 * 获取查询结果字段属性，包括字段ID，排序类型，以及别名后缀，供后台使用
	 */
	getResults : function(){
		var _this = this;
		var rsults = [];
		Ext.each(_this.resultColumns,function(column){
			var r = {};
			r.columnId = column.nodeId.substring(1);
			r.sortType = column.sortType;
			r.columnTotle = column.columnTotle;
			rsults.push(r);
		});
		return rsults;
	},
	/**
	 * 获取查询结果字段ID拼串，保存查询方案时调用
	 */
	getResultsIds : function(){
		var resuldIds = [];
		var _this = this;
		Ext.each(_this.resultColumns,function(column){
			resuldIds.push(column.nodeId.substring(1));
		});
		return resuldIds.join(',');
	},
	/**
	 * 获取排序类型拼串，保存查询方案时调用
	 */
	getSortTypes : function(){
		var resuldIds = [];
		var _this = this;
		Ext.each(_this.resultColumns,function(column){
			resuldIds.push(column.sortType);
		});
		return resuldIds.join(',');
	},
	/**
	 * 获取查询结果reader属性，查询结果时调用；
	 * 有字典编码属性的字段讲生成两个字段。
	 */
	getResultReaderMetas : function(){
		var readerMetas = {
				successProperty: 'success',
				messageProperty: 'message',
				idProperty: 'CUST_ID',
				root:'json.data',
				totalProperty: 'json.count'
		};
		var readerFields = [];
		Ext.each(simple2.resultColumns,function(column){
			var t = {};
			t.name = column.columnName+'_'+column.columnTotle;
			readerFields.push(t);
			if(column.columnLookup){
				var t2 = {};
				t2.name = column.columnName+'_'+column.columnTotle+'_ORA';
				readerFields.push(t2);
			}
		});
		readerMetas.fields = readerFields;
		return readerMetas;
	},
	/**
	 * 获取查询结果列模型，查询结果时调用；
	 * 1、有字典编码属性的字段将生成两个字段；
	 * 2、隐藏字段将也包含在内。
	 */
	getResultColumnHeaders : function(){
		var _this = this;
		var columnHeaders = [];
		columnHeaders.push(_this.resultNumber);
		columnHeaders.push(_this.selectModel);
		Ext.each(simple2.resultColumns,function(column){
			
			var columnHead = {};
			
			columnHead.header = column.textName;
			columnHead.hidden = column.hidden;
			columnHead.hideable  = !column.hidden;
			columnHead.dataIndex = column.columnName+'_'+column.columnTotle;
			columnHeaders.push(columnHead);
			
			if(column.columnLookup){
				var columnHeadLooked = {};
				columnHeadLooked.header = column.textName;
				columnHeadLooked.hidden = column.hidden;
				columnHeadLooked.hideable  = !column.hidden;
				columnHeadLooked.dataIndex = column.columnName+'_'+column.columnTotle+'_ORA';
				columnHeaders.push(columnHeadLooked);
				columnHead.hidden = true;
				columnHead.hideable = false;
			}
		});
		return columnHeaders;
	},
	/**
	 *  获取可分组字段数据，排除隐藏字段，分组统计时调用
	 */
	getResultColumnHeaderByNodeId : function(id){
		var _this = this;
		var columnHeaders = [];
		for(var i=0;i<_this.resultColumns.length;i++){
			if(_this.resultColumns[i].nodeId == id){
				var header = {};
				header.header = _this.resultColumns[i].textName;
				if(_this.resultColumns[i].columnLookup){
					header.dataIndex = _this.resultColumns[i].columnName+'_'+_this.resultColumns[i].columnTotle+'_ORA';
				}else{
					header.dataIndex = _this.resultColumns[i].columnName+'_'+_this.resultColumns[i].columnTotle;
				}
				return header;
			}
		}
		return;
	},
	/**
	 * 获取可统计字段，排除隐藏字段，分组统计时调用
	 */
	getSumColumnsByNodeIds : function(ids){
		var _this = this;
		var sums = [];
		for(var i=0;i<_this.resultColumns.length;i++){
			if(ids.indexOf(_this.resultColumns[i].nodeId)>=0){
				var header = {};
				header.dataIndex = _this.resultColumns[i].columnName+'_'+_this.resultColumns[i].columnTotle+'_SUM';
				header.header = _this.resultColumns[i].textName+'(统计)';
				sums.push(header);
			}
		}
		return sums;
	},
	/**
	 * 获取当前展示列数
	 */
	viewedColumnsCount : function(){
		var _this = this;
		var count = 0;
		Ext.each(_this.resultColumns,function(column){
			if(!column.hidden){
				count ++ ;
			}
		});
		return count;
	}
});

/**
 * 查询结果列面板
 */
Com.yucheng.crm.query.ColumnsItem =  Ext.extend(Ext.Panel,{
	nodeInfo : false,//字段节点
	sortType : 0,//排序类型
	/**
	 * 构造方法，初始化面板各项数据信息
	 */
	initComponent : function(){
	
		if(!this.nodeInfo){
			return false;
		}
		this.textName = this.nodeInfo.text;
		this.nodeId = this.nodeInfo.id;
		this.columnName = this.nodeInfo.attributes.ENAME;
		this.columnType = this.nodeInfo.attributes.CTYPE;
		this.datasetId = this.nodeInfo.attributes.PARENT_ID;
		this.columnLookup = this.nodeInfo.attributes.NOTES;
		Com.yucheng.crm.query.ColumnsItem.superclass.initComponent.call(this);
	},
	
	/**
	 * 渲染方法，面板渲染时调用，构建结果列名、排序下拉框
	 */
	onRender : function(ct, position){
		
		var _this = this;
		_this.columnField = new Ext.form.DisplayField({
			emptyText : '',
			editable : false,
			triggerAction : 'all',
			allowBlank : false,
			hideLabel:true,
			xtype : 'displayfield',
			anchor : '95%',
			value : _this.textName
		});
		
		_this.orderField =  new Ext.form.ComboBox({
			hideLabel : true,
			labelStyle : 'text-align:right;',
			triggerAction : 'all',
			store : QUERYUTIL.orderTypes,
			value:_this.sortType,
			displayField : 'name',
			valueField : 'code',
			mode : 'local',
			forceSelection : true,
			typeAhead : true,
			emptyText : '请选择',
			resizable : true,
			anchor : '95%',
			listeners : {
				select : function(combo,record,index){
					_this.sortType = record.data.code;
				}
			}
		}) ;
		
		this.add(new Ext.Panel({
			items : [{
				layout : 'column',
				border : false,
				items : [{
					columnWidth : .15,
					layout : 'form',
					labelWidth : 60,
					border : false,
					items : [_this.columnField]
				}, {
					columnWidth : .30,
					layout : 'form',
					labelWidth : 60,
					border : false,
					items : [_this.orderField]
				}, {
					columnWidth : .30,
					layout : 'form',
					labelWidth : 60,
					border : false,
					items : []
				}, {
					columnWidth : .021,
					layout : 'form',
					labelWidth : 100,
					border : false,
					items : []
				}, {
					columnWidth : .079,
					layout : 'form',
					labelWidth : 100,
					border : false,
					items : [{ 
						xtype: 'button', 
						text: '删除', 
						scope: this, 
						handler: function(){ 
							_this.ownerCt.removeItem(_this);
						} 
					}]
				}]
			}]
		}));
		Com.yucheng.crm.query.ColumnsItem.superclass.onRender.call(this, ct, position);
	}
});