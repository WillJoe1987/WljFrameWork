Ext.ns('Wlj.frame.designer');
Wlj.frame.designer.FormCfgDesignerBar = Ext.extend(Ext.Toolbar,{
	initComponent : function(){
		Wlj.frame.designer.FormCfgDesignerBar.superclass.initComponent.call(this);
		
		this.suspendOWidth = new Ext.form.NumberField({
			emptyText : '0为默认值，负数为铺满，正数为指定宽度'
		});
		this.deleteIndex = new Ext.form.NumberField({
			allowNegative:false,
			decimalPrecision:0,
			emptyText : '输入要删除的数组,0开始'
		});
		var _this = this;
		this.add({
			text:'悬浮宽度配置',
			handler : function(){
				var cfgHandler = _this.ownerType + 'FormCfgs';
				var cfgObj = _this.getCfgObject();
				setDateInterfaceValue(cfgHandler, cfgObj);
				_this.ownerView.showCode(_this.ownerType);
			}
		},this.suspendOWidth,{
			text:'删除面板内部结构',
			handler : function(){
				_this.removeFn();
			}
		},this.deleteIndex);
	},
	getCfgObject : function(){
		var cfg = {};
		if(this.suspendOWidth){
			var suspending = this.suspendOWidth.getValue();
			if(!suspending){
			}else if(suspending>0){
				cfg.suspendFitAll = false;
				cfg.suspendWidth = suspending;
			}else{
				cfg.suspendFitAll = true;
			}
		}
		return cfg;
	},
	removeFn:function(){
		var viewType= this.ownerType+"View";
		var viewHandler = this.ownerType + 'FormViewer';
		var cfgHandler = this.ownerType + 'FormCfgs';
		var df = Wlj.frame.functions.preview.DataInterface;
		var index = this.deleteIndex.getValue();
		if(df[viewHandler].defined){
			df[viewHandler].value = df[viewHandler].value.deleteArray(index);
			if(df[viewHandler].value.length==0){
				df.resetValue(viewType);
				df.resetValue(viewHandler);
				df.resetValue(cfgHandler);
				codePanel.setCodeArray(Wlj.frame.functions.preview.DataInterface);
				codePanel.createCode();
			}else{
				setDateInterfaceValue(viewHandler,df[viewHandler].value);
			}
			formViewContainer.showCode(this.ownerType);
		}else{
			df[viewType].defined=false;
			df[cfgHandler].defined=false;
			setDateInterfaceValue([viewHandler,viewType,cfgHandler],['','','']);
			formViewContainer.showCode(this.ownerType);
		}
	}
});