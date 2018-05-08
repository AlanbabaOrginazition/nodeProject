var timer;
var radius = 0.5, radius1 = 0.5, angle = 0, startRidus = 10;;
var angle0, rident;
var options, resolution = [];
$(function () {
    var canvas1 = document.getElementById("mouse");
    canvas1.width = parseInt($(".main").css("width"));
    canvas1.height = parseInt($(".main").css("height"));

    var canvas2 = document.getElementById("light");
    canvas2.width = parseInt($(".main").css("width"));
    canvas2.height = parseInt($(".main").css("height"));

    var pointCanvas = document.getElementById("point");
    pointCanvas.width = parseInt($(".main").css("width"));
    pointCanvas.height = parseInt($(".main").css("height"));

    /*var smokeCanvas = document.getElementById("smoke_canvas");
    smokeCanvas.width = window.innerWidth;
    smokeCanvas.height = window.innerHeight;*/

    var mapCanvas = document.getElementById("map-main");
    mapCanvas.width = parseInt($(".main").css("width"));
    mapCanvas.height = parseInt($(".main").css("height"));

    $(window).resize(function () {
    });

    $("#btn").on('click', function (e) {
        /*var data = [];
        for (var i = 0; i < 20000; i++) {
            data.push([Math.random() * canvas1.width, Math.random() * canvas1.height]);
        }
        heatmap(data);*/
       // drawCirc();
       var size=50;
       for(var i=0;i<8;i++){
            drawHexagon({x:0,y:200 + size * Math.sqrt(3) * i},size);
       }
        e.stopPropagation();
    })
    $("#smoke").on('click', function (e) {
        //smoke();

        //loadTitle();
        //return;
        /*$.get('../title',function(data){
            var a = data;
        })*/

        options = {
            containerId: "map-main",
            center: [11000000, 5000000],
            zoom: 5
        }
        map(options);
        e.stopPropagation();
    })
    //地图放大
    $("#zoomout").on("click", function () {
        options.zoom = ++options.zoom > 22 ? 22 : options.zoom;
        map(options);
        geoXYtoScreenXY(11000000, 5000000);
    })
    //地图缩小
    $("#zoomin").on("click", function () {
        options.zoom = --options.zoom < 0 ? 0 : options.zoom;
        map(options);
    })
    //地图点击事件
    mapCanvas.addEventListener('mousedown', function (e) {
        var ex = e.clientX, ey = e.clientY;
        $(document).on("mousemove", function (env) {
            var dx = env.clientX - ex;
            var dy = env.clientY - ey;
            ex = env.clientX;
            ey = env.clientY;
            var screenxy = movedScreenXY(dx * 2, dy * 2);
            //console.log(`dx${dx},dy${dy}`);
            obj = screenXYtoGeoXY(screenxy.screenX, screenxy.screenY);
            console.log(obj);
            options.center = [obj.x, obj.y];
            map(options);
        })
        $(document).on("mouseup", function () {
            $(document).off("mousemove");
            $(document).off("mouseup");
        })
    })
    //鼠标滑轮滚动事件
    mapCanvas.addEventListener('mousewheel', function (e) {
        e = e || window.event;
        var o = screenXYtoGeoXY(e.clientX, e.clientY);
        options.center = [o.x, o.y];
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件               
            if (e.wheelDelta > 0) { //当滑轮向上滚动时  
                options.zoom = ++options.zoom > 22 ? 22 : options.zoom;
                map(options);
            }
            if (e.wheelDelta < 0) { //当滑轮向下滚动时  
                options.zoom = --options.zoom < 0 ? 0 : options.zoom;
                map(options);
            }
        } else if (e.detail) {  //Firefox滑轮事件  
            if (e.detail > 0) { //当滑轮向上滚动时  
                options.zoom = ++options.zoom > 22 ? 22 : options.zoom;
                map(options);
            }
            if (e.detail < 0) { //当滑轮向下滚动时  
                options.zoom = --options.zoom < 0 ? 0 : options.zoom;
                map(options);
            }
        }
    })


})
//根据中心点返回正六边形定点坐标
function hex_corner(center, size, i) {
    var angle_deg = 60 * i
    var angle_rad = Math.PI / 180 * angle_deg
    return {
        x:center.x + size * Math.cos(angle_rad),
        y:center.y + size * Math.sin(angle_rad)
    }
}
function drawHexagon(center,size){
    var canvas = document.getElementById("mouse");
    var context = canvas.getContext('2d');
    context.beginPath();
    var start = hex_corner(center,size,0);
    context.moveTo(start.x,start.y);
    for(var i=0;i<6;i++){
        var end = hex_corner(center,size,i+1);
        context.lineTo(end.x,end.y); 
        context.stroke();context.fill();
    }
    context.fillStyle="#00ff00";
    context.fill();  
}
function heatmap(data) {
    //获取canvas的context  
    var canvas = document.getElementById("mouse");
    var context = canvas.getContext('2d');

    for (var i = 0, len = data.length; i < len; i++) {
        var x = data[i][0], y = data[i][1];
        //绘制径向渐变  
        var radgrad = context.createRadialGradient(x, y, 1, x, y, 8);
        //锚点  
        radgrad.addColorStop(0, 'rgba(255,30,0,1)');
        //锚点  
        radgrad.addColorStop(1, 'rgba(255,30,0,0)');
        context.fillStyle = radgrad;
        context.fillRect(x - 8, y - 8, 16, 16);
    }

    //获取这个画布的位数据  
    var imgd = context.getImageData(0, 0, canvas.width, canvas.height);
    var pix = imgd.data;
    // 循环计算rgb，使之根据alpha值映射到红蓝渐变  
    for (var i = 0, n = pix.length; i < n; i += 4) {
        //位数据的格式为[rgbargbargba……]，每个rgba代表了每个点的rgba四个通道的值  
        var a = pix[i + 3]; //alpha  
        //red  
        pix[i] = 128 * Math.sin((1 / 256 * a - 0.5) * Math.PI) + 200;
        //green  
        pix[i + 1] = 128 * Math.sin((1 / 128 * a - 0.5) * Math.PI) + 127;
        //blue,128之后直接衰减为0  
        pix[i + 2] = 256 * Math.sin((1 / 256 * a + 0.5) * Math.PI);
        pix[i + 3] = pix[i + 3] * 0.8;
    }
    context.putImageData(imgd, 0, 0);
}

