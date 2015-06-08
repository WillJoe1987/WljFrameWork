Ext.ns('Wlj.view');
Wlj.view.CustView = Ext.extend(Ext.Panel,{
	layout: 'border',
	resId: '',	//视图资源ID,格式为： task_view$-$0$-$100,  0表示视图类型,100表示客户号或客户经理号
	custId: '', //客户号
	viewType: '0',//视图类型
	CURRENT_VIEW_URL: '',
	containDIVid : 'viewport_center',
	initComponent : function(){
        Wlj.view.CustView.superclass.initComponent.call(this);
        
		var _this = this;
        _this.resId = JsContext._resId;
        var resIdArr = this.resId.split('$-$');
        if(resIdArr.length < 3){
        	return;
        }
        _this.custId = resIdArr[2];
        
        _this.initAllViewTree();
        _this.initMyViewTree();
		_this.viewPanel = new Ext.Panel({
			region:'center',
			html:'<iframe id="viewport_center" name="viewport_center" src="" style="width:100%;height:100%;" frameborder="no"/>'
		});
		
		_this.queryViewTree();
		_this.queryCustBase();
		_this.queryMyViewTree();
		
		_this.add(_this.viewPanel);
		_this.add({
			region:'west',
			id:'leftLayout',
			layout:'accordion',
			width:220,
			layoutConfig: {
		        titleCollapse: false,
		        animate: false,
		        hideCollapseTool : true,
		        activeOnTop: true
		    },
			items:[_this.viewTree,_this.myViewTree]
		});
	},
	/**
	 * 初始化全部视图
	 */
	initAllViewTree : function(){
		var _this = this;
		_this.viewLoader = new Wlj.frame.functions.app.widgets.ArrayTreeLoader({
			parentAttr : 'PARENTID',
			idProperties : 'ID',
			textField : 'NAME',
			locateAttr : 'ID',
			rootValue : '0'
		});
		_this.viewTree = new Wlj.frame.functions.app.widgets.TreePanel({
			title:'全部客户视图',
			width:220,
			region:'west',
			rootVisible:false,
			collapsible:false,
			autoScroll :true,
			root: new Ext.tree.AsyncTreeNode({
				id :'0',
				text:'客户视图',
				expanded:true,
				autoScroll:true,
				children:[]
			}),
			resloader:_this.viewLoader,
			tools : [{
	        	id:'allview',
	        	handler:function(e,target,panel){
	        		_this.switchView(false);
	        	}
	       	}],
		    listeners: {
		    	'click':function(node){
					_this.viewClickHandler(node,_this.viewTree,_this.myViewTree);
				},
		        contextmenu: function(node, e) {
		        	if(!node.leaf){
		        		return;
		        	}
		        	var c = node.getOwnerTree().contextMenu;
				    var tn = _this.myViewTree.root.findChild('id',node.id,true);
					if(tn){
						c.items.items[0].setVisible(false);
						c.items.items[1].setVisible(true);
					}else{
						c.items.items[0].setVisible(true);
						c.items.items[1].setVisible(false);
					}
		            c.contextNode = node;
		            c.showAt(e.getXY());
		        }
		    },
		    contextMenu: new Ext.menu.Menu({
		        items: [{
		            id: 'addnode',
		            iconCls:'ico-g-1',
		            text: '添加到我的视图'
		        },{
		            id: 'removenode',
		            iconCls:'ico-g-2',
		            text: '从我的视图移除'
				}],
		        listeners: {
		            itemclick: function(item) {
		                switch (item.id) {
		                    case 'addnode':
		                    {
		                    	var node = item.parentMenu.contextNode;
		                    	_this.addMyView(node);
		                        break;
		                    }
		                    case 'removenode':
		                    {
		                    	var node = item.parentMenu.contextNode;
		                    	var tn = _this.myViewTree.root.findChild('id',node.id,true);
								if(tn){
									 _this.removeMyView(tn);
								}
		                        break;
		                    }
		                }
		            }
		        }
		    })
		});
	},
	/**
	 * 初始化我的视图
	 */
	initMyViewTree : function(){
		var _this = this;
		_this.myViewLoader = new Wlj.frame.functions.app.widgets.ArrayTreeLoader({
			parentAttr : 'PARENTID',
			idProperties : 'ID',
			textField : 'NAME',
			locateAttr : 'ID',
			rootValue : '0'
		});
		_this.myViewTree = new Wlj.frame.functions.app.widgets.TreePanel({
			title:'我的客户视图',
			rootVisible:false,
			hidden:true,
			autoScroll :true,
			root: new Ext.tree.AsyncTreeNode({
				id :'0',
				text:'我的客户视图',
				expanded:true,
				autoScroll:true,
				children:[]
			}),
			resloader:_this.myViewLoader,
			tools : [{
	        	id:'myview',
	        	handler:function(e,target,panel){
	        		_this.switchView(true);
	        	}
	       	}],
	       	listeners:{
	       		beforeclick : function(node,e){
	       			var a = e.getTarget('a');
	       			if(a && a.className === 'view-remove'){
	       				//从我的客户视图中移除
	       				_this.removeMyView(node);
	       				//返回false阻止树节点click事件触发
	       				return false;
	       			}
	       		},
				'click':function(node){
					_this.viewClickHandler(node,_this.myViewTree,_this.viewTree);
				}
		    }
		});
	},
	/**
	 * 查询全部客户视图树
	 */
	queryViewTree : function(){
		var _this = this;
		Ext.Ajax.request({
			url : basepath + '/queryCustViewAuthorize!queryCustViewTree.json?custId='+_this.custId,
			method:'GET',
			success:function(response){
				var nodeArra = Ext.util.JSON.decode(response.responseText).JSON.data;
				_this.viewTree.resloader.nodeArray = nodeArra;//重新获取后台数据
				_this.viewTree.resloader.refreshCache(); // 刷新缓存
				var children = _this.viewTree.resloader.loadAll(); //得到相应的树数据
				_this.viewTree.root.removeAll(true); // 清掉以前的数据
				_this.viewTree.appendChild(children);// 把数据重新填充
				_this.viewTree.expandAll();
				var tn = _this.viewTree.root.findChild('NAME','客户信息首页',true);
				if(tn){
					tn.fireEvent('click',tn);
				}
			}
		});
	},
	/**
	 * 查询我的客户视图树
	 */
	queryMyViewTree : function(){
		var _this = this;
		Ext.Ajax.request({
			url : basepath + '/queryCustViewAuthorize!queryMyViewTree.json?custId='+_this.custId,
			method:'GET',
			success:function(response){
				if(Ext.util.JSON.decode(response.responseText).JSON == null){
					Ext.Msg.alert('提示','客户视图树加载失败');
					return false;
				}
				var nodeArra = Ext.util.JSON.decode(response.responseText).JSON.data;
				_this.myViewTree.resloader.nodeArray = nodeArra;//重新获取后台数据
				_this.myViewTree.resloader.refreshCache(); // 刷新缓存
				var children = _this.myViewTree.resloader.loadAll(); //得到相应的树数据
				Ext.each(children,function(i){
					i.uiProvider = Wlj.view.TreeNodeUI;
				});
				_this.myViewTree.root.removeAll(true); // 清掉以前的数据
				_this.myViewTree.appendChild(children);// 把数据重新填充
				_this.myViewTree.expandAll();
				
				var node = _this.viewTree.getSelectionModel().getSelectedNode();
				if(node){
					//判断全部视图上选择的节点，是否存在
					var tn = _this.myViewTree.root.findChild('id',node.id,true);
					if(tn){
						tn.select();
					}
				}
			}
		});
	},
	/**
	 * 请求客户基础信息
	 */
	queryCustBase : function(){
		var _this = this;
		Ext.Ajax.request({
			url : basepath + '/queryCustViewAuthorize!queryCustBase.json?custId='+_this.custId,
			method:'GET',
			success:function(response){
				var data = Ext.util.JSON.decode(response.responseText).JSON.data;
				if(data.length >0){
					_this.custName = data[0].CUST_NAME;
					_this.custType = data[0].CUST_TYPE;
				}else{
					Ext.Msg.alert('提示','客户信息加载失败');
				}
			}
		});
	},
	/**
	 * 视图click事件触发
	 * @param {} node	当前节点
	 * @param {} currViewTree	当前点击树
	 * @param {} otherViewTree  当前未点击树
	 */
	viewClickHandler : function(node,currViewTree,otherViewTree){
		if (node.attributes.ADDR && node.attributes.ADDR != '0') {
			//_this.viewPanel.setTitle(node.text);
			this.CURRENT_VIEW_URL = node.attributes.ADDR;
			var url = this.builtfunctionurl(node.attributes.ADDR,node.id);
			document.getElementById(this.containDIVid).src = url;
			otherViewTree.getSelectionModel().clearSelections();
			var tn = otherViewTree.root.findChild('id',node.id,true);
			if(tn){
				tn.select();
			}
		}
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
		var turl = baseUrl.indexOf('?')>=0 ? (baseUrl + '&resId='+this.resId ): (baseUrl + '?resId='+this.resId) ;
		url += '?' + turl.split('?')[1] + '&custId='+this.custId+'&viewId='+viewId+'&viewType='+this.viewType;
		return url;
	},
	/**
	 * 切换视图
	 * @param bool true表示显示全部视图，隐藏我的视图
	 */
	switchView : function(bool){
		this.viewTree.setVisible(bool);
		this.myViewTree.setVisible(!bool);
		Ext.getCmp('leftLayout').layout.setActiveItem(bool?this.viewTree:this.myViewTree);
	},
	addMyView : function(node){
		var _this = this;
		Ext.Ajax.request({
			url : basepath + '/myCustView.json',
			params:{
				viewId : node.id,
				userId : JsContext._userId
			},
			method:'POST',
			success:function(response){
				_this.queryMyViewTree();
			}
		});
	},
	removeMyView : function(node){
		var _this = this;
		Ext.Ajax.request({
			url : basepath + '/myCustView!batchDestroy.json',
			params:{
				ids : node.attributes.MY_VIEW_ID
			},
			method:'POST',
			success:function(response){
				_this.queryMyViewTree();
			}
		});
	}
});

