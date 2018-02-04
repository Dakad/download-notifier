//Author: Dakad

//Date: 2018-01-01
//Version: 0.1

/*====================================*/

// import { _$, _i18n } from "../js/utils.js";
// import {
//     SOUNDS,
//     STOPICON,
//     PLAYICON
// } from "../js/consts.js";



(function(win, doc) {
    const _i18n = key => chrome.i18n.getMessage(key);
    const _$ = id => document.getElementById(id);

    /*==========    Select UI Elements      ==========*/
    const saCheckBoxNode = _$('soundAlert'),
        soundsSelectNode = _$('sounds'),
        soundSelectNode = _$('alertSound'),
        showShelfNode = _$('showDownloadShelf'),
        volControlNode = _$('volumeOfSound');


    /*==========    UI init     ==========*/
    _$('soundAlertLabel').textContent = _i18n('oSoundLabel');
    _$('showDownloadShelfLabel').textContent = _i18n('oDownloadShelfLabel');
    _$('volLabel').textContent = _i18n('oVolLabel');
    _$('trackLabel').textContent = _i18n('oTrackLabel');
    _$('volNotes').textContent = _i18n('oVolNotes');

    if (doc.body.getAttribute('data-page-type')) {
        _$('extName').textContent = _i18n('extName') + ' ' + _i18n('settings');
    }

    win.onload = () => retrieveOptions();


    /*========== Selection Events   ==========*/
    showShelfNode.addEventListener('change', () => {
        chrome.storage.sync.set({ 'BDIsShowShelf': showShelfNode.checked });
    });

    // Toggle the soundTrial div
    saCheckBoxNode.addEventListener('change', function() {
        if (saCheckBoxNode.checked) {
            soundsSelectNode.style.display = "block";
            chrome.storage.sync.set({ 'BDIsPlaySound': 1 });

            soundTrial();
            setVolume();
        } else {
            soundsSelectNode.style.display = "none";
            chrome.storage.sync.set({ 'BDIsPlaySound': 0 });
            chrome.storage.sync.remove('BDSoundID');
        }
    }, false);


    /*==========selection events==========*/
    // TODO : MAKE A better design of this function
    function soundTrial() {
        const mediaControlNode = _$('mediaControl');
        const audio = document.createElement('audio');
        let isPlaying = false;

        audio.src = SOUNDS[soundSelectNode.value];
        audio.volume = volControlNode.value;

        // TODO : Move this listener out of this function
        // Should be call on some init function()
        saCheckBoxNode.addEventListener('change', function() {
            if (!saCheckBoxNode.checked) {
                audio.pause();
                audio.currentTime = 0;
                isPlaying = false;
                mediaControlNode.src = PLAYICON;
            }
        });

        // TODO : Move this listener out of this function
        // Should be call on some init function()
        volControlNode.addEventListener('change', () => {
            const vol = volControlNode.value;

            _$('volValue').textContent = (vol * 100).toFixed(0);
            audio.volume = vol;
            chrome.storage.sync.set({ 'BDVolOfSound': vol });
        });

        //When select a sound from the drop list
        // TODO : Move this listener out of this function
        // Should be call on some init function()
        soundSelectNode.addEventListener('change', () => {
            if (isPlaying) {
                audio.pause();
                mediaControlNode.src = STOPICON;
                isPlaying = false;
            }

            audio.src = SOUNDS[soundSelectNode.value];
            audio.play();

            chrome.storage.sync.set({ 'BDSoundID': soundSelectNode.value });
            mediaControlNode.src = PLAYICON;
        }, false);

        //Media playback control
        // TODO : Move this listener out of this function
        // Should be call on some init function()
        mediaControlNode.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                audio.currentTime = 0;
            } else {
                audio.play();
                console.log('audio.volume: ', audio.volume);
            }
        }, false);

        // TODO : Move this listener out of this function
        // Should be call on some init function()
        audio.addEventListener('play', () => {
            isPlaying = true;
            mediaControlNode.src = STOPICON;
        }, false);

        audio.addEventListener('playing', () => {
            isPlaying = true;
            mediaControlNode.src = STOPICON;
        }, false);

        audio.addEventListener('pause', () => {
            isPlaying = false;
            mediaControlNode.src = PLAYICON;
        }, false);

        audio.addEventListener('end', () => {
            isPlaying = false;
            mediaControlNode.src = PLAYICON;
        }, false);
    }

    function setVolume() {
        var vol = 0;
        volControlNode.addEventListener('change', () => {
            vol = volControlNode.value;
            _$('volValue').textContent = (vol * 100).toFixed(0);

            chrome.storage.sync.set({ 'BDVolOfSound': vol });
        });
    }

    function retrieveOptions() {
        chrome.storage.sync.get('BDIsPlaySound', ({ BDIsPlaySound }) => {
            if (BDIsPlaySound) {
                saCheckBoxNode.checked = true;
                soundsSelectNode.style.display = "block";
                setVolume();

                chrome.storage.sync.get('BDSoundID', ({ BDSoundID }) => {
                    soundSelectNode.options[BDSoundID].selected = true;
                    soundTrial();
                });
            }
        });

        chrome.storage.sync.get('BDIsShowShelf', ({ BDIsShowShelf }) => {
            if (BDIsShowShelf) {
                showShelfNode.checked = BDIsShowShelf;
            }
        });

        chrome.storage.sync.get('BDVolOfSound', ({ BDVolOfSound }) => {
            if (BDVolOfSound) {
                volControlNode.value = BDVolOfSound;
                _$('volValue').textContent = (BDVolOfSound * 100).toFixed(0);
            }
        })
    }
}(window, document));