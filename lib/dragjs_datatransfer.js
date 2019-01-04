goog.provide('DragJs.DataTransfer');

goog.require('DragJs.EntryTraveler');

DragJs.DataTransfer = goog.defineClass(null, {

    /**
     * @param {?DataTransfer} originalDataTransfer 
     */
    constructor(originalDataTransfer)
    {
        /**
         * @type {?DataTransfer}
         */
        this.originalDataTransfer = originalDataTransfer;
    },

    /**
     * @return {!Promise.<!Array.<!File>|!FileList>}
     */
    getFiles()
    {
        if (! this.originalDataTransfer) {
            return Promise.resolve([]);
        }

        let dataTransfer = this.originalDataTransfer;

        if (dataTransfer.items) {
            let items = dataTransfer.items;

            return DragJs.EntryTraveler.itemList.travel(items);
        } else {
            return Promise.resolve(dataTransfer.files);
        }
    }
});

/**
 * @param  {!Event}  event
 * @return {?DataTransfer}
 */
DragJs.DataTransfer.event2NativeDataTransfer = function (event) {
    if (! (event instanceof DragEvent)) {
        return null;
    }

    return event.dataTransfer || null;
}

/**
 * @param  {!DataTransfer}  dataTransfer
 * @return {!boolean}
 */
DragJs.DataTransfer.getContainFiles = function (dataTransfer) {
    let dataTransferTypes = dataTransfer.types;

    if (! dataTransferTypes) {
        // Unsupported Browser, we presume it was a file.
        return true;
    }

    if (dataTransferTypes instanceof DOMStringList) {
        return dataTransferTypes.contains('Files');
    } else {
        return dataTransferTypes.indexOf('Files') > -1;
    }
}
