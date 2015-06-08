/*
 * Simplified Chinese translation
 * By fbchen
 */

if (Ext.ux.TabCloseMenu) {
	Ext.apply(Ext.ux.TabCloseMenu.prototype, {
        closeText: "关闭",
        closeOtherText: "关闭其它",
        closeAllText : "全部关闭"
    });
}

if (Ext.ux.UploadPanel) {
    Ext.apply(Ext.ux.UploadPanel.prototype, {
        addText : "增加",
        clickRemoveText : "单击删除",
        clickStopText : "单击停止",
        emptyText : "没有文件",
        errorText : "错误",
        fileQueuedText : "文件 <b>{0}</b> 正排队等待上传",
        fileDoneText : "文件 <b>{0}</b> 已经成功上传",
        fileFailedText : "文件 <b>{0}</b> 上传失败",
        fileStoppedText : "文件 <b>{0}</b> 被用户终止",
        fileUploadingText : "文件 <b>{0}</b> 正在上传中",
        removeAllText : "全部删除",
        removeText : "删除",
        stopAllText : "全部停止",
        uploadText : "上传",
        percentDoneText : "% 完成"
    });
}

if (Ext.ux.FileUploader) {
    Ext.apply(Ext.ux.FileUploader.prototype, {
        jsonErrorText : "无法解析JSON对象",
        unknownErrorText : "未知错误"
    });
}

if (Ext.ux.UploadGridPanel) {
    Ext.apply(Ext.ux.UploadGridPanel.prototype, {
        addText : "增加...",
        clickRemoveText : "单击删除",
        clickStopText : "单击停止",
        errorText : "错误",
        fileQueuedText : "文件 <b>{0}</b> 正排队等待上传",
        fileDoneText : "文件 <b>{0}</b> 已经成功上传",
        fileFailedText : "文件 <b>{0}</b> 上传失败",
        fileStoppedText : "文件 <b>{0}</b> 被用户终止",
        fileUploadingText : "文件 <b>{0}</b> 正在上传中",
        removeAllText : "全部删除",
        removeText : "删除",
        stopAllText : "全部停止",
        uploadText : "上传",
        msgTitle: "系统提示",
        fileHeaderText: "文件名",
        stateHeaderText: "状态信息",
        operHeaderText: "操作",
        maxFileCountText: "选择文件的总数已经达到最大值：{0}",
        allowFileExtensionsText: "允许上传的文件的扩展名为：{0}",
        allowSameFileNameText: "文件{0}已经存在，请先更改文件名后再选择",
        allowBlankFileNameText: "文件名不能包含空格！"
    });
}

if (Ext.grid.Statistician) {
    Ext.apply(Ext.grid.Statistician.prototype, {
        text : "求和："
    });
}

if (Ext.grid.ToggleHeader) {
    Ext.apply(Ext.grid.ToggleHeader.prototype, {
        text : "切换列头"
    });
}

if(Ext.ux.ToolbarFilter){
    Ext.apply(Ext.ux.ToolbarFilter.prototype, {
        blankText  : "该输入项为必输项",
        emptyText  : "过滤...",
        tooltip    : "过滤/查询"
    });
}

if(Ext.ux.StoreStatusBar){
    Ext.apply(Ext.ux.StoreStatusBar.prototype, {
        defaultText: "完成",
        busyText   : "请稍候..."
    });
}

if(Ext.ux.NostatPagingToolbar){
  Ext.apply(Ext.ux.NostatPagingToolbar.prototype, {
      beforePageText : "第",
      afterPageText  : "页",
      firstText      : "第一页",
      prevText       : "前一页",
      nextText       : "下一页",
      lastText       : "最后页",
      refreshText    : "刷新",
      displayMsg     : "显示 {0} - {1}条",
      emptyMsg       : '没有数据需要显示'
  });
}

if(Ext.ux.ColorPicker){
    Ext.apply(Ext.ux.ColorPicker.prototype, {
        websafeText: "安全色",
        inverseText: "反色",
        pickClrText: "确定"
    });
}

if (Ext.ux.Whether) {//常量
    Ext.apply(Ext.ux.Whether, {
        yesText: "是",
        noText: "否",
        emptyText : "--请选择--"
    });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      passwordText  : '密码不匹配',
      maxlengthbyteText : '输入值不允许超过 {0} 个字节数',
      notGeneraltext: '无效字符，只能输入字母数字横线',
      unusualcharText: '无效字符'
   });
}


if (Ext.ux.tree && Ext.ux.tree.ArrayTree) {
	Ext.apply(Ext.ux.tree.ArrayTree.prototype, {
        collapseAllText: "全部收缩",
        expandAllText  : "全部展开"
    });
}

if (Ext.form.HtmlField) {
	Ext.apply(Ext.form.HtmlField.prototype, {
        blankText: "输入项{0}不能为空"
    });
}

if (Ext.mm.TreeCombo) {
    Ext.apply(Ext.mm.TreeCombo.prototype, {
        metadataTreeText: "元数据树",
        classifierTreeText: "元模型树",
        cleanerText: '点击清除'
    });
}
