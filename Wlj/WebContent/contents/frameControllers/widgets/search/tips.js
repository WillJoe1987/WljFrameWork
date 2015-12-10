Ext.ns('Wlj.widgets.search.tip');
Wlj.widgets.search.tip.AbstractTip = function(){
	this.show = false;
};
Ext.extend(Wlj.widgets.search.tip.AbstractTip,  Ext.util.Observable, {
	isShown : function(){
		return this.show;
	},
	showTip : Ext.emptyFn,
	hideTip : Ext.emptyFn,
	addMessage : Ext.emptyFn,
	removeMessage : Ext.emptyFn,
	clearMessage : Ext.emptyFn
});

Wlj.widgets.search.tip.HeaderTip = Ext.extend( Wlj.widgets.search.tip.AbstractTip, {
	createTipUI : function(){
		var _this = this;
		console.log(_this.appObject);
		var header = _app.headerFunctions;
		_this.tipUI = header.add({
			cfg : {
				name:'开始',
				acls : 'lv1',
				iconcls : 'icon1',
				wordcls : 'word',
				cls : '',
				handler:function(p,f,dom){
					
				}
			}
		});
	},
	showTip : function(){
		/**
		 * TODO show ui
		 */ 
		if(this.isShown()) return;
		if(!this.tipUI) this.createTipUI();
		this.tipUI.show();
		this.show = true;
	},
	hideTip : function(){
		/**
		 * TODO hide ui
		 */
		if(!this.isShown()) return;
	},
	addMessage : function(messageObject){
		
		if( !this.messages) this.messages = new Ext.util.MixedCollection();
		
		
		this.messages.add(messageObject);
		this.showTip();
	},
	removeMessage : function(messageObject){
		this.messages.remove(messageObject);
		this.hideTip();
	},
	clearMessage : function(){
		this.message.removeAll();
		this.hideTip();
	}
});