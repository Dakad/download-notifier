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
import { _i18n, _getOS } from "../js/utils";
import { DownloadStorageHelper } from './helpers/storage';
import { 
    SOUNDS,
    KEY_STORE_DOWNS_NOTIF,
    KEY_SOUND_VOL, KEY_SOUND_SELECT_ID, KEY_SOUND_IS_PLAYED,
    PATH_ICON_NOTIF, PATH_ICON_FILE, PATH_ICON_FOLDER,
    KEY_LABEL_NOTIF_BTN_OPEN, KEY_LABEL_NOTIF_BTN_SHOW,
} from './consts';


// -------------------------------------------------------------------
//  Properties
const NOTIF_BTN_OPEN = 0;
const NOTIF_BTN_SHOW = 1;


const notificationId = '';

const extId  = _i18n('@@extension_id');
const prefix = 'chrome-extension://' + extId;

const notifIconUrl = prefix + PATH_ICON_NOTIF ;
const fileIconUrl    = prefix + PATH_ICON_FILE;
const folderIconUrl  = prefix + PATH_ICON_FOLDER;


// Current navigator's OS
const os = _getOS();

const ntfs = {};

// Chrome Promised
const chromep = new ChromePromise();

const downStoreHelper = new DownloadStorageHelper();



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
const _createNotification = async (downId,filename) => {
    const notif = {
        type: 'basic',
        title: _i18n('extName'),
        iconUrl: notifIconUrl
    };
    
    // set buttons' properties
    const openFileButton = {
        title: _i18n(KEY_LABEL_NOTIF_BTN_OPEN),
        iconUrl : fileIconUrl
    };
    const openFolderButton = {
        title: _i18n(KEY_LABEL_NOTIF_BTN_SHOW),
        iconUrl: folderIconUrl
    };

    // Assign a matching title for the notif
    opt.title = _i18n('nDownFinished');
    // get the file name
    opt.message = filename.replace(/^.*[\\\/]/, '');
    opt.buttons = [openFileButton, openFolderButton];
    
    const downFileIcon = await chromep.downloads.getFileIcon(downId, { size: 32 });

    opt.iconUrl = url ? url : notifIconUrl;
    
};


export async function showNotification({ state, id: downId }) {
    
    if (state && state.current === 'complete') {
        
        downStoreHelper.save(downId);
        
        chrome.downloads.search({ id: downId }, ([item, ]) => {


            ntfs[downId] = {
                opt,
                'notificationId': notificationId + '|' + downId
            };


            // if we already have a notification shown
            // we just clear it, and create a new one
            // if not, we just create a new one.
            chrome.notifications.getAll(function(item) {
                const notiId = ntfs[downId].notificationId;

                playSound();

                if (item.hasOwnProperty(notiId)) {
                    chrome.notifications.clear(notiId, _ => {
                        chrome.notifications.create(notiId, opt, _ => _);
                    });
                }
                else {
                    chrome.notifications.create(notiId, opt, _ => _);
                }
            });
        });
    }

}



function openOrShowFileById(downId, action, alertContent) {
    if (!downId || !action) {
        return;
    }

    const _id = downId,
        _action = action,
        _alertContent = alertContent,
        _actions = {
            // open downloaded file by id.
            'open': id => chrome.downloads.open(id),
            // show downloaded file by id.
            'show': id => chrome.downloads.show(id)
        };

    chrome.downloads.search({ id: _id }, function([item]) {
        const notiId = ntfs[_id].notificationId;

        if (item.exists) {
            _actions[action](item.id);
        }
        else {
            chrome.notifications.clear(notiId, _ => {});
            delete ntfs[_id];
            downStoreHelper.remove(_id);
            alert(_alertContent);
        }
    });
}

function clearNotificationWhenExistChange({ downID, exists: downExists }) {
    if (downID && downExists && downStoreHelper.contains(downID) && !downExists.current) {

        chrome.notifications.getAll(function(items) {
            const notiId = ntfs[downID].notificationId;
            if (items.hasOwnProperty(notiId)) {
                chrome.notifications.clear(notiId, function() {
                    delete ntfs[downID];
                    downStoreHelper.remove(downID);
                });
            }
        });
    }
}


chrome.notifications.onButtonClicked.addListener((nid, btnIdx) => {
    const downId = parseInt(nid.split('|')[1], 10);
    const strFileNotFound = _i18n('nFileNotFound');
    const strIdNotFound = _i18n('nDownIdNotFound');

    if (ntfs.hasOwnProperty(downId) && nid === ntfs[downId].notificationId) {
        if (btnIdx === 0) {
            if (downStoreHelper.contains(downId)) {
                openOrShowFileById(downId, 'open', strFileNotFound);
            }
            else {
                chrome.notifications.clear(nid, _ => {});
                delete ntfs[downId];
                downStoreHelper.remove(downId);
                alert(strIdNotFound);
            }
        }

        if (btnIdx === 1) {
            if (downStoreHelper.contains(downId)) {
                openOrShowFileById(downId, 'show', strFileNotFound);
            }
            else {
                chrome.notifications.clear(nid, _ => {});
                delete ntfs[downId];
                downStoreHelper.remove(downId);
                alert(strIdNotFound);
            }
        }
    }
    else {
        alert(strFileNotFound);
    }
});
