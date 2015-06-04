Ext.namespace("Com.yucheng.crm.custGroup");
/**
 * 客户视图窗口
 * @author WILLJOE
 * @2012-10-10
 */
Com.yucheng.crm.custGroup.ViewWindow = Ext.extend(Ext.Window,{
	layout : 'fit',
	draggable : true,								//是否可以拖动
	closable : true,								//是否可关闭
	modal : true,
	closeAction : 'close',
	maximized:true,									//默认最大化
	titleCollapse : true,
	buttonAlign : 'center',
	border : false,
	animCollapse : true,
	animateTarget : Ext.getBody(),
	constrain : true,
	containDIVid : 'group_viewport_center',
	title:'',
	groupId: '',
	groupName:'',
	viewType:'',
	CurrentURL : '',
	PrintedObject : [],
	PrintedStore : [],
	ScriptMgr:null,
	initComponent : function() {
		Com.yucheng.crm.custGroup.ViewWindow.superclass.initComponent.call(this);
		if(this.groupId!=''&&this.groupName!=''&&this.viewType!=''){
			this.title='您所浏览的客户群为：'+this.groupName;
		}
		this.treeModules = new Ext.tree.TreePanel({
			region: 'west',
			width:220,
			rootVisible : false,
			root: new Ext.tree.AsyncTreeNode({
				expanded : true,
				children : []
			})
		});
		this.componentContainer = new Ext.Panel({
			region:'center',
			html:'<div id="'+this.containDIVid+'"></div>'
		});
		var mainPanel = new Ext.Panel({
			layout:'border',
			items:[this.treeModules,this.componentContainer]
		});
		
		this.add(mainPanel);
		Com.yucheng.crm.custGroup.ViewWindowManager.currWindows[this.viewType]=this;
	},
	
	componentAdd : function(index,item,key,_this){
		if(_this.CurrentURL)
			_this.PrintedObject.push(item);
	},
	
	getCurrentRoots : function(){
		var co = this.PrintedObject;
		var roots = new Array();
		Ext.each(co,function(o){
			if(o.getXType()!=="quicktip"){
				if(!o.ownerCt){
					roots.push(o);
				}else if(co.indexOf(o.ownerCt)<0){
					roots.push(o);
				}
			}
		});
		return roots;
	},
	
	getCurrentStores : function(){
		return this.PrintedStore;
	},
	
	storeAdd : function(index,item,key,_this){
		if(_this.CurrentURL)
			_this.PrintedStore.push(item);
	},
	
	addModule : function(children){
		this.treeModules.root.appendChild(children);
		this.treeModules.root.expand();
		Ext.each(this.treeModules.root.childNodes, function(n){
			n.expand();
		});
		var _this = this;
		Ext.ComponentMgr.all.on('add',function(index,item,key){
			_this.componentAdd(index,item,key,_this);
		});
		Ext.StoreMgr.on('add',function(index,item,key){
			_this.storeAdd(index,item,key,_this);
		});
		this.treeModules.on('click',function(node){
			_this.CurrentURL = '';
			var curRoots = _this.getCurrentRoots();
			delete _this.PrintedObject;
			while(curRoots.length>0){
				var tr = curRoots.shift();
				if(tr.destroy){
					tr.destroy();
				}
				delete tr;
			}
			_this.PrintedObject = [];
			var curRootStore = _this.getCurrentStores();
			delete _this.PrintedStore;
			while(curRootStore.length>0){
				var ts = curRootStore.shift();
				if(ts.destroy){
					ts.destroy();
				}
				delete ts;
			}
			_this.PrintedStore = [];
			if (node.attributes.ADDR && node.attributes.ADDR != '0') {
				if (node.attributes.ADDR.indexOf('.jsp') == -1) {
					document.getElementById(_this.containDIVid).innerHTML = '';
					_this.CurrentURL = basepath + node.attributes.ADDR;
					Ext.ScriptLoader.loadScript({
						scripts: [basepath + node.attributes.ADDR],
						finalCallback:function(){
						}
					});
				} else {
					var aParame = node.attributes.ADDR.split('|');
					var sUrl = '';
					var pattern = /^\d+$/;
					for ( var i in aParame) {
						if (pattern.test(i)) {
							//i为单数的时候是参数
							if (i % 2 != 0) {
								sUrl = sUrl + eval(aParame[i]);
							} else {
								sUrl = sUrl + aParame[i];
							}
						}
					}
					document.getElementById(_this.containDIVid).innerHTML = '<iframe id="content" onload="Javascript:setWinHeight(this)" name="content2" style="width:100%;height=100%;" frameborder="no"" src=\"'
							+ basepath + sUrl + '\" "/> scrolling="auto"> ';
				}
			}
		});
		var tn = this.treeModules.root.findChild('NAME','客户群基本信息',true);
		tn.fireEvent('click',tn);
	},
	listeners:{
		'beforeclose':function(_this){
			try{
				Ext.ComponentMgr.all.removeListener('add',Ext.ComponentMgr.all.events.add.listeners[0].fn);
				Ext.StoreMgr.removeListener('add',Ext.StoreMgr.events.add.listeners[0].fn);
				_this.CurrentURL = '';
				Ext.each(_this.getCurrentRoots(),function(r){
					if(r.destroy)
						r.destroy();
				});
				_this.PrintedObject = [];
				Ext.each(_this.getCurrentStores(),function(s){
					if(s.destroy)
						s.destroy();
				});
				_this.PrintedStore = [];
				Com.yucheng.crm.custGroup.ViewWindowManager.currWindows[_this.viewType] = null;
			}catch(e){}finally{
				return true;
			}
		},'afterrender': function(win){
			Com.yucheng.crm.custGroup.ViewWindowManager.loadData(win.viewType,function(children){
				win.addModule(children);
			});
		}
	}
});
Ext.reg('crm.custGroup', Com.yucheng.crm.custGroup.ViewWindow);

