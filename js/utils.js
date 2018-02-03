    /*==========    Utilities Fonctions    ==========*/

    /**
     * Pseudo selector for #ID
     * @param {string} id ID of the element WITHOUT #
     * @returns {HTMLElement}
     */
    const _$ = id => document.getElementById(id);

    /**
     * Get the corresponding message to a specified key
     * @param {string} key  Key of the message
     * @return {string}
     */
    const _i18n = key => chrome.i18n.getMessage(key);


    /**
     * @typedef CurrentOS
     * @property {Windows} string "windows"
     * @property {Mac} string "Mac"
     * @property {Other} string "Other"
     */
    /**
     * Get the current navigator OS
     * @return {CurrentOS} The corresponding OS name
     */
    const _getOS = () => {
        const _ua = navigator.userAgent.toLowerCase();
        let _os;

        if (_ua.length) {
            if (_ua.includes('windows')) {
                _os = 'windows';
            } else {
                _os = (_ua.includes('mac') ? 'mac' : 'other');
            }
        }

        return _os;
    };