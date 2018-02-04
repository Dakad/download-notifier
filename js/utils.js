'use strict';

/*==========    Utilities Fonctions    ==========*/

/**
 * Pseudo selector for #ID
 * @param {string} id ID of the element WITHOUT #
 * @returns {HTMLElement}
 */
/* export */
const _$ = id => document.getElementById(id);

/**
 * Get the corresponding message to a specified key
 * @param {string} key  Key of the message
 * @return {string}
 */
/* export */
const _i18n = key => chrome.i18n.getMessage(key);

/**
 * Get the current navigator OS
 * @return {String} Windows => Win, Mac => Mac, otherwise empty.
 */
/* export */
const _getOS = () => {
    const _ua = navigator.userAgent.toLowerCase();

    if (_ua.length) {
        if (_ua.includes('windows')) {
            return 'Win';
        }
        return (_ua.includes('Mac') ? 'mac' : '');
    }
    return '';
};