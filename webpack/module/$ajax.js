import Signal from 'signals';

/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 */
function ajax(opt) {
    opt = opt || {};
    opt.method = opt.method.toUpperCase() || 'POST';
    opt.url = opt.url || '';
    opt.async = opt.async || true;
    opt.data = opt.data || null;
    opt.success = opt.success || function () {};
    opt.error = opt.error || function () {};
    opt.dataType = opt.dataType || 'text';
    var xmlHttp = null;
    if (XMLHttpRequest) {
        xmlHttp = new XMLHttpRequest();
    }
    else {
        xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }var params = [];
    for (var key in opt.data){
        params.push(key + '=' + opt.data[key]);
    }
    var postData = params.join('&');
    if (opt.method.toUpperCase() === 'POST') {
        xmlHttp.open(opt.method, opt.url, opt.async);
        xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
        xmlHttp.send(postData);
    }
    else if (opt.method.toUpperCase() === 'GET') {
        xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
        xmlHttp.send(null);
    } 
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 ) {
            if(xmlHttp.status == 200){
                var res;
                if(opt.dataType.toUpperCase() == 'JSON'){
                    res = JSON.parse(xmlHttp.responseText);
                }else{
                    res = xmlHttp.responseText;
                }
                opt.success(res);
            }else{
                opt.error(xmlHttp.status,xmlHttp.statusText,xmlHttp);
            }
            
        }
    };
}
/**
 * 页面事件监听。供独立组件之间调用
 * @property broadCollection
 * @type {object}
 */
const broadCollection = {
    headerClick:new Signal(),
    searchClick:new Signal()
}


export default ajax;
export { broadCollection };

/* signal广播传发器
var myObject = {
  started : new signals.Signal()
};
function onStarted(param1, param2){
  alert(param1 + param2);
}
myObject.started.dispatch('foo', 'bar'); //dispatch signal passing custom parameters
myObject.started.add(onStarted); //add listener
myObject.started.remove(onStarted); //remove a single listener
*/