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
	<version:frameLink  type="text/css" rel="stylesheet" href="/contents/css/LovCombo.css" />
	<version:frameScript type="text/javascript" src="/contents/frameControllers/plugin/customerView/ViewFunctionBooter.js"/>
    <version:frameScript type="text/javascript" src="/contents/frameControllers/plugin/customerView/Wlj-frame-view-builder.js"/><!--

    <version:frameScript type="text/javascript" src="/contents/pages/common/Com.yucheng.crm.commonView.js"/>
    --><script type="text/javascript">
		var resId = "<%=request.getParameter("resId")%>";
		var url = "<%=request.getParameter("url")%>";
		var viewType = "<%=request.getParameter("viewType")%>";
		var viewId = "<%=request.getParameter("viewId")%>";
		var _custId = "<%=request.getParameter("custId")%>";
		var _productId = "<%=request.getParameter("viewId")%>";
	</script>
 
</head>
<body>
</body>
</html>