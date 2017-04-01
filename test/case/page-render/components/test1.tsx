/**
 * @fileOverview Test1组件
 * @author Max
 **/

import * as _expressStatic from 'express-serve-static-core';
import * as React from 'react';
import { connect } from 'react-redux';
import BaseComponent from '../../../../dist/lib/base-component';
import HTMLManager from '../../../../dist/lib/html-manager';

class Test1 extends BaseComponent<any, any> {
    async interceptor(req: _expressStatic.Request, res: _expressStatic.Response, next: _expressStatic.NextFunction): Promise<any> { 
        res.redirect('/');
        throw new Error('redirected');
    }
    setUpPage(manager: HTMLManager, datas: any[]) { }
    getInitDataActionImp(props: any) { }
    constructor(props: any) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        super.componentDidMount();
        console.log('root did mount');
    }
    render() {
        
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

const selector = () => ({});

export = connect(selector)(Test1);