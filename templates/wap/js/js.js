$(".sea span").click(function(){
$(".search").toggle();
})
$(".search em").click(function(){
$(".search").hide();
})
$(".menua i").click(function(){
$(".search").hide();
})


/*
$(".erji > li").each(function(){
   gaodu= $(this).find("ul").length;
   alert(gaodu);
if(gaodu>0){ $(this).find("fr").addClass("")}
})
*/


$(".xx span").click(function(){
$(".page_menu").animate(({right:"-100%"}));
})

$('.menuimg i').click(function(){
$(".page_menu").animate(({right:"0px"}))

})
$(".fot-a a.fewm").click(function(){
$(".fot-a a.fewm img").toggle();
})

$(".totop").click(function () {
        var speed=800;//滑动的速度
        $('body,html').animate({ scrollTop: 0 }, speed);
        return false;
 });
 function SearchForm(send_url) {
        var reg=/^[\w\u4e00-\u9fa5\s*-]+$/;
         var SearchKey = $("#keywords").val();
         if (SearchKey != ""&&SearchKey!="请输入关键词") {
             if (reg.test(SearchKey)){
                 window.location.href = send_url + "?keyword=" +SearchKey;
             }else{
                 alert("关键词请勿包含非法字符!");
             }
         }
         else { alert("请输入查询关键词!"); }
     }


