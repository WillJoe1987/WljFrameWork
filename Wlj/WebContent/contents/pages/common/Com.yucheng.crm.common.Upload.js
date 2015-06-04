var _tempFileName = "";
var _annaSize = 0;
var uploadForm = new Ext.FormPanel({
    height : 200,
    width : '100%',
    title:'文件上传',
    fileUpload : true, 
    dataName:'file',
    frame:true,
    trackResetOnLoad:true,
    approval:'',/**附件审核标识*/
    relaId:'',/**关联数据ID*/
    modinfo:'notice',/**modinfo: notice:公告;customer:客户;infomation:资讯;*/
    storeName:false,
    items: [],
    buttons : [{
            text : '上传文件',
            handler : function() {
            	var _this = this;
                var mods = this.ownerCt.ownerCt.modinfo;
                var reins = this.ownerCt.ownerCt.relaId;
                var approval = this.ownerCt.ownerCt.approval;
                if(mods==undefined ||mods==''){
                    Ext.MessageBox.alert('Debugging！','You forgot to define the modinfo for the upload form!');
                    return false;
                }
                //判定，在未选择附件而点击上传时，给出提示
                var fieldName = uploadForm.form.findField('annexeName').getValue();
                if(fieldName ==''||fieldName ==undefined){
                	Ext.Msg.alert('系统提示','请选择附件!');
                	return false;
                }
                if (this.ownerCt.ownerCt.getForm().isValid()){
                    this.ownerCt.ownerCt.ownerCt.hide();
                    this.ownerCt.ownerCt.getForm().submit({
                        url : basepath + '/FileUpload',
                        waitMsg : '正在保存数据,请等待...', // 显示读盘的动画效果，执行完成后效果消失
                        success : function(form,o){
                            _tempFileName = Ext.util.JSON.decode(o.response.responseText).realFileName;
                            var fileName =form.items.items[0].getValue();
                            var simpleFileName = fileName.substring(fileName.lastIndexOf("\\")+1, fileName.length);
                            var a = simpleFileName.split(".");
                            if(a.length<=1){
                            	Ext.Msg.alert('提示','上传文件格式错误，如XXX.txt等!');
                            	return false;
                            }
                            if(a[a.length-1].toLowerCase() != 'txt' && a[a.length-1].toLowerCase() !='doc' && a[a.length-1].toLowerCase()!='docx'
                            	&& a[a.length-1].toLowerCase()!='xls' && a[a.length-1].toLowerCase()!='xlsx'
                            	&& a[a.length-1].toLowerCase()!='pdf' && a[a.length-1].toLowerCase()!='ppt' ){
                            	Ext.Msg.alert('提示','只能上传txt、office等文件!');
                            	return false;
                            }
                            Ext.Ajax.request({
                                url: basepath+'/UploadStatus',
                                method:'GET',
                                success:function(response,d){
                                    eval(response.responseText);
                                    Ext.Ajax.request({
                                        url:basepath+'/workplatannexe.json',
                                        method:'POST',
                                        params: {
                                            relationInfo : reins,
                                            annexeName : simpleFileName,
                                            relationMod : mods,
                                            physicalAddress : _tempFileName,
                                            annexeSize : _annaSize,
                                            approval:approval
                                        },
                                        success : function(a,b){
                                            var condi = {};
                                            condi['relationInfo'] = reins;
                                            condi['relationMod'] = mods;
                                            Ext.Ajax.request({
                                                url:basepath+'/queryanna.json',
                                                method : 'GET',
                                                params : {
                                                    "condition":Ext.encode(condi)
                                                },
                                                failure : function(){
                                                    Ext.MessageBox.alert('查询异常', '查询失败！');
                                                },
                                                success : function(response){
                                                    var anaExeArray = Ext.util.JSON.decode(response.responseText);
                                                    var storeName = _this.ownerCt.ownerCt.storeName?_this.ownerCt.ownerCt.storeName:false;
                                                    if(storeName){
                                                    	storeName.loadData(anaExeArray.json.data);
                                                    }else{
                                                    	appendixStore.loadData(anaExeArray.json.data);
                                                    }
                                                    //暂时注释掉，解决营销活动上传附件至附件列表时执行refresh找不到this.grid
                                                    //appendixGridPanel.getView().refresh();
                                                }
                                            });
                                        },
                                        failure : function(a,b){}
                                    });
                                   
                                },
                                failure:function(a,b){
                                }
                            });
                        },
                        failure : function(form, o){
                        	if(o.result.reason=="SizeLimitExceeded")
                                Ext.Msg.alert('操作提示','文件上传失败,文件超出最大限制!');
                        	else
                        		 Ext.Msg.alert('操作提示','文件上传失败!');
                        }
                    });
                }
            }
        }]

});
var uploadWindow = new Ext.Window({     
    width : 700,
    height : 250,
    closeAction:'hide',
    items : [uploadForm]
});
uploadWindow.on('show',function(upWindow){
	if(Ext.getCmp('littleup')){
		uploadForm.remove(Ext.getCmp('littleup'));
	}
	uploadForm.removeAll(true);
	uploadForm.add(new Ext.form.TextField({
        xtype : 'textfield',
        id:'littleup',
        name:'annexeName',
        inputType:'file',
        fieldLabel : '附件名称',
        anchor : '90%'
    }));
	uploadForm.doLayout();
});
 var _anaExeProxy = new Ext.data.HttpProxy({
     url : basepath+'/workplatannexe!findAna.json'
 });
 var anaExeRocordType = Ext.data.Record.create([
     {name: 'annexeId', mapping: 'ANNEXE_ID'},
     {name: 'annexeName', mapping: 'ANNEXE_NAME'},                                   
     {name: 'annexeServerName', mapping: 'ANNEXE_SER_NAME'},  
     {name: 'annexeSize', mapping: 'ANNEXE_SIZE'},
     {name: 'annexeType', mapping: 'ANNEXE_TYPE'},
     {name: 'clientName', mapping: 'CLIENT_NAME'},
     {name: 'createTime', mapping: 'CREATE_TIME'},
     {name: 'lastLoadTime', mapping: 'LAST_LOAD_TIME'},
     {name: 'lastLoader', mapping: 'LAST_LOADER'},
     {name: 'loadCount', mapping: 'LOAD_COUNT'},
     {name: 'physicalAddress', mapping: 'PHYSICAL_ADDRESS'},
     {name: 'relationInfo', mapping: 'RELATION_INFO'},
     {name: 'relationMod', mapping:'RELATIOIN_MOD'}
]);
var columnAppendix = new Ext.grid.ColumnModel({//附件table列
    columns:[{
        header:"附件ID",
        dataIndex:'annexeId',
        sortable: true,
        id:'annexeId'
    },
    {
        header:'附件名称',
        dataIndex:'annexeName',
        sortable: true,
        id:'annexeName'
    },
    {
        header:'附件大小(字节)',
        dataIndex:'annexeSize',
        sortable: true,
        id:'annexeSize'
    },
    {
        header:'下载次数',
        dataIndex:'loadCount',
        sortable: true,
        id:'loadCount'
    },
    {
        header:'附件上传时间',
        dataIndex:'createTime',
        sortable: true,
        id:'createTime'
    },
    {
        header:'最近下载时间',
        dataIndex:'lastLoadTime',
        sortable: true,
        id:'lastLoadTime'
    },
    {
        header:'最近下载者姓名',
        dataIndex:'lastLoader',
        sortable: true,
        id:'lastLoader'
    },{
        header:'物理文件名',
        dataIndxe:'physicalAddress',
        sortable: true,
        hidden:true
    }]
});
var appendixReader = new Ext.data.JsonReader({//读取附件数据的 reader
    successProperty: 'success',
    idProperty: 'annexeId',
    messageProperty: 'message'
},anaExeRocordType);

