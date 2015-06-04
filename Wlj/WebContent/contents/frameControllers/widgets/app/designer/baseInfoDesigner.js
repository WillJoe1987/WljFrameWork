var baseInfoSm = new Ext.grid.CheckboxSelectionModel;
var baseInfosStore = new Ext.data.ArrayStore( {
	fields : [ {name:'baseInfoCode'},
	           {name : 'name'} ],
	data : []
});
var baseInfoCfgGrid = new Ext.grid.GridPanel( {
	stripeRows : true,
	tbar : [ {
		text : 'FormCfg',
		handler:function(){
			
		}
	} ],
	store : baseInfosStore,
	frame : true,
	sm:baseInfoSm,
	cm : new Ext.grid.ColumnModel( [baseInfoSm,
	{
		header : 'name',
		dataIndex : 'name',
		width : 150,
		sortable : true,
		hidden : false
	} ])
});
//var resetSource =function(){
//	for(var i in baseInfoSource ){
//		for(var j in baseInfoSource[i]){
//			k = baseInfoSource[i][j].value;
//			if(typeof k ==='boolean'){
//				baseInfoSource[i][j].value = false;
//			}else if (typeof k ==='string'){
//				baseInfoSource[i][j].value = '';
//			}
//		}
//	}
//	baseInfoSource['3、Grid'].gridField.value=true;
//	baseInfoSource['2、SearchField'].cAllowBlank.value=true;
//	baseInfoSource['2、SearchField'].enableCondition.value=true;
//	baseInfoSource['3、Grid'].resutlWidth.value=150;
//	baseInfoPropertyGrid.setSource(baseInfoSource);
//};

var baseInfoSource = {
		'1、Wljbase' : {
	lookupTypes : {value:'',defaultValue:'',remark:'远程数据字典'},
			text : {value:'',defaultValue:'',remark:'列标签'},
			hidden : {value:false,defaultValue:false,remark:'隐藏'},
			dataType : {value:'',defaultValue:'',remark:'数据类型'},
			xtype : {value:'textbaseInfo',defaultValue:'textbaseInfo',remark:'渲染类型'},
			translateType : {value:'',defaultValue:'',remark:'映射字典项'},
			viewFn : {value:'',defaultValue:'',remark:'处理函数'},
			cmTypes : {value:'',defaultValue:'',remark:'右键菜单扩展'},
			noTitle : {value:false,defaultValue:false,remark:'悬浮数据内容'}
		},
		'3、Grid' : {
			gridField : {value:true,defaultValue:true,remark:'展示到列表'},
			resutlWidth : {value:150,defaultValue:150,remark:'列宽'}
		},
		'2、SearchField' : {
			searchField : {value:false,defaultValue:false,remark:'作为查询条件'},
			cAllowBlank : {value:true,defaultValue:true,remark:'查询条件可以为空'},
			enableCondition : {value:true,defaultValue:true,remark:'拖动为查询条件'}
		},
		'4、wcombotree' : {
			innerTree : {value:'',defaultValue:'',remark:'tree面板KEY值'},
			showField : {value:'',defaultValue:'',remark:'下拉树展示字段'},
			hideField : {value:'',defaultValue:'',remark:'下拉树key字段'}
		},
		'5、combox' : {
			multiSelect : {value:false,defaultValue:false,remark:'多选'},
			multiSeparator : {value:'',defaultValue:'',remark:'多选分隔符'},
			editable : {value:false,defaultValue:false,remark:'下拉框可编辑'}
		}
	};


var lookkupStore =  new Ext.data.Store({
	restful : true,
	autoLoad : true,
	proxy : new Ext.data.HttpProxy({
		url : basepath + '/lookupMappingQuery.json'
	}),
	reader : new Ext.data.JsonReader({
		root : 'json.data'
	},Ext.data.Record.create( [ {name:'F_NAME'},{name:'F_COMMENT'} ]))

});

