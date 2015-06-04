Ext.ns("Wlj.functions.preview.util");

Wlj.functions.preview.util.BasicEditor = Ext.extend(Ext.Panel, {
	initComponent : function(){
		this.codeEdit = false;
		Wlj.functions.preview.util.BasicEditor.superclass.initComponent.call(this);
	},
	onRender : function(ct, position){
		Wlj.functions.preview.util.BasicEditor.superclass.onRender.call(this, ct, position);
		var _this = this;
		this.codeEdit = new CodeMirror(this.body.dom, {
    		lineNumbers : true,
    		matchBrackets: true,
    		value : this.bfCode?this.bfCode:'',
            continueComments: "Enter",
            extraKeys: {"Ctrl-Q": "toggleComment"}
    	});
		this.on('resize', function(o,h,w){
			var vs = this.body.getViewSize();
			_this.codeEdit.setSize(vs.width ,vs.height);
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
	getCode : function(){
		if(!this.codeEdit){
			return this.bfCode;
		}else{
			return this.codeEdit.doc.getValue();
		}
	},
	appendLine : function(code){
    	
    },
    appendCode : function(code){
    	this.setCode(this.getCode()+'\n'+code);
    }
});

Wlj.functions.preview.util.codeGenerate = Ext.extend(Wlj.functions.preview.util.BasicEditor, {
	codeArray:false,//代码对象接收Wlj.frame.functions.preview.DataInterface
	codeStr:'',
	layout:'fit',
	initComponent : function(){
	var _this = this;
	this.tbar = [{
		text : '页面预览',
		handler : function(){
		if(_this.codeStr==''){
			Ext.MessageBox.alert('提示', '代码为空 !');
			return;	
		}else{
			parent.previewCode = _this.codeStr+'\nwindow.scriptEdit = new Wlj.functions.preview.util.WljScriptEditor();';
			window.previewCode = _this.codeStr;	
			window.open(basepath+'/contents/frameControllers/widgets/app/preview/Wlj-preview.jsp');
		}
		}
	}];
	Wlj.functions.preview.util.codeGenerate.superclass.initComponent.call(this);
	},
	setCodeArray:function(code){
		this.codeArray=code;
	},
	createCode:function(){
		var _this = this;	
		if(!_this.codeArray){
			Ext.MessageBox.alert('提示', '代码对象为空 !');
			return;		
		}else{
			_this.codeStr=_this.codeArray.getAllCode();
			this.setCode(_this.codeStr);
		}
	}
});
Wlj.functions.preview.util.RunnableEditor = Ext.extend(Wlj.functions.preview.util.BasicEditor, {
    region: 'east',
    minWidth: 200,
    split: true,
    width: 750,
    border: false,
    layout:'anchor',
    initComponent : function(){
		var _this = this;
		if(!this.tbar){
			this.tbar = [{
				text : 'excute',
				handler : function(){
					_this.evalScript();
				}
			}];
		}
        Wlj.functions.preview.util.RunnableEditor.superclass.initComponent.call(this);
    },
    evalScript : function(){
    	var s = this.getCode();
    	try{
    		var rt = eval(s);
    		Ext.dump(rt === undefined? '(no return)' : rt);
    	}catch(e){
    		Ext.log(e.message || e.descript);
    	}
    }
});

Wlj.functions.preview.util.WljScriptEditor = Ext.extend(Wlj.functions.preview.util.RunnableEditor, {
	
	initComponent : function(){
		var _this = this;
		this.tbar = [{
			text : 'excute',
			handler : function(){
				_this.evalScript();
			}
		},'-',{
			text : 'rebuild(APP)',
			handler : function(){
				_this.evalScript();
				window.APPBUILD.rebuildApp();
			}
		},'-',{
			text : 'debugger',
			handler : function(){
				_this.codeEdit.doc.removeInner(1,1);
				setTimeout(function(){
					_this.codeEdit.refresh();
				},1);
			}
		}];
		Wlj.functions.preview.util.WljScriptEditor.superclass.initComponent.call(this);
	}
});

Wlj.functions.preview.util.WljEventEditor = Ext.extend(Wlj.functions.preview.util.BasicEditor, {
	
	eventName : false,
	initComponent : function(){
		var _this = this;
		this.tbar = [{
			text : 'effact',
			handler : function(){
			opener.Wlj.frame.functions.preview.DataInterface.setValue(_this.eventName,_this.getCode());
			opener.codePanel.setCodeArray(opener.Wlj.frame.functions.preview.DataInterface);
			opener.codePanel.createCode();
			opener.parent.previewCode = opener.codePanel.codeStr+'\nwindow.scriptEdit = new Wlj.functions.preview.util.WljScriptEditor();';
			opener.previewCode = opener.codePanel.codeStr;	
			window._SCRIPTPANEL.setCode(opener.codePanel.codeStr);
			_this.factEvent();
			}
		},{
			text : 'delete',
			handler : function(){
			opener.Wlj.frame.functions.preview.DataInterface.resetValue(_this.eventName);
			opener.codePanel.setCodeArray(opener.Wlj.frame.functions.preview.DataInterface);
			opener.codePanel.createCode();
			opener.parent.previewCode = opener.codePanel.codeStr+'\nwindow.scriptEdit = new Wlj.functions.preview.util.WljScriptEditor();';
			opener.previewCode = opener.codePanel.codeStr;	
			window._SCRIPTPANEL.setCode(opener.codePanel.codeStr);
			if(_app.events[_this.eventName] !== true){
				_app.un(_this.eventName,_app.events[_this.eventName].listeners[0].fn);
			}
			_this.setEventName(_this.eventName);
			}
		}];
		Wlj.functions.preview.util.BasicEditor.superclass.initComponent.call(this);
		this.setEventName(this.eventName);
		
	},
	setEventName : function(eventName){
		this.eventName = eventName;
		if(!opener.Wlj.frame.functions.preview.DataInterface[this.eventName]){
			this.setCode( this.eventName+' = function(){\n\t\n};');
		}else{
			var code =opener.Wlj.frame.functions.preview.DataInterface.getBaselisteners(this.eventName);
			if(code){
				this.setCode(code);
			}else{
				this.setCode( this.eventName+' = function(){\n\t\n};');
			}
		}
	},
	factEvent : function(){
		if(_app.events[this.eventName] !== true){
			_app.un(this.eventName,_app.events[this.eventName].listeners[0].fn);
		}
		var s = this.getCode();
		try{
			var rt = eval(s);
			Ext.dump(rt === undefined? '(no return)' : rt);
		}catch(e){
			Ext.log(e.message || e.descript);
		} 	
		_app.on(this.eventName,eval(this.eventName));
	}
});

Wlj.functions.preview.util.WljEventWindow = Ext.extend(Ext.Window, {
	eventName : false,
	initComponent : function(){
		Wlj.functions.preview.util.WljEventWindow.superclass.initComponent.call(this);
		if(!this.eventName){
			return false;
		}
	}
});
