Ext.onReady(function(){
    Ext.QuickTips.init();
    
    var store = new Ext.data.Store({
		restful : true,
		proxy : new Ext.data.HttpProxy({
			url :basepath + '/testCalendar.json'
		}),
		reader:new Ext.data.JsonReader({
			successProperty : 'success',
			idProperty : 'ID',
			totalProperty : 'json.count',
			root:'json.data'
		},[{name: 'id',mapping:'ID'},
    	{name: 'title',mapping:'TITLE'},
		{name: 'content',mapping:'CONTENT'},
		{name: 'start_date',mapping:'START_DATE'},
		{name: 'creator',mapping:'CREATOR'}
		 ])
	});
    
    
    
    var infoMapping =   [
    		{name: 'id', fieldLabel:'ID',ifHide:true,type:'text'}, 
    		{name: 'title', fieldLabel: '事件标题',ifHide:false,type:'text'}, 
    		{name: 'content',fieldLabel:'事件内容',ifHide:false,type:'area'},
    		{name: 'creator',fieldLabel:'创建人',ifHide:false,type:'text'}
    ];
    
    
    var viewport = new Ext.Viewport({
    	 items : [ {
    		 xtype:'CalendarPanelCommon',
    		 id:'calendarPanelCommon',
    		 height:300,
    		 width:300,
    		 ifShowContent:true,//是否展示相关内容
    		 store:store,//相关信息存储
    		 pramName:'date',//查询的参数名
    		 showColumn:'title',//信息滚动部分展示的字段名
    		 title:'信息展示',//信息详细页面的title
    		 mapping:infoMapping,
    		 name:'test'
    	 }]
    });
    Ext.getCmp('calendarPanelCommon').addfeild('text','start_date','开始日期',false);
    
});