/**
 * 重写Ext树节点展现类
 * @class Wlj.view.TreeNodeUI
 * @extends Ext.tree.TreeNodeUI
 */
Wlj.view.TreeNodeUI = Ext.extend(Ext.tree.TreeNodeUI,{
    // private
    renderElements : function(n, a, targetNode, bulkRender){
        // add some indent caching, this helps performance when rendering a large tree
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var cb = Ext.isBoolean(a.checked),
            nel,
            href = this.getHref(a.href),
            buf = ['<li class="x-tree-node"><div ext:tree-node-id="',n.id,'" class="x-tree-node-el x-tree-node-leaf x-unselectable ', a.cls,' cust-viewList" unselectable="on">',
            '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
            '<img alt="" src="', this.emptyIcon, '" class="x-tree-ec-icon x-tree-elbow" />',
            '<img alt="" src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
            cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : '/>')) : '',
            '<a hidefocus="on" class="x-tree-node-anchor" href="',href,'" tabIndex="1" ',
             a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", '><span unselectable="on">',n.text,"</span></a>"
             ,'<a class="view-remove" href="javascript:void(0);"></a></div>',
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>"].join('');

        if(bulkRender !== true && n.nextSibling && (nel = n.nextSibling.ui.getEl())){
            this.wrap = Ext.DomHelper.insertHtml("beforeBegin", nel, buf);
        }else{
            this.wrap = Ext.DomHelper.insertHtml("beforeEnd", targetNode, buf);
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if(cb){
            this.checkbox = cs[3];
            // fix for IE6
            this.checkbox.defaultChecked = this.checkbox.checked;
            index++;
        }
        this.anchor = cs[index];
        this.textNode = cs[index].firstChild;
    }
});

Ext.onReady(function(){
	window.CUSTVIEW = new Wlj.view.CustView();
	var viewport = new Ext.Viewport({
        layout : 'fit',
        items: [window.CUSTVIEW]
    });
});