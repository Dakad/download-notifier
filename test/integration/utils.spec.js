/**
 * Test Unit the util modules.
 *
 */

// -------------------------------------------------------------------
//  Dependencies

// Packages
const chai = require('chai');


// Built-ins

// Mine
const Utils = require('../../app/js/utils');


// -------------------------------------------------------------------
//  Properties
const expect = chai.expect;


describe('Module :  Utils', function() {
    it('should be an object', function() {
        expect(Utils).to.be.a('object')
            .and.to.contains.all.keys(['_$', '_i18n', '_getOS']);
    });

    describe('_i18n', function() {
        it('should be a function', function() {
            expect(Utils._i18n).to.be.a('function')
        });
    });
});