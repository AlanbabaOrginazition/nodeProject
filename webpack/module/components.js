import React, { Component, addons } from 'react';
import ReactDOM from 'react-dom';
import config, { cityGeo } from './../../static/js/postSystem/config';
class MapToolbar extends Component {
    constructor(props) {
        super(props);
        this.map = null;
        this.state = {
            title: ''
        };
    }
    render() {
        return (
            <div className="map-toobar" >
                <div title="放大" className={this.state.title == '放大' ? 'active' : ''}>
                    <span className="icon-zoom-in icon-2x"></span>
                </div>
                <div title="缩小" className={this.state.title == '缩小' ? 'active' : ''}>
                    <span className="icon-zoom-out icon-2x"></span>
                </div>
                <div title="定位" className={this.state.title == '定位' ? 'active' : ''}>
                    <span className="icon-screenshot icon-2x"></span>
                </div>
                <div title="迁移图" onClick={this.transferMap.bind(this)} className={this.state.title == '迁移图' ? 'active' : ''}>
                    <span className="icon-h-sign icon-2x"></span>
                </div>
                <div title="加快" onClick={this.fast.bind(this)} className={this.state.title == '加快' ? 'active' : ''}>
                    <span className="icon-fast-forward icon-2x"></span>
                </div>
            </div>
        )
    }
    /**
     * 迁移图关闭按钮(父级控制子级dom)
     * @property closeMap
     * @type {Function}
     */
    closeMap(e) {
        $("#transferMap").addClass("extends-transfer-map-hidden");
        e.stopPropagation();
        //清除计时器
        clearInterval(this.canvas.timer0);
        clearInterval(this.canvas.timer1);
        this.canvas = null;
        this.map.remove();
        this.setState({
            title: ""
        })
        this.exitFullscreen();
    }
    /**
     * 迁移图点击函数
     * @property transferMap
     * @type {Function}
     */
    transferMap() {
        ReactDOM.render(<TransferCanvas closeMap={this.closeMap.bind(this)} />, document.getElementById("map-main"));
        //$("#transferMap").removeClass("extends-transfer-map-hidden");
        this.setState({
            title: "迁移图"
        })
        var resolutions = config.basemap.resolutions;
        var crs = new L.Proj.CRS(config.crs.code, config.crs.defs, {
            origin: config.basemap.origin,
            resolutions: resolutions
        });
        this.map = L.map("main", {
            crs: crs,
            center: config.basemap.center,
            zoom: config.basemap.zoom,
            minZoom:config.basemap.minZoom,
            maxZoom:config.basemap.maxZoom,
            zoomControl: true,
            attributionControl: false,
            inertia: false,
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: 'topleft' //全屏控件
            }
        });
        var basemap = new L.esri.TiledMapLayer({
            url: config.basemap.url
        })

