$(function () {
    var BaseMap = new L.BaseMap('map-main');
    BaseMap.addMap();
})




L.App1 = L.Class.extend({
    map: null,
    initialize: function () {

    },
    addMap: function (name) {
        var crs = new L.Proj.CRS('EPSG:3395',
            '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
            {
                resolutions: function () {
                    level = 19
                    var res = [];
                    res[0] = Math.pow(2, 18);
                    for (var i = 1; i < level; i++) {
                        res[i] = Math.pow(2, (18 - i))
                    }
                    return res;
                }(),
                origin: [0, 0],
                bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
            });
        this.map = L.map("map-main", {
            crs: crs,
            center: [30.59, 103.99],
            zoom: 15,
            minZoom: 4,
            zoomControl: false,
            attributionControl: false
        });
        new L.TileLayer('http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&udt=20150518', {
            maxZoom: 18,
            minZoom: 3,
            subdomains: [0, 1, 2],
            tms: true
        }).addTo(this.map);
        
    }

});
function addBaiduMap() {



}


