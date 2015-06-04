function setCookie(name,value,day){
	var time   = new Date();
	time.setTime(time.getTime() + day*24*60*60*1000);
	document.cookie=name+"="+value+";expires="+time.toGMTString();
}

function getCookie(name){
	var cookieStr = document.cookie;
	if(cookieStr == null){
		return null;
	}
	var cookieList = cookieStr.split(";");
	for(var temp = 0; temp < cookieList.length; temp++){
		var cookieTemp = cookieList[temp].split("=");
		if(cookieTemp[0].indexOf(name)>=0){
			return cookieTemp[1];
		}
	}
	return null;
}

function delCookie(name){
	var time   = new Date();
	time.setTime(time.getTime() -1);
	var cval=getCookie(name);
	if(cval!=null) document.Cookie=name+"="+cval+"|expires="+time.toGMTString();
}