function heatmap1(data) {
    var points = data;
    //获取canvas的context  
    var canvas = document.getElementById("mouse");
    var context = canvas.getContext('2d');

    var cache = {};
    //计算每个点的密度  
    for (var i = 0, len = points.length; i < len; i++) {
        var key = parseInt(points[i][0] / 1.5) * 1.5 + '*' + parseInt(points[i][1] / 1.5) * 1.5;
        if (cache[key]) {
            cache[key]++;
        } else {
            cache[key] = 1;
        }
    }
    //点数据还原  
    var oData = [];
    for (var m in cache) {
        if (m == '0*0') continue;
        var x = parseInt(m.split('*')[0], 10);
        var y = parseInt(m.split('*')[1], 0);
        oData.push([x, y, cache[m]]);
    }
    //简单排序，使用数组内建的sort  
    oData.sort(function (a, b) {
        return a[2] - b[2];
    });
    var max = oData[oData.length - 1][2];
    var pi2 = Math.PI * 2;
    //设置阈值，可以过滤掉密度极小的点  
    //var threshold = this._points_min_threshold * max;
    //alpha增强参数  
    var pr = (Math.log(245) - 1) / 245;
    for (var i = 0, len = oData.length; i < len; i++) {
        if (oData[i][2] == 0 ? 0 : 1) {
            //q参数用于平衡梯度差，使之符合人的感知曲线log2N，如需要精确梯度，去掉log计算  
            if (oData[i][2] == max) {
                var a = 1;
            }
            var q = parseInt(Math.log(oData[i][2]) / Math.log(max) * 255);
            var r = parseInt(128 * Math.sin((1 / 256 * q - 0.5) * Math.PI) + 200);
            var g = parseInt(128 * Math.sin((1 / 128 * q - 0.5) * Math.PI) + 127);
            var b = parseInt(256 * Math.sin((1 / 256 * q + 0.5) * Math.PI));
            var alp = (0.92 * q + 20) / 255;
            //如果需要灰度增强，则取消此行注释  
            //var alp = (Math.exp(pr * q + 1) + 10) / 255  
            var radgrad = context.createRadialGradient(oData[i][0], oData[i][1], 1, oData[i][0], oData[i][1], 8);
            radgrad.addColorStop(0, 'rgba(' + r + ',' + g + ',' + b + ',' + alp + ')');
            radgrad.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
            context.fillStyle = radgrad;
            context.fillRect(oData[i][0] - 8, oData[i][1] - 8, 16, 16);
        }
    }
}


