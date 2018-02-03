    /*==========    Utilities Fonctions    ==========*/

    /**
     * Pseudo selector for #ID
     * @param {string} id ID of the element WITHOUT #
     * @returns {HTMLElement}
     */
    const _$ = id => doc.getElementById(id);

    /**
     * Get the corresponding message to a specified key
     * @param {string} key  Key of the message
     * @return {string}
     */
    const _i18n = key => chrome.i18n.getMessage(key);