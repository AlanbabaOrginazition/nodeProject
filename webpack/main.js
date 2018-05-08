import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import {MapToolbar} from './module/components';
$(()=>{
    ReactDOM.render(<MapToolbar />,document.getElementById("MapToolbar"));
})
/**
 * 注册初始化页面的事件
 * @property bindClick
 * @type {Function}
 */
function bindClick(){
}