function drawCirc() {
    var point = CalCoor(100, 200, 600, 750);
    var canvas = document.getElementById("mouse");
    var context = canvas.getContext("2d");

    context.clearRect(0, 0, parseInt($(".main").css("width")), parseInt($(".main").css("height")));//清除画布区域
    context.beginPath();
    context.arc(100, 200, 5, 0, Math.PI * 2);
    context.fillStyle = "#00bb00";
    context.fill();

    var startAngle = Math.atan((point.y - 750) / (point.x - 600));
    var endAngle = Math.atan((point.y - 200) / (point.x - 100));
    context.beginPath();
    context.arc(point.x, point.y, Math.sqrt(Math.pow(550, 2) + Math.pow(500, 2)), startAngle, endAngle, true);
    context.lineWidth = 2;
    context.strokeStyle = "#00bb00";
    context.stroke();

    context.beginPath();
    context.arc(600, 750, 2, 0, Math.PI * 2);
    context.fillStyle = "#00bb00";
    context.fill();
    //context.closePath();

    console.log(context.getImageData(100, 200, 300, 200).data);

    angle0 = Math.atan((point.y - 200) / (point.x - 100));
    rident = Math.sqrt(Math.pow(550, 2) + Math.pow(500, 2));
    //历史canva图像,光圈的涟漪效果
    var backCanvas = document.createElement('canvas'),
        backCtx = backCanvas.getContext('2d');
    backCanvas.width = parseInt($(".main").css("width"));
    backCanvas.height = parseInt($(".main").css("height"));
    backCtx.globalCompositeOperation = 'copy';
    //主canvas图像，光圈的涟漪效果
    canvas = document.getElementById("light");
    context = canvas.getContext("2d");
    context.globalAlpha = 0.95;

    var render = function () {
        backCtx.drawImage(canvas, 0, 0, parseInt($(".main").css("width")), parseInt($(".main").css("height")));
        context.clearRect(0, 0, parseInt($(".main").css("width")), parseInt($(".main").css("height")));
        drawCircle();
        context.drawImage(backCanvas, 0, 0, parseInt($(".main").css("width")), parseInt($(".main").css("height")));
    }
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(function () {
        render();
    }, 40);


    //点的移动效果
    var backPointCanvas = document.createElement('canvas'),
        backPointCtx = backPointCanvas.getContext('2d');
    backPointCanvas.width = parseInt($(".main").css("width"));
    backPointCanvas.height = parseInt($(".main").css("height"));
    backPointCtx.globalCompositeOperation = 'copy';
    //主canvas图像，移动的点
    var PointCanvas = document.getElementById("point");
    var PointContext = PointCanvas.getContext("2d");
    PointContext.globalAlpha = 0.95;
    var render1 = function () {
        backPointCtx.drawImage(PointCanvas, 0, 0, parseInt($(".main").css("width")), parseInt($(".main").css("height")));
        PointContext.clearRect(0, 0, parseInt($(".main").css("width")), parseInt($(".main").css("height")));
        drawPoint();
        PointContext.drawImage(backPointCanvas, 0, 0, parseInt($(".main").css("width")), parseInt($(".main").css("height")));
    }
    setInterval(function () {
        render1();
    }, 10);
}
function drawCircle() {
    var canvas = document.getElementById("light");
    var context = canvas.getContext("2d");
    //context.globalAlpha = 0.95;
    context.beginPath();
    context.arc(100, 200, radius, 0, Math.PI * 2);
    context.closePath();
    context.lineWidth = 1.5; //线条宽度
    context.strokeStyle = 'rgba(14, 255, 118,1)'; //颜色
    context.stroke();

    context.beginPath();
    context.arc(600, 750, radius1, 0, Math.PI * 2);
    context.closePath();
    context.lineWidth = 1.5; //线条宽度
    context.strokeStyle = 'rgba(14, 255, 118,1)'; //颜色
    context.stroke();

    radius += 0.5; //每一帧半径增加0.5
    radius1 += 1;
    //半径radius大于30时，重置为0
    if (radius > 30) {
        radius = 0;
    }
    if (radius1 > 50) {
        radius1 = 0;
    }

}
function drawPoint() {
    var canvas = document.getElementById("point");
    var context = canvas.getContext("2d");
    var dy = rident * Math.sin(angle0 - angle) - rident * Math.sin(angle0);
    var dx = rident * Math.cos(angle0 - angle) - rident * Math.cos(angle0);
    var x = 100 + dx, y = 200 + dy;

    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.closePath();
    context.lineWidth = 1; //线条宽度
    context.strokeStyle = 'rgba(255, 255, 255,1)'; //颜色
    context.stroke();
    context.fillStyle = 'rgba(255, 255, 255,1)';
    context.fill();
    angle -= 0.004;
    if (x > 600) {
        angle = 0;
    }
}
function CalCoor(x1, y1, x2, y2) {
    var k = 1 + Math.pow((x1 - x2) / (y2 - y1), 2);
    var sum = (Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) * 0.75;
    var b = sum / k.toFixed(5);
    var a = (x1 + x2) / 2;
    var x = a + Math.sqrt(b);
    var X = a - Math.sqrt(b);
    var y = ((x1 - x2) / (y2 - y1)) * (x - (x1 + x2) / 2) + (y1 + y2) / 2;
    var Y = ((x1 - x2) / (y2 - y1)) * (X - (x1 + x2) / 2) + (y1 + y2) / 2;
    return {
        x: X,
        y: Y
    }
}
//烟花特效
function smoke() {
    var canvas = document.getElementById("smoke_canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);//清除画布区域
    context.beginPath();
    context.arc(500, 200, 5, 0, Math.PI * 2);
    context.fillStyle = "#fff";
    context.fill();

    //历史canva图像,光圈的涟漪效果
    var backCanvas = document.createElement('canvas'),
        backCtx = backCanvas.getContext('2d');
    backCanvas.width = window.innerWidth;
    backCanvas.height = window.innerHeight;
    backCtx.globalCompositeOperation = 'copy';
    //主canvas图像，光圈的涟漪效果
    context.globalAlpha = 0.95; //最后画的图形的透明度值，之前的一次减小，test函数为测试函数
    context.globalCompositeOperation = "lighter";
    var render = function () {
        backCtx.drawImage(canvas, 0, 0, window.innerWidth, window.innerHeight);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        renderSmoke();
        context.drawImage(backCanvas, 0, 0, window.innerWidth, window.innerHeight);
    }

    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(function () {
        if (startRidus > 200) {
            startRidus = 10;
        }
        startRidus += 1;
        render();
    }, 10);
}
function renderSmoke() {
    var canvas = document.getElementById("smoke_canvas");
    var context = canvas.getContext("2d");
    var cx, cy;
    var color = d3.schemeCategory10;
    for (var startAngle = 0; startAngle <= Math.PI * 2; startAngle += 0.1) {
        cx = 500 + startRidus * Math.cos(startAngle);
        cy = 200 - startRidus * Math.sin(startAngle);
        context.beginPath();
        context.arc(cx, cy, 1, 0, Math.PI * 2);
        context.fillStyle = color[parseInt(Math.random() * 10)];
        context.fill();
    }
}
function test() {
    var canvas = document.getElementById("smoke_canvas");
    var context = canvas.getContext("2d");
    context.globalAlpha = 0.9;

    var backCanvas = document.createElement('canvas'),
        backCtx = backCanvas.getContext('2d');
    backCanvas.width = window.innerWidth;
    backCanvas.height = window.innerHeight;
    backCtx.globalCompositeOperation = 'copy';
    var color = d3.schemeCategory10;

    for (var i = 0; i < 10; i++) {
        context.beginPath();
        context.arc(500 + i * 50, 500, 1 + i * 5, 0, Math.PI * 2);
        context.fillStyle = color[i];
        context.fill();

        backCtx.drawImage(canvas, 0, 0, window.innerWidth, window.innerHeight);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.drawImage(backCanvas, 0, 0, window.innerWidth, window.innerHeight);
    }
    for (var i = 0; i < 10; i++) {
        context.beginPath();
        context.arc(500 + i * 50, 400, 1 + i * 5, 0, Math.PI * 2);
        context.fillStyle = color[i];
        context.fill();

        backCtx.drawImage(canvas, 0, 0, window.innerWidth, window.innerHeight);
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        context.drawImage(backCanvas, 0, 0, window.innerWidth, window.innerHeight);
    }
}
function map() {
    var canvas = document.getElementById("map-main");
    var context = canvas.getContext("2d");

    var winWidth = canvas.width;
    var winHeight = canvas.height;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);//清除画布区域


    loadTitle1(options);
}
function maxNum(n) {
    if (n % 256 == 0 && (n / 256) % 2 == 1) {
        return n / 256;
    } else if (parseInt((n / 256)) % 2 == 0) {
        return parseInt(n / 256) + 1;
    } else if (parseInt(n / 256) % 2 == 1) {
        return parseInt(n / 256) + 2;
    }
}
function loadTitle1(options) {
    $(".main img").remove();
    var canvas = document.getElementById(options.containerId);
    var context = canvas.getContext("2d");
    var mapWidth = canvas.width;//地图容器的宽度
    var mapHeight = canvas.height;//地图容器的高度
    var center = {    //地图中心切片的屏幕坐标位置
        left: mapWidth / 2 - 128,
        top: mapHeight / 2 - 128
    }
    //web墨卡托投影分辨率共分22个等级,左上角坐标（-20037508.3427892，20037508.3427892），右下角（20037508.3427892，-20037508.3427892）；
    if (resolution.length == 0) {
        for (var i = 0; i < 23; i++) {
            resolution.push(20037508.3427892 * 2 / (256 * Math.pow(2, i)));//左右幅廓 20037508.3427892 * 2 ，i 等级的栅格总数为 4^i，故边长为 2^i 个栅格 , 即列或者行的个数
        }
    }
    var col0 = Math.floor((options.center[0] - (-20037508.3427892)) / (256 * resolution[options.zoom]));   //256 * resolution[0]代表一个栅格的长度,地图中心切片的列号
    var row0 = Math.floor((20037508.3427892 - options.center[1]) / (256 * resolution[options.zoom]));  //地图中心切片的行号
    //console.log(`行号：${row0},列号:${col0}`);
    var col = maxNum(mapWidth);//地图容器里面总列数
    var row = maxNum(mapHeight);//地图容器总行数
    var i = 0;
    while (i < row) {//外层遍历行
        var j = 0;
        while (j < col) {//内层遍历列
            var img = new Image();   //记住：X代表列值，y代表行值
            var currentCol = col0 - (parseInt(col / 2) - j);
            currentCol = currentCol > Math.pow(2, options.zoom) - 1 ? currentCol - Math.pow(2, options.zoom) : currentCol;  //当能容纳的列数大于地图切片的总列数时，超过有效x（列值）要接上小于最小列号的切片

            var currentRow = row0 - (parseInt(row / 2) - i);

            if (currentCol < 0 || currentRow < 0 || currentCol >= Math.pow(2, options.zoom) || currentRow >= Math.pow(2, options.zoom)) {
                j++;
                continue;
            }
            //var src = "http://mt2.google.cn/vt/x=" + currentCol + "&y=" + currentRow + "&z=" + options.zoom;
            var src = `/static/title/L${options.zoom}/R${currentRow}/C${currentCol}.png`;
            var left = center.left - (parseInt(col / 2) - j) * 256;
            var top = center.top - (parseInt(row / 2) - i) * 256;
            $(".main").append(`<img src=${src} style="position:absolute;width:256px;height:256px;left:${left}px;top:` + (top + 50).toString() + `px"></img>`);
            preImage(src, left, top, function (left, top) {
                //context.drawImage(this, left, top, 256, 256);
            })
            j++;
        }
        i++;
    }
}
function preImage(url, left, top, callback) {
    var img = new Image();
    img.src = url;
    img.setAttribute('crossOrigin', 'anonymous');
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数    
        callback.call(img, left, top);
        return; // 直接返回，不用再处理onload事件    
    }
    img.onload = function () { //图片下载完毕时异步调用callback函数。    
        callback.call(img, left, top);    //将回调函数的this替换为Image对象    
    };
}
function screenXYtoGeoXY(screenX, screenY) {
    var canvas = document.getElementById(options.containerId);
    var mapWidth = canvas.width;//地图容器的宽度
    var mapHeight = canvas.height;//地图容器的高度
    var center = {    //地图中心切片的屏幕坐标位置
        clientX: mapWidth / 2,
        clientY: mapHeight / 2
    }
    var geoX = options.center[0] + (screenX - center.clientX) * resolution[options.zoom];
    var geoY = options.center[1] - (screenY - center.clientY) * resolution[options.zoom];
    return {
        x: geoX,
        y: geoY
    }
}
function movedScreenXY(dx, dy) {
    var canvas = document.getElementById(options.containerId);
    var mapWidth = canvas.width;//地图容器的宽度
    var mapHeight = canvas.height;//地图容器的高度
    var center = {    //地图中心切片的屏幕坐标位置
        clientX: mapWidth / 2,
        clientY: mapHeight / 2
    }
    return {
        screenX: center.clientX - dx,
        screenY: center.clientY - dy
    }
}
function geoXYtoScreenXY(geox, geoy) {
    var canvas = document.getElementById(options.containerId);
    var mapWidth = canvas.width;//地图容器的宽度
    var mapHeight = canvas.height;//地图容器的高度
    var center = {    //地图中心切片的屏幕坐标位置
        clientX: mapWidth / 2,
        clientY: mapHeight / 2
    }
    var screenY = center.clientY - (geoy - options.center[1]) / resolution[options.zoom];
    var screenX = center.clientX + (geox - options.center[0]) / resolution[options.zoom];
    return {
        screenX: screenX,
        screenY: screenY
    }
}
function downLoad(url, i, j, zoom, callback) {
    var img = new Image();
    img.src = url;
    img.setAttribute('crossOrigin', 'anonymous');
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数    
        //console.log(`i:${i},j${j}`);
        callback.call(img, i, j, zoom);

        return; // 直接返回，不用再处理onload事件    
    }
    img.onload = function () { //图片下载完毕时异步调用callback函数。    
        callback.call(img, i, j, zoom);    //将回调函数的this替换为Image对象    
        //console.log(`i:${i},j${j}`);
    };
}
function loadTitle() {
    //比例尺
    if (resolution.length == 0) {
        for (var i = 0; i < 23; i++) {
            resolution.push(20037508.3427892 * 2 / (256 * Math.pow(2, i)));//左右幅廓 20037508.3427892 * 2 ，i 等级的栅格总数为 4^i，故边长为 2^i 个栅格 , 即列或者行的个数
        }
    }
    var extent = [7707346.32, 7104699.37, 15211626.97, 2154027.03];

    /*for(var i=0;i<5;i++){
        var zoom = i;
        var Colmin = Math.floor((extent[0] - (-20037508.3427892)) / (256 * resolution[zoom]));   //256 * resolution[0]代表一个栅格的长度,地图中心切片的列号
        var Rowmin = Math.floor((20037508.3427892 - extent[1]) / (256 * resolution[zoom]));  //地图中心切片的行号
        var Colmax =  Math.floor((extent[2] - (-20037508.3427892)) / (256 * resolution[zoom]));
        var Rowmax = Math.floor((20037508.3427892 - extent[3]) / (256 * resolution[zoom]));
        console.log(`最小列号：${Colmin},最小行号：${Rowmin},最大列号：${Colmax},最大行号:${Rowmax}`);
    }*/
    var zoom = 12, i, j;
    while (zoom < 13) {
        var Colmin = Math.floor((extent[0] - (-20037508.3427892)) / (256 * resolution[zoom]));   //256 * resolution[0]代表一个栅格的长度,地图中心切片的列号
        var Rowmin = Math.floor((20037508.3427892 - extent[1]) / (256 * resolution[zoom]));  //地图中心切片的行号
        var Colmax = Math.floor((extent[2] - (-20037508.3427892)) / (256 * resolution[zoom]));
        var Rowmax = Math.floor((20037508.3427892 - extent[3]) / (256 * resolution[zoom]));
        i = Rowmin;
        console.log(`最小列号：${Colmin},最小行号：${Rowmin},最大列号：${Colmax},最大行号:${Rowmax}`);
        request(Rowmin, Rowmax, Colmin, Colmax, zoom);
        zoom++;
    }
}
function request(Rowmin, Rowmax, Colmin, Colmax, zoom) {
    console.log(`${Rowmin},${Rowmax},${Colmin},${Colmax}`);
    var count = 0;
    var row = (Rowmin + 5) > Rowmax ? Rowmax : (Rowmin + 5);
    for (var i = Rowmin; i <= row; i++) {
        for (var j = Colmin; j <= Colmax; j++) {
            downLoad(`http://mt2.google.cn/vt/x=${j}&y=${i}&z=${zoom}`, i, j, zoom, function (i, j, zoom) {
                var backCanvas = document.createElement('canvas'),
                    backCtx = backCanvas.getContext('2d');
                backCanvas.width = 256;
                backCanvas.height = 256;
                backCtx.drawImage(this, 0, 0, 256, 256);
                try {
                    var base64 = backCanvas.toDataURL('image/png');
                } catch (e) {
                    //console.log(`x:${j},y:${i}`);
                }

                $.ajax({
                    url: '/base64ToImg',
                    type: "POST",
                    data: {
                        base: base64,
                        x: j,
                        y: i,
                        zoom: zoom
                    },
                    timeout: 100000000,
                    success: function (data) {

                        count++;

                    },
                    error: function (e) {
                        console.log('error');
                    }
                })
            })
        }
    }
    var timer = setInterval(function () {
        if (count == ((row - Rowmin + 1) * (Colmax - Colmin + 1))) {
            console.log('下一次');
            if (row < Rowmax) {
                request(row, Rowmax, Colmin, Colmax, zoom);

            }
            clearInterval(timer);
        }

    }, 1000)
}
