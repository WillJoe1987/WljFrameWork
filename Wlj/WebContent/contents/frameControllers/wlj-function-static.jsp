<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" pageEncoding="UTF-8"%>
<head>
	<title>客户关系管理系统</title>
	<meta name="keywords" content="客户关系管理系统,CRM" />
	<meta name="description" content="客户关系管理系统,CRM" />
	<meta name="Author" content="YuchengTech" />
	<link rel="shortcut icon" href="favicon.ico" />
	
	<SCRIPT type=text/javascript>
	var basepath = "../..";	
	var __frontVersion = '1.1.201402261745';
	var __frameVersion = '1.1';
	var __userId = 'admin';
	var __userName = '系统管理员';
	var __userCname = '系统管理员';
	var __userIcon = '';
	var __updatePwdStat = '1';
	var __themeColorId = 'null';
	var __background='/contents/wljFrontFrame/styles/search/searchthemes/blue/pics/index/index_bg_03.jpg';
	var __theme='orange';
	var __wordsize='ra_normal';
	var __roles = '42$';
	var __roleCodes = 'admin$';
	var __roleNames = '系统管理员';
	var __roleType = '1';
	var __units = '500';
	var __grants = [];
	var __resId = 'null';
	var __unitname = '宇信银行总行';
	var __unitlevel = '1';
	var __appId = '62';
	var __loginType = '0';
	var __secMsgType = '';
	var __secMsg = '';
	var __errMsgMap = [];
	var __custManagerType = '1';//客户归属参数
	__errMsgMap.push({
		code:'500-1004',content:'方法的参数错误'
	});
	__errMsgMap.push({
		code:'500-1003',content:'访问接口错误'
	});
	__errMsgMap.push({
		code:'500-1002',content:'数据库错误'
	});
	__errMsgMap.push({
		code:'500-1001',content:'系统启动参数配置错误'
	});
	__errMsgMap.push({
		code:'500-1008',content:'访问Servlet错误'
	});
	__errMsgMap.push({
		code:'500-1007',content:'数组下标越界'
	});
	__errMsgMap.push({
		code:'404',content:'文件{0}不存在'
	});
	__errMsgMap.push({
		code:'500-1006',content:'空指针错误'
	});
	__errMsgMap.push({
		code:'500-1005',content:'文件访问错误'
	});
	__errMsgMap.push({
		code:'500-1000',content:'环境配置错误'
	});
