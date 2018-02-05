/**
 * @author  https://github.com/dakad
 * @overview Test Unit for the utils.js modules
 */

// -------------------------------------------------------------------
//  Dependencies

// Packages
import chrome from 'sinon-chrome';
import chai, { expect } from 'chai';


// Built-ins


// Mine
import { _i18n, _getOS } from '../../app/js/utils.js';

// -------------------------------------------------------------------
//  Properties
// chai.use(require('sinon-chai'));


describe('Module :  utils.js', function() {

    before(() => global.chrome = chrome);

    afterEach(() => {
        chrome.flush();
    });


    it('should get i18n message with no args', function() {
        expect(chrome.i18n.getMessage.notCalled, 'i18n.getMessage should not be called').to.be.ok;
        const msg = _i18n();
        expect(chrome.i18n.getMessage.calledOnce, 'i18n.getMessage should be called').to.be.ok;
        expect(
            chrome.i18n.getMessage.withArgs('').calledOnce,
            'i18n.getMessage should be called with specified args'
        ).to.be.ok;
    });

    it('should get i18n message with args', function() {
        expect(chrome.i18n.getMessage.notCalled, 'i18n.getMessage should not be called').to.be.ok;
        const key = 'extName';
        _i18n(key);
        expect(chrome.i18n.getMessage.calledOnce, 'i18n.getMessage should be called').to.be.ok;
        expect(
            chrome.i18n.getMessage.withArgs(key).called,
            'i18n.getMessage should be called with specified args'
        ).to.be.ok;
    });


    it('should return data', () => {
        // var I18nPlugin = chrome.plugins.I18nPlugin;

        // chrome.registerPlugin(new I18nPlugin());

    });





    after(() => delete global.chrome);
});