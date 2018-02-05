/**
 * @author  https://github.com/dakad
 * @overview Test Unit for the utils.js modules
 */

// -------------------------------------------------------------------
//  Dependencies

// Packages
import chrome from 'sinon-chrome';
import { expect } from 'chai';


// Built-ins


// Mine
import { _i18n, _getOS } from '../../app/js/utils.js';
import locals from '../../app/_locales/en/messages.json'

// -------------------------------------------------------------------
//  Properties
// chai.use(require('sinon-chai'));


describe('Module :  utils.js', function() {

    beforeEach(() => global.chrome = chrome);

    afterEach(() => {
        chrome.flush();
        delete global.chrome
    });

    describe('_i18n', function() {
        it('should get i18n message with no args', function() {
            expect(chrome.i18n.getMessage.notCalled, 'i18n.getMessage(\'\') should not be called').to.be.ok;
            const msg = _i18n();
            expect(chrome.i18n.getMessage.calledOnce, 'i18n.getMessage(\'\') should be called').to.be.ok;
            expect(
                chrome.i18n.getMessage.withArgs('').calledOnce,
                'i18n.getMessage(\'\') should be called with specified args'
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
            const I18nPlugin = chrome.plugins.I18nPlugin;
            chrome.registerPlugin(new I18nPlugin(locals));

            expect(_i18n('')).to.be.eq('undefined');

            expect(_i18n('extName')).to.not.be.undefined.and.not.empty;

            // delete chrome.plugins['I18nPlugin'];

            chrome.flush();

        });

    });


    describe('_getOS', function() {
        before(() => global.navigator = {
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/64.0.3282.140"
        });

        it('should get UserAgent from navigator', function() {
            const os = _getOS();
            expect(os, 'OS should defined && not be empty').to.not.be.undefined.and.not.empty;
            expect(os, 'should be Win').to.be.eq('Win');
        });
    });


    after(() => delete global.chrome);
});