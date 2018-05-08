var timer;
var radius = 0.5,radius1=0.5,angle=0;
var angle0,rident;
$(function(){
    var canvas = document.getElementById("snow");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var context = canvas.getContext("2d");
    var practicles = [];
    for (var i = 0; i < 5000; i++) {//循环生成500粒
        practicles.push({
            x: Math.random() * (window.innerWidth),
            y: Math.random() * (window.innerHeight),
            vx: Math.random() - 0.5,
            vy: Math.random() + 0.5,
            size: Math.random() * 3 + 1,
            color: "#FFF"
        })
    }
    /*var canvas1 = document.getElementById("mouse");
    canvas1.width = window.innerWidth;
    canvas1.height = window.innerHeight;

    var canvas2 = document.getElementById("light");
    canvas2.width = window.innerWidth;
    canvas2.height = window.innerHeight;

    var pointCanvas = document.getElementById("point");
    pointCanvas.width = window.innerWidth;
    pointCanvas.height = window.innerHeight;*/
    function timeUpdate() {
        
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);//清除画布区域
        var practicle;
        for (var i = 0; i < 500; i++) {
            var practicle = practicles[i];
            practicle.x += practicles[i].vx;
            practicle.y += practicles[i].vy;
            if (practicle.x < 0) { practicle.x = window.innerWidth }
            if (practicle.x > window.innerWidth) { practicle.x = 0 }
            if (practicle.y > window.innerHeight) { practicle.y = 0 }
            context.beginPath();
            context.arc(practicle.x, practicle.y, practicle.size, 0, Math.PI * 2)
            context.closePath();
            context.fillStyle = practicle.color;
            context.fill();
        }
    }
    setInterval(timeUpdate, 10);
    $(window).resize(function(){
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);//清除画布区域
        practicles = [];
        for (var i = 0; i < 5000; i++) {//循环生成500粒
            practicles.push({
                x: Math.random() * (window.innerWidth),
                y: Math.random() * (window.innerHeight),
                vx: Math.random() - 0.5,
                vy: Math.random() + 0.5,
                size: Math.random() * 3 + 1,
                color: "#FFF"
            })
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
    /*$('body').on('mousedown',function(e){
        updateSnow(e);
        $(document).on('mousemove',function(env){
            updateSnow(env);
        })
        $(document).on('mouseup',function(){
            $(document).off('mousemove');
            $(document).off('mouseup');
        })
    })
   
    $("#btn").on('click',function(e){
        drawCirc();
        e.stopPropagation();
    })*/

})
function updateSnow(e){
    var canvas = document.getElementById("mouse");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.arc(e.clientX, e.clientY, 2, 0, Math.PI * 2)
    context.closePath();
    context.fillStyle = 'red';
    context.fill();
}
function drawCirc(){
    var point = CalCoor(100,200,600,750);
    var canvas = document.getElementById("mouse");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);//清除画布区域
    context.beginPath();
    context.arc(100,200, 2, 0, Math.PI *2);
    context.fillStyle="#00bb00";
    context.fill();

    var startAngle = Math.atan((point.y-750)/(point.x-600));
    var endAngle = Math.atan((point.y-200)/(point.x-100));
    context.beginPath();
    context.arc(point.x, point.y, Math.sqrt(Math.pow(550,2)+Math.pow(500,2)), startAngle, endAngle,true);
    context.lineWidth=2;
    context.strokeStyle="#00bb00";
    context.stroke();

    context.beginPath();
    context.arc(600,750, 2, 0, Math.PI *2);
    context.fillStyle="#00bb00";
    context.fill();
    //context.closePath();

    angle0 = Math.atan((point.y-200)/(point.x-100));
    rident = Math.sqrt(Math.pow(550,2)+Math.pow(500,2));
    //历史canva图像,光圈的涟漪效果
    var backCanvas = document.createElement('canvas'),
        backCtx = backCanvas.getContext('2d');
    backCanvas.width = window.innerWidth;
    backCanvas.height = window.innerHeight;
    backCtx.globalCompositeOperation = 'copy';
    //主canvas图像，光圈的涟漪效果
    canvas = document.getElementById("light");
    context = canvas.getContext("2d");
    context.globalAlpha = 0.95;

    var render = function(){
        backCtx.drawImage(canvas,0,0,window.innerWidth,window.innerHeight);
        context.clearRect(0,0,window.innerWidth,window.innerHeight);
        drawCircle();
        context.drawImage(backCanvas,0,0,window.innerWidth,window.innerHeight);
    }
    if(timer){
        clearInterval(timer);
    }
    timer =setInterval(function(){
        render();
    }, 40);


    //点的移动效果
    var backPointCanvas = document.createElement('canvas'),
        backPointCtx = backPointCanvas.getContext('2d');
    backPointCanvas.width = window.innerWidth;
    backPointCanvas.height = window.innerHeight;
    backPointCtx .globalCompositeOperation = 'copy';
    //主canvas图像，移动的点
    var PointCanvas = document.getElementById("point");
    var PointContext = PointCanvas.getContext("2d");
    PointContext.globalAlpha = 0.95;
    var render1 = function(){
        backPointCtx.drawImage(PointCanvas,0,0,window.innerWidth,window.innerHeight);
        PointContext.clearRect(0,0,window.innerWidth,window.innerHeight);
        drawPoint();
        PointContext.drawImage(backPointCanvas,0,0,window.innerWidth,window.innerHeight);
    }
    setInterval(function(){
        render1();
    }, 10);
}
function drawCircle(){
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
    radius1 +=1;
    //半径radius大于30时，重置为0
    if (radius > 30) {
        radius = 0;
    }
    if(radius1 > 50){
        radius1 = 0;
    }
    
}
function drawPoint(){
    var canvas = document.getElementById("point");
    var context = canvas.getContext("2d");
    var dy = rident * Math.sin(angle0-angle) - rident * Math.sin(angle0);
    var dx = rident * Math.cos(angle0-angle) - rident * Math.cos(angle0);
    var x = 100 + dx,y = 200+dy;
    
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.closePath();
    context.lineWidth = 1; //线条宽度
    context.strokeStyle = 'rgba(255, 255, 255,1)'; //颜色
    context.stroke();
    context.fillStyle = 'rgba(255, 255, 255,1)';
    context.fill();
    angle -= 0.004;
    if(x > 600){
        angle = 0;
    }
}
function CalCoor(x1,y1,x2,y2){
    var k = 1+Math.pow((x1-x2)/(y2-y1),2);
    var sum = (Math.pow(y2-y1,2)+Math.pow(x2-x1,2))*0.75;
    var b =sum / k.toFixed(5);
    var a = (x1+x2)/2;
    var x = a + Math.sqrt(b);
    var X = a - Math.sqrt(b);
    var y = ((x1-x2)/(y2-y1))*(x-(x1+x2)/2) + (y1+y2)/2;
    var Y = ((x1-x2)/(y2-y1))*(X-(x1+x2)/2) + (y1+y2)/2;
    return {
        x:X,
        y:Y
    }
}