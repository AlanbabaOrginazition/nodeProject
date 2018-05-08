'use strike';

$(document).ready(function () {
    var searchArr = [], dataset = [];
    d3.xml('/static/xml/city.xml', function (xml) {
        var c = xml.getElementsByTagName('c')[0].getElementsByTagName('d');
        for (var i = 0; i < c.length; i++) {
            var item = c[i];
            var category = item.getAttributeNode("d4").value;
            var cityname = item.getAttributeNode("d2").value;
            var citycode = item.getAttributeNode("d1").value;
            searchArr.push({ label: cityname, category: category, citycode: citycode });
        }
    });
    $.widget("custom.catcomplete", $.ui.autocomplete, {
        _renderMenu: function (ul, items) {
            var that = this,
                currentCategory = "";
            $.each(items, function (index, item) {
                if (item.category != currentCategory) {
                    ul.append("<li class='ui-autocomplete-category'>" + item.category + "</li>");
                    currentCategory = item.category;
                }
                that._renderItemData(ul, item);
            });
        }
    });
    $('#city').catcomplete({
        source: searchArr,
        select: function (event, ui) {
            Weather.getWeatherData(ui.item.citycode, ui.item.value)
        }
    });
    var num = d3.range(20, 500, 50);
    d3.shuffle(num);
    $("#transfer").on("click", function () {
        var linear = d3.scaleLinear()
            .domain([d3.min(num), d3.max(num)])
            .range([0, 100]);
        console.log(linear(20));
        var width = 1500;
        var height = 500;
        var svg = d3.select('body').append('svg').attr("id", "svg1").attr("width", width).attr("height", height);
        var padding = { top: 20, right: 20, bottom: 20, left: 20 };
        var rectStep = 35, rectWidth = 30;
        var rect = svg.selectAll('rect')
            .data(num)
            .enter()
            .append("rect")
            .attr('fill', 'steelblue')
            .attr('x', function (d, i) { return padding.left + i * rectStep; })
            .attr('y', function (d, i) { return height - padding.bottom - linear(d).toFixed(0) + 10; })
            .attr('width', rectWidth)
            .attr('height', function (d) { return linear(d).toFixed(0) + 10; });
        var text = svg.selectAll('text')
            .data(num)
            .enter()
            .append("text")
            .attr('fill', 'white')
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) { return padding.left + i * rectStep })
            .attr('y', function (d) { return height - padding.bottom - linear(d).toFixed(0) + 10; })
            .attr('dx', rectWidth / 2)
            .attr('dy', '1em')
            .text(function (d) { return (linear(d) + 10).toFixed(0); })


    })
    $("#insert").on("click", function () {
        //num.sort(d3.ascending);
        /*var n = $("input#num").val();
        num.push(n);
        draw(num);*/
        var w = 600;
        var h = 600;
        var data = d3.range(5);
        var color = d3.schemeCategory10;
        var svg = d3.select("body").append('svg').attr("width", w).attr("height", h);
        var circle = svg.selectAll("circle").data(data).enter().append("circle").attr("cx", function (d, i) { return 30 + i * 80; }).attr("cy", 100).attr("r", 30).attr("fill", function (d, i) { return color[i]; });

    })
    $("#scale").on("click", function (e) {
        var width = 600, heigth = 600;
        var svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', heigth);
        var xScale = d3.scaleLinear().domain([0, 10]).range([0, 300]);
        var axis = d3.axisTop().scale(xScale).ticks(5);
        var axis1 = d3.axisLeft().scale(xScale).ticks(5);
        var gAxis = svg.append('g').attr('transform', 'translate(80,80)');
        var gAxis1 = svg.append('g').attr('transform', 'translate(80,80)');
        axis(gAxis);
        axis1(gAxis1);
    })
    $("#scatter").on("click", function () {
        var w = 600, h = 600;
        var padding = { top: 30, right: 30, bottom: 30, left: 30 };
        var center = [[0, 0.5], [0.7, 0.8], [0.4, 0.9], [0.11, 0.32], [0.88, 0.25], [0.75, 0.12], [0.5, 0.1], [0.2, 0.3], [0.4, 0.1], [0.6, 0.7]];
        var xScale = d3.scaleLinear()
            .domain([0, 1.2 * d3.max(center, function (d) {
                return d[0];
            })])
            .range([padding.left, w - padding.left - padding.right]);
        var yScale = d3.scaleLinear()
            .domain([0, 1.2 * d3.max(center, function (d) {
                return d[1];
            })])
            .range([h - padding.bottom, padding.top]);

        var svg = d3.select('body').append('svg')
            .attr("width", w)
            .attr("height", h);
        var circle = svg.selectAll('circle')
            .data(center)
            .enter()
            .append('circle')
            .attr("fill", "red")
            .attr("cx", function (d) {
                return xScale(d[0]);
            })
            .attr("cy", function (d) {
                return yScale(d[1]);
            })
            .attr("r", 5);
        var x = d3.axisBottom().scale(xScale);//.tickFormat(d3.format("$0.1f"));
        var y = d3.axisLeft().scale(yScale);
        var xAxis = svg.append('g').attr('transform', 'translate(0,' + (h - padding.bottom) + ')');
        var yAxis = svg.append('g').attr('transform', 'translate(' + padding.left + ',0)');
        x(xAxis), y(yAxis);

    })
    $("#line").on("click", function () {
        var w = 600, h = 600;
        var svg = d3.select('body').append('svg')
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg_line");
        var lines = [[80, 80], [200, 100], [200, 200], [100, 200]];
        var linePath = d3.line().curve(d3.curveCardinal);
        svg.append("path")
            .attr("d", linePath(lines))
            .attr("stroke", "red")
            .attr("stroke-width", "3px")
            .attr("fill", "none");
    })
    $("#area").on("click", function () {
        var w = 600, h = 600;
        var svg = d3.select('body').append('svg')
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg_area");
        var data = [80, 120, 130, 70, 60, 90];
        var area = d3.area().curve(d3.curveCardinal)
            .x(function (d, i) { return 50 + i * 80; })
            .y0(function (d, i) { return h / 2; })
            .y1(function (d, i) { return h / 2 - d; });
        svg.append("path")
            .attr("d", area(data))
            .attr("stroke", "black")
            .attr("stroke-width", "3px")
            .attr("fill", "yellow");

    })
    //弧生成器
    $("#arc").on("click", function () {
        var w = 600, h = 600;
        var svg = d3.select('body').append('svg')
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg_area");
        var data = [{ startAngle: 0, endAngle: Math.PI * 0.5 }, { startAngle: Math.PI * 0.5, endAngle: Math.PI * 1 }, { startAngle: Math.PI * 1, endAngle: Math.PI * 1.7 }, { startAngle: Math.PI * 1.7, endAngle: Math.PI * 2 }];
        var color = d3.schemeCategory10;
        var arc = d3.arc()
            .innerRadius(50)
            .outerRadius(100)
            .padAngle(Math.PI * 0.1);
        svg.selectAll("path")
            .data(data)
            .enter()
            .append("path")
            .attr("d", function (d) { return arc(d) })
            .attr("transform", "translate(250,250)")
            .attr("stroke", "none")
            .attr("stroke-width", "2px")
            .attr("fill", function (d, i) { return color[10 - i]; });
        //标签文字
        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("transform", function (d) {
                return "translate(250,250)" +
                    "translate(" + arc.centroid(d) + ")";
            })
            .attr("text-anchor", "middle")
            .attr("fill", function (d, i) { return color[i] })
            .attr("font-size", "18px")
            .text(function (d) {
                return Math.floor((d.endAngle - d.startAngle) * 180 / Math.PI) + "°";
            })

    })
    //符号生成器,有问题
    $("#symbol").on("click", function () {
        var n = 30;
        var dataset = [];
        var types = ["circle", "cross", "diamond", "square", "triangle-down", "triangle-up"];
        for (var i = 0; i < n; i++) {
            dataset.push({
                size: Math.random() * 30 + 200,
                type: types[0]  //Math.floor(Math.random * types.length)
            });
        }
        var color = d3.schemeCategory20b;
        var symbol = d3.symbolDiamond;


        var w = 600, h = 600;
        var svg = d3.select('body').append('svg')
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg_area");
        svg.selectAll()
            .data(dataset)
            .enter()
            .append("path")
            .attr("d", function (d, i) { return symbol[i]; })
            .attr("transform", function (d, i) {
                var x = 100 + i % 5 * 20;
                var y = 100 + Math.floor(i / 5) * 20;
                return "translate(" + x + "," + y + ")";
            })
            .attr("fill", function (d, i) { return color[i] });
    })
    $("#line_chart").on("click", function () {
        var w = 600, h = 600;
        var dataset = [
            {
                country: 'china',
                gdp: [[2000, 11920], [2001, 13170], [2002, 14550], [2003, 16500], [2004, 19440], [2005, 22870], [2006, 27930], [2007, 35040], [2008, 45470], [2009, 51050], [2010, 59490], [2011, 73140], [2012, 83860], [2013, 103550]]
            },
            {
                country: 'japan',
                gdp: [[2000, 47310], [2001, 41590], [2002, 39800], [2003, 43020], [2004, 46550], [2005, 45710], [2006, 43560], [2007, 43560], [2008, 48490], [2009, 50350], [2010, 54950], [2011, 59050], [2012, 59370], [2013, 48980]]
            }
        ];
        var padding = { top: 50, right: 50, bottom: 50, left: 50 };
        //计算GDP最大值
        var maxgdp = 0;
        for (var i in dataset) {
            var currGdp = d3.max(dataset[i].gdp, function (d) {
                return d[1];
            })
            if (currGdp > maxgdp)
                maxgdp = currGdp;
        }
        var xScale = d3.scaleLinear()
            .domain([2000, 2013])
            .range([padding.left, w - padding.right]);
        var yScale = d3.scaleLinear()
            .domain([0, maxgdp * 1.2])
            .range([h - padding.bottom, padding.top]);
        var linePath = d3.line()
            .x(function (d) { return xScale(d[0]) })
            .y(function (d) { return yScale(d[1]) })
            .curve(d3.curveCardinal);
        var color = [d3.rgb(0, 0, 255), d3.rgb(0, 255, 0)];
        var svg = d3.select('body').append('svg')
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg_line_chart");
        svg.selectAll("path")
            .data(dataset)
            .enter()
            .append("path")
            //.attr("transform","translate(" + padding.left + "," + padding.top + ")")
            .attr("d", function (d) { return linePath(d.gdp); })
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", function (d, i) { return color[i]; });
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5)
        //.tickFormat(d3.format("d"));
        var yAxis = d3.axisLeft()
            .scale(yScale);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 0 + "," + (h - padding.bottom) + ")")
            .call(xAxis);
        svg.append("g")
            .attr("transform", "translate(" + padding.left + "," + 0 + ")")
            .call(yAxis);
    })
    $("#weather").on("click", function () {
        var w = 600, h = 600;
        var padding = { top: 50, right: 50, bottom: 80, left: 50 };
        var highTemp = d3.max(Weather.dataset[0].tem, function (d) { return parseInt(d) });
        var lowTemp = d3.min(Weather.dataset[1].tem, function (d) { return parseInt(d) });
        var xScale = d3.scaleLinear()
            .domain([0, 6])
            .range([padding.left, w - padding.right]);
        var yScale = d3.scaleLinear()
            .domain([lowTemp - 5, highTemp + 5])
            .range([h - padding.bottom, padding.top]);
        var linePath = d3.line()
            .x(function (d, i) { return xScale(i) })
            .y(function (d) { return yScale(d) })
        var color = [d3.rgb(0, 0, 255), d3.rgb(0, 255, 0)];
        var svg = d3.select('body').append('svg')
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg_line_chart");
        svg.selectAll("path")
            .data(Weather.dataset)
            .enter()
            .append("path")
            .attr("d", function (d) { return linePath(d.tem); })
            .attr("fill", "none")
            .attr("stroke-width", 3)
            .attr("stroke", function (d, i) { return color[i]; });
        //添加高温点
        svg.selectAll('circle')
            .data(Weather.dataset[0].tem)
            .enter()
            .append('circle')
            .attr("fill", "red")
            .attr("cx", function (d, i) {
                return xScale(i);
            })
            .attr("cy", function (d) {
                return yScale(d);
            })
            .attr("r", 5);
        //添加高温温度文字
        svg.selectAll('htext')
            .data(Weather.dataset[0].tem)
            .enter()
            .append("text")
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) { return xScale(i); })
            .attr('y', function (d) { return yScale(d); })
            .attr("dx", function () { return '1.5em'; })
            .attr("dy", function () { return '1em' })
            .text(function (d) { return d + "℃" })
        //添加低温点
        svg.selectAll('circle1')
            .data(Weather.dataset[1].tem)
            .enter()
            .append('circle')
            .attr("fill", color[0])
            .attr("cx", function (d, i) {
                return xScale(i);
            })
            .attr("cy", function (d) {
                return yScale(d);
            })
            .attr("r", 5);
        //添加低温温度文字
        svg.selectAll('ltext')
            .data(Weather.dataset[1].tem)
            .enter()
            .append("text")
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('text-anchor', 'middle')
            .attr('x', function (d, i) { return xScale(i); })
            .attr('y', function (d) { return yScale(d); })
            .attr("dx", function () { return '1.5em'; })
            .attr("dy", function () { return '1em' })
            .text(function (d) { return d + "℃" });
        var days = [], dx = [];
        var curTime = new Date();
        for (var i = -1; i < 5; i++) {
            var t = new Date(curTime.getTime() + i * 24 * 3600 * 1000).toLocaleDateString();
            days.push(t);
            dx.push(xScale(i + 1));
        }
        var ordinal = d3.scaleOrdinal()
            .domain(days)
            .range(dx)
        //x坐标轴可以绑定序数比例尺或者绑定线性比例尺，然后更改文字
        var xAxis = d3.axisBottom()
            .scale(xScale)
            .ticks(5)
        //.tickFormat(d3.format("d"));
        var yAxis = d3.axisLeft()
            .scale(yScale);
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 0 + "," + (h - padding.bottom) + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("font-weight", "bold")
            .attr("dy", ".35em")
            .text(function (d, i) { return new Date(curTime.getTime() + (i - 1) * 24 * 3600 * 1000).toLocaleDateString(); })
            //旋转x轴label
            .attr("transform", "rotate(60)")
            .style("text-anchor", "start");
        svg.append("g")
            .attr("transform", "translate(" + padding.left + "," + 0 + ")")
            .call(yAxis);
        //添加标题文字
        svg.selectAll('title')
            .data([1])
            .enter()
            .append("text")
            .attr('fill', 'black')
            .attr('font-size', '20px')
            .attr('text-anchor', 'middle')
            .attr("font-weight", "bold")
            .attr('x', w / 2)
            .attr('y', 80)
            .text(function () { return Weather.cityname + new Date(curTime.getTime() - 24 * 3600 * 1000).toLocaleDateString() + "~" + new Date(curTime.getTime() + 4 * 24 * 3600 * 1000).toLocaleDateString() + "温度图" })
        //添加图例
        svg.selectAll('legendRect')
            .data([0, 1])
            .enter()
            .append("rect")
            .attr('fill', function (d, i) { return color[i]; })
            .attr('x', w - padding.right - 60)
            .attr('y', function (d, i) { return 100 + i * 30; })
            .attr('width', 40)
            .attr('height', 20);
        //添加图例文字
        svg.selectAll('legendText')
            .data(Weather.dataset)
            .enter()
            .append("text")
            .attr('fill', 'black')
            .attr('font-size', '14px')
            .attr('text-anchor', 'start')
            .attr('x', w - padding.right - 10)
            .attr('y', function (d, i) { return 114 + i * 30; })
            .text(function (d, i) {
                if (i == 0)
                    return "高温";
                else
                    return "低温";
            })
    })
    $("#transition").on("click", function () {
        var w = 600
            , h = 600;
        var svg = d3.select('body').append('svg')
            .attr("width", w)
            .attr("height", h)
            .attr("id", "svg");
        var rect = svg.append("rect")
            .attr("fill", "steelblue")
            .attr("x", 10)
            .attr("y", 50)
            .attr("width", 100)
            .attr("height", 30);
        var transition = rect.transition()
            .delay(2000)
            .duration(1000)
            .attr("fill", "red")
            .attr("width", 300)
            .transition()
            .delay(1000)
            .attr("fill", "green")
            .attr("width", 500)
            .transition()
            .style("fill", "black")
            .attr("width", 100);

        var text = svg.append("text")
            .attr("fill", "white")
            .attr("x", 100)
            .attr("y", 50)
            .attr("dy", "1.3em")
            .attr("text-anchor", "end")
            .text(100);
        var textTransition = text.transition()
            .delay(2000)
            .duration(1000)
            .tween("x", function () { //x换成text也可以
                return function (t) {
                    d3.select("text")
                        .attr("x", 100 + t * 200)
                        .attr("fill", "black")
                        .text(Math.floor(100 + t * 200));
                }
            })
            .transition()
            .delay(1000)
            .tween("x", function () {
                return function (t) {
                    d3.select("text")
                        .attr("x", 300 + t * 200)
                        .attr("fill", "black")
                        .text(Math.floor(300 + t * 200));
                }
            })
            .transition()
            .tween("x", function () {
                return function (t) {
                    d3.select("text")
                        .attr("x", 500 - t * 400)
                        .attr("fill", "red")
                        .text(Math.floor(500 - t * 400));
                }
            })
    })
    $("#postsql").on("click", function () {
        console.log(new Date());
        var distance = $("#distance").val();
        var neednum = $("#neednum option:selected").val();
        $.post("/d3/data", { distance: distance, neednum: neednum }, function (data) {
            var result = data;
            console.log(new Date());
            var body = data.result.value.map(function (value, i) {
                value.geomjson = 'aaa';
                return {
                    index: i,
                    geomjson: value.geomjson,
                    dkbh:value.dkbh,
                    yddh: value.yddh,
                    dkmj: value.dkmj,
                    count: value.count
                };

            })
            var source = '<table class="table table-striped">' +
                '<thead>' +
                '<tr>' +
                '{{each header as value i}}' +
                '<th>{{value}}</th>' +
                '{{/each}}' +
                '</tr>' +
                '</thead>' +
                '<tbody>' +
                '{{each body as value i}}' +
                '<tr>' +
                '{{each value as e i}}' +
                '<td>{{e}}</td>' +
                '{{/each}}' +
                '</tr>' +
                '{{/each}}' +
                '</tbody>' +
                '<table>';
            var render = template.compile(source);
            data.result.fields.unshift('#');
            var html = render({
                header: data.result.fields,
                body: body
            })
            $("#contain-table").append(html);
        })
    })
})
var Weather = {
    dataset: [],
    cityname: '',
    getWeatherData: function (citycode, cityname) {
        var _this = this;
        _this.cityname = cityname;
        _this.dataset = [];
        $.get("http://wthrcdn.etouch.cn/WeatherApi?citykey=" + citycode, function (data) {
            var yesterday = data.getElementsByTagName('yesterday')[0];
            var yhigh = yesterday.getElementsByTagName("high_1")[0].textContent;
            var ylow = yesterday.getElementsByTagName("low_1")[0].textContent;
            var hArr = { tem: [] };
            var lArr = { tem: [] };
            hArr.tem.push(yhigh.substring(3, yhigh.length - 1));
            lArr.tem.push(ylow.substring(3, ylow.length - 1));
            //_this.dataset.push(obj);
            var days = data.getElementsByTagName('weather');
            for (var i = 0; i < days.length; i++) {
                var high = days[i].getElementsByTagName('high')[0].textContent;
                var low = days[i].getElementsByTagName('low')[0].textContent;
                hArr.tem.push(high.substring(3, high.length - 1));
                lArr.tem.push(low.substring(3, low.length - 1));
                //obj = {high:high.substring(3,high.length-1),low:low.substring(3,low.length-1)};
            }
            _this.dataset.push(hArr);
            _this.dataset.push(lArr);
        })
    }
}

