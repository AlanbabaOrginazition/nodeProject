import React, { Component, addons } from 'react';
import ReactDOM from 'react-dom';

class LeftPanel extends Component{
    constructor(props){
        super(props);
        this.state = {
            title:"home"
        }
    }
    render(){
        return(
            <div className="leftPanel">
                <div className="md-container">
                    <div className={this.state.title == 'home' ? 'md-active' : ''} onClick = {this.clickEnvent.bind(this,'home')}><i className="fa fa-home fa-2x"></i><p>HOME</p></div>
                    <div className={this.state.title == 'blog' ? 'md-active' : ''} onClick = {this.clickEnvent.bind(this,'blog')}><i className="fa fa-book fa-2x"></i><p>技术博客</p></div>
                    <div className={this.state.title == 'canvas' ? 'md-active' : ''} onClick = {this.clickEnvent.bind(this,'canvas')}><i className="fa fa-snowflake-o fa-2x"></i><p>canvas</p></div>
                    <div className={this.state.title == 'websockt' ? 'md-active' : ''} onClick = {this.clickEnvent.bind(this,'websockt')}><i className="fa fa-commenting-o fa-2x"></i><p>webSockt</p></div>
                    <div className={this.state.title == 'webgis' ? 'md-active' : ''} onClick = {this.clickEnvent.bind(this,'webgis')}><i className="fa fa-map fa-2x"></i><p>webgis</p></div>
                    <div className={this.state.title == 'user' ? 'md-active' : ''} onClick = {this.clickEnvent.bind(this,'user')}><i className="fa fa-user-circle fa-2x"></i><p>USER</p></div>
                </div>
            </div>
        )
    }
    clickEnvent(title){
        if(title)  this.setState({title:title});
        switch(title){
            case 'home':
                break;
            case 'blog':
                break;
            case 'canvas':
                break;
            case 'websockt':
                break;
            case 'user':
                break;
            default:
                break;
        }
    }
}
/**
 * 搜索栏组件
 * @property Search
 * @type {class}
 */
class Search extends Component{
    render(){
        return(
            <div>
                <input type="text" id="content-search-input" placeholder="input something to search"/>
                <i className="fa fa-search fa-2x"></i>
            </div>
        )
    }
}
/**
 * 主容器内容
 * @property Content
 * @type {class}
 */
class Content extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <div className="col-md-12 topic"></div>
                <div className="col-md-12 content-list">
                    <div className="col-content"></div>
                    <div className="col-content"></div>
                    <div className="col-content"></div>
                    <div className="col-content"></div>
                    <div className="col-content"></div>
                    <div className="col-content"></div>
                    <div className="col-content"></div>
                    <div className="col-content"></div>
                </div>
            </div>
        )
    }
}
document.ready = ()=>{
    //初始化左侧面板
    ReactDOM.render(<LeftPanel />,document.getElementById("leftRow"));
    //初始化搜索栏
    ReactDOM.render(<Search />,document.getElementById("content-search"));
    //初始化主容器内容
    ReactDOM.render(<Content />,document.getElementById("main-content"));
}