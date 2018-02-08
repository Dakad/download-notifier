/* global chrome */
/* global navigator */
/* global localStorage */

/**
 * @author https://github.com/dakad
 * @overview Background Script
 * @version 1.0.0
 * 
 */


/*====================================*/


// -------------------------------------------------------------------
//  Dependencies

// Packages


// Built-ins


// Mine
import  {KEY_STORE_DOWNS_NOTIF} from '../consts'

// -------------------------------------------------------------------
//  Properties





/**
 * Little helper to handle the parsing of the localStorage.
 * Same process to cache/retrieve some object into/from the localStorage
 */
const _StorageHelper = function () {

    this.save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
    
    this.get = (key) => JSON.parse(localStorage.getItem(key));
    
    this.remove = (key) => localStorage.removeItem(key);
};



/**
 * Helper to handle the storage of the notification 
 * of downloaded file.
 *
 */
export function DownNotifStorageHelper() {
    
    const _storeHelper = new _StorageHelper(); 
    
    /**
     * The store save in the storage containing all download IDs -> notif Ids.
     */
    this._store = _storeHelper.get(KEY_STORE_DOWNS_NOTIF) || {};
    
    /**
     * Check if the input ID is an Integer
     * @param {Number|string} downId The download Id.
     * @throws TypeError if not an Integer.
     */
    const checkDownloadId = (downId) => {
        const id = Number.parseInt(downId, 10);
        if(Number.isNaN(id)) {
            throw new TypeError('Incorrect argument for the id : Only integer');
        }
        return id;
    }
    
    /**
     * Save the download Id into storage.
     * 
     * @param {Number|string} downId The download Id.
     * @param {Number|string} notifId The notification Id.
     * @return {boolean} true if done otherwise false if already stored.
     * @throws {TypeError} if the Id is not an number.
     */
    this.save = (downId, notifId) => {
        downId = checkDownloadId(downId);
        if(!this._store.hasOwnProperty(downId)) {
            this._store[downId] = notifId;
        // console.log(this._store);
            _storeHelper.save(KEY_STORE_DOWNS_NOTIF,this._store);
            return true;
        }
        return false;
    };

    /**
     * Check if already saved this id.
     * 
     * @param {Number|string} downId The download Id.
     * @return {boolean} true if done otherwise false if not saved.
     * @throws {TypeError} if the Id is not an number.
     */
    this.contains = (downId) => {
        downId = checkDownloadId(downId);
        return this._store.hasOwnProperty(downId);
    };
    
    /**
     * Retrieve wint the input Id the corresponding notifications Id.
     * 
     * @param {Number|string} downId The download Id.
     * @return {string} the notification Id or null if not found.
     * @throws {TypeError} if the Id is not an number.
     */
    this.get = (downId) => this.contains(downId) ? this._store[downId] : null;
    
    
    
    /**
     * Remove the download Id from storage.
     * 
     * @param {Number|string} downId The download Id.
     * @return {boolean} true if done otherwise false if the Id is not saved.
     * @throws {TypeError} if the Id is not an number.
     */
    this.remove = downId => {
        downId = checkDownloadId(downId);
        
        if(this._store.hasOwnProperty(downId)){
            delete this._store[downId];
            _storeHelper.save(KEY_STORE_DOWNS_NOTIF,this._store);
            return true;
        }
        return false;
    };
    
    /**
     * Clear the storage containing all download IDs.
     */
    this.clear = () => {
      Object.keys(this._store).forEach(k => delete this._store[k]);
      _storeHelper.save(KEY_STORE_DOWNS_NOTIF,this._store);
    };
    
};