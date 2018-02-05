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
 * Little helper to handle the parsing of the localStorage
 */
export const _StorageHelper = () => {

    /**
     * Same process to cache/retrieve some object into/from the localStorage
     */
    this.save = (key, value) => localStorage.setItem(key, JSON.stringify(value));
    
    this.get = (key) => JSON.parse(localStorage.getItem(key));
    
    this.remove = (key) => localStorage.removeItem(key);
}

export const DownloadStorageHelper = function () {
    const _storeHelper = new _StorageHelper(); 
    
    this.store = _storeHelper.get(KEY_STORE_DOWNS_NOTIF);
    
};