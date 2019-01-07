goog.provide('DragJs.isSupported');

/**
 * @return {!boolean}
 * @export
 */
DragJs.isSupported = function() {
    if (typeof FileList !== 'undefined' && typeof Promise !== 'undefined') {
        try {
            // IE has problems with .preventDefault() on custom events
            // http://stackoverflow.com/questions/23349191
            var ce = new window.CustomEvent('test', { cancelable: true });
            ce.preventDefault();
            return (ce.defaultPrevented === true);
        } catch (e) {
            return false;
        }
    }

    return false;
};
