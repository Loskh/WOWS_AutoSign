var httpurl="http://inside.wows.kongzhong.com/inside/wotinside/signact/signinfo";
var httpurl1="http://inside.wows.kongzhong.com/inside/wotinside/signact/sign";
//var httpurl="http://test.kongzhong.com:8080/inside_wows/wotinside/signact/signinfo";
//var httpurl1="http://test.kongzhong.com:8080/inside_wows/wotinside/signact/sign";
var page_i=1;

var args = getQueryString();
var spa_id = "";
var useraccount = "";
var gameareaid = "";

var jpts="累计签到1天即可<span>获得3000银币</span>";

$(document).ready(function(){
//alert(args.spa_id);//用户id
//alert(args.useraccount);//用户名
//alert(args.gameareaid);//大区
mouseover();
mouseout();
spa_id = args.spa_id;
useraccount = args.useraccount;
gameareaid = args.gameareaid;
	signDayN();
})
//前翻页
function sPrev(){
	page_i--;
	upPage(0,page_i);
}
//后翻页
function sNext(){
	page_i++;
	upPage(1,page_i);
}
//flag 0:prev,1:next ;  page_num:
function upPage(flag,page_num){
	if(flag==0&&page_num<=0){
		page_i = 1;
		return false;
	}
	if(flag==1&&page_num>=4){
		page_i = 3;
		return false;
	}

	for(var i=0;i<3;i++){
		if(page_num==(i+1)){
			$(".sbotdiv"+(i+1)).show();
		}else{
			$(".sbotdiv"+(i+1)).hide();
		}
	}
}

//用户签到

//------------------签到显示-------------------------
//用户签到次数
function signDayN(){
	$.ajax({
				url:httpurl,
				type:"post",
				dataType:"jsonp",
					data:{
						useraccount:spa_id,
						login:useraccount,
						zoneid:gameareaid,
                        marks:"inside"
					},
					jsonp:"jsonpcallback",
					success:function(json){
					var data = eval(json.signlist);
					LightIcon(data.SP_TYPE);
					signLight(data.SP_TYPE);
					if(parseInt(data.SP_TYPE)>21){
						$("#daynum_1").html(21);
						$(".slogin").hide();
						$(".slogin_yqd").show();
					}else{
						$("#daynum_1").html(data.SP_TYPE);
						if(data.SP_FLAG==1){
							$(".slogin").hide();
							$(".slogin_yqd").show();
						}
					}
					
					
				}
			});
}
//显示已领取图标 num：1，2，3点亮图表个数
function LightIcon(num){
	$(".stop span").each(function(i){
		if(num>=7&&num<14&&i==0){
			$(this).css("display","block");
			upPage(1,2);
			page_i=2;
		}else if(num>=14&&num<21){
			if(i==0||i==1){
				$(this).css("display","block");
				upPage(1,3);
				page_i=3;
			}
		}else if(num>=21){
			$(this).css("display","block");
			upPage(1,3);
			page_i=3;
		}
		
	})
}


//签到显示
function signLight(num){
	$(".sbotdiv b").each(function(i){
		if(i<num){
			$(this).css({'display':'block'});
		}
	})
	$(".sbotdiv span").each(function(i){
		if(i==num){
			//$(".sbota").html(""+num+"<span>"+$(this).html()+"</span>");
			$("#daynuma").html(num+1);
			$("#jiangli").html($(this).html());
			jpts="累计签到"+(num+1)+"天即可<span>获得"+$(this).html()+"</span>";
		}
	})
}


//-------------------------------------------------------------
//点击签到
function signN(){
	$.ajax({
		url : httpurl1,
		type : "post",
		dataType : "jsonp",
		data : {
				useraccount:spa_id,
				login:useraccount,
				zoneid:gameareaid,
				marks:"inside"
		},
		jsonp : "jsonpcallback",
		success : function(json) {
				if(json.state==1){
					$(".slogin").hide();
					$(".slogin_yqd").show();
					signDayN();
				}
			}
	});
}


function mouseover(){
	//鼠标悬停指向提示------------------------
	$(".sbotdiv1, .sbotdiv2, .sbotdiv3").mouseover(function(){
		var dayn = $('p',this).html().substring(0,$('p',this).html().length-1);
		$(".sbota").html("累计签到"+dayn+"天即可<span>获得"+$('span',this).html()+"</span>");
	})
	
   //鼠标悬停指向提示------------------------
}
function mouseout(){
	$(".sbotdiv1, .sbotdiv2, .sbotdiv3").mouseout(function(){
		$(".sbota").html(jpts);
	})
}
