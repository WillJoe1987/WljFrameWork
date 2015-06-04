Ext.ns('Com.yucheng.bcrm.common');
Com.yucheng.bcrm.common.uploadFiles = function(formPanel){
	if(formPanel.items.items.length==0){
		return;
	}
	if(formPanel.items.items[0].getValue()== ""){
		return;
	}

	var mods = formPanel.modinfo;
    var reins = formPanel.relaId;
    if(mods==undefined ||mods==''){
        return false;
    }
    if(formPanel.getForm().isValid()){
    	formPanel.getForm().submit({
            url : basepath + '/FileUpload',
            success : function(form,o){
                _tempFileName = Ext.util.JSON.decode(o.response.responseText).realFileName;
                var fileName =form.items.items[0].getValue();
                var simpleFileName = fileName.substring(fileName.lastIndexOf("\\")+1, fileName.length);
                Ext.Ajax.request({
                	url:basepath+'/workplatannexe.json',
                	method:'POST',
                	params: {
                		relationInfo : reins,
                		annexeName : simpleFileName,
                		relationMod : mods,
                		physicalAddress : _tempFileName,
                		annexeSize : _annaSize 
                	},
                	success : function(a,b){},
                	failure : function(a,b){}
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
	
};
var appendixGridPanel2 = new Ext.grid.GridPanel({//附件table
    title:'附件列表',
    cm:columnAppendix,
    height:200,
    width:840,
    tbar:[{
        text:'下载',
        id : '_downId',
        handler:function()
        {
            var record = appendixGridPanel2.getSelectionModel().getSelected(); 
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
                           appendixGridPanel2.getView().refresh();
                       }
                   });
               
               },
               failure : function(a,b){}
           });
        }
    },{
        id:'_upload',
        text:'上传',
        handler:function(){
            uploadWindow.show();
        }
    },{
    	id : '_delload',
    	text:'删除',
    	handler:function(){
    	var selectLength = appendixGridPanel2.getSelectionModel().getSelections().length;debugger;
		if(selectLength != '1'){
			Ext.MessageBox.alert('提示','请选择一条记录.');
			return;
		}
		Ext.Msg.confirm('提示','确定要删除么?',function(btn){
			if(btn == 'yes'){
				var selectRe = appendixGridPanel2.getSelectionModel().getSelections()[0];
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
						appendixGridPanel2.getView().refresh();
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
    }
],
    store:appendixStore
});