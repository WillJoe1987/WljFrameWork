Ext.ns('Wlj.loan');
Wlj.loan.ContractPanel = Ext.extend(Ext.form.FormPanel,{
	productId : false,
	layout:'form',
	initComponent : function(){
		//Ext.apply(this, contractFields);
		Wlj.loan.ContractPanel.superclass.initComponent.call(this);
		this.add(new Ext.Panel(contractFields));
		this.add(new Wlj.loan.ContractProductPanel({
			productId : this.productId
		}));
	},
	onRender : function(ct, position){
		Wlj.loan.ContractPanel.superclass.onRender.call(this, ct, position);
		//this.add(new Ext.form.FormPanel(contractFields));
	}
});
Wlj.loan.ContractProductPanel = Ext.extend(Ext.Panel,{
	title : '产品特殊属性',
	productId : false,
	PROD_PRE : 'PROD_',
	initComponent : function(){
		Ext.apply(this, products[this.PROD_PRE+this.productId]);
		Wlj.loan.ContractProductPanel.superclass.initComponent.call(this);
		this.html = 'prodcut:'+this.productId;
	}
});