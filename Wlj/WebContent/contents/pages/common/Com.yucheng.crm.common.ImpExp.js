Ext.ns('Com.yucheng.bob');
/**
 * Just for loading the records to an EXCEL file.
 * A ha, a beta version.
 * modify by Will Joe 2013-04-25 ：新增数据参数，当设定的条件form为空的，则调用此属性作为导出数据查询条件
 */
Com.yucheng.bob.ExpButton = Ext.extend(Ext.Button,{
    url:'#',
    exParams : false,//新增数据参数，当设定的条件form为空的，则调用此属性作为导出数据查询条件
    backgroundExport : false,//是否后台导出方式：true是为后台导出方式，false为原版方式(前台导出)
    text:'导出',
    handler:function(){
        var colMArray = this.ownerCt.ownerCt.colModel.config;
        var fieldArray = this.ownerCt.ownerCt.store.fields.items;
        var fieldMap = {};
        var translateMap = {};
       
        Ext.each(colMArray,function(item){
            var header = "";
            var mapping = "";
            if(item.dataIndex!=undefined&&item.dataIndex!=""&&(item.hidden==undefined||!item.hidden)){
                if(item.header!=undefined&&item.header!=""&&item.header!="NO"){
                    header = item.header;
                    for(var i=0;i<fieldArray.length;i++){
                        if(item.dataIndex == fieldArray[i].name){
                            mapping = fieldArray[i].mapping;
                            if(mapping!=undefined&&mapping!=""){
                                fieldMap[mapping]=header;
                                continue;
                            }else{
                            	fieldMap[fieldArray[i].name]=header;
                            	continue;
                            }
                        }
                    }
                }
            }
        });
        var tmpFormPanel;
        var conditionString;
        var requestParams = {};
        
        var fieldMapString = Ext.encode(fieldMap);
        var expPar = {};
        expPar.fieldMap = fieldMapString;
        expPar.translateMap = Ext.encode(translateMap);
        conditionString = Ext.encode(_app.searchDomain.items.items[0].getForm().getFieldValues());
//        debugger;
//        var tmpFormPanel;
//        if(typeof this.formPanel == 'string'){
//            if(this.formPanel != ''){
//                tmpFormPanel = Ext.getCmp(this.formPanel);
//            }
//        }else {
//            tmpFormPanel = this.formPanel;
//        }
//        var conditionString;
//        var requestParams = {};
//        if(tmpFormPanel!=undefined && tmpFormPanel.getXType()=='form'){
//            var conditionForm = tmpFormPanel.getForm();
//            var conditionObj = conditionForm.getFieldValues();
//            conditionString = Ext.encode(conditionObj);
//        }else {
//        	if(this.exParams ===false){
//        		return;
//        	}
//        }
//        
//        var fieldMapString = Ext.encode(fieldMap);
//        var expPar = {};
//        expPar.fieldMap = fieldMapString;
        if(conditionString!=undefined){
        	expPar.condition = conditionString;
        	expPar.menuId = __resId;
        }
        Ext.apply(expPar,this.exParams);
        
        if(this.url=='#'){
            /**
             * For debug.
             */
            Ext.MessageBox.alert('Debugging！','You forgot to define the url for the ExpButton!');
        }
        var refreshHandler = 0;
        var backgroundExport = this.backgroundExport;
        var expUrl = this.url.replace('.json','!export.json');
        
        //进度title
        var progressBarTitle = '正在导出数据...';
        //当前导出进度信息
        var getMsg = function(expRecNum, total) {
        	return '当前导出'+expRecNum+'条；<br>共导出'+total+'条。';
        };        
        Ext.Ajax.request({
            url:expUrl,
            method:'POST',
            params:expPar,
            success:function(a,b){
        		if (backgroundExport){
        			Ext.MessageBox.alert('提示！','下载启动成功，请在下载中心下导出文件!');
        		} else {
        			showProgressBar(1,0,'','正在导出，请稍后...','导出文件');
                    var refreshUrl = b.url.replace('export','refresh');
                    var freshFish = function(){
                        Ext.Ajax.request({
                            url:refreshUrl,
                            method:'GET',
                            success:function(a){
                                if(a.status == '200' || a.status=='201'){
                                    var res = Ext.util.JSON.decode(a.responseText);
                                    if(res.json.filename){
                                    	showSuccessWin(res.json.expRecNum,basepath+'/FileDownload?filename='+res.json.filename);
                                        if(refreshHandler != 0){
                                            window.clearInterval(refreshHandler);
                                        }
                                    } else {
                                    	var res = Ext.util.JSON.decode(a.responseText);
                                    	//Ext.MessageBox.hide();
                                    	if ((typeof res.json.expRecNum) != 'undefined' && (typeof res.json.total) != 'undefined') {
                                    		showProgressBar(res.json.total,res.json.expRecNum,'',getMsg(res.json.expRecNum,res.json.total),progressBarTitle);
                                    	} else {
                                    		 progressBar.hide();
                                             Ext.MessageBox.alert('提示！','下载进度信息获取失败!');
                                    	}
                                    }
                                } 
                            }
                        });
                    };
                    refreshHandler = window.setInterval(freshFish, 1000);
        		}
            },
            failure:function(a,b){
            	if (!backgroundExport){progressBar.hide();}
                Ext.MessageBox.alert('失败！','请等待当前下载任务完成!');
            }
        });
    }
});

