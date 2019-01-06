goog.provide('DragJs.DropZone');

goog.require('DragJs.event.EVENT_DROP');
goog.require('DragJs.event.EVENT_ERR');
goog.require('DragJs.event.listen');
goog.require('DragJs.isSupported');
goog.require('DragJs.style.cssDragOver');

/**
 * @export
 */
DragJs.DropZone = goog.defineClass(null, {
    /**
     * @param {!HTMLElement} elem
     * @param {!Object} options
     */
    constructor(elem, options = {}) {
        /**
         * @const {!HTMLElement}
         */
        this.element = elem;

        /**
         * @type {!Object}
         */
        this.options = options;

        if (DragJs.isSupported()) {
            DragJs.event.listen(elem, true);
            DragJs.style.cssDragOver(elem, this.getDragOverClass());
        }
    },

    /**
     * @param  {!function((!Array.<!File>|!FileList))}  callback
     * @param  {?function((!string|!Object))}  fallback
     * @return {!DragJs.DropZone}
     * @export
     */
    listenOnDrop(callback, fallback)
    {
        this.element.addEventListener(DragJs.event.EVENT_DROP, function (e) {
            callback(e['detail']['files']);
        }, false);

        if (fallback) {
            this.element.addEventListener(DragJs.event.EVENT_ERR, function (e) {
                e.preventDefault();
                fallback(e['detail']['reason']);
            })
        }

        return this
    },

    /**
     * @return {!Promise<!Array.<!File>|!FileList>}
     * @export
     */
    getDropFiles()
    {
        return new Promise((resolve, reject) => {
            this.element.addEventListener(DragJs.event.EVENT_DROP, function (e) {
                resolve(e['detail']['files']);
            }, false);
        })
    },

    /**
     * @returns {!string}
     */
    getDragOverClass()
    {
        return this.options['cssClass'] && this.options['cssClass']['dragover'] || 'is-dragover';
    }
});