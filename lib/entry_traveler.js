goog.provide('DragJs.travelTransferItemList');

/**
 * @param  {!DirectoryReader}  reader
 * @return {!Promise<!Array.<!Entry>>}
 */
function travelDirEntry(reader)
{
    return new Promise((resolve, reject) => {
        reader.readEntries((entries) => {
            if (entries.length) {
                travelDirEntry(reader).then((sub) => {
                    resolve(entries.concat(sub));
                }, reject);
            } else {
                resolve([]);
            }
        }, reject);
    });
}

/**
 * @param  {!Entry}  fileEntry
 * @param  {!string}  path
 * @return {!Promise<!Array.<!File>>}
 */
function fileEntry(fileEntry, path)
{
    return readFileEntry(fileEntry).then((file) => {
        file['xRelativePath'] = path + file.name;
        return [file];
    });
}

/**
 * @param {!Entry}  dirEntry
 * @param {!string}  path
 */
function dirEntry(dirEntry, path)
{
    return readDirEntry(dirEntry).then((entries) => {
        return travelEntries(entries, path + dirEntry.name + "/")
    });
}

/**
 * @param  {!Array.<!Entry>} entries 
 * @param  {!string}  path
 * @return {!Promise.<!Array.<!File>>}
 */
function travelEntries(entries, path)
{
    return Promise.all(entries.map((entry) => {
        return (entry.isFile) ? fileEntry(entry, path) : dirEntry(entry, path);
    })).then((array) => {
        return Array.prototype.concat.apply([], array);
    });
}

/**
 * @param  {!Entry}  fileEntry
 * @return {!Promise<!File>}
 */
function readFileEntry(fileEntry)
{
    return new Promise((resolve, reject) => fileEntry['file'](resolve, reject));
}

/**
 * @param  {!Entry}  dirEntry
 * @return {!Promise<!Array.<!Entry>>}
 */
function readDirEntry(dirEntry)
{
    return travelDirEntry(dirEntry['createReader']());
}

/**
 * @param  {!DataTransferItemList}  items
 * @return {!Array.<!Entry>}
 */
function getAsEntry(items)
{
    /**
     * @type {!Array.<!Entry>} entries
     */
    var entries = [];

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        var entry = item.webkitGetAsEntry();

        if (entry) {
            entries.push(entry);
        }
    }

    return entries;
}

/**
 * 
 * @param  {!DataTransferItemList}  items
 * @return {!Promise.<!Array.<!File>>}
 */
DragJs.travelTransferItemList = function (items) {
    return travelEntries(getAsEntry(items), "");
}