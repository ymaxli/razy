/**
 * @fileOverview produce html content and manipulate specific tag
 * @isomorphic
 * @author Max
 */

import cloneDeep = require('lodash.clonedeep');
import remove = require('lodash.remove');
import findIndex = require('lodash.findindex');
import reduce = require('lodash.reduce');

export enum TAG_TYPE {
    SCRIPT, STYLE, META
};

interface KeyPair {
    key: string,
    value: string
}
export interface InsertValueScriptObj {
    src: string,
    content: string
}
export interface InsertValueStyleObj {
    href: string
}
export interface InsertValueMetaObj {
    [key: string]: string
}
export type InsertValueObj = InsertValueScriptObj | InsertValueStyleObj | InsertValueMetaObj;

export default class HTMLManager {
    private head: KeyPair[] = []
    private foot: KeyPair[] = []
    private CDNFailSafe: KeyPair[] = []
    public TAG_TYPE = TAG_TYPE
    constructor() {
        if(typeof window === 'undefined') {
            const {HEAD, FOOT, CDN_FAIL_SAFE} = require('./html-default');
            this.head =  this.convertObjToArray(HEAD);
            this.foot = this.convertObjToArray(FOOT);
            this.CDNFailSafe = this.convertObjToArray(CDN_FAIL_SAFE);
            this.prependTagBefore('entry', 'CDNFailSafe', {
                content: this.getCDNFailSafeSentence()
            }, TAG_TYPE.SCRIPT);
        }
    }
    addCDNFailSafe(globalVar: string, path: string) {
        this.CDNFailSafe.push({
            key: globalVar,
            value: path
        });

        this.removeTag('CDNFailSafe');
        this.prependTagBefore('entry', 'CDNFailSafe', {
            content: this.getCDNFailSafeSentence()
        }, TAG_TYPE.SCRIPT);
    }
    getHead() {
        let result = reduce(this.head, (sum: string, item: KeyPair) => {
            return sum + item.value;
        }, '');

        return result;
    }
    getFoot() {
        let result = reduce(this.foot, (sum: string, item: KeyPair) => {
            return sum + item.value;
        }, '');

        return result;
    }
    removeTag(key: string) {
        remove(this.head, (item: KeyPair) => {
            return item.key === key;
        });
        remove(this.foot, (item: KeyPair) => {
            return item.key === key;
        });
    }
    setTag(key: string, value: string) {
        let index = this.findIndex(key);

        let obj = this.head[index] || this.foot[index - this.head.length];
        if(obj !== undefined) {
            obj.value = value;
        }
    }
    getTag(key: string) {
        let index = this.findIndex(key);

        let obj = this.head[index] || this.foot[index - this.head.length];
        let result = obj !== undefined ? obj.value : undefined;
        return result;
    }
    injectGlobalVar(obj: any) {
        let index = this.findIndex('headTagOpen');
        let tag = '<script type="text/javascript">\n';
        for(let i in obj) {
            if(typeof obj[i] === 'string') {
                tag += `var ${i} = '${obj[i]}';\n`;
            } else {
                tag += `var ${i} = ${obj[i]};\n`;
            }
        }
        tag += '</script>';

        this.head.splice(index + 1, 0, {
            key: 'globalVar',
            value: tag
        });
    }
    appendTagAfter(key: string, tagKey: string, valueObj: InsertValueObj, tagType: TAG_TYPE) {
        let index = this.keyCheck(key, tagKey);
        let tag = this.generateTag(valueObj, tagType);

        if(index < this.head.length) {
            this.head.splice(index + 1, 0, {
                key: tagKey,
                value: tag
            });
        } else {
            this.foot.splice(index - this.head.length + 1, 0, {
                key: tagKey,
                value: tag
            });
        }
    }
    prependTagBefore(key: string, tagKey: string, valueObj: InsertValueObj, tagType: TAG_TYPE) {
        let index = this.keyCheck(key, tagKey);
        let tag = this.generateTag(valueObj, tagType);

        if(index < this.head.length) {
            this.head.splice(index, 0, {
                key: tagKey,
                value: tag
            });
        } else {
            this.foot.splice(index - this.head.length, 0, {
                key: tagKey,
                value: tag
            });
        }
    }
    private convertObjToArray = (objToConvert: {[key: string]: string}) => {
        let obj = cloneDeep(objToConvert);
        let result: Array<KeyPair>= [];
        for(let i in obj) {
            result.push({
                key: i,
                value: obj[i]
            });
        }
        return result;
    }
    private generateTag(valueObj: InsertValueObj, tagType: TAG_TYPE) {
        let tag: string;
        switch (tagType) {
            case TAG_TYPE.SCRIPT:
                 if((<InsertValueScriptObj>valueObj).src) {
                     tag = `<script type="text/javascript" src="${(<InsertValueScriptObj>valueObj).src}"></script>`;
                 } else {
                     tag = `<script type="text/javascript">${(<InsertValueScriptObj>valueObj).content}</script>`;
                 }
                 break;
            case TAG_TYPE.STYLE:
                 tag = `<link rel="stylesheet" href="${(<InsertValueStyleObj>valueObj).href}" >`;
                 break;
            case TAG_TYPE.META:
                 tag = '<meta ';
                 for(let i in valueObj) {
                     tag += `${i}="${(<InsertValueMetaObj>valueObj)[i]}" `;
                 }
                 tag += '>';
                 break;
            default:
                throw new Error('undefined TAG_TYPE');
        }

        return tag;
    }
    private keyCheck(key: string, tagKey: string) {
        let index = this.findIndex(key);
        let indexDuplicated = this.findIndex(tagKey);

        if(indexDuplicated !== -1) {
            throw new Error('cannot insert a duplicate key');
        }
        if(index === -1) {
            throw new Error('did not find an existing key');
        }

        return index;
    }
    private findIndex(key: string) {
        let allWrap = this.head.concat(this.foot);
        let index = findIndex(allWrap, (item: KeyPair) => {
            return item.key === key;
        });

        return index;
    }
    private getCDNFailSafeSentence() {
        let CDNFailSafeSentences = reduce(this.CDNFailSafe, (sum: string, item: KeyPair) => {
            return sum + `if(typeof ${item.key} === "undefined"){document.write(unescape(\'%3Cscript src=\"${item.value}\"%3E%3C/script%3E\'));}\n`;
        }, '');

        return CDNFailSafeSentences;
    }
}