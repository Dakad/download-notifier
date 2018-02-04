const assert = require('chai').assert;
const shared = require('../../dist/shared.bundle');

console.log({ shared });

describe('Package shared', function() {
    it('exports an object', function() {
        assert.isObject(shared);
    });

    shared._i18n = _ => _;

    describe('the exported obejct', function() {
        it('has a _i18n function', function() {
            assert.property(shared, '_i18n');
        });
    });
});