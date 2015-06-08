/*
 * Simplified Chinese translation
 * By fbchen
 */

if (Ext.ux.TabCloseMenu) {
	Ext.apply(Ext.ux.TabCloseMenu.prototype, {
        closeText: "Close",
        closeOtherText: "Close Others",
        closeAllText : "Close All"
    });
}

if (Ext.ux.UploadPanel) {
    Ext.apply(Ext.ux.UploadPanel.prototype, {
        addText : "Add",
        clickRemoveText : "Click to delete",
        clickStopText : "Click to stop",
        emptyText : "No Files",
        errorText : "Error",
        fileQueuedText : "File <b>{0}</b> is queued for upload",
        fileDoneText : "File <b>{0}</b> has been successfully uploaded",
        fileFailedText : "File <b>{0}</b> failed to upload",
        fileStoppedText : "File <b>{0}</b> stopped by user",
        fileUploadingText : "Uploading file <b>{0}</b>",
        removeAllText : "Remove All",
        removeText : "Remove",
        stopAllText : "Stop All",
        uploadText : "Upload",
        percentDoneText : "% done"
    });
}

if (Ext.ux.FileUploader) {
    Ext.apply(Ext.ux.FileUploader.prototype, {
        jsonErrorText : "Cannot decode JSON object",
        unknownErrorText : "Unknown error"
    });
}

if (Ext.ux.UploadGridPanel) {
    Ext.apply(Ext.ux.UploadGridPanel.prototype, {
        addText : "Add...",
        clickRemoveText : "Click to remove",
        clickStopText : "Click to stop",
        errorText : "Error",
        fileQueuedText : "File <b>{0}</b> is queued for upload",
        fileDoneText : "File <b>{0}</b> has been successfully uploaded",
        fileFailedText : "File <b>{0}</b> failed to upload",
        fileStoppedText : "File <b>{0}</b> stopped by user",
        fileUploadingText : "Uploading file <b>{0}</b>",
        removeAllText : "Remove All",
        removeText : "Remove",
        stopAllText : "Stop All",
        uploadText : "Upload",
        msgTitle: "System Information",
        fileHeaderText: "File",
        stateHeaderText: "State",
        operHeaderText: "Operation",
        maxFileCountText: "The count of selected files is up to the max value:{0}",
        allowFileExtensionsText: "Allow upload file is:{0}",
        allowSameFileNameText: "File {0} is already existed, please change the file name.",
        allowBlankFileNameText: "File name can not contain blank spaces!"
    });
}

if (Ext.grid.Statistician) {
    Ext.apply(Ext.grid.Statistician.prototype, {
        text : "Sum:"
    });
}

if (Ext.grid.ToggleHeader) {
    Ext.apply(Ext.grid.ToggleHeader.prototype, {
        text : "Toggle Header"
    });
}

if(Ext.ux.ToolbarFilter){
    Ext.apply(Ext.ux.ToolbarFilter.prototype, {
        blankText  : "This field is required",
        emptyText  : "Filter...",
        tooltip    : "Filter/Search"
    });
}

if(Ext.ux.StoreStatusBar){
    Ext.apply(Ext.ux.StoreStatusBar.prototype, {
        defaultText: "Done",
        busyText   : "Loading..."
    });
}

if(Ext.ux.NostatPagingToolbar){
  Ext.apply(Ext.ux.NostatPagingToolbar.prototype, {
    beforePageText : "Page",
    afterPageText  : "",
    firstText      : "First Page",
    prevText       : "Previous Page",
    nextText       : "Next Page",
    lastText       : "Last Page",
    refreshText    : "Refresh",
    displayMsg     : "Displaying {0} - {1}",
    emptyMsg       : 'No data to display'
  });
}

if(Ext.ux.ColorPicker){
    Ext.apply(Ext.ux.ColorPicker.prototype, {
        websafeText: "WebSafe",
        inverseText: "Inverse",
        pickClrText: "Pick Color"
    });
}

if (Ext.ux.Whether) {//常量
    Ext.apply(Ext.ux.Whether, {
        yesText: "Yes",
        noText: "No",
        emptyText : "--Select--"
    });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      passwordText  : 'Passwords do not match',
      maxlengthbyteText : 'the max length of input value is {0} bytes',
      notGeneraltext: 'invalid text, only alphabet,digit and underline are allowed',
      unusualcharText: 'invalid text'
   });
}


if (Ext.ux.tree && Ext.ux.tree.ArrayTree) {
	Ext.apply(Ext.ux.tree.ArrayTree.prototype, {
        collapseAllText: "Collapse All",
        expandAllText  : "Expand All"
    });
}

if (Ext.form.HtmlField) {
	Ext.apply(Ext.form.HtmlField.prototype, {
        blankText: "Field {0} is requried"
    });
}

if (Ext.mm.TreeCombo) {
    Ext.apply(Ext.mm.TreeCombo.prototype, {
        metadataTreeText: "Metadata Tree",
        classifierTreeText: "Meta Model Tree",
        cleanerText: 'click to clean'
    });
}
