/**
 * 日期计算公用方法
 * 
 * @author 焦向波	
 * @since 2011-05-20
 */

/**
 *取周的第一天，cases:n 下周，p 上周
 *
 * @author 焦向波
 * @since 2011-05-20
 */
function showWeekFirstDay(cases,showDate){
 switch (cases){
  case "" :
   var Nowdate=new Date();
   var Nowdate=parseDate(showDate);
   var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
   return DateFor(WeekFirstDay);
   break;
  case "n" :
   var MonthFirstDay=parseDate(showWeekLastDay("",showDate));
   var WeekFirstDay=new Date((MonthFirstDay/1000+86400)*1000);
   return DateFor(WeekFirstDay);
   break;
  case "p" :
   var WeekFirstDay=parseDate(showWeekFirstDay("",showDate));
   var WeekFirstDay=new Date(WeekFirstDay-86400000*7);
   return DateFor(WeekFirstDay);
   break;
 }
}
/**
 *取周的最后一天，cases:n 下周，p 上周
 *
 * @author 焦向波
 * @since 2011-05-20
 */
function showWeekLastDay(cases,showDate){
 switch (cases){
  case "" :
   var Nowdate=new Date();
   var Nowdate=parseDate(showDate);
   var WeekFirstDay=new Date(Nowdate-(Nowdate.getDay()-1)*86400000);
   var WeekLastDay=new Date((WeekFirstDay/1000+6*86400)*1000);
   return DateFor(WeekLastDay);
   break;
  case "n" :
   var MonthFirstDay=parseDate(showWeekLastDay("",showDate));
   var WeekLastDay=new Date((MonthFirstDay/1000+7*86400)*1000);
   return DateFor(WeekLastDay);
   break;
  case "p" :
   var WeekFirstDay=parseDate(showWeekFirstDay("",showDate));
   var WeekLastDay=new Date(WeekFirstDay-86400000);
   return DateFor(WeekLastDay);
   break;
 }
}
/**
 * 取本周是今年的第几周
 * 
 * @author 焦向波
 * @since 2011-06-07
 * @param String
 */
function getWeekSort(showDate){//取本周是今年的第几周
	var d1=parseDate(showDate);//new Date();
	var d2=parseDate(showDate);//new Date();
	d2.setMonth(0);
	d2.setDate(1);
	var rq=d1-d2;
	var s1=Math.ceil(rq/(24*60*60*1000));
	var s2=Math.ceil(s1/7);
	return s2;
}


/**
 * 重载toString方法。
 * 
 * @author：焦向波
 * @since：2011-05-20
 */
Date.prototype.toString = function (){
	 return this.getFullYear() + "-" + (this.getMonth()+1) + "-" + this.getDate();
}
/**
 * 获取指定月的天数
 * 
 * @author 焦向波
 * @since 2011-05-20
 */
function getTheMonthDays(year_month){
	var ymAry=year_month.split('-');
	var year=ymAry[0];
	month=ymAry[1];
	year=parseInt(year);
	month=parseInt(month,10);
	var daysInMonth = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	if(2==month){
		return   ((0==year%4)&&(0!=(year%100)))||(0==year%400)?29:28;   
	}else{
		return   daysInMonth[month-1];
	}
}
/**
 * 将字符串转化为日期 YYYY-MM-DD
 * 
 * @author 焦向波
 * @since 2011-05-20
 */
function parseDate(t){
	var ary=t.split('-');
	var t_d=new Date(ary[1]+'/'+ary[2]+'/'+ary[0]);
	return t_d;
}
/**
 *将日期转化为字符串 YYYY-MM-DD
 *
 * @author 焦向波
 * @since 2011-05-20
 */
function DateFor(t){
	var xYear=t.getYear();
	var xMonth=t.getMonth()+1;
	if(xMonth<10){
		xMonth="0"+xMonth;
	}
	var xDay=t.getDate();
	if(xDay<10){
		xDay="0"+xDay;
	}
	return xYear+"-"+xMonth+"-"+xDay;
}


/**
 * 月视图初始化
 * 
 * @author 焦向波
 * @since 2011-06-07
 */
