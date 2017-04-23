let eventObj = require('./eventObj');
module.exports =  {
    getId(id) {
        return document.getElementById(id)
    },

    getTag(tag) {
        return document.getElementsByTagName(tag)
    },

    getAttr(event, attr) {
        let target = eventObj.getTarget(event);
        let data = target.getAttribute(attr);

        return data;
    },

    getName(name) {
        return document.getElementsByName(name);
    },

    getClass(className) {
        return document.getElementsByClassName(className)
    },

    getStyle(id) {
        this.getId(id);
        return window.getComputedStyle(this.getId(id))
    },

    addClass(id, className) {
        var e = this.getId(id);
        return e.classList.add(className);
    },

    removeClass(id, className) {
        var e = this.getId(id);
        return e.classList.remove(className);
    }
}