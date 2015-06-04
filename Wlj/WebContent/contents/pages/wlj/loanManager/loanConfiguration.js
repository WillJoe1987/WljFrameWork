var products = {
	PROD_10086 : {
		productId : '10086',
		productName : '产品A'
	},
	PROD_10087 : {
		productId : '10087',
		productName : '产品B'
	},
	PROD_10088 : {
		productId : '10088',
		productName : '产品C'
	}
};            

var contractFields = {
	//title : '合同名称',
	layout : 'column',
	xtype : 'form',
	items : [{
		columnWidth : .5,
		layout : 'form',
		items : [{
			xtype : 'textfield',
			fieldLabel : '合同ID',
			name : 'CONT_ID'
		}]
	},{
		columnWidth : .5,
		layout : 'form',
		items : [{
			xtype : 'textfield',
			fieldLabel : '合同名称',
			name : 'contrant_name'
		}]
	}]
};

