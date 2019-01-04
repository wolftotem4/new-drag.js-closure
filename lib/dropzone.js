goog.provide('DragJs.DropZone');

goog.require('DragJs.DropZoneDom');
goog.require('DragJs.DropZoneEvent');
goog.require('DragJs.events.EVENT_DROP');
goog.require('DragJs.events.EVENT_ERR');

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

        /**
         * @private
         */
        this._events = new DragJs.DropZoneEvent(elem);

        /**
         * @private
         */
        this._dom = new DragJs.DropZoneDom(elem, options);

        this._init();
    },

    /**
     * @private
     */
    _init() {
        this._events.registerEventListeners();
        this._dom.registerEventListeners();
    },

    /**
     * @param  {!function((!Array.<!File>|!FileList))}  callback
     * @param  {?function((!string|!Object))}  fallback
     * @return {!DragJs.DropZone}
     * @export
     */
    listenOnDrop(callback, fallback)
    {
        this.element.addEventListener(DragJs.events.EVENT_DROP, function (e) {
            callback(e['detail']['files']);
        }, false);

        if (fallback) {
            this.element.addEventListener(DragJs.events.EVENT_ERR, function (e) {
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
            this.element.addEventListener(DragJs.events.EVENT_DROP, function (e) {
                resolve(e['detail']['files']);
            }, false);
        })
    }
});