


url = basepath + '/loanfznjreduce.json';
fields = [
	        {name:'URL',text:'查询地址',nallowBlank: false},
			 {name:'COMMIT_URL',text:'提交地址'},
			 {name:'DATA_INDEX',text:'字段',editable:true,editor:new Ext.form.TextField()},
			 {name:'LABEL',text:'字段名称',editable:true,editor:new Ext.form.TextField()}
		];
needCondition = false;
needGrid = false;

var createView = false;
var editView = false;
var detailView = false;

customerView = [{
	title : '基本信息',
	hideTitle : true,
	type : 'form',
	suspendFitAll:true,
	labelWidth : 100,
	groups : [{
		columnCount : 1,
		fields : ['URL','COMMIT_URL'],
		fn : function(URL,COMMIT_URL){
			URL.emptyText = 'action所对应URL。如：XXX.json';
			COMMIT_URL.emptyText = '如为空，则被置为URL的值';
			return [URL,COMMIT_URL];
		}
	}],
	formButtons : [{
		text : '保存',
		fn : function(formpanel, form){
		}
	}]
},{
	title : '元数据字段',
	hideTitle : true,
	type : 'grid',
	suspendFitAll:true,
	grideditable : true,
	url : 'xx.json',
	tbar : [{
		text : '增加',
		handler : function(){
			var grid = getCustomerViewByTitle('元数据字段').grid;
			grid.store.add(new Ext.data.Record({
				DATA_INDEX : '',
				LABEL : ''
			}));
		}
	},{
		text : '移除',
		handler : function(){
			var grid = getCustomerViewByTitle('元数据字段').grid;
			Ext.each(grid.selModel.getSelections(),function(a){
				grid.store.remove(a);
			});
		}
	}],
	fields : {
		fields : ['DATA_INDEX','LABEL'],
		fn : function(DATA_INDEX,LABEL){
			return [DATA_INDEX, LABEL];
		}
	}
},{
	title : '列表字段',
	suspendFitAll:true,
	hideTitle : true
},{
	title : '默认查询条件',
	suspendFitAll:true,
	hideTitle : true
},{
	title : '增删改表单',
	suspendFitAll:true,
	hideTitle : true
}];

var designerParts = new Ext.grid.GridPanel({
    frame : true,
    store : new Ext.data.JsonStore({
		autoDestroy: true,
		//url: 'get-images.php',
		idProperty: 'name',  
		fields: ['name', 'desc']
	}),
    sm : new Ext.grid.RowSelectionModel({
		singleSelect : true,
		listeners : {
			rowselect : function(sm , index, e){
				showCustomerViewByIndex(index);
			}
		}
	}),
	
    region : 'west',
    stripeRows : true, 
    columns: [
              {header: '部件', width: 110,menuDisabled: true,sortable: false,dataIndex: 'desc'}
          ],
    viewConfig : {
		forceFit : true,
		autoFill : true
    },
    loadMask : {
        msg : '...'
    }
});
designerParts.store.loadData(Wlj.designer.designerParts);
var edgeVies = {
	left : {
		width : 200,
		layout : 'fit',
		items : [designerParts]
	}
};


afterinit = function(app){
	var grid = getCustomerViewByTitle('元数据字段').grid;

	getCustomerViewByTitle('元数据字段').grid.store.loadData({json:{data:[
	{DATA_INDEX:'F1', LABEL:'F1'},
	{DATA_INDEX:'F2', LABEL:'F2'},
	{DATA_INDEX:'F3', LABEL:'F3'}
	]}});

}

var viewshow = function(view){
	if(view === getCustomerViewByTitle('增删改表单')){
		debugger;
		var t1 = new Wlj.widgets.search.tile.Tile({
			tileManaged : false,
			dragable : true,
			pos_size : {
				TW : 1 ,
				TH : 1 ,
				TX : 1 ,
				TY : 1 
			},
			baseSize : 128,
			html : '123'
		});
//		t1.render(view.el);
		view.add(t1);
		view.doLayout();
	}

}
