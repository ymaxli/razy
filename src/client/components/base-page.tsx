/**
 * @fileOverview base class for page component
 * @author Max
 */

import * as _expressStatic from 'express-serve-static-core';
import * as React from 'react';
import * as Immutable from 'immutable';
import * as express from 'express';
import HTMLManager from '../../server/bootstrap/html-manager';
const htmlManager = new HTMLManager();
import { DeviceVars } from '../../server/utils/device-detect';
import { Store } from 'redux';
import getClassName from '../../utils/get-classname';

export interface BasePropTypes {
    dispatch: Function,
    params: any,
    location: {
        search: string,
        pathname: string,
        [key: string]: string
    },
    initedFlag: {
        [key: string]: boolean
    },
    devTools: any
}

export interface BaseStateTypes {
    client?: boolean,
    bodyHeight?: number
}

abstract class BaseComponent<P, S> extends React.Component<P & BasePropTypes & DeviceVars, S & BaseStateTypes> {
    constructor(props: any) {
        super(props);
    }
    /**
     * interceptor for server side control
     * server side only
     */
    abstract async interceptor(req: _expressStatic.Request, res: _expressStatic.Response, next: _expressStatic.NextFunction): Promise<any>
    /**
     * implement page initialization stuff,
     * server side only
     */
    abstract setUpPage(manager: HTMLManager, datas?: any[]): any
    /**
     * implement initializing page data,
     * isomorphic method
     */
    abstract getInitDataActionImp(props: any): void | any[]
    getInitDataAction(props: any): any[] {
        let actions = this.getInitDataActionImp(props);
        if (isAnyArray(actions)) return actions;
        return null;
    }
    componentDidMount() {
        this.setState({
            client: true,
            bodyHeight: window.innerHeight
        });

        const { dispatch } = this.props;
        let actions;
        if (!this.props.initedFlag[getClassName(this)]) actions = this.getInitDataAction(this.props);
        if (actions) {
            Promise.all(actions.map(item => dispatch(item)))
                .catch(err => console.error(err));
        }
    }
}

function isAnyArray(array: void | any[]): array is any[] {
    return array !== undefined;
}

export default BaseComponent;