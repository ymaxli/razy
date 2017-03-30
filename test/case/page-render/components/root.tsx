/**
 * @fileOverview Root组件
 * @author Max
 **/

import * as _expressStatic from 'express-serve-static-core';
import * as React from 'react';
import { connect } from 'react-redux';
import { BaseComponent, HTMLManager } from '../../../../dist/lib';

class Root extends BaseComponent<any, any> {
    async interceptor(req: _expressStatic.Request, res: _expressStatic.Response, next: _expressStatic.NextFunction): Promise<any> { }
    setUpPage(manager: HTMLManager, datas: any[]) {
        manager.setTag('title', datas[0].payload.title + datas[1].payload.test);
    }
    getInitDataActionImp(props: any) { 
        return [
            {
                type: 'action',
                payload: new Promise((resolve, reject) => {
                    resolve({
                        title: 'test123'
                    })
                })
            },
            {
                type: 'action',
                payload: new Promise((resolve, reject) => {
                    resolve({
                        test: 'test1234'
                    })
                })
            }
        ]
    }
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

export = connect(selector)(Root);