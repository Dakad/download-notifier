/**
 * @author  https://github.com/dakad
 * @overview Mock module for the localStorage
 */



    export const store = {};
    
    export const getItem = (key) =>  (key in store) ? store[key] : null;
    
    export const setItem = (key, value) => store[key] = `${value}`;
    
    export const removeItem = (key) => delete store[key];
    
    export const clear = () => Object.keys(store).forEach(k => delete store[k]);


    

  
