$(function(){
    var canvas = document.getElementById("rain");
    canvas.width = parseInt($(".wel-body").css("width"));
    canvas.height = parseInt($(".wel-body").css("height"));
    var ctx = canvas.getContext("2d");
    ctx.arc(200,200,50,0,Math.PI * 2);
    ctx.fillStyle = "#ffdd00";
    ctx.fill();
})