/**
 * 评级指标查询放大镜 
 * 参数searchType   INDEXTREE：全部可以查询   
 
 */
var typeid = '';//INDEXTREE时所用的值，根据选择节点更新
Ext.ns('Com.yucheng.crm.common');
Com.yucheng.crm.common.IndexSearchField = Ext.extend(
		Ext.form.TwinTriggerField, {
			initComponent : function() {
				Com.yucheng.crm.common.IndexSearchField.superclass.initComponent
						.call(this);
				this.on('specialkey', function(f, e) {
							if (e.getKey() == e.ENTER) {
								this.onTrigger2Click();
							}
						}, this);
			},
			onRender : function(ct, position) {
				Com.yucheng.crm.common.IndexSearchField.superclass.onRender.call(
						this, ct, position);
				if (this.hiddenName) {
					var ownerForm = this;
					while (ownerForm.ownerCt
							&& !Ext.instanceOf(ownerForm.ownerCt, 'form')) { // 根据条件查询放大镜控件的最外层容器
						ownerForm = ownerForm.ownerCt;
					};
					if (Ext.instanceOf(ownerForm.ownerCt, 'form')) { // 判断父容器是否为form类型
						ownerForm = ownerForm.ownerCt;
						if (ownerForm.getForm().findField(this.hiddenName)) { // 如果已经创建隐藏域
							this.hiddenField = ownerForm.getForm()
									.findField(this.hiddenName);
						} else { // 如果未创建隐藏域，则根据hiddenName属性创建隐藏域
							this.hiddenField = ownerForm.add({
										xtype : 'hidden',
										id : this.hiddenName,
										name : this.hiddenName
									});
						}
					}
				}
			},
			autoLoadFlag : false,
			hiddenName : false,
			singleSelect : true,
			callback : false,
			validationEvent : false,
			validateOnBlur : false,
			trigger1Class : 'x-form-clear-trigger',
			trigger2Class : 'x-form-search-trigger',
			hideTrigger1 : true,
			width : 180,
			searchType : 'INDEXTREE',//INDEXTREE查询全部   如果是类别，直接控制
			searchRoleType : '',
			hasSearch : false,
			paramName : 'query',
			onTrigger2Click : function() {
				var _this = this;
				if (_this.IndexManageWindow) {
					_this.IndexManageWindow.show();
					return;
				}
				
				var searchField = _this;

				var loader = new Com.yucheng.bcrm.ArrayTreeLoader({
							checkField : 'ASTRUE',
							parentAttr : 'ROOT',// 指向父节点的属性列
							locateAttr : 'F_CODE',// 类型编号
							rootValue : 1000,
							textField : 'F_VALUE',// 类型名称
							idProperties : 'F_CODE'// 主键
						});

				var filter = false;
				/** **************************************************** */
				Ext.Ajax.request({
							url : basepath + '/indetree.json',
							method : 'GET',
							success : function(response) {

								var nodeArra = Ext.util.JSON
										.decode(response.responseText).json.data;
								loader.nodeArray = nodeArra;
								var children = loader.loadAll();
								_this.IndexManageTreeForShow
										.appendChild(children);
							},
							failure : function(a, b, c) {
							}
						});
				

				

				// 指标类型树树加载属性值

				var indexTreeListRecord = Ext.data.Record.create([{
							name : 'indexId',
							mapping : 'INDEX_ID'
						}, {
							name : 'indexCode',
							mapping : 'INDEX_CODE'
						}, {
							name : 'indexUse',
							mapping : 'INDEX_USE'
						}, {
							name : 'indexName',
							mapping : 'INDEX_NAME'
						},{name:"INDEX_USE_ORA"}]);

				_this.IndexManageTreeForShow = new Com.yucheng.bcrm.TreePanel(
						{
							id : 'indexTreePanel',
							height : document.body.clientHeight,
							width : 210,
							autoScroll : true,
							checkBox : false, // 是否现实复选框：
							_hiddens : [],
							resloader : loader,
							region : 'west',
							split : true,
							root : new Ext.tree.AsyncTreeNode({
										id : 1000,
										expanded : true,
										text : "指标库",
										autoScroll : true,
										children : []
									}),
							clickFn : function(node) {
								if(searchField.searchType !='INDEXTREE'){//控制节点选择
									if(_this.searchType!=node.id){
										Ext.Msg.alert('提示', '当前不能选择本类型指标！');
										return ;
									}
								}else{
									typeid = node.id;
									indexTreeListstore.load({
										params : {
											typeid : typeid
										}
									});
								}
							}
						});

				_this.IndexPanel = new Ext.form.FormPanel({// 树形panel
					width : '25%',
					height : 150,
					frame : true,
					autoScroll : true,
					region : 'west',
					split : true,
					items : [_this.IndexManageTreeForShow]
				});
				
				

				var indexTreeListstore = new Ext.data.Store({
							restful : true,
							proxy : new Ext.data.HttpProxy({
										url : basepath
												+ '/IndexbaseQueryAction.json',
										method : 'POST' 
									}),
							reader : new Ext.data.JsonReader({
										successProperty : 'success',
										root : 'json.data',
										totalProperty : 'json.count'
									}, indexTreeListRecord)
						});
				if(_this.searchType !='INDEXTREE'){//根据类别查找
					indexTreeListstore.load({
						params : {
							typeid:_this.searchType
						}
					});
				}else{
					indexTreeListstore.reload();
				}


				// 每页显示条数下拉选择框
				pagesize_combo = new Ext.form.ComboBox({
							name : 'pagesize',
							triggerAction : 'all',
							mode : 'local',
							store : new Ext.data.ArrayStore({
										fields : ['value', 'text'],
										data : [[10, '10条/页'], [20, '20条/页'],
												[50, '50条/页'], [100, '100条/页'],
												[250, '250条/页'],
												[500, '500条/页']]
									}),
							valueField : 'value',
							displayField : 'text',
							value : '20',
							forceSelection : true,
							width : 85
						});


				
				_this.indexSearchPanel = new Ext.form.FormPanel({// 查询panel
					// title:'指标查询',
					height : 100,
					labelWidth : 100,// label的宽度
					labelAlign : 'right',
					frame : true,
					autoScroll : true,
					region : 'north',
					split : true,
					items : [{
								layout : 'column',
								items : [{
											columnWidth : .4,
											layout : 'form',
											items : [{
														xtype : 'textfield',
														name : 'INDEX_NAME',
														fieldLabel : '指标名称',
														anchor : '100%'
													}]
										}, {
											columnWidth : .4,
											layout : 'form',
											items : [{
														xtype : 'textfield',
														name : 'INDEX_CODE',
														fieldLabel : '指标编码',
														anchor : '100%'
													}]
										}]
							}],
					buttonAlign : 'center',
					buttons : [{
						text : '查询',
						handler : function() {
							{
								var conditionStr = _this.indexSearchPanel.getForm().getValues(false);
								indexTreeListstore.on('beforeLoad', function() {
									this.baseParams = {
										"condition" : Ext.encode(conditionStr)
									};
								});
								if(searchField.searchType!='INDEXTREE'){
									indexTreeListstore.reload({
										params : {
											typeid:_this.searchType
										}
									});
								}else{
									indexTreeListstore.reload({
										params : {
											typeid:typeid
										}
									});
								}
							}
						}
					}, {
						text : '重置',
						handler : function() {
							_this.indexSearchPanel.getForm().reset();
						}
					}]
				});
			
			
				// 复选框
				_this.sm_target = new Ext.grid.CheckboxSelectionModel({singleSelect:true});

				// 定义自动当前页行号
				_this.rownum_target = new Ext.grid.RowNumberer({
							header : 'No.',
							width : 28
						});

				_this.cm_target = new Ext.grid.ColumnModel([
						_this.rownum_target, _this.sm_target, {
							id : 'id',
							header : '指标编码',
							hidden : true,
							dataIndex : 'indexId'
						}, {
							header : '指标编号',
							dataIndex : 'indexCode'
						}, {
							header : '指标名称',
							dataIndex : 'indexName'
						}, {
							header : '指标用途',
							dataIndex : 'INDEX_USE_ORA'
						}]);

				_this.IndexManageGrid = new Ext.grid.GridPanel({
							title : '指标列表',
							frame : true,
							autoScroll : true,
							region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
							store : indexTreeListstore, // 数据存储
							stripeRows : true, // 斑马线
							cm : _this.cm_target, // 列模型
							sm : _this.sm_target, // 复选框
							loadMask : {
								msg : '正在加载表格数据,请稍等...'
							}
						});

				_this.IndexManageWindow = new Ext.Window({
					title : '指标查询',
					closable : true,
					plain : true,
					resizable : false,
					collapsible : false,
					height : 400,
					width : 800,
					draggable : false,
					closeAction : 'hide',
					modal : true, // 模态窗口
					border : false,
					autoScroll : true,
					closable : true,
					animateTarget : Ext.getBody(),
					constrain : true,
					layout : 'border',
					buttonAlign : 'center',
					items : [_this.IndexPanel, {
								region : 'center',
								layout : 'border',
								items : [_this.indexSearchPanel,_this.IndexManageGrid]
							}],
					buttons : [{
						text : '选定',
						handler : function() {
							var sName = '';
							var sHide = '';
							var checkedNodes;
							var groupMemberNodoes;
							if (!(_this.IndexManageGrid.getSelectionModel().selections == null)) {
								if ('' != searchField.hiddenField) {
									checkedNodes = _this.IndexManageGrid
											.getSelectionModel().selections.items;
									if (searchField.singleSelect
											&& checkedNodes.length > 1) {
										Ext.Msg.alert('提示', '您只能选择一个指标！');
										return;
									} else if (searchField.singleSelect
											&& checkedNodes.length < 1) {
										Ext.Msg.alert('提示', '您没有选择任何指标！');
										return;
									}
									for (var i = 0; i < checkedNodes.length; i++) {
										if (i == 0) {
											sHide = checkedNodes[i].data.indexCode;
											sName = checkedNodes[i].data.indexName;
										} else {
											sName = sName + ','
													+ checkedNodes[i].data.indexName;
											sHide = sHide + ','
													+ checkedNodes[i].data.indexCode;
										}
									}
									_this.setValue(sName);
									
									if(searchField.hiddenField){
										searchField.hiddenField.setValue(sHide);
									}
								}
							}
							if (typeof searchField.callback == 'function') {
								searchField.callback(searchField, checkedNodes);
							}
							_this.IndexManageWindow.hide();
						}
							
					}, {
						text : '取消',
						handler : function() {
							_this.setValue('');
							_this.IndexManageWindow.hide();
						}
					}]
				});

				_this.IndexManageWindow.on('hide', function() {
							_this.indexSearchPanel.getForm().reset();
							indexTreeListstore.removeAll();
						});

				_this.IndexManageWindow.on('show', function() {
					if(_this.searchType !='INDEXTREE'){
						indexTreeListstore.reload({
							params : {
								typeid:_this.searchType
							}
						});
					}else
					indexTreeListstore.load();
				});

				_this.IndexManageWindow.show();
				return;
			}
		});

Ext.reg('indexchoose', Com.yucheng.crm.common.IndexSearchField);