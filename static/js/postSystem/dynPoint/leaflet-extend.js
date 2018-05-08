var normalm = L.chinaProvider('GaoDe.Normal.Map', {
    maxZoom: 18,
    minZoom: 1
});
var imgm = L.chinaProvider('GaoDe.Satellite.Map', {
    maxZoom: 18,
    minZoom: 1
});
var imga = L.chinaProvider('GaoDe.Satellite.Annotion', {
    maxZoom: 18,
    minZoom: 1
});
var baiduMap = new L.TileLayer('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518', {
    maxZoom: 18,
    minZoom: 3,
    subdomains: [0, 1, 2],
    tms: true
});

var normal = L.layerGroup([normalm]),
    image = L.layerGroup([imgm, imga]);
//定义百度地图的投影坐标系
var crs = new L.Proj.CRS('EPSG:3395',
    '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
    {
        resolutions: function () {
            var level = 19, res = [];
            res[0] = Math.pow(2, 18);
            for (var i = 1; i < level; i++) {
                res[i] = Math.pow(2, (18 - i))
            }
            return res;
        }(),
        origin: [0, 0],
        bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
    });
L.BaseMap = L.Class.extend({
    map: null,
    initialize: function (id) {
        this.id = id ? id : alert('地图容器id为初始化');
        this.map = L.map(id, {
            center: [30.59, 103.99],
            zoom: 15,
            minZoom: 4,
            touchZoom:'center',
            zoomControl: false,
            attributionControl: false
        });
    },
    addMap: function () {
        var  arg = [
            {
                name: "高德地图",
                layer: normal,
                options: {
                    crs: this.map.options.crs,
                    center: [30.59, 103.99]
                }
            },
            {
                name: "高德影像",
                layer: image,
                options: {
                    crs: this.map.options.crs,
                    center: [30.59, 103.99],
                }
            },
            {
                name: "百度地图",
                layer: baiduMap,
                options: {
                    crs: crs,
                    center: [30.59, 103.99]
                }
            }
        ];
        //添加右上角切换图层
        new L.Control.BaseMap(arg).addTo(this.map);
    }

});
//扩展插件，右上角切换底图（不同坐标系哦）
L.Control.BaseMap = L.Control.extend({
    options: {
        position: 'topright',
        baseLayers: [],
        layers: []
    },
    arg: [],
    initialize: function (arg, options) {
        this.options = options ? options : this.options;
        this.arg = arg;
    },
    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-layers');
        var a = L.DomUtil.create('a', 'leaflet-control-basemap-toggle');
        this._container.appendChild(a);
        var form = L.DomUtil.create('form', 'leaflet-control-layers-list'),
            _this = this;
        this.arg[0].layer.addTo(map);//添加设置的第一个底图
        L.DomEvent.on(a,'click',function(e){
            L.DomUtil.addClass(_this._container, 'leaflet-control-basemap-expand');
            e.stopPropagation();
            $('.leaflet-control-layers-base').off('click');
            $('.leaflet-control-layers-base').on('click', function (e) {
                var text = $(e.target).next()[0].textContent;
                 _this._addMap(text, map);
                 e.stopPropagation();
            })
            $('body').one('click',function(){
                L.DomUtil.removeClass(_this._container, 'leaflet-control-basemap-expand');
            })
        })
        L.DomEvent.on(a, 'mouseover', function (e) {
            L.DomUtil.addClass(_this._container, 'leaflet-control-basemap-expand');
            L.DomEvent.on(form, 'mouseover', function (e) {
                L.DomUtil.addClass(_this._container, 'leaflet-control-basemap-expand');
                $('input.leaflet-control-layers-selector').off('click');
                $('input.leaflet-control-layers-selector').one('click', function (e) {
                    var text = $(this).next()[0].textContent;
                    _this._addMap(text, map);
                })
            })
            L.DomEvent.on(form, 'mouseout', function (e) {
                L.DomUtil.removeClass(_this._container, 'leaflet-control-basemap-expand');
            })
        })
        this._container.appendChild(form);
        var layersDiv = L.DomUtil.create('div', 'leaflet-control-layers-base')
        form.appendChild(layersDiv);
        var vl = '';
        for (var i in this.arg) {
            var item = this.arg[i];
            if (i == 0) {
                vl += '<label><div><input type="radio" checked="checked" class="leaflet-control-layers-selector" name="basemap-layer-radio"/>&nbsp<span>' + item.name + '</span></div></label>';
            } else {
                vl += '<label><div><input type="radio" class="leaflet-control-layers-selector" name="basemap-layer-radio"/>&nbsp<span>' + item.name + '</span></div></label>';
            }
        }
        layersDiv.innerHTML = vl;
        return this._container;
    },
    _addMap: function (text, map) {
        this.arg.map(function (item) {
            if (item.name == text) {
                map.options.crs = item.options.crs;//更换底图的投影坐标系，需要重新setView()
                item.layer.addTo(map);
                map.setView(item.options.center);
            } else {
                map.removeLayer(item.layer);
            }
        })
    }
})
//扩展控件，实时点坐标信息
L.Control.Coord = L.Control.extend({
    options: {
        position: 'bottomleft',
        maxWidth: 100
    },
    initialize: function (options) {

        this.options = options ? options : this.options;
    },
    onAdd: function (map) {
        this._container = L.DomUtil.create('div', 'leaflet-control-coord');

        var closebutton = document.createElement('a');
        closebutton.id = 'leaflet-control-geosearch-close';
        closebutton.className = 'icon-resize-full';
        this._closebutton = closebutton;

        this._container.appendChild(this._closebutton);
        map.on(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
        return this._container;

    },
    _onCloseControl: function () {
        //this._map.options.Legend = false;
        this.removeFrom(this._map);

    },
    _update: function () {
        var map = this._map,
            y = map.getSize().y / 2;

        var maxMeters = map.distance(
            map.containerPointToLatLng([0, y]),
            map.containerPointToLatLng([this.options.maxWidth, y]));

        this._updateMetric(maxMeters);
    },
    _updateMetric: function (maxMeters) {
        var meters = this._getRoundNum(maxMeters),
            label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';
        console.log(label);
        this._updateScale(this._mScale, label, meters / maxMeters);
    },
    _getRoundNum: function (num) {
        var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
            d = num / pow10;

        d = d >= 10 ? 10 :
            d >= 5 ? 5 :
                d >= 3 ? 3 :
                    d >= 2 ? 2 : 1;

        return pow10 * d;
    },
    _updateScale: function (scale, text, ratio) {
        //scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
        //scale.innerHTML = text;
    }
})