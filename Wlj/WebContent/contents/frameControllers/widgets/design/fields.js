Ext.ns('Wlj.fields');

/*Wlj.fields.FieldsDesigner = Ext.extend(Ext.Panel , {
	closable : true,
	autocroll : true,
	layout : 'border',
	frame : true,
	formcfg:[{
		layout:'column',
		items:[{
			columnWidth:.5,
			items:[{
				name:'aaa',
				xtype:'checkbox',
				value:true
			}]
		}]
	}],
	gridcfg : [{
		clicksToEdit : 1,
		store : new Ext.data.ArrayStore( {
	        fields : [{name : 'name'}
            ],
            data : [ [ 'CD0015'],
                     [ 'CD0016'],
                     [ 'CD0017']
                       ]
		}),
	
		cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({header : 'No.',width : 35}),
		                   		    {header:'code',dataIndex:'name',sortable:true,hidden:false,editor:new Ext.form.TextField({})},
		                   		    {header:'name',dataIndex:'name2'}
	    
		]),
	    sm:false,
		region : 'center',
		layout:'fit',
//		height : gridHeight,
		trackMouseOver : false,
		loadMask : true,
		stripeRows : true
	}],
	,
	
	items:[{
		layout:'center',
		height:100,
		layout:'form',
		items:[new Ext.form.Checkbox({})]
		
	}
		new Ext.form.FormPanel({
			region:'center',
			height:100,
			items:[]
			
		}),new Ext.grid.EditorGridPanel({
			region:'center',
			layout:'fit',
			clicksToEdit : 1,
			stripeRows:true,
			fields:[],
//			tbar: [{
//				text:'添加',
//				handler:function(){
//				var _this = this.ownerCt.ownerCt;
//					var newfield = {name : 'aaa',value:'ccc'};
//					_this.addField(newfield);
//				}
//			},{}],
			store : new Ext.data.ArrayStore( {
		        fields : [{name : 'name'}
		                 ],
		        data : [ [ 'CD0015'],
		                 [ 'CD0016'],
		                 [ 'CD0017']
		               ]
		    }),
		    frame : true,
		    cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({header : 'No.',width : 35}),
		    {header:'code',dataIndex:'name',sortable:true,hidden:false,editor:new Ext.form.TextField({})}
		    ])
		    
		  

						
		})
		],
	
	   

	initComponent : function() {
		Wlj.fields.FieldsDesigner.superclass.initComponent.call(this);
		var _this = this;
		var editgrid = new Ext.grid.EditorGridPanel(this.gridcfg);
		this.add(editgrid);
		
	},
	addField:function(newField){
		var noMatch = true ;
		for(i=0;i<this.fields.length;i++){
			if(this.fields[i].name == newField.name){
				this.fields.splice(i,1,newField);
				noMatch = false;
			}
		}
		if(noMatch){
			this.fields.push(newField);
		}
	},
	removeField:function(name){
		for(i=0;i<this.fields.length;i++){
			if(this.fields[i].name == name){
				this.fields.splice(i,1);
			}
		}
	},
	getFields:function(){
		return this.fields;
	},
	getFieldsCode:function(){
		var fieldsCode = [];
		Ext.each(this.fields,function(fd){
			fieldsCode.push(Ext.encode(fd));
		});
		return 'fields = [\n '+ fieldsCode.join(',\n')+ '\n]';
	}
});
Ext.reg("fieldsdesigner", Wlj.fields.FieldsDesigner);


*/

