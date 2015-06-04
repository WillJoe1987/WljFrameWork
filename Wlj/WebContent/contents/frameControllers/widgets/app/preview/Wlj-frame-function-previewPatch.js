
window.__DESIGNING = true;
Ext.apply(Wlj.frame.functions.app.Builder.prototype,{
	codeLoad : function(callbackIm){
		this.buildEvirement();
		this.resId = 'preview';
		this.codeLoading(callbackIm);
	},
	codeLoading : function(callbackIm){
		var _this = this;
		eval(opener.previewCode);
		Ext.showCode(opener.previewCode);
		_this.codeCheck.call(_this);
	},
	rebuildApp : function(){
		var _this = this;
		window._app.destroy();
		window._app = null;
		window.listeners = {
				beforeinit : true,
				afterinit : true,
				beforeconditioninit : true,
				afterconditioninit : true,
				beforeconditionrender : true,
				afterconditionrender : true,
				beforeconditionadd : true,
				conditionadd : true,
				beforeconditionremove : true,
				conditionremove : true,
				beforedyfieldclear : true,
				afterdyfieldclear : true,
				beforeconditioncollapse : true,
				afterconditioncollapse : true,
				beforeconditionexpand : true,
				afterconditionexpand : true,
				beforecondtitionfieldvalue : true,
				condtitionfieldvalue : true,
				recordselect : true,
				rowdblclick : true,
				load : true,
				beforesetsearchparams : true,
				setsearchparams : true,
				beforeresultinit : true,
				afterresultinit : true,
				beforeresultrender : true,
				afterresultrender : true,
				beforecreateviewrender : true,
				aftercreateviewrender : true,
				beforeeditviewrender : true,
				aftereditviewrender : true,
				beforedetailviewrender : true,
				afterdetailviewrender : true,
				beforeviewshow : true,
				viewshow : true,
				beforeviewhide : true,
				viewhide : true,
				beforevalidate :true,
				validate : true,
				beforecommit : true,
				afertcommit : true,
				beforeeditload : true,
				aftereditload : true,
				beforedetailload : true,
				afterdetailload : true,
				beforetophide : true,
				tophide : true,
				beforetopshow : true,
				topshow : true,
				beforelefthide : true,
				lefthide : true,
				beforeleftshow : true,
				leftshow : true,
				beforebuttomhide : true,
				buttomhide : true,
				beforebuttomshow : true,
				buttomshow : true,
				beforerighthide : true,
				righthide : true,
				beforerightshow : true,
				rightshow : true,
				lookupinit : true,
				locallookupinit : true,
				alllookupinit : true,
				beforelookupreload : true,
				lookupreload : true,
				beforetreecreate : true,
				treecreate : true
			};
		_this.codeCheck.call(_this);
	}
});
function eventClicked(){
	var eventName = event.srcElement.innerText;
	if(window._EventWindow){
		window._EventWindow.show();
		window._EventWindow.setTitle(eventName);
		window._EventEditor.setEventName(eventName);
		return;
	}
	window._EventEditor= new Wlj.functions.preview.util.WljEventEditor({
		eventName : eventName
	});
	window._EventWindow = new Ext.Window({
		closable : true,
		closeAction : 'hide',
		x : event.clientX,
		y : event.clientY,
		title : eventName,
		width : 300,
		height : 300,
		items : [window._EventEditor]
	}).show();
}
Ext.apply(Wlj.frame.functions.app.App.prototype, {
	fireEvent : function(){
		var eventName = arguments[0];
		var eventResult = true;
		if(!eventName){
			return eventResult;
		}
		Ext.log('触发事件：【<a onclick=eventClicked()>'+arguments[0]+'</a>】:接收到【'+(arguments.length - 1)+'】个参数！');
		if(!this.hasListener(eventName)){
			Ext.log('【'+arguments[0]+'】未绑定逻辑，事件调用结束！');
			return eventResult;
		}
		try{
			for(var i = 0;i<this.events[eventName].listeners.length;i++){
				Ext.log('fn['+i+']:'+this.events[eventName].listeners[0].fn.toString());
			}
			eventResult = Wlj.frame.functions.app.App.superclass.fireEvent.apply(this,arguments);
		}catch(Werror){
			Ext.error('事件【'+arguments[0]+'】：执行出错。TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
			eventResult = false;
		}finally{
			Ext.log('【'+arguments[0]+'】事件结束!');
			return eventResult;
		}
	}
});
Ext.ns("Wlj.functions.util");
Wlj.functions.util.ScriptEditor = Ext.extend(Ext.Panel, {
    region: 'east',
    minWidth: 200,
    split: true,
    width: 750,
    border: false,
    layout:'anchor',
    initComponent : function(){
		var _this = this;
        this.tbar = [{
        	text : 'excute',
        	handler : function(){
        		_this.evalScript();
        	}
        },'-',{
        	text : 'rebuild',
        	handler : function(){
        		_this.evalScript();
        		window.APPBUILD.rebuildApp();
        	}
        }];
        
		Ext.debug.ScriptsPanel.superclass.initComponent.call(this);
    },
    onRender : function(ct, position){
    	Ext.debug.ScriptsPanel.superclass.onRender.call(this,ct,position);
    	this.codeEdit = new CodeMirror(this.body.dom, {
    		lineNumbers : true,
    		matchBrackets: true,
    		value : this.bfCode?this.bfCode:'',
            continueComments: "Enter",
            extraKeys: {"Ctrl-Q": "toggleComment"}
    	});
    },
    setCode : function(code){
    	if(!this.codeEdit){
    		this.bfCode = code;
    	}else{
    		this.bfCode = false;
    		this.codeEdit.doc.setValue(code);
    	}
    },
    appendLine : function(code){
    	
    },
    appendCode : function(code){
    	this.codeEdit.doc.setValue(this.codeEdit.doc.getValue()+'\n'+code);
    },
    evalScript : function(){
    	var s = this.codeEdit.doc.getValue();
    	try{
    		var rt = eval(s);
    		Ext.dump(rt === undefined? '(no return)' : rt);
    	}catch(e){
    		Ext.log(e.message || e.descript);
    	}
    }
});

