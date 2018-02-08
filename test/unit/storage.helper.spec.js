/**
 * @author  https://github.com/dakad
 * @overview Test Unit for the storageHelper.js module
 */

// -------------------------------------------------------------------
//  Dependencies

// Packages
import { expect } from 'chai';
// import sinon,{ spy, stub } from 'sinon';

// Built-ins


// Mine
import * as mockLocalStorage from '../mock/localStorage.mock';
import { KEY_STORE_DOWNS_NOTIF } from '../../app/js/consts';
import { _StorageHelper, DownNotifStorageHelper } from '../../app/js/helpers/storage.js';


// -------------------------------------------------------------------
//  Properties
// chai.use(require('sinon-chai'));


// 


describe('Module : helper/storage.js', function() {

    before(() => {
        global.localStorage = mockLocalStorage;
    });

    // BEFORE, MUST export THIS FUNCTION ON storage.js
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


    describe('DownNotifStorageHelper', function() {
        let downNotifStoreHelp;

        before(() => {
            downNotifStoreHelp = new DownNotifStorageHelper();
        });

        afterEach(() => {
            global.localStorage.clear();
            downNotifStoreHelp._store = {};
        });

        it('should not be empty', () => {
            expect(DownNotifStorageHelper).to.be.a('function');
            // expect(spyStoreHelper.called, 'must have an instance of StorageHelper').to.be.true;
            
            expect(downNotifStoreHelp).to.have.all.keys(['_store','save', 'contains', 'get','remove', 'clear'])
        });

        it('should save the id', () => {
            expect(downNotifStoreHelp.save).to.be.a('function');
            const wrongIds = [null,'','a','mocky', { 'a': 1, 'b': [1, 2, 2, 3] }, Error('test')];
            wrongIds.forEach((id) => {
                expect(_ => downNotifStoreHelp.save(id,'mocky'))
                    .to.throws(TypeError);
            });

            [
                ['12367890','6108bd1c-332f-5583-bd46'],
                [123, 'guhnercis-jute-wa'],
                ['2976','78fbfedcd8f0'],
                [55,'Jaagu ujo hop. * 1f67e957'],
            ].forEach(([downId,notifId]) => {
                const saved = downNotifStoreHelp.save(downId, notifId);
                expect(saved, 'Not finished process').to.be.true;
            });

            expect(downNotifStoreHelp.save('123', 'mocky')).to.be.false;
        });

        it('should get the id', () => {
            expect(downNotifStoreHelp.get).to.be.a('function');
            const wrongIds = [null,'','a','mocky', { 'a': 1, 'b': [1, 2, 2, 3] }, Error('test')];
            wrongIds.forEach((id) => {
                expect(_ => downNotifStoreHelp.get(id)).to.throws(TypeError);
            });
            
            // Save before some fake ids
            const datas = [
                ['12367890','6108bd1c-332f-5583-bd46'],
                [123, 'guhnercis-jute-wa'],
                ['2976','78fbfedcd8f0'],
                [82976,'78fbfedcd8f0'],
                [55,'Jaagu ujo hop. * 1f67e957'],
            ];
            
            datas.forEach(ids=>downNotifStoreHelp.save(...ids));

            datas.forEach(([downId,notifId]) => {
                expect(notifId).to.be.equal(downNotifStoreHelp.get(downId));
            });

        });

        it('should contains the id', () => {
            expect(downNotifStoreHelp.contains).to.be.a('function');
            const wrongIds = [null,'','a','mocky', { 'a': 1, 'b': [1, 2, 2, 3] }, Error('test')];
            wrongIds.forEach((id) => {
                expect(_ => downNotifStoreHelp.contains(id)).to.throws(TypeError);
            });
            
            // Save before some fake ids
            [
                ['12367890','6108bd1c-332f-5583-bd46'],
                [123, 'guhnercis-jute-wa'],
                ['2976','78fbfedcd8f0'],
                [82976,'78fbfedcd8f0'],
                [55,'Jaagu ujo hop. * 1f67e957'],
            ].forEach(ids=>downNotifStoreHelp.save(...ids));

            [
                ['12367890',true],
                [1203,false],
                ['82976', true],
                [100, false],
                [55,true]
            ].forEach(([id,isIn]) => {
                expect(isIn,id).to.be.equal(downNotifStoreHelp.contains(id));
            });

        });

        it('should remove the id', () => {
            expect(downNotifStoreHelp.remove).to.be.a('function');
            const wrongIds = [null,'','a','mocky', { 'a': 1, 'b': [1, 2, 2, 3] }, Error('test')];
            wrongIds.forEach((id) => {
                expect(_ => downNotifStoreHelp.remove(id)).to.throws(TypeError);
            });
            
            // Save before some fake ids
            [
                ['12367890','6108bd1c-332f-5583-bd46'],
                [123, 'guhnercis-jute-wa'],
                ['2976','78fbfedcd8f0'],
                [82976,'78fbfedcd8f0'],
                [55,'Jaagu ujo hop. * 1f67e957'],
            ].forEach(ids=>downNotifStoreHelp.save(...ids));
            
            [
                ['12367890',true],
                [123,false],
                ['2976', false],
                [55,true]
            ].forEach(([id,isIn]) => {
                let msg = `Id : ${id} removed`;
                
                if(!isIn){
                    msg = `Id : ${id} not removed`;
                    downNotifStoreHelp.remove(id);
                }
                
                expect(isIn,msg).to.be.equal(downNotifStoreHelp.contains(id));
            });

        });
    
        it('should clear all IDs', () => {
           expect(downNotifStoreHelp.clear).to.be.a('function');
           
            // Save before some fake ids
            [
                ['12367890','6108bd1c-332f-5583-bd46'],
                [123, 'guhnercis-jute-wa'],
                ['2976','78fbfedcd8f0'],
                [82976,'78fbfedcd8f0'],
                [55,'Jaagu ujo hop. * 1f67e957'],
            ].forEach(ids=>downNotifStoreHelp.save(...ids));
            
           downNotifStoreHelp.clear();
           
           expect(downNotifStoreHelp._store).to.be.empty;
            
        });

    }); // DownNotifStorageHelper


});
