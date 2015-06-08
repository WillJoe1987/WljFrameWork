/**
 * 设计器属性配置面板
 * update by guochi
 * 2015-03-24
 */ 
Ext.namespace('Ext.ux.grid');

/*
* Ext.ux.grid.GroupPropertyRecord
*/
Ext.ux.grid.GroupPropertyRecord=Ext.data.Record.create(
	[{name:"name",type:"string"},"value","group"]
);

/*
* Ext.ux.grid.GroupPropertyStore
*/
Ext.ux.grid.GroupPropertyStore = function(grid, source){
    this.grid = grid;
    this.store = new Ext.data.GroupingStore({
        recordType : Ext.ux.grid.GroupPropertyRecord,
		groupField : "group"
    });
    this.store.on('update', this.onUpdate,  this);
    if(source){
        this.setSource(source);
    }
    Ext.ux.grid.GroupPropertyStore.superclass.constructor.call(this);
};
Ext.extend(Ext.ux.grid.GroupPropertyStore, Ext.util.Observable, {
    setSource : function(o){
        this.source = o;
        this.store.removeAll();
        var data = [];
        for(var k in o){
            if(this.isEditableValue(o[k])){
                data.push(new Ext.ux.grid.GroupPropertyRecord({
                	name: k, 
                	value: o[k].value,
                	remark:o[k].remark,
                	defaultValue:o[k].defaultValue,
                	group:k},k));
            }
			else if(typeof(o[k]) == 'object'){
				for(var n in o[k]){
					data.push(new Ext.ux.grid.GroupPropertyRecord({
						name: n, 
						value: o[k][n].value,
						remark:o[k][n].remark,
						defaultValue:o[k][n].defaultValue,
						group:k},k+"&&"+n));
				}
			}
        }
        this.store.loadRecords({records: data}, {}, true);
    },

    // private
    onUpdate : function(ds, record, type){
        if(type == Ext.data.Record.EDIT){
            var v = record.data['value'];
            var oldValue = record.modified['value'];
            if(this.grid.fireEvent('beforepropertychange', this.source, record.id, v, oldValue) !== false){
                if(record.id.indexOf("&&")!=-1)
            	{
            		var values = record.id.split("&&");
            		this.source[values[0]][values[1]].value = v;
            	}
            	else
            	{
                	this.source[record.id] = v;
                }
                record.commit();
                this.grid.fireEvent('propertychange', this.source, record.id, v, oldValue);
            }else{
                record.reject();
            }
        }
    },

    // private
    getProperty : function(row){
       return this.store.getAt(row);
    },

    // private
    isEditableValue: function(val){
        if(Ext.isDate(val)){
            return true;
        }else if(typeof val == 'object' || typeof val == 'function'){
            return false;
        }
        return true;
    },

    // private
    setValue : function(prop, value){
        this.source[prop] = value;
        this.store.getById(prop).set('value', value);
    },

    // protected - should only be called by the grid.  Use grid.getSource instead.
    getSource : function(){
        return this.source;
    }
});

