	/**
	 * mxGraph图形对象API。本文件中定义了基于客户关系图的图形对象，及其原型属性、方法。
	 * 以此作为基础基础，用户可创建该图形对象，并根据客户化需求重载相关方法即可。
	 * @since : 2012-5-15
	 * @version : 1.000
	 */
	mxClient.basePath = basepath;

	mxConnectionHandler.prototype.connectImage = new mxImage(mxClient.basePath+'/contents/commonjs/mxGraphLocal/images/connector.gif', 16, 16);
	mxRectangleShape.prototype.crisp = true;
	/************************判断数组元素是否还有ID****************/
	function getPointBaby(tBs,id){
		if(tBs[0])
			for(var tb in tBs){
				if(tBs[tb].id == id)
					return tBs[tb];
			}
	}	
	/*************************弹出客户全景视图********************/
	function showCustInfo(_custId){
		if(!_custId){return;}
		Ext.Ajax.request({
			url:basepath+'/customerBaseInformation.json',
			method:'GET',
			params:{
				customerId:_custId
			},
			success:function(r){
				if(Ext.decode(r.responseText).json.data.length>0){
					var custId=_custId;
					var custName=Ext.decode(r.responseText).json.data[0].CUST_ZH_NAME;
					var custTyp=Ext.decode(r.responseText).json.data[0].CUST_TYP;
					if(Ext.getCmp('viewWindow')!=undefined&&document.getElementById('sena_tree')!=null){
						document.getElementById('sena_tree').innerHTML="";
						document.getElementById('viewport_center').innerHTML="";
						Ext.getCmp('viewWindow').setTitle('您所浏览的客户为：'+Ext.decode(r.responseText).json.data[0].CUST_ZH_NAME);
						oCustInfo.cust_id=custId;
						oCustInfo.cust_name=custName;
						oCustInfo.cust_type=custTyp;
						Ext.ScriptLoader.loadScript({        
							scripts: [basepath+'/contents/pages/customer/customerManager/menuOfCorporateCustomers.js'],        
							callback: function() {  
						}
						});
						Ext.getCmp('graphWindow').close();
						
					}else{
						var viewWindow = new Com.yucheng.crm.cust.ViewWindow({
							id:'viewWindow',
							custId:custId,
							custName:custName,
							custTyp:custTyp
						});
						viewWindow.show();
						
					}
				}
			},failure:function(){
				
			}
		});
	}
	/**********************节点浮动图标***************************/
	function mxIconSet(state,opGrant){
		this.images = [];
		this.md = (mxClient.IS_TOUCH) ? 'touchstart' : 'mousedown';
		var graph = state.view.graph;
		// Delete
		if(opGrant){
			var img = mxUtils.createImage(mxClient.basePath+'/contents/commonjs/mxGraphLocal/images/delete2.png');
			img.setAttribute('title', '删除');
			img.style.position = 'absolute';
			img.style.cursor = 'pointer';
			img.style.width = '16px';
			img.style.height = '16px';
			img.style.left = (state.x + state.width) + 'px';
			img.style.top = (state.y - 16) + 'px';
			mxEvent.addListener(img, this.md,mxUtils.bind(this, function(evt){
			// Disables dragging the image
			mxEvent.consume(evt);
			}));
			mxEvent.addListener(img, 'click',mxUtils.bind(this, function(evt){
				graph.removeCells([state.cell]);
				mxEvent.consume(evt);
				this.destroy();
			}));
			state.view.graph.container.appendChild(img);
			this.images.push(img);
		}
		//Detail
		var detail = mxUtils.createImage(mxClient.basePath+'/contents/commonjs/mxGraphLocal/images/camera.png');
		detail.setAttribute('title', '详情');
		detail.style.position = 'absolute';
		detail.style.cursor = 'pointer';
		detail.style.width = '16px';
		detail.style.height = '16px';
		detail.style.left = (state.x + state.width) + 'px';
		detail.style.top = (state.y + state.height) + 'px';
		mxEvent.addListener(detail, this.md,mxUtils.bind(this, function(evt){
			mxEvent.consume(evt);
		}));
		mxEvent.addListener(detail, 'click',mxUtils.bind(this, function(evt){
			var custPoint = state.cell;
			if(custPoint.id){
				showCustInfo(custPoint.id);
			}
			mxEvent.consume(evt);
			this.destroy();
		}));
		state.view.graph.container.appendChild(detail);
		this.images.push(detail);
	};
	/***********************浮动图标隐藏******************************/
	mxIconSet.prototype.destroy = function(){
		if (this.images != null){
			for (var i = 0; i < this.images.length; i++){
				var img = this.images[i];
				img.parentNode.removeChild(img);
			}
		}
		this.images = null;
	};
	/**
	 * 主图形对象,创建一个本工程产品化的一个graph对象
	 * @param cPanel: 图形容器面板，用户渲染图形，标准Ext.Panel对象
	 * @param iPanel: 图形基本信息面板，用户存储，展示图形对象基本信息,标准Ext.Panel对象
	 * @param graphData: 图形数据，包含图形基本信息以及图形节点、边等信息的JSON对象，用于initDataFunc方法中的解析展示（可选）
	 * @param opGrant: 操作权限，boolean型数据。（可选，默认为true）
	 */
	function GraphCrmObject(cPanel,iPanel,graphData,opGrant){
		if (!mxClient.isBrowserSupported()){
			mxUtils.error('Browser is not supported!', 200, false);
			return null;
		}
		if(!cPanel){
			Ext.Msg.alert('提示','无容器');
			return null;
		}
		this.previewAble = true;
		this.cPanel = cPanel;
		this.iPanel = iPanel;
		this.container = false;
		this.graph = false;
		this.iconSet = false;
		if(graphData)
			this.graphData = graphData;
		else this.graphData = false;
		if(typeof opGrant == "boolean" && !opGrant)
			this.opGrant = false;
		else this.opGrant = true;
		this.tools = new Array();
	};
	/**
	 * 用户接口，用于处理用户的特殊业务逻辑
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.customerfull = function(o){};
	/**
	 * 创建右键菜单方法，用户可重写该方法以订制右键菜单
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.createPopupMenu = function(o){
		o.graph.panningHandler.factoryMethod = function(menu, cell, evt){
			var model = o.graph.getModel();
			menu.addItem('Fit', mxClient.basePath+'/editors/images/zoom.gif', function(){
				o.graph.fit();
			});
			menu.addItem('Actual', mxClient.basePath+'/editors/images/zoomactual.gif', function(){
				o.graph.zoomActual();
			});
			menu.addSeparator();
			menu.addItem('Print',mxClient.basePath+ '/editors/images/print.gif', function(){
				var preview = new mxPrintPreview(o.graph, 1);
				preview.open();
			});
			menu.addItem('Poster Print', mxClient.basePath+'/editors/images/print.gif', function(){
				var pageCount = mxUtils.prompt('Enter maximum page count', '1');
				if (pageCount != null){
					var scale = mxUtils.getScaleForPageCount(pageCount, o.graph);
					var preview = new mxPrintPreview(o.graph, scale);
					preview.open();
				}
			});
		};
	};	
	/**
	 * 数据解析初始化函数，用户根据自定义的数据结构进行解析
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.initDataFunc = function(o){};
	/**
	 * 键盘世间绑定，用户可重载以订制键盘事件
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.initKeyFuncs = function(o){
		var keyHandler = new mxKeyHandler(o.graph);
		keyHandler.bindKey(46, function(evt){
			if (o.graph.isEnabled()&&o.opGrant){
					o.graph.removeCells();
			}
		});	
	};
	/**
	 * 订制节点风格，用户可以重载以订制节点风格
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.setVertexStyle = function(o){
		var style = o.graph.getStylesheet().getDefaultVertexStyle();
		style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
		style[mxConstants.STYLE_GRADIENTCOLOR] = 'white';
		style[mxConstants.STYLE_PERIMETER_SPACING] = 6;
		style[mxConstants.STYLE_ROUNDED] = true;
		style[mxConstants.STYLE_SHADOW] = true;
		style[mxConstants.STYLE_ROUNDED] = true;
		return style;
	};
	/**
	 * 订制边风格，用户可以重载以订制边风格
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.setEdgeStyle = function(o){
		var style = o.graph.getStylesheet().getDefaultEdgeStyle();
		return style;
	};
	/**
	 * 图形整体配置，用户可重载
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.graphSepecialOptions = function(o){
		new mxRubberband(o.graph);
		o.graph.setConnectable(true);
		o.graph.setAllowDanglingEdges(false);
		o.graph.setEnabled(o.opGrant);
		o.graph.setAutoSizeCells(true);
		o.graph.setPanning(true);
		o.graph.panningHandler.selectOnPopup = false;
		o.graph.setAutoSizeCells(true);
		o.graph.setMultigraph(false);
		o.graph.panningHandler.useLeftButtonForPanning = true;
		o.graph.cellsEditable = false;
		if (mxClient.IS_IE){
			new mxDivResizer(o.container);
		}
	};		
	/**
	 * 节点事件，用户可重载，以订制节点鼠标世间
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.addCellEvents = function(o){
		var iconTolerance = 20;
		o.graph.addMouseListener({
			currentState: null,
			currentIconSet: null,
			mouseDown: function(sender, me){
				// Hides icons on mouse down
				if (this.currentState != null){
					this.dragLeave(me.getEvent(), this.currentState);
					this.currentState = null;
				}
			},
			mouseMove: function(sender, me){
				if (this.currentState != null && (me.getState() == this.currentState || me.getState() == null)){	
					var tol = iconTolerance;
					var tmp = new mxRectangle(me.getGraphX() - tol, me.getGraphY() - tol, 2 * tol, 2 * tol);
					if (mxUtils.intersects(tmp, this.currentState)){
						return;
					}
				}
				var tmp = o.graph.view.getState(me.getCell());
				// Ignores everything but vertices
				if (o.graph.isMouseDown || (tmp != null && !o.graph.getModel().isVertex(tmp.cell))){
					tmp = null;
				}
				if (tmp != this.currentState){
					if (this.currentState != null){
						this.dragLeave(me.getEvent(), this.currentState);
					}
					this.currentState = tmp;
					if (this.currentState != null){
						this.dragEnter(me.getEvent(), this.currentState);
					}
				}
			},
			mouseUp: function(sender, me) {
			},
			dragEnter: function(evt, state) {
				this.currentIconSet = null;
				if (this.currentIconSet == null){
					this.currentIconSet = new mxIconSet(state,o.opGrant);
				}
			},
			dragLeave: function(evt, state){
				if (this.currentIconSet != null){
					this.currentIconSet.destroy();
					this.currentIconSet = null;
				}
			}
		});
	};
	
	/**
	 * private 方法，不对外公布
	 */
	/**
	 * private，内部渲染方法。
	 */
	GraphCrmObject.prototype.show = function(){
		if(this.graph){
			var tVs = [];
			for(var i in this.graph.getModel().cells){
				if(this.graph.getModel().cells[i].isVertex())
					tVs.push(this.graph.getModel().cells[i]);
			}
			this.graph.removeCells(tVs, true);
			this.graphSepecialOptions(this);
			this.initToolButtons(this);
			this.initKeyFuncs(this);
			this.customerfull(this);
			this.addCellEvents(this);
			this.initData(this);
			return this.graph;
		}
		if(this.cPanel.rendered){
			this.container = this.cPanel.body.dom;
			this.graph = new mxGraph(this.container);
			this.setEdgeStyle(this);
			this.setVertexStyle(this);
			this.createPopupMenu(this);
			this.graphSepecialOptions(this);
			if(this.previewAble)
				this.previewFun(this);
			
			this.initToolButtons(this);
			this.initKeyFuncs(this);
			this.addCellEvents(this);
			this.initData(this);
			this.customerfull(this);
			return this.graph;
		}else{
			Ext.Msg.alert("程序错误","容器窗口还没有渲染，请注意函数调用顺序");
		}
	};
	/**
	 * 数据初始化参数，内部函数，调用用户数据解析函数
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.initData = function(o){
		o.graph.getModel().beginUpdate();
		try
		{
			var layout = new mxHierarchicalLayout(o.graph);
			this.initDataFunc(o);
			layout.execute(o.graph.getDefaultParent());
		}catch(therror){
			debugger;
		}finally{
			o.graph.getModel().endUpdate();
			return o.graph;
		}
	};
	/**
	 * 工具栏函数，用户可重载以订制工具栏
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.initToolButtons = function(o){
		if(!o.cPanel.topToolbar){
			return false;
		}
		o.cPanel.topToolbar.removeAll(true);
		for(var b in o.tools){
			if(o.tools[b].text){
				if(o.tools[b].withGrant){
					o.tools[b][o.tools[b].withGrant] = !o.opGrant;
				}
				o.cPanel.topToolbar.addSeparator();
				o.cPanel.topToolbar.addButton(o.tools[b]);
			}
		}
		o.cPanel.doLayout();
	};
	/**
	 * 确定DOM对象是否在图形范围内
	 * @param elt： DOM对象
	 */
	GraphCrmObject.prototype.containsElt = function(elt){
		while (elt != null){
			if (elt == this.container){
				return true;
			}
			elt = elt.parentNode;
		}
		return false;
	};
	/**
	 * 鼠标事件所在图形范围
	 * @param evt: 鼠标事件
	 */
	GraphCrmObject.prototype.graphIn = function(evt){
		var x = mxEvent.getClientX(evt);
		var y = mxEvent.getClientY(evt);
		var elt = document.elementFromPoint(x, y);
		if (this.containsElt(elt)){
			return this.graph;
		}
		return null;
	};
	/**
	 * 添加概览窗口
	 * @param 可选参数，o为this指针
	 */
	GraphCrmObject.prototype.previewFun = function(o){
		var outlineObject = Ext.get('sepecialPreviewBlockDiv');
		if(!outlineObject)
			outlineObject = o.cPanel.body.appendChild(Ext.getBody().createChild({
				id : 'sepecialPreviewBlockDiv',
				tag:'div',
				style:'z-index: 1; overflow: hidden; position:absolute; float:right;top: 0px; right: 0px; width: 160px; height: 120px; background: transparent; border-style: solid; border-color: lightgray;'
			}));
		var outline = outlineObject.dom;
		mxEvent.disableContextMenu(o.container);
		var outln = new mxOutline(o.graph, outline);
	};
	
	/**
	 * 闭包API。以下方法不需重载
	 */
	/**
	 * 图形展示方法
	 * @param graphData: 图形数据，包含图形基本信息以及图形节点、边等信息的JSON对象，用于initDataFunc方法中的解析展示
	 * @param opGrant：操作权限，boolean型数据。（可选，默认为true） 
	 */
	GraphCrmObject.prototype.showData = function(graphData,opGrant){
		this.graphData = graphData;
		if(typeof opGrant == "boolean" && !opGrant)
			this.opGrant = false;
		else this.opGrant = true;
		return this.show();
	};
	/**
	 * 销毁方法
	 */
	GraphCrmObject.prototype.destroy = function(){
		if(this.graph)
			this.graph.destroy();
		var t = this;
		t = null;
	};
	/**
	 * 设置操作权限
	 * @param opGrant: boolean型，默认为true。
	 */
	GraphCrmObject.prototype.setOpGrant = function(opGrant){
		if(typeof opGrant == 'boolean'){
			this.opGrant = opGrant;
			this.graph.setEnabled(this.opGrant);
			this.graph.clearSelection();
		}
	};
	/**
	 * 获得当前对象操作权限
	 */
	GraphCrmObject.prototype.getOpGrant = function(){
		return this.opGrant;
	};
	/**
	 * 添加工具栏
	 * @param extBut: 标准Ext按钮或者Ext按钮配置
	 */
	GraphCrmObject.prototype.pushToolButton =function(extBut){
		if((extBut.getXType&&extBut.getXType()=='button')||extBut.text){
			this.tools.push(extBut);
		}
	};
	/**
	 * 设置预览窗口
	 * @param previewAble:是否需要预览窗口,默认为true.
	 */
	GraphCrmObject.prototype.setPreviewAble = function(previewAble){
		if(typeof previewAble == "boolean" && !previewAble)
			this.previewAble = false;
	};
	