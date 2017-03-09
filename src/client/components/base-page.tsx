/**
 * @fileOverview base class for page component
 * @author Max
 */

import * as React from 'react';
import * as Immutable from 'immutable';
import * as express from 'express';
import HTMLManager from '../../server/bootstrap/html-manager';
const htmlManager = new HTMLManager();

export interface BasePropTypes{
    dispatch?: Function,
    params?: any,
    location?: {
        search: string
    }
}

abstract class BaseComponent<P extends BasePropTypes, S> extends React.Component<P, S> {
    constructor(props: P) {
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
    }
}

export default BaseComponent;