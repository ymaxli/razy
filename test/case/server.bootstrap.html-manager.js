/**
 * @fileOverview bootstrap.html-manager test suite
 * @author Max
 **/

let expect = require('expect.js');
let HTMLManager = require('../../dist/server/bootstrap/html-manager').default;

describe('server.bootstrap.html-manager', function() {
    it('convert obj to array', function() {
        let a = new HTMLManager();
        expect(a.head).to.be.an('array');
        expect(a.foot).to.be.an('array');
    });

    it('remove head tag', function() {
        let a = new HTMLManager();
        expect(a.getHead()).to.contain('charset');
        a.removeTag('charset');
        expect(a.getHead()).not.to.contain('charset');
    });

    it('remove foot tag' , function() {
        let a = new HTMLManager();
        expect(a.getFoot()).to.contain('</body>');
        a.removeTag('bodyTagClose');
        expect(a.getFoot()).not.to.contain('</body>');
    });

    it('remove tag not exist', function() {
        let a = new HTMLManager();
        let oriOutput = a.getHead() + a.getFoot();
        a.removeTag('not a tag');
        let newOutput = a.getHead() + a.getFoot();
        expect(oriOutput).to.be(newOutput);
    });

    it('set head tag', function() {
        let a = new HTMLManager();
        expect(a.getHead()).to.contain('<meta charset="utf-8" >');
        a.setTag('charset', '<meta charset="abc" >');
        expect(a.getHead()).to.contain('<meta charset="abc" >');
    });

    it('set foot tag', function() {
        let a = new HTMLManager();
        expect(a.getFoot()).to.contain('</body>');
        a.setTag('bodyTagClose', '</badbody>');
        expect(a.getFoot()).to.contain('</badbody>');
    });

    it('set tag not exist', function() {
        let a = new HTMLManager();
        let oriOutput = a.getHead() + a.getFoot();
        a.setTag('not a tag', 'abc');
        let newOutput = a.getHead() + a.getFoot();
        expect(oriOutput).to.be(newOutput);
    });

    it('get head tag', function() {
        let a = new HTMLManager();
        expect(a.getTag('charset')).to.be('<meta charset="utf-8" >');
    });

    it('get foot tag', function() {
        let a = new HTMLManager();
        expect(a.getTag('bodyTagClose')).to.be('</body>');
    });

    it('get tag not exist', function() {
        let a = new HTMLManager();
        expect(a.getTag('not a tag')).to.be(undefined);
    });

    it('append script tag', function() {
        let a = new HTMLManager();
        a.appendTagAfter('entry', 'newTag', {src:'123'}, a.TAG_TYPE.SCRIPT);
        expect(a.getFoot()).to.contain('<script type="text/javascript" src="123"></script>');
    });

    it('append link tag', function() {
        let a = new HTMLManager();
        a.appendTagAfter('formatDetection', 'newTag', {href:'345'}, a.TAG_TYPE.STYLE);
        expect(a.getHead()).to.contain('<link rel="stylesheet" href="345" >');
    });

    it('append meta tag', function() {
        let a = new HTMLManager();
        a.appendTagAfter('formatDetection', 'newTag', {a:'345', b:'hahah', c:'kuku'}, a.TAG_TYPE.META);
        expect(a.getHead()).to.contain('<meta a="345" b="hahah" c="kuku" >');
    });

    it('append duplicated tag key', function() {
        let a = new HTMLManager();
        let fn = function() {
            a.appendTagAfter('entry', 'entry', {src:'123'}, a.TAG_TYPE.SCRIPT);
        };
        expect(fn).to.throwException(/cannot insert a duplicate key/);
    });

    it('append undefined tag key', function() {
        let a = new HTMLManager();
        let fn = function() {
            a.appendTagAfter('nobody', 'hh', {src:'123'}, a.TAG_TYPE.SCRIPT);
        };
        expect(fn).to.throwException(/did not find an existing key/);
    });

    it('append undefined tag type', function() {
        let a = new HTMLManager();
        let fn = function() {
            a.appendTagAfter('formatDetection', 'hh', {src:'123'}, 'nobody');
        };
        expect(fn).to.throwException(/undefined TAG_TYPE/);
    });

    it('inject global var', function() {
        let a = new HTMLManager();
        a.injectGlobalVar({
            __PUBLIC__: 123,
            __BASE__: '333',
            __HAHA__: false
        });

        expect(a.getHead()).to.contain('var __PUBLIC__ = 123;');
        expect(a.getHead()).to.contain('var __BASE__ = \'333\';');
        expect(a.getHead()).to.contain('var __HAHA__ = false;');
    });

    it('prepend script tag', function() {
        let a = new HTMLManager();
        a.prependTagBefore('entry', 'newTag', {src:'123'}, a.TAG_TYPE.SCRIPT);
        expect(a.getFoot()).to.contain('<script type="text/javascript" src="123"></script><script type="text/javascript" src="/dist/js/page/entry.js"></script>');
    });

    it('prepend script tag without src', function() {
        let a = new HTMLManager();
        a.prependTagBefore('formatDetection', 'newTag', {content:'123'}, a.TAG_TYPE.SCRIPT);
        expect(a.getHead()).to.contain('<script type="text/javascript">123</script><meta name="format-detection" content="telephone=no" >');
    });

    it('cdn fail safe', function() {
        let a = new HTMLManager();
        expect(a.getFoot()).to.contain('if(typeof React === "undefined"){document.write(unescape(\'%3Cscript src="/dist/lib/react-with-addons-15.4.1.min.js"%3E%3C/script%3E\'));}\nif(typeof ReactDOM === "undefined"){document.write(unescape(\'%3Cscript src="/dist/lib/react-dom-15.4.1.min.js"%3E%3C/script%3E\'));}\nif(typeof Immutable === "undefined"){document.write(unescape(\'%3Cscript src="/dist/lib/immutable-3.8.1.min.js"%3E%3C/script%3E\'));}\n');
    });

    it('add cdn fail safe', function() {
        let a = new HTMLManager();
        a.addCDNFailSafe('test', 'abcdefg');
        expect(a.getFoot()).to.contain('if(typeof test === "undefined"){document.write(unescape(\'%3Cscript src="abcdefg"%3E%3C/script%3E\'));}\n');
    });

    it('expose TAG_TYPE', function() {
        let a = new HTMLManager();

        expect(a.TAG_TYPE.SCRIPT).to.be(0);
        expect(a.TAG_TYPE.STYLE).to.be(1);
        expect(a.TAG_TYPE.META).to.be(2);
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
            expect().fail();
        }
    });
});

    
