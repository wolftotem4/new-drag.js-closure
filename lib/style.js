goog.provide('DragJs.style.cssDragOver');

goog.require('DragJs.dom.addClassName');
goog.require('DragJs.dom.removeClassName');
goog.require('DragJs.event.EVENT_DRAGENTER');
goog.require('DragJs.event.EVENT_DRAGLEAVE');
goog.require('DragJs.event.listen');
goog.require('DragJs.style.cssDragOver');

/**
 * @param {!HTMLElement} element
 * @param {!string} className
 * @export
 */
DragJs.style.cssDragOver = function (element, className) {
    DragJs.event.listen(element);

    element.addEventListener(DragJs.event.EVENT_DRAGENTER, () => {
        DragJs.dom.addClassName(element, className);
    }, false);

    element.addEventListener(DragJs.event.EVENT_DRAGLEAVE, () => {
        DragJs.dom.removeClassName(element, className);
    }, false);
};