function draw(dataset) {
    var height = 500;
    var padding = { top: 20, right: 20, bottom: 20, left: 20 };
    var rectStep = 35, rectWidth = 30;

    var updateRect = d3.selectAll('#svg1').selectAll('rect').data(dataset);
    var enterRect = updateRect.enter();
    var exitRect = updateRect.exit();

    var updateText = d3.select('#svg1').selectAll('text').data(dataset);
    var enterText = updateText.enter();
    var exitText = updateText.exit();

    updateRect.attr('fill', 'steelblue')
        .attr("x", function (d, i) { return padding.left + i * rectStep; })
        .attr("y", function (d) { return height - padding.bottom - d; })
        .attr("width", rectWidth)
        .attr("height", function (d) { return d; });
    enterRect.append("rect")
        .attr('fill', 'steelblue')
        .attr("x", function (d, i) { return padding.left + i * rectStep; })
        .attr("y", function (d) { return height - padding.bottom - d; })
        .attr("width", rectWidth)
        .attr("height", function (d) { return d; });
    exitRect.remove();

    updateText.attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('x', function (d, i) { return padding.left + i * rectStep })
        .attr('y', function (d) { return height - padding.bottom - d; })
        .attr('dx', rectWidth / 2)
        .attr('dy', '1em')
        .text(function (d) { return d; });
    enterText.append("text")
        .attr('fill', 'white')
        .attr('font-size', '14px')
        .attr('text-anchor', 'middle')
        .attr('x', function (d, i) { return padding.left + i * rectStep })
        .attr('y', function (d) { return height - padding.bottom - d; })
        .attr('dx', rectWidth / 2)
        .attr('dy', '1em')
        .text(function (d) { return d; });
    exitText.remove();
}