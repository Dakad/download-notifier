/* global chrome */

/**
 * @author https://github.com/dakad
 * @overview Background Downloader script
 * @version 1.0.0
 * 
 */

/*====================================*/

/**
 * Little helper for chrome.downloader
 * @param {Object} q Querry - What to search for 
 * @param {Function} cb Callback  
 */
const downloadSearchHelpler = (q, cb) => chrome.downloads.search(q, cb);

function updateBrowserActionIcon() {

    const hPB = new HProgressBar();

    const setExtIcon = path => chrome.browserAction.setIcon(path)

    const setExtBadgeText = t => chrome.browserAction.setBadgeText({ "text": t });


    chrome.downloads.search({ 'state': 'in_progress' }, function(arr) {
        const count = arr.length;

        if (count) {
            setExtBadgeText(count + '');
            chrome.browserAction.setBadgeBackgroundColor({ color: "#00CD66" });
            // imgData = hPB.draw(0.5);
            // setExtIcon({imageData: imgData});
        } else {
            setExtBadgeText('');
            setExtIcon({ path: '/img/icon-19.png' });
        }
    });
}