function initMonth(){
	var curr_day = document.getElementById('bob_curr_day').value;
	var showMonth = document.getElementById('bob_show_day').value.split('-')[1]+'';
	var showYear = document.getElementById('bob_show_day').value.split('-')[0]+'';
	var year_month = showYear+'-'+showMonth;
	var show_month_start_day=showYear+'-'+showMonth+"-01";
	var show_month_end_day=showYear+'-'+showMonth+"-"+getTheMonthDays(year_month);
	var t=parseDate(show_month_start_day);
	var SHOWDAYS=getTheMonthDays(year_month);//显示月有多少天
	var weekIndex=t.getDay();//星期索引
	var dayIndex=1;
	var tempDay;
	var tempShowMonth = showMonth;
	document.getElementById('SHOW_MONTH').innerHTML = year_month;
	for(var k=1;k<7;k++){
		for(var l=0;l<7;l++){
			document.getElementById("monthDay_"+k+"_"+l).innerHTML='';
		}
	}
	for(var i=1;i<7;i++){//行
		if(dayIndex>SHOWDAYS){
			break;
		}
		var j;
		if(i==1){
			j=weekIndex;
		}else{
			j=0;
		}
		for(;j<7;j++){//列
		//	if(i==1&&j<weekIndex){
		//		document.getElementById(td_id).innerHTML='';
		//	}else{
			if(dayIndex>SHOWDAYS){
				break;
			}
			if(dayIndex<10){
				tempDay="0"+dayIndex;
			}else{
				tempDay=""+dayIndex;
			}
			var td_id="monthDay_"+i+"_"+j;
			var fullDate = year_month+'-'+tempDay;
			var gridDate =parseDate(fullDate);
			var cDate = getDateByCNum(gridDate);
			var cTerm = getLunarTerm(gridDate);
			tempDay=tempShowMonth+"-"+tempDay;
			document.getElementById(td_id).innerHTML=tempDay+"<br>"+cDate+'<br>'+cTerm;
			
			if(tempDay==curr_day.substring(5,10)){
				document.getElementById(td_id).style.color="red";
			}
			dayIndex++;		
		//	}
		}
	}
}
/**
 * 月视图跳转
 * @author 焦向波
 * @since 2011-06-07
 * @param par:控制参数；pre:前以月；next:后一月；
 */
function turnTheMonth(par){
	var showedMonth = document.getElementById('bob_show_day').value;
	var ary=showedMonth.split('-');
	var theMonth = parseInt(ary[1],10);
	var theYear = parseInt(ary[0],10);
	if(par=='pre'){
		theMonth--;
		if(theMonth == 0){
			theMonth = 12;
			theYear--;
		}
	}else{
		theMonth++;
		if(theMonth == 13){
			theMonth = 1;
			theYear++;
		}
	}
	if(theMonth<10){
		showedMonth = theYear+'-0'+theMonth;
	}else{
		showedMonth = theYear+'-'+theMonth;
	}
	document.getElementById('bob_show_day').value = showedMonth;
	initMonth();
}
/**
 * 周视图初始化
 * @since 2011-06-07
 * @author 焦向波
 */