var baseInfoPropertyGrid = new Ext.ux.grid.GroupPropertyGrid({
	autoSort:false,
	autoScroll : true,
	region : 'west',
	width : '400',
	layout : 'fit',
	source : baseInfoSource,
	propertyNames : {
		name : '<span style="color:red">*</span>name'
	},
	customEditors : {
		lookupTypes : new Ext.grid.GridEditor(new Ext.form.ComboBox ( {
			selectOnFocus : true,
			store : lookkupStore,
			resizable:true,
			name : 'F_LOOKUP_ID',
			hiddenName : 'F_LOOKUP_ID',
			valueField : 'F_NAME',
			displayField : 'F_COMMENT',
			mode : 'local',
			typeAhead : true,
			forceSelection : true,
			emptyText : '请选择',
			triggerAction : 'all',
			selectOnFocus : true,
			listeners :{
			'keyup':function(){
			debugger;
		}
		}
		}))
	},
	tbar : [{
				text : 'Group',
				handler : function() {
					propertyGrid.enableGroup();
				}
			},'-',{
				text : 'UnGroup',
				handler : function() {
					propertyGrid.disableGroup();
				}
			},{
				text : 'addField',
				handler : function() {/*
					var _this = Wlj.frame.functions.preview.DataInterface;
					var baseInfosdata = propertyGrid.getStore().data.items;
					var baseInfo = '{';
					var noName = true;
					for (i = 0; i < baseInfosdata.length; i++) {
						if (baseInfosdata[i].data.value !== ''
							&& baseInfosdata[i].data.value !=null
							&& baseInfosdata[i].data.value !==baseInfosdata[i].data.defaultValue) {
							if (baseInfosdata[i].data.name == 'name')
								noName = false;
							if (baseInfo != '{')
								baseInfo += ',';
							if (Ext.isString(baseInfosdata[i].data.value)
									&& baseInfosdata[i].data.name != 'viewFn') {
								baseInfo += baseInfosdata[i].data.name + ':"'+ baseInfosdata[i].data.value + '"';
							} else {
								baseInfo += baseInfosdata[i].data.name + ":"+ baseInfosdata[i].data.value;
							}
						}
					}
					if (noName){
						Ext.Msg.alert('提示','name属性是必填项，请重新输入！');
						return false;
					}
					baseInfo += '}';
					var noMatch = true;
					var baseInfoObj = eval('(' + baseInfo + ')');
					for (i = 0; i < _this.baseInfos.value.length; i++) {
						if (_this.baseInfos.value[i].name == baseInfoObj.name) {
							_this.baseInfos.value.splice(i, 1, baseInfoObj);
							noMatch = false;
						}
					}
					if (noMatch) {
						_this.baseInfos.value.push(baseInfoObj);
					}
					var baseInfosCode = [];
					Ext.each(_this.baseInfos.value, function(fd) {
						var baseInfo = [];
						baseInfo.push(Ext.encode(fd));
						baseInfo.push(fd.name);
						baseInfosCode.push(baseInfo);
					});
					baseInfoGridEditor.store.loadData(baseInfosCode);
					_this.baseInfos.defined = true;
					_this.baseInfos.coding();
					codePanel.setCodeArray(_this);
					codePanel.createCode();
//					sourceTermp = propertyGrid.getSource();
//					for(var i in sourceTermp ){
//						for(var j in sourceTermp[i] ){
//							sourceTermp[i][j] = null;
//						}
//					}
					resetSource();	
//					propertyGrid.setSource(resetSource);
				*/}
			} ],
	listeners : {
		beforerender : function() {
			this.getColumnModel().dateFormat = "Y-m-d";
		}
	}
});

var baseInfoGridEditor = new Ext.grid.GridPanel( {
	region : 'center',
	layout : 'fit',
	stripeRows : true,
	baseInfos : [],
	tbar : [{
				text : '修改',
				handler : function() {/*
//				propertyGrid.setSource(jSource);
					var name = baseInfoGridEditor.getSelectionModel().getSelections()[0].data.name;
					var baseInfoCode = Ext.decode(baseInfoGridEditor.getSelectionModel().getSelections()[0].data.baseInfoCode);
					var jsonsource = propertyGrid.getSource();
					for ( var i in jsonsource) {
						for (var j in jsonsource[i] ){
							jsonsource[i][j].value = jsonsource[i][j].defaultValue;
							for(var k in baseInfoCode){
								if(j==k){
									jsonsource[i][j].value = baseInfoCode[k];
								}
							}
						}
					}
					propertyGrid.setSource(jsonsource);
				*/}
			}, {
				text : '获取baseInfos字符串',
				handler : function() {
				}
			}, {
				text : 'getFields',
				handler : function() {
				}
			} ],
	store : baseInfosStore,
	frame : true,
	cm : new Ext.grid.ColumnModel( [{
		header : 'baseInfoCode',
		dataIndex : 'baseInfoCode',
		width : 2000,
		sortable : true,
		hidden : false
	} ])
});
