import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Signal from 'signals';
import $ajax,{broadCollection} from './$ajax';
import {config} from '../pack.config';
/**
 * 页面内容组件
 * @property Content
 * @type {class}
 */
class Content extends Component{
    constructor(props){
        super(props);
        this.state = {
            tab:"ALL BLOG"
        }
        this.data = [
            {title:"webpack常用功能总结",imgUrl:config.defaultServiceIP+"/static/img/content-list1.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"react中this指向",imgUrl:config.defaultServiceIP+"/static/img/content-list2.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"模拟echarts的人口迁移图",imgUrl:config.defaultServiceIP+"/static/img/content-list3.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"ArcGIS Server的webAdapter配置",imgUrl:config.defaultServiceIP+"/static/img/content-list4.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"webpack常用功能总结",imgUrl:config.defaultServiceIP+"/static/img/content-list1.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"react中this指向",imgUrl:config.defaultServiceIP+"/static/img/content-list2.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"模拟echarts的人口迁移图",imgUrl:config.defaultServiceIP+"/static/img/content-list3.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"ArcGIS Server的webAdapter配置",imgUrl:config.defaultServiceIP+"/static/img/content-list4.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"模拟echarts的人口迁移图",imgUrl:config.defaultServiceIP+"/static/img/content-list3.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。"},
            {title:"ArcGIS Server的webAdapter配置",imgUrl:config.defaultServiceIP+"/static/img/content-list4.jpg",link:"/static/resource/20180130",summary:"函数副作用指当调用函数时，除了返回函数值之外，还对主调用函数产生附加的影响。如果实现单行文本的溢出显示省略号同学们应该都知道用text-overflow:ellipsis属性来，当然还需要加宽度width属来兼容部分浏览"},
        ]
    }
    render(){
        return (
            <div className="content-main">
                <ContentHeader aln-tab={this.state.tab}/>
                <div className="content-body">
                {
                    this.data.map((item,i)=>{
                        return(
                            <ContentCell source ={item} key={i}></ContentCell>
                        )
                    })
                }
                </div>
            </div>
        )
    }
    componentDidMount(){
        broadCollection.headerClick.add(text=>{
            this.setState({
                tab:text
            })
        })
    }
}
/**
 * 内容区头部标签
 * @property ContentHeader
 * @type {class}
 */
class ContentHeader extends Component{
    constructor(props){
        super(props);
        broadCollection.headerClick.add(text=>{
            console.log(text);
        })
    }
    render(){
        return(
            <div className="content-header">
                <h2 className="content-title">{this.props["aln-tab"]}</h2>
            </div>
        )
    }
}
/**
 * 内容单元格
 * @property ContentCell
 * @type {class}
 */
class ContentCell extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="content-cell">
                <article className="content-article">
                    <img className="cell-img" src= {this.props.source.imgUrl}/>
                    <a className="cell-a" href={this.props.source.link}>{this.props.source.title}</a>
                    <div className="cell-summary">{this.props.source.summary}</div>
                </article>
            </div>
        )
    }
}

export default Content;