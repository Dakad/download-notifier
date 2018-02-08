/* global chrome */
/* global navigator */
/* global localStorage */

/**
 * @author https://github.com/dakad
 * @overview Background Script to handle the notifications 
 * @version 1.0.0
 * 
 */

// -------------------------------------------------------------------
//  Dependencies

// Packages
import ChromePromise from 'chrome-promise';


// Built-ins


// Mine
import { _i18n } from "../js/utils";
import { DownNotifStorageHelper } from './helpers/storage';
import { 
    SOUNDS,
    KEY_STORE_DOWNS_NOTIF, KEY_EXT_ID, 
    KEY_LABEL_FILE_NOT_FOUND,KEY_LABEL_DOWNLOAD_NOT_FOUND,
    KEY_SOUND_VOL, KEY_SOUND_SELECT_ID, KEY_SOUND_IS_PLAYED,
    PATH_ICON_NOTIF, PATH_ICON_FILE, PATH_ICON_FOLDER,
    KEY_LABEL_NOTIF_BTN_OPEN, KEY_LABEL_NOTIF_BTN_SHOW,KEY_LABEL_NOTIF_TITLE,
    
} from './consts';


// -------------------------------------------------------------------
//  Properties
const NOTIF_BTN_OPEN = 0;
const NOTIF_BTN_SHOW = 1;

// Chrome Promised
const _chromep = new ChromePromise();

// Helper for the storage of notification Ids
const _downNotifStore = new DownNotifStorageHelper();

const extId  = _i18n(KEY_EXT_ID);
const _prefix = 'chrome-extension://' + extId;

const _strFileNotFound = _i18n(KEY_LABEL_FILE_NOT_FOUND);
const _strIdNotFound    = _i18n(KEY_LABEL_DOWNLOAD_NOT_FOUND);
const _strNotifTitle   = _i18n(KEY_LABEL_NOTIF_TITLE);


/**
 * Play a sound when a downloaded done
 */
const _playSound = function () {
    chrome.storage.sync.get(
        [KEY_SOUND_VOL, KEY_SOUND_SELECT_ID, KEY_SOUND_IS_PLAYED],
        function({ BDVolOfSound = 0.8, BDSoundID, BDIsPlaySound }) {
            if (BDIsPlaySound) {
                const el = document.createElement('audio');

                el.src = SOUNDS[BDSoundID];
                el.autoplay = true;

                el.addEventListener('ended', ()=> el.parentNode.removeChild(el));
            }
        });
}


/**
 * Create the notification's body.
 *
 */
const _createNotification = async (downId,filename='') => {
    const notif = {
        type: 'basic',
        // title: _i18n('extName'),
        title : _strNotifTitle,
        message : filename.replace(/^.*[\\\/]/, ''),
        iconUrl: _prefix + PATH_ICON_NOTIF // Notification's icon 
    };
    
    // Set buttons' properties
    const openFileButton = {
        title: _i18n(KEY_LABEL_NOTIF_BTN_OPEN),
        iconUrl : _prefix + PATH_ICON_FILE // Icon for the button 'Open file'
    };
    
    const openFolderButton = {
        title: _i18n(KEY_LABEL_NOTIF_BTN_SHOW),
        iconUrl: _prefix + PATH_ICON_FOLDER // Icon for the button 'Show in Folder'
    };

    // Assign a matching title for the notif
    
    // Get the file name
    
    // Register action's buttons
    notif.buttons = [openFileButton, openFolderButton];
    
    const downFileIcon = await _chromep.downloads.getFileIcon(downId, { size: 32 });
    if(downFileIcon){
       notif.iconUrl = downFileIcon; 
    }
    
    return notif;
};


/**
 * Display a notification for a completed download
 * 
 * 
 *
 */
export async function showNotification({ state, id: downId }) {
    if (state && state.current === 'complete') {
        // Get the downloaded item
        const [item, ] = await _chromep.downloads.search({ id : downId });
        
        const notif = _createNotification(downId, item.filename);

        // if we already have a notification shown
        const items = await _chromep.notifications.getAll();
        let notifId = _downNotifStore.get(downId);

        // we just clear it, and create a new one
        if (notifId && items.hasOwnProperty(notifId)) {
            await _chromep.notifications.clear(notifId);
        }
        
        _playSound();

        notifId = await _chromep.notifications.create(null,notif);
        
        _downNotifStore.save(downId, notifId);
    }
}


/**
 * Open/Show a downloaded file.
 * 
 * @private
 * @async 
 *
 * @param {Integer} downId The downloaded item Id. 
 * @param {string} action The requested action. Can only be 'open'  or 'show'
 * @throws {Error} If one the parameter is missing.
 * @throws {TypeError} If the action is incorrect.
 * @throws {TypeError} If the downId is incorrect.
 */
const _openOrShowFileById = async function (downId, action) {
    if (!downId) {
        throw new Error('|°^_^°| -> Missing the download Id');
    }
    
    if (!action) {
        throw new Error('|°^_^°| -> Missing the action for the downloaded file');
    }
    
    if(!(action =='action' && action === 'show')){
        throw new Error('|°^_^°| -> Unknown action. Only \'open\' or \'show\'')
    }
    
    const actions = {
        // open downloaded file by id.
        'open': id => chrome.downloads.open(id),
        // show downloaded file by id.
        'show': id => chrome.downloads.show(id)
    };

    const [item,] = await _chromep.downloads.search({ id: downId });
    
    const notifId = _downNotifStore.get(downId);
    
    // If not already deleted, execute requested action
    if (item.exists) {
        actions[action].call(item.id);
    } else {
        // The downloaded item have been deleted
        chrome.notifications.clear(notifId, _ => {});
        _downNotifStore.remove(downId);
        alert(_strFileNotFound);
    }
}


/**
 * description
 * 
 * @async
 * @private
 * 
 * 
 * @throws {TypeError} If the downId is incorrect.
 */
export async function clearNotificationWhenExistChange({ downId, exists: downExists }) {
    if (downId && downExists && _downNotifStore.contains(downId) && !downExists) {
        const notifId = _downNotifStore.get(downId);

        const items = await chrome.notifications.getAll();

        if (items.hasOwnProperty(notifId)) {
            chrome.notifications.clear(notifId, _ => {});
            _downNotifStore.remove(downId);
        }
    }
}

/**
 * Handler for the action's button on notification. 
 * If the input notification Id is stored, then the requested action will be executed.
 * Otherwise, it means the download have been deleted then clear the notification and alert the user.
 * 
 * @param {string} notifId The notiffication Id.
 * @param {Numbber} btnType The button type. Can only be 0 or 1.
 * 
 */
export const handleClickonActionsButton = function handleActBtn (notifId, btnType) {
    const downId = _downNotifStore.getKey(notifId);
    const strIdNotFound = _i18n('nDownIdNotFound');

    if (downId) {
        if (btnType === NOTIF_BTN_OPEN) {
            _openOrShowFileById(downId, 'open');
        }

        if (btnType === NOTIF_BTN_SHOW) {
            _openOrShowFileById(downId, 'show');
        }
    } else {
        chrome.notifications.clear(notifId, _ => _);
        _downNotifStore.remove(downId);
        alert(_strFileNotFound);
    }
}


chrome.notifications.onButtonClicked.addListener(handleClickonActionsButton);
