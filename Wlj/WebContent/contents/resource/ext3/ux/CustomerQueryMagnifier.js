/*!
 * @author sena
 * @since 2011-12-26
 */
Ext.ns('Ext.ux.form');
Ext.ux.form.CustMgrField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    singleSelected:false,
    callback:false,
    userId:'',
    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',
    
    onTrigger2Click : function(){
    	var oThisSearchField2=this;
		
		//复选框
		var sm2 = new Ext.grid.CheckboxSelectionModel();
		// 定义自动当前页行号
		var rownum2 = new Ext.grid.RowNumberer({header : 'No.',width : 28});
		// 定义列模型
		var cm2 = new Ext.grid.ColumnModel([rownum2,sm2, 
		        {header : '客户经理编号',dataIndex : 'USERID',sortable : true,width : 150},
			    {header : '客户经理名称',dataIndex : 'USERNAME',width : 200,sortable : true}
		]);
		/**
		 * 数据存储
		 */
		 var oCustomerQueryStore2 = new Ext.data.Store({
			autoLoad :true,
			restful:true,	
	        proxy : new Ext.data.HttpProxy({
	        	url:basepath+'/commsearch.json?condition='+Ext.encode({searchType : 'ORGUSER'})
	        	//params:{ condition:Ext.encode({searchType:'ORGUSER'}) }		//参数'ORGUSER'为获取当前机构的客户经理
	        }),
	       reader: new Ext.data.JsonReader({
	    	   root:'json.data'
	       }, [{name: 'USERID'},{name: 'USERNAME'}])
		});
	 
	var oPagesizeCombo2 = new Ext.form.ComboBox({
         name : 'pagesize',
         triggerAction : 'all',
         mode : 'local',
         store : new Ext.data.ArrayStore({
             fields : ['value', 'text'],
             data : [ [100, '100条/页'], [200, '200条/页'], [500, '500条/页'], [1000, '1000条/页']]
         }),
         valueField : 'value',
         displayField : 'text',
         value : '50',
         editable : false,
         width : 85
     });
    var number2 = parseInt(oPagesizeCombo2.getValue());
    
	var oCustomerQueryBbar2 = new Ext.PagingToolbar({
        pageSize : number2,
        store : oCustomerQueryStore2,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        emptyMsg : "没有符合条件的记录",
        items : ['-'
                 //oPagesizeCombo     设置每页几条记录
                ]
    });
	
	oPagesizeCombo2.on("select", function(comboBox) {
    	oCustomerQueryBbar2.pageSize = parseInt(oPagesizeCombo2.getValue()),
    	oCustomerQueryStore2.load({
			params : {
				start : 0,
				limit : parseInt(oPagesizeCombo2.getValue())
			}
		});
	});
	
	// 表格实例
	var oCustomerQueryGrid2 = new Ext.grid.GridPanel({
		height : 275,
		//width:1000,
				id:'viewgrid',
				frame : true,
				autoScroll : true,
				store : oCustomerQueryStore2, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm2, // 列模型
				sm : sm2, // 复选框
				//tbar : tbar, // 表格工具栏
				bbar:oCustomerQueryBbar2,
				viewConfig:{
					   forceFit:false,
					   autoScroll:true
					},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

	var oCustomerQueryWindow2=new Ext.Window({
		title : '客户经理列表',
		closable : true,
		plain : true,
		resizable : false,
		collapsible : false,
		height:300,
		width:450,
		draggable : true,
		closeAction : 'hide',
		modal : true, // 模态窗口 
		//animCollapse : false,
		border : false,
		//maximized:true,
		//maximizable: true,
		autoScroll : true,
		autoHeight : true,
		closable : true,
		animateTarget : Ext.getBody(),
		constrain : true,
		items : [oCustomerQueryGrid2],
		buttonAlign:'center',
		buttons:[{
			text:'确定',
				handler:function()
				{
			var json={'aId':[]};
			var sName='';
			var checkedNodes = oCustomerQueryGrid2.getSelectionModel().selections.items;
			if(oThisSearchField2.singleSelected&&checkedNodes.length>1)
			{
				Ext.Msg.alert('提示', '您只能选择一个客户经理');
				return ;
			}
			
			for(var i=0;i<checkedNodes.length;i++)
			{
				json.aId.push(checkedNodes[i].data.USERID);
				if(i==0){
					sName=sName+checkedNodes[i].data.USERNAME;
				}
				else{
					sName=sName+','+checkedNodes[i].data.USERNAME;
				}
			}
				oThisSearchField2.userId=json;
				oThisSearchField2.setRawValue(sName);
				oCustomerQueryWindow2.hide();
			if (typeof oThisSearchField2.callback == 'function') {
					 oThisSearchField2.callback();
				   
				      }
				}
			},{
			text: '取消',
				handler:function(){
				oCustomerQueryWindow2.hide();
					}
					}]	
		});
	oCustomerQueryStore2.load();
	oCustomerQueryWindow2.show();
    return;
    }
});

