/**
 * @author  https://github.com/dakad
 * @overview Test Unit for the storageHelper.js module
 */

// -------------------------------------------------------------------
//  Dependencies

// Packages
import { expect } from 'chai';
import sinon,{ spy, stub } from 'sinon';

// Built-ins


// Mine
import * as mockLocalStorage from '../mock/localStorage.mock';
import { KEY_STORE_DOWNS_NOTIF } from '../../app/js/consts';
import { _StorageHelper, DownloadStorageHelper } from '../../app/js/helpers/storage.js';


// -------------------------------------------------------------------
//  Properties
// chai.use(require('sinon-chai'));


// 


describe('Module :  helper/storage.js', function() {

    before(() => {
        global.localStorage = mockLocalStorage;
    });


    describe.skip('_StorageHelper', function() {
        let nStoreHelp;

        before(() => nStoreHelp = new _StorageHelper());

        afterEach(() => {
            global.localStorage.clear();
        });

        it('should not be empty', () => {
            expect(_StorageHelper).to.be.a('function');
            expect(nStoreHelp).to.have.all.keys(['save', 'get', 'remove']);
        });

        it('should store the data', () => {
            expect(nStoreHelp.save, 'is not a function').to.be.a('function');
            const savedKeys = [];

            [
                ['a', null],
                ['b', ''],
                ['c', 'mocky'],
                ['d', [1, 2, 3, 4]],
                ['k', { 'a': 1, 'b': [1, 2, 2, 3] }]
            ].forEach((item) => {
                const [key, val] = item;
                nStoreHelp.save(key, val);

                expect(
                    global.localStorage.store,
                    'Not value stored with key: ' + key
                ).to.have.property(key);

                savedKeys.push(key);
                expect(
                        global.localStorage.store,
                        'Not keeping all saved data')
                    .to.have.all.keys(savedKeys);

                expect(global.localStorage.store[key], 'Not matching value').to.be.eq(JSON.stringify(val))
            });

        });

        it('should retrieve the stored data', () => {
            expect(nStoreHelp.get).to.be.a('function');
            [
                ['b', ''],
                ['c', 'mocky'],
                ['d', [1, 2, 3, 4]],
                ['k', { 'a': 1, 'b': [1, 2, 2, 3] }]
            ].forEach((item) => {
                const [key, val] = item;
                const msg = 'Not matching value stored with key: ' + key;

                nStoreHelp.save(key, val);

                expect(nStoreHelp.get(key), 'Not value stored with key: ' + key).to.not.be.null

                if (typeof val === 'string') {
                    expect(nStoreHelp.get(key), msg).to.be.equal(val);
                } else {
                    if (Array.isArray(val)) {
                        expect(nStoreHelp.get(key), msg).to.have.members(val);
                    } else {
                        expect(nStoreHelp.get(key), msg).to.eql(val);
                    }
                }

            });
        });

        it('should remove the saved data', () => {
            expect(nStoreHelp.remove).to.be.a('function');
            [
                ['c', 'mocky'],
                ['d', [1, 2, 3, 4]],
                ['k', { 'a': 1, 'b': [1, 2, 2, 3] }]
            ].forEach((item) => {
                const [key, val] = item;
                nStoreHelp.save(key, val);
                nStoreHelp.remove(key);
                expect(nStoreHelp.get(key), 'Value still stored for key: ' + key).to.be.null;
            });
        });


    }); // _StorageHelper


    describe.skip('DownloadStorageHelper', function() {
        let downNotifStoreHelp;
        const spyStoreHelper = spy(_StorageHelper);
        
        before(() => {
            downNotifStoreHelp = new DownloadStorageHelper();
            // mockLocalStorage.setItem(KEY_STORE_DOWNS_NOTIF, [])
        });

        afterEach(() => {
            global.localStorage.clear();
        });

        it('should not be empty', () => {
            expect(DownloadStorageHelper).to.be.a('function');
            expect(spyStoreHelper.called).to.be.true;
            
            expect(downNotifStoreHelp.store).to.not.null;
            expect(downNotifStoreHelp).to.have.all.keys(['save', 'get', 'remove'])
        });

    //     it('should save the data', () => {
    //         expect(downNotifStoreHelp.save).to.be.a('function');
    //         const wrongIds = [null, { 'a': 1, 'b': [1, 2, 2, 3] }, Error('test')];
    //         wrongIds.forEach((id) => {
    //             expect(downNotifStoreHelp.save(id)).to.throws();
    //         })[
    //             ['a', '1234567890ß', '', 'c', 'mocky', 'd', 'k']
    //         ].forEach((item) => {
    //             const [key, val] = item;
    //             downNotifStoreHelp.save(key, val);

    //             expect(global.localStorage, 'Not value stored with key: ' + key).to.contains(key);

    //             expect(global.localStorage[key], 'Not matching value').to.be.eq(JSON.stringify(val))
    //         });

    //     });


    //     it('should get the saved data', () => {
    //         expect(downNotifStoreHelp.get).to.be.a('function');
    //         [
    //             ['a', null],
    //             ['b', ''],
    //             ['c', 'mocky'],
    //             ['d', [1, 2, 3, 4]],
    //             ['k', { 'a': 1, 'b': [1, 2, 2, 3] }]
    //         ].forEach((item) => {
    //             const [key, val] = item;
    //             downNotifStoreHelp.save(key, val);
    //             expect(downNotifStoreHelp.get(key), 'Not value stored with key: ' + key).to.not.be.null
    //                 .and.to.be.eq(val)
    //         });
    //     });


    //     it('should remove the saved data', () => {
    //         expect(downNotifStoreHelp.remove).to.be.a('function');
    //         [
    //             ['c', 'mocky'],
    //             ['d', [1, 2, 3, 4]],
    //             ['k', { 'a': 1, 'b': [1, 2, 2, 3] }]
    //         ].forEach((item) => {
    //             const [key, val] = item;
    //             downNotifStoreHelp.save(key, val);
    //             downNotifStoreHelp.remove(key);
    //             expect(global.localStorage[key], 'Value still stored for key: ' + key).to.be.null;
    //         });
    //     });




    }); // DownloadStorageHelper


});
