/**
 * 本补丁用于新增、修改、详情面板，和自定义面板中的form面板,将每个分组从面板对象变为fieldset对象。
 * 可统一在/WebContent/contents/frameControllers/WljFunctionBooter.js中引用，则全局生效；
 * 也可以在单独的功能点内部，用imports方法单独引用。
 * 用法：
 * 	1、Wlj.frame.functions.app.widgets.defaultfieldset.basecfg为每个fieldset的基础配置，统一管理，全局生效；
 * 		项目组可在此对象内添加关于fieldset的相关属性做为默认属性；
 *  2、在新增、修改、详情面板和自定义form面板中，每个group可以单独添加相关fieldset的属性，可以覆盖baseCfg；
 *  	如title、收起等属性。
 *  @since 2015-04-21
 *  @author WillJoe
 */
Ext.ns('Wlj.frame.functions.app.widgets.defaultfieldset');
Wlj.frame.functions.app.widgets.defaultfieldset.basecfg = {
	xtype : 'fieldset'
};

Wlj.frame.functions.app.widgets.CView.prototype.buildFormField = function(){
	var _this = this;
	var groups = _this.formViewer;
	var groupPanels = [];
	var vs = _this.vs;
	var columnCount = vs.width > 1024 ? 4:3;
	if(vs.width < 800 ){
		columnCount = 2;
	}
	if(vs.width < 500){
		columnCount = 1;
	}
	var allFields = _this.fields;
	Ext.each(groups, function(g){
		var gFs = g.fields;
		var gColumnCount = columnCount;
		if(g.columnCount){
			gColumnCount = g.columnCount;
		}
		var panelFieldsCfg = _this.getFieldsByName(gFs);
		if(!panelFieldsCfg){
			return;
		}
		
		var items;
		if(Ext.isFunction(g.fn)){
			try{
				items = g.fn.apply(_this, panelFieldsCfg);
			}catch(Werror){
				Ext.error('['+_this._defaultTitle+']面板第['+groups.indexOf(g)+']个字段组渲染出错,字段组将以默认顺序解析。见【formViewers|createFormViewer|editFormViewer|detailFormViewer】，TYPE:【'+Werror.name+'】;MESSAGE:【'+Werror.message+'】!');
				items = panelFieldsCfg;
			}
		}else{
			items = panelFieldsCfg;
		}
		items.length = panelFieldsCfg.length;
		var tItems = new Array();
		for(var ti=0; ti<items.length; ti++){
			if(Ext.isObject(items[ti]) && items[ti].hidden !== true){
				if( _this.baseType === "detailView" ){
					items[ti].readOnly = true;
				}
				tItems.push(items[ti]);
			}else continue;
		}
		items = _this.createColumnsCfg(gColumnCount,tItems);
		delete tItems;
		var lines = Math.ceil(gFs.length/gColumnCount);
		var panelCfg = {};
		//添加fieldset属性配置
		Ext.apply(panelCfg, Wlj.frame.functions.app.widgets.defaultfieldset.basecfg);
		Ext.apply(panelCfg, g);
		panelCfg.layout = 'column';
		if (g.labelWidth) {
			panelCfg.labelWidth = g.labelWidth;
		}
		panelCfg.items = items;
		groupPanels.push(panelCfg);
	});
	Ext.each(allFields,function(af){
		if(af.hidden || !af.text){
			af.xtype = 'textfield';
			af.hidden = true;
			groupPanels.push(af);
		}
	});
	return groupPanels;
};
Wlj.frame.functions.app.widgets.FormView.prototype.createGroupPanel = function(groupCfg){
	var panelCfg = {};
	//添加fieldset属性配置
	Ext.apply(panelCfg, Wlj.frame.functions.app.widgets.defaultfieldset.basecfg);
	Ext.apply(panelCfg, groupCfg);
	var vs = this.vs;
	var columnCount;
	if(vs.width>1024){
		columnCount = 4;
	}else if(vs.width > 800){
		columnCount = 3;
	}else if(vs.width > 500){
		columnCount = 2;
	}else{
		columnCount = 1;
	}
	if(Ext.isNumber(groupCfg.columnCount)){
		columnCount = groupCfg.columnCount;
	}
	var fields = groupCfg.fields;
	panelCfg.layout = 'column';
	if (groupCfg.labelWidth) {
		panelCfg.labelWidth = groupCfg.labelWidth;
	}
	panelCfg.items = new Array();
	for(var i=0;i<columnCount;i++){
		panelCfg.items.push({
			layout : 'form',
			columnWidth : 1/columnCount
		});
	}
	var fieldsCfg = this.getFieldsCfg(fields);
	if(Ext.isFunction(groupCfg.fn)){
		try{
			fieldsCfg = groupCfg.fn.apply(this, fieldsCfg);
		}catch(Werror){
			fieldsCfg = fieldsCfg;
		}
	}else{
		fieldsCfg = fieldsCfg;
	}
	if(!fieldsCfg){
		fieldsCfg=[];
	}
	var fluse = fieldsCfg.length -1;
	while(fluse >=0 ){
		if(!Ext.isObject(fieldsCfg[fluse])){
			fieldsCfg.remove(fieldsCfg[fluse]);
		}
		fluse -- ;
	}
	for(var i=0;i<fieldsCfg.length; i++){
		if(!panelCfg.items[i%columnCount].items){
			panelCfg.items[i%columnCount].items=[];
		}
		panelCfg.items[i%columnCount].items.push(fieldsCfg[i]);
	}
	return panelCfg;
};