Ext.reg('bob.expbutton', Com.yucheng.bob.ExpButton);
//Ext.reg('bob.excelbutton', Com.yucheng.bob.ExcelButton);
/**继承commonAction时用到的导出功能**********************************************************************/

var idTmr  =  "";
/**
 * grid : expGrid
 */
Com.yucheng.bob.ExcelButton = Ext.extend(Ext.Button,{
	expGrid : false,
	text:'导出',
	handler: function(){
		if(this.expGrid != false){
			  var cm = this.ownerCt.ownerCt.getColumnModel();   
			  var store = this.ownerCt.ownerCt.getStore();   
			     
			  var it = store.data.items;   
			  var rows = it.length;   
			     
			  var   oXL   =   new   ActiveXObject("Excel.application");        
			  var   oWB   =   oXL.Workbooks.Add();        
			  var   oSheet   =   oWB.ActiveSheet;    
			     
			  for (var i = 2; i < cm.getColumnCount(); i++) {   
			      
			   if (!cm.isHidden(i)) {   
			    oSheet.Cells(1, i - 1).value = cm.getColumnHeader(i);   
			   }   
			      
			   for (var j = 0; j < rows; j++) {
				   if(cm.getDataIndex(i) != ''){
					   r = it[j].data;   
					    var v = r[cm.getDataIndex(i)];  
//					    var fld = store.recordType.prototype.fields.get(cm.getDataIndex(i));   
					    var fld = cm.config[i];
					    if(null != v){
					    	if("object"==typeof(v) && v.time != undefined)//日期类型   
						    {
						    	v = new Date(v.time);
						    }
					    	if("NaN" != parseInt(v))//数字类型  前加转义字符" \t"
					    	{
					    		v = "\t"+v;
					    	}
					    	if(cm.config[i].type != undefined){
						    	if(cm.config[i].type == 'mapping'){//mapping类型
						    		for(var r = 0; r < cm.config[i].store.data.items.length; r++){
						    			var mappingCode = cm.config[i].store.data.items[r].data.code;
						    			var mappingName = cm.config[i].store.data.items[r].data.name;
						    			if ( parseInt(mappingCode) == parseInt(v) ){
						    				v = mappingName;
						    			}
						    		}
							    }
					    	}
					    }
					    oSheet.Cells(2 + j, i - 1).value = v;
				   }
			   }   
			  }   
			  oXL.DisplayAlerts = false;   
			  oXL.Save();   
			  oXL.DisplayAlerts = true;                       
			  oXL.Quit();   
			  oXL = null;   
			  idTmr = window.setInterval("Cleanup();",1);   
			  
		}else{
			Ext.MessageBox.alert('Debugging！','Please enter the expGrid params!');
		}
	}
});
function Cleanup() {   
    window.clearInterval(idTmr);   
    CollectGarbage();   
}  

/********************************************************************************/


/**
 * A file upload form panel.
 * That's a beautiful panel.
 * Maybe I still need to create a upload field object.
 */
