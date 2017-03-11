/**
 * @fileOverview base class for page component
 * @author Max
 */

import * as React from 'react';
import * as Immutable from 'immutable';
import * as express from 'express';
import HTMLManager from '../../server/bootstrap/html-manager';
const htmlManager = new HTMLManager();
import {DeviceVars} from '../../server/utils/device-detect';

export interface BasePropTypes {
    dispatch: Function,
    params: any,
    location: {
        search: string
    }
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
     * implement page initialization stuff,
     * isomorphic method
     */
    abstract setUpPage(manager: HTMLManager): any
    /**
     * implement initializing page data,
     * isomorphic method
     */
    abstract getInitDataActionImp(props: any): any
    getInitDataAction(props: any, force = false) {
        if(force || !props.dataInited) {
            return this.getInitDataActionImp(props);
        }
        return null;
    }
    componentDidMount() {
        this.setUpPage(htmlManager);
        const {dispatch} = this.props;
        let action = this.getInitDataAction(this.props);
        if(action !== null) {
            dispatch(action);
        }
        this.setState({
            client: true,
            bodyHeight: window.innerHeight
        });
    }
}

export default BaseComponent;