var writerAna = new Ext.data.JsonWriter({
    encode: false
});

var appendixStore = new Ext.data.Store({//读取附件数据的store
    id: 'notice',
    restful : true,     
    proxy : _anaExeProxy,
    reader : appendixReader,
    writer : writerAna,
    recordType:anaExeRocordType
});
var appendixGridPanel = new Ext.grid.GridPanel({//附件table
    title:'附件列表',
    cm:columnAppendix,
    tbar:[{
        text:'下载',
        handler:function()
        {
            var record = appendixGridPanel.getSelectionModel().getSelected(); 
            if (!record) {
                Ext.MessageBox.alert('查询操作', '请选择要操作的数据！');
                return false;
            }
           var annexeName = record.get('annexeName');
           var fileNameStr = record.get('physicalAddress');
           var noticeIdStr = record.get('annexeId');
           window.open( basepath+'/AnnexeDownload?filename='+fileNameStr+'&annexeName='+annexeName,'', 'height=100, width=200, top=300, left=500, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
           Ext.Ajax.request({
               url : basepath + '/workplatannexe.json',
               method : 'POST',
               params : {
                   annexeId : noticeIdStr
               },
               success : function(a,b){
                   var mods = uploadForm.modinfo;
                   var reins = uploadForm.relaId;

                   var condi = {};
                   condi['relationInfo'] = reins;
                   condi['relationMod'] = mods;
                   Ext.Ajax.request({
                       url:basepath+'/queryanna.json',
                       method : 'GET',
                       params : {
                           "condition":Ext.encode(condi)
                       },
                       failure : function(){
                           Ext.MessageBox.alert('查询异常', '查询失败！');
                       },
                       success : function(response){
                           var anaExeArray = Ext.util.JSON.decode(response.responseText);
                           appendixStore.loadData(anaExeArray.json.data);
                           appendixGridPanel.getView().refresh();
                       }
                   });
               
               },
               failure : function(a,b){}
           });
        }
    },{
        id:'__upload',
        text:'上传',
        handler:function(){
            uploadWindow.show();
       	}},{
            id:'__del',
            text:'删除',
            handler:function(){
        	var selectLength = appendixGridPanel.getSelectionModel().getSelections().length;
			if(selectLength != '1'){
				Ext.MessageBox.alert('提示','请选择一条记录.');
				return;
			}
			Ext.Msg.confirm('提示','确定要删除么?',function(btn){
				if(btn == 'yes'){
					var selectRe = appendixGridPanel.getSelectionModel().getSelections()[0];
					var id = selectRe.data.annexeId;
					Ext.Ajax.request({
						url : basepath + '/workplatannexe/1.json?annexeId='+id,
						method : 'DELETE',
						success : function(){
						Ext.MessageBox.alert('提示','删除成功！');
						var mods = uploadForm.modinfo;
						var reins = uploadForm.relaId;
						var condi = {};
						condi['relationInfo'] = reins;
						condi['relationMod'] = mods;
						Ext.Ajax.request({
							url:basepath+'/queryanna.json',
							method : 'GET',
							params : {
							"condition":Ext.encode(condi)
						},
						failure : function(){
							Ext.MessageBox.alert('查询异常', '查询失败！');
						},
						success : function(response){
							var anaExeArray = Ext.util.JSON.decode(response.responseText);
							appendixStore.loadData(anaExeArray.json.data);
							appendixGridPanel.getView().refresh();
						}
						});
					},
					failure : function(){
						Ext.MessageBox.alert('提示', '删除失败！');
					}
					
					});
				}
			},this);
            }
    }],
    store:appendixStore
});
var appendixWindow = new Ext.Window({//显示附件信息的弹出框
    layout:'fit',
    width:800,
    height:400,
    modal:true,
    constrain : true,
    closeAction:'hide',
    maximizable:true,
    items:appendixGridPanel
});


/**创建附件列表grid  
 * 参数 ifUpload：是否隐藏上传按钮 ifDown：是否隐藏下载按钮 ifDel：是否隐藏删除按钮 title：标题添加信息
  **/
function createAnnGrid(ifUpload,ifDown,ifDel,title){
	var store = new Ext.data.Store({//读取附件数据的store
        id: 'notice',
        restful : true,     
        proxy : _anaExeProxy,
        reader : appendixReader,
        writer : writerAna,
        recordType:anaExeRocordType
    });
	return new Ext.grid.GridPanel({//附件table
	    title:title?'附件列表'+title:'附件列表',
	    cm:columnAppendix,
	    height:200,
	    width:'100%',
	    tbar:[{
	        text:'下载',
	        hidden:ifDown,
	        handler:function()
	        {
	        	var _this = this;
	            var record = _this.ownerCt.ownerCt.getSelectionModel().getSelected(); 
	            if (!record) {
	                Ext.MessageBox.alert('查询操作', '请选择要操作的数据！');
	                return false;
	            }
	           var annexeName = record.get('annexeName');
	           var fileNameStr = record.get('physicalAddress');
	           var noticeIdStr = record.get('annexeId');
	           window.open( basepath+'/AnnexeDownload?filename='+fileNameStr+'&annexeName='+annexeName,'', 'height=100, width=200, top=300, left=500, toolbar=no,menubar=no, scrollbars=no, resizable=no,location=no, status=no');
	           Ext.Ajax.request({
	               url : basepath + '/workplatannexe.json',
	               method : 'POST',
	               params : {
	                   annexeId : noticeIdStr
	               },
	               success : function(a,b){
	                   var mods = uploadForm.modinfo;
	                   var reins = uploadForm.relaId;
	                   var condi = {};
	                   condi['relationInfo'] = reins;
	                   condi['relationMod'] = mods;
	                   Ext.Ajax.request({
	                       url:basepath+'/queryanna.json',
	                       method : 'GET',
	                       params : {
	                           "condition":Ext.encode(condi)
	                       },
	                       failure : function(){
	                           Ext.MessageBox.alert('查询异常', '查询失败！');
	                       },
	                       success : function(response){
	                           var anaExeArray = Ext.util.JSON.decode(response.responseText);
	                           store.loadData(anaExeArray.json.data);
	                           _this.ownerCt.ownerCt.getView().refresh();
	                       }
	                   });
	               
	               },
	               failure : function(a,b){}
	           });
	        }
	    },{
	        text:'上传',
	        hidden:ifUpload,
	        handler:function(){
	        	uploadForm.storeName = store;
	            uploadWindow.show();
	       	}},{
	            text:'删除',
	            hidden:ifDel,
	            handler:function(){
	            var _this = this;
	        	var selectLength = _this.ownerCt.ownerCt.getSelectionModel().getSelections().length;
				if(selectLength != '1'){
					Ext.MessageBox.alert('提示','请选择一条记录.');
					return;
				}
				Ext.Msg.confirm('提示','确定要删除么?',function(btn){
					if(btn == 'yes'){
						var selectRe = _this.ownerCt.ownerCt.getSelectionModel().getSelections()[0];
						var id = selectRe.data.annexeId;
						Ext.Ajax.request({
							url : basepath + '/workplatannexe/1.json?annexeId='+id,
							method : 'DELETE',
							success : function(){
							Ext.MessageBox.alert('提示','删除成功！');
							var mods = uploadForm.modinfo;
							var reins = uploadForm.relaId;
							
							var condi = {};
							condi['relationInfo'] = reins;
							condi['relationMod'] = mods;
							Ext.Ajax.request({
								url:basepath+'/queryanna.json',
								method : 'GET',
								params : {
								"condition":Ext.encode(condi)
							},
							failure : function(){
								Ext.MessageBox.alert('查询异常', '查询失败！');
							},
							success : function(response){
								var anaExeArray = Ext.util.JSON.decode(response.responseText);
								store.loadData(anaExeArray.json.data);
								_this.ownerCt.ownerCt.getView().refresh();
							}
							});
						},
						failure : function(){
							Ext.MessageBox.alert('提示', '删除失败！');
						}
						});
					}
				},this);
	            }
	    }],
	    store:store
	});
	
}