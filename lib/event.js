goog.provide('DragJs.event.DropZoneEvent');
goog.provide('DragJs.event.EVENT_DRAGENTER');
goog.provide('DragJs.event.EVENT_DRAGLEAVE');
goog.provide('DragJs.event.EVENT_DROP');
goog.provide('DragJs.event.EVENT_ERR');
goog.provide('DragJs.event.listen');

goog.require('DragJs.DataTransfer');

DragJs.event.DropZoneEvent = goog.defineClass(null, {
    /**
     * @param {!HTMLElement} elem
     * @param {!boolean} listenDrop
     */
    constructor(elem, listenDrop = false) {
        /**
         * @const {!HTMLElement}
         */
        this.element = elem;

        /**
         * @type {!number}
         */
        this.dragEnterCounter = 0;

        /**
         * @type {!boolean}
         */
        this.listenDrop = listenDrop;

        elem['dragJsEventHandler'] = this

        elem.addEventListener('dragover', this._dragOver.bind(this), false);
        elem.addEventListener('dragenter', this._dragEnter.bind(this), false);
        elem.addEventListener('dragleave', this._dragLeave.bind(this), false);
        elem.addEventListener('drop', this._drop.bind(this), false);
    },

    /**
     * @param {!Event} e
     * @private
     */
    _dragOver(e)
    {
        if (this.listenDrop) {
            let dataTransfer = this._toFileDataTransfer(e)
            if (dataTransfer) {
                dataTransfer.dropEffect = "copy"
            }
        }
    },

    /**
     * @param {!Event} e
     * @private
     */
    _dragEnter(e)
    {
        let dataTransfer = this._toFileDataTransfer(e)

        if (dataTransfer && this.dragEnterCounter++ == 0) {
            this.element.dispatchEvent(new CustomEvent(DragJs.event.EVENT_DRAGENTER));
        }
    },

    /**
     * @param {!Event} e
     * @private
     */
    _dragLeave(e)
    {
        let dataTransfer = this._toFileDataTransfer(e)

        if (dataTransfer && --this.dragEnterCounter == 0) {
            this._raiseEventDragLeave()
        }
    },

    /**
     * @private
     */
    _raiseEventDragLeave()
    {
        this.element.dispatchEvent(new CustomEvent(DragJs.event.EVENT_DRAGLEAVE));
    },

    /**
     * @param  {!Event}  e
     * @private
     */
    _drop(e)
    {
        this.dragEnterCounter = 0;
        this._raiseEventDragLeave();

        if (this.listenDrop) {
            let originalDataTransfer = this._toFileDataTransfer(e);

            if (originalDataTransfer) {
                let dataTransfer = new DragJs.DataTransfer(originalDataTransfer);

                dataTransfer.getFiles().then((files) => {
                    if (files.length) {
                        this.element.dispatchEvent(new CustomEvent(DragJs.event.EVENT_DROP, {
                            detail: {files}
                        }));
                    }
                }, (reason) => {
                    var notPrevented = this.element.dispatchEvent(new CustomEvent(DragJs.event.EVENT_DROP, {
                        cancelable: true, 
                        detail: {reason}
                    }));
                    if (notPrevented) {
                        console.error(reason);
                    }
                });
            }
        }
    },

    /**
     * @param  {!Event}  e
     * @return {?DataTransfer}
     * @private
     */
    _toFileDataTransfer(e)
    {
        let dataTransfer = DragJs.DataTransfer.event2NativeDataTransfer(e);

        let containFiles = dataTransfer ? DragJs.DataTransfer.getContainFiles(dataTransfer) : false;

        if (containFiles) {
            e.preventDefault();

            return dataTransfer;
        }

        return null;
    }
});

/**
 * @param  {!HTMLElement}  element
 * @param  {!boolean}      listenDrop
 * @export
 */
DragJs.event.listen = function (element, listenDrop = false) {
    if (! element['dragJsEventHandler']) {
        new DragJs.event.DropZoneEvent(element, listenDrop);
    } else if (listenDrop) {
        /**
         * @type {!DragJs.event.DropZoneEvent}
         */
        let handler = element['dragJsEventHandler'];
        handler.listenDrop = listenDrop;
    }
};

/**
 * @const
 */
DragJs.event.EVENT_DRAGENTER = 'dropzone-dragenter';

/**
 * @const
 */
DragJs.event.EVENT_DRAGLEAVE = 'dropzone-dragleave';

/**
 * @const
 */
DragJs.event.EVENT_DROP = 'dropzone-drop';

/**
 * @const
 */
DragJs.event.EVENT_ERR = 'dropzone-error';
