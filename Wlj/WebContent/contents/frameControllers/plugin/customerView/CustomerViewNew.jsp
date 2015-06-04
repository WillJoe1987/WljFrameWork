<%@ page language="java" contentType="text/html; charset=utf-8"%>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>客户视图首页</title>
<%@ include file="/contents/pages/common/includes.jsp"%>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/frameControllers/Wlj-memorise-base.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/frameControllers/Wlj-search-APP.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/frameControllers/widgets/search/tiles.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/frameControllers/widgets/views/index/grid/grid.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/frameControllers/plugin/customerView/Wlj-commonView.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/frameControllers/plugin/customerView/customerView.js"></script>
<script type="text/javascript" src="<%=request.getContextPath()%>/contents/frameControllers/plugin/customerView/customerViewData.js"></script>
<script type="text/javascript">
	var viewId   = "<%=request.getParameter("viewId")%>";
	var viewType = "<%=request.getParameter("viewType")%>";
	var _custId = "<%=request.getParameter("viewId")%>";
	var _prodId = "<%=request.getParameter("viewId")%>";
</script>
</head>
<body>
	
</body>
</html>