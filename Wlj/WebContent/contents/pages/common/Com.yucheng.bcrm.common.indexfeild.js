/**
 * 指标查询放大镜 德阳银行POC使用
 * 
 * @since:2013.2. njacrm poc demo
 */
Ext.ns('Com.yucheng.crm.common');
Com.yucheng.crm.common.IndexField = Ext.extend(

		Ext.form.TwinTriggerField, {
			initComponent : function() {
				Com.yucheng.crm.common.IndexField.superclass.initComponent
						.call(this);
				this.on('specialkey', function(f, e) {
							if (e.getKey() == e.ENTER) {
								this.onTrigger2Click();
							}
						}, this);
			},
			onRender : function(ct, position) {
				Com.yucheng.crm.common.IndexField.superclass.onRender.call(
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
			singleSelect : false,
			callback : false,
			validationEvent : false,
			validateOnBlur : false,
			trigger1Class : 'x-form-clear-trigger',
			trigger2Class : 'x-form-search-trigger',
			hideTrigger1 : true,
			width : 180,
			searchType : 'SUBTREE',// 默认查询辖内机构
			searchRoleType : '',// 默认查询全部角色信息
			hasSearch : false,
			paramName : 'query',
			onTrigger2Click : function() {
				var _this = this;
				if (_this.orgUserManageWindow) {
					_this.orgUserManageWindow.show();
					return;
				}
				var searchFunction = function() {
					var parameters = _this.orgUserSearchPanel.getForm()
							.getFieldValues();
					indexTreeListstore.reload({
								params : {
									start : 0,
									limit : parseInt(pagesize_combo.getValue())
								}
							});
				};
				var searchField = _this;
				_this.loader = new Com.yucheng.bcrm.ArrayTreeLoader({
							checkField : 'ASTRUE',
							parentAttr : 'SUPERUNITID',
							locateAttr : 'root',// UNITID
							rootValue : (this.searchType == 'ALLORG')? JsContext.ROOT_UP_ORG_ID: JsContext._orgId,
							textField : 'UNITNAME',
							idProperties : 'ID'
						});
				// var condition = {searchType:this.searchType};
				var condition = {
					searchType : 'SUBINDEXTREE'
				};

				var loader = new Com.yucheng.bcrm.ArrayTreeLoader({
							checkField : 'ASTRUE',
							parentAttr : 'INDEX_TYPE_SUPERUNIT_ID',// 指向父节点的属性列
							locateAttr : 'INDEX_TYPE_ID',// 机构编号
							rootValue : 1000,
							textField : 'INDEX_TYPE_NAME',// 机构名称
							idProperties : 'INDEX_TYPE_ID'// 主键
						});

				var filter = false;
				/** **************************************************** */
				Ext.Ajax.request({
							url : basepath + '/commsearch.json?condition='
									+ Ext.encode(condition),
							method : 'GET',
							success : function(response) {

								var nodeArra = Ext.util.JSON
										.decode(response.responseText).json.data;
								loader.nodeArray = nodeArra;
								var children = loader.loadAll();
								_this.orgUserManageTreeForShow
										.appendChild(children);
							},
							failure : function(a, b, c) {
							}
						});
				var s2 = new String('所有机构');

				// 定义指标类型树查询码

				// 指标类型树树加载属性值

				var indexTreeListRecord = Ext.data.Record.create([{
							name : 'ID',
							mapping : 'ID'
						}, {
							name : 'CODE',
							mapping : 'CODE'
						}, {
							name : 'NAME',
							mapping : 'NAME'
						}, {
							name : 'CONTENT',
							mapping : 'CONTENT'
						}, {
							name : 'CLASSNAME',
							mapping : 'CLASSNAME'
						}, {
							name : 'CLASS',
							mapping : 'CLASS'
						}]);

				_this.orgUserManageTreeForShow = new Com.yucheng.bcrm.TreePanel(
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
							// 单击机构树的节点，获取机构ID赋值给隐藏域,根据ID查询
							clickFn : function(node) {
								indexTreeListstore.load({
											params : {
												start : 0,
												limit : parseInt(pagesize_combo
														.getValue()),
												typeid : node.id
											}
										});
							}
						});

				_this.orgUserPanel = new Ext.form.FormPanel({// 查询panel
					width : '25%',
					height : 150,
					frame : true,
					autoScroll : true,
					region : 'west',
					split : true,
					items : [_this.orgUserManageTreeForShow]
				});
				var condition_role = {
					searchForRoleType : this.searchRoleType
				};
				_this.typeStore = new Ext.data.Store({
							restful : true,
							autoLoad : true,
							proxy : new Ext.data.HttpProxy({
										url : basepath + '/roleQuery.json'
									}),
							reader : new Ext.data.JsonReader({
										root : 'json.data'
									}, ['ROLE_ID', 'ROLE_NAME'])
						});
				_this.typeStore.baseParams = {
					'condition' : Ext.util.JSON.encode(condition_role)
				};

				var indexTreeListstore = new Ext.data.Store({
							restful : true,
							proxy : new Ext.data.HttpProxy({
										url : basepath
												+ '/IndexInfoQueryAction.json',
										method : 'POST'// ,
									}),
							reader : new Ext.data.JsonReader({
										successProperty : 'success',
										root : 'json.data',
										totalProperty : 'json.count'
									}, indexTreeListRecord)
						});

				_this.orgUserSearchPanel = new Ext.form.FormPanel({// 查询panel
					// title:'用户查询',
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
														name : 'USER_NAME',
														fieldLabel : '指标名称',
														anchor : '100%'
													}]
										}, {
											columnWidth : .4,
											layout : 'form',
											items : [{
														xtype : 'textfield',
														name : 'USER_NAME',
														fieldLabel : '指标编码',
														anchor : '100%'
													}]
										}, {
											columnWidth : .5,
											layout : 'form',
											items : [{
														xtype : 'textfield',
														name : 'TREE_STORE',
														hiddenName : 'TREE_STORE',
														id : 'treenode',
														fieldLabel : '机构节点',
														anchor : '90%',
														hidden : true,
														value : JsContext._orgId
													}]
										}, {
											columnWidth : .5,
											layout : 'form',
											items : [{
														xtype : 'combo',
														name : 'ROLE_ID2',
														hiddenName : 'ROLE_ID2',
														fieldLabel : '用户角色',
														anchor : '90%',
														hidden : true,
														value : this.searchRoleType
													}]
										}]
							}],
					buttonAlign : 'center',
					buttons : [{
						text : '查询',
						handler : function() {
							{
								var parameters = _this.orgUserSearchPanel
										.getForm().getFieldValues();
								indexTreeListstore.reload({
											params : {
												start : 0,
												limit : parseInt(pagesize_combo
														.getValue())
											}
										});
							}
						}
					}, {
						text : '重置',
						handler : function() {
							_this.orgUserSearchPanel.getForm().reset();
							_this.orgUserManageInfoStore.load({
										params : {
											start : 0,
											limit : parseInt(_this.pagesize_combo
													.getValue())
										}
									});
						}
					}]
				});
				// 复选框
				var sm = new Ext.grid.CheckboxSelectionModel({
							singleSelect : _this.singleSelect
						});
				// 定义自动当前页行号
				_this.rownum = new Ext.grid.RowNumberer({
							header : 'NO',
							width : 28
						});
				_this.orgUserInfoColumns = new Ext.grid.ColumnModel([// gridtable中的列定义
				_this.rownum, sm, {
							header : 'ID',
							dataIndex : 'id',
							id : 'id',
							width : 100,
							sortable : true,
							hidden : true
						}, {
							header : '用户ID',
							dataIndex : 'userId',
							id : "userId",
							width : 100,
							sortable : true
						}, {
							header : '用户姓名',
							dataIndex : 'userName',
							id : 'userName',
							width : 100,
							sortable : true
						}, {
							header : '所属机构',
							dataIndex : 'orgName',
							id : 'orgName',
							width : 100,
							sortable : true,
							hidden : false
						}, {
							header : '角色',
							dataIndex : 'role',
							id : 'role',
							width : 130,
							hidden : false,
							sortable : true
						}]);
				_this.orgUserInfoRecord = new Ext.data.Record.create([{
							name : 'id',
							mapping : 'ID'
						}, {
							name : 'userId',
							mapping : 'ACCOUNT_NAME'
						}, {
							name : 'userName',
							mapping : 'USER_NAME'
						}, {
							name : 'orgName',
							mapping : 'ORG_NAME'
						}, {
							name : 'role',
							mapping : 'ROLE_NAME'
						}]);
				_this.orgUserInfoReader = new Ext.data.JsonReader({// 读取json数据的panel
					totalProperty : 'json.count',
					root : 'json.data'
				}, _this.orgUserInfoRecord);

				_this.orgUserManageProxy = new Ext.data.HttpProxy({
							url : basepath + '/orgusermanage.json'
						});

				_this.orgUserManageInfoStore = new Ext.data.Store({
							restful : true,
							baseParams : {
								'role_id' : this.searchRoleType,
								'org_id' : JsContext._orgId
							},
							proxy : _this.orgUserManageProxy,
							reader : _this.orgUserInfoReader,
							recordType : _this.orgUserInfoRecord
						});
				// 每页显示条数下拉选择框
				_this.pagesize_combo = new Ext.form.ComboBox({
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

				var number = parseInt(_this.pagesize_combo.getValue());
				_this.pagesize_combo.on("select", function(comboBox) {
							_this.bbar.pageSize = parseInt(_this.pagesize_combo
									.getValue()), _this.orgUserManageInfoStore
									.load({
										params : {
											start : 0,
											limit : parseInt(_this.pagesize_combo
													.getValue())
										}
									});
						});
				_this.bbar = new Ext.PagingToolbar({
							pageSize : number,
							store : _this.orgUserManageInfoStore,
							displayInfo : true,
							displayMsg : '显示{0}条到{1}条,共{2}条',
							emptyMsg : "没有符合条件的记录",
							items : ['-', '&nbsp;&nbsp;', _this.pagesize_combo]
						});

				var pagesize_combo = new Ext.form.ComboBox({
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

				// indexTreeListstore.load({
				// params : {
				// start : 0,
				// limit : parseInt(pagesize_combo.getValue())
				// }});

				// 复选框
				_this.sm_target = new Ext.grid.CheckboxSelectionModel();

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
							dataIndex : 'ID'
						}, {
							header : '指标编号',
							dataIndex : 'CODE'
						}, {
							header : '指标名称',
							dataIndex : 'NAME'
						}, {
							header : '指标描述',
							dataIndex : 'CONTENT'
						}, {
							header : '指标分类',
							dataIndex : 'CLASSNAME'
						}, {
							header : '指标分类码',
							hidden : true,
							dataIndex : 'CLASS'
						}]);

				_this.orgUserManageGrid = new Ext.grid.GridPanel({
							// height : document.body.scrollHeight-107,
							// width : document.body.scrollWidth-10,
							title : '指标列表',
							frame : true,
							autoScroll : true,
							region : 'center', // 和VIEWPORT布局模型对应，充当center区域布局
							store : indexTreeListstore, // 数据存储
							stripeRows : true, // 斑马线
							cm : _this.cm_target, // 列模型
							sm : _this.sm_target, // 复选框
							// tbar : tbar, // 表格工具栏
							// bbar : bbar,// 分页工具栏
							loadMask : {
								msg : '正在加载表格数据,请稍等...'
							}
						});

				_this.orgUserManageWindow = new Ext.Window({
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
					items : [_this.orgUserPanel, {
								region : 'center',
								layout : 'border',
								items : [_this.orgUserManageGrid]
							}],
					buttons : [{
						text : '选定',
						handler : function() {
							var sName = '';
							var sHide = '';
							var checkedNodes;
							var groupMemberNodoes;
							if (!(_this.orgUserManageGrid.getSelectionModel().selections == null)) {
								if ('' != searchField.hiddenField) {
									checkedNodes = _this.orgUserManageGrid
											.getSelectionModel().selections.items;
									if (searchField.singleSelected
											&& checkedNodes.length > 1) {
										Ext.Msg.alert('提示', '您只能选择一个指标！');
										return;
									} else if (searchField.singleSelected
											&& checkedNodes.length < 1) {
										Ext.Msg.alert('提示', '您没有选择任何指标！');
										return;
									}
									for (var i = 0; i < checkedNodes.length; i++) {
										if (i == 0) {
											sHide = checkedNodes[i].data.CODE;
											sName = checkedNodes[i].data.NAME;
										} else {
											sName = sName + ','
													+ checkedNodes[i].data.NAME;
											sHide = sHide + ','
													+ checkedNodes[i].data.CODE;
										}
									}
									searchField.setRawValue(sName);
									//wzy，20130704，modify：增加对searchField.hiddenField为空的判断，避免出现对象为空时报错
									if(searchField.hiddenField){
										searchField.hiddenField.setValue(sHide);
									}
									if (checkedNodes.length == 1) {
										// 如果单选，则设置该指标相应的附属属性
										searchField.ID = checkedNodes[0].data.ID;// 指标记录ID
										searchField.CODE = checkedNodes[0].data.CODE;// 指标编号
										searchField.NAME = checkedNodes[0].data.NAME;// 指标名称
										searchField.CONTENT = checkedNodes[0].data.CONTENT;// 指标描述
										searchField.CLASSNAME = checkedNodes[0].data.CLASSNAME;// 指标类别（名称）
										searchField.CLASS = checkedNodes[0].data.CLASS;// 指标类别（ID）
									}
								}
							}
							if (typeof searchField.callback == 'function') {
								searchField.callback(searchField, checkedNodes);
							}
							_this.orgUserManageWindow.hide();
						}
							/*
							 * { var checkedNodes =
							 * _this.orgUserManageGrid.getSelectionModel().selections.items;
							 * if(_this.singleSelect) {
							 * _this.setValue(checkedNodes[0].data.ID);
							 * _this.hiddenField.setValue(checkedNodes[0].data.NAME); }
							 * else { var sName=''; var json = ''; for(var i=0;i<checkedNodes.length;i++) {
							 * if(i == 0) { json = json +
							 * checkedNodes[i].data.ID; sName = sName +
							 * checkedNodes[i].data.NAME; } else { json = json +
							 * ',' + checkedNodes[i].data.ID; sName = sName +
							 * ',' + checkedNodes[i].data.NAME; } };
							 * _this.setValue(sName); if(_this.hiddenField) {
							 * _this.hiddenField.setValue(json); } };
							 * _this.orgUserManageWindow.hide(); if (typeof
							 * searchField.callback == 'function') {
							 * searchField.callback(checkedNodes); } }
							 */
					}, {
						text : '取消',
						handler : function() {
							searchField.setRawValue('');
							_this.orgUserManageWindow.hide();
						}
					}]
				});

				_this.orgUserManageWindow.on('hide', function() {
							_this.orgUserSearchPanel.getForm().reset();
							_this.orgUserManageInfoStore.removeAll();
						});

				_this.orgUserManageWindow.on('show', function() {
							_this.orgUserManageInfoStore.load();
						});

				_this.orgUserManageWindow.show();
				// searchFunction();
				return;
			}
		});

Ext.reg('userchoose', Com.yucheng.crm.common.IndexField);