<%@ page contentType="text/html; charset=utf-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<title>客户关系管理系统</title>
	<meta name="keywords" content="客户关系管理系统,CRM" />
	<meta name="description" content="客户关系管理系统,CRM" />
	<meta name="Author" content="YuchengTech" />
	<link rel="shortcut icon" href="favicon.ico" />
	<%@ include file="/contents/pages/common/includes.jsp"%>
	<script type="text/javascript">
	<%
		String custId = request.getParameter("custId");
		String busiId = request.getParameter("busiId");
		out.print("var _custId = '"+custId+"';");
		out.print("var _busiId = '"+busiId+"';");
	%>
	//注：此tabs变量必须按此格式定义,且此文件只能更改tabs变量里面的内容
	var tabs =[{
		title:'用户管理',
		url:'/contents/pages/wlj/systemManager/userManagerNew.js'
	},{
		title:'系统管理',
		url:'/contents/pages/wlj/systemManager/organizationManagerNew.js'
	}];
	</script>
	<version:frameScript type="text/javascript" src="/contents/pages/common/Com.yucheng.bcrm.common.tabpanel.js"/>
</head>
<body>
</body>
</html>