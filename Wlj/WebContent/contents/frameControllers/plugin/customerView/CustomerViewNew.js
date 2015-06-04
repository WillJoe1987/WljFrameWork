/**
 * 
 * 客户视图
 * 
 */
Ext.onReady(function() {
	var view = new Wlj.commonView({
		//headerData : headerData, //demo数据
		contentData : contentData,
		viewType : viewType,
		viewId : viewId
	});
	var viewport = new Ext.Viewport({
		layout : 'fit',
		items : [{
			layout :'form',
			listeners: { 
				'resize': function(viewport, adjWidth, adjHeight, rawWidth, rawHeight) { 
					view.reSize(viewport, adjWidth, adjHeight, rawWidth, rawHeight);
				} 
			},
			items : [view.header, view.content]
		}]
	});
});