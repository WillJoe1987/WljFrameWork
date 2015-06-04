Ext.ns('Wlj.view');
/**
 * 视图工厂
 * @class Wlj.view.View
 * @extends Ext.util.Observable
 */
Wlj.view.View = Ext.extend(Ext.util.Observable,{
	viewId: 'view$-$',
	resId : 0,
	viewType: 0, //视图类型：0客户视图,1客户群视图,2集团客户视图,3客户经理视图,4产品视图,5团队视图,6财富管理视图
	viewUrl: '',
	constructor: function(config){
        Wlj.view.View.superclass.constructor.call(this, config)
    },
    /**
     * 打开视图方法
     * @param {} viewType 视图类型: 0客户视图,1客户群视图,2集团客户视图,3客户经理视图
     * @param {} id	客户号或客户群号
     * @param {} name 客户名称或客户群名称
     */
	openViewWindow : function(viewType,id,name){
		this.viewType = viewType;
		this.resId = this.viewId + this.viewType +'$-$' + id;
		_APP.taskBar.openWindow({
			name : Wlj.view.View.VIEW_PRE_NAME[this.viewType] + name,
			action : basepath + Wlj.view.View.VIEW_BASE_URL[this.viewType],
			resId : this.resId,
			id : 'task_'+this.resId,
			serviceObject : false
		});
	}
});

Wlj.view.ViewController = new Wlj.view.View();
Wlj.ViewMgr = Wlj.view.ViewController;

Wlj.view.View.VIEW_BASE_URL = [
	'/contents/frameControllers/view/Wlj-custview-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp',
	'/contents/frameControllers/view/Wlj-custgroup-base.jsp'
];
Wlj.view.View.VIEW_PRE_NAME = [
	'客户：',
	'客户群：',
	'集团：',
	'客户经理：',
	'产品：',
	'团队：',
	'财富管理：'
];