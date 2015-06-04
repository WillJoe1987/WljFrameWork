Ext.ns("Wlj.frame.functions.designers");
Wlj.frame.functions.designers.FieldPropertyPanel = Ext.extend(Ext.grid.PropertyGrid, {
	width : 300,
	//height : 700,
	autoHeight : true,
    viewConfig : {
        forceFit: true
    }
});
Ext.reg('fieldproperty',Wlj.frame.functions.designers.FieldPropertyPanel);