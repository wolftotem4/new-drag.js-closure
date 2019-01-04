goog.provide('DragJs.DropZoneDom');

goog.require('DragJs.events.EVENT_DRAGENTER');
goog.require('DragJs.events.EVENT_DRAGLEAVE');

DragJs.DropZoneDom = goog.defineClass(null, {
    /**
     * @param {!HTMLElement} elem 
     * @param {!Object} options 
     */
    constructor(elem, options)
    {
        /**
         * @const {!HTMLElement}
         */
        this.element = elem;

        /**
         * @type {!Object}
         */
        this.options = options;
    },

    registerEventListeners()
    {
        this.element.addEventListener(DragJs.events.EVENT_DRAGENTER, () => {
            this.addClassName(this.getDragOverClass());
        }, false);

        this.element.addEventListener(DragJs.events.EVENT_DRAGLEAVE, () => {
            this.removeClassName(this.getDragOverClass());
        }, false);
    },

    /**
     * @returns {!string}
     */
    getDragOverClass()
    {
        return this.options['cssClass'] && this.options['cssClass']['dragover'] || 'is-dragover';
    },

    /**
     * @param  {!string}  className
     * @return {!DragJs.DropZoneDom}
     */
    addClassName(className)
    {
        var classNames = this.getClassNames();
        if (classNames.indexOf(className) == -1) {
            classNames.push(className);
            this.setClassNames(classNames);
        }
        return this
    },

    /**
     * @param  {!string}  className
     * @return {!DragJs.DropZoneDom}
     */
    removeClassName(className)
    {
        var classNames = this.getClassNames();
        /**
         * @type {!number}
         */
        var index;
        if ((index = classNames.indexOf(className)) > -1) {
            classNames.splice(index, 1);
            this.setClassNames(classNames);
        }
        return this
    },

    /**
     * @return {!Array.<!string>}
     */
    getClassNames()
    {
        return (this.element.className) ? this.element.className.split(' ') || [] : [];
    },

    /**
     * 
     * @param  {!Array.<!string>}  classNames
     * @return {!DragJs.DropZoneDom}
     */
    setClassNames(classNames)
    {
        this.element.className = classNames.join(' ');
        return this
    }
});