Wlj.fields.FieldsDesigner = Ext.extend(Ext.grid.EditorGridPanel , {
	clicksToEdit : 1,
	stripeRows:true,
	fields:[],
	tbar: [{
		text:'添加',
		handler:function(){
		var _this = this.ownerCt.ownerCt;
			var newfield = {name : 'aaa',value:'ccc'};
			_this.addField(newfield);
		}
	},{
		text:'获取fields字符串',
		handler:function(){
		var _this = this.ownerCt.ownerCt;
			var newfield = {name : 'custId',hidden:false,text:'客户编号'};
			_this.addField(newfield);
			_this.addField({name :'bbb',value:'aaaa'});
			_this.addField({name :'c',value:'aaaa'});
			_this.addField({name :'bsbb',value:'aaaa'});
			_this.addField({name :'bbdb',value:'aaaa'});
			_this.addField({name :'s',value:'aaaa'});
			alert(_this.getFieldsCode());
		}
	},{text:'getFields',
		handler:function(){

			var _this = this.ownerCt.ownerCt;
				var newfield = {name : 'custId',hidden:false,text:'客户编号',intc:5,fn:function(){alert();}};
				_this.addField(newfield);
				_this.addField({name :'bbb',value:'aaaa'});
				_this.addField({name :'c',value:5});
				_this.addField({name :'bsbb',value:'aaaa'});
				_this.addField({name :'bbdb',value:'aaaa'});
				_this.addField({name :'s',value:'aaaa'});
				debugger;
				alert(_this.getFieldsCode());
			
		}}],
	store : new Ext.data.ArrayStore( {
        fields : [{name : 'name'},
                  {name : 'hidden'},
                  {name : 'text'},
                  {name : 'searchField'},
                  {name : 'viewFn'},
                  {name : 'dataType'},
                  {name : 'translateType'},
                  {name : 'resutlWidth'},
                  {name : 'xtype'},
                  {name : 'innerTree'},
                  {name : 'showField'},
                  {name : 'hideField'},
                  {name : 'gridField'},
                  {name : 'cmTypes'},
                  {name : 'cAllowBlank'},
                  {name : 'multiSelect'},
                  {name : 'multiSeparator'},
                  {name : 'editable'},
                  {name : 'enableCondition'},
                  {name : 'noTitle'}],
        data : [ [ 'CD0015', true, '主办'],
                 [ 'CD0016', true, '协办'],
                 [ 'CD0017', true, '协办']
               ]
    }),
    frame : true,
    cm : new Ext.grid.ColumnModel([new Ext.grid.RowNumberer({header : 'No.',width : 35}),
//    类型：string;
//    说明：字段所对应的业务逻辑名称,该属性应与查询结果中的字段列相同;该属性将做为数据接收、前台控制、后台提交等的关键属性;
    {header:'name',dataIndex:'name',sortable:true,hidden:false,editor:new Ext.form.TextField({})},
//    类型：boolean;
//    说明：字段展示情况,该属性用于字段在列表、查询表单、新增、修改表单的强制隐藏;
    {header:'是否隐藏',dataIndex:'hidden',sortable:true,hidden:true,editor:new Ext.form.Checkbox({})},
//    类型：string;
//    说明：字段的中文名称,将被用于表单中的字段标签、以及列表中的表头;当字段没有这个属性时,该字段将被隐藏;
    {header:'text',dataIndex:'text',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型：boolean;
//    说明：该字段是否做为查询字段,在查询条件域中展示;
    {header:'是否查询条件',dataIndex:'searchField',sortable:true,hidden:true,editor:new Ext.form.Checkbox({})},
//    类型：function;
//    说明：字段在列表中,展示时的特殊展示类型;该function将在数据行渲染时,接收到字段的值,返回值将做为该字段的展示效果;
    {header:'viewFn',dataIndex:'viewFn',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型：string;
//    说明：数据类型;
    {header:'数据类型',dataIndex:'dataType',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型：string;
//    说明：字段涉及到的映射字典项;该字典项将做为查询结果中的字段映射依据,以及表单面板中的下拉框的选择值;
    {header:'映射字典项',dataIndex:'translateType',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型：int;
//    说明：字段在查询结果列中展示的宽度,默认150;
    {header:'列宽(150)',dataIndex:'resutlWidth',sortable:true,hidden:true,editor:new Ext.form.NumberField({})},
//    类型：string;
//    说明：字段在面板中渲染时的类型，特别的，当xtype='wcombotree'时，需要一下三个属性,innerTree,showField,hideField
    {header:'xtype',dataIndex:'xtype',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型：string;
//    说明：下拉树类型指定的受控于TreeManager的tree面板KEY值。会在渲染时，自动调用TreeManager创建一个tree面板；
    {header:'innerTree',dataIndex:'innerTree',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型：string；
//    说明：下拉树的展示字段；
    {header:'showField',dataIndex:'showField',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型：string；
//    说明：下拉树的key字段；
    {header:'hideField',dataIndex:'hideField',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型:boolean;
//    说明:是否在列表中展示;默认为true;
    {header:'是否在列表中展示(true)',dataIndex:'gridField',sortable:true,hidden:true,editor:new Ext.form.Checkbox({})},
//    类型:array[string/object]
//    说明：字段中的右键菜单扩展。string类型时取默认配置，可选：customerView、userView、dateView，object为自定义右键菜单项，需定义text,fn属性；
    {header:'cmTypes',dataIndex:'cmTypes',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
//    类型：boolean
//    说明：当字段配置做为查询条件时字段时，是否可为空；默认为true
    {header:'查询条件可否为空(true)',dataIndex:'cAllowBlank',sortable:true,hidden:true,editor:new Ext.form.Checkbox({})},
//    类型：boolean
//    说明：下拉框是否为多选;仅当translateType配置时生效;默认为false
    {header:'下拉框是否多选(false)',dataIndex:'multiSelect',sortable:true,hidden:true,editor:new Ext.form.Checkbox({})},
//    类型：string；
//    说明：多选下拉框的分隔符;仅当multiSelect为true时生效;默认值为app-cfg中的multiSelectSeparator配置
    {header:'多选下拉框分隔符',dataIndex:'multiSeparator：',sortable:true,hidden:true,editor:new Ext.form.TextField({})},
    //类型：boolean
    //说明：下拉框是否可以手动编辑;仅当translateType配置时生效;默认为false
    {header:'下拉框可否编辑',dataIndex:'editable',sortable:true,hidden:true,editor:new Ext.form.Checkbox({})},
//    类型：boolean
//    说明：列表字段是否可以拖动成为动态查询条件；默认为true；
    {header:'可否拖动成 查询条件',dataIndex:'enableCondition',sortable:true,hidden:true,editor:new Ext.form.Checkbox({})},
//    类型：boolean
//    说明：列表中cell块上鼠标指针浮动时，是否展示数据内容。默认为false，即展示数据内容。如数据经viewFn显示处理后，增加了html标签，则推荐将此属性置为true；
    {header:'鼠标浮动是否展示数据(false)',dataIndex:'noTitle',sortable:true,hidden:true,editor:new Ext.form.Checkbox({})}]),
    
  

	initComponent : function() {
		Wlj.fields.FieldsDesigner.superclass.initComponent.call(this);
		var _this = this;
		
	},


	addField:function(newField){
		var noMatch = true ;
		for(i=0;i<this.fields.length;i++){
			if(this.fields[i].name == newField.name){
				this.fields.splice(i,1,newField);
				noMatch = false;
			}
		}
		if(noMatch){
			this.fields.push(newField);
		}
	},
	removeField:function(name){
		for(i=0;i<this.fields.length;i++){
			if(this.fields[i].name == name){
				this.fields.splice(i,1);
			}
		}
	},
	getFields:function(){
		return this.fields;
	},
	getFieldsCode:function(){
		var fieldsCode = [];
		Ext.each(this.fields,function(fd){
			fieldsCode.push(Ext.encode(fd));
		});
		return 'fields = [\n '+ fieldsCode.join(',\n')+ '\n]';
	}
});
Ext.reg("fieldsdesigner", Wlj.fields.FieldsDesigner);

//Ext.grid.EditorGridPanel = Ext.extend(Ext.grid.GridPanel, {
//	clicksToEdit : 2,
//	forceValidation : false,
//	isEditor : true,
//	detectEdit : false,
//	autoEncode : false,
//	trackMouseOver : false,
//	initComponent : function() {
//		Ext.grid.EditorGridPanel.superclass.initComponent.call(this);
//		if (!this.selModel) {
//			this.selModel = new Ext.grid.CellSelectionModel()
//		}
//		this.activeEditor = null;
//		this.addEvents("beforeedit", "afteredit", "validateedit")
//	},
//	initEvents : function() {
//		Ext.grid.EditorGridPanel.superclass.initEvents.call(this);
//		this.getGridEl().on("mousewheel",
//				this.stopEditing.createDelegate(this, [true]), this);
//		this.on("columnresize", this.stopEditing, this, [true]);
//		if (this.clicksToEdit == 1) {
//			this.on("cellclick", this.onCellDblClick, this)
//		} else {
//			var a = this.getView();
//			if (this.clicksToEdit == "auto" && a.mainBody) {
//				a.mainBody.on("mousedown", this.onAutoEditClick, this)
//			}
//			this.on("celldblclick", this.onCellDblClick, this)
//		}
//	},
//	onResize : function() {
//		Ext.grid.EditorGridPanel.superclass.onResize.apply(this, arguments);
//		var a = this.activeEditor;
//		if (this.editing && a) {
//			a.realign(true)
//		}
//	},
//	onCellDblClick : function(b, c, a) {
//		this.startEditing(c, a)
//	},
//	onAutoEditClick : function(c, b) {
//		if (c.button !== 0) {
//			return
//		}
//		var g = this.view.findRowIndex(b), a = this.view.findCellIndex(b);
//		if (g !== false && a !== false) {
//			this.stopEditing();
//			if (this.selModel.getSelectedCell) {
//				var d = this.selModel.getSelectedCell();
//				if (d && d[0] === g && d[1] === a) {
//					this.startEditing(g, a)
//				}
//			} else {
//				if (this.selModel.isSelected(g)) {
//					this.startEditing(g, a)
//				}
//			}
//		}
//	},
//	onEditComplete : function(b, d, a) {
//		this.editing = false;
//		this.lastActiveEditor = this.activeEditor;
//		this.activeEditor = null;
//		var c = b.record, h = this.colModel.getDataIndex(b.col);
//		d = this.postEditValue(d, a, c, h);
//		if (this.forceValidation === true || String(d) !== String(a)) {
//			var g = {
//				grid : this,
//				record : c,
//				field : h,
//				originalValue : a,
//				value : d,
//				row : b.row,
//				column : b.col,
//				cancel : false
//			};
//			if (this.fireEvent("validateedit", g) !== false && !g.cancel
//					&& String(d) !== String(a)) {
//				c.set(h, g.value);
//				delete g.cancel;
//				this.fireEvent("afteredit", g)
//			}
//		}
//		this.view.focusCell(b.row, b.col)
//	},
//	startEditing : function(i, c) {
//		this.stopEditing();
//		if (this.colModel.isCellEditable(c, i)) {
//			this.view.ensureVisible(i, c, true);
//			var d = this.store.getAt(i), h = this.colModel.getDataIndex(c), g = {
//				grid : this,
//				record : d,
//				field : h,
//				value : d.data[h],
//				row : i,
//				column : c,
//				cancel : false
//			};
//			if (this.fireEvent("beforeedit", g) !== false && !g.cancel) {
//				this.editing = true;
//				var b = this.colModel.getCellEditor(c, i);
//				if (!b) {
//					return
//				}
//				if (!b.rendered) {
//					b.parentEl = this.view.getEditorParent(b);
//					b.on({
//								scope : this,
//								render : {
//									fn : function(e) {
//										e.field.focus(false, true)
//									},
//									single : true,
//									scope : this
//								},
//								specialkey : function(l, k) {
//									this.getSelectionModel().onEditorKey(l, k)
//								},
//								complete : this.onEditComplete,
//								canceledit : this.stopEditing.createDelegate(
//										this, [true])
//							})
//				}
//				Ext.apply(b, {
//							row : i,
//							col : c,
//							record : d
//						});
//				this.lastEdit = {
//					row : i,
//					col : c
//				};
//				this.activeEditor = b;
//				b.selectSameEditor = (this.activeEditor == this.lastActiveEditor);
//				var a = this.preEditValue(d, h);
//				b.startEdit(this.view.getCell(i, c).firstChild, Ext
//								.isDefined(a) ? a : "");
//(function		() {
//					delete b.selectSameEditor
//				}).defer(50)
//			}
//		}
//	},
//	preEditValue : function(a, c) {
//		var b = a.data[c];
//		return this.autoEncode && Ext.isString(b) ? Ext.util.Format
//				.htmlDecode(b) : b
//	},
//	postEditValue : function(c, a, b, d) {
//		return this.autoEncode && Ext.isString(c) ? Ext.util.Format
//				.htmlEncode(c) : c
//	},
//	stopEditing : function(b) {
//		if (this.editing) {
//			var a = this.lastActiveEditor = this.activeEditor;
//			if (a) {
//				a[b === true ? "cancelEdit" : "completeEdit"]();
//				this.view.focusCell(a.row, a.col)
//			}
//			this.activeEditor = null
//		}
//		this.editing = false
//	}
//});