Ext.ux.form.CustomerQueryField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    singleSelected:false,
    callback:false,
    customerId:'', 
    custtype :'',//10：对私, 20:对公, 30:金融
    certType:'',
    certNum:'',
    mobileNum:'',
    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',



    onTrigger2Click : function(){
    	if(this.disabled){
    		return;
    	}
    	var oThisSearchField=this;
    	
    	var boxstore = new Ext.data.Store({  
    		restful:true,   
    		autoLoad :true,
    		proxy : new Ext.data.HttpProxy({
    				url :basepath+'/lookup.json?name=XD000080'
        
    				
    			}),
    			reader : new Ext.data.JsonReader({
    				root : 'JSON'
    			}, [ 'key', 'value' ])
    		});
    	var boxstore8 = new Ext.data.Store({  
    		sortInfo: {
    	    field: 'key',
    	    direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
    	},
    		restful:true,   
    		autoLoad :true,
    		proxy : new Ext.data.HttpProxy({
    				url :basepath+'/lookup.json?name=P_CUST_GRADE'
    			}),
    			reader : new Ext.data.JsonReader({
    				root : 'JSON'
    			}, [ 'key', 'value' ])
    		});
    	Ext.override(Ext.form.ComboBox, {
  	      onViewClick : function(doFocus) {
  	        var index = this.view.getSelectedIndexes()[0], s = this.store, r = s.getAt(index);
  	        if (r) {
  	          this.onSelect(r, index);
  	        } else if (s.getCount() === 0) {
  	          this.collapse();
  	              
  	        }
  	        if (doFocus !== false) {
  	          this.el.focus();
  	        }
  	      }
  	    });	 
  	 //递归收起子节点
  	 function childCollapse(node){
  	 	 node.eachChild(function(currNode)
  	 	 {
  	 	 	if(!currNode.isLeaf())
  	 	 	{
  		 	 	currNode.collapse();		 	 	         
  		 	 	childCollapse(currNode);
  	 	 	}
  	 	 }
  	 	 );
  	 }
  	//归属机构编号
	 function checkId(orgTreePanel_p){
		 	var checkIdString="";
		 	if(orgTreePanel_p.root.getUI().isChecked()){
		 		var rootId = orgTreePanel_p.root.childNodes[0].attributes.SUPERUNITID;
		 		var text = orgTreePanel_p.root.text;
		 		checkIdString = checkIdString+rootId+";";
//		 		return checkIdString;	 		
		 	}	 	
		 	var level2Nodes = orgTreePanel_p.root.childNodes;
		 	var level3Nodes = new Array();
		 	var level4Nodes = new Array();
		 	var level2NodesChecked = new Array();
		 	var level3NodesChecked = new Array();
		 	for(var i=0;i<level2Nodes.length;i++){
		 		var tempNode = level2Nodes[i];
		 		if(tempNode.getUI().isChecked()){
		 			checkIdString  = checkIdString + tempNode.attributes.UNITID+";";
		 			level2NodesChecked[level2NodesChecked.length] = tempNode;
		 		}
		 		tempNode.eachChild(function(currNode){
		 			level3Nodes[level3Nodes.length] = currNode;
		 		});
		 	}
		 	
		 	for(var j=0;j<level3Nodes.length;j++){
		 		
		 		var anode = level3Nodes[j];
				
		 		if(anode.getUI().isChecked())
		 		{
		 			var flag= false;
			 		for(var k=0;k<level2NodesChecked.length;k++){
			 			
			 			if(anode.parentNode ==level2NodesChecked[k] ){
			 				flag=true;
			 				break;
			 			}	
			 		}
			 		if(!flag){
			 			checkIdString  = checkIdString + anode.attributes.UNITID+";";
			 		}		 		
			 		level3NodesChecked[level3NodesChecked.length] = anode;
		 		}
		 		
		 		anode.eachChild(function(childNode){	 			
		 			level4Nodes[level4Nodes.length] = childNode;	 			
		 		});	 		
		 	}
		 	for(var m=0;m<level4Nodes.length;m++){
		 		var node4 = level4Nodes[m];
		 		if(node4.getUI().isChecked()){
		 			var flag = false;
		 			for(var n=0;n<level3NodesChecked.length;n++){
						if(node4.parentNode == level3NodesChecked[n]){
							flag = true;
							break;
						}					
		 			}	 			
		 			if(!flag){
		 				checkIdString  = checkIdString + node4.attributes.UNITID+";";	 			
		 			}
		 		}	 	
		 	}
			var lastIndex = checkIdString.lastIndexOf(";");
			checkedIdString = checkIdString.substring(0,lastIndex);		
			return checkedIdString;
		 }
	//归属机构名称
  	 function checkText(orgTreePanel_p){
  	 	
  	 	var checkTextString="";
  	 	if(orgTreePanel_p.root.getUI().isChecked()){
  	 		var rootId = orgTreePanel_p.root.id;
  	 		var text = orgTreePanel_p.root.text;
  	 		checkTextString = checkTextString+text+";";
//  	 		return checkTextString;	 		
  	 	}	 	
  	 	var level2Nodes = orgTreePanel_p.root.childNodes;
  	 	var level3Nodes = new Array();
  	 	var level4Nodes = new Array();
  	 	var level2NodesChecked = new Array();
  	 	var level3NodesChecked = new Array();
  	 	for(var i=0;i<level2Nodes.length;i++){
  	 		var tempNode = level2Nodes[i];
  	 		if(tempNode.getUI().isChecked()){
  	 			checkTextString  = checkTextString + tempNode.text+";";
  	 			level2NodesChecked[level2NodesChecked.length] = tempNode;
  	 		}
  	 		tempNode.eachChild(function(currNode){
  	 			level3Nodes[level3Nodes.length] = currNode;
  	 		});
  	 	}
  	 	
  	 	for(var j=0;j<level3Nodes.length;j++){
  	 		
  	 		var anode = level3Nodes[j];
  			
  	 		if(anode.getUI().isChecked())
  	 		{
  	 			var flag= false;
  		 		for(var k=0;k<level2NodesChecked.length;k++){
  		 			
  		 			if(anode.parentNode ==level2NodesChecked[k] ){
  		 				flag=true;
  		 				break;
  		 			}	
  		 		}
  		 		if(!flag){
  		 			checkTextString  = checkTextString + anode.text+";";
  		 		}		 		
  		 		level3NodesChecked[level3NodesChecked.length] = anode;
  	 		}
  	 		
  	 		anode.eachChild(function(childNode){	 			
  	 			level4Nodes[level4Nodes.length] = childNode;	 			
  	 		});	 		
  	 	}
  	 	for(var m=0;m<level4Nodes.length;m++){
  	 		var node4 = level4Nodes[m];
  	 		if(node4.getUI().isChecked()){
  	 			var flag = false;
  	 			for(var n=0;n<level3NodesChecked.length;n++){
  					if(node4.parentNode == level3NodesChecked[n]){
  						flag = true;
  						break;
  					}					
  	 			}	 			
  	 			if(!flag){
  	 				checkTextString  = checkTextString + node4.text+";";	 			
  	 			}
  	 		}	 	
  	 	}
  		var lastIndex = checkTextString.lastIndexOf(";");
  		checkedTextString = checkTextString.substring(0,lastIndex);		
  		return checkedTextString;
  	 }
  	
  	 var orgTreePanel = new Ext.tree.TreePanel(
  			 	{	 	
  			 	id :'orgTreePanel',
  			 	autoScroll:true,
  			 	height:350,
  			 	width:200,
  				listeners:{
//  					'click':function(node)
//  					{
//  						if(node.getUI().isChecked())
//  						{
//  							node.getUI().toggleCheck(false);
//  						}else
//  						{
//  							node.getUI().toggleCheck(true);
//  						}
//  						
//  						
//  					},
  					'checkchange':function(node,checked){
  						if(checked){					
  							var childNodes = node.childNodes;
  							for(var i=0;i<childNodes.length;i++){
  								childNodes[i].getUI().toggleCheck(true);					
  							}
  						}				
  						else
  						{	
  							var childNodes = node.childNodes;
  							for(var i=0;i<childNodes.length;i++){						
  								childNodes[i].getUI().toggleCheck(false);
  							}
  						}			
  					},
  					'dblclick':function(node){
  						if(node.getUI().isChecked() ){
  							node.getUI().toggleCheck(false);			
  						}else
  						{
  							node.getUI().toggleCheck(true);	
  						}
  					}			
  				},
  				root:new Ext.tree.AsyncTreeNode({
  					//id:orgId,
  					//text:orgName,		
  					text:JsContext._unitname,
  					autoScroll:true,
  					expanded:true,
  					leaf:false,
  					checked:false,
  					loader:new Ext.tree.TreeLoader({
  						url:basepath+'/system-unit-recursive.json',
  						requestMethod:'GET',
  						listeners:{
  							'load':function(){
  								var rootNode = orgTreePanel.root;
  								rootNode.eachChild(function(node){
  									if(!node.isLeaf()){
  										node.collapse();
  										childCollapse(node);
  									}
  								});						
  							}
  						}
  					})
  				}),
  				animate : false,
  				useArrows : false,
  				border : false
  			 }
  	);
  	var instnCombo = new Ext.form.ComboBox({
  		xtype:'combo',					
  		store : new Ext.data.SimpleStore( {
  			fields : [],
  			data : [ [] ]
  		}),
  		name:'orgId',
  		emptyText : '',
  		resizable :true,
          labelStyle: 'text-align:right;',
  		fieldLabel : '归属机构',
  		anchor : '90%',
  		editable:false,
  		mode : 'local',
  		triggerAction : 'all',
  		maxHeight : 390,
  		// 下拉框的显示模板,addDeptTreeDiv作为显示下拉树的容器
  		tpl:"<tpl for='.' <div style='height:390px' ><div id = 'addOrgTreeDivForAdd2'></div></div></tpl>",
  		onSelect : Ext.emptyFn,
  		listeners:{
  			'expand':function(combo){	
  				orgTreePanel.render('addOrgTreeDivForAdd2');
  			},
  			'collapse':function(combo){
  				var checkedString = checkText(orgTreePanel);
  				combo.setValue(checkedString);
  				var checkedId = checkId(orgTreePanel);
  				oCustomerQueryForm.getForm().findField("instncode").setValue(checkedId);
  			}
  		}
  	});			
	
	var oCustomerQueryForm = new Ext.form.FormPanel({
			//labelWidth : 90, // 标签宽度
			frame : true, //是否渲染表单面板背景色
			labelAlign : 'middle', // 标签对齐方式
			//bodyStyle : 'padding:3 5 0', // 表单元素和表单面板的边距
			buttonAlign : 'center',
			height : 97,
			width : 1000,
			items : [{
				layout : 'column',
				border : false,
				items : [{
							columnWidth : .25,
							layout : 'form',
							labelWidth : 80, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [  {
								fieldLabel : '客户号',
								name : 'CUST_ID',
								xtype : 'textfield', // 设置为数字输入框类型
								labelStyle: 'text-align:right;',
								anchor : '90%'
							},new Ext.form.ComboBox({
								hiddenName : 'CUST_TYP',
								fieldLabel : '客户类型',
								labelStyle: 'text-align:right;',
								triggerAction : 'all',
								store : boxstore,
								displayField : 'value',
								valueField : 'key',
								mode : 'local',
								forceSelection : true,
								typeAhead : true,
								emptyText:'请选择',
								resizable : true,
								anchor : '90%'
							})
								]
						}, {
							columnWidth : .25,
							layout : 'form',
							labelWidth: 100, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [{
								fieldLabel : '客户名称',
								name : 'CUST_ZH_NAME',
								xtype : 'textfield', // 设置为数字输入框类型
								labelStyle: 'text-align:right;',
								anchor : '90%'
							},new Ext.ux.form.CustMgrField({ 
								fieldLabel : '所属客户经理', 
								labelStyle: 'text-align:right;',
								id:'rel_CUST_MANAGER',
								name : 'CUST_MANAGER',
								//store: store, 
								//singleSelected:true,
								anchor : '90%',
								callback: function() {
							}  
								})]
						}, {
							columnWidth : .25,
							layout : 'form',
							labelWidth : 80, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [{
								fieldLabel : '证件号码',
								name : 'CERT_NUM',
								xtype : 'textfield', // 设置为数字输入框类型
								labelStyle: 'text-align:right;',
								anchor : '90%'
							},new Ext.form.ComboBox({
								hiddenName : 'CUST_LEV',
								fieldLabel : '客户级别',
								labelStyle: 'text-align:right;',
								triggerAction : 'all',
								store : boxstore8,
								displayField : 'value',
								valueField : 'key',
								mode : 'local',
								forceSelection : true,
								typeAhead : true,
								emptyText:'请选择',
								resizable : true,
								anchor : '90%'
							})
							]
						}, {
							columnWidth : .25,
							layout : 'form',
							labelWidth : 80, // 标签宽度
							defaultType : 'textfield',
							border : false,
							items : [instnCombo,
							         {
								fieldLabel : '机构号码',
								name : 'instncode',
								hidden: true,
								xtype : 'textfield',
								readOnly: true,
								labelStyle: 'text-align:right;',
								anchor : '90%'
							},
					         {
								fieldLabel : '所属客户经理ID',
								id: 'custMgrId',
								name : 'custMgrId',
								hidden: true,
								xtype : 'textfield',
								readOnly: true,
								labelStyle: 'text-align:right;',
								anchor : '90%'
							}]
						}]
			}],
			listeners :{
					'render':function(){
						var custtype = oThisSearchField.custtype;
						if(custtype!=''&&(custtype=='1'||custtype=='2')){
							debugger;
								oCustomerQueryForm.form.findField('CUST_TYP').setValue(custtype);
								oCustomerQueryForm.form.findField('CUST_TYP').setReadOnly(true);
						}else {
								oCustomerQueryForm.form.findField('CUST_TYP').setReadOnly(false);
						}
						
					}
			},
		buttons : [{
					text : '查询',
					handler : function() {
						
					oCustomerQueryStore.on('beforeload', function() {
				        	var conditionStr =  oCustomerQueryForm.getForm().getValues(false);
				        	
				        	
				            this.baseParams = {
				                    "condition":Ext.encode(conditionStr)
				                    
				            };
					});
				        var userId=Ext.getCmp('rel_CUST_MANAGER').userId;
						Ext.getCmp('custMgrId').setValue(userId.aId);
						oCustomerQueryStore.reload({
							  params : {
			                     start : 0,
			                     limit : oCustomerQueryBbar.pageSize}});
				   }}, {
							text : '高级查询',
								handler : function() {
								}
							},{
							text : '重置',
							     handler : function() {
								oCustomerQueryForm.getForm().reset();   
								}
							}]
		});
						 //复选框
	var sm = new Ext.grid.CheckboxSelectionModel();

	// 定义自动当前页行号
	var rownum = new Ext.grid.RowNumberer({
				header : 'No.',
				width : 28
			});
	// 定义列模型
	var cm = new Ext.grid.ColumnModel([rownum,sm, 
        {header : '客户号',dataIndex : 'CUST_ID',sortable : true,width : 150},
	    {header : '客户名称',dataIndex : 'CUST_ZH_NAME',width : 200,sortable : true},
	    {header : '证件类型',dataIndex : 'CERT_TYPE_ORA',width : 150,sortable : true},
	    {header : '证件号码',dataIndex : 'CERT_NUM',width : 150,sortable : true},
	    {header : '客户类型',dataIndex : 'CUST_TYP',width : 200,sortable : true,hidden:true},
	    {header : '客户类型',dataIndex : 'CUST_TYP_ORA',width : 200,sortable : true},
	    {header : '客户级别',dataIndex : 'CUST_LEV_ORA',width : 200,sortable : true},
	    {header : '主办机构',dataIndex : 'INSTITUTION_NAME',sortable : true},
	    {header : '主办客户经理',dataIndex : 'MGR_NAME',width : 150,sortable : true},
	    {header : '联系电话',dataIndex : 'LINK_PHONE',width : 150,sortable : true,hidden : true}
			]);

	/**
	 * 数据存储
	 */
	 var oCustomerQueryStore = new Ext.data.Store({
					restful:true,	
			        proxy : new Ext.data.HttpProxy({url:basepath+'/customerBaseInformation.json'
			     /* ,
			        	success : function(response) {
							Ext.Msg.alert('提示', response.responseText);
						}*/
			        }),
			       reader: new Ext.data.JsonReader({
			       totalProperty : 'json.count',
			        root:'json.data'
			        }, [
			        	{name: 'CUST_ID'},
						{name: 'CUST_ZH_NAME'},
						{name: 'CERT_TYPE_ORA'},
						{name: 'CUST_TYP'},
						{name: 'CUST_TYP_ORA'},
						{name: 'CUST_LEV_ORA'},
//						{name: 'EN_ABBR'},
						{name: 'INSTITUTION_NAME'},
//						{name: 'BGN_DT'},
						{name: 'MGR_NAME'},
						{name: 'CERT_NUM'},
						{name: 'LINK_PHONE'}
					])
				});

	var oPagesizeCombo = new Ext.form.ComboBox({
         name : 'pagesize',
         triggerAction : 'all',
         mode : 'local',
         store : new Ext.data.ArrayStore({
             fields : ['value', 'text'],
             data : [ [ 10, '10条/页' ], [ 20, '20条/页' ], [ 50, '50条/页' ],
						[ 100, '100条/页' ], [ 250, '250条/页' ],
						[ 500, '500条/页' ] ]
         }),
         valueField : 'value',
         displayField : 'text',
         value : '20',
         editable : false,
         width : 85
     });
    var number = parseInt(oPagesizeCombo.getValue());
    oPagesizeCombo.on("select", function(comboBox) {
    	oCustomerQueryBbar.pageSize = parseInt(oPagesizeCombo.getValue()),
    	oCustomerQueryStore.load({
					params : {
						start : 0,
						limit : parseInt(oPagesizeCombo.getValue())
					}
				});
	});
	var oCustomerQueryBbar = new Ext.PagingToolbar({
        pageSize : number,
        store : oCustomerQueryStore,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        emptyMsg : "没有符合条件的记录",
        items : ['-', '&nbsp;&nbsp;', oPagesizeCombo
                 ]
    });
		// 表格实例
	var oCustomerQueryGrid = new Ext.grid.GridPanel({
		height : 275,
		width:1000,
				id:'viewgrid',
				frame : true,
				autoScroll : true,
				store : oCustomerQueryStore, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm, // 列模型
				sm : sm, // 复选框
				//tbar : tbar, // 表格工具栏
				bbar:oCustomerQueryBbar,
				viewConfig:{
					   forceFit:false,
					   autoScroll:true
					},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

	var oCustomerQueryWindow=new Ext.Window({
		title : '客户查询',
		closable : true,
		resizable : false,
		collapsible : false,
		height:435,
		width:1013,
		draggable : true,
		closeAction : 'close',
		modal : true, // 模态窗口 
		animCollapse : false,
		border : false,
		//maximized:true,
		//maximizable: true,
		closable : true,
		animateTarget : Ext.getBody(),
		constrain : true,
		listeners : {
				'show':function(){
						oCustomerQueryForm.form.reset();
				},
				'hide' : function() {
					if (Ext.getCmp('rel_CUST_MANAGER')) {
						Ext.getCmp('rel_CUST_MANAGER').destroy();
					}
					if (Ext.getCmp('orgTreePanel')) {
						Ext.getCmp('orgTreePanel').destroy();
					}
				}

			},
		items : [oCustomerQueryForm,oCustomerQueryGrid],
		buttonAlign:'center',
		buttons:[{
			text:'确定',
				handler:function()
				{
			var json={'aId':[]};
			var json2={'type':[]};
			var json3={'certtyp':[]};
			var json4={'certnum':[]};
			var json5={'mobilenum':[]};
			var sName='';
			var checkedNodes = oCustomerQueryGrid.getSelectionModel().selections.items;
			if(oThisSearchField.singleSelected&&checkedNodes.length>1)
			{
				Ext.Msg.alert('提示', '您只能选择一个客户');
				return ;
			}
			
			for(var i=0;i<checkedNodes.length;i++)
			{
				json.aId.push(checkedNodes[i].data.CUST_ID);
				json2.type.push(checkedNodes[i].data.CUST_LEV_ORA);
				json3.certtyp.push(checkedNodes[i].data.CERT_TYPE_ORA);
				json4.certnum.push(checkedNodes[i].data.CERT_NUM);
				json5.mobilenum.push(checkedNodes[i].data.LINK_PHONE);
				if(i==0){
					sName=sName+checkedNodes[i].data.CUST_ZH_NAME;
				}
				else{
					sName=sName+','+checkedNodes[i].data.CUST_ZH_NAME;
				}
			}
				oThisSearchField.customerId=json;
				oThisSearchField.custtype=json2;
				oThisSearchField.certType=json3;
				oThisSearchField.certNum=json4;
				oThisSearchField.mobileNum=json5;
//				alert(sName);
				oThisSearchField.setRawValue(sName);
				oCustomerQueryWindow.close();
				 if (typeof oThisSearchField.callback == 'function') {
					 oThisSearchField.callback();
				   
				      }
				}
			},{
			text: '取消',
				handler:function(){
				oCustomerQueryWindow.close();
					}
					}]	
		});
	oCustomerQueryWindow.show();
    return;
    }
});
//Ext.ns('Ext.ux.form');
Ext.ux.form.ProdMgrField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },
    singleSelected:false,
    callback:false,
    userId:'',
    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',
    
    onTrigger2Click : function(){
    	var oThisSearchField2=this;
		
		//复选框
		var sm2 = new Ext.grid.CheckboxSelectionModel();
		// 定义自动当前页行号
		var rownum2 = new Ext.grid.RowNumberer({header : 'No.',width : 28});
		// 定义列模型
		var cm2 = new Ext.grid.ColumnModel([rownum2,sm2, 
		        {header : '产品编号 ',dataIndex : 'PRODUCT_ID',sortable : true,width : 150},
			    {header : '产品名称 ',dataIndex : 'PROD_NAME',width : 200,sortable : true}
		]);
		/**
		 * 数据存储
		 */
		 var prodQueryStore = new Ext.data.Store({
			autoLoad :true,
			restful:true,	
	        proxy : new Ext.data.HttpProxy({
	        	url:basepath+'/commsearch.json?condition='+Ext.encode({searchType : 'PRODUCTINFO'})
	        	//params:{ condition:Ext.encode({searchType:'ORGUSER'}) }		//参数'ORGUSER'为获取当前机构的客户经理
	        }),
	       reader: new Ext.data.JsonReader({
	    	   root:'json.data'
	       }, [{name: 'PRODUCT_ID'},{name: 'PROD_NAME'}])
		});
		 
		 var prodmgrSearch = new Ext.form.FormPanel({
				labelWidth : 90, // 标签宽度
				frame : true, // 是否渲染表单面板背景色
				labelAlign : 'right', // 标签对齐方式
				buttonAlign : 'center',
//				height:120,
				items:[{
					layout : 'column',
					items : [ {
					columnWidth : .5,
					layout : 'form',
					items : [ {
//					id:'useridsearch',
					xtype:'textfield',
					fieldLabel:'产品编号',
					anchor : '90%',
					name:'productId'
				}]},{columnWidth : .5,
					layout : 'form',
					items : [ {
//					id:'usernamesearch',
					xtype:'textfield',
					fieldLabel:'产品名称',
					anchor : '90%',
					name:'prodName'
				}]}]}],
				buttons:[{
					text:'查询',
					handler:function(){
					
					prodQueryStore.load(
							{
								params:{
								prodBusIdSearch:prodmgrSearch.getForm().findField('productId').getValue(),
								prodNameSearch:prodmgrSearch.getForm().findField('prodName').getValue()
							}
								
							});
				}
				},{
					text:'重置',
					handler:function(){
					prodmgrSearch.getForm().reset();
				}
				}]
				});
	 
	var oPagesizeCombo3 = new Ext.form.ComboBox({
         name : 'pagesize',
         triggerAction : 'all',
         mode : 'local',
         store : new Ext.data.ArrayStore({
             fields : ['value', 'text'],
             data : [ [100, '100条/页'], [200, '200条/页'], [500, '500条/页'], [1000, '1000条/页']]
         }),
         valueField : 'value',
         displayField : 'text',
         value : '50',
         editable : false,
         width : 85
     });
    var number2 = parseInt(oPagesizeCombo3.getValue());
    
	var oCustomerQueryBbar3 = new Ext.PagingToolbar({
        pageSize : number2,
        store : prodQueryStore,
        displayInfo : true,
        displayMsg : '显示{0}条到{1}条,共{2}条',
        emptyMsg : "没有符合条件的记录",
        items : ['-'
                 //oPagesizeCombo     设置每页几条记录
                ]
    });
	
	oPagesizeCombo3.on("select", function(comboBox) {
    	oCustomerQueryBbar3.pageSize = parseInt(oPagesizeCombo3.getValue()),
    	prodQueryStore.load({
			params : {
				start : 0,
				limit : parseInt(oPagesizeCombo3.getValue())
			}
		});
	});
	
	// 表格实例
	var prodInfoQueryGrid = new Ext.grid.GridPanel({
		height : 275,
		//width:1000,
				id:'viewgrid',
				frame : true,
				autoScroll : true,
				store : prodQueryStore, // 数据存储
				stripeRows : true, // 斑马线
				cm : cm2, // 列模型
				sm : sm2, // 复选框
				//tbar : tbar, // 表格工具栏
				bbar:oCustomerQueryBbar3,
				viewConfig:{
					   forceFit:false,
					   autoScroll:true
					},
				loadMask : {
					msg : '正在加载表格数据,请稍等...'
				}
			});

	var prodInfoQueryWindow2=new Ext.Window({
		title : '产品列表',
		closable : true,
		plain : true,
		resizable : false,
		collapsible : false,
		height:300,
		width:450,
		draggable : true,
		closeAction : 'hide',
		modal : true, // 模态窗口 
		//animCollapse : false,
		border : false,
		//maximized:true,
		//maximizable: true,
		autoScroll : true,
		autoHeight : true,
		closable : true,
		animateTarget : Ext.getBody(),
		constrain : true,
		items : [prodmgrSearch,prodInfoQueryGrid],
		buttonAlign:'center',
		buttons:[{
			text:'确定',
				handler:function()
				{
			var json={'aId':[]};
			var sName='';
			var checkedNodes = prodInfoQueryGrid.getSelectionModel().selections.items;
			if(oThisSearchField2.singleSelected&&checkedNodes.length>1)
			{
				Ext.Msg.alert('提示', '您只能选择一个产品');
				return ;
			}
			
			for(var i=0;i<checkedNodes.length;i++)
			{
				json.aId.push(checkedNodes[i].data.PRODUCT_ID);
				if(i==0){
					sName=sName+checkedNodes[i].data.PROD_NAME;
				}
				else{
					sName=sName+','+checkedNodes[i].data.PROD_NAME;
				}
			}
				oThisSearchField2.productId=json;
				oThisSearchField2.setRawValue(sName);
				prodInfoQueryWindow2.hide();
			if (typeof oThisSearchField2.callback == 'function') {
					 oThisSearchField2.callback();
				   
				      }
				}
			},{
			text: '取消',
				handler:function(){
				prodInfoQueryWindow2.hide();
					}
					}]	
		});
	prodQueryStore.load();
	prodInfoQueryWindow2.show();
    return;
    }
});