/*  
*需要结合jquery和Validform和artdialog一起使用
----------------------------------------------------------*/
function getPopMenu(c, u, p, t) {
    $.getJSON("/tools/ajax_menu.ashx?category=" + c + "&up=" + u, function (data) {
        $.each(data, function (idx, item) {
            $("#" + p).append(t.replace(/\[path\]/g, item.path).replace(/\[title\]/g, item.title));
        });
    });
}
 
//写Cookie
function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

//读Cookie
function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}
//四舍五入函数
function ForDight(Dight, How) {
    Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
    return Dight;
}
//只允许输入数字
function checkNumber(e) {
    var keynum = window.event ? e.keyCode : e.which;
    if ((48 <= keynum && keynum <= 57) || keynum == 8) {
        return true;
    } else {
        return false;
    }
}
//只允许输入小数
function checkForFloat(obj, e) {
    var isOK = false;
    var key = window.event ? e.keyCode : e.which;
    if ((key > 95 && key < 106) || //小键盘上的0到9  
        (key > 47 && key < 60) ||  //大键盘上的0到9  
        (key == 110 && obj.value.indexOf(".") < 0) || //小键盘上的.而且以前没有输入.  
        (key == 190 && obj.value.indexOf(".") < 0) || //大键盘上的.而且以前没有输入.  
         key == 8 || key == 9 || key == 46 || key == 37 || key == 39) {
        isOK = true;
    } else {
        if (window.event) { //IE
            e.returnValue = false;   //event.returnValue=false 效果相同.    
        } else { //Firefox 
            e.preventDefault();
        }
    }  
    return isOK;  
}
//复制文本
function copyText(txt){
    window.clipboardData.setData("Text",txt); 
    var d = dialog({content:'复制成功，可以通过粘贴来发送！'}).show();
    setTimeout(function () {
        d.close().remove();
    }, 2000);
}
//切换验证码
function ToggleCode(obj, codeurl) {
    $(obj).children("img").eq(0).attr("src", codeurl + "?time=" + Math.random());
    return false;
}
//全选取消按钮函数，调用样式如：
function checkAll(chkobj){
    if($(chkobj).text()=="全选"){
        $(chkobj).text("取消");
        $(".checkall").prop("checked", true);
    }else{
        $(chkobj).text("全选");
        $(".checkall").prop("checked", false);
    }
}
//Tab控制选项卡
function tabs(tabObj, event) {
    //绑定事件
    var tabItem = $(tabObj).find(".tab-head ul li a");
    tabItem.bind(event,  function(){
        //设置点击后的切换样式
        tabItem.removeClass("selected");
        $(this).addClass("selected");
        //设置点击后的切换内容
        var tabNum = tabItem.parent().index($(this).parent());
        $(tabObj).find(".tab-content").hide();
        $(tabObj).find(".tab-content").eq(tabNum).show();
    });
}

//显示浮动窗口
function showWindow(obj){
    var tit = $(obj).attr("title");
    var box = $(obj).html();
    dialog({
        width:500,
        title:tit,
        content:box,
        okValue:'确定',
        ok:function (){ }
    }).showModal();
}

/*页面级通用方法
------------------------------------------------*/
//智能浮动层函数
$.fn.smartFloat = function() {
    var position = function(element) {
        var top = element.position().top, pos = element.css("position");
        var w = element.innerWidth();
        $(window).scroll(function() {
            var scrolls = $(this).scrollTop();
            if (scrolls > top) {
                if (window.XMLHttpRequest) {
                    element.css({
                        width: w,
                        position: "fixed",
                        top: 55
                    }); 
                } else {
                    element.css({
                        top: scrolls
                    }); 
                }
            }else {
                element.css({
                    position: pos,
                    top: top
                }); 
            }
        });
    };
    return $(this).each(function() {
        position($(this));                       
    }); 
};
//搜索查询
function SiteSearch(send_url, divTgs, channel_name) {
    alert(1);
    var strwhere = "";
    if (channel_name !== undefined) {
        strwhere = "&channel_name=" + channel_name
    }
    var str = $.trim($(divTgs).val());
    if (str.length > 0 && str != "输入关健字") {
        window.location.href = send_url + "?keyword=" + encodeURI($(divTgs).val()) + strwhere;
    }
    return false;
}
 

//链接下载
function downLink(linkurl) {
    dialog({
        title: '提示',
        content: "需要继续吗？",
        okValue: '确定',
        ok: function () {
            window.location.href = linkurl;
        },
        cancelValue: '取消',
        cancel: function () { }
    }).showModal();

    return false;
}

//链接下载
function downPointLink(point, linkurl) {
    if (point > 0) {
        dialog({
            title: '提示',
            content: "下载需扣除" + point + "个积分<br />重复下载不扣积分，需要继续吗？",
            okValue: '确定',
            ok: function () {
                window.location.href = linkurl;
            },
            cancelValue: '取消',
            cancel: function () { }
        }).showModal();
    } else {
        window.location.href = linkurl;
    }
    return false;
}


//计算积分兑换
function numConvert(obj){
    var maxAmount = parseFloat($("#hideAmount").val()); //总金额
    var pointCashrate = parseFloat($("#hideCashrate").val()); //兑换比例
    var currAmount = parseFloat($(obj).val()); //需要转换的金额
    if(currAmount > maxAmount){
        currAmount = maxAmount;
        $(obj).val(maxAmount);
    }
    var convertPoint = currAmount * pointCashrate;
    $("#convertPoint").text(convertPoint);
}

