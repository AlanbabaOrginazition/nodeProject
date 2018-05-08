$(function () {   //$(document).ready(function(){})
    var ws = new WebSocket('ws://localhost:3000/test');
    $("#send").on("click", function () {
        var text = $("#chat-text").val();
        if (text) {
            ws.send(text);
            $("#chat-text").val('')
        }
    })
    // 响应onmessage事件:
    ws.onopen = function () {
        console.log('连接成功');
    };
    ws.onmessage = function (msg) {
        console.log(msg);
        var data = JSON.parse(msg.data);
        switch (data.type) {
            case 'join':
                var f = false;
                $("#userlist").find('label').each(function () {
                    if ($(this)[0].innerText == data.user.name) {
                        f = true;
                        return false;//each函数不能使用break或者continue，要使用return false和return true代替
                    }
                })
                if(!f) {
                    $("#userlist").append("<label>" + data.user.name + "</label>");
                    if ($("#chat-content label:last-child").length > 0)
                        $("#chat-content label:last-child").after("<p class='msg'>" + data.data + "</p>");
                    else {
                        $("#chat-content").append("<p class='msg'>" + data.data + "</p>");
                    }
                }else{

                }
                break;
            case 'chat':
                $("#chat-content").append("<label>" + data.user.name + ":&nbsp;&nbsp;" + data.data + "</label>");
                break;
            case 'list':
                for (var i in data.data) {
                    $("#userlist").append("<label>" + data.data[i] + "</label>")
                }
                break;
            case 'left':
                if ($("#chat-content label:last-child").length > 0)
                    $("#chat-content label:last-child").after("<p class='msg'>" + data.data + "</p>");
                else {
                    $("#chat-content").append("<p class='msg'>" + data.data + "</p>");
                }
                $("#userlist").find('label').each(function () {
                    if ($(this)[0].innerText == data.user.name) {
                        $(this).remove();
                    }
                })
                break;
            case 'repeat':
                confirm("当前用户已经登陆,请点击确定重新登录");
                window.location = '../login';
                break;
        }
    };
})