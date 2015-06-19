Ext.ns('Wlj.frame.functions.app.widgets');

/**
 * 下拉树组件
 */
Wlj.frame.functions.app.widgets.ComboTree = Ext.extend(Ext.form.ComboBox, {
	
	innerTree : false,
	showField : false,
	hideField : false,
	singleSelect : true,
	
	anchor : '95%',
	mode : 'local',
	resizable :false,
	forceSelection:true,
	triggerAction : 'all',
	maxHeight : 390,
	onSelect : Ext.emptyFn,
	assertValue : Ext.emptyFn,
	
	initComponent : function(){
		this.store = new Ext.data.SimpleStore({
			fields : [],
			data : [[]]
		});
		this.tplId = 'innerContainer_'+this.id;
		this.tpl =  "<tpl for='.'><div id='"+this.tplId+"'></div></tpl>";
		Wlj.frame.functions.app.widgets.ComboTree.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.ComboTree.superclass.onRender.call(this, ct, position);
		if(!this.innerTree){
			return false;
		}
		if(typeof this.innerTree == "string" && TreeManager){
			this.innerTree = TreeManager.createTree(this.innerTree);
		}else if(typeof this.innerTree == 'object'){
			if(!this.innerTree instanceof Ext.tree.TreePanel){
				this.innerTree = new Com.yucheng.bcrm.TreePanel(this.innerTree);
			}
		}
		this.innerTree.frame = true;
		var _this = this;
		this.innerTree.on('click', function(node){
			_this.clickFn(node);
		});
	},
	expand : function(){
		Wlj.frame.functions.app.widgets.ComboTree.superclass.expand.call(this);
		if(!this.innerTree.rendered){
			this.innerTree.render(this.tplId);
			this.innerTree.setHeight(390);
		}
	},
	clickFn : function(node){
		var attribute = node.attributes;
		var showField  = this.showField;
		var hideField = this.hideField;
		this.setValue(attribute[hideField],node);
		if(this.singleSelect){
			this.collapse();
		}
	},
	setValue : function(hidevalue, node){
		node  = node ? node : this.innerTree.resloader.hasNodeByProperties(this.hideField, hidevalue);
		if(!node ){
			this.selectedNode = false;
			this.showValue = hidevalue;
			Ext.form.ComboBox.superclass.setValue.call(this, hidevalue);
		}else{
			this.selectedNode = node;
			var showvalue = node.attributes ? node.attributes[this.showField] : node[this.showField];
			this.showValue = showvalue;
			Ext.form.ComboBox.superclass.setValue.call(this, hidevalue);
			
			this.el.dom.value = showvalue;
		}
		this.lastSelectionText = this.showValue;
	},
	getValue : function(){
		return this.value ? this.value : this.showValue;
	},
	getShowValue : function(){
		return this.showValue;
	},
	clearValue : function(){
		Wlj.frame.functions.app.widgets.ComboTree.superclass.clearValue.call(this);
		this.selectedNode = false;
	},
	getSelectNode : function(){
		return this.selectedNode;
	}
});
Ext.reg('wcombotree', Wlj.frame.functions.app.widgets.ComboTree);

