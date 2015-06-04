/**
 * author:hujun 2015-04-30
 * 磁铁展示jsp
 * */

Ext.ns('Com.yucheng.crm.common');
Com.yucheng.crm.common.CustFlow = Ext.extend(Ext.Panel, {
	maximize:false,
	callFrom : '',//标识：indexpage首页调用
	flowurl : false,//jsp文件相对路径
	flowId : 'custflow_center',
	initComponent : function(){
		var _this = this;
		if(_this.maximize){
			_this.tools=[{
	        	id:'maximize',
	        	handler:function(e,target,panel){
	            	var maxwin = new Ext.Window({
	            		title: _this.title,
	            		maximized:true,
	            		closable:true,
	            		closeAction : 'close' ,
	            		layout:'fit',
	            		items:[]
	            	});
	            	maxwin.add(new Com.yucheng.crm.common.CustFlow({
	            		flowurl:_this.flowurl
	            	}));
	            	maxwin.show(target);
	        	}
	       	},{
		        id:'close',
		        handler: function(e, target, panel){
		        	try{
		        		var ct = panel.ownerCt;
		        		if(typeof ct.removeThis === 'function'){
		        			ct.removeThis();
		        		}else{
		        			ct.remove(panel,true);
		        		}
		        	}catch(e){
		        	}
		        }
	    	}];
		}
		
		_this.builtflowurl();
		
		Com.yucheng.crm.common.FusionChartPanel.superclass.initComponent.call(_this);
	},
	builtflowurl : function(){
		var iframeurl = this.flowurl.split('.jsp')[0]+'.jsp';
		this.html = '<iframe id="'+this.flowId+'" name="'+this.flowId+'" src="'+iframeurl+'" style="width:100%;height:100%;" frameborder="no"/>';
	}
});