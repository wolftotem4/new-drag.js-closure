goog.provide('DragJs.isSupported');

/**
 * @return {!boolean}
 * @export
 */
DragJs.isSupported = function() {
    return typeof FileList !== 'undefined';
};
