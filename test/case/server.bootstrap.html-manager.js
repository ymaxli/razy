/**
 * @fileOverview bootstrap.html-manager test suite
 * @author Max
 **/

const assert = require('assert');
const HTMLManager = require('../../dist/server/bootstrap/html-manager').default;

describe('server.bootstrap.html-manager', function() {
    it('convert obj to array', function() {
        let a = new HTMLManager();
        assert(a.head instanceof Array);
        assert(a.foot instanceof Array);
    });

    it('remove head tag', function() {
        let a = new HTMLManager();
        assert(a.getHead().indexOf('charset') !== -1);
        a.removeTag('charset');
        assert(a.getHead().indexOf('charset') === -1);
    });

    it('remove foot tag' , function() {
        let a = new HTMLManager();
        assert(a.getFoot().indexOf('</body>') !== -1);
        a.removeTag('bodyTagClose');
        assert(a.getFoot().indexOf('</body>') === -1);
    });

    it('remove tag not exist', function() {
        let a = new HTMLManager();
        let oriOutput = a.getHead() + a.getFoot();
        a.removeTag('not a tag');
        let newOutput = a.getHead() + a.getFoot();
        assert(oriOutput === newOutput);
    });

    it('set head tag', function() {
        let a = new HTMLManager();
        assert(a.getHead().indexOf('<meta charset="utf-8" >') !== -1);
        a.setTag('charset', '<meta charset="abc" >');
        assert(a.getHead().indexOf('<meta charset="abc" >') !== -1);
    });

    it('set foot tag', function() {
        let a = new HTMLManager();
        assert(a.getFoot().indexOf('</body>') !== -1);
        a.setTag('bodyTagClose', '</badbody>');
        assert(a.getFoot().indexOf('</badbody>') !== -1);
    });

    it('set tag not exist', function() {
        let a = new HTMLManager();
        let oriOutput = a.getHead() + a.getFoot();
        a.setTag('not a tag', 'abc');
        let newOutput = a.getHead() + a.getFoot();
        assert(oriOutput === newOutput);
    });

    it('get head tag', function() {
        let a = new HTMLManager();
        assert(a.getTag('charset') === '<meta charset="utf-8" >');
    });

    it('get foot tag', function() {
        let a = new HTMLManager();
        assert(a.getTag('bodyTagClose') === '</body>');
    });

    it('get tag not exist', function() {
        let a = new HTMLManager();
        assert(a.getTag('not a tag') === undefined);
    });

    it('append script tag', function() {
        let a = new HTMLManager();
        a.appendTagAfter('entry', 'newTag', {src:'123'}, a.TAG_TYPE.SCRIPT);
        assert(a.getFoot().indexOf('<script type="text/javascript" src="123"></script>') !== -1);
    });

    it('append link tag', function() {
        let a = new HTMLManager();
        a.appendTagAfter('formatDetection', 'newTag', {href:'345'}, a.TAG_TYPE.STYLE);
        assert(a.getHead().indexOf('<link rel="stylesheet" href="345" >') !== -1);
    });

    it('append meta tag', function() {
        let a = new HTMLManager();
        a.appendTagAfter('formatDetection', 'newTag', {a:'345', b:'hahah', c:'kuku'}, a.TAG_TYPE.META);
        assert(a.getHead().indexOf('<meta a="345" b="hahah" c="kuku" >') !== -1);
    });

    it('append duplicated tag key', function() {
        let a = new HTMLManager();
        let fn = function() {
            a.appendTagAfter('entry', 'entry', {src:'123'}, a.TAG_TYPE.SCRIPT);
        };
        assert.throws(fn, /cannot insert a duplicate key/);
    });

    it('append undefined tag key', function() {
        let a = new HTMLManager();
        let fn = function() {
            a.appendTagAfter('nobody', 'hh', {src:'123'}, a.TAG_TYPE.SCRIPT);
        };
        assert.throws(fn, /did not find an existing key/);
    });

    it('append undefined tag type', function() {
        let a = new HTMLManager();
        let fn = function() {
            a.appendTagAfter('formatDetection', 'hh', {src:'123'}, 'nobody');
        };
        assert.throws(fn, /undefined TAG_TYPE/);
    });

    it('inject global var', function() {
        let a = new HTMLManager();
        a.injectGlobalVar({
            __PUBLIC__: 123,
            __BASE__: '333',
            __HAHA__: false
        });

        assert(a.getHead().indexOf('var __PUBLIC__ = 123;') !== -1);
        assert(a.getHead().indexOf('var __BASE__ = \'333\';') !== -1);
        assert(a.getHead().indexOf('var __HAHA__ = false;') !== -1);
    });

    it('prepend script tag', function() {
        let a = new HTMLManager();
        a.prependTagBefore('entry', 'newTag', {src:'123'}, a.TAG_TYPE.SCRIPT);
        assert(a.getFoot().indexOf('<script type="text/javascript" src="123"></script><script type="text/javascript" src="/dist/js/page/entry.js"></script>') !== -1);
    });

    it('prepend script tag without src', function() {
        let a = new HTMLManager();
        a.prependTagBefore('formatDetection', 'newTag', {content:'123'}, a.TAG_TYPE.SCRIPT);
        assert(a.getHead().indexOf('<script type="text/javascript">123</script><meta name="format-detection" content="telephone=no" >') !== -1);
    });

    it('cdn fail safe', function() {
        let a = new HTMLManager();
        assert(a.getFoot().indexOf('if(typeof React === "undefined"){document.write(unescape(\'%3Cscript src="/dist/lib/react-with-addons-15.4.1.min.js"%3E%3C/script%3E\'));}\nif(typeof ReactDOM === "undefined"){document.write(unescape(\'%3Cscript src="/dist/lib/react-dom-15.4.1.min.js"%3E%3C/script%3E\'));}\nif(typeof Immutable === "undefined"){document.write(unescape(\'%3Cscript src="/dist/lib/immutable-3.8.1.min.js"%3E%3C/script%3E\'));}\n') !== -1);
    });

    it('add cdn fail safe', function() {
        let a = new HTMLManager();
        a.addCDNFailSafe('test', 'abcdefg');
        assert(a.getFoot().indexOf('if(typeof test === "undefined"){document.write(unescape(\'%3Cscript src="abcdefg"%3E%3C/script%3E\'));}\n') !== -1);
    });

    it('expose TAG_TYPE', function() {
        let a = new HTMLManager();

        assert(a.TAG_TYPE.SCRIPT === 0);
        assert(a.TAG_TYPE.STYLE === 1);
        assert(a.TAG_TYPE.META === 2);
    });
    it('client side compatibility', function() {
        global.window = {};
        let a = new HTMLManager();

        try {
            a.addCDNFailSafe();
            a.getHead();
            a.getFoot();
            a.removeTag();
            a.setTag();
            a.getTag();
            a.injectGlobalVar();
            a.appendTagAfter();
            a.prependTagBefore();
        } catch(e) {
            assert(false, 'failed');
        }
    });
});

    