        this.canvas = new Canvas({ map: this.map });
        this.canvas.startDraw();
        this.map.on('move', this.canvas.startDraw);
        this.map.on('click', this.canvas.highLight);//点击省份高亮相应区域
        basemap.addTo(this.map);
    }
    fast() {
        this.setState({
            title: "加快"
        })
        this.canvas.speed -= 0.4;
        if (this.canvas.speed < 0.2) {
            this.canvas.speed = 2;
        }
    }
    /**
     * 配合全屏控件使用，进入全屏点击关闭按钮时，如果是全屏状态则退出
     * @property exitFullscreen
     * @type {Function}
     */
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozExitFullScreen) {
            document.mozExitFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
/**
 * 迁移图dom组件
 * @property TransferCanvas
 * @type {Class}
 */
class TransferCanvas extends Component {
    render() {
        return (
            <div>
                <span id="transfer-map-close" className="icon-remove-circle icon-3x extends-transfer-map-close" title="关闭窗口" onClick={this.props.closeMap}></span>
                <canvas id="canvas-symbol" className="extends-transfer-map-canvas"></canvas>
                <canvas id="canvas-rippling" className="extends-transfer-map-canvas"></canvas>
                <canvas id="canvas-move-point" className="extends-transfer-map-canvas"></canvas>
                <canvas id="canvas-arc" className="extends-transfer-map-canvas"></canvas>
            </div>
        )
    }
}
/**
 * 绘制迁移图地图特效类
 * @property Canvas
 * @type {Class}
 */
class Canvas {
    constructor(options) {
        this.map = options ? options.map : null;
        this.timer0 = options.time0 ? options.time0 : null, this.timer1 = options.time1 ? options.time1 : null, this.speed = 2; //speed为点在弧线上移动的速度，详见代码
        this.startDraw = this.startDraw.bind(this);
        this.highLight = this.highLight.bind(this);
        this.cityGeo = cityGeo;
        this.symbolText = '';
        this.geoList = [],this.geoText = [];//geoList为当前点击区域的地理坐标，geoText为当前区域的中心点
        this.color = "#000000";
    }
    initCanvas() {
        var canvasId = ['canvas-arc', 'canvas-rippling', 'canvas-move-point', 'canvas-symbol'];
        for (var id of canvasId) {
            var canvas = document.getElementById(id); //transferMapContainer // 
            canvas.width = parseInt($("#transferMap").css("width"));
            canvas.height = parseInt($("#transferMap").css("height"));
        }
    }
    //根据点击位置查询省份
    highLight(e) {
        var latLng = e.latlng;
        L.esri.identifyFeatures({
            url: config.basemap.url
        })
        .on(this.map)
        .at(latLng)
        .layers('visible:0')
        .run((error, featureCollection, response) => {
            if (response.results[0] && response.results[0].attributes["NL_NAME_1"] != this.symbolText) {
                    this.geoList = response.results[0].geometry.rings;
                    this.geoText = [response.results[0].attributes["CENTER_Y"],response.results[0].attributes["CENTER_X"]];
                    var text = response.results[0].attributes["NL_NAME_1"].split('|');
                    this.symbolText = text.length > 1 ? text[1] : text[0];
            } 
            else 
                this.geoList = [];
            var color = d3.schemeCategory20[Math.floor(Math.random() * 20)];
            this.color = this.hexToRgb(color, 0.9);
            this.drawSymbol();
        })
    }
    //16进制颜色转rgb，为canvas绘图的透明度准备
    hexToRgb(str, alpha) {
        if (str.length != 4 && str.length != 7) {
            alert("16颜色代码无效");
        } else {
            var s = str.slice(1);
            if (s.length == 3) {
                var r = parseInt(s.substr(0, 1) + s.substr(0, 1), 16);
                var g = parseInt(s.substr(1, 1) + s.substr(1, 1), 16);
                var b = parseInt(s.substr(2, 1) + s.substr(2, 1), 16);
                return `rgb(${r},${g},${b},${alpha})`;
            } else if (s.length == 6) {
                var r = parseInt(s.substr(0, 2), 16);
                var g = parseInt(s.substr(2, 2), 16);
                var b = parseInt(s.substr(4, 2), 16);
                return `rgba(${r},${g},${b},${alpha})`;
            }
        }
    }
    drawSymbol() {
        
        var canvas = document.getElementById("canvas-symbol");
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (this.geoList.length == 0) return;
        ctx.beginPath()
        var pxList = [];
        pxList = this.geoList.map((geo) => {
            var list = geo.map(point => {
                return this.map.latLngToContainerPoint([point[1], point[0]]);
            })
            return list;
        })
        var textCenter = this.map.latLngToContainerPoint(this.geoText);
        for (var i = 0; i < pxList.length; i++) {
            for (var j = 0; j < pxList[i].length; j++) {
                if (j == 0)
                    ctx.moveTo(pxList[i][j].x, pxList[i][j].y);
                else {
                    ctx.lineTo(pxList[i][j].x, pxList[i][j].y);
                }
            }
        }
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "rgb(245, 213, 41)";
        ctx.font = "bold 18px Courier New";
        ctx.fill();
        ctx.fillStyle = "#000000";
        ctx.fillText(this.symbolText, textCenter.x, textCenter.y);
        ctx.stroke();

    }
    //开始绘制canvas主函数
    startDraw() {
        this.initCanvas();
        this.drawSymbol();
        var data = {
            startCity: '西安',
            endCity: ['成都', '北京', '苏州', '重庆', '南京', '青岛', '连云港', '乌鲁木齐', '呼和浩特', '南昌', '福州', '东莞', '韶关', '阳泉', '长春', '云南', '拉萨', '昆明', '贵阳', '南宁', '西宁'],//'北京','苏州', '重庆', '南京', '青岛', '连云港', '南昌', '福州', '东莞', '韶关', '阳泉', '长春', '云南', '拉萨', '昆明', '贵阳', '南宁', '西宁'
            radius: [80, 60, 50, 40, 65, 30, 20, 15, 24, 18, 22, 26, 38, 40, 57, 12, 36, 32]
        }
        var RipplingData = [];//涟漪效果数据，需要xy屏幕坐标、点半径值radius; 点的移动效果还需弧线所在园的半径
        var canvas = document.getElementById('canvas-arc');
        var ctx = canvas.getContext('2d');

        var color = d3.schemeCategory20;
        var p1, p2, startData;
        if (this.cityGeo[data.startCity]) {
            p1 = this.map.latLngToContainerPoint(L.latLng([this.cityGeo[data.startCity][1], this.cityGeo[data.startCity][0]]));
            startData = {
                x: p1.x,
                y: p1.y,
                color: color[19],
                text: data.startCity
            }
        } else
            return;
        data.endCity.map((text, i) => {
            if (this.cityGeo[text]) {
                p2 = this.map.latLngToContainerPoint(L.latLng([this.cityGeo[text][1], this.cityGeo[text][0]]));
                var radius = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
                var center = this.calRadius(p1.x, p1.y, p2.x, p2.y);
                var coord = this.coordAngle(center, p1, p2);
                var value = data.radius[i] ? data.radius[i] : 15
                RipplingData.push(
                    {
                        position: p2,
                        value: value,
                        currentRadius: 0,
                        color: color[i % 20],
                        radius: radius,
                        angle0: coord.startAngle,
                        endAngle: coord.endAngle,
                        currentAngle: coord.startAngle,
                        startPoint: p1,
                        text: text,
                        center: center
                    });
                //position:终点坐标,value:终点的value值，对应最大半径,currentRadius:当前涟漪的半径,color:涟漪的颜色,
                //radius:弧线所在圆的半径,angle0:起点与终点所属弧的起始角度,currentAngle:点移动特效的当前角度,
                //startPoint:起点坐标,coord
            }
        })
        this.drawCircle(startData, RipplingData);//绘制起始点和中止点以及弧线、箭头
        this.drawRippling(RipplingData);//绘制涟漪
        this.drawMove(startData, RipplingData);//绘制移动的点
    }
    //绘制静态的点和弧线函数
    drawCircle(startData, RipplingData) {

        var canvas = document.getElementById('canvas-arc');
        var ctx = canvas.getContext('2d');

        var dAngle = 0, p1 = startData;
        var render = () => {

            ctx.clearRect(0, 0, canvas.width, canvas.height);//清除画布区域
            //将起点绘制出来
            ctx.beginPath();
            //绘制标题文字
            ctx.fillStyle = "#fff";
            ctx.font = "bold 28px Courier New";
            ctx.fillText("迁 移 图",canvas.width/2,50);
            ctx.font = "100 14px Arial";
            ctx.fillText("(数 据 纯 属 虚 构)",canvas.width/2,80);

            ctx.arc(startData.x, startData.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = "#00bb00";
            ctx.fill();
            ctx.font = "bold 14px Courier New";
            //设置字体填充颜色
            ctx.fillStyle = startData.color;
            //从坐标点(50,50)开始绘制文字
            ctx.fillText(startData.text, startData.x - 20, startData.y - 20);

            for (var point of RipplingData) {
                var p2 = point.position,
                    color = point.color,
                    startAngle = point.angle0,
                    endAngle = point.endAngle,
                    text = point.text,
                    value = point.value,
                    radius = point.radius,
                    center = point.center;
                var currentAngle = startAngle + dAngle;
                ctx.beginPath();
                ctx.arc(center.x, center.y, Math.sqrt(Math.pow(p1.y - p2.y, 2) + Math.pow(p1.x - p2.x, 2)), startAngle, currentAngle, false);//endAngle
                ctx.lineWidth = 1;
                ctx.strokeStyle = color;
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(p2.x, p2.y, 1, 0, Math.PI * 2);
                ctx.strokeStyle = color;
                ctx.stroke();
                ctx.fillStyle = color;
                ctx.fill();

                //弧线绘制完毕再绘制箭头
                var dy = radius * (Math.sin(Math.PI * 2 - startAngle - dAngle * 0.9) - Math.sin(Math.PI * 2 - startAngle));// Math.PI / 3.5
                var dx = radius * (Math.cos(Math.PI * 2 - startAngle - dAngle * 0.9) - Math.cos(Math.PI * 2 - startAngle));// Math.PI / 3.5
                var prePoint = { x: p1.x + dx, y: p1.y - dy };

                var dy1 = radius * (Math.sin(Math.PI * 2 - startAngle - dAngle) - Math.sin(Math.PI * 2 - startAngle));
                var dx1 = radius * (Math.cos(Math.PI * 2 - startAngle - dAngle) - Math.cos(Math.PI * 2 - startAngle));
                var nowPoint = { x: p1.x + dx1, y: p1.y - dy1 };
                //this.drawArrow(ctx, prePoint.x, prePoint.y, p2.x, p2.y, 30, 10, color)
                this.drawArrow(ctx, prePoint.x, prePoint.y, nowPoint.x, nowPoint.y, 30, 10, color)
                ctx.font = "bold 14px Courier New";
                //设置字体填充颜色
                ctx.fillStyle = color;
                ctx.fillText(text, p2.x - 20, p2.y - 20);
                ctx.fillText(value, p2.x - 20, p2.y + 20);
            }
            dAngle += Math.PI / 60;
            if (dAngle > Math.PI / 2.995) { //此处控制最后一个点能最接近弧线的终点
                return;
            }
            requestAnimationFrame(render);
        }
        render();
    }
    //计算与两点构成的园的圆心坐标,(x1,y1)为起点的坐标值,平移到原点即可根据另一个点平移后的值得到弦的象限
    calRadius(x1, y1, x2, y2) {
        var k = 1 + Math.pow((x1 - x2) / (y2 - y1), 2);
        var sum = (Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)) * 0.75;
        var b = sum / k.toFixed(5);
        var a = (x1 + x2) / 2;
        var x = a + Math.sqrt(b);
        var X = a - Math.sqrt(b);
        var y = ((x1 - x2) / (y2 - y1)) * (x - (x1 + x2) / 2) + (y1 + y2) / 2;
        var Y = ((x1 - x2) / (y2 - y1)) * (X - (x1 + x2) / 2) + (y1 + y2) / 2;
        //根据弦的位置来判断圆心的位置，当弦在二三象限，圆心在弦的上方；当弦在一四象限，圆心在弦的下方
        //先计算出直线方程,y - y1 = k * (x - x1),这里使用以（x1,y1）为原点的坐标系，需对坐标进行转化，直线方程就直接变为y=kx
        var lk = (y1 - y2) / (x2 - x1);
        var chordX = x2 - x1;//平移后的另一个点横坐标的值
        if (chordX < 0) {
            //弦在二三象限,(y-y1)>0 即圆心在弦的上方
            return (lk * x - (y1 - y)) < 0 ? { x: x, y: y } : { x: X, y: Y };
        } else {
            //弦在一四象限，lk * x(x处直线上y的值) - (y1-y)(实际点的y值) > 0  即圆心在弦的下方  注意：屏幕坐标系和平面坐标系，Y轴相反
            return (lk * x - (y1 - y)) > 0 ? { x: x, y: y } : { x: X, y: Y };
        }
    }
    //构建坐标系，判断以圆心为为原点的坐标系中，起点和终点的角度值,p1为起点，弧线都是顺时针
    coordAngle(center, p1, p2) {
        var startPoint = {
            x: p1.x - center.x,
            y: center.y - p1.y
        },
            endPoint = {
                x: p2.x - center.x,
                y: center.y - p2.y
            };
        var startAngle = this.calAngle(startPoint);
        var endAngle = this.calAngle(endPoint);
        return {
            startAngle: startAngle,
            endAngle: endAngle
        }
    }
    //计算一个点在以圆心为原点的坐标系中的弧度制，注意：canvas的arc绘图函数以3点钟为0°，顺时针增加
    calAngle(p) {
        //返回的角度都以逆时针计算
        switch (p.x > 0) {
            case true:
                if (p.y > 0)
                    return Math.PI * 2 - Math.atan(p.y / p.x);//第一象限
                else if (p.y < 0) {
                    return Math.abs(Math.atan(p.y / p.x));//第四象限
                } else {
                    return 0; //X轴上
                }
                break;
            case false:   //此时x坐标可能为负，可能为0
                if (p.x == 0 && p.y > 0) {  //点在Y轴正半轴
                    return Math.PI * 3 / 2;
                } else if (p.x == 0 && p.y < 0) { //点在Y轴负半轴
                    return Math.PI / 2;
                } else if (p.y > 0) { //点在第二象限
                    return Math.PI + Math.abs(Math.atan(p.y / p.x));
                } else if (p.y < 0) { //点在第三象限
                    return Math.PI - Math.abs(Math.atan(p.y / p.x));//第四象限
                }
                break;
            default:
                break;
        }
    }
    //绘制点的涟漪效果
    drawRippling(RipplingData) {
        var canvas = document.getElementById("canvas-rippling");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);//清除画布区域


        //历史canva图像,光圈的涟漪效果
        var backCanvas = document.createElement('canvas'),
            backCtx = backCanvas.getContext('2d');
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;
        backCtx.globalCompositeOperation = 'copy';
        //主canvas图像，光圈的涟漪效果
        context.globalAlpha = 0.96; //最后画的图形的透明度值，之前的一次减小，test函数为测试函数
        context.globalCompositeOperation = "lighter";

        var render = function () {
            backCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
            //var imgData=context.getImageData(0,0,canvas.width, canvas.height);
            //backCtx.putImageData(imgData,0,0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.renderRippling(RipplingData);
            context.drawImage(backCanvas, 0, 0, canvas.width, canvas.height);
        }
        if (this.timer0) {
            clearInterval(this.timer0);
        }
        this.timer0 = setInterval(render.bind(this), 60);
    }
    //循环点周围的涟漪
    renderRippling(RipplingData) {
        var canvas = document.getElementById("canvas-rippling");
        var context = canvas.getContext("2d"); //currentRadius
        for (var point of RipplingData) {
            context.beginPath();
            context.arc(point.position.x, point.position.y, point.currentRadius, 0, Math.PI * 2);
            context.closePath();
            context.lineWidth = 1; //线条宽度
            context.strokeStyle = point.color; //颜色
            context.stroke();
            point.currentRadius += 1;
            if (point.currentRadius >= point.value) {
                point.currentRadius = 0;
            }
        }
    }
    drawMove(startData, RipplingData) {
        var canvas = document.getElementById("canvas-move-point");
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);//清除画布区域
        //历史canva图像,光圈的涟漪效果
        var backCanvas = document.createElement('canvas'),
            backCtx = backCanvas.getContext('2d');
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;
        backCtx.globalCompositeOperation = 'copy';
        //主canvas图像，光圈的涟漪效果
        context.globalAlpha = 0.95; //最后画的图形的透明度值，之前的一次减小，test函数为测试函数
        context.globalCompositeOperation = "lighter";

        if (this.timer1) {
            clearInterval(this.timer1);
        }
        this.timer1 = setInterval(() => {
            //var imgData=context.getImageData(0,0,canvas.width, canvas.height);
            //backCtx.putImageData(imgData,0,0);
            backCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height);
            context.clearRect(0, 0, canvas.width, canvas.height);
            this.renderMove(context, startData, RipplingData);
            context.drawImage(backCanvas, 0, 0, canvas.width, canvas.height);
        }, 10);
    }
    renderMove(context, startData, RipplingData) {
        var len = RipplingData.reduce((front, back) => {
            return front + back.radius;
        }, 0)
        var str = len.toString();
        var speed = parseInt(str.substr(0, 1)) * Math.pow(10, str.split('.')[0].length - 1) * this.speed;

        for (var point of RipplingData) {
            context.beginPath();
            var dy = point.radius * (Math.sin(Math.PI * 2 - point.currentAngle) - Math.sin(Math.PI * 2 - point.angle0));
            var dx = point.radius * (Math.cos(Math.PI * 2 - point.currentAngle) - Math.cos(Math.PI * 2 - point.angle0));
            var currentX = startData.x + dx, currentY = startData.y - dy;
            context.arc(currentX, currentY, 1, 0, Math.PI * 2);
            context.closePath();
            context.lineWidth = 1; //线条宽度
            context.strokeStyle = 'rgba(255, 255, 255,1)'; //颜色
            context.stroke();
            context.fillStyle = 'rgba(255, 255, 255,1)';
            context.fill();
            point.currentAngle += len / speed / point.radius;
            if (point.currentAngle - point.angle0 > Math.PI / 3) {
                point.currentAngle = point.angle0;
            }
        }
    }
    //绘制直线箭头函数,pre为尾点前面一个点，now为尾点  转换坐标系（好理解），将now点设为原点
    drawArrow(ctx, fromX, fromY, toX, toY, theta, headlen, color, width) {
        theta = typeof (theta) != 'undefined' ? theta : 30;
        headlen = typeof (theta) != 'undefined' ? headlen : 10;
        width = typeof (width) != 'undefined' ? width : 1;
        color = typeof (color) != 'color' ? color : '#000';
        var angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
        ctx.save();
        ctx.beginPath();
        var leftP = {
            x: toX + topX,
            y: toY + topY
        }
        var rightP = {
            x: toX + botX,
            y: toY + botY
        }
        //此点为箭头的两边的点的中间点
        var middleP = {
            x: (leftP.x + rightP.x) / 2,
            y: (leftP.y + rightP.y) / 2
        }
        middleP = {
            x: (toX + middleP.x) / 2,
            y: (toY + middleP.y) / 2
        }
        ctx.moveTo(leftP.x, leftP.y);
        ctx.lineTo(toX, toY);
        ctx.lineTo(rightP.x, rightP.y);
        ctx.lineTo(middleP.x, middleP.y);
        ctx.lineTo(leftP.x, leftP.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }
}
export { MapToolbar }