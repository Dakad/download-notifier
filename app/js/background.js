/* global chrome */

/**
 * @author https://github.com/dakad
 * @overview Background Script
 * @version 1.0.0
 * 
 */


/*======================Settings modifier========================*/


//When we got installed, the download shelf will
//be disabled. 'Cause we now have an amazing
//download manager, who need that shelf?
chrome.runtime.onInstalled.addListener(function(obj) {
    if (obj.reason === "install" || obj.reason === "update") {

        /**
         * Check if is new installation, then open Option Page
         */
        chrome.storage.local.get('BDIsFirstRun', function(items) {
            if (!items.hasOwnProperty('BDIsFirstRun')) {
                chrome.runtime.openOptionsPage();
                chrome.notifications.getAll((notif) => {
                    if (notif.hasOwnProperty('BDNotification')) {
                        chrome.notifications.clear('BDNotification', () => {
                            // do nothing now;
                        });
                    }
                });
            }
            // Otherwise, Persist as not the first Install
            chrome.storage.local.set({ 'BDIsFirstRun': false });
        });

        chrome.storage.sync.get(['BDIsShowShelf', 'BDIsPlaySound', 'BDVolOfSound'], function(obj) {
            if (!obj.hasOwnProperty('BDIsShowShelf')) {
                chrome.storage.sync.set({ 'BDIsShowShelf': false });
                chrome.downloads.setShelfEnabled(false);
            }

            if (!obj.hasOwnProperty('BDIsPlaySound')) {
                chrome.storage.sync.set({ 'BDIsPlaySound': 1, 'BDSoundID': 0 });
            }

            if (!obj.hasOwnProperty('BDVolOfSound')) {
                chrome.storage.sync.set({ 'BDVolOfSound': 0.8 });
            }
        });

        updateBrowserActionIcon();
    }
});

//Clear the mess if we got uninstalled.
chrome.management.onUninstalled.addListener(function(id) {
    chrome.downloads.setShelfEnabled(true);
    localStorage.clear();
    chrome.storage.local.clear();
    chrome.storage.sync.clear();
});

/*===================Settings modifier done======================*/

chrome.downloads.onCreated.addListener(function(DLItem) {
    saftyCheck(DLItem);
    updateBrowserActionIcon();
    chrome.storage.sync.get('BDIsShowShelf', function(obj) {
        var BDIsShowShelf = obj.BDIsShowShelf;
        //console.log('on downloads created ', BDIsShowShelf);
        chrome.downloads.setShelfEnabled(BDIsShowShelf);
    });
});

chrome.storage.onChanged.addListener(function(obj, area) {
    if (area === "sync" && obj.hasOwnProperty('BDIsShowShelf')) {
        var showShelf = obj.BDIsShowShelf.newValue;
        //console.log('BDIsShowShelf value changed to ', showShelf);
        chrome.downloads.setShelfEnabled(showShelf);
    }
});

chrome.downloads.onChanged.addListener(function(DLObj) {
    saftyCheck(DLObj);
    updateBrowserActionIcon();
    showNotification(DLObj);
    clearNotificationWhenExistChange(DLObj);
});

/*===================Browser Action======================*/

chrome.browserAction.onClicked.addListener(function(tab) {
    createOrSelectDownloadPage();
});



function createOrSelectDownloadPage() {
    chrome.windows.getAll({ populate: true }, (windows) => {
        // Check if this tab is on 'chrome://downloads/'
        const isTabOnDownloadUrl = tab => tab.url === 'chrome://downloads/';

        // Keeps only the normal open windows with tabs
        const downloadTab = windows.filter(wind => wind.type === "normal" && wind.tabs.length > 0)
            .filter(wind => wind.tabs.some(isTabOnDownloadUrl)) // Filter only the window  
            .map(w => w.tabs.find(isTabOnDownloadUrl))
            .pop();

        if (downloadTab) {
            chrome.windows.update(downloadTab.windowId, { 'focused': true });
            chrome.tabs.update(downloadTab.id, { 'selected': true });
        } else {
            chrome.tabs.create({ url: 'chrome://downloads', selected: true })
        }
    })
}

function saftyCheck(obj) {
    if (obj && obj.hasOwnProperty("danger")) {
        if (typeof obj.danger === "object") {
            if (obj.danger.current !== "safe" && obj.danger.current !== "accepted") {
                dangerDownloadHandler(obj.id);
            }
        } else {
            if (obj.danger !== "safe" && obj.danger !== "accepted") {
                dangerDownloadHandler(obj.id);
            }
        }
    }
}

function dangerDownloadHandler(id) {
    var str = chrome.i18n.getMessage("aHarmfulFileAlert"),
        cfm = confirm(str);

    if (cfm) {
        createOrSelectDownloadPage();
    } else {
        chrome.downloads.cancel(id, function() {
            //do nothing;
        });
    }
}