function initWeek(){//页面初始化
	var weekTD=document.getElementById("weekTD");
	var show_day=document.getElementById("bob_show_day").value;
	var curr_day=document.getElementById("bob_curr_day").value;
	var bob_week_day=document.getElementById("bob_week_day").value;
	var WEEK_START_DAY=null;//document.getElementById("WEEK_START_DAY").value;
	var WEEK_END_DAY=null;//document.getElementById("WEEK_END_DAY").value;

	var showP="<font color=\"red\">周历："+showWeekFirstDay("",bob_week_day)+" &nbsp;&nbsp<->&nbsp;&nbsp "+showWeekLastDay("",bob_week_day)+"&nbsp;&nbsp第"+getWeekSort(bob_week_day)+"周</font>";
	weekTD.innerHTML=showP;
	if(WEEK_START_DAY==null||WEEK_START_DAY==""){
		WEEK_START_DAY=showWeekFirstDay("",bob_week_day);
		WEEK_END_DAY=showWeekLastDay("",bob_week_day);
		document.getElementById("WEEK_START_DAY").value=WEEK_START_DAY;
		document.getElementById("WEEK_END_DAY").value=WEEK_END_DAY;
	}	
	var ary=WEEK_START_DAY.split('-');
	var t;
	t=new Date(ary[1]+'/'+ary[2]+'/'+ary[0]);
	t.setDate(t.getDate()+1);
	document.getElementById("Week_a_day").innerText=WEEK_START_DAY;//设置星期一的日期
	if(curr_day==WEEK_START_DAY){//如果是当前日期将样式设置为红色
		document.getElementById("Week_a").style.color="red";
		document.getElementById("Week_a_day").style.color="red";
	}
	//eventInit(WEEK_START_DAY,'Week_a_day_content');//设置星期一的事项
	document.getElementById("Week_b_day").innerText=DateFor(t);
	if(curr_day==DateFor(t)){
		document.getElementById("Week_b").style.color="red";
		document.getElementById("Week_b_day").style.color="red";
	}
	//eventInit(DateFor(t),'Week_b_day_content');
	t.setDate(t.getDate()+1);
	document.getElementById("Week_c_day").innerText=DateFor(t);
	if(curr_day==DateFor(t)){
		document.getElementById("Week_c").style.color="red";
		document.getElementById("Week_c_day").style.color="red";
	}
	//eventInit(DateFor(t),'Week_c_day_content');
	t.setDate(t.getDate()+1);
	document.getElementById("Week_d_day").innerText=DateFor(t);
	if(curr_day==DateFor(t)){
		document.getElementById("Week_d").style.color="red";
		document.getElementById("Week_d_day").style.color="red";
	}	
	//eventInit(DateFor(t),'Week_d_day_content');
	t.setDate(t.getDate()+1);
	document.getElementById("Week_e_day").innerText=DateFor(t);
	if(curr_day==DateFor(t)){
		document.getElementById("Week_e").style.color="red";
		document.getElementById("Week_e_day").style.color="red";
	}	
	//eventInit(DateFor(t),'Week_e_day_content');
	t.setDate(t.getDate()+1);
	document.getElementById("Week_f_day").innerText=DateFor(t);
	if(curr_day==DateFor(t)){
		document.getElementById("Week_f").style.color="red";
		document.getElementById("Week_f_day").style.color="red";
	}	
	//eventInit(DateFor(t),'Week_f_day_content');
	document.getElementById("Week_g_day").innerText=WEEK_END_DAY;
	if(curr_day==WEEK_END_DAY){
		document.getElementById("Week_g").style.color="red";
		document.getElementById("Week_g_day").style.color="red";
	}
	//eventInit(WEEK_END_DAY,'Week_g_day_content');
	
	
}
/**
 * 周视图跳转
 * @author 焦向波
 * @since 2011-06-08
 */
function turnTheWeek(par){
	var bob_week_day = document.getElementById('bob_week_day').value;
	var theDay = parseDate(bob_week_day);
	//alert(theDay);
	if(par=='pre'){
		theDay = new Date(theDay-86400000*7);
	}else {
		theDay = new Date((theDay/1000+86400*7)*1000);
	}
	document.getElementById('bob_week_day').value = DateFor(theDay);
	
	initWeek();	
}
/**
 * 日视图初始化
 * @author 焦向波
 * @since 2011-06-08
 */
function initDay(){
	var show_day = document.getElementById('bob_date_day').value;
	var XQTD=document.getElementById("ShowXQTD");
	var ary=show_day.split('-');
	var t;
	var ary=show_day.split('-');
	t=new Date(ary[1]+'/'+ary[2]+'/'+ary[0]);
	var d=new Array("星期日","星期一","星期二","星期三","星期四","星期五","星期六");
	var curr_XQ=d[t.getDay()];
	XQTD.innerHTML="<font color='red'>"+show_day+",&nbsp;&nbsp;"+curr_XQ+"</font>";
}
/**
 * 日视图跳转
 * @author 焦向波
 * @since 2011-06-08
 * @param par：'pre':前一天；'next':后一天。
 */
function turnTheDay(par){
	var show_day = document.getElementById('bob_date_day').value;
	var tsd = parseDate(show_day);
	var theFdFmt = '';
	if(par=='pre'){
		var fowordD = new Date(tsd-24*60*60*1000);
		theFdFmt = DateFor(fowordD);
	}else{
		var fowordD = new Date((tsd/1000+24*60*60)*1000);
		theFdFmt = DateFor(fowordD);
	}
	
	document.getElementById('bob_date_day').value = theFdFmt;
	initDay();
}
/**
 * @par dataStr format:'yyyy-MM-dd hh:mm:ss.ms'
 * @return Date Object.
 */
function toDateTime(dateStr){
    var result = new Date();
    result.setFullYear(dateStr.substring(0,4));
    var month = dateStr.substring(5,7);
    var monthInt = parseInt(month,10);
    monthInt--;
    if(monthInt<0){
        monthInt = 11;
    }
    result.setMonth(monthInt);
    result.setDate(dateStr.substring(8,10));
    result.setHours(dateStr.substring(11,13));
    result.setMinutes(dateStr.substring(14,16));
    result.setSeconds(dateStr.substring(17,19));
    return result;
}