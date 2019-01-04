goog.provide('DragJs.utils.relativePath');
goog.provide('DragJs.utils.toFormData');

/**
 * @param  {!File|!Array.<!File>|!FileList}  files
 * @param  {!string}  fieldName
 * @return {!FormData}
 * @export
 */
DragJs.utils.toFormData = function (files, fieldName = "files[]") {
    var formData = new FormData();

    if (files instanceof File) {
        formData.append(fieldName, files, DragJs.utils.relativePath(files));
    } else {
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            formData.append(fieldName, file, DragJs.utils.relativePath(file));
        }
    }

    return formData;
}

/**
 * @param  {!File}  file
 * @return {!string}
 * @export
 */
DragJs.utils.relativePath = function (file) {
    return file['xRelativePath'] || file.webkitRelativePath || file.name;
}