</SCRIPT>
<style type="text/css">
        /*01-common sta----若整合到产品中，在引入main.css前提下，01部分内容不需要，仅需要02-yccrm-Setp这部分内容---*/
        body, td, th {font-size: 12px; color: #222; outline: none;}
        * {font-family: 微软雅黑,宋体;}
        body {background-color: #e7eaf2;margin: 0;padding: 0;}
        div, ul, li, form, p, h1, i, hr {margin: 0;padding: 0;list-style: none;border: none;}
        img {border: none; }
        input, textarea {outline: none;resize: none;}
        a:link, a:visited {font-size: 12px;color: #005bac;text-decoration: none;outline: none;}
        a:hover {color: #222;text-decoration: none; }
        a:active {color: #222;}
        .cl {clear: both;width: 0;height: 0;font-size: 0;line-height: 0;}
        /*01-common end*/

        /*02-yccrm-Step sta*/
        .yc-stepTitleBar {height: 29px;background-color: #cfd7ea;border-bottom: 1px #c5cde0 solid;}
        .yc-stepContainer{padding-bottom:8px;padding-right:8px;}
        .yc-stepTitleBar .yc-stbText {line-height: 29px;margin-left: 10px;background: url(../pages/poc/nanjing/style/pics/yc-step/pic_02.gif) left center no-repeat;padding-left: 20px;font-size: 12px;font-weight: bold;color: #444;}
        .yc-stepBox {float: left;clear: left;padding-left: 5px;padding-right: 5px;width: 140px;height: 80px;line-height: 80px;background-color: #94a6cc;margin: 8px 0 0 8px;color: #444;position: relative;font-size: 14px;text-align: center;cursor:default;}
        .yc-stepBox:hover {background-color: #a7b9de;}
        .yc-sbNum {position: absolute;top: 0;left: 0;font-style: italic;width: 33px;height: 40px;padding-left: 7px;line-height: 20px;font-size: 16px;color: #fff;font-weight: bold;text-align: left;background: url(../pages/poc/nanjing/style/pics/yc-step/pic_01.gif) left top no-repeat;}
        .yc-stepOver {background-color: #6ab814;color:#fff;}
        .yc-stepOver:hover {background-color: #7dce23;}
        .yc-stepBox:hover .yc-sbNum {background: url(../pages/poc/nanjing/style/pics/yc-step/pic_01_ov.gif) left top no-repeat;}
        .yc-stepOver:hover .yc-sbNum,.yc-stepOver .yc-sbNum {background: url(../pages/poc/nanjing/style/pics/yc-step/pic_01_sl.gif) left top no-repeat;}
        /*02-yccrm-Step end*/

    </style>
<LINK rel=stylesheet type=text/css href="../resource/ext3/resources/css/ext-all-notheme.css" />
<LINK rel=stylesheet type=text/css href="../contents/css/LovCombo.css" />
<LINK rel=stylesheet type=text/css href="../wljFrontFrame/styles/search/searchthemes/orange/main.css" />
<LINK rel=stylesheet type=text/css href="../resource/ext3/ux/css/toolbars.css" />
<!-- 补丁样式文件，对于Ext中由于css样式引起的公共性质的BUG，修复代码均添加在此文件中 -->
<LINK rel=stylesheet type=text/css href="../pages/common/Crm-Ext-Patch-Css-1.000-v1.0.css" />
<SCRIPT type=text/javascript src="../resource/ext3/adapter/ext/ext-base.js"></SCRIPT>
<SCRIPT type=text/javascript src="../resource/ext3/ext-all.js"></SCRIPT>
<SCRIPT type=text/javascript src="../resource/ext3/ux/ux-all.js"></SCRIPT>
<SCRIPT type=text/javascript src="../resource/ext3/resources/css/LovCombo.css"></SCRIPT>
<SCRIPT type=text/javascript src="../wljFrontFrame/demoPatch4EXT.js"></SCRIPT>
<SCRIPT type=text/javascript src="../pages/common/Crm-Ext-Patch-1.000-v1.0.js"></SCRIPT>
<SCRIPT type=text/javascript src="../pages/common/Crm-Ext-Extends-1.000-v1.0.js"></SCRIPT>
<SCRIPT type=text/javascript src="../resource/ext3/locale/ext-lang-zh_CN.js"></SCRIPT>
<!-- 校验以及数据格式化组件 -->
<SCRIPT type=text/javascript src="../pages/common/LovCombo.js"></SCRIPT>
<SCRIPT type=text/javascript src="../commonjs/DataFormat.js"></SCRIPT>
<SCRIPT type=text/javascript src="../commonjs/Validator.js"></SCRIPT>
<!-- 控制点权限判断组件 -->
<SCRIPT type=text/javascript src="../pages/common/ViewContext.js"></SCRIPT>
<!-- 导入导出组件 -->
<SCRIPT type=text/javascript src="../pages/common/Com.yucheng.crm.common.ImpExp.js"></SCRIPT>
<SCRIPT type=text/javascript src='../pages/common/Com.yucheng.crm.common.ImpExpNew.js'></SCRIPT>

<SCRIPT type=text/javascript src="../pages/common/Com.yucheng.crm.common.Upload.js"></SCRIPT>
<SCRIPT type="text/javascript" src="defaultPatches.js" ></SCRIPT>
<SCRIPT type="text/javascript" src="../../jsons/lookupdatas.demoj" ></SCRIPT>
<SCRIPT type="text/javascript" src="WljFunctionBooter.js" ></SCRIPT>

<SCRIPT type=text/javascript src="../wljFrontFrame/demoPatch4WLJ.js"></SCRIPT>
<SCRIPT type=text/javascript>
	JsContext.initContext();
Ext.Ajax.timeout = 90000;
	Ext.onReady(function(){
		window.__projectType = 'static';
		window.APPBUILD = new Wlj.frame.functions.app.Builder();
		//修复列模型单击时候菜单不收起问题
		Ext.getBody().on('click',function(){
			parent.Ext.menu.MenuMgr.hideAll();
			});
		
	});
	
	
</SCRIPT>
</head>
<body>
</body>
</html>