Com.yucheng.crm.custGroup.ViewWindowManager = {
	moduleCache : {},
	currWindows : {}
};

Com.yucheng.crm.custGroup.ViewWindowManager.createWindow = function(cfg){
	var win = new Com.yucheng.crm.custGroup.ViewWindow(cfg);
	return win;
};

Com.yucheng.crm.custGroup.ViewWindowManager.loadData = function(viewType,callback){
	if(Com.yucheng.crm.custGroup.ViewWindowManager.moduleCache[viewType]){
		callback(Com.yucheng.crm.custGroup.ViewWindowManager.moduleCache[viewType]);
	} else {
		var loader = new Com.yucheng.bcrm.ArrayTreeLoader({
			parentAttr : 'PARENTID',
			rootValue : '0',
			textField : 'NAME',
			idProperties : 'ID'
		});
		Ext.Ajax.request({
			url : basepath + '/queryCustViewAuthorize!queryCustViewTree.json?viewtype=' + viewType,
			method : 'GET',
			success : function(response) {
				var nodeArra = Ext.util.JSON.decode(response.responseText);
				loader.nodeArray = nodeArra.JSON.data;
				var children = loader.loadAll();
				Com.yucheng.crm.custGroup.ViewWindowManager.moduleCache[viewType] = children;
				callback(Com.yucheng.crm.custGroup.ViewWindowManager.moduleCache[viewType]);
			}
		});
	}
};
function setWinHeight(obj){
	var win=obj; 
	try {
		if (document.getElementById) 
		{ 
			if (win && !window.opera) 
			{ 				
				if (obj.parentNode.parentNode && obj.parentNode.parentNode.clientHeight) 
					win.height = obj.parentNode.parentNode.clientHeight;
				else if(obj.parentNode.parentNode.document && obj.parentNode.parentNode.document.body.scrollHeight) 
					win.height = obj.parentNode.parentNode.document.body.scrollHeight;
			} 
		} 
	} catch (e) {
		win.height = 500;
	}
}