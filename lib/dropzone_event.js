goog.provide('DragJs.DropZoneEvent');
goog.provide('DragJs.events.EVENT_DRAGENTER');
goog.provide('DragJs.events.EVENT_DRAGLEAVE');
goog.provide('DragJs.events.EVENT_DROP');
goog.provide('DragJs.events.EVENT_ERR');

goog.require('DragJs.DataTransfer');

DragJs.DropZoneEvent = goog.defineClass(null, {
    /**
     * @param {!HTMLElement} elem
     */
    constructor(elem) {
        /**
         * @const {!HTMLElement}
         */
        this.element = elem;

        /**
         * @type {!number}
         */
        this.dragEnterCounter = 0;
    },

    registerEventListeners()
    {
        this.element.addEventListener('dragover', this._dragOver.bind(this), false);
        this.element.addEventListener('dragenter', this._dragEnter.bind(this), false);
        this.element.addEventListener('dragleave', this._dragLeave.bind(this), false);
        this.element.addEventListener('drop', this._drop.bind(this), false);
    },

    /**
     * @param {!Event} e
     * @private
     */
    _dragOver(e)
    {
        let dataTransfer = this._toFileDataTransfer(e)
        if (dataTransfer) {
            dataTransfer.dropEffect = "copy"
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
            this.element.dispatchEvent(new CustomEvent(DragJs.events.EVENT_DRAGENTER));
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
        this.element.dispatchEvent(new CustomEvent(DragJs.events.EVENT_DRAGLEAVE));
    },

    /**
     * @param  {!Event}  e
     * @private
     */
    _drop(e)
    {
        let originalDataTransfer = this._toFileDataTransfer(e);

        if (originalDataTransfer) {
            this.dragEnterCounter = 0;
            this._raiseEventDragLeave();

            let dataTransfer = new DragJs.DataTransfer(originalDataTransfer);

            dataTransfer.getFiles().then((files) => {
                if (files.length) {
                    this.element.dispatchEvent(new CustomEvent(DragJs.events.EVENT_DROP, {
                        detail: {files}
                    }));
                }
            }, (reason) => {
                var notPrevented = this.element.dispatchEvent(new CustomEvent(DragJs.events.EVENT_DROP, {
                    cancelable: true, 
                    detail: {reason}
                }));
                if (notPrevented) {
                    console.error(reason);
                }
            });
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
 * @const
 */
DragJs.events.EVENT_DRAGENTER = 'dropzone-dragenter';

/**
 * @const
 */
DragJs.events.EVENT_DRAGLEAVE = 'dropzone-dragleave';

/**
 * @const
 */
DragJs.events.EVENT_DROP = 'dropzone-drop';

/**
 * @const
 */
DragJs.events.EVENT_ERR = 'dropzone-error';
