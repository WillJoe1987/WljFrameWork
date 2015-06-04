Ext.ns('Wlj.frame.functions.flow.widgets');
Wlj.frame.functions.flow.widgets.StepContainer = Ext.extend(Ext.Panel,{
	title : 'step',
	autoScroll : true,
	onRender : function(ct,position){
		Wlj.frame.functions.flow.widgets.StepContainer.superclass.onRender.call(this, ct, position);
		var _this = this;
		this.flowButton = new Ext.Button({
			text : '跳转至',
			handler : function(){
				if(window._IM)
					if(_IM.currentStepResId != _this.resId){
						if(_this.svStat ){
							_IM.setActiveStep(_this.resId,function(){
								initStat(_this.svStat);
							});
						}else{
							_IM.setActiveStep(_this.resId);
						}
					}
			},
			renderTo : this.header
		});
	},
	addData : function(record){
		if(!record) return false;
		var tplString = "";
		tplString += '<div>';
		record.fields.each(function(f){
			if(!f.hidden && f.text){
				tplString += '<div>';
				tplString += f.text;
				tplString += ':';
				tplString += record.get(f.name);
				tplString += '</div>';
			}
		});
		tplString += '</div>';
		new Ext.XTemplate(tplString).append(this.body);
	}
});
Wlj.frame.functions.flow.widgets.FlowContainer = Ext.extend(Ext.Panel, {
	title : 'wljdlslkjfa',
	height : 400,
	width : 400,
	movedIn : false,
	layout :'accordion',
	style : 'left : 800px; top: -395px; position:absolute;border: 1px solid #000;',
	renderTo : Ext.getBody(),
	afterRender : function(){
		Wlj.frame.functions.flow.widgets.FlowContainer.superclass.afterRender.call(this);
		var _this = this;
		this.header.on('click', function(e){
			e.stopEvent();
			_this.hideOut();
		});
		this.el.on('mouseenter', function(e){
			e.stopEvent();
			_this.showIn();
		});
	},
	showIn : function(){
		if(this.movedIn === false){
			this.el.animate({
				top : {from : -395, to : 0}
			},.35,null,'easeOut');
			this.movedIn = true;
		}
	},
	hideOut : function(){
		if(this.movedIn === true){
			this.el.animate({
				top : {from : 0, to : -395}
			},.35,null,'easeOut');
			this.movedIn = false;
		}
	},
	getStepContainerByResId : function(resId){
		if(!resId) return false;
		for( var i=0;i<this.items.getCount();i++){
			if(this.items.itemAt(i).resId == resId){
				return this.items.itemAt(i);
			}
		}
		return false;
	},
	setActiveStep : function(resId,callback){
		var as = this.getStepContainerByResId(resId,callback);
		if(!as) return false;
		this.layout.setActiveItem(as.id);
		return true;
	}
});
Wlj.frame.functions.flow.widgets.InstanceManager = function(){
	this.flowData = flows[0];
	Wlj.frame.functions.flow.widgets.InstanceManager.superclass.constructor.call(this);
	this.buildIMContainer();
};

Ext.extend(Wlj.frame.functions.flow.widgets.InstanceManager,Ext.util.Observable,{
	buildIMContainer : function(){
		this.id = this.flowData.id;
		var steps = [];
		for(var i=0;i<this.flowData.steps.length;i++){
			steps.push(new Wlj.frame.functions.flow.widgets.StepContainer(this.flowData.steps[i]));
		}
		this.fc = new Wlj.frame.functions.flow.widgets.FlowContainer({
			items : steps
		});
	},
	activeStepContainer : function(resId,callback){
		this.fc.setActiveStep(resId,callback);
	},
	setActiveStep : function(resId,callback){
		this.svCurrentStat();
		this.activeStepContainer(resId);
		this.currentStepResId = resId;
		window.APPBUILD.setResId(resId,callback);
	},
	getCurrentStepResId : function(){
		return this.currentStepResId;
	},
	turnToNext : function(){
		var cResId = this.getCurrentStepResId();
		var nextResId = false;
		for(var i=0;i<this.fc.items.getCount();i++){
			var cItem = this.fc.items.itemAt(i);
			if(cItem.resId == cResId && i<this.fc.items.getCount()-1){
				nextResId = this.fc.items.itemAt(i+1).resId;
				break;
			}
		}
		if(nextResId){
			this.setActiveStep(nextResId);
		}
	},
	turnToPre : function(){
		var cResId = this.getCurrentStepResId();
		var preResId = false;
		for(var i=0;i<this.fc.items.getCount();i++){
			var cItem = this.fc.items.itemAt(i);
			if(cItem.resId == cResId && i>0){
				preResId = this.fc.items.itemAt(i-1).resId;
				break;
			}
		}
		if(preResId){
			this.setActiveStep(preResId);
		}
	},
	svCurrentStat : function(){
		var step = this.fc.getStepContainerByResId(this.getCurrentStepResId());
		var stat = getStat();
		
		step.svStat = stat;
	}
});