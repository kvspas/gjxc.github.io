// menu
$('.menu > li').hover(function(){
    $(this).find('.sub').animate({ opacity:'show', height:'show' },200);
}, function() {
    $('.sub').stop(true,true).hide();
});

// banner
$(".fullSlide").hover(function(){
    $(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.5)
},
function(){
    $(this).find(".prev,.next").fadeOut()
});
$(".fullSlide").slide({
    titCell: ".hd ul",
    mainCell: ".bd ul",
    effect: "fold",
    autoPlay: true,
    autoPage: true,
    trigger: "click",
    startFun: function(i) {
        var curLi = jQuery(".fullSlide .bd li").eq(i);
        if ( !! curLi.attr("_src")) {
            curLi.css("background-image", curLi.attr("_src")).removeAttr("_src")
        }
    }
});

// 内页banner
$(".fullSlidea").hover(function(){
    $(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.5)
},
function(){
    $(this).find(".prev,.next").fadeOut()
});
$(".fullSlidea").slide({
    titCell: ".hd ul",
    mainCell: ".bd ul",
    effect: "fold",
    autoPlay: true,
    autoPage: true,
    trigger: "click",
    startFun: function(i) {
        var curLi = jQuery(".fullSlidea .bd li").eq(i);
        if ( !! curLi.attr("_src")) {
            curLi.css("background-image", curLi.attr("_src")).removeAttr("_src")
        }
    }
});

function SearchForm(send_url) { 
    var reg=/^[\w\u4e00-\u9fa5\s*-]+$/;
    var SearchKey = $("#keywords").val();
    if (SearchKey != ""&&SearchKey!="Please enter a keyword") {
       if (reg.test(SearchKey)){
           window.location.href = send_url + "?keyword=" +SearchKey;
       }else{
           alert("Keywords do not contain illegal characters!");
       }
   }
   else { alert("Please enter the query keyword!"); }
}

$(function () {
    $('.sea span').click(function () {
        $('.sea input').fadeToggle();
    })
})