
var treeLoaders = [{
	key : 'DATASETMANAGERLOADER',
	url :  basepath+'/loanfproduct.json',
	parentAttr : 'PROD_TYPE_ID',
	locateAttr : '10000',
	jsonRoot:'json.data',
	rootValue : '10000',
	textField : 'PROD_NAME',
	idProperties : 'ID'
}];
var treeCfgs = [{
	key : 'DATASETMANAGERTREE',
	loaderKey : 'DATASETMANAGERLOADER',
	autoScroll:true,
	rootCfg : {
		expanded:true,
		id:'10000',
		text:'产品类别',
		autoScroll:true,
		children:[]
	},
	clickFn : function(node){
		getCustomerViewByTitle('产品信息').setProductInfo(node.attributes);
	}
}];

url = basepath+'/loanfproduct.json';

fields = [
          {name:'ID',text:'主键ID',hidden:true},
          {name:'PRODUCT_ID',text:'产品编号'},
          {name:'PROD_NAME',text:'产品名称'},
          {name:'PROD_TYPE_ID',text:'产品类型代码',hidden:true},
          {name:'RATE_TYPE',text:'利息方式'},
          {name:'TERM',text:'期限',dataType:'numberNoDot'},
          {name:'INT_YEAR',text:'年利率',dataType:'rate'},
          {name:'CRE_EVA_RATE',text:'信用评估费率',dataType:'rate'},
          {name:'CRE_MANG_RATE',text:'信用管理费率',dataType:'rate'},
          {name:'DUTE_INT_RATE',text:'逾期利息率AB/滞纳金率C',dataType:'rate'},
          {name:'DUTE_MANG_RATE',text:'信用管理费滞纳金率',dataType:'rate'},
          {name:'PROD_CREATOR',text:'创建人'},
          {name:'CREATE_DATE',text:'创建日期'}
          ];

autoLoad = false;
needCondition = false;
needGrid = false;
needTbar = false;
createView = false;
editView = false;
detailView = false;

customerView = [{
	title : '产品信息',
	hideTitle : true,
	type : 'form',
	suspendFitAll:true,
	labelWidth : 100,
	groups : [{
		fields : ['ID','PRODUCT_ID','PROD_NAME','RATE_TYPE','TERM','INT_YEAR','CRE_EVA_RATE','CRE_MANG_RATE','DUTE_INT_RATE','DUTE_MANG_RATE'],
		fn : function(ID,PRODUCT_ID,PROD_NAME,RATE_TYPE,TERM,INT_YEAR,CRE_EVA_RATE,CRE_MANG_RATE,DUTE_INT_RATE,DUTE_MANG_RATE){
			ID.hidden = true;
			DUTE_INT_RATE.hidden = true;
			DUTE_MANG_RATE.hidden = true;
			return [PRODUCT_ID,PROD_NAME,RATE_TYPE,TERM,INT_YEAR,CRE_EVA_RATE,CRE_MANG_RATE,DUTE_INT_RATE,DUTE_MANG_RATE,ID];
		}
	},{
		fields : ['PROD_CREATOR','CREATE_DATE','PROD_TYPE_ID'],
		fn : function(PROD_CREATOR,CREATE_DATE,PROD_TYPE_ID){
			PROD_TYPE_ID.hidden = true;
			PROD_CREATOR.disabled = true;
			CREATE_DATE.disabled = true;
			return [PROD_CREATOR,CREATE_DATE,PROD_TYPE_ID];
		}
	}],
	setProductInfo : function(record){
		var form = this.contentPanel.getForm();
		if(record.ID == '10088'){
			form.findField('DUTE_INT_RATE').show();
			form.findField('DUTE_INT_RATE').setLabelText('滞纳金率');
			form.findField('DUTE_MANG_RATE').show();
		}else{
			form.findField('DUTE_INT_RATE').setLabelText('逾期利息率');
			debugger;
			form.findField('DUTE_INT_RATE').show();
			form.findField('DUTE_MANG_RATE').hide();
		}
		form.setValues(record);		
	},
	formButtons : [{
		text : '保存',
		fn : function(formpanel, form){
			if(!form.getValues().ID){
				Ext.Msg.alert('提示','请选择一条记录修改');
				return false;
			}
			Ext.apply(getEdgePanel('left').items.items[0].root.findChild('ID',form.getValues().ID).attributes,form.getValues());
			comitData(form.getValues());
		}
	}]
}];

var edgeVies = {
	left : {
		width : 200,
		layout : 'form',
		items : [TreeManager.createTree('DATASETMANAGERTREE')]
	}
};

beforeviewhide = function(){
	return false;
};