Com.yucheng.bob.UpLoadPanel = Ext.extend(Ext.FormPanel,{
    title:'文件上传',
    fileUpload : true, 
    dataName:'file',
    frame:true,
    relaId:'',/**关联数据ID*/
    modinfo:'notice',/**modinfo: notice:公告;*/
   /** upField : new Ext.form.FileUploadField({
        emptyText : '请选择一个文件......' ,
        fieldLabel : '附件' ,
        name : this.dataName ,
        buttonText : '选择文件',
        labelWidth : 50,
        width : '100%'
    }),*/
    upField : new Ext.form.TextField({
        name:'annexeName',
        inputType:'file',
        fieldLabel : '附件名称',
        anchor : '90%'
    }),
    onRender : function(ct, position){
        this.add(this.upField);
        Com.yucheng.bob.UpLoadPanel.superclass.onRender.call(this, ct, position);
    },
    buttons : [{
        text : '导入',
        handler : function() {
            var mods = this.ownerCt.ownerCt.modinfo;
            var reins = this.ownerCt.ownerCt.relaId;
            if(mods==undefined ||mods==''){
                Ext.MessageBox.alert('Debugging！','You forgot to define the modinfo for the upload form!');
                return false;
            }
            if (this.ownerCt.ownerCt.getForm().isValid()){
                this.ownerCt.ownerCt.ownerCt.hide();
                this.ownerCt.ownerCt.getForm().submit({
                    url : basepath + '/FileUpload',
                    success : function(form,o){
                        var fileName =form.items.items[0].getValue();
                        var simpleFileName = fileName.substring(12,fileName.length);
                        Ext.Ajax.request({
                            url:basepath+'/workplatannexe.json',
                            method:'POST',
                            params: {
                                relationInfo : reins,
                                annexeName : simpleFileName,
                                relationMod : mods
                            },
                            success : function(a,b){},
                            failure : function(a,b){}
                        });
                        
                        Ext.Ajax.request({
                            url: basepath+'/UploadStatus',
                            method:'GET',
                            success:function(response,d){
                                Ext.Msg.show({
                                    title : '上传成功',
                                    msg : response.responseText,
                                    buttons : Ext.Msg.OK,
                                    icon : Ext.Msg.INFO
                                });
                                Ext.Ajax.request({
                                    url:basepath+'/workplatannexe.json?relationInfo='+reins,
                                    method : 'GET',
                                    failure : function(){
                                        Ext.MessageBox.alert('查询异常', '查询失败！');
                                    },
                                    success : function(response){
                                        var anaExeArray = Ext.util.JSON.decode(response.responseText);
                                        appendixStore.loadData(anaExeArray);
                                        appendixGridPanel.getView().refresh();
                                    }
                                });
                            },
                            failure:function(a,b){
                            }
                        });
                    },
                    failure : function(form, o){
                        Ext.Msg.show({
                            title : 'Result',
                            msg : o.result.error,
                            buttons : Ext.Msg.OK,
                            icon : Ext.Msg.ERROR
                        });
                    }
                });
            }
        }
    }]
});
Ext.reg('bob.uploadform' , Com.yucheng.bob.UpLoadPanel);

var progressBar = {};
var importState = false;
var progressWin = new Ext.Window({     
    width : 220,
    hideMode : 'offsets',
    closable : true,
    modal : true,
    autoHeight : true,
    closeAction:'hide',
    items : [],
    listeners :{
		'beforehide': function(){
			return importState;
		}
	}
});
function showProgressBar(count,curnum,bartext,msg,title) {
	importState = false;
	progressBar = new Ext.ProgressBar({width : 205 });
	progressBar.wait({
        interval: 200,          	//每次更新的间隔周期
        duration: 5000,             //进度条运作时候的长度，单位是毫秒
        increment: 5,               //进度条每次更新的幅度大小，默示走完一轮要几次（默认为10）。
        fn: function () {           //当进度条完成主动更新后履行的回调函数。该函数没有参数。
			progressBar.reset();
        }
    });
	progressWin.removeAll();
	progressWin.setTitle(title);
	if (msg.length == 0) {
		msg = '正在导出...';
	}
	var importContext = new Ext.Panel({
								title: '',
								frame : true,
								region :'center',
								height : 100,
								width : '100%',
								autoScroll:true,
								html : '<span>'+ msg +'</span>'
							});
	progressWin.add(importContext);
	progressWin.add(progressBar);
	progressWin.doLayout();
	progressWin.show();
	
}
function showSuccessWin(curRecordNum,filePath) {
	importState = true;
	progressWin.removeAll();
	progressWin.setTitle("成功导出记录数为["+curRecordNum+"]");
	progressWin.add(new Ext.Panel({
		title:'',
		width:210,
		layout : 'fit',
		autoHeight : true,
		bodyStyle:'text-align:center',
		html: '<img src="'+basepath+'/contents/img/UltraMix55.gif" />',
		buttonAlign: 'center',
		buttons: [
			new Ext.Button({
			  text:'下载',
			  handler:function(){
			      window.location.href = filePath;
			  }
			})]
	}));
	progressWin.doLayout();
	progressWin.show();
}
