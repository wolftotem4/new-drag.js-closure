goog.provide('DragJs.dom.addClassName');
goog.provide('DragJs.dom.getClassNames');
goog.provide('DragJs.dom.removeClassName');
goog.provide('DragJs.dom.setClassNames');

/**
 * @param  {!HTMLElement}  element
 * @param  {!string}       className
 */
DragJs.dom.addClassName = function (element, className) {
    var classNames = DragJs.dom.getClassNames(element);
    if (classNames.indexOf(className) == -1) {
        classNames.push(className);
        DragJs.dom.setClassNames(element, classNames);
    }
}

/**
 * @param {!HTMLElement}  element
 * @param {!string}       className
 */
DragJs.dom.removeClassName = function (element, className) {
    var classNames = DragJs.dom.getClassNames(element);
    /**
     * @type {!number}
     */
    var index;
    if ((index = classNames.indexOf(className)) > -1) {
        classNames.splice(index, 1);
        DragJs.dom.setClassNames(element, classNames);
    }
};

/**
 * @param  {!HTMLElement}  element
 * @return {!Array.<!string>}
 */
DragJs.dom.getClassNames = function (element)
{
    return (element.className) ? element.className.split(' ') || [] : [];
};

/**
 * @param  {!HTMLElement}      element
 * @param  {!Array.<!string>}  classNames
 */
DragJs.dom.setClassNames = function (element, classNames) {
    element.className = classNames.join(' ');
};
