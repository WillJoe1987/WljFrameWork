Ext.ns('Wlj.view');
Wlj.view.CustGroupView = Ext.extend(Ext.Panel,{
	layout: 'border',
	resId: '',	//视图资源ID,格式为： task_view$-$0$-$100,  0表示视图类型,100表示业务ID
	busiId: '', //业务ID,可能为客户群ID/集团ID/客户经理ID/产品ID/团队ID
	viewType: 1, //视图类型：1客户群视图,2集团客户视图,3客户经理视图,4产品视图,5团队视图,6财富管理视图
	CURRENT_VIEW_URL: '',
	containDIVid : 'viewport_center',
	VIEW_PRE_NAME:['客户：','客户群：','集团：','客户经理：','产品：','团队：','财富管理：'],
	VIEW_INDEX_NAME:['客户信息首页','客户群基本信息','基本信息','概览信息','基本信息','基本信息','账户总览'],
	initComponent : function(){
		var _this = this;
        Wlj.view.CustGroupView.superclass.initComponent.call(this);

        _this.resId = JsContext._resId;
        
        var resIdArr = this.resId.split('$-$');
        if(resIdArr.length < 3){
        	return;
        }
        _this.viewType = resIdArr[1];
        _this.busiId = resIdArr[2];
        
		_this.viewLoader = new Wlj.frame.functions.app.widgets.ArrayTreeLoader({
			parentAttr : 'PARENTID',
			idProperties : 'ID',
			textField : 'NAME',
			locateAttr : 'ID',
			rootValue : '0'
		});
		
		_this.viewTree = new Wlj.frame.functions.app.widgets.TreePanel({
			title:_this.VIEW_PRE_NAME[_this.viewType],
			width:220,
			region:'west',
			rootVisible:false,
			collapsible:true,
			autoScroll :true,
			root: new Ext.tree.AsyncTreeNode({
				id :'0',
				text:'视图',
				expanded:true,
				autoScroll:true,
				children:[]
			}),
			resloader:_this.viewLoader,
			listeners:{
				'click':function(node){
					if (node.attributes.ADDR && node.attributes.ADDR != '0') {
						_this.viewPanel.setTitle(node.text);
						_this.CURRENT_VIEW_URL = node.attributes.ADDR;
						var url = _this.builtfunctionurl(node.attributes.ADDR,node.id);
						document.getElementById(_this.containDIVid).src = url;
					}
				}
			}
		});
		
		_this.viewPanel = new Ext.Panel({
			title:'视图首页',
			region:'center',
			html:'<iframe id="viewport_center" name="viewport_center" src="" style="width:100%;height:100%;" frameborder="no"/>'
		});
		
		_this.queryViewTree();
		_this.queryViewBase();
		
		_this.add(_this.viewPanel);
		_this.add(_this.viewTree);
	},
	/**
	 * 查询视图树信息
	 */
	queryViewTree : function(){
		var _this = this;
		Ext.Ajax.request({
			url : basepath + '/queryCustViewAuthorize!queryCustViewTree.json?viewtype='+(Number(_this.viewType) + 2),
			method:'GET',
			success:function(response){
				var nodeArra = Ext.util.JSON.decode(response.responseText).JSON.data;
				if(_this.viewType==4){
					//判断是公司还是零售demo
//					var arr=_this.resId.split("$");
//					if(arr[4]=="100031"||arr[4]=="100032"){//公司产品demo，现仅取这两个做示范
//						for(var i=0;i<nodeArra.length;i++){
//							if(nodeArra[i].ID=="254137"){
//								nodeArra.remove(nodeArra[i]);
//								break;
//							}
//						}
//					}else{//零售
//						for(var i=0;i<nodeArra.length;i++){
//							if(nodeArra[i].ID=="254138"){
//								nodeArra.remove(nodeArra[i]);
//								break;
//							}
//						}
//					}
				}
				_this.viewLoader.nodeArray = nodeArra;
				var children = _this.viewLoader.loadAll();
				_this.viewTree.root.appendChild(children);
				_this.viewTree.expandAll();
				var tn = _this.viewTree.root.findChild('NAME',_this.VIEW_INDEX_NAME[_this.viewType],true);
				if(tn){
					tn.fireEvent('click',tn);
				}
			}
		});
	},
	/**
	 * 请求视图基础信息
	 */
	queryViewBase : function(){
//		debugger
		var _this = this;
		Ext.Ajax.request({
			url : basepath + '/queryCustViewAuthorize!queryViewBase.json?busiId='+_this.busiId+'&viewtype='+_this.viewType,
			method:'GET',
			success:function(response){
				var data = Ext.util.JSON.decode(response.responseText).JSON.data;
				_this.viewName = data[0].NAME;
				var title = '<div title="'+_this.VIEW_PRE_NAME[_this.viewType]+_this.viewName+'">'+_this.VIEW_PRE_NAME[_this.viewType]+(_this.viewName.length > 10?_this.viewName.substring(0,9)+'...':_this.viewName) +'</div>';
				_this.viewTree.setTitle(title);
			}
		});
	},
	/**
	 * 构建视图业务功能url
	 * @param {} baseUrl
	 * @param {} viewId:视图ID
	 * @return {}
	 */
	builtfunctionurl : function(baseUrl,viewId){
		var url = false;
		if(baseUrl.indexOf('.jsp') < 0 ){
			url = basepath + '/contents/frameControllers/view/Wlj-view-function.jsp';
		}else{
			url = basepath + baseUrl.split('.jsp')[0]+'.jsp';
		}
		var turl = baseUrl.indexOf('?')>=0 ? baseUrl + '&resId='+this.resId : baseUrl + '?resId='+this.resId ;
		url += '?' + turl.split('?')[1] + '&busiId='+this.busiId + '&viewId='+viewId+'&viewType='+this.viewType+'&busiName='+this.viewName;
		return url;
	}
});

Ext.onReady(function(){
	window.CUSTVIEW = new Wlj.view.CustGroupView();
	var viewport = new Ext.Viewport({
        layout : 'fit',
        items: [window.CUSTVIEW]
    });
});