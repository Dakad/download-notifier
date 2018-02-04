//Author: Dakad

//Date: 2018-01-01
//Version: 0.1

/*====================================*/

// import { _i18n, _getOS } from "../js/utils";

const _i18n = key => chrome.i18n.getMessage(key);

const notificationId = 'BDNotification';
const storageDownIdKey = 'BDNotificationDownID';

const extId = _i18n('@@extension_id');
const prefix = 'chrome-extension://' + extId;

const defaultIconUrl = prefix + '/img/icon-128.png';
const fileIconUrl = prefix + '/img/file-icon.png';
const folderIconUrl = prefix + '/img/folder-icon.png';
const defaultFolderIconUrl = prefix + '/img/default-folder-icon.png';



// Current navigator's OS
const os = (_ => {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.length) {
        if (ua.includes('windows')) {
            return 'Win';
        }
        return (ua.includes('Mac') ? 'mac' : '');
    }
    return '';
}).call();

const ntfs = {};
const opt = {
    type: 'basic',
    title: 'Download Notifier',
    iconUrl: defaultIconUrl
};

const shelper = new StorageHelper();


// A storage helper
function StorageHelper() {
    let ls = localStorage[storageDownIdKey];

    this.set = did => {
        if (ls) {
            const arr = ls.split(',');
            if (!isNaN(did) && !this.contains(did)) {
                arr.push(did);
                ls = arr.join(',');
            }
        } else {
            if (did && !isNaN(did)) {
                ls = did + '';
            }
        }

        return ls;
    };


    this.remove = did => {
        if (did && !isNaN(did)) {
            ls = ls.replace(did, '')
                .replace(',,', ',')
                .replace(/^,*|,*$/g, '');
        }
        return ls;
    }

    this.contains = did => {
        if (ls) {
            return ls.split(',')
                .some((val) => parseInt(did, 10) === parseInt(val, 10));
        }
        return false;
    }
}

function showNotification({ state, id: did }) {

    if (state && state.current === 'complete') {
        shelper.set(did);

        chrome.downloads.search({ id: did }, ([item, ]) => {

            // set buttons' properties
            const openFileButton = {
                title: _i18n('nOpenFileTitle'),
                iconUrl: fileIconUrl
            };
            const openFolderButton = {
                title: _i18n(`nOpenFolderTitle${os}`),
                iconUrl: folderIconUrl
            };


            // Assign a matching title for the notif
            opt.title = _i18n('nDownFinished');
            // get the file name
            opt.message = item.filename.replace(/^.*[\\\/]/, '');;
            opt.buttons = [openFileButton, openFolderButton];


            chrome.downloads.getFileIcon(did, { size: 32 }, function(url) {
                setFileIcon(url);
            });

            function setFileIcon(url) {
                opt.iconUrl = url ? url : defaultIconUrl;
            }

            ntfs[did] = {
                opt,
                'notificationId': notificationId + '|' + did
            };


            // if we already have a notification shown
            // we just clear it, and create a new one
            // if not, we just create a new one.
            chrome.notifications.getAll(function(item) {
                const notiId = ntfs[did].notificationId;

                playSound();

                if (item.hasOwnProperty(notiId)) {
                    chrome.notifications.clear(notiId, _ => {
                        chrome.notifications.create(notiId, opt, _ => _);
                    });
                } else {
                    chrome.notifications.create(notiId, opt, _ => _);
                }
            });
        });
    }

}

// Play a sound when downloaded
function playSound() {
    chrome.storage.sync.get([
            'BDIsPlaySound',
            'BDSoundID',
            'BDVolOfSound'
        ],
        function({ BDVolOfSound, BDSoundID, BDIsPlaySound }) {
            if (BDIsPlaySound) {
                const el = document.createElement('audio');

                el.src = SOUNDS[BDSoundID];
                el.autoplay = true;
                el.volume = BDVolOfSound || 0.8;
            }
        });
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
        } else {
            chrome.notifications.clear(notiId, _ => {});
            delete ntfs[_id];
            shelper.remove(_id);
            alert(_alertContent);
        }
    });
}

function clearNotificationWhenExistChange({ downid, exists: downExists }) {
    if (downid && downExists && shelper.contains(id) && !downExists.current) {

        chrome.notifications.getAll(function(items) {
            const notiId = ntfs[id].notificationId;
            if (items.hasOwnProperty(notiId)) {
                chrome.notifications.clear(notiId, function() {
                    delete ntfs[id];
                    shelper.remove(id);
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
            if (shelper.contains(downId)) {
                openOrShowFileById(downId, 'open', strFileNotFound);
            } else {
                chrome.notifications.clear(nid, _ => {});
                delete ntfs[downId];
                shelper.remove(downId);
                alert(strIdNotFound);
            }
        }

        if (btnIdx === 1) {
            if (shelper.contains(downId)) {
                openOrShowFileById(downId, 'show', strFileNotFound);
            } else {
                chrome.notifications.clear(nid, _ => {});
                delete ntfs[downId];
                shelper.remove(downId);
                alert(strIdNotFound);
            }
        }
    } else {
        alert(strFileNotFound);
    }
});