/*
* Ext.ux.grid.GroupPropertyColumnModel 
*/
Ext.ux.grid.GroupPropertyColumnModel = function(grid, store){
	this.grid = grid;
    var g = Ext.grid;
    g.PropertyColumnModel.superclass.constructor.call(this, [
        {header: this.nameText, width:50, sortable: false, dataIndex:'name', id: 'name', menuDisabled:true},
        {header: this.valueText, width:50, resizable:false, dataIndex: 'value', id: 'value', menuDisabled:true},
        {header: this.remarkText, width:50, resizable:false, dataIndex: 'remark', id: 'remark', menuDisabled:true},
        {header:"",hidden:true,width:10,resizable:false,locked:true,dataIndex:"group",menuDisabled:true}
    ]);
    this.store = store;
    this.bselect = Ext.DomHelper.append(document.body, {
        tag: 'select', cls: 'x-grid-editor x-hide-display', children: [
            {tag: 'option', value: 'true', html: 'true'},
            {tag: 'option', value: 'false', html: 'false'}
        ]
    });
    var f = Ext.form;

    var bfield = new f.Field({
        el:this.bselect,
        bselect : this.bselect,
        autoShow: true,
        getValue : function(){
            return this.bselect.value == 'true';
        }
    });
    this.editors = {
        'date' : new g.GridEditor(new f.DateField({selectOnFocus:true})),
        'string' : new g.GridEditor(new f.TextField({selectOnFocus:true})),
        'number' : new g.GridEditor(new f.NumberField({selectOnFocus:true, style:'text-align:left;'})),
        'boolean' : new g.GridEditor(bfield)
    };
    this.renderCellDelegate = this.renderCell.createDelegate(this);
    this.renderPropDelegate = this.renderProp.createDelegate(this);
};
Ext.extend(Ext.ux.grid.GroupPropertyColumnModel , Ext.grid.ColumnModel, {
    // private - strings used for locale support
    nameText : '配置项',
    valueText : '值',
    remarkText:'备注',
    dateFormat : 'Y-m-d',

    // private
    renderDate : function(dateVal){
        return dateVal.dateFormat(this.dateFormat);
    },

    // private
    renderBool : function(bVal){
        return bVal ? 'true' : 'false';
    },

    // private
    isCellEditable : function(colIndex, rowIndex){
        return colIndex == 1;
    },

    // private
    getRenderer : function(col){
        return col == 1 ?
            this.renderCellDelegate : this.renderPropDelegate;
    },

    // private
    renderProp : function(v){
        return this.getPropertyName(v);
    },

    // private
    renderCell : function(val){
        var rv = val;
        if(Ext.isDate(val)){
            rv = this.renderDate(val);
        }else if(typeof val == 'boolean'){
            rv = this.renderBool(val);
        }
        return Ext.util.Format.htmlEncode(rv);
    },

    // private
    getPropertyName : function(name){
        var pn = this.grid.propertyNames;
        return pn && pn[name] ? pn[name] : name;
    },

    // private
    getCellEditor : function(colIndex, rowIndex){
        var p = this.store.getProperty(rowIndex);
        var n = p.data['name'], val = p.data['value'];
        if(this.grid.customEditors[n]){
            return this.grid.customEditors[n];
        }
        if(Ext.isDate(val)){
            return this.editors['date'];
        }else if(typeof val == 'number'){
            return this.editors['number'];
        }else if(typeof val == 'boolean'){
            return this.editors['boolean'];
        }else{
            return this.editors['string'];
        }
    },
    
    // inherit docs
    destroy : function(){
        Ext.grid.PropertyColumnModel.superclass.destroy.call(this);
        for(var ed in this.editors){
            Ext.destroy(ed);
        }
    }
});


/*
* Ext.ux.grid.GroupPropertyGrid
*/
Ext.ux.grid.GroupPropertyGrid=Ext.extend(Ext.grid.EditorGridPanel,{
	autoSort:true,
	enableColumnMove:false,
    stripeRows:false,
    trackMouseOver: false,
    clicksToEdit:1,
    enableHdMenu : false,
    viewConfig : {
        forceFit:true
    },
	initComponent : function(){
        this.customEditors = this.customEditors || {};
        this.lastEditRow = null;
        var store = new Ext.ux.grid.GroupPropertyStore(this);
        this.propStore = store;
        var cm = new Ext.ux.grid.GroupPropertyColumnModel(this, store);
        if (this.autoSort) {
        	store.store.sort("name", "ASC");
        }
        this.addEvents('beforepropertychange','propertychange');
		this.cm = cm;
        this.ds = store.store;
		this.view=new Ext.grid.GroupingView({
				forceFit:true,
				showGroupName:false,
				scrollOffset:18,
				getRowClass:function(c){
					return c.data.value===undefined?"":"has-value";
				}
			}
		);
        Ext.ux.grid.GroupPropertyGrid.superclass.initComponent.call(this);
		this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex){
            if(colIndex === 0){
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);
	},
	onRender : function(){
        Ext.ux.grid.GroupPropertyGrid.superclass.onRender.apply(this, arguments);
        this.getGridEl().addClass('x-props-grid');
    },
	afterRender: function(){
        Ext.ux.grid.GroupPropertyGrid.superclass.afterRender.apply(this, arguments);
        if(this.source){
            this.setSource(this.source);
        }
    },
	setSource : function(source){
        this.propStore.setSource(source);
    },
	getSource : function(){
        return this.propStore.getSource();
    },
	enableGroup: function(){
		this.view.enableGrouping=true;
		this.propStore.store.groupBy("group");
	},
	disableGroup: function(){
		this.view.enableGrouping=false;
		this.propStore.store.clearGrouping();
	}
});

Ext.reg("GroupingPropertyGrid", Ext.ux.grid.GroupPropertyGrid); 
