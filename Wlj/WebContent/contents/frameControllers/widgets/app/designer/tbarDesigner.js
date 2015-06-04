toolbarButtonsStore = new Ext.data.ArrayStore({
	autoDestroy: true,
	fields: [
	         {name: 'text', type: 'string'},
	         {name: 'handler', type: 'string'}
	         ],
	listeners : {
		update : function(store){
			setDateInterfaceValue('tbar', toolbarButtonsStore.getRange());
		},
		add : function(store){
			setDateInterfaceValue('tbar', toolbarButtonsStore.getRange());
		},
		remove : function(store){
			setDateInterfaceValue('tbar', toolbarButtonsStore.getRange());
		}
	}
});

toolbarButtonsStoreCm = new Ext.grid.ColumnModel({
    defaults: {
        sortable: false         
    },
    columns: [{
        id: 'common',
        header: '按钮名称',
        dataIndex: 'text',
        width: 220,
        editor: new Ext.form.TextField({
            allowBlank: false
        })
    }]
});

var toolbarButtonsGrid = new Ext.grid.EditorGridPanel({
    store: toolbarButtonsStore,
    cm: toolbarButtonsStoreCm,
    autoExpandColumn : 'common',
    frame: true,
    clicksToEdit: 1,
    tbar: [{
        text: '添加按钮',
        handler : function(){
            var Plant = toolbarButtonsGrid.getStore().recordType;
            var p = new Plant({
                text: 'new button'
            });
            toolbarButtonsStore.add(p);
            toolbarButtonsGrid.fireEvent('rowclick',toolbarButtonsGrid,toolbarButtonsStore.getCount()-1);
        }
    },{
    	text : '删除按钮',
    	handler : function(){
    		if(Ext.isNumber(tbarHanlerEditor.tbarButtonIndex)){
    			toolbarButtonsStore.removeAt(tbarHanlerEditor.tbarButtonIndex);
    		}
    	}
    }],
    listeners : {
		rowclick : function(grid, index ,event){
			var tRecord = grid.store.getAt(index);
			if(tRecord.get('handler')){
				tbarHanlerEditor.setCode(tRecord.get('handler'));
			}else{
				tbarHanlerEditor.setCode('');
			}
			tbarHanlerEditor.tbarButtonIndex = index;
		}
	}
});
