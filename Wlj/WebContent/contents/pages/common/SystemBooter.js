var currentColorId = __themeColorId;
if (currentColorId == 1)  {
	cssUrl = basepath + '/contents/resource/ext3/resources/css/xtheme-blue.css';
} else {
	cssUrl = basepath + '/contents/resource/ext3/resources/css/xtheme-zhongxin_crm.css';
}
Ext.util.CSS.swapStyleSheet('themeId', cssUrl);