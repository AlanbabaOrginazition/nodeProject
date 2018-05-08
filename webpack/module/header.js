import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Signal from 'signals';
import $ajax,{broadCollection} from './$ajax';

/**
 * 头部导航栏组件
 * @property {Header}
 * @type {class}
 */
class Header extends Component {
    constructor(props) {
        super(props);
        this.onmouseover0 = this.onmouseover0.bind(this);
        this.onmouseover1 = this.onmouseover1.bind(this);
        this.onmouseout0 = this.onmouseout0.bind(this);
        this.onmouseout1 = this.onmouseout1.bind(this);
        this.headerClick = this.headerClick.bind(this);
        this.timer = null, this.menuData = [];
        this.state = {
            status: 'wait'
        }
    }
    render() {
        return (
            <div className="aln-head aln-bg-dark">
                <ul className="aln-head-ul">
                    {
                        this.menuData.map((item, i) => {
                            if (!item.children) {
                                return (
                                    <li className="aln-head-li" key={item.name}>
                                        <a className="aln-head-link" key={item.name + i.toString()} onClick={this.headerClick}>{item.name}</a>
                                    </li>
                                )
                            } else {
                                return (
                                    <li className="aln-head-li" key={item.name}>
                                        <a className="aln-head-link" key={item.name + i.toString()} onMouseOver={this.onmouseover0} onMouseOut={this.onmouseout0} onClick={this.headerClick}>{item.name}</a>
                                        <ul className="aln-dropdown-menu aln-bg-dark" key={i.toString()} >
                                            {
                                                item.children.map(child => {
                                                    return (
                                                        <a className="aln-dropdown-item" key={child.name} onMouseOver={this.onmouseover1} onMouseOut={this.onmouseout1} onClick={this.headerClick}>{child.name}</a>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </li>
                                )
                            }
                        })
                    }
                </ul>
                <div id="head-search" className="headder-search"></div>
            </div>
        )
    }
    onmouseover0(e) {
        if (!e.target.nextSibling.classList.contains('show') && !e.target.classList.contains('aln-dropdown-menu')) {
            e.target.nextSibling.classList.add('show')
        } else if (e.target.classList.contains('aln-dropdown-menu')) {
            e.target.classList.add('show');
        }
    }
    onmouseover1(e) {
        clearTimeout(this.timer);
        if (e.target.parentNode.classList.contains('aln-dropdown-menu')) {
            e.target.parentNode.classList.add('show');  
        }
    }
    onmouseout0(e) {
        if (e.target.nextSibling.classList.contains('show')) {
            var dom = e.target.nextSibling;
            this.timer = setTimeout(() => {
                dom.classList.remove('show')
            }, 100);
        }
    }
    onmouseout1(e) {
        if (e.target.parentNode.classList.contains('show')) {
            e.target.parentNode.classList.remove('show')
        }
    }
    headerClick(e){
        var text = e.target.innerHTML == "A L A N" ? "ALL BLOG" : e.target.innerHTML;
        broadCollection.headerClick.dispatch(text);
    }
    componentWillMount() {
        $ajax({
            url:this.props.DataUrl,
            method:'get',
            dataType:'json',
            success:(res)=>{
                this.menuData = res.data;
                this.setState({
                    status: 'done'
                })
            },
            error:function(status,errorText,xhr){
                var e = errorText;
            }
        })
    }
    componentDidMount(){
        ReactDOM.render(<HeaderSearch />,document.getElementById('head-search'));
        broadCollection.searchClick.add((data)=>{
            var a = data;
        })
    }
}
/**
 * 头部搜索框组件
 * @property HeaderSearch
 * @type {class}
 */
class HeaderSearch extends Component{
    constructor(props){
        super(props);
        this.onClick = this.onClick.bind(this);
    }
    render(){
        return(
            <div>
                <input ref="searchInput" className="search-input" type="text" placeholder="Input Something To Search"/>
                <i className="fa fa-search ico-search" onClick = {this.onClick}></i>
            </div>
        )
    }
    onClick(){
        broadCollection.searchClick.dispatch(this.refs.searchInput.value);
    }
}
export default Header;