//执行删除操作
function ExecDelete(sendUrl, checkValue, urlObj){
    //检查传输的值
    if (!checkValue) {
        dialog({title:'提示', content:'对不起，请选中您要操作的记录！', okValue:'确定', ok:function (){}}).showModal();
        return false;
    }
    dialog({
        title: '提示',
        content: '删除记录后不可恢复，您确定吗？',
        okValue: '确定',
        ok: function () {
            $.ajax({
                type: "POST",
                url: sendUrl,
                dataType: "json",
                data: {
                    "checkId": checkValue
                },
                timeout: 20000,
                success: function(data, textStatus) {
                    if (data.status == 1){
                        var tipdialog = dialog({content:data.msg}).show();
                        setTimeout(function () {
                            tipdialog.close().remove();
                            if($(urlObj)){
                                location.href = $(urlObj).val();
                            }else{
                                location.reload();
                            }
                        }, 2000);
                    } else {
                        dialog({title:'提示', content:data.msg, okValue:'确定', ok:function (){}}).showModal();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    dialog({title:'提示', content:'状态：' + textStatus + '；出错提示：' + errorThrown, okValue:'确定', ok:function (){}}).showModal();
                }
            });
        },
        cancelValue: '取消',
        cancel: function () { }
    }).showModal();
}

//单击执行AJAX请求操作
function clickSubmit(sendUrl){
    $.ajax({
        type: "POST",
        url: sendUrl,
        dataType: "json",
        timeout: 20000,
        success: function(data, textStatus) {
            if (data.status == 1){
                var d = dialog({content:data.msg}).show();
                setTimeout(function () {
                    d.close().remove();
                    location.reload();
                }, 2000);
            } else {
                dialog({title:'提示', content:data.msg, okValue:'确定', ok:function (){}}).showModal();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            dialog({title:'提示', content:"状态：" + textStatus + "；出错提示：" + errorThrown, okValue:'确定', ok:function (){}}).showModal();
        }
    });
}

//=====================发送验证邮件=====================
function sendEmail(username, sendurl) {
    if(username == ""){
        dialog({title:'提示', content:'对不起，用户名不允许为空！', okValue:'确定', ok:function (){}}).showModal();
        return false;
    }
    //提交发生的
    $.ajax({
        url: sendurl,
        type: "POST",
        timeout: 60000,
        data: { "username": username },
        dataType: "json",
        success: function (data, type) {
            if (data.status == 1) {
                var d = dialog({content:data.msg}).show();
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            } else {
                dialog({title:'提示', content:data.msg, okValue:'确定', ok:function (){}}).showModal();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
             dialog({title:'提示', content:"状态：" + textStatus + "；出错提示：" + errorThrown, okValue:'确定', ok:function (){}}).showModal();
        }
    });
}
//=====================发送手机短信验证码=====================
var wait = 0; //计算变量
function sendSMS(btnObj, valObj, sendUrl) {
    if($(valObj).val() == ""){
        dialog({title:'提示', content:'对不起，请填写手机号码后再获取！', okValue:'确定', ok:function (){}}).showModal();
        return false;
    }
    //发送AJAX请求
    $.ajax({
        url: sendUrl,
        type: "POST",
        timeout: 60000,
        data: { "mobile": $(valObj).val() },
        dataType: "json",
        beforeSend: function(XMLHttpRequest) {
            $(btnObj).unbind("click").removeAttr("onclick"); //移除按钮事件
        },
        success: function (data, type) {
            if (data.status == 1) {
                wait = data.time * 60; //赋值时间
                time(); //调用计算器
                var d = dialog({content:data.msg}).show();
                setTimeout(function () {
                    d.close().remove();
                }, 2000);
            } else {
                $(btnObj).removeClass("gray").text("发送确认码");
                $(btnObj).bind("click", function(){
                    sendSMS(btnObj, valObj, sendurl); //重新绑定事件
                });
                dialog({title:'提示', content:data.msg, okValue:'确定', ok:function (){}}).showModal();
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown){
            $(btnObj).removeClass("gray").text("发送确认码");
            $(btnObj).bind("click", function(){
                sendSMS(btnObj, valObj, sendurl); //重新绑定事件
            });
            dialog({title:'提示', content:"状态：" + textStatus + "；出错提示：" + errorThrown, okValue:'确定', ok:function (){}}).showModal();
        }
    });
    //倒计时计算器
    function time(){
        if (wait == 0) {
            $(btnObj).removeClass("gray").text("发送确认码");
            $(btnObj).bind("click", function(){
                sendSMS(btnObj, valObj, sendurl); //重新绑定事件
            });
        }else{
            $(btnObj).addClass("gray").text("重新发送(" + wait + ")");
            wait--;
            setTimeout(function() {
                time(btnObj);
            },1000)
        }
    }
}

/*表单AJAX提交封装(包含验证)
------------------------------------------------*/
function AjaxInitForm(formObj, btnObj, isDialog, urlObj, callback){
    var argNum = arguments.length; //参数个数
    $(formObj).Validform({
        tiptype:3,
        callback:function(form){
            //AJAX提交表单
            $(form).ajaxSubmit({
                beforeSubmit: formRequest,
                success: formResponse,
                error: formError,
                url: $(formObj).attr("url"),
                type: "post",
                dataType: "json",
                timeout: 60000
            });
            return false;
        }
    });
    
    //表单提交前
    function formRequest(formData, jqForm, options) {
        $(btnObj).prop("disabled", true);
        $(btnObj).val("提交中...");
    }

    //表单提交后
    function formResponse(data, textStatus) {
        if (data.status == 1) {
            $(btnObj).val("提交成功");
            //是否提示，默认不提示
            if(isDialog == 1){
                var d = dialog({content:data.msg}).show();
                setTimeout(function () {
                    d.close().remove();
                    if (argNum == 5) {
                        callback();
                    }else if(data.url){
                        location.href = data.url;
                    }else if($(urlObj).length > 0 && $(urlObj).val() != ""){
                        location.href = $(urlObj).val();
                    }else{
                        location.reload();
                    }
                }, 2000);
            }else{
                if (argNum == 5) {
                    callback();
                }else if(data.url){
                    location.href = data.url;
                }else if($(urlObj)){
                    location.href = $(urlObj).val();
                }else{
                    location.reload();
                }
            }
        } else {
            dialog({title:'Prompt', content:data.msg, okValue:'OK', ok:function (){}}).showModal();
            $(btnObj).prop("disabled", false);
            $(btnObj).val("Submit again");
        }
    }
    //表单提交出错
    function formError(XMLHttpRequest, textStatus, errorThrown) {
        dialog({title:'提示', content:'状态：'+textStatus+'；出错提示：'+errorThrown, okValue:'确定', ok:function (){}}).showModal();
        $(btnObj).prop("disabled", false);
        $(btnObj).val("再次提交");
    }
}
//显示评论AJAX分页列表
function AjaxPageList(listDiv, pageDiv, pageSize, pageCount, sendUrl, defaultAvatar) {
    //pageIndex -页面索引初始值
    //pageSize -每页显示条数初始化
    //pageCount -取得总页数
    InitComment(0);//初始化评论数据
    $(pageDiv).pagination(pageCount, {
        callback: pageselectCallback,
        prev_text: "« 上一页",
        next_text: "下一页 »",
        items_per_page:pageSize,
        num_display_entries:3,
        current_page:0,
        num_edge_entries:5,
        link_to:"javascript:;"
    });
    
    //分页点击事件
    function pageselectCallback(page_id, jq) {
        InitComment(page_id);
    }
    //请求评论数据
    function InitComment(page_id) {                                
        page_id++;
        $.ajax({ 
            type: "POST",
            dataType: "json",
            url: sendUrl + "&page_size=" + pageSize + "&page_index=" + page_id,
            beforeSend: function (XMLHttpRequest) {
                $(listDiv).html('<p style="line-height:35px;">正在狠努力加载，请稍候...</p>');
            },
            success: function(data) {
                var strHtml = '';
                for(var i in data){
                    strHtml += '<li>' + 
                    '<div class="avatar">';
                    if(typeof(data[i].avatar) != "undefined"){
                        strHtml += '<img src="' + data[i].avatar + '" />';
                    }else{
                        strHtml += '<img src="' + defaultAvatar + '" />';
                    }
                    strHtml += '</div>' +
                    '<div class="inner">' +
                    '<p>' + unescape(data[i].content) + '</p>' +
                    '<div class="meta">' +
                    '<span class="blue">' + data[i].user_name + '</span>\n' +
                    '<span class="time">' + data[i].add_time + '</span>' +
                    '</div>' +
                    '</div>';
                    if(data[i].is_reply == 1){
                        strHtml += '<div class="answer">' +
                        '<div class="meta">' +
                        '<span class="right time">' + data[i].reply_time + '</span>' +
                        '<span class="blue">管理员回复：</span>' +
                        '</div>' + 
                        '<p>' + unescape(data[i].reply_content) + '</p>' +
                        '</div>';
                    }
                    strHtml += '</li>';
                }
                $(listDiv).html(strHtml);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                $(listDiv).html('<p style="line-height:35px;text-align:center;border:1px solid #f7f7f7;">暂无评论，快来抢沙发吧！</p>');
            }
        });
    }
}

//初始化视频播放器需配合ckplayer.js使用
function initCKPlayer(boxId, videoSrc, playerSrc){
    var flashvars={
        f:videoSrc,
        c:0,
        loaded:'loadedHandler'
    };
    var video=[videoSrc];
    CKobject.embed(playerSrc,boxId,'video_v1','100%','100%',false,flashvars,video);
}


//在线客服
//右侧 点击向上 按钮
jQuery(document).ready(function ($) {
    var offset = 300,
        offset_opacity = 1200,
        scroll_top_duration = 700,
        $back_to_top = $('.cd-top');
    $(window).scroll(function () {
        ($(this).scrollTop() > offset) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
        if ($(this).scrollTop() > offset_opacity) {
            $back_to_top.addClass('cd-fade-out');
        }
    });
    $back_to_top.on('click', function (event) {
        event.preventDefault();
        $('body,html').animate({ scrollTop: 0 }, scroll_top_duration
        );
    });
});


//浮动右侧在线客服
$(function () {
    var KF = $(".keifu");
    var wkbox = $(".keifu_box");
    var kf_close = $(".keifu .keifu_close");
    var icon_keifu = $(".icon_keifu");
    var kH = wkbox.height();
    var kW = wkbox.width();
    var wH = $(window).height();
    KF.css({ height: kH });
    icon_keifu.css("top", 0);
    var KF_top = (wH - kH) / 2;
    if (KF_top < 0) KF_top = 0;
    KF.css("top", 120);

    $(kf_close).click(function () {
        KF.animate({ width: "0" }, 200, function () {
            wkbox.hide();
            icon_keifu.show();
            KF.animate({ width: 26 }, 300);
        });
    });
    $(icon_keifu).click(function () {
        $(this).hide();
        wkbox.show();
        KF.animate({ width: kW }, 200);
    });
});

//浮动左侧在线留言
$(function () {
    var lybox = $(".SfMessBody");
    var ly_Icon = document.getElementById("SfMessHeadIcon");
    var ly_close = $(".SfMessWrap .SfMessIconClose");
    var ly_open = $(".SfMessWrap .SfMessIconOpen");
    $(ly_Icon).click(function () {
        if (ly_Icon.className == "SfMessIconClose") {
            ly_Icon.className = "SfMessIconOpen";
            lybox.hide();
        } else {
            ly_Icon.className = "SfMessIconClose";
            lybox.show();
        }
    });
});




/*! fancyBox v2.1.4 fancyapps.com | fancyapps.com/fancybox/#license 弹出层*/
(function (C, z, f, r) {
    var q = f(C), n = f(z), b = f.fancybox = function () { b.open.apply(this, arguments) }, H = navigator.userAgent.match(/msie/), w = null, s = z.createTouch !== r, t = function (a) { return a && a.hasOwnProperty && a instanceof f }, p = function (a) { return a && "string" === f.type(a) }, F = function (a) { return p(a) && 0 < a.indexOf("%") }, l = function (a, d) { var e = parseInt(a, 10) || 0; d && F(a) && (e *= b.getViewport()[d] / 100); return Math.ceil(e) }, x = function (a, b) { return l(a, b) + "px" }; f.extend(b, {
        version: "2.1.4", defaults: {
            padding: 15, margin: 20, width: 800,
            height: 600, minWidth: 100, minHeight: 100, maxWidth: 9999, maxHeight: 9999, autoSize: !0, autoHeight: !1, autoWidth: !1, autoResize: !0, autoCenter: !s, fitToView: !0, aspectRatio: !1, topRatio: 0.5, leftRatio: 0.5, scrolling: "auto", wrapCSS: "", arrows: !0, closeBtn: !0, closeClick: !1, nextClick: !1, mouseWheel: !0, autoPlay: !1, playSpeed: 3E3, preload: 3, modal: !1, loop: !0, ajax: { dataType: "html", headers: { "X-fancyBox": !0 } }, iframe: { scrolling: "auto", preload: !0 }, swf: { wmode: "transparent", allowfullscreen: "true", allowscriptaccess: "always" }, keys: {
                next: {
                    13: "left",
                    34: "up", 39: "left", 40: "up"
                }, prev: { 8: "right", 33: "down", 37: "right", 38: "down" }, close: [27], play: [32], toggle: [70]
            }, direction: { next: "left", prev: "right" }, scrollOutside: !0, index: 0, type: null, href: null, content: null, title: null, tpl: {
                wrap: '<div class="fancybox-wrap" tabIndex="-1"><div class="fancybox-skin"><div class="fancybox-outer"><div class="fancybox-inner"></div></div></div></div>', image: '<img class="fancybox-image" src="{href}" alt="" />', iframe: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen' +
                (H ? ' allowtransparency="true"' : "") + "></iframe>", error: '<p class="fancybox-error">The requested content cannot be loaded.<br/>Please try again later.</p>', closeBtn: '<a title="Close" class="fancybox-item fancybox-close" href="javascript:;"></a>', next: '<a title="Next" class="fancybox-nav fancybox-next" href="javascript:;"><span></span></a>', prev: '<a title="Previous" class="fancybox-nav fancybox-prev" href="javascript:;"><span></span></a>'
            }, openEffect: "fade", openSpeed: 250, openEasing: "swing", openOpacity: !0,
            openMethod: "zoomIn", closeEffect: "fade", closeSpeed: 250, closeEasing: "swing", closeOpacity: !0, closeMethod: "zoomOut", nextEffect: "elastic", nextSpeed: 250, nextEasing: "swing", nextMethod: "changeIn", prevEffect: "elastic", prevSpeed: 250, prevEasing: "swing", prevMethod: "changeOut", helpers: { overlay: !0, title: !0 }, onCancel: f.noop, beforeLoad: f.noop, afterLoad: f.noop, beforeShow: f.noop, afterShow: f.noop, beforeChange: f.noop, beforeClose: f.noop, afterClose: f.noop
        }, group: {}, opts: {}, previous: null, coming: null, current: null, isActive: !1,
        isOpen: !1, isOpened: !1, wrap: null, skin: null, outer: null, inner: null, player: { timer: null, isActive: !1 }, ajaxLoad: null, imgPreload: null, transitions: {}, helpers: {}, open: function (a, d) {
            if (a && (f.isPlainObject(d) || (d = {}), !1 !== b.close(!0))) return f.isArray(a) || (a = t(a) ? f(a).get() : [a]), f.each(a, function (e, c) {
                var k = {}, g, h, j, m, l; "object" === f.type(c) && (c.nodeType && (c = f(c)), t(c) ? (k = { href: c.data("fancybox-href") || c.attr("href"), title: c.data("fancybox-title") || c.attr("title"), isDom: !0, element: c }, f.metadata && f.extend(!0, k,
                c.metadata())) : k = c); g = d.href || k.href || (p(c) ? c : null); h = d.title !== r ? d.title : k.title || ""; m = (j = d.content || k.content) ? "html" : d.type || k.type; !m && k.isDom && (m = c.data("fancybox-type"), m || (m = (m = c.prop("class").match(/fancybox\.(\w+)/)) ? m[1] : null)); p(g) && (m || (b.isImage(g) ? m = "image" : b.isSWF(g) ? m = "swf" : "#" === g.charAt(0) ? m = "inline" : p(c) && (m = "html", j = c)), "ajax" === m && (l = g.split(/\s+/, 2), g = l.shift(), l = l.shift())); j || ("inline" === m ? g ? j = f(p(g) ? g.replace(/.*(?=#[^\s]+$)/, "") : g) : k.isDom && (j = c) : "html" === m ? j = g : !m && (!g &&
                k.isDom) && (m = "inline", j = c)); f.extend(k, { href: g, type: m, content: j, title: h, selector: l }); a[e] = k
            }), b.opts = f.extend(!0, {}, b.defaults, d), d.keys !== r && (b.opts.keys = d.keys ? f.extend({}, b.defaults.keys, d.keys) : !1), b.group = a, b._start(b.opts.index)
        }, cancel: function () {
            var a = b.coming; a && !1 !== b.trigger("onCancel") && (b.hideLoading(), b.ajaxLoad && b.ajaxLoad.abort(), b.ajaxLoad = null, b.imgPreload && (b.imgPreload.onload = b.imgPreload.onerror = null), a.wrap && a.wrap.stop(!0, !0).trigger("onReset").remove(), b.coming = null, b.current ||
            b._afterZoomOut(a))
        }, close: function (a) { b.cancel(); !1 !== b.trigger("beforeClose") && (b.unbindEvents(), b.isActive && (!b.isOpen || !0 === a ? (f(".fancybox-wrap").stop(!0).trigger("onReset").remove(), b._afterZoomOut()) : (b.isOpen = b.isOpened = !1, b.isClosing = !0, f(".fancybox-item, .fancybox-nav").remove(), b.wrap.stop(!0, !0).removeClass("fancybox-opened"), b.transitions[b.current.closeMethod]()))) }, play: function (a) {
            var d = function () { clearTimeout(b.player.timer) }, e = function () {
                d(); b.current && b.player.isActive && (b.player.timer =
                setTimeout(b.next, b.current.playSpeed))
            }, c = function () { d(); f("body").unbind(".player"); b.player.isActive = !1; b.trigger("onPlayEnd") }; if (!0 === a || !b.player.isActive && !1 !== a) { if (b.current && (b.current.loop || b.current.index < b.group.length - 1)) b.player.isActive = !0, f("body").bind({ "afterShow.player onUpdate.player": e, "onCancel.player beforeClose.player": c, "beforeLoad.player": d }), e(), b.trigger("onPlayStart") } else c()
        }, next: function (a) { var d = b.current; d && (p(a) || (a = d.direction.next), b.jumpto(d.index + 1, a, "next")) },
        prev: function (a) { var d = b.current; d && (p(a) || (a = d.direction.prev), b.jumpto(d.index - 1, a, "prev")) }, jumpto: function (a, d, e) { var c = b.current; c && (a = l(a), b.direction = d || c.direction[a >= c.index ? "next" : "prev"], b.router = e || "jumpto", c.loop && (0 > a && (a = c.group.length + a % c.group.length), a %= c.group.length), c.group[a] !== r && (b.cancel(), b._start(a))) }, reposition: function (a, d) {
            var e = b.current, c = e ? e.wrap : null, k; c && (k = b._getPosition(d), a && "scroll" === a.type ? (delete k.position, c.stop(!0, !0).animate(k, 200)) : (c.css(k), e.pos = f.extend({},
            e.dim, k)))
        }, update: function (a) { var d = a && a.type, e = !d || "orientationchange" === d; e && (clearTimeout(w), w = null); b.isOpen && !w && (w = setTimeout(function () { var c = b.current; c && !b.isClosing && (b.wrap.removeClass("fancybox-tmp"), (e || "load" === d || "resize" === d && c.autoResize) && b._setDimension(), "scroll" === d && c.canShrink || b.reposition(a), b.trigger("onUpdate"), w = null) }, e && !s ? 0 : 300)) }, toggle: function (a) {
            b.isOpen && (b.current.fitToView = "boolean" === f.type(a) ? a : !b.current.fitToView, s && (b.wrap.removeAttr("style").addClass("fancybox-tmp"),
            b.trigger("onUpdate")), b.update())
        }, hideLoading: function () { n.unbind(".loading"); f("#fancybox-loading").remove() }, showLoading: function () { var a, d; b.hideLoading(); a = f('<div id="fancybox-loading"><div></div></div>').click(b.cancel).appendTo("body"); n.bind("keydown.loading", function (a) { if (27 === (a.which || a.keyCode)) a.preventDefault(), b.cancel() }); b.defaults.fixed || (d = b.getViewport(), a.css({ position: "absolute", top: 0.5 * d.h + d.y, left: 0.5 * d.w + d.x })) }, getViewport: function () {
            var a = b.current && b.current.locked ||
            !1, d = { x: q.scrollLeft(), y: q.scrollTop() }; a ? (d.w = a[0].clientWidth, d.h = a[0].clientHeight) : (d.w = s && C.innerWidth ? C.innerWidth : q.width(), d.h = s && C.innerHeight ? C.innerHeight : q.height()); return d
        }, unbindEvents: function () { b.wrap && t(b.wrap) && b.wrap.unbind(".fb"); n.unbind(".fb"); q.unbind(".fb") }, bindEvents: function () {
            var a = b.current, d; a && (q.bind("orientationchange.fb" + (s ? "" : " resize.fb") + (a.autoCenter && !a.locked ? " scroll.fb" : ""), b.update), (d = a.keys) && n.bind("keydown.fb", function (e) {
                var c = e.which || e.keyCode, k =
                e.target || e.srcElement; if (27 === c && b.coming) return !1; !e.ctrlKey && (!e.altKey && !e.shiftKey && !e.metaKey && (!k || !k.type && !f(k).is("[contenteditable]"))) && f.each(d, function (d, k) { if (1 < a.group.length && k[c] !== r) return b[d](k[c]), e.preventDefault(), !1; if (-1 < f.inArray(c, k)) return b[d](), e.preventDefault(), !1 })
            }), f.fn.mousewheel && a.mouseWheel && b.wrap.bind("mousewheel.fb", function (d, c, k, g) {
                for (var h = f(d.target || null), j = !1; h.length && !j && !h.is(".fancybox-skin") && !h.is(".fancybox-wrap") ;) j = h[0] && !(h[0].style.overflow &&
                "hidden" === h[0].style.overflow) && (h[0].clientWidth && h[0].scrollWidth > h[0].clientWidth || h[0].clientHeight && h[0].scrollHeight > h[0].clientHeight), h = f(h).parent(); if (0 !== c && !j && 1 < b.group.length && !a.canShrink) { if (0 < g || 0 < k) b.prev(0 < g ? "down" : "left"); else if (0 > g || 0 > k) b.next(0 > g ? "up" : "right"); d.preventDefault() }
            }))
        }, trigger: function (a, d) {
            var e, c = d || b.coming || b.current; if (c) {
                f.isFunction(c[a]) && (e = c[a].apply(c, Array.prototype.slice.call(arguments, 1))); if (!1 === e) return !1; c.helpers && f.each(c.helpers, function (d,
                e) { e && (b.helpers[d] && f.isFunction(b.helpers[d][a])) && (e = f.extend(!0, {}, b.helpers[d].defaults, e), b.helpers[d][a](e, c)) }); f.event.trigger(a + ".fb")
            }
        }, isImage: function (a) { return p(a) && a.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp)((\?|#).*)?$)/i) }, isSWF: function (a) { return p(a) && a.match(/\.(swf)((\?|#).*)?$/i) }, _start: function (a) {
            var d = {}, e, c; a = l(a); e = b.group[a] || null; if (!e) return !1; d = f.extend(!0, {}, b.opts, e); e = d.margin; c = d.padding; "number" === f.type(e) && (d.margin = [e, e, e, e]); "number" === f.type(c) &&
            (d.padding = [c, c, c, c]); d.modal && f.extend(!0, d, { closeBtn: !1, closeClick: !1, nextClick: !1, arrows: !1, mouseWheel: !1, keys: null, helpers: { overlay: { closeClick: !1 } } }); d.autoSize && (d.autoWidth = d.autoHeight = !0); "auto" === d.width && (d.autoWidth = !0); "auto" === d.height && (d.autoHeight = !0); d.group = b.group; d.index = a; b.coming = d; if (!1 === b.trigger("beforeLoad")) b.coming = null; else {
                c = d.type; e = d.href; if (!c) return b.coming = null, b.current && b.router && "jumpto" !== b.router ? (b.current.index = a, b[b.router](b.direction)) : !1; b.isActive =
                !0; if ("image" === c || "swf" === c) d.autoHeight = d.autoWidth = !1, d.scrolling = "visible"; "image" === c && (d.aspectRatio = !0); "iframe" === c && s && (d.scrolling = "scroll"); d.wrap = f(d.tpl.wrap).addClass("fancybox-" + (s ? "mobile" : "desktop") + " fancybox-type-" + c + " fancybox-tmp " + d.wrapCSS).appendTo(d.parent || "body"); f.extend(d, { skin: f(".fancybox-skin", d.wrap), outer: f(".fancybox-outer", d.wrap), inner: f(".fancybox-inner", d.wrap) }); f.each(["Top", "Right", "Bottom", "Left"], function (a, b) { d.skin.css("padding" + b, x(d.padding[a])) }); b.trigger("onReady");
                if ("inline" === c || "html" === c) { if (!d.content || !d.content.length) return b._error("content") } else if (!e) return b._error("href"); "image" === c ? b._loadImage() : "ajax" === c ? b._loadAjax() : "iframe" === c ? b._loadIframe() : b._afterLoad()
            }
        }, _error: function (a) { f.extend(b.coming, { type: "html", autoWidth: !0, autoHeight: !0, minWidth: 0, minHeight: 0, scrolling: "no", hasError: a, content: b.coming.tpl.error }); b._afterLoad() }, _loadImage: function () {
            var a = b.imgPreload = new Image; a.onload = function () {
                this.onload = this.onerror = null; b.coming.width =
                this.width; b.coming.height = this.height; b._afterLoad()
            }; a.onerror = function () { this.onload = this.onerror = null; b._error("image") }; a.src = b.coming.href; !0 !== a.complete && b.showLoading()
        }, _loadAjax: function () { var a = b.coming; b.showLoading(); b.ajaxLoad = f.ajax(f.extend({}, a.ajax, { url: a.href, error: function (a, e) { b.coming && "abort" !== e ? b._error("ajax", a) : b.hideLoading() }, success: function (d, e) { "success" === e && (a.content = d, b._afterLoad()) } })) }, _loadIframe: function () {
            var a = b.coming, d = f(a.tpl.iframe.replace(/\{rnd\}/g,
            (new Date).getTime())).attr("scrolling", s ? "auto" : a.iframe.scrolling).attr("src", a.href); f(a.wrap).bind("onReset", function () { try { f(this).find("iframe").hide().attr("src", "//about:blank").end().empty() } catch (a) { } }); a.iframe.preload && (b.showLoading(), d.one("load", function () { f(this).data("ready", 1); s || f(this).bind("load.fb", b.update); f(this).parents(".fancybox-wrap").width("100%").removeClass("fancybox-tmp").show(); b._afterLoad() })); a.content = d.appendTo(a.inner); a.iframe.preload || b._afterLoad()
        }, _preloadImages: function () {
            var a =
            b.group, d = b.current, e = a.length, c = d.preload ? Math.min(d.preload, e - 1) : 0, f, g; for (g = 1; g <= c; g += 1) f = a[(d.index + g) % e], "image" === f.type && f.href && ((new Image).src = f.href)
        }, _afterLoad: function () {
            var a = b.coming, d = b.current, e, c, k, g, h; b.hideLoading(); if (a && !1 !== b.isActive) if (!1 === b.trigger("afterLoad", a, d)) a.wrap.stop(!0).trigger("onReset").remove(), b.coming = null; else {
                d && (b.trigger("beforeChange", d), d.wrap.stop(!0).removeClass("fancybox-opened").find(".fancybox-item, .fancybox-nav").remove()); b.unbindEvents();
                e = a.content; c = a.type; k = a.scrolling; f.extend(b, { wrap: a.wrap, skin: a.skin, outer: a.outer, inner: a.inner, current: a, previous: d }); g = a.href; switch (c) {
                    case "inline": case "ajax": case "html": a.selector ? e = f("<div>").html(e).find(a.selector) : t(e) && (e.data("fancybox-placeholder") || e.data("fancybox-placeholder", f('<div class="fancybox-placeholder"></div>').insertAfter(e).hide()), e = e.show().detach(), a.wrap.bind("onReset", function () {
                        f(this).find(e).length && e.hide().replaceAll(e.data("fancybox-placeholder")).data("fancybox-placeholder",
                        !1)
                    })); break; case "image": e = a.tpl.image.replace("{href}", g); break; case "swf": e = '<object id="fancybox-swf" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="100%" height="100%"><param name="movie" value="' + g + '"></param>', h = "", f.each(a.swf, function (a, b) { e += '<param name="' + a + '" value="' + b + '"></param>'; h += " " + a + '="' + b + '"' }), e += '<embed src="' + g + '" type="application/x-shockwave-flash" width="100%" height="100%"' + h + "></embed></object>"
                } (!t(e) || !e.parent().is(a.inner)) && a.inner.append(e); b.trigger("beforeShow");
                a.inner.css("overflow", "yes" === k ? "scroll" : "no" === k ? "hidden" : k); b._setDimension(); b.reposition(); b.isOpen = !1; b.coming = null; b.bindEvents(); if (b.isOpened) { if (d.prevMethod) b.transitions[d.prevMethod]() } else f(".fancybox-wrap").not(a.wrap).stop(!0).trigger("onReset").remove(); b.transitions[b.isOpened ? a.nextMethod : a.openMethod](); b._preloadImages()
            }
        }, _setDimension: function () {
            var a = b.getViewport(), d = 0, e = !1, c = !1, e = b.wrap, k = b.skin, g = b.inner, h = b.current, c = h.width, j = h.height, m = h.minWidth, u = h.minHeight, n = h.maxWidth,
            v = h.maxHeight, s = h.scrolling, q = h.scrollOutside ? h.scrollbarWidth : 0, y = h.margin, p = l(y[1] + y[3]), r = l(y[0] + y[2]), z, A, t, D, B, G, C, E, w; e.add(k).add(g).width("auto").height("auto").removeClass("fancybox-tmp"); y = l(k.outerWidth(!0) - k.width()); z = l(k.outerHeight(!0) - k.height()); A = p + y; t = r + z; D = F(c) ? (a.w - A) * l(c) / 100 : c; B = F(j) ? (a.h - t) * l(j) / 100 : j; if ("iframe" === h.type) {
                if (w = h.content, h.autoHeight && 1 === w.data("ready")) try {
                    w[0].contentWindow.document.location && (g.width(D).height(9999), G = w.contents().find("body"), q && G.css("overflow-x",
                    "hidden"), B = G.height())
                } catch (H) { }
            } else if (h.autoWidth || h.autoHeight) g.addClass("fancybox-tmp"), h.autoWidth || g.width(D), h.autoHeight || g.height(B), h.autoWidth && (D = g.width()), h.autoHeight && (B = g.height()), g.removeClass("fancybox-tmp"); c = l(D); j = l(B); E = D / B; m = l(F(m) ? l(m, "w") - A : m); n = l(F(n) ? l(n, "w") - A : n); u = l(F(u) ? l(u, "h") - t : u); v = l(F(v) ? l(v, "h") - t : v); G = n; C = v; h.fitToView && (n = Math.min(a.w - A, n), v = Math.min(a.h - t, v)); A = a.w - p; r = a.h - r; h.aspectRatio ? (c > n && (c = n, j = l(c / E)), j > v && (j = v, c = l(j * E)), c < m && (c = m, j = l(c / E)), j < u &&
            (j = u, c = l(j * E))) : (c = Math.max(m, Math.min(c, n)), h.autoHeight && "iframe" !== h.type && (g.width(c), j = g.height()), j = Math.max(u, Math.min(j, v))); if (h.fitToView) if (g.width(c).height(j), e.width(c + y), a = e.width(), p = e.height(), h.aspectRatio) for (; (a > A || p > r) && (c > m && j > u) && !(19 < d++) ;) j = Math.max(u, Math.min(v, j - 10)), c = l(j * E), c < m && (c = m, j = l(c / E)), c > n && (c = n, j = l(c / E)), g.width(c).height(j), e.width(c + y), a = e.width(), p = e.height(); else c = Math.max(m, Math.min(c, c - (a - A))), j = Math.max(u, Math.min(j, j - (p - r))); q && ("auto" === s && j < B && c + y +
            q < A) && (c += q); g.width(c).height(j); e.width(c + y); a = e.width(); p = e.height(); e = (a > A || p > r) && c > m && j > u; c = h.aspectRatio ? c < G && j < C && c < D && j < B : (c < G || j < C) && (c < D || j < B); f.extend(h, { dim: { width: x(a), height: x(p) }, origWidth: D, origHeight: B, canShrink: e, canExpand: c, wPadding: y, hPadding: z, wrapSpace: p - k.outerHeight(!0), skinSpace: k.height() - j }); !w && (h.autoHeight && j > u && j < v && !c) && g.height("auto")
        }, _getPosition: function (a) {
            var d = b.current, e = b.getViewport(), c = d.margin, f = b.wrap.width() + c[1] + c[3], g = b.wrap.height() + c[0] + c[2], c = {
                position: "absolute",
                top: c[0], left: c[3]
            }; d.autoCenter && d.fixed && !a && g <= e.h && f <= e.w ? c.position = "fixed" : d.locked || (c.top += e.y, c.left += e.x); c.top = x(Math.max(c.top, c.top + (e.h - g) * d.topRatio)); c.left = x(Math.max(c.left, c.left + (e.w - f) * d.leftRatio)); return c
        }, _afterZoomIn: function () {
            var a = b.current; a && (b.isOpen = b.isOpened = !0, b.wrap.css("overflow", "visible").addClass("fancybox-opened"), b.update(), (a.closeClick || a.nextClick && 1 < b.group.length) && b.inner.css("cursor", "pointer").bind("click.fb", function (d) {
                !f(d.target).is("a") && !f(d.target).parent().is("a") &&
                (d.preventDefault(), b[a.closeClick ? "close" : "next"]())
            }), a.closeBtn && f(a.tpl.closeBtn).appendTo(b.skin).bind("click.fb", function (a) { a.preventDefault(); b.close() }), a.arrows && 1 < b.group.length && ((a.loop || 0 < a.index) && f(a.tpl.prev).appendTo(b.outer).bind("click.fb", b.prev), (a.loop || a.index < b.group.length - 1) && f(a.tpl.next).appendTo(b.outer).bind("click.fb", b.next)), b.trigger("afterShow"), !a.loop && a.index === a.group.length - 1 ? b.play(!1) : b.opts.autoPlay && !b.player.isActive && (b.opts.autoPlay = !1, b.play()))
        }, _afterZoomOut: function (a) {
            a =
            a || b.current; f(".fancybox-wrap").trigger("onReset").remove(); f.extend(b, { group: {}, opts: {}, router: !1, current: null, isActive: !1, isOpened: !1, isOpen: !1, isClosing: !1, wrap: null, skin: null, outer: null, inner: null }); b.trigger("afterClose", a)
        }
    }); b.transitions = {
        getOrigPosition: function () {
            var a = b.current, d = a.element, e = a.orig, c = {}, f = 50, g = 50, h = a.hPadding, j = a.wPadding, m = b.getViewport(); !e && (a.isDom && d.is(":visible")) && (e = d.find("img:first"), e.length || (e = d)); t(e) ? (c = e.offset(), e.is("img") && (f = e.outerWidth(), g = e.outerHeight())) :
            (c.top = m.y + (m.h - g) * a.topRatio, c.left = m.x + (m.w - f) * a.leftRatio); if ("fixed" === b.wrap.css("position") || a.locked) c.top -= m.y, c.left -= m.x; return c = { top: x(c.top - h * a.topRatio), left: x(c.left - j * a.leftRatio), width: x(f + j), height: x(g + h) }
        }, step: function (a, d) {
            var e, c, f = d.prop; c = b.current; var g = c.wrapSpace, h = c.skinSpace; if ("width" === f || "height" === f) e = d.end === d.start ? 1 : (a - d.start) / (d.end - d.start), b.isClosing && (e = 1 - e), c = "width" === f ? c.wPadding : c.hPadding, c = a - c, b.skin[f](l("width" === f ? c : c - g * e)), b.inner[f](l("width" ===
            f ? c : c - g * e - h * e))
        }, zoomIn: function () { var a = b.current, d = a.pos, e = a.openEffect, c = "elastic" === e, k = f.extend({ opacity: 1 }, d); delete k.position; c ? (d = this.getOrigPosition(), a.openOpacity && (d.opacity = 0.1)) : "fade" === e && (d.opacity = 0.1); b.wrap.css(d).animate(k, { duration: "none" === e ? 0 : a.openSpeed, easing: a.openEasing, step: c ? this.step : null, complete: b._afterZoomIn }) }, zoomOut: function () {
            var a = b.current, d = a.closeEffect, e = "elastic" === d, c = { opacity: 0.1 }; e && (c = this.getOrigPosition(), a.closeOpacity && (c.opacity = 0.1)); b.wrap.animate(c,
            { duration: "none" === d ? 0 : a.closeSpeed, easing: a.closeEasing, step: e ? this.step : null, complete: b._afterZoomOut })
        }, changeIn: function () { var a = b.current, d = a.nextEffect, e = a.pos, c = { opacity: 1 }, f = b.direction, g; e.opacity = 0.1; "elastic" === d && (g = "down" === f || "up" === f ? "top" : "left", "down" === f || "right" === f ? (e[g] = x(l(e[g]) - 200), c[g] = "+=200px") : (e[g] = x(l(e[g]) + 200), c[g] = "-=200px")); "none" === d ? b._afterZoomIn() : b.wrap.css(e).animate(c, { duration: a.nextSpeed, easing: a.nextEasing, complete: b._afterZoomIn }) }, changeOut: function () {
            var a =
            b.previous, d = a.prevEffect, e = { opacity: 0.1 }, c = b.direction; "elastic" === d && (e["down" === c || "up" === c ? "top" : "left"] = ("up" === c || "left" === c ? "-" : "+") + "=200px"); a.wrap.animate(e, { duration: "none" === d ? 0 : a.prevSpeed, easing: a.prevEasing, complete: function () { f(this).trigger("onReset").remove() } })
        }
    }; b.helpers.overlay = {
        defaults: { closeClick: !0, speedOut: 200, showEarly: !0, css: {}, locked: !s, fixed: !0 }, overlay: null, fixed: !1, create: function (a) {
            a = f.extend({}, this.defaults, a); this.overlay && this.close(); this.overlay = f('<div class="fancybox-overlay"></div>').appendTo("body");
            this.fixed = !1; a.fixed && b.defaults.fixed && (this.overlay.addClass("fancybox-overlay-fixed"), this.fixed = !0)
        }, open: function (a) { var d = this; a = f.extend({}, this.defaults, a); this.overlay ? this.overlay.unbind(".overlay").width("auto").height("auto") : this.create(a); this.fixed || (q.bind("resize.overlay", f.proxy(this.update, this)), this.update()); a.closeClick && this.overlay.bind("click.overlay", function (a) { f(a.target).hasClass("fancybox-overlay") && (b.isActive ? b.close() : d.close()) }); this.overlay.css(a.css).show() },
        close: function () { f(".fancybox-overlay").remove(); q.unbind("resize.overlay"); this.overlay = null; !1 !== this.margin && (f("body").css("margin-right", this.margin), this.margin = !1); this.el && this.el.removeClass("fancybox-lock") }, update: function () { var a = "100%", b; this.overlay.width(a).height("100%"); H ? (b = Math.max(z.documentElement.offsetWidth, z.body.offsetWidth), n.width() > b && (a = n.width())) : n.width() > q.width() && (a = n.width()); this.overlay.width(a).height(n.height()) }, onReady: function (a, b) {
            f(".fancybox-overlay").stop(!0,
            !0); this.overlay || (this.margin = n.height() > q.height() || "scroll" === f("body").css("overflow-y") ? f("body").css("margin-right") : !1, this.el = z.all && !z.querySelector ? f("html") : f("body"), this.create(a)); a.locked && this.fixed && (b.locked = this.overlay.append(b.wrap), b.fixed = !1); !0 === a.showEarly && this.beforeShow.apply(this, arguments)
        }, beforeShow: function (a, b) { b.locked && (this.el.addClass("fancybox-lock"), !1 !== this.margin && f("body").css("margin-right", l(this.margin) + b.scrollbarWidth)); this.open(a) }, onUpdate: function () {
            this.fixed ||
            this.update()
        }, afterClose: function (a) { this.overlay && !b.isActive && this.overlay.fadeOut(a.speedOut, f.proxy(this.close, this)) }
    }; b.helpers.title = {
        defaults: { type: "float", position: "bottom" }, beforeShow: function (a) {
            var d = b.current, e = d.title, c = a.type; f.isFunction(e) && (e = e.call(d.element, d)); if (p(e) && "" !== f.trim(e)) {
                d = f('<div class="fancybox-title fancybox-title-' + c + '-wrap">' + e + "</div>"); switch (c) {
                    case "inside": c = b.skin; break; case "outside": c = b.wrap; break; case "over": c = b.inner; break; default: c = b.skin, d.appendTo("body"),
                    H && d.width(d.width()), d.wrapInner('<span class="child"></span>'), b.current.margin[2] += Math.abs(l(d.css("margin-bottom")))
                } d["top" === a.position ? "prependTo" : "appendTo"](c)
            }
        }
    }; f.fn.fancybox = function (a) {
        var d, e = f(this), c = this.selector || "", k = function (g) {
            var h = f(this).blur(), j = d, k, l; !g.ctrlKey && (!g.altKey && !g.shiftKey && !g.metaKey) && !h.is(".fancybox-wrap") && (k = a.groupAttr || "data-fancybox-group", l = h.attr(k), l || (k = "rel", l = h.get(0)[k]), l && ("" !== l && "nofollow" !== l) && (h = c.length ? f(c) : e, h = h.filter("[" + k + '="' + l +
            '"]'), j = h.index(this)), a.index = j, !1 !== b.open(h, a) && g.preventDefault())
        }; a = a || {}; d = a.index || 0; !c || !1 === a.live ? e.unbind("click.fb-start").bind("click.fb-start", k) : n.undelegate(c, "click.fb-start").delegate(c + ":not('.fancybox-item, .fancybox-nav')", "click.fb-start", k); this.filter("[data-fancybox-start=1]").trigger("click"); return this
    }; n.ready(function () {
        f.scrollbarWidth === r && (f.scrollbarWidth = function () {
            var a = f('<div style="width:50px;height:50px;overflow:auto"><div/></div>').appendTo("body"), b = a.children(),
            b = b.innerWidth() - b.height(99).innerWidth(); a.remove(); return b
        }); if (f.support.fixedPosition === r) { var a = f.support, d = f('<div style="position:fixed;top:20px;"></div>').appendTo("body"), e = 20 === d[0].offsetTop || 15 === d[0].offsetTop; d.remove(); a.fixedPosition = e } f.extend(b.defaults, { scrollbarWidth: f.scrollbarWidth(), fixed: f.support.fixedPosition, parent: f("body") })
    })
})(window, document, jQuery);













/**
 * jQuery lightBox plugin
 * This jQuery plugin was inspired and based on Lightbox 2 by Lokesh Dhakar (http://www.huddletogether.com/projects/lightbox2/)
 * and adapted to me for use like a plugin from jQuery.
 * @name jquery-lightbox-0.5.js
 * @author Leandro Vieira Pinho - http://leandrovieira.com
 * @version 0.5
 * @date April 11, 2008
 * @category jQuery plugin
 * @copyright (c) 2008 Leandro Vieira Pinho (leandrovieira.com)
 * @license CCAttribution-ShareAlike 2.5 Brazil - http://creativecommons.org/licenses/by-sa/2.5/br/deed.en_US
 * @example Visit http://leandrovieira.com/projects/jquery/lightbox/ for more informations about this jQuery plugin
 图片点击放大
 */
(function ($) {
    $.fn.lightBox = function (settings) {
        settings = jQuery.extend({ overlayBgColor: '#000', overlayOpacity: 0.8, fixedNavigation: false, imageLoading: '/images/lightbox-ico-loading.gif', imageBtnPrev: '/images/lightbox-btn-prev.gif', imageBtnNext: '/images/lightbox-btn-next.gif', imageBtnClose: '/images/lightbox-btn-close.gif', imageBlank: '/images/lightbox-blank.gif', containerBorderSize: 10, containerResizeSpeed: 400, txtImage: 'Image', txtOf: 'of', keyToClose: 'c', keyToPrev: 'p', keyToNext: 'n', imageArray: [], activeImage: 0 }, settings); var jQueryMatchedObj = this; function _initialize() { _start(this, jQueryMatchedObj); return false; }
        function _start(objClicked, jQueryMatchedObj) {
            $('embed, object, select').css({ 'visibility': 'hidden' }); _set_interface(); settings.imageArray.length = 0; settings.activeImage = 0; if (jQueryMatchedObj.length == 1) { settings.imageArray.push(new Array(objClicked.getAttribute('href'), objClicked.getAttribute('title'))); } else { for (var i = 0; i < jQueryMatchedObj.length; i++) { settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'), jQueryMatchedObj[i].getAttribute('title'))); } }
            while (settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href')) { settings.activeImage++; }
            _set_image_to_view();
        }
        function _set_interface() { $('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>'); var arrPageSizes = ___getPageSize(); $('#jquery-overlay').css({ backgroundColor: settings.overlayBgColor, opacity: settings.overlayOpacity, width: arrPageSizes[0], height: arrPageSizes[1] }).fadeIn(); var arrPageScroll = ___getPageScroll(); $('#jquery-lightbox').css({ top: arrPageScroll[1] + (arrPageSizes[3] / 10), left: arrPageScroll[0] }).show(); $('#jquery-overlay,#jquery-lightbox').click(function () { _finish(); }); $('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function () { _finish(); return false; }); $(window).resize(function () { var arrPageSizes = ___getPageSize(); $('#jquery-overlay').css({ width: arrPageSizes[0], height: arrPageSizes[1] }); var arrPageScroll = ___getPageScroll(); $('#jquery-lightbox').css({ top: arrPageScroll[1] + (arrPageSizes[3] / 10), left: arrPageScroll[0] }); }); }
        function _set_image_to_view() {
            $('#lightbox-loading').show(); if (settings.fixedNavigation) { $('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide(); } else { $('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide(); }
            var objImagePreloader = new Image(); objImagePreloader.onload = function () { $('#lightbox-image').attr('src', settings.imageArray[settings.activeImage][0]); _resize_container_image_box(objImagePreloader.width, objImagePreloader.height); objImagePreloader.onload = function () { }; }; objImagePreloader.src = settings.imageArray[settings.activeImage][0];
        }; function _resize_container_image_box(intImageWidth, intImageHeight) {
            var intCurrentWidth = $('#lightbox-container-image-box').width(); var intCurrentHeight = $('#lightbox-container-image-box').height(); var intWidth = (intImageWidth + (settings.containerBorderSize * 2)); var intHeight = (intImageHeight + (settings.containerBorderSize * 2)); var intDiffW = intCurrentWidth - intWidth; var intDiffH = intCurrentHeight - intHeight; $('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight }, settings.containerResizeSpeed, function () { _show_image(); }); if ((intDiffW == 0) && (intDiffH == 0)) { if ($.browser.msie) { ___pause(250); } else { ___pause(100); } }
            $('#lightbox-container-image-data-box').css({ width: intImageWidth }); $('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ height: intImageHeight + (settings.containerBorderSize * 2) });
        }; function _show_image() { $('#lightbox-loading').hide(); $('#lightbox-image').fadeIn(function () { _show_image_data(); _set_navigation(); }); _preload_neighbor_images(); }; function _show_image_data() {
            $('#lightbox-container-image-data-box').slideDown('fast'); $('#lightbox-image-details-caption').hide(); if (settings.imageArray[settings.activeImage][1]) { $('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show(); }
            if (settings.imageArray.length > 1) { $('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + (settings.activeImage + 1) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show(); }
        }
        function _set_navigation() {
            $('#lightbox-nav').show(); $('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ 'background': 'transparent url(' + settings.imageBlank + ') no-repeat' }); if (settings.activeImage != 0) { if (settings.fixedNavigation) { $('#lightbox-nav-btnPrev').css({ 'background': 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' }).unbind().bind('click', function () { settings.activeImage = settings.activeImage - 1; _set_image_to_view(); return false; }); } else { $('#lightbox-nav-btnPrev').unbind().hover(function () { $(this).css({ 'background': 'url(' + settings.imageBtnPrev + ') left 15% no-repeat' }); }, function () { $(this).css({ 'background': 'transparent url(' + settings.imageBlank + ') no-repeat' }); }).show().bind('click', function () { settings.activeImage = settings.activeImage - 1; _set_image_to_view(); return false; }); } }
            if (settings.activeImage != (settings.imageArray.length - 1)) { if (settings.fixedNavigation) { $('#lightbox-nav-btnNext').css({ 'background': 'url(' + settings.imageBtnNext + ') right 15% no-repeat' }).unbind().bind('click', function () { settings.activeImage = settings.activeImage + 1; _set_image_to_view(); return false; }); } else { $('#lightbox-nav-btnNext').unbind().hover(function () { $(this).css({ 'background': 'url(' + settings.imageBtnNext + ') right 15% no-repeat' }); }, function () { $(this).css({ 'background': 'transparent url(' + settings.imageBlank + ') no-repeat' }); }).show().bind('click', function () { settings.activeImage = settings.activeImage + 1; _set_image_to_view(); return false; }); } }
            _enable_keyboard_navigation();
        }
        function _enable_keyboard_navigation() { $(document).keydown(function (objEvent) { _keyboard_action(objEvent); }); }
        function _disable_keyboard_navigation() { $(document).unbind(); }
        function _keyboard_action(objEvent) {
            if (objEvent == null) { keycode = event.keyCode; escapeKey = 27; } else { keycode = objEvent.keyCode; escapeKey = objEvent.DOM_VK_ESCAPE; }
            key = String.fromCharCode(keycode).toLowerCase(); if ((key == settings.keyToClose) || (key == 'x') || (keycode == escapeKey)) { _finish(); }
            if ((key == settings.keyToPrev) || (keycode == 37)) { if (settings.activeImage != 0) { settings.activeImage = settings.activeImage - 1; _set_image_to_view(); _disable_keyboard_navigation(); } }
            if ((key == settings.keyToNext) || (keycode == 39)) { if (settings.activeImage != (settings.imageArray.length - 1)) { settings.activeImage = settings.activeImage + 1; _set_image_to_view(); _disable_keyboard_navigation(); } }
        }
        function _preload_neighbor_images() {
            if ((settings.imageArray.length - 1) > settings.activeImage) { objNext = new Image(); objNext.src = settings.imageArray[settings.activeImage + 1][0]; }
            if (settings.activeImage > 0) { objPrev = new Image(); objPrev.src = settings.imageArray[settings.activeImage - 1][0]; }
        }

        function _finish() { $('#jquery-lightbox').remove(); $('#jquery-overlay').fadeOut(function () { $('#jquery-overlay').remove(); }); $('embed, object, select').css({ 'visibility': 'visible' }); }
        function ___getPageSize() {
            var xScroll, yScroll; if (window.innerHeight && window.scrollMaxY) { xScroll = window.innerWidth + window.scrollMaxX; yScroll = window.innerHeight + window.scrollMaxY; } else if (document.body.scrollHeight > document.body.offsetHeight) { xScroll = document.body.scrollWidth; yScroll = document.body.scrollHeight; } else { xScroll = document.body.offsetWidth; yScroll = document.body.offsetHeight; }
            var windowWidth, windowHeight; if (self.innerHeight) {
                if (document.documentElement.clientWidth) { windowWidth = document.documentElement.clientWidth; } else { windowWidth = self.innerWidth; }
                windowHeight = self.innerHeight;
            } else if (document.documentElement && document.documentElement.clientHeight) { windowWidth = document.documentElement.clientWidth; windowHeight = document.documentElement.clientHeight; } else if (document.body) { windowWidth = document.body.clientWidth; windowHeight = document.body.clientHeight; }
            if (yScroll < windowHeight) { pageHeight = windowHeight; } else { pageHeight = yScroll; }
            if (xScroll < windowWidth) { pageWidth = xScroll; } else { pageWidth = windowWidth; }
            arrayPageSize = new Array(pageWidth, pageHeight, windowWidth, windowHeight); return arrayPageSize;
        }; function ___getPageScroll() {
            var xScroll, yScroll; if (self.pageYOffset) { yScroll = self.pageYOffset; xScroll = self.pageXOffset; } else if (document.documentElement && document.documentElement.scrollTop) { yScroll = document.documentElement.scrollTop; xScroll = document.documentElement.scrollLeft; } else if (document.body) { yScroll = document.body.scrollTop; xScroll = document.body.scrollLeft; }
            arrayPageScroll = new Array(xScroll, yScroll); return arrayPageScroll;
        }; function ___pause(ms) {
            var date = new Date(); curDate = null; do { var curDate = new Date(); }
            while (curDate - date < ms);
        }; return this.unbind('click').click(_initialize);
    };
})(jQuery);







/*
* Slides, A Slideshow Plugin for jQuery
* Intructions: http://slidesjs.com
* By: Nathan Searles, http://nathansearles.com
* Version: 1.1.8
* Updated: June 1st, 2011
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
产品内页集锦切图
*/
(function (A) { A.fn.slides = function (B) { B = A.extend({}, A.fn.slides.option, B); return this.each(function () { A("." + B.container, A(this)).children().wrapAll('<div class="slides_control"/>'); var V = A(this), J = A(".slides_control", V), Z = J.children().size(), Q = J.children().outerWidth(), M = J.children().outerHeight(), D = B.start - 1, L = B.effect.indexOf(",") < 0 ? B.effect : B.effect.replace(" ", "").split(",")[0], S = B.effect.indexOf(",") < 0 ? L : B.effect.replace(" ", "").split(",")[1], O = 0, N = 0, C = 0, P = 0, U, H, I, X, W, T, K, F; function E(c, b, a) { if (!H && U) { H = true; B.animationStart(P + 1); switch (c) { case "next": N = P; O = P + 1; O = Z === O ? 0 : O; X = Q * 2; c = -Q * 2; P = O; break; case "prev": N = P; O = P - 1; O = O === -1 ? Z - 1 : O; X = 0; c = 0; P = O; break; case "pagination": O = parseInt(a, 10); N = A("." + B.paginationClass + " li." + B.currentClass + " a", V).attr("href").match("[^#/]+$"); if (O > N) { X = Q * 2; c = -Q * 2; } else { X = 0; c = 0; } P = O; break; } if (b === "fade") { if (B.crossfade) { J.children(":eq(" + O + ")", V).css({ zIndex: 10 }).fadeIn(B.fadeSpeed, B.fadeEasing, function () { if (B.autoHeight) { J.animate({ height: J.children(":eq(" + O + ")", V).outerHeight() }, B.autoHeightSpeed, function () { J.children(":eq(" + N + ")", V).css({ display: "none", zIndex: 0 }); J.children(":eq(" + O + ")", V).css({ zIndex: 0 }); B.animationComplete(O + 1); H = false; }); } else { J.children(":eq(" + N + ")", V).css({ display: "none", zIndex: 0 }); J.children(":eq(" + O + ")", V).css({ zIndex: 0 }); B.animationComplete(O + 1); H = false; } }); } else { J.children(":eq(" + N + ")", V).fadeOut(B.fadeSpeed, B.fadeEasing, function () { if (B.autoHeight) { J.animate({ height: J.children(":eq(" + O + ")", V).outerHeight() }, B.autoHeightSpeed, function () { J.children(":eq(" + O + ")", V).fadeIn(B.fadeSpeed, B.fadeEasing); }); } else { J.children(":eq(" + O + ")", V).fadeIn(B.fadeSpeed, B.fadeEasing, function () { if (A.browser.msie) { A(this).get(0).style.removeAttribute("filter"); } }); } B.animationComplete(O + 1); H = false; }); } } else { J.children(":eq(" + O + ")").css({ left: X, display: "block" }); if (B.autoHeight) { J.animate({ left: c, height: J.children(":eq(" + O + ")").outerHeight() }, B.slideSpeed, B.slideEasing, function () { J.css({ left: -Q }); J.children(":eq(" + O + ")").css({ left: Q, zIndex: 5 }); J.children(":eq(" + N + ")").css({ left: Q, display: "none", zIndex: 0 }); B.animationComplete(O + 1); H = false; }); } else { J.animate({ left: c }, B.slideSpeed, B.slideEasing, function () { J.css({ left: -Q }); J.children(":eq(" + O + ")").css({ left: Q, zIndex: 5 }); J.children(":eq(" + N + ")").css({ left: Q, display: "none", zIndex: 0 }); B.animationComplete(O + 1); H = false; }); } } if (B.pagination) { A("." + B.paginationClass + " li." + B.currentClass, V).removeClass(B.currentClass); A("." + B.paginationClass + " li:eq(" + O + ")", V).addClass(B.currentClass); } } } function R() { clearInterval(V.data("interval")); } function G() { if (B.pause) { clearTimeout(V.data("pause")); clearInterval(V.data("interval")); K = setTimeout(function () { clearTimeout(V.data("pause")); F = setInterval(function () { E("next", L); }, B.play); V.data("interval", F); }, B.pause); V.data("pause", K); } else { R(); } } if (Z < 2) { return; } if (D < 0) { D = 0; } if (D > Z) { D = Z - 1; } if (B.start) { P = D; } if (B.randomize) { J.randomize(); } A("." + B.container, V).css({ overflow: "hidden", position: "relative" }); J.children().css({ position: "absolute", top: 0, left: J.children().outerWidth(), zIndex: 0, display: "none" }); J.css({ position: "relative", width: (Q * 3), height: M, left: -Q }); A("." + B.container, V).css({ display: "block" }); if (B.autoHeight) { J.children().css({ height: "auto" }); J.animate({ height: J.children(":eq(" + D + ")").outerHeight() }, B.autoHeightSpeed); } if (B.preload && J.find("img:eq(" + D + ")").length) { A("." + B.container, V).css({ background: "url(" + B.preloadImage + ") no-repeat 50% 50%" }); var Y = J.find("img:eq(" + D + ")").attr("src") + "?" + (new Date()).getTime(); if (A("img", V).parent().attr("class") != "slides_control") { T = J.children(":eq(0)")[0].tagName.toLowerCase(); } else { T = J.find("img:eq(" + D + ")"); } J.find("img:eq(" + D + ")").attr("src", Y).load(function () { J.find(T + ":eq(" + D + ")").fadeIn(B.fadeSpeed, B.fadeEasing, function () { A(this).css({ zIndex: 5 }); A("." + B.container, V).css({ background: "" }); U = true; B.slidesLoaded(); }); }); } else { J.children(":eq(" + D + ")").fadeIn(B.fadeSpeed, B.fadeEasing, function () { U = true; B.slidesLoaded(); }); } if (B.bigTarget) { J.children().css({ cursor: "pointer" }); J.children().click(function () { E("next", L); return false; }); } if (B.hoverPause && B.play) { J.bind("mouseover", function () { R(); }); J.bind("mouseleave", function () { G(); }); } if (B.generateNextPrev) { A("." + B.container, V).after('<a href="#" class="' + B.prev + '">Prev</a>'); A("." + B.prev, V).after('<a href="#" class="' + B.next + '">Next</a>'); } A("." + B.next, V).click(function (a) { a.preventDefault(); if (B.play) { G(); } E("next", L); }); A("." + B.prev, V).click(function (a) { a.preventDefault(); if (B.play) { G(); } E("prev", L); }); if (B.generatePagination) { if (B.prependPagination) { V.prepend("<ul class=" + B.paginationClass + "></ul>"); } else { V.append("<ul class=" + B.paginationClass + "></ul>"); } J.children().each(function () { A("." + B.paginationClass, V).append('<li><a href="#' + C + '">' + (C + 1) + "</a></li>"); C++; }); } else { A("." + B.paginationClass + " li a", V).each(function () { A(this).attr("href", "#" + C); C++; }); } A("." + B.paginationClass + " li:eq(" + D + ")", V).addClass(B.currentClass); A("." + B.paginationClass + " li a", V).click(function () { if (B.play) { G(); } I = A(this).attr("href").match("[^#/]+$"); if (P != I) { E("pagination", S, I); } return false; }); A("a.link", V).click(function () { if (B.play) { G(); } I = A(this).attr("href").match("[^#/]+$") - 1; if (P != I) { E("pagination", S, I); } return false; }); if (B.play) { F = setInterval(function () { E("next", L); }, B.play); V.data("interval", F); } }); }; A.fn.slides.option = { preload: false, preloadImage: "/img/loading.gif", container: "slides_container", generateNextPrev: false, next: "next", prev: "prev", pagination: true, generatePagination: true, prependPagination: false, paginationClass: "pagination", currentClass: "current", fadeSpeed: 350, fadeEasing: "", slideSpeed: 350, slideEasing: "", start: 1, effect: "slide", crossfade: false, randomize: false, play: 0, pause: 0, hoverPause: false, autoHeight: false, autoHeightSpeed: 350, bigTarget: false, animationStart: function () { }, animationComplete: function () { }, slidesLoaded: function () { } }; A.fn.randomize = function (C) { function B() { return (Math.round(Math.random()) - 0.5); } return (A(this).each(function () { var F = A(this); var E = F.children(); var D = E.length; if (D > 1) { E.hide(); var G = []; for (i = 0; i < D; i++) { G[G.length] = i; } G = G.sort(B); A.each(G, function (I, H) { var K = E.eq(H); var J = K.clone(true); J.show().appendTo(F); if (C !== undefined) { C(K, J); } K.remove(); }); } })); }; })(jQuery);







/**
 * Copyright (c) 2012 Anders Ekdahl (http://coffeescripter.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.2.7
 *
 * Demo and documentation: http://coffeescripter.com/code/ad-gallery/
 内页弹出窗口内的图片集锦
 */
(function ($) { $.fn.adGallery = function (options) { var defaults = { loader_image: 'loader.gif', start_at_index: 0, update_window_hash: true, description_wrapper: false, thumb_opacity: 0.7, animate_first_image: false, animation_speed: 400, width: false, height: false, display_next_and_prev: true, display_back_and_forward: true, scroll_jump: 0, slideshow: { enable: true, autostart: false, speed: 5000, start_label: 'Start', stop_label: 'Stop', stop_on_scroll: true, countdown_prefix: '(', countdown_sufix: ')', onStart: false, onStop: false }, effect: 'slide-hori', enable_keyboard_move: true, cycle: true, hooks: { displayDescription: false }, callbacks: { init: false, afterImageVisible: false, beforeImageVisible: false } }; var settings = $.extend(false, defaults, options); if (options && options.slideshow) { settings.slideshow = $.extend(false, defaults.slideshow, options.slideshow); }; if (!settings.slideshow.enable) { settings.slideshow.autostart = false; }; var galleries = []; $(this).each(function () { var gallery = new AdGallery(this, settings); galleries[galleries.length] = gallery; }); return galleries; }; function VerticalSlideAnimation(img_container, direction, desc) { var current_top = parseInt(img_container.css('top'), 10); if (direction == 'left') { var old_image_top = '-' + this.image_wrapper_height + 'px'; img_container.css('top', this.image_wrapper_height + 'px'); } else { var old_image_top = this.image_wrapper_height + 'px'; img_container.css('top', '-' + this.image_wrapper_height + 'px'); }; if (desc) { desc.css('bottom', '-' + desc[0].offsetHeight + 'px'); desc.animate({ bottom: 0 }, this.settings.animation_speed * 2); }; if (this.current_description) { this.current_description.animate({ bottom: '-' + this.current_description[0].offsetHeight + 'px' }, this.settings.animation_speed * 2); }; return { old_image: { top: old_image_top }, new_image: { top: current_top } }; }; function HorizontalSlideAnimation(img_container, direction, desc) { var current_left = parseInt(img_container.css('left'), 10); if (direction == 'left') { var old_image_left = '-' + this.image_wrapper_width + 'px'; img_container.css('left', this.image_wrapper_width + 'px'); } else { var old_image_left = this.image_wrapper_width + 'px'; img_container.css('left', '-' + this.image_wrapper_width + 'px'); }; if (desc) { desc.css('bottom', '-' + desc[0].offsetHeight + 'px'); desc.animate({ bottom: 0 }, this.settings.animation_speed * 2); }; if (this.current_description) { this.current_description.animate({ bottom: '-' + this.current_description[0].offsetHeight + 'px' }, this.settings.animation_speed * 2); }; return { old_image: { left: old_image_left }, new_image: { left: current_left } }; }; function ResizeAnimation(img_container, direction, desc) { var image_width = img_container.width(); var image_height = img_container.height(); var current_left = parseInt(img_container.css('left'), 10); var current_top = parseInt(img_container.css('top'), 10); img_container.css({ width: 0, height: 0, top: this.image_wrapper_height / 2, left: this.image_wrapper_width / 2 }); return { old_image: { width: 0, height: 0, top: this.image_wrapper_height / 2, left: this.image_wrapper_width / 2 }, new_image: { width: image_width, height: image_height, top: current_top, left: current_left } }; }; function FadeAnimation(img_container, direction, desc) { img_container.css('opacity', 0); return { old_image: { opacity: 0 }, new_image: { opacity: 1 } }; }; function NoneAnimation(img_container, direction, desc) { img_container.css('opacity', 0); return { old_image: { opacity: 0 }, new_image: { opacity: 1 }, speed: 0 }; }; function AdGallery(wrapper, settings) { this.init(wrapper, settings); }; AdGallery.prototype = { wrapper: false, image_wrapper: false, gallery_info: false, nav: false, loader: false, preloads: false, thumbs_wrapper: false, thumbs_wrapper_width: 0, scroll_back: false, scroll_forward: false, next_link: false, prev_link: false, slideshow: false, image_wrapper_width: 0, image_wrapper_height: 0, current_index: -1, current_image: false, current_description: false, nav_display_width: 0, settings: false, images: false, in_transition: false, animations: false, init: function (wrapper, settings) { var context = this; this.wrapper = $(wrapper); this.settings = settings; this.setupElements(); this.setupAnimations(); if (this.settings.width) { this.image_wrapper_width = this.settings.width; this.image_wrapper.width(this.settings.width); this.wrapper.width(this.settings.width); } else { this.image_wrapper_width = this.image_wrapper.width(); }; if (this.settings.height) { this.image_wrapper_height = this.settings.height; this.image_wrapper.height(this.settings.height); } else { this.image_wrapper_height = this.image_wrapper.height(); }; this.nav_display_width = this.nav.width(); this.current_index = -1; this.current_image = false; this.current_description = false; this.in_transition = false; this.findImages(); if (this.settings.display_next_and_prev) { this.initNextAndPrev(); }; var nextimage_callback = function (callback) { return context.nextImage(callback); }; this.slideshow = new AdGallerySlideshow(nextimage_callback, this.settings.slideshow); this.controls.append(this.slideshow.create()); if (this.settings.slideshow.enable) { this.slideshow.enable(); } else { this.slideshow.disable(); }; if (this.settings.display_back_and_forward) { this.initBackAndForward(); }; if (this.settings.enable_keyboard_move) { this.initKeyEvents(); }; this.initHashChange(); var start_at = parseInt(this.settings.start_at_index, 10); if (typeof this.getIndexFromHash() != "undefined") { start_at = this.getIndexFromHash(); }; this.loading(true); this.showImage(start_at, function () { if (context.settings.slideshow.autostart) { context.preloadImage(start_at + 1); context.slideshow.start(); }; }); this.fireCallback(this.settings.callbacks.init); }, setupAnimations: function () { this.animations = { 'slide-vert': VerticalSlideAnimation, 'slide-hori': HorizontalSlideAnimation, 'resize': ResizeAnimation, 'fade': FadeAnimation, 'none': NoneAnimation }; }, setupElements: function () { this.controls = this.wrapper.find('.ad-controls'); this.gallery_info = $('<p class="ad-info"></p>'); this.controls.append(this.gallery_info); this.image_wrapper = this.wrapper.find('.ad-image-wrapper'); this.image_wrapper.empty(); this.nav = this.wrapper.find('.ad-nav'); this.thumbs_wrapper = this.nav.find('.ad-thumbs'); this.preloads = $('<div class="ad-preloads"></div>'); this.loader = $('<img class="ad-loader" src="' + this.settings.loader_image + '">'); this.image_wrapper.append(this.loader); this.loader.hide(); $(document.body).append(this.preloads); }, loading: function (bool) { if (bool) { this.loader.show(); } else { this.loader.hide(); }; }, addAnimation: function (name, fn) { if ($.isFunction(fn)) { this.animations[name] = fn; }; }, findImages: function () { var context = this; this.images = []; var thumbs_loaded = 0; var thumbs = this.thumbs_wrapper.find('a'); var thumb_count = thumbs.length; if (this.settings.thumb_opacity < 1) { thumbs.find('img').css('opacity', this.settings.thumb_opacity); }; thumbs.each(function (i) { var link = $(this); link.data("ad-i", i); var image_src = link.attr('href'); var thumb = link.find('img'); context.whenImageLoaded(thumb[0], function () { var width = thumb[0].parentNode.parentNode.offsetWidth; if (thumb[0].width == 0) { width = 100; }; context.thumbs_wrapper_width += width; thumbs_loaded++; }); context._initLink(link); context.images[i] = context._createImageData(link, image_src); }); var inter = setInterval(function () { if (thumb_count == thumbs_loaded) { context._setThumbListWidth(context.thumbs_wrapper_width); clearInterval(inter); }; }, 100); }, _setThumbListWidth: function (wrapper_width) { wrapper_width -= 100; var list = this.nav.find('.ad-thumb-list'); list.css('width', wrapper_width + 'px'); var i = 1; var last_height = list.height(); while (i < 201) { list.css('width', (wrapper_width + i) + 'px'); if (last_height != list.height()) { break; }; last_height = list.height(); i++; }; if (list.width() < this.nav.width()) { list.width(this.nav.width()); }; }, _initLink: function (link) { var context = this; link.click(function () { context.showImage(link.data("ad-i")); context.slideshow.stop(); return false; }).hover(function () { if (!$(this).is('.ad-active') && context.settings.thumb_opacity < 1) { $(this).find('img').fadeTo(300, 1); }; context.preloadImage(link.data("ad-i")); }, function () { if (!$(this).is('.ad-active') && context.settings.thumb_opacity < 1) { $(this).find('img').fadeTo(300, context.settings.thumb_opacity); }; }); }, _createImageData: function (thumb_link, image_src) { var link = false; var thumb_img = thumb_link.find("img"); if (thumb_img.data('ad-link')) { link = thumb_link.data('ad-link'); } else if (thumb_img.attr('longdesc') && thumb_img.attr('longdesc').length) { link = thumb_img.attr('longdesc'); }; var desc = false; if (thumb_img.data('ad-desc')) { desc = thumb_img.data('ad-desc'); } else if (thumb_img.attr('alt') && thumb_img.attr('alt').length) { desc = thumb_img.attr('alt'); }; var title = false; if (thumb_img.data('ad-title')) { title = thumb_img.data('ad-title'); } else if (thumb_img.attr('title') && thumb_img.attr('title').length) { title = thumb_img.attr('title'); }; return { thumb_link: thumb_link, image: image_src, error: false, preloaded: false, desc: desc, title: title, size: false, link: link }; }, initKeyEvents: function () { var context = this; $(document).keydown(function (e) { if (e.keyCode == 39) { context.nextImage(); context.slideshow.stop(); } else if (e.keyCode == 37) { context.prevImage(); context.slideshow.stop(); }; }); }, getIndexFromHash: function () { if (window.location.hash && window.location.hash.indexOf('#ad-image-') === 0) { var id = window.location.hash.replace(/^#ad-image-/g, ''); var thumb = this.thumbs_wrapper.find("#" + id); if (thumb.length) { return this.thumbs_wrapper.find("a").index(thumb); } else if (!isNaN(parseInt(id, 10))) { return parseInt(id, 10); }; }; return undefined; }, removeImage: function (index) { if (index < 0 || index >= this.images.length) { throw "Cannot remove image for index " + index; }; var image = this.images[index]; this.images.splice(index, 1); var thumb_link = image.thumb_link; var thumb_width = thumb_link[0].parentNode.offsetWidth; this.thumbs_wrapper_width -= thumb_width; thumb_link.remove(); this._setThumbListWidth(this.thumbs_wrapper_width); this.gallery_info.html((this.current_index + 1) + ' / ' + this.images.length); this.thumbs_wrapper.find('a').each(function (i) { $(this).data("ad-i", i); }); if (index == this.current_index && this.images.length != 0) { this.showImage(0); }; }, removeAllImages: function () { for (var i = this.images.length - 1; i >= 0; i--) { this.removeImage(i); }; }, addImage: function (thumb_url, image_url, image_id, title, description) { image_id = image_id || ""; title = title || ""; description = description || ""; var li = $('<li><a href="' + image_url + '" id="' + image_id + '">' + '<img src="' + thumb_url + '" title="' + title + '" alt="' + description + '">' + '</a></li>'); var context = this; this.thumbs_wrapper.find("ul").append(li); var link = li.find("a"); var thumb = link.find("img"); thumb.css('opacity', this.settings.thumb_opacity); this.whenImageLoaded(thumb[0], function () { var thumb_width = thumb[0].parentNode.parentNode.offsetWidth; if (thumb[0].width == 0) { thumb_width = 100; }; context.thumbs_wrapper_width += thumb_width; context._setThumbListWidth(context.thumbs_wrapper_width); }); var i = this.images.length; link.data("ad-i", i); this._initLink(link); this.images[i] = context._createImageData(link, image_url); this.gallery_info.html((this.current_index + 1) + ' / ' + this.images.length); }, initHashChange: function () { var context = this; if ("onhashchange" in window) { $(window).bind("hashchange", function () { var index = context.getIndexFromHash(); if (typeof index != "undefined" && index != context.current_index) { context.showImage(index); }; }); } else { var current_hash = window.location.hash; setInterval(function () { if (window.location.hash != current_hash) { current_hash = window.location.hash; var index = context.getIndexFromHash(); if (typeof index != "undefined" && index != context.current_index) { context.showImage(index); }; }; }, 200); }; }, initNextAndPrev: function () { this.next_link = $('<div class="ad-next"><div class="ad-next-image"></div></div>'); this.prev_link = $('<div class="ad-prev"><div class="ad-prev-image"></div></div>'); this.image_wrapper.append(this.next_link); this.image_wrapper.append(this.prev_link); var context = this; this.prev_link.add(this.next_link).mouseover(function (e) { $(this).css('height', context.image_wrapper_height); $(this).find('div').show(); }).mouseout(function (e) { $(this).find('div').hide(); }).click(function () { if ($(this).is('.ad-next')) { context.nextImage(); context.slideshow.stop(); } else { context.prevImage(); context.slideshow.stop(); }; }).find('div').css('opacity', 0.7); }, initBackAndForward: function () { var context = this; this.scroll_forward = $('<div class="ad-forward"></div>'); this.scroll_back = $('<div class="ad-back"></div>'); this.nav.append(this.scroll_forward); this.nav.prepend(this.scroll_back); var has_scrolled = 0; var thumbs_scroll_interval = false; $(this.scroll_back).add(this.scroll_forward).click(function () { var width = context.nav_display_width - 50; if (context.settings.scroll_jump > 0) { var width = context.settings.scroll_jump; }; if ($(this).is('.ad-forward')) { var left = context.thumbs_wrapper.scrollLeft() + width; } else { var left = context.thumbs_wrapper.scrollLeft() - width; }; if (context.settings.slideshow.stop_on_scroll) { context.slideshow.stop(); }; context.thumbs_wrapper.animate({ scrollLeft: left + 'px' }); return false; }).css('opacity', 0.6).hover(function () { var direction = 'left'; if ($(this).is('.ad-forward')) { direction = 'right'; }; thumbs_scroll_interval = setInterval(function () { has_scrolled++; if (has_scrolled > 30 && context.settings.slideshow.stop_on_scroll) { context.slideshow.stop(); }; var left = context.thumbs_wrapper.scrollLeft() + 1; if (direction == 'left') { left = context.thumbs_wrapper.scrollLeft() - 1; }; context.thumbs_wrapper.scrollLeft(left); }, 10); $(this).css('opacity', 1); }, function () { has_scrolled = 0; clearInterval(thumbs_scroll_interval); $(this).css('opacity', 0.6); }); }, _afterShow: function () { this.gallery_info.html((this.current_index + 1) + ' / ' + this.images.length); if (!this.settings.cycle) { this.prev_link.show().css('height', this.image_wrapper_height); this.next_link.show().css('height', this.image_wrapper_height); if (this.current_index == (this.images.length - 1)) { this.next_link.hide(); }; if (this.current_index == 0) { this.prev_link.hide(); }; }; if (this.settings.update_window_hash) { var thumb_link = this.images[this.current_index].thumb_link; if (thumb_link.attr("id")) { window.location.hash = "#ad-image-" + thumb_link.attr("id"); } else { window.location.hash = "#ad-image-" + this.current_index; }; }; this.fireCallback(this.settings.callbacks.afterImageVisible); }, _getContainedImageSize: function (image_width, image_height) { if (image_height > this.image_wrapper_height) { var ratio = image_width / image_height; image_height = this.image_wrapper_height; image_width = this.image_wrapper_height * ratio; }; if (image_width > this.image_wrapper_width) { var ratio = image_height / image_width; image_width = this.image_wrapper_width; image_height = this.image_wrapper_width * ratio; }; return { width: image_width, height: image_height }; }, _centerImage: function (img_container, image_width, image_height) { img_container.css('top', '0px'); if (image_height < this.image_wrapper_height) { var dif = this.image_wrapper_height - image_height; img_container.css('top', (dif / 2) + 'px'); }; img_container.css('left', '0px'); if (image_width < this.image_wrapper_width) { var dif = this.image_wrapper_width - image_width; img_container.css('left', (dif / 2) + 'px'); }; }, _getDescription: function (image) { var desc = false; if (image.desc.length || image.title.length) { var title = ''; if (image.title.length) { title = '<strong class="ad-description-title">' + image.title + '</strong>'; }; var desc = ''; if (image.desc.length) { desc = '<span>' + image.desc + '</span>'; }; desc = $('<p class="ad-image-description">' + title + desc + '</p>'); }; return desc; }, showImage: function (index, callback) { if (this.images[index] && !this.in_transition && index != this.current_index) { var context = this; var image = this.images[index]; this.in_transition = true; if (!image.preloaded) { this.loading(true); this.preloadImage(index, function () { context.loading(false); context._showWhenLoaded(index, callback); }); } else { this._showWhenLoaded(index, callback); }; }; }, _showWhenLoaded: function (index, callback) { if (this.images[index]) { var context = this; var image = this.images[index]; var img_container = $(document.createElement('div')).addClass('ad-image'); var img = $(new Image()).attr('src', image.image); if (image.link) { var link = $('<a href="' + image.link + '" target="_blank"></a>'); link.append(img); img_container.append(link); } else { img_container.append(img); }; this.image_wrapper.prepend(img_container); var size = this._getContainedImageSize(image.size.width, image.size.height); img.attr('width', size.width); img.attr('height', size.height); img_container.css({ width: size.width + 'px', height: size.height + 'px' }); this._centerImage(img_container, size.width, size.height); var desc = this._getDescription(image); if (desc) { if (!this.settings.description_wrapper && !this.settings.hooks.displayDescription) { img_container.append(desc); var width = size.width - parseInt(desc.css('padding-left'), 10) - parseInt(desc.css('padding-right'), 10); desc.css('width', width + 'px'); } else if (this.settings.hooks.displayDescription) { this.settings.hooks.displayDescription.call(this, image); } else { var wrapper = this.settings.description_wrapper; wrapper.append(desc); }; }; this.highLightThumb(this.images[index].thumb_link); var direction = 'right'; if (this.current_index < index) { direction = 'left'; }; this.fireCallback(this.settings.callbacks.beforeImageVisible); if (this.current_image || this.settings.animate_first_image) { var animation_speed = this.settings.animation_speed; var easing = 'swing'; var animation = this.animations[this.settings.effect].call(this, img_container, direction, desc); if (typeof animation.speed != 'undefined') { animation_speed = animation.speed; }; if (typeof animation.easing != 'undefined') { easing = animation.easing; }; if (this.current_image) { var old_image = this.current_image; var old_description = this.current_description; old_image.animate(animation.old_image, animation_speed, easing, function () { old_image.remove(); if (old_description) old_description.remove(); }); }; img_container.animate(animation.new_image, animation_speed, easing, function () { context.current_index = index; context.current_image = img_container; context.current_description = desc; context.in_transition = false; context._afterShow(); context.fireCallback(callback); }); } else { this.current_index = index; this.current_image = img_container; context.current_description = desc; this.in_transition = false; context._afterShow(); this.fireCallback(callback); }; }; }, nextIndex: function () { if (this.current_index == (this.images.length - 1)) { if (!this.settings.cycle) { return false; }; var next = 0; } else { var next = this.current_index + 1; }; return next; }, nextImage: function (callback) { var next = this.nextIndex(); if (next === false) return false; this.preloadImage(next + 1); this.showImage(next, callback); return true; }, prevIndex: function () { if (this.current_index == 0) { if (!this.settings.cycle) { return false; }; var prev = this.images.length - 1; } else { var prev = this.current_index - 1; }; return prev; }, prevImage: function (callback) { var prev = this.prevIndex(); if (prev === false) return false; this.preloadImage(prev - 1); this.showImage(prev, callback); return true; }, preloadAll: function () { var context = this; var i = 0; function preloadNext() { if (i < context.images.length) { i++; context.preloadImage(i, preloadNext); }; }; context.preloadImage(i, preloadNext); }, preloadImage: function (index, callback) { if (this.images[index]) { var image = this.images[index]; if (!this.images[index].preloaded) { var img = $(new Image()); img.attr('src', image.image); if (!this.isImageLoaded(img[0])) { this.preloads.append(img); var context = this; img.load(function () { image.preloaded = true; image.size = { width: this.width, height: this.height }; context.fireCallback(callback); }).error(function () { image.error = true; image.preloaded = false; image.size = false; }); } else { image.preloaded = true; image.size = { width: img[0].width, height: img[0].height }; this.fireCallback(callback); }; } else { this.fireCallback(callback); }; }; }, whenImageLoaded: function (img, callback) { if (this.isImageLoaded(img)) { callback && callback(); } else { $(img).load(callback); }; }, isImageLoaded: function (img) { if (typeof img.complete != 'undefined' && !img.complete) { return false; }; if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) { return false; }; return true; }, highLightThumb: function (thumb) { this.thumbs_wrapper.find('.ad-active').removeClass('ad-active'); thumb.addClass('ad-active'); if (this.settings.thumb_opacity < 1) { this.thumbs_wrapper.find('a:not(.ad-active) img').fadeTo(300, this.settings.thumb_opacity); thumb.find('img').fadeTo(300, 1); }; var left = thumb[0].parentNode.offsetLeft; left -= (this.nav_display_width / 2) - (thumb[0].offsetWidth / 2); this.thumbs_wrapper.animate({ scrollLeft: left + 'px' }); }, fireCallback: function (fn) { if ($.isFunction(fn)) { fn.call(this); }; } }; function AdGallerySlideshow(nextimage_callback, settings) { this.init(nextimage_callback, settings); }; AdGallerySlideshow.prototype = { start_link: false, stop_link: false, countdown: false, controls: false, settings: false, nextimage_callback: false, enabled: false, running: false, countdown_interval: false, init: function (nextimage_callback, settings) { var context = this; this.nextimage_callback = nextimage_callback; this.settings = settings; }, create: function () { this.start_link = $('<span class="ad-slideshow-start">' + this.settings.start_label + '</span>'); this.stop_link = $('<span class="ad-slideshow-stop">' + this.settings.stop_label + '</span>'); this.countdown = $('<span class="ad-slideshow-countdown"></span>'); this.controls = $('<div class="ad-slideshow-controls"></div>'); this.controls.append(this.start_link).append(this.stop_link).append(this.countdown); this.countdown.hide(); var context = this; this.start_link.click(function () { context.start(); }); this.stop_link.click(function () { context.stop(); }); $(document).keydown(function (e) { if (e.keyCode == 83) { if (context.running) { context.stop(); } else { context.start(); }; }; }); return this.controls; }, disable: function () { this.enabled = false; this.stop(); this.controls.hide(); }, enable: function () { this.enabled = true; this.controls.show(); }, toggle: function () { if (this.enabled) { this.disable(); } else { this.enable(); }; }, start: function () { if (this.running || !this.enabled) return false; var context = this; this.running = true; this.controls.addClass('ad-slideshow-running'); this._next(); this.fireCallback(this.settings.onStart); return true; }, stop: function () { if (!this.running) return false; this.running = false; this.countdown.hide(); this.controls.removeClass('ad-slideshow-running'); clearInterval(this.countdown_interval); this.fireCallback(this.settings.onStop); return true; }, _next: function () { var context = this; var pre = this.settings.countdown_prefix; var su = this.settings.countdown_sufix; clearInterval(context.countdown_interval); this.countdown.show().html(pre + (this.settings.speed / 1000) + su); var slide_timer = 0; this.countdown_interval = setInterval(function () { slide_timer += 1000; if (slide_timer >= context.settings.speed) { var whenNextIsShown = function () { if (context.running) { context._next(); }; slide_timer = 0; }; if (!context.nextimage_callback(whenNextIsShown)) { context.stop(); }; slide_timer = 0; }; var sec = parseInt(context.countdown.text().replace(/[^0-9]/g, ''), 10); sec--; if (sec > 0) { context.countdown.html(pre + sec + su); }; }, 1000); }, fireCallback: function (fn) { if ($.isFunction(fn)) { fn.call(this); }; } }; })(jQuery);










/*
    By sean at 2010.07,  modified on 2010.09.10;
    
    Example:
    $(".productshow").xslider({//.productshow是要移动对象的外框;
        unitdisplayed:3,//可视的单位个数   必需项;
        movelength:1,//要移动的单位个数    必需项;
        maxlength:null,//可视宽度或高度    默认查找要移动对象外层的宽或高度;
        scrollobj:null,//要移动的对象     默认查找productshow下的ul;
        unitlen:null,//移动的单位宽或高度     默认查找li的尺寸;
        nowlength:null,//移动最长宽或高（要移动对象的宽度或高度）   默认由li个数乘以unitlen所得的积;
        dir:"H",//水平移动还是垂直移动，默认H为水平移动，传入V或其他字符则表示垂直移动;
        autoscroll:1000//自动移动间隔时间     默认null不自动移动;
    });
*/
jQuery.extend(jQuery.easing, {
    easeInSine: function (x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    }
});
(function ($) {
    $.fn.xslider = function (settings) {
        settings = $.extend({}, $.fn.xslider.defaults, settings);
        this.each(function () {
            var scrollobj = settings.scrollobj || $(this).find("ul");
            var maxlength = settings.maxlength || (settings.dir == "H" ? scrollobj.parent().width() : scrollobj.parent().height());//length of the wrapper visible;
            var scrollunits = scrollobj.find("li");//units to move;
            var unitlen = settings.unitlen || (settings.dir == "H" ? scrollunits.eq(0).outerWidth() : scrollunits.eq(0).outerHeight());
            var unitdisplayed = settings.unitdisplayed;//units num displayed;
            var nowlength = settings.nowlength || scrollunits.length * unitlen;//length of the scrollobj;
            var offset = 0;
            var sn = 0;
            var movelength = unitlen * settings.movelength;
            var moving = false;//moving now?;
            var btnright = $(this).find("a.aright");
            var btnleft = $(this).find("a.aleft");

            if (settings.dir == "H") {
                scrollobj.css("left", "0px");
            } else {
                scrollobj.css("top", "0px");
            }
            if (nowlength > maxlength) {
                btnleft.addClass("agrayleft");
                btnright.removeClass("agrayright");
                offset = nowlength - maxlength;
            } else {
                btnleft.addClass("agrayleft");
                btnright.addClass("agrayright");
            }

            btnleft.click(function () {
                if ($(this).is("[class*='agrayleft']")) { return false; }
                if (!moving) {
                    moving = true;
                    sn -= movelength;
                    if (sn > unitlen * unitdisplayed - maxlength) {
                        jQuery.fn.xslider.scroll(scrollobj, -sn, settings.dir, function () { moving = false; });
                    } else {
                        jQuery.fn.xslider.scroll(scrollobj, 0, settings.dir, function () { moving = false; });
                        sn = 0;
                        $(this).addClass("agrayleft");
                    }
                    btnright.removeClass("agrayright");
                }
                return false;
            });
            btnright.click(function () {
                if ($(this).is("[class*='agrayright']")) { return false; }
                if (!moving) {
                    moving = true;
                    sn += movelength;
                    if (sn < offset - (unitlen * unitdisplayed - maxlength)) {
                        jQuery.fn.xslider.scroll(scrollobj, -sn, settings.dir, function () { moving = false; });
                    } else {
                        jQuery.fn.xslider.scroll(scrollobj, -offset, settings.dir, function () { moving = false; });//滚动到最后一个位置;
                        sn = offset;
                        $(this).addClass("agrayright");
                    }
                    btnleft.removeClass("agrayleft");
                }
                return false;
            });

            if (settings.autoscroll) {
                jQuery.fn.xslider.autoscroll($(this), settings.autoscroll);
            }

        })
    }
})(jQuery);

jQuery.fn.xslider.defaults = {
    maxlength: 0,
    scrollobj: null,
    unitlen: 0,
    nowlength: 0,
    dir: "H",
    autoscroll: null
};
jQuery.fn.xslider.scroll = function (obj, w, dir, callback) {
    if (dir == "H") {
        obj.animate({
            left: w
        }, 500, "easeInSine", callback);
    } else {
        obj.animate({
            top: w
        }, 500, "easeInSine", callback);
    }
}
jQuery.fn.xslider.autoscroll = function (obj, time) {
    var vane = "right";
    function autoscrolling() {
        if (vane == "right") {
            if (!obj.find("a.agrayright").length) {
                obj.find("a.aright").trigger("click");
            } else {
                vane = "left";
            }
        }
        if (vane == "left") {
            if (!obj.find("a.agrayleft").length) {
                obj.find("a.aleft").trigger("click");
            } else {
                vane = "right";
            }
        }
    }
    var scrollTimmer = setInterval(autoscrolling, time);
    obj.hover(function () {
        clearInterval(scrollTimmer);
    }, function () {
        scrollTimmer = setInterval(autoscrolling, time);
    });
}


/*首页图片logo*/
$(function () {
    $("#wx").hover(function () {
        $(".wcode").toggle();
    });
    $(".proshow li").hover(function () {
        $(this).find(".filter").css({
            "opacity": "0"
        }).show().animate({
            "opacity": "0.4"
        });
        $(this).find(".txt").css({
            "opacity": "0"
        }).show().animate({
            "opacity": "1"
        })
    },
function () {
    $(this).find(".filter").fadeOut();
    $(this).find(".txt").fadeOut()
});
});

$(function () {
    $("#wx").hover(function () {
        $(".wcode").toggle();
    });
    $(".proshowa li").hover(function () {
        $(this).find(".filter").css({
            "opacity": "0"
        }).show().animate({
            "opacity": "0.4"
        });
        $(this).find(".txt").css({
            "opacity": "0"
        }).show().animate({
            "opacity": "1"
        })
    },
function () {
    $(this).find(".filter").fadeOut();
    $(this).find(".txt").fadeOut()
});
});




//**************************************************************
// jQZoom allows you to realize a small magnifier window,close
// to the image or images on your web page easily.
//
// jqZoom version 2.1
// Author Doc. Ing. Renzi Marco(www.mind-projects.it)
// First Release on Dec 05 2007
// i'm searching for a job,pick me up!!!
// mail: renzi.mrc@gmail.com
//**************************************************************

(function ($) {

    $.fn.jqueryzoom = function (options) {
        var settings = {
            xzoom: 200,//zoomed width default width
            yzoom: 200,//zoomed div default width
            offset: 10, //zoomed div default offset
            position: "right",//zoomed div default position,offset position is to the right of the image
            lens: 1, //zooming lens over the image,by default is 1;
            preload: 1
        };

        if (options) {
            $.extend(settings, options);
        }

        var noalt = '';
        $(this).hover(function () {

            var imageLeft = this.offsetLeft;
            var imageRight = this.offsetRight;
            var imageTop = $(this).get(0).offsetTop;
            var imageWidth = $(this).children('img').get(0).offsetWidth;
            var imageHeight = $(this).children('img').get(0).offsetHeight;


            noalt = $(this).children("img").attr("alt");

            var bigimage = $(this).children("img").attr("jqimg");

            $(this).children("img").attr("alt", '');

            if ($("div.zoomdiv").get().length == 0) {

                $(this).after("<div class='zoomdiv'><img class='bigimg' src='" + bigimage + "'/></div>");


                $(this).append("<div class='jqZoomPup'>&nbsp;</div>");

            }


            if (settings.position == "right") {

                if (imageLeft + imageWidth + settings.offset + settings.xzoom > screen.width) {

                    leftpos = imageLeft - settings.offset - settings.xzoom;

                } else {

                    leftpos = imageLeft + imageWidth + settings.offset;
                }
            } else {
                leftpos = imageLeft - settings.xzoom - settings.offset;
                if (leftpos < 0) {

                    leftpos = imageLeft + imageWidth + settings.offset;

                }

            }

            $("div.zoomdiv").css({ top: imageTop, left: leftpos });

            $("div.zoomdiv").width(settings.xzoom);

            $("div.zoomdiv").height(settings.yzoom);

            $("div.zoomdiv").show();

            if (!settings.lens) {
                $(this).css('cursor', 'crosshair');
            }




            $(document.body).mousemove(function (e) {



                mouse = new MouseEvent(e);

                /*$("div.jqZoomPup").hide();*/


                var bigwidth = $(".bigimg").get(0).offsetWidth;

                var bigheight = $(".bigimg").get(0).offsetHeight;

                var scaley = 'x';

                var scalex = 'y';


                if (isNaN(scalex) | isNaN(scaley)) {

                    var scalex = (bigwidth / imageWidth);

                    var scaley = (bigheight / imageHeight);




                    $("div.jqZoomPup").width((settings.xzoom) / scalex);

                    $("div.jqZoomPup").height((settings.yzoom) / scaley);

                    if (settings.lens) {
                        $("div.jqZoomPup").css('visibility', 'visible');
                    }

                }



                xpos = mouse.x - $("div.jqZoomPup").width() / 2 - imageLeft;

                ypos = mouse.y - $("div.jqZoomPup").height() / 2 - imageTop;

                if (settings.lens) {

                    xpos = (mouse.x - $("div.jqZoomPup").width() / 2 < imageLeft) ? 0 : (mouse.x + $("div.jqZoomPup").width() / 2 > imageWidth + imageLeft) ? (imageWidth - $("div.jqZoomPup").width() - 2) : xpos;

                    ypos = (mouse.y - $("div.jqZoomPup").height() / 2 < imageTop) ? 0 : (mouse.y + $("div.jqZoomPup").height() / 2 > imageHeight + imageTop) ? (imageHeight - $("div.jqZoomPup").height() - 2) : ypos;

                }


                if (settings.lens) {

                    $("div.jqZoomPup").css({ top: ypos, left: xpos });

                }



                scrolly = ypos;

                $("div.zoomdiv").get(0).scrollTop = scrolly * scaley;

                scrollx = xpos;

                $("div.zoomdiv").get(0).scrollLeft = (scrollx) * scalex;


            });
        }, function () {

            $(this).children("img").attr("alt", noalt);
            $(document.body).unbind("mousemove");
            if (settings.lens) {
                $("div.jqZoomPup").remove();
            }
            $("div.zoomdiv").remove();

        });

        count = 0;

        if (settings.preload) {

            $('body').append("<div style='display:none;' class='jqPreload" + count + "'>0</div>");

            $(this).each(function () {

                var imagetopreload = $(this).children("img").attr("jqimg");

                var content = jQuery('div.jqPreload' + count + '').html();

                jQuery('div.jqPreload' + count + '').html(content + '<img src=\"' + imagetopreload + '\">');

            });

        }

    }

})(jQuery);

function MouseEvent(e) {
    this.x = e.pageX
    this.y = e.pageY


}


/*===========================
 *作者：动力启航(谢凯)
 *网址：http://www.it134.cn
 *转发请保留作者信息，谢谢
===========================*/



//=====================全局函数========================
//Tab控制函数
function tabs(tabId, tabNum) {
    //设置点击后的切换样式
    $(tabId + " .tab li").removeClass("curr");
    $(tabId + " .tab li").eq(tabNum).addClass("curr");
    //根据参数决定显示内容
    $(tabId + " .tabcon").hide();
    $(tabId + " .tabcon").eq(tabNum).show();
}
//=====================全局函数========================

//==================图片详细页函数=====================
//鼠标经过预览图片函数
function preview(img) {
    //w:360px;h:270px;
    $("#preview .jqzoom img").attr("src", $(img).attr("src"));
    $("#preview .jqzoom img").attr("jqimg", $(img).attr("bimg"));

    var maxWidth = 360;
    var maxHeight = 270;
    var hRatio;
    var wRatio;
    var Ratio = 1;
    var w = $("#preview .jqzoom img").width();
    var h = $("#preview .jqzoom img").height();
    wRatio = maxWidth / w;
    hRatio = maxHeight / h;
    if (maxWidth == 0 && maxHeight == 0) {
        Ratio = 1;
    }
    else if (maxWidth == 0) {//
        if (hRatio < 1) Ratio = hRatio;
    }
    else if (maxHeight == 0) {
        if (wRatio < 1) Ratio = wRatio;
    }
    else if (wRatio < 1 || hRatio < 1) {
        Ratio = (wRatio <= hRatio ? wRatio : hRatio);
    }
    if (Ratio < 1) {
        w = w * Ratio;
        h = h * Ratio;
    }
    $("#preview .jqzoom img").height(h).width(w);
    var mh = maxHeight - h;
    var mw = maxWidth - w;
    if (mh > 2) {
        $("#preview").css("padding-top", mh / 2).height(maxHeight - mh / 2);
    }
    else { $("#preview").css("padding-top", 0).height(maxHeight); }
    if (mw > 2) {
        $("#preview").css("padding-left", mw / 2).width(maxWidth - mw / 2);
    }
    else { $("#preview").css("padding-left", 0).width(maxWidth); }
}

//图片放大镜效果
$(function () {
    $(".jqzoom").jqueryzoom({ xzoom: 350, yzoom: 310 });
});

//图片预览小图移动效果,页面加载时触发
$(function () {
    var tempLength = 0; //临时变量,当前移动的长度
    var viewNum = 5; //设置每次显示图片的个数量
    var moveNum = 2; //每次移动的数量
    var moveTime = 300; //移动速度,毫秒
    var scrollDiv = $(".spec-scroll .items ul"); //进行移动动画的容器
    var scrollItems = $(".spec-scroll .items ul li"); //移动容器里的集合
    var moveLength = scrollItems.eq(0).width() * moveNum; //计算每次移动的长度
    var countLength = (scrollItems.length - viewNum) * scrollItems.eq(0).width(); //计算总长度,总个数*单个长度

    //下一张
    $(".spec-scroll .next").bind("click", function () {
        if (tempLength < countLength) {
            if ((countLength - tempLength) > moveLength) {
                scrollDiv.animate({ left: "-=" + moveLength + "px" }, moveTime);
                tempLength += moveLength;
            } else {
                scrollDiv.animate({ left: "-=" + (countLength - tempLength) + "px" }, moveTime);
                tempLength += (countLength - tempLength);
            }
        }
    });
    //上一张
    $(".spec-scroll .prev").bind("click", function () {
        if (tempLength > 0) {
            if (tempLength > moveLength) {
                scrollDiv.animate({ left: "+=" + moveLength + "px" }, moveTime);
                tempLength -= moveLength;
            } else {
                scrollDiv.animate({ left: "+=" + tempLength + "px" }, moveTime);
                tempLength = 0;
            }
        }
    });
});
//==================图片详细页函数=====================


/*nav导航鼠标移动块*/
(function ($) {
    $.fn.movebg = function (options) {
        var defaults = {
            width: 142,/*移动块的大小*/
            extra: 50,/*反弹的距离*/
            speed: 300,/*块移动的速度*/
            rebound_speed: 300/*块反弹的速度*/
        };
        var defaultser = $.extend(defaults, options);
        return this.each(function () {
            var _this = $(this);
            var _item = _this.children("ul").children("li").children("a");/*找到触发滑块滑动的元素 */
            var origin = _this.children("ul").children("li.cur").index();/*获得当前导航的索引*/
            var _mover = _this.find(".move-bg");/*找到滑块*/
            var hidden;/*设置一个变量当html中没有规定cur时在鼠标移出导航后消失*/
            if (origin == -1) { origin = 0; hidden = "1" } else { _mover.show() };/*如果没有定义cur,则默认从第一个滑动出来*/
            var cur = prev = origin;/*初始化当前的索引值等于上一个及初始值;*/
            var extra = defaultser.extra;/*声明一个变量表示额外滑动的距离*/
            _mover.css({ left: "" + defaultser.width * origin + "px" });/*设置滑块当前显示的位置*/

            //设置鼠标经过事件
            _item.each(function (index, it) {
                $(it).mouseover(function () {
                    cur = index;/*对当前滑块值进行赋值*/
                    move();
                    prev = cur;/*滑动完成对上个滑块值进行赋值*/
                });
            });
            _this.mouseleave(function () {
                cur = origin;/*鼠标离开导航时当前滑动值等于最初滑块值*/
                move();
                if (hidden == 1) { _mover.stop().fadeOut(); }/*当html中没有规定cur时在鼠标移出导航后消失*/
            });

            //滑动方法
            function move() {
                _mover.clearQueue();
                if (cur < prev) { extra = -Math.abs(defaultser.extra); } /*当当前值小于上个滑块值时，额外滑动值为负数*/
                else { extra = Math.abs(defaultser.extra) };/*当当前值大于上个滑块值时，滑动值为正数*/
                _mover.queue(
                    function () {
                        $(this).show().stop(true, true).animate({ left: "" + Number(cur * defaultser.width + extra) + "" }, defaultser.speed),
                        function () { $(this).dequeue() }
                    }
                );
                _mover.queue(
                    function () {
                        $(this).stop(true, true).animate({ left: "" + cur * defaultser.width + "" }, defaultser.rebound_speed),
                        function () { $(this).dequeue() }
                    }
                );
            };
        })
    }
})(jQuery);




// tab
function Pid(id, tag) {
    if (!tag) {
        return document.getElementById(id);
    }
    else {
        return document.getElementById(id).getElementsByTagName(tag);
    }
}

function tab(id, hx, box, iClass, s, pr) {
    var hxs = Pid(id, hx);
    var boxs = Pid(id, box);
    if (!iClass) { // 如果不指定class，则：
        boxsClass = boxs; // 直接使用box作为容器
    }
    else { // 如果指定class，则：
        var boxsClass = [];
        for (i = 0; i < boxs.length; i++) {
            if (boxs[i].className.match(/\btab\b/)) {// 判断容器的class匹配
                boxsClass.push(boxs[i]);
            }
        }
    }
    if (!pr) { // 如果不指定预展开容器，则：
        go_to(0); // 默认展开序列
        yy();
    }
    else {
        go_to(pr);
        yy();
    }
    function yy() {
        for (var i = 0; i < hxs.length; i++) {
            hxs[i].temp = i;
            if (!s) {// 如果不指定事件，则：
                s = "onclick"; // 使用默认事件
                hxs[i][s] = function () {
                    go_to(this.temp);
                }
            }
            else {
                hxs[i][s] = function () {
                    go_to(this.temp);
                }
            }
        }
    }
    function go_to(pr) {
        for (var i = 0; i < hxs.length; i++) {
            if (!hxs[i].tmpClass) {
                hxs[i].tmpClass = hxs[i].className += " ";
                boxsClass[i].tmpClass = boxsClass[i].className += " ";
            }
            if (pr == i) {
                hxs[i].className += " up"; // 展开状态：标题
                boxsClass[i].className += " up"; // 展开状态：容器
            }
            else {
                hxs[i].className = hxs[i].tmpClass;
                boxsClass[i].className = boxsClass[i].tmpClass;
            }
        }
    }
}

function Pid(id, tag) {
    if (!tag) {
        return document.getElementById(id);
    }
    else {
        return document.getElementById(id).getElementsByTagName(tag);
    }
}

function tab(id, hx, box, iClass, s, pr) {
    var hxs = Pid(id, hx);
    var boxs = Pid(id, box);
    if (!iClass) { // 如果不指定class，则：
        boxsClass = boxs; // 直接使用box作为容器
    }
    else { // 如果指定class，则：
        var boxsClass = [];
        for (i = 0; i < boxs.length; i++) {
            if (boxs[i].className.match(/\btab\b/)) {// 判断容器的class匹配
                boxsClass.push(boxs[i]);
            }
        }
    }
    if (!pr) { // 如果不指定预展开容器，则：
        go_to(0); // 默认展开序列
        yy();
    }
    else {
        go_to(pr);
        yy();
    }
    function yy() {
        for (var i = 0; i < hxs.length; i++) {
            hxs[i].temp = i;
            if (!s) {// 如果不指定事件，则：
                s = "onmouseover"; // 使用默认事件
                hxs[i][s] = function () {
                    go_to(this.temp);
                }
            }
            else {
                hxs[i][s] = function () {
                    go_to(this.temp);
                }
            }
        }
    }
    function go_to(pr) {
        for (var i = 0; i < hxs.length; i++) {
            if (!hxs[i].tmpClass) {
                hxs[i].tmpClass = hxs[i].className += " ";
                boxsClass[i].tmpClass = boxsClass[i].className += " ";
            }
            if (pr == i) {
                hxs[i].className += " up"; // 展开状态：标题
                boxsClass[i].className += " up"; // 展开状态：容器
            }
            else {
                hxs[i].className = hxs[i].tmpClass;
                boxsClass[i].className = boxsClass[i].tmpClass;
            }
        }
    }
}


/*nav 产品详细页切换*/
$(function () {
    tabChange("zntit", "click", "tithov")
});


/*tab 产品详细页切换*/
function tabChange(optionClass, mouse, btnAddClass) {
    var $action = null;
    $('.' + optionClass).each(function (index) {
        var run = function () {
            if (btnAddClass != null) {
                $('.' + optionClass).removeClass(btnAddClass);
                $('.' + optionClass + (index + 1)).addClass(btnAddClass);
            }
            $('.' + optionClass + "_con").hide();
            $('.' + optionClass + "_con" + (index + 1)).show();
        };
        if (mouse == "click") {
            $('.' + optionClass + (index + 1)).click(function () {
                run();
            });
        }
        if (mouse == "hover") {
            $('.' + optionClass + (index + 1))
                .mouseover(function () {
                    $action = setTimeout(run, 200);
                })
                .mouseout(function () {
                    clearTimeout($action);
                });;
        }
    });
}




/*!
 产品详细页flash
    
SWFObject v2.0 <http://code.google.com/p/swfobject/>
    Copyright (c) 2007 Geoff Stearns, Michael Williams, and Bobby van der Sluis
    This software is released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/

var swfobject = function () {

    var UNDEF = "undefined",
        OBJECT = "object",
        SHOCKWAVE_FLASH = "Shockwave Flash",
        SHOCKWAVE_FLASH_AX = "ShockwaveFlash.ShockwaveFlash",
        FLASH_MIME_TYPE = "application/x-shockwave-flash",
        EXPRESS_INSTALL_ID = "SWFObjectExprInst",

        win = window,
        doc = document,
        nav = navigator,

        domLoadFnArr = [],
        regObjArr = [],
        timer = null,
        storedAltContent = null,
        storedAltContentId = null,
        isDomLoaded = false,
        isExpressInstallActive = false;

    /* Centralized function for browser feature detection
        - Proprietary feature detection (conditional compiling) is used to detect Internet Explorer's features
        - User agent string detection is only used when no alternative is possible
        - Is executed directly for optimal performance
    */
    var ua = function () {
        var w3cdom = typeof doc.getElementById != UNDEF && typeof doc.getElementsByTagName != UNDEF && typeof doc.createElement != UNDEF && typeof doc.appendChild != UNDEF && typeof doc.replaceChild != UNDEF && typeof doc.removeChild != UNDEF && typeof doc.cloneNode != UNDEF,
            playerVersion = [0, 0, 0],
            d = null;
        if (typeof nav.plugins != UNDEF && typeof nav.plugins[SHOCKWAVE_FLASH] == OBJECT) {
            d = nav.plugins[SHOCKWAVE_FLASH].description;
            if (d) {
                d = d.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                playerVersion[0] = parseInt(d.replace(/^(.*)\..*$/, "$1"), 10);
                playerVersion[1] = parseInt(d.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                playerVersion[2] = /r/.test(d) ? parseInt(d.replace(/^.*r(.*)$/, "$1"), 10) : 0;
            }
        }
        else if (typeof win.ActiveXObject != UNDEF) {
            var a = null, fp6Crash = false;
            try {
                a = new ActiveXObject(SHOCKWAVE_FLASH_AX + ".7");
            }
            catch (e) {
                try {
                    a = new ActiveXObject(SHOCKWAVE_FLASH_AX + ".6");
                    playerVersion = [6, 0, 21];
                    a.AllowScriptAccess = "always";  // Introduced in fp6.0.47
                }
                catch (e) {
                    if (playerVersion[0] == 6) {
                        fp6Crash = true;
                    }
                }
                if (!fp6Crash) {
                    try {
                        a = new ActiveXObject(SHOCKWAVE_FLASH_AX);
                    }
                    catch (e) { }
                }
            }
            if (!fp6Crash && a) { // a will return null when ActiveX is disabled
                try {
                    d = a.GetVariable("$version");  // Will crash fp6.0.21/23/29
                    if (d) {
                        d = d.split(" ")[1].split(",");
                        playerVersion = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
                    }
                }
                catch (e) { }
            }
        }
        var u = nav.userAgent.toLowerCase(),
            p = nav.platform.toLowerCase(),
            webkit = /webkit/.test(u) ? parseFloat(u.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, // returns either the webkit version or false if not webkit
            ie = false,
            windows = p ? /win/.test(p) : /win/.test(u),
            mac = p ? /mac/.test(p) : /mac/.test(u);
        /*@cc_on
            ie = true;
            @if (@_win32)
                windows = true;
            @elif (@_mac)
                mac = true;
            @end
        @*/
        return { w3cdom: w3cdom, pv: playerVersion, webkit: webkit, ie: ie, win: windows, mac: mac };
    }();

    /* Cross-browser onDomLoad
        - Based on Dean Edwards' solution: http://dean.edwards.name/weblog/2006/06/again/
        - Will fire an event as soon as the DOM of a page is loaded (supported by Gecko based browsers - like Firefox -, IE, Opera9+, Safari)
    */
    var onDomLoad = function () {
        if (!ua.w3cdom) {
            return;
        }
        addDomLoadEvent(main);
        if (ua.ie && ua.win) {
            try {  // Avoid a possible Operation Aborted error
                doc.write("<scr" + "ipt id=__ie_ondomload defer=true src=//:></scr" + "ipt>"); // String is split into pieces to avoid Norton AV to add code that can cause errors 
                var s = getElementById("__ie_ondomload");
                if (s) {
                    s.onreadystatechange = function () {
                        if (this.readyState == "complete") {
                            this.parentNode.removeChild(this);
                            callDomLoadFunctions();
                        }
                    };
                }
            }
            catch (e) { }
        }
        if (ua.webkit && typeof doc.readyState != UNDEF) {
            timer = setInterval(function () { if (/loaded|complete/.test(doc.readyState)) { callDomLoadFunctions(); } }, 10);
        }
        if (typeof doc.addEventListener != UNDEF) {
            doc.addEventListener("DOMContentLoaded", callDomLoadFunctions, null);
        }
        addLoadEvent(callDomLoadFunctions);
    }();

    function callDomLoadFunctions() {
        if (isDomLoaded) {
            return;
        }
        if (ua.ie && ua.win) { // Test if we can really add elements to the DOM; we don't want to fire it too early
            var s = createElement("span");
            try { // Avoid a possible Operation Aborted error
                var t = doc.getElementsByTagName("body")[0].appendChild(s);
                t.parentNode.removeChild(t);
            }
            catch (e) {
                return;
            }
        }
        isDomLoaded = true;
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
        var dl = domLoadFnArr.length;
        for (var i = 0; i < dl; i++) {
            domLoadFnArr[i]();
        }
    }

    function addDomLoadEvent(fn) {
        if (isDomLoaded) {
            fn();
        }
        else {
            domLoadFnArr[domLoadFnArr.length] = fn; // Array.push() is only available in IE5.5+
        }
    }

    /* Cross-browser onload
        - Based on James Edwards' solution: http://brothercake.com/site/resources/scripts/onload/
        - Will fire an event as soon as a web page including all of its assets are loaded 
     */
    function addLoadEvent(fn) {
        if (typeof win.addEventListener != UNDEF) {
            win.addEventListener("load", fn, false);
        }
        else if (typeof doc.addEventListener != UNDEF) {
            doc.addEventListener("load", fn, false);
        }
        else if (typeof win.attachEvent != UNDEF) {
            win.attachEvent("onload", fn);
        }
        else if (typeof win.onload == "function") {
            var fnOld = win.onload;
            win.onload = function () {
                fnOld();
                fn();
            };
        }
        else {
            win.onload = fn;
        }
    }

    /* Main function
        - Will preferably execute onDomLoad, otherwise onload (as a fallback)
    */
    function main() { // Static publishing only
        var rl = regObjArr.length;
        for (var i = 0; i < rl; i++) { // For each registered object element
            var id = regObjArr[i].id;
            if (ua.pv[0] > 0) {
                var obj = getElementById(id);
                if (obj) {
                    regObjArr[i].width = obj.getAttribute("width") ? obj.getAttribute("width") : "0";
                    regObjArr[i].height = obj.getAttribute("height") ? obj.getAttribute("height") : "0";
                    if (hasPlayerVersion(regObjArr[i].swfVersion)) { // Flash plug-in version >= Flash content version: Houston, we have a match!
                        if (ua.webkit && ua.webkit < 312) { // Older webkit engines ignore the object element's nested param elements
                            fixParams(obj);
                        }
                        setVisibility(id, true);
                    }
                    else if (regObjArr[i].expressInstall && !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac)) { // Show the Adobe Express Install dialog if set by the web page author and if supported (fp6.0.65+ on Win/Mac OS only)
                        showExpressInstall(regObjArr[i]);
                    }
                    else { // Flash plug-in and Flash content version mismatch: display alternative content instead of Flash content
                        displayAltContent(obj);
                    }
                }
            }
            else {  // If no fp is installed, we let the object element do its job (show alternative content)
                setVisibility(id, true);
            }
        }
    }

    /* Fix nested param elements, which are ignored by older webkit engines
        - This includes Safari up to and including version 1.2.2 on Mac OS 10.3
        - Fall back to the proprietary embed element
    */
    function fixParams(obj) {
        var nestedObj = obj.getElementsByTagName(OBJECT)[0];
        if (nestedObj) {
            var e = createElement("embed"), a = nestedObj.attributes;
            if (a) {
                var al = a.length;
                for (var i = 0; i < al; i++) {
                    if (a[i].nodeName.toLowerCase() == "data") {
                        e.setAttribute("src", a[i].nodeValue);
                    }
                    else {
                        e.setAttribute(a[i].nodeName, a[i].nodeValue);
                    }
                }
            }
            var c = nestedObj.childNodes;
            if (c) {
                var cl = c.length;
                for (var j = 0; j < cl; j++) {
                    if (c[j].nodeType == 1 && c[j].nodeName.toLowerCase() == "param") {
                        e.setAttribute(c[j].getAttribute("name"), c[j].getAttribute("value"));
                    }
                }
            }
            obj.parentNode.replaceChild(e, obj);
        }
    }

    /* Fix hanging audio/video threads and force open sockets and NetConnections to disconnect
        - Occurs when unloading a web page in IE using fp8+ and innerHTML/outerHTML
        - Dynamic publishing only
    */
    function fixObjectLeaks(id) {
        if (ua.ie && ua.win && hasPlayerVersion("8.0.0")) {
            win.attachEvent("onunload", function () {
                var obj = getElementById(id);
                if (obj) {
                    for (var i in obj) {
                        if (typeof obj[i] == "function") {
                            obj[i] = function () { };
                        }
                    }
                    obj.parentNode.removeChild(obj);
                }
            });
        }
    }

    /* Show the Adobe Express Install dialog
        - Reference: http://www.adobe.com/cfusion/knowledgebase/index.cfm?id=6a253b75
    */
    function showExpressInstall(regObj) {
        isExpressInstallActive = true;
        var obj = getElementById(regObj.id);
        if (obj) {
            if (regObj.altContentId) {
                var ac = getElementById(regObj.altContentId);
                if (ac) {
                    storedAltContent = ac;
                    storedAltContentId = regObj.altContentId;
                }
            }
            else {
                storedAltContent = abstractAltContent(obj);
            }
            if (!(/%$/.test(regObj.width)) && parseInt(regObj.width, 10) < 310) {
                regObj.width = "310";
            }
            if (!(/%$/.test(regObj.height)) && parseInt(regObj.height, 10) < 137) {
                regObj.height = "137";
            }
            doc.title = doc.title.slice(0, 47) + " - Flash Player Installation";
            var pt = ua.ie && ua.win ? "ActiveX" : "PlugIn",
                dt = doc.title,
                fv = "MMredirectURL=" + win.location + "&MMplayerType=" + pt + "&MMdoctitle=" + dt,
                replaceId = regObj.id;
            // For IE when a SWF is loading (AND: not available in cache) wait for the onload event to fire to remove the original object element
            // In IE you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            if (ua.ie && ua.win && obj.readyState != 4) {
                var newObj = createElement("div");
                replaceId += "SWFObjectNew";
                newObj.setAttribute("id", replaceId);
                obj.parentNode.insertBefore(newObj, obj); // Insert placeholder div that will be replaced by the object element that loads expressinstall.swf
                obj.style.display = "none";
                win.attachEvent("onload", function () { obj.parentNode.removeChild(obj); });
            }
            createSWF({ data: regObj.expressInstall, id: EXPRESS_INSTALL_ID, width: regObj.width, height: regObj.height }, { flashvars: fv }, replaceId);
        }
    }

    /* Functions to abstract and display alternative content
    */
    function displayAltContent(obj) {
        if (ua.ie && ua.win && obj.readyState != 4) {
            // For IE when a SWF is loading (AND: not available in cache) wait for the onload event to fire to remove the original object element
            // In IE you cannot properly cancel a loading SWF file without breaking browser load references, also obj.onreadystatechange doesn't work
            var el = createElement("div");
            obj.parentNode.insertBefore(el, obj); // Insert placeholder div that will be replaced by the alternative content
            el.parentNode.replaceChild(abstractAltContent(obj), el);
            obj.style.display = "none";
            win.attachEvent("onload", function () { obj.parentNode.removeChild(obj); });
        }
        else {
            obj.parentNode.replaceChild(abstractAltContent(obj), obj);
        }
    }

    function abstractAltContent(obj) {
        var ac = createElement("div");
        if (ua.win && ua.ie) {
            ac.innerHTML = obj.innerHTML;
        }
        else {
            var nestedObj = obj.getElementsByTagName(OBJECT)[0];
            if (nestedObj) {
                var c = nestedObj.childNodes;
                if (c) {
                    var cl = c.length;
                    for (var i = 0; i < cl; i++) {
                        if (!(c[i].nodeType == 1 && c[i].nodeName.toLowerCase() == "param") && !(c[i].nodeType == 8)) {
                            ac.appendChild(c[i].cloneNode(true));
                        }
                    }
                }
            }
        }
        return ac;
    }

    /* Cross-browser dynamic SWF creation
    */
    function createSWF(attObj, parObj, id) {
        var r, el = getElementById(id);
        if (typeof attObj.id == UNDEF) { // if no 'id' is defined for the object element, it will inherit the 'id' from the alternative content
            attObj.id = id;
        }
        if (ua.ie && ua.win) { // IE, the object element and W3C DOM methods do not combine: fall back to outerHTML
            var att = "";
            for (var i in attObj) {
                if (attObj[i] != Object.prototype[i]) { // Filter out prototype additions from other potential libraries, like Object.prototype.toJSONString = function() {}
                    if (i == "data") {
                        parObj.movie = attObj[i];
                    }
                    else if (i.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                        att += ' class="' + attObj[i] + '"';
                    }
                    else if (i != "classid") {
                        att += ' ' + i + '="' + attObj[i] + '"';
                    }
                }
            }
            var par = "";
            for (var j in parObj) {
                if (parObj[j] != Object.prototype[j]) { // Filter out prototype additions from other potential libraries
                    par += '<param name="' + j + '" value="' + parObj[j] + '" />';
                }
            }
            el.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + att + '>' + par + '</object>';
            fixObjectLeaks(attObj.id); // This bug affects dynamic publishing only
            r = getElementById(attObj.id);
        }
        else if (ua.webkit && ua.webkit < 312) { // Older webkit engines ignore the object element's nested param elements: fall back to the proprietary embed element
            var e = createElement("embed");
            e.setAttribute("type", FLASH_MIME_TYPE);
            for (var k in attObj) {
                if (attObj[k] != Object.prototype[k]) { // Filter out prototype additions from other potential libraries
                    if (k == "data") {
                        e.setAttribute("src", attObj[k]);
                    }
                    else if (k.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                        e.setAttribute("class", attObj[k]);
                    }
                    else if (k != "classid") { // Filter out IE specific attribute
                        e.setAttribute(k, attObj[k]);
                    }
                }
            }
            for (var l in parObj) {
                if (parObj[l] != Object.prototype[l]) { // Filter out prototype additions from other potential libraries
                    if (l != "movie") { // Filter out IE specific param element
                        e.setAttribute(l, parObj[l]);
                    }
                }
            }
            el.parentNode.replaceChild(e, el);
            r = e;
        }
        else { // Well-behaving browsers
            var o = createElement(OBJECT);
            o.setAttribute("type", FLASH_MIME_TYPE);
            for (var m in attObj) {
                if (attObj[m] != Object.prototype[m]) { // Filter out prototype additions from other potential libraries
                    if (m.toLowerCase() == "styleclass") { // 'class' is an ECMA4 reserved keyword
                        o.setAttribute("class", attObj[m]);
                    }
                    else if (m != "classid") { // Filter out IE specific attribute
                        o.setAttribute(m, attObj[m]);
                    }
                }
            }
            for (var n in parObj) {
                if (parObj[n] != Object.prototype[n] && n != "movie") { // Filter out prototype additions from other potential libraries and IE specific param element
                    createObjParam(o, n, parObj[n]);
                }
            }
            el.parentNode.replaceChild(o, el);
            r = o;
        }
        return r;
    }

    function createObjParam(el, pName, pValue) {
        var p = createElement("param");
        p.setAttribute("name", pName);
        p.setAttribute("value", pValue);
        el.appendChild(p);
    }

    function getElementById(id) {
        return doc.getElementById(id);
    }

    function createElement(el) {
        return doc.createElement(el);
    }

    function hasPlayerVersion(rv) {
        var pv = ua.pv, v = rv.split(".");
        v[0] = parseInt(v[0], 10);
        v[1] = parseInt(v[1], 10);
        v[2] = parseInt(v[2], 10);
        return (pv[0] > v[0] || (pv[0] == v[0] && pv[1] > v[1]) || (pv[0] == v[0] && pv[1] == v[1] && pv[2] >= v[2])) ? true : false;
    }

    /* Cross-browser dynamic CSS creation
        - Based on Bobby van der Sluis' solution: http://www.bobbyvandersluis.com/articles/dynamicCSS.php
    */
    function createCSS(sel, decl) {
        if (ua.ie && ua.mac) {
            return;
        }
        var h = doc.getElementsByTagName("head")[0], s = createElement("style");
        s.setAttribute("type", "text/css");
        s.setAttribute("media", "screen");
        if (!(ua.ie && ua.win) && typeof doc.createTextNode != UNDEF) {
            s.appendChild(doc.createTextNode(sel + " {" + decl + "}"));
        }
        h.appendChild(s);
        if (ua.ie && ua.win && typeof doc.styleSheets != UNDEF && doc.styleSheets.length > 0) {
            var ls = doc.styleSheets[doc.styleSheets.length - 1];
            if (typeof ls.addRule == OBJECT) {
                ls.addRule(sel, decl);
            }
        }
    }

    function setVisibility(id, isVisible) {
        var v = isVisible ? "inherit" : "hidden";
        if (isDomLoaded) {
            getElementById(id).style.visibility = v;
        }
        else {
            createCSS("#" + id, "visibility:" + v);
        }
    }

    function getTargetVersion(obj) {
        if (!obj)
            return 0;
        var c = obj.childNodes;
        var cl = c.length;
        for (var i = 0; i < cl; i++) {
            if (c[i].nodeType == 1 && c[i].nodeName.toLowerCase() == "object") {
                c = c[i].childNodes;
                cl = c.length;
                i = 0;
            }
            if (c[i].nodeType == 1 && c[i].nodeName.toLowerCase() == "param" && c[i].getAttribute("name") == "swfversion") {
                return c[i].getAttribute("value");
            }
        }
        return 0;
    }

    function getExpressInstall(obj) {
        if (!obj)
            return "";
        var c = obj.childNodes;
        var cl = c.length;
        for (var i = 0; i < cl; i++) {
            if (c[i].nodeType == 1 && c[i].nodeName.toLowerCase() == "object") {
                c = c[i].childNodes;
                cl = c.length;
                i = 0;
            }
            if (c[i].nodeType == 1 && c[i].nodeName.toLowerCase() == "param" && c[i].getAttribute("name") == "expressinstall") {
                return c[i].getAttribute("value");
            }
        }
        return "";
    }

    return {
        /* Public API
            - Reference: http://code.google.com/p/swfobject/wiki/SWFObject_2_0_documentation
        */
        registerObject: function (objectIdStr, swfVersionStr, xiSwfUrlStr) {
            if (!ua.w3cdom || !objectIdStr) {
                return;
            }
            var obj = document.getElementById(objectIdStr);
            var xi = getExpressInstall(obj);
            var regObj = {};
            regObj.id = objectIdStr;
            regObj.swfVersion = swfVersionStr ? swfVersionStr : getTargetVersion(obj);
            regObj.expressInstall = xiSwfUrlStr ? xiSwfUrlStr : ((xi != "") ? xi : false);
            regObjArr[regObjArr.length] = regObj;
            setVisibility(objectIdStr, false);
        },

        getObjectById: function (objectIdStr) {
            var r = null;
            if (ua.w3cdom && isDomLoaded) {
                var o = getElementById(objectIdStr);
                if (o) {
                    var n = o.getElementsByTagName(OBJECT)[0];
                    if (!n || (n && typeof o.SetVariable != UNDEF)) {
                        r = o;
                    }
                    else if (typeof n.SetVariable != UNDEF) {
                        r = n;
                    }
                }
            }
            return r;
        },

        embedSWF: function (swfUrlStr, replaceElemIdStr, widthStr, heightStr, swfVersionStr, xiSwfUrlStr, flashvarsObj, parObj, attObj) {
            if (!ua.w3cdom || !swfUrlStr || !replaceElemIdStr || !widthStr || !heightStr || !swfVersionStr) {
                return;
            }
            widthStr += ""; // Auto-convert to string to make it idiot proof
            heightStr += "";
            if (hasPlayerVersion(swfVersionStr)) {
                setVisibility(replaceElemIdStr, false);
                var att = (typeof attObj == OBJECT) ? attObj : {};
                att.data = swfUrlStr;
                att.width = widthStr;
                att.height = heightStr;
                var par = (typeof parObj == OBJECT) ? parObj : {};
                if (typeof flashvarsObj == OBJECT) {
                    for (var i in flashvarsObj) {
                        if (flashvarsObj[i] != Object.prototype[i]) { // Filter out prototype additions from other potential libraries
                            if (typeof par.flashvars != UNDEF) {
                                par.flashvars += "&" + i + "=" + flashvarsObj[i];
                            }
                            else {
                                par.flashvars = i + "=" + flashvarsObj[i];
                            }
                        }
                    }
                }
                addDomLoadEvent(function () {
                    createSWF(att, par, replaceElemIdStr);
                    if (att.id == replaceElemIdStr) {
                        setVisibility(replaceElemIdStr, true);
                    }
                });
            }
            else if (xiSwfUrlStr && !isExpressInstallActive && hasPlayerVersion("6.0.65") && (ua.win || ua.mac)) {
                setVisibility(replaceElemIdStr, false);
                addDomLoadEvent(function () {
                    var regObj = {};
                    regObj.id = regObj.altContentId = replaceElemIdStr;
                    regObj.width = widthStr;
                    regObj.height = heightStr;
                    regObj.expressInstall = xiSwfUrlStr;
                    showExpressInstall(regObj);
                });
            }
        },

        getFlashPlayerVersion: function () {
            return { major: ua.pv[0], minor: ua.pv[1], release: ua.pv[2] };
        },

        hasFlashPlayerVersion: hasPlayerVersion,

        createSWF: function (attObj, parObj, replaceElemIdStr) {
            if (ua.w3cdom && isDomLoaded) {
                return createSWF(attObj, parObj, replaceElemIdStr);
            }
            else {
                return undefined;
            }
        },

        createCSS: function (sel, decl) {
            if (ua.w3cdom) {
                createCSS(sel, decl);
            }
        },

        addDomLoadEvent: addDomLoadEvent,

        addLoadEvent: addLoadEvent,

        getQueryParamValue: function (param) {
            var q = doc.location.search || doc.location.hash;
            if (param == null) {
                return q;
            }
            if (q) {
                var pairs = q.substring(1).split("&");
                for (var i = 0; i < pairs.length; i++) {
                    if (pairs[i].substring(0, pairs[i].indexOf("=")) == param) {
                        return pairs[i].substring((pairs[i].indexOf("=") + 1));
                    }
                }
            }
            return "";
        },

        // For internal usage only
        expressInstallCallback: function () {
            if (isExpressInstallActive && storedAltContent) {
                var obj = getElementById(EXPRESS_INSTALL_ID);
                if (obj) {
                    obj.parentNode.replaceChild(storedAltContent, obj);
                    if (storedAltContentId) {
                        setVisibility(storedAltContentId, true);
                        if (ua.ie && ua.win) {
                            storedAltContent.style.display = "block";
                        }
                    }
                    storedAltContent = null;
                    storedAltContentId = null;
                    isExpressInstallActive = false;
                }
            }
        }

    };

}();

/*!产品详细页flash*/


/*
  jQuery MegaMenu Plugin
  Author: GeekTantra
  Author URI: http://www.geektantra.com
  地板导航
*/
var isIE6 = navigator.userAgent.toLowerCase().indexOf('msie 6') != -1;
jQuery.fn.megamenu = function (options) {
    options = jQuery.extend({
        activate_action: "mouseover",
        deactivate_action: "mouseleave",
        show_method: "slideDown",
        hide_method: "slideUp",
        justify: "left",
        enable_js_shadow: true,
        shadow_size: 3,
        mm_timeout: 250
    }, options);
    var $megamenu_object = this;
    if (options.activate_action == "click") options.mm_timeout = 0;
    $megamenu_object.children("li").each(function () {
        jQuery(this).addClass("mm-item");
        jQuery(".mm-item").css({ 'float': options.justify });

        jQuery(this).find("div:first").addClass("mm-item-content");
        jQuery(this).find("a:first").addClass("mm-item-link");
        var $mm_item_content = jQuery(this).find(".mm-item-content");
        var $mm_item_link = jQuery(this).find(".mm-item-link");
        $mm_item_content.hide();

        jQuery(document).bind("click", function () {
            jQuery(".mm-item-content").hide();
            jQuery(".mm-item-link").removeClass("mm-item-link-hover");
        });
        jQuery(this).bind("click", function (e) {
            e.stopPropagation();
        });
        $mm_item_content.wrapInner('<div class="mm-content-base"></div>');
        if (options.enable_js_shadow == true) {
            //$mm_item_content.append('<div class="mm-js-shadow"></div>');
        }
        var $mm_timer = 0;
        // Activation Method Starts
        jQuery(this).bind(options.activate_action, function (e) {
            e.stopPropagation();
            var mm_item_link_obj = jQuery(this).find("a.mm-item-link");
            var mm_item_content_obj = jQuery(this).find("div.mm-item-content");
            clearTimeout($mm_timer);
            $mm_timer = setTimeout(function () { //Emulate HoverIntent
                mm_item_link_obj.addClass("mm-item-link-hover");
                mm_item_content_obj.css({
                    'top': ($mm_item_link.offset().top + $mm_item_link.outerHeight()) - 0 + "px",
                    'left': ($mm_item_link.offset().left) - 5 + 'px'
                })

                if (options.justify == "left") {
                    var mm_object_right_end = $megamenu_object.offset().left + $megamenu_object.outerWidth();
                    // Coordinates of the right end of the megamenu object
                    var mm_content_right_end = $mm_item_link.offset().left + $mm_item_content.outerWidth() - 5;
                    // Coordinates of the right end of the megamenu content
                    if (mm_content_right_end >= mm_object_right_end) { // Menu content exceeding the outer box
                        mm_item_content_obj.css({
                            'left': ($mm_item_link.offset().left - (mm_content_right_end - mm_object_right_end)) - 2 + 'px'
                        }); // Limit megamenu inside the outer box
                    }
                } else if (options.justify == "right") {
                    var mm_object_left_end = $megamenu_object.offset().left;
                    // Coordinates of the left end of the megamenu object
                    var mm_content_left_end = $mm_item_link.offset().left - mm_item_content_obj.outerWidth() +
                                              $mm_item_link.outerWidth() + 5;
                    // Coordinates of the left end of the megamenu content
                    if (mm_content_left_end <= mm_object_left_end) { // Menu content exceeding the outer box
                        mm_item_content_obj.css({
                            'left': mm_object_left_end + 2 + 'px'
                        }); // Limit megamenu inside the outer box
                    } else {
                        mm_item_content_obj.css({
                            'left': mm_content_left_end + 'px'
                        }); // Limit megamenu inside the outer box
                    }
                }
                if (options.enable_js_shadow == true) {
                    mm_item_content_obj.find(".mm-js-shadow").height(mm_item_content_obj.height());
                    mm_item_content_obj.find(".mm-js-shadow").width(mm_item_content_obj.width());
                    mm_item_content_obj.find(".mm-js-shadow").css({
                        'top': (options.shadow_size) + (isIE6 ? 2 : 0) + "px",
                        'left': (options.shadow_size) + (isIE6 ? 2 : 0) + "px",
                        'opacity': 0.5
                    });
                }
                switch (options.show_method) {
                    case "simple":
                        mm_item_content_obj.show();
                        break;
                    case "slideDown":
                        mm_item_content_obj.height("auto");
                        mm_item_content_obj.slideDown('fast');
                        break;
                    case "fadeIn":
                        mm_item_content_obj.fadeTo('fast', 1);
                        break;
                    default:
                        mm_item_content_obj.each(options.show_method);
                        break;
                }
            }, options.mm_timeout);
        });
        // Activation Method Ends
        // Deactivation Method Starts
        jQuery(this).bind(options.deactivate_action, function (e) {
            e.stopPropagation();
            clearTimeout($mm_timer);
            var mm_item_link_obj = jQuery(this).find("a.mm-item-link");
            var mm_item_content_obj = jQuery(this).find("div.mm-item-content");
            //      mm_item_content_obj.stop();
            switch (options.hide_method) {
                case "simple":
                    mm_item_content_obj.hide();
                    mm_item_link_obj.removeClass("mm-item-link-hover");
                    break;
                case "slideUp":
                    mm_item_content_obj.slideUp('fast', function () {
                        mm_item_link_obj.removeClass("mm-item-link-hover");
                    });
                    break;
                case "fadeOut":
                    mm_item_content_obj.fadeOut('fast', function () {
                        mm_item_link_obj.removeClass("mm-item-link-hover");
                    });
                    break;
                default:
                    mm_item_content_obj.each(options.hide_method);
                    mm_item_link_obj.removeClass("mm-item-link-hover");
                    break;
            }
            if (mm_item_content_obj.length < 1) mm_item_link_obj.removeClass("mm-item-link-hover");
        });
        //    Deactivation Method Ends
    });
    this.find(">li:last").after('<li class="clear-fix"></li>');
    this.show();
};


//导航条透明下拉
jQuery(function () {
    var SelfLocation = window.location.href.split('?');
    switch (SelfLocation[1]) {
        case "justify_right":
            jQuery(".megamenu").megamenu({ 'justify': 'right' });
            break;
        case "justify_left":
        default:
            jQuery(".megamenu").megamenu();
    }
});
/*
   地板导航
*/




/*
 *  soChange 1.4 - simple gallery with jQuery
 *  made by bujichong 2009-12-14
 *  作者：不羁虫  2009-12-14
 * http://hi.baidu.com/bujichong/
 */

(function ($) {
    $.fn.soChange = function (o) {
        return new $sG(this, o);
        //alert('do');
    };

    var settings = {
        thumbObj: null,//导航对象
        botPrev: null,//按钮上一个
        botNext: null,//按钮下一个
        thumbNowClass: 'now',//导航对象当前的class,默认为now
        thumbOverEvent: true,//鼠标经过thumbObj时是否切换对象，默认为true，为false时，只有鼠标点击thumbObj才切换对象
        slideTime: 1000,//平滑过渡时间，默认为1000ms
        autoChange: true,//是否自动切换，默认为true
        clickFalse: true,//导航对象如果有链接，点击是否链接无效，即是否返回return false，默认是return false链接无效，当thumbOverEvent为false时，此项必须为true，否则鼠标点击事件冲突
        overStop: true,//鼠标经过切换对象时，切换对象是否停止切换，并于鼠标离开后重启自动切换，前提是已开启自动切换
        changeTime: 5000,//自动切换时间
        delayTime: 300//鼠标经过时对象切换迟滞时间，推荐值为300ms
    };

    $.soChangeLong = function (e, o) {
        this.options = $.extend({}, settings, o || {});
        var _self = $(e);
        var set = this.options;
        var thumbObj;
        var size = _self.size();
        var nowIndex = 0; //定义全局指针
        var index;//定义全局指针
        var startRun;//预定义自动运行参数
        var delayRun;//预定义延迟运行参数

        //初始化
        _self.hide();
        _self.eq(0).show();

        //主切换函数
        function fadeAB() {
            if (nowIndex != index) {
                if (set.thumbObj != null) {
                    $(set.thumbObj).removeClass(set.thumbNowClass).eq(index).addClass(set.thumbNowClass);
                }
                if (set.slideTime <= 0) {
                    _self.eq(nowIndex).hide();
                    _self.eq(index).show();
                } else {
                    _self.eq(nowIndex).fadeOut(set.slideTime);
                    _self.eq(index).fadeIn(set.slideTime);
                }
                nowIndex = index;
                if (set.autoChange == true) {
                    clearInterval(startRun);//重置自动切换函数
                    startRun = setInterval(runNext, set.changeTime);
                }
            }
        }




        //切换到下一个
        function runNext() {
            index = (nowIndex + 1) % size;
            fadeAB();
        }

        //点击任一图片
        if (set.thumbObj != null) {
            thumbObj = $(set.thumbObj);
            //初始化
            thumbObj.removeClass(set.thumbNowClass).eq(0).addClass(set.thumbNowClass);

            thumbObj.click(function () {
                index = thumbObj.index($(this));
                fadeAB();
                if (set.clickFalse == true) {
                    return false;
                }
            });
            if (set.thumbOverEvent == true) {
                thumbObj.mouseenter(function () {
                    index = thumbObj.index($(this));
                    delayRun = setTimeout(fadeAB, set.delayTime);
                });
                thumbObj.mouseleave(function () {
                    clearTimeout(delayRun);
                });
            }
        }

        //点击上一个
        if (set.botNext != null) {
            $(set.botNext).click(function () {
                if (_self.queue().length < 1) {
                    runNext();
                }
                return false;
            });
        }

        //点击下一个
        if (set.botPrev != null) {
            $(set.botPrev).click(function () {
                if (_self.queue().length < 1) {
                    index = (nowIndex + size - 1) % size;
                    fadeAB();
                }
                return false;
            });
        }

        //自动运行
        if (set.autoChange == true) {
            startRun = setInterval(runNext, set.changeTime);
            if (set.overStop == true) {
                _self.mouseenter(function () {
                    clearInterval(startRun);//重置自动切换函数

                });
                _self.mouseleave(function () {
                    startRun = setInterval(runNext, set.changeTime);
                });
            }
        }

    }

    var $sG = $.soChangeLong;

})(jQuery);


//搜索查询
function SiteSearch(send_url, divTgs, channel_name) {
    var strwhere = "";
    if (channel_name !== undefined) {
        strwhere = "&channel_name=" + channel_name
    }
    var str = $.trim($(divTgs).val());
    if (str.length > 0 && str != "输入关健字") {
        window.location.href = send_url + "?keyword=" + encodeURI($(divTgs).val()) + strwhere;
    }
    return false;
}

//切换验证码
function ToggleCode(obj, codeurl) {
    $(obj).children("img").eq(0).attr("src", codeurl + "?time=" + Math.random());
    return false;
}


//左侧产品栏目JS
$(document).ready(function () {
    $('.inactive').click(function (e) {
        e.preventDefault();
        if ($(this).siblings('ul').css('display') == 'none') {
            $(this).parent('li').siblings('li').removeClass('inactives');
            $(this).addClass('inactives');
            $(this).siblings('ul').slideDown(100).children('li');
            if ($(this).parents('li').siblings('li').children('ul').css('display') == 'block') {
                $(this).parents('li').siblings('li').children('ul').parent('li').children('a').removeClass('inactives');
                $(this).parents('li').siblings('li').children('ul').slideUp(100);

            }
        } else {
            //控制自身变成+号
            $(this).removeClass('inactives');
            //控制自身菜单下子菜单隐藏
            $(this).siblings('ul').slideUp(100);
            //控制自身子菜单变成+号
            $(this).siblings('ul').children('li').children('ul').parent('li').children('a').addClass('inactives');
            //控制自身菜单下子菜单隐藏
            $(this).siblings('ul').children('li').children('ul').slideUp(100);

            //控制同级菜单只保持一个是展开的（-号显示）
            $(this).siblings('ul').children('li').children('a').removeClass('inactives');
        }
    })
});

 

