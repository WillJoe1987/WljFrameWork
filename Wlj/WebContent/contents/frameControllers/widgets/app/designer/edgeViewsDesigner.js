var EDGEVIEWEDITOR = new Wlj.functions.preview.util.BasicEditor({
	tbar : [{
		text : 'moveCode',
		handler : function(){
			Wlj.frame.functions.preview.DataInterface.edgeVies.codeValue = EDGEVIEWEDITOR.getCode();
			Wlj.frame.functions.preview.DataInterface.edgeVies.defined = true;
			codePanel.createCode();
		}
	}]
});


edgeViewDisigner = Ext.extend(Ext.form.FormPanel, {
	theedge : 'west',
	layout : 'form',
	initComponent : function(){
		edgeViewDisigner.superclass.initComponent.call(this);
	}
});


var westEdgeViewDisigner = new edgeViewDisigner({
	items : [{
		xtype : 'textfield',
		fieldLabel : 'layout',
		anchor : '90%',
		name : 'layout'
	},{
		xtype : 'textfield',
		anchor : '90%',
		fieldLabel : 'width',
		name : 'width'
	},{
		xtype : 'textfield',
		fieldLabel : 'item',
		anchor : '90%',
		name : 'items',
		listeners : {
			focus : function(field){
				TREECFGWINDOW.show();
				TREECFGWINDOW.setInvoker(field);
			}
		},
		setTree : function(wholeTree){
			var key = wholeTree.tree.key;
			var itemCode = "TreeManager.createTree('"+key+"')";
			this.setValue("["+itemCode+"]");
		}
	}],
	buttons : [{
		text : '保存',
		handler : function(){
			var leftvalue = Wlj.frame.functions.preview.DataInterface.edgeVies;
			leftvalue.value = {};
			leftvalue.value.left = westEdgeViewDisigner.getForm().getValues();
			leftvalue.defined = true;
			leftvalue.coding();
			codePanel.createCode();
		}
	}]
});