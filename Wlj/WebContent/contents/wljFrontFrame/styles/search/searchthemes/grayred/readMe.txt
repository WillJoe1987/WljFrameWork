【更新记录】
-----------------2015-07-01---------------------------------
说明：该主题仅供广发项目使用
配置/修改：
1、修改或者直接指定主题为grayred
2、注释/WebContent/contents/frameControllers/Wlj-search-APP.js第287行：
//background: "url("+basepath+__background+") fixed center"
background: "url("+basepath+"/contents/wljFrontFrame/styles/search/searchthemes/grayred/pics/index/index_bg_05.jpg"+") center bottom"
主题css中已指定广发默认背景图片。
3、若首页需要LOGO，须修改：
/crmnewweb/WebContent/contents/frameControllers/widgets/search/header.js 40行为：
'<ul class="main_menu_ul"><li id="indexMenuLogo" title="广发银行 绩效应用平台"></li></ul>'
-------------------------------------------------------------