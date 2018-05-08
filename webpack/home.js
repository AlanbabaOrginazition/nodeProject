import React, { Component, addons } from 'react';
import ReactDOM from 'react-dom';
import Header from './module/header';
import Content from './module/content';
import {config} from './pack.config';
document.ready = () => {
    ReactDOM.render(<Header DataUrl={ config.defaultServiceIP + '/getHeaderData' } />, document.getElementById("header-tp"));
    ReactDOM.render(<Content />, document.getElementById("home-container"));
    var footer = document.getElementById("home-footer");
    footer.classList.add('home-footer');
}