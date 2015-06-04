var _tempImpFileName = "";
var pkHead = "";
/**
 * 导入表单对象，此对象为全局对象，页面直接调用。
 */
var importForm = new Ext.FormPanel({ 
    height : 200,
    width : '100%',
    title:'文件导入',
    fileUpload : true, 
    dataName:'file',
    frame:true,
    tradecode:"",
    
    /**是否显示导入状态*/
    importStateInfo : '',
    importStateMsg : function (state){
		var titleArray = ['excel数据转化为SQL脚本','执行SQL脚本...','正在将临时表数据导入到业务表中...','导入成功！'];
		this.importStateInfo = "当前状态为：[<font color='red'>"+titleArray[state]+"</font>];<br>";
	},    
    /**是否显示 当前excel数据转化为SQL脚本成功记录数*/
    curRecordNumInfo : '',
    curRecordNumMsg : function(o){
		this.curRecordNumInfo = "当前excel数据转化为SQL脚本成功记录数[<font color='red'>"+o+"</font>];<br>";
	},
    /**是否显示 当前sheet页签记录数*/
	curSheetRecordNumInfo : '',
    curSheetRecordNumMsg : function (o) {
		this.curSheetRecordNumInfo = "当前sheet页签记录数：[<font color='red'>"+o+"</font>];<br>";
	},
    /**是否显示 当前sheet页签号*/
    sheetNumInfo : '',
    sheetNumMsg : function(o){
		this.sheetNumInfo = "当前sheet页签号为：[<font color='red'>"+o+"</font>];<br>";
	},
    /**是否显示 sheet页签总数*/
    totalSheetNumInfo : '',
    totalSheetNumMsg : function(o){
		this.totalSheetNumInfo = "sheet页签总数：[<font color='red'>"+o+"</font>];<br>";
	},
    /**是否显示 已导入完成sheet数*/
    finishSheetNumInfo : '',
    finishSheetNumMsg : function(o){
		this.finishSheetNumInfo = "已导入完成sheet数[<font color='red'>"+o+"</font>];<br>";
	},
    /**是否显示 已导入完成记录数*/
	finishRecordNumInfo : '',
    finishRecordNumMsg : function(o){
		this.finishRecordNumInfo = "已导入完成记录数[<font color='red'>"+o+"</font>];<br>";
	},
    /**当前excel数据转化为SQL脚本成功记录数*/
    curRecordNum : 0,
    /**导入总数*/
	totalNum : 1,
	/**进度条信息*/
	progressBarText : '',
	/**进度条Msg*/
	progressBartitle : '',
    proxyStore : undefined,
    items: [],
	/**进度条*/
    progressBar : null,    
    /***import成功句柄*/
    importSuccessHandler : function (json){	
		if (json != null) {	
			if (typeof(json.curRecordNum) != 'undefined' && this.curRecordNumMsg) {
				this.curRecordNumMsg(json.curRecordNum);
				this.curRecordNum = json.curRecordNum;
			}
			if (typeof(json.importState) != 'undefined' && this.importStateMsg) {
				this.importStateMsg(json.importState);
			}				
			if (typeof(json.curSheetRecordNum) != 'undefined' && this.curSheetRecordNumMsg) {
				this.curSheetRecordNumMsg(json.curSheetRecordNum);
			}
			if (typeof(json.sheetNum) != 'undefined' && this.sheetNumMsg) {
				this.sheetNumMsg(json.sheetNum);
			}
			if (typeof(json.totalSheetNum) != 'undefined' && this.totalSheetNumMsg) {
				this.totalSheetNumMsg(json.totalSheetNum);
			}	
			if (typeof(json.finishSheetNum) != 'undefined' && this.finishSheetNumMsg) {
				this.finishSheetNumMsg(json.finishSheetNum);
			}
			if (typeof(json.finishRecordNum) != 'undefined' && this.finishRecordNumMsg) {
				this.finishRecordNumMsg(json.finishRecordNum);
			}
		} else {
			this.curRecordNumInfo = '';
			this.importStateInfo = '';
			this.curSheetRecordNumInfo = '';
			this.sheetNumInfo = '';
			this.totalSheetNumInfo = '';
			this.finishSheetNumInfo = '';
			this.finishRecordNumInfo = '';
		}
		
		this.progressBartitle = '';
		/**进度条Msg信息配置：各信息项目显示内容由各自方法配置*/
		this.progressBartitle += this.curRecordNumMsg      ?this.curRecordNumInfo:'';
		this.progressBartitle += this.importStateMsg 	   ?this.importStateInfo:'';
		this.progressBartitle += this.curSheetRecordNumMsg ?this.curSheetRecordNumInfo:'';
		this.progressBartitle += this.sheetNumMsg 	   	   ?this.sheetNumInfo:'';
		this.progressBartitle += this.totalSheetNumMsg 	   ?this.totalSheetNumInfo:'';
		this.progressBartitle += this.finishSheetNumMsg    ?this.finishSheetNumInfo:'';
		this.progressBartitle += this.finishRecordNumMsg   ?this.finishRecordNumInfo:'';
		
		showProgressBar(this.totalNum,this.curRecordNum,this.progressBarText,this.progressBartitle,"上传成功，正在导入数据，请稍候");
	},
    buttons : [{
            text : '导入文件',
            handler : function() {
                var tradecode = this.ownerCt.ownerCt.tradecode;
                var proxyStorePS = this.ownerCt.ownerCt.proxyStore;
                var proxyHttpPH = this.ownerCt.ownerCt.proxyHttp;
                if(tradecode==undefined ||tradecode==''){
                    Ext.MessageBox.alert('Debugging！','You forgot to define the tradecode for the import form!');
                    return false;
                }
                var impRefreshHandler = 0;
                if (this.ownerCt.ownerCt.getForm().isValid()){
                    this.ownerCt.ownerCt.ownerCt.hide();
                    var fileNamesFull = this.ownerCt.ownerCt.items.items[0].getValue();
                    var extPoit = fileNamesFull.substring(fileNamesFull.indexOf('.'));
                    if(extPoit=='.xls'||extPoit=='.XLS'||extPoit=='.xlsx'||extPoit=='.XLSX'){
                    } else {
                    	Ext.MessageBox.alert("文件错误","导入文件不是XLS或XLSX文件。");
                        return false;
                    }
                    showProgressBar(1,0,'','','正在上传文件...');
                    
                    this.ownerCt.ownerCt.getForm().submit({
                        url : basepath + '/FileUpload?isImport=true',
                        success : function(form,o){                    		 
                            _tempImpFileName = Ext.util.JSON.decode(o.response.responseText).realFileName;
                            var condi = {};
                            condi['filename'] =_tempImpFileName;
                            condi['tradecode'] = tradecode;
                            Ext.Ajax.request({
                                url:basepath+"/ImportAction.json",
                                method:'GET',
                                params:{
                                    "condition":Ext.encode(condi)
                                },
                                success:function(){
                                	importForm.importSuccessHandler(null);                                	
                                    var importFresh = function(){
                                        Ext.Ajax.request({
                                            url:basepath+"/ImportAction!refresh.json",
                                            method:'GET',
                                            success:function(a){                                        		
                                                if(a.status == '200' || a.status=='201'){
                                                    var res = Ext.util.JSON.decode(a.responseText);
                                                    if(res.json.result!=undefined&&res.json.result=='200'){
                                                        window.clearInterval(impRefreshHandler); 
                                                        if(res.json.BACK_IMPORT_ERROR&&res.json.BACK_IMPORT_ERROR=='FILE_ERROR'){
                                                        	Ext.Msg.alert("提示","导入文件格式有误，请下载导入模版。");
                                                        	return;
                                                        }
                                                        if(proxyStorePS!=undefined){
                                                            var condiFormP = {};
                                                            condiFormP['pkHaed'] =res.json.PK_HEAD;
                                                            pkHead = res.json.PK_HEAD;
                                                            proxyStorePS.load({
                                                                params:{
                                                                    pkHead: pkHead
                                                                }
                                                            });
                                                        }else {
                                                        	importForm.importSuccessHandler(res.json); 
                                                        	showSuccessWin(res.json.curRecordNum);
                                                        }
                                                    }else if(res.json.result!=undefined&&res.json.result=='900'){
                                                        window.clearInterval(impRefreshHandler);
                                                        importState = true;
                                                        progressWin.hide();//隐藏导入进度窗口
                                                        Ext.Msg.alert("导入失败","失败原因：\n"+res.json.BACK_IMPORT_ERROR);
                                                        /*new Ext.Window({
                                                            title:"导入失败：导入线程处理失败！",
                                                            width:300,
                                                            height:150,
                                                            bodyStyle:'text-align:center',
                                                            html: '失败原因：\n'+res.json.BACK_IMPORT_ERROR //'<img src="'+basepath+'/contents/img/UltraMix55.gif" />'
                                                        }).show();*/
                                                    }else if (res.json.result!=undefined&&res.json.result=='999'){
                                                    	importForm.importSuccessHandler(res.json);
                                                    }
                                                }
                                            }
                                        });
                                    };
                                    impRefreshHandler = window.setInterval(importFresh, 1000);
                                },
                                failure:function(){}
                            });
                           
                        },
                        failure : function(form, o){
                            Ext.Msg.show({
                                title : 'Result',
                                msg : '数据文件上传失败，请稍后重试!',
                                buttons : Ext.Msg.OK,
                                icon : Ext.Msg.ERROR
                            });
                        }
                    });
                }
            }
        }]
});
/**
 * 导入弹出窗口，此对象为全局对象，由各页面直接调用。
 */

var importWindow = new Ext.Window({     
    width : 700,
    hideMode : 'offsets',
    modal : true,
    height : 250,
    closeAction:'hide',
    items : [importForm]
});
importWindow.on('show',function(upWindow){
	if(Ext.getCmp('littleup')){
		importForm.remove(Ext.getCmp('littleup'));
	}
	importForm.removeAll(true);
	importForm.add(new Ext.form.TextField({
        xtype : 'textfield',
        id:'littleim',
        name:'annexeName',
        inputType:'file',
        fieldLabel : '文件名称',
        anchor : '90%'
    }));
	importForm.doLayout();
});
var progressBar = {};
var importState = false;
var progressWin = new Ext.Window({     
    width : 300,
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
	progressBar = new Ext.ProgressBar({width : 285 });
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
		msg = '正在导入...';
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
function showSuccessWin(curRecordNum) {
	importState = true;
	progressWin.removeAll();
	progressWin.setTitle("成功导入记录数为["+curRecordNum+"]");
	progressWin.add(new Ext.Panel({
		title:'',
		width:300,
		layout : 'fit',
		autoHeight : true,
		bodyStyle:'text-align:center',
		html: '<img src="'+basepath+'/contents/img/UltraMix55.gif" />'
	}));
	progressWin.doLayout();
	progressWin.show();
}
