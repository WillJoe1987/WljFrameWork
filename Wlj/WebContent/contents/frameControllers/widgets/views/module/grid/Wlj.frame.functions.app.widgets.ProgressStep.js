/**
 * var pgrs = new Wlj.frame.functions.app.widgets.ProgressStep({
 *		stepnodes : ['提交订单','商品出货','等待收货','交易完成'],
 *      nodewidth : 155,//节点宽度
 *		arrivednode : 2	//当前抵达步骤
 *	});
 * @class Wlj.frame.functions.app.widgets.ProgressStep
 * @extends Ext.Container
 */
Wlj.frame.functions.app.widgets.ProgressStep = Ext.extend(Ext.Container,{
	autoEl : {
		tag : 'div',
		cls : 'yc-prg-container'
	},
	stepnodes : [],
	arrivednode : 0,
	nodewidth : 155,
	//'',yps-over,yps-doing
	//'',yps-last
	stepTemplate : new Ext.XTemplate(
		'<div class="yc-prg-step {islast} {nodestat}" style="width:{nodewidth}px;">' +
			'<div class="yps-step">' +
				'<div class="yps-left"></div>' +
				'<div class="yps-center"></div>' +
				'<div class="yps-right">{lastnodename}</div>' +
			'</div>' +
			'<div class="yps-text">{nodename}</div>' +
		'</div>'),
	onRender : function(ct, position){
		Wlj.frame.functions.app.widgets.ProgressStep.superclass.onRender.call(this, ct, position);
		this.renderStepEl();
	},
	renderStepEl : function(){
		var _this = this;
		var stepsize = _this.stepnodes.length;
		Ext.each(_this.stepnodes,function(nodename,index){
			var nodestat = '';
			var islast = '';
			var lastnodename = '';
			if (stepsize == index + 2){
				islast = 'yps-last';
				lastnodename = '<span>'+_this.stepnodes[stepsize-1]+'</span>';
			}else if (stepsize == index + 1){
				return;	
			}
			if(_this.arrivednode > index){
				nodestat = 'yps-over';
			}else if(_this.arrivednode == index){
				nodestat = 'yps-doing';
			}
			_this.stepTemplate.append(_this.el,{
				nodename : nodename,
				nodestat : nodestat,
				nodewidth : _this.nodewidth,
				islast : islast,
				lastnodename : lastnodename
			});
		});
	}
});

Ext.reg('progressstep',Wlj.frame.functions.app.widgets.ProgressStep);