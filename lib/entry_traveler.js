goog.provide('DragJs.EntryTraveler');

DragJs.EntryTraveler = {
    itemList : {
        /**
         * @param  {!DataTransferItemList}  itemList
         * @return {!Promise.<!Array.<!File>>}
         */
        travel(itemList)
        {
            /**
             * @type {!Array.<!Entry>}
             */
            let entries = [];
            for (let i = 0; i < itemList.length; i++) {
                let item = itemList[i];
                let entry = item.webkitGetAsEntry();

                if (entry) {
                    entries.push(entry);
                }
            }

            return DragJs.EntryTraveler.entry.travel(entries, "");
        }
    },

    entry : {
        /**
         * @param  {!Array.<!Entry>}  entries
         * @param  {!string}  path
         * @return {!Promise.<!Array.<!File>>}
         */
        travel(entries, path)
        {
            return Promise.all(entries.map(function (entry) {
                if (entry.isFile) {
                    return [DragJs.EntryTraveler.fileEntry.get(entry, path)];
                } else {
                    return DragJs.EntryTraveler.dirEntry.travel(entry, path);
                }
            })).then((array) => {
                return Array.prototype.concat.apply([], array);
            });
        }
    },

    fileEntry : {
        /**
         * @param  {!Entry}   entry
         * @param  {!string}  path
         * @return {!Promise.<!File>}
         */
        get(entry, path)
        {
            return DragJs.EntryTraveler.fileEntry._file(entry).then((file) => {
                file['xRelativePath'] = path + file.name;
                return file;
            });
        },

        /**
         * @param  {!Entry} entry
         * @return {!Promise.<!File>}
         * @private
         */
        _file(entry)
        {
            return new Promise((resolve, reject) => entry['file'](resolve, reject));
        }
    },

    dirEntry : {
        /**
         * @param  {!Entry}   entry
         * @param  {!string}  path
         * @return {!Promise.<!Array.<!File>>}
         */
        travel(entry, path)
        {
            return DragJs.EntryTraveler.dirEntry._read(entry['createReader']()).then((entries) => {
                return DragJs.EntryTraveler.entry.travel(entries, path + entry.name + "/");
            });
        },

        /**
         * @param  {!DirectoryReader}  reader
         * @return {!Promise.<!Array.<!Entry>>}
         * @private
         */
        _read(reader)
        {
            return new Promise((resolve, reject) => {
                reader.readEntries((entries) => {
                    if (entries.length) {
                        DragJs.EntryTraveler.dirEntry._read(reader).then((sub) => {
                            resolve(entries.concat(sub));
                        }, reject);
                    } else {
                        resolve([]);
                    }
                }, reject);
            });
        }
    }
};
