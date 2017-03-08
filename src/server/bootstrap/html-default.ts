/**
 * @fileOverview default html output
 * @author Max
 */

import * as env from '../utils/env-detect';


export const HEAD = {
    doctype: '<!DOCTYPE html>',
    htmlTagOpen: '<html lang="zh-cmn-Hans">',
    headTagOpen: '<head>',
    titleTagOpen: '<title>',
    title: '',
    titleTagClose: '</title>',
    charset: '<meta charset="utf-8" >',
    favicon: '<link rel="shortcut icon" href="/dist/favicon.ico" />',
    XUACompatible: '<meta http-equiv="X-UA-Compatible" content="IE=edge" >',
    viewport: '<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" >',
    renderer: '<meta name="renderer" content="webkit" >',
    formatDetection: '<meta name="format-detection" content="telephone=no" >',
    headTagClose: '</head>',
    bodyTagOpen: '<body>',
    rootTagOpen: '<div id="root">'
};

const REACT_VERSION = '15.4.1';
const IMMUTABLE_VERSION = '3.8.1';
const JS_COOKIE_VERSION = '2.0.3';

export const CDN_FAIL_SAFE = {
    React: `${__JS_LIB_PATH__}/react-with-addons-${REACT_VERSION}.min.js`,
    ReactDOM: `${__JS_LIB_PATH__}/react-dom-${REACT_VERSION}.min.js`,
    Immutable: `${__JS_LIB_PATH__}/immutable-${IMMUTABLE_VERSION}.min.js`
};

export const FOOT = {
    rootTagClose: '</div>',
    react: env.notDev() ? `<script type="text/javascript" src="//cdn.bootcss.com/react/${REACT_VERSION}/react-with-addons.min.js"></script>` : `<script type="text/javascript" src="${__JS_LIB_PATH__}/react-with-addons-${REACT_VERSION}.js"></script>`,
    reactDOM: env.notDev() ? `<script type="text/javascript" src="//cdn.bootcss.com/react/${REACT_VERSION}/react-dom.min.js"></script>` : `<script type="text/javascript" src="${__JS_LIB_PATH__}/react-dom-${REACT_VERSION}.min.js"></script>`,
    immutable: env.notDev() ? `<script type="text/javascript" src="//cdn.bootcss.com/immutable/${IMMUTABLE_VERSION}/immutable.min.js"></script>` : `<script type="text/javascript" src="${__JS_LIB_PATH__}/immutable-${IMMUTABLE_VERSION}.min.js"></script>`,
    commons: `<script type="text/javascript" src="${__JS_STATIC_PATH__}/page/commons.js"></script>`,
    entry: `<script type="text/javascript" src="${__JS_STATIC_PATH__}/page/entry.js"></script>`,
    bodyTagClose: '</body>',
    htmlTagClose: '</html>'
};