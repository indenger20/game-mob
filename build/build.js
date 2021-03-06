(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

let View = require('./view');
let DOMmethods = require('./static/DOMmethods');
let Presenter = require('./presenter');

let myGame = new Presenter(new View());

myGame.newGame();

DOMmethods.getId('btn').addEventListener('click', function (e) {
    myGame.reset();
    console.log(myGame);
    e.preventDefault();
});

},{"./presenter":3,"./static/DOMmethods":4,"./view":6}],2:[function(require,module,exports){
let eventObj = require('./static/eventObj');

module.exports = {

    getSize() {
        return new Promise((resolve, reject) => {
            eventObj.ajaxGet('size', function (data) {
                resolve(data);
            });
        });
    },

    getImgToIndex(index) {

        return new Promise((resolve, reject) => {
            eventObj.ajaxGet(`/imgToIndex?index=${index}`, function (data) {
                resolve(data);
            });
        });
    },
    isCheck(index1, index2) {
        return new Promise((resolve, reject) => {
            eventObj.ajaxGet(`/isCheck?index1=${index1}&index2=${index2}`, function (data) {
                resolve(data);
            });
        });
    }

};

},{"./static/eventObj":5}],3:[function(require,module,exports){
let eventObj = require('./static/eventObj');
let DOMmethods = require('./static/DOMmethods');
let model = require('./model');

module.exports = function (view) {
    let thet = this;

    view.on('firstOpen', function (target, index) {
        model.getImgToIndex(index).then(data => {
            view.openImg(target, data.img);
        });
    });

    view.on('doubleOpen', function (target, index, prevIndex) {
        view.disableEvent();
        model.getImgToIndex(index).then(data => {
            view.openImg(target, data.img);
            view.enableEvent();
        });
        model.isCheck(index, prevIndex).then(data => {
            let isCheck = data.flag;
            if (isCheck) {
                view.blockedImg(index, prevIndex);
                view.enableEvent();
            } else {
                setTimeout(function () {
                    view.closeImg();
                    view.enableEvent();
                }, 500);
            }
        });
    });

    view.on('finish', function () {
        console.log('finish');
        thet.resetGame();
    });

    this.resetGame = function () {
        view.removeGame();
        thet.newGame();
    };

    this.newGame = function () {
        model.getSize().then(data => {
            let width = data.width <= 8 ? data.width : 8,
                height = data.height <= 8 ? data.height : 8;

            view.render(width, height);
        });
    };

    return {
        newGame: this.newGame,
        reset: this.resetGame
    };
};

},{"./model":2,"./static/DOMmethods":4,"./static/eventObj":5}],4:[function(require,module,exports){
let eventObj = require('./eventObj');
module.exports = {
    getId(id) {
        return document.getElementById(id);
    },

    getTag(tag) {
        return document.getElementsByTagName(tag);
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
        return document.getElementsByClassName(className);
    },

    getStyle(id) {
        this.getId(id);
        return window.getComputedStyle(this.getId(id));
    },

    addClass(id, className) {
        var e = this.getId(id);
        return e.classList.add(className);
    },

    removeClass(id, className) {
        var e = this.getId(id);
        return e.classList.remove(className);
    }
};

},{"./eventObj":5}],5:[function(require,module,exports){
module.exports = {
    addEvent: function (e, type, fn) {
        if (typeof addEventListener !== 'undefined') {
            e.addEventListener(type, fn, false);
        } else if (typeof attachEvent !== 'undefined') {
            e.attachEvent('on' + type, fn);
        } else {
            e['on' + type] = fn;
        }
    },

    removeEvent: function (e, type, fn) {
        if (typeof removeEventListener !== 'undefined') {
            e.removeEventListener(type, fn, false);
        } else if (typeof attachEvent !== 'undefined') {
            e.detachEvent('on' + type, fn);
        } else {
            e['on' + type] = null;
        }
    },

    getTarget: function (event) {
        var event = window.event || event;
        if (typeof event.target !== 'undefined') {
            return event.target;
        } else {
            return evt.srcElement;
        }
    },

    preventDefault: function (event) {
        if (typeof event.preventDefault !== 'undefined') {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    },

    ajaxGet: function (url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) callback(JSON.parse(this.responseText));
                // иначе сетевая ошибка
            }
        };
        xhr.send(null);
    }
};

},{}],6:[function(require,module,exports){
let eventObj = require('./static/eventObj');
let DOMmethods = require('./static/DOMmethods');

class View {
    constructor() {
        let thet = this;
        let flag = false;
        this.allLinks = null;

        this.handlers = {};

        this.onHandle = function (e = window.event) {
            let $this = e.target;

            if ($this.dataset.id) {
                let index = $this.dataset.id ? $this.dataset.id : null;

                if (index) {
                    let flag = index ? $this.classList.contains('active') : null;
                    let firstOpen = thet.checkAllActive('active', thet.getAvailableLinks());

                    if (!firstOpen && !flag) {
                        thet.trigger('firstOpen', e.target, index);
                    } else if (firstOpen && !flag) {
                        thet.trigger('doubleOpen', e.target, index, firstOpen);
                    }
                }

                let closedElems = thet.getAvailableLinks();
                if (closedElems.length === 2) {
                    setTimeout(() => {
                        let closedElems = thet.getAvailableLinks();
                        if (!closedElems.length) {
                            thet.trigger('finish');
                        }
                    }, 200);
                }
            }
        };

        this.offHandle = function (e = window.event) {
            e.preventDefault();
        };

        DOMmethods.getId('container').addEventListener('click', this.onHandle, true);
    }

    render(width, height) {
        let list = document.createElement('ul');
        list.classList.add('game-app__list');
        let counter = 0;
        for (let i = 0; i < height; i++) {
            let row = document.createElement('div');
            for (var j = 0; j < width; j++) {
                counter++;
                let item = document.createElement('li');
                let btn = document.createElement('div');
                let img = document.createElement('img');

                item.classList.add('game-app__item');

                btn.classList.add('game-app__link');
                btn.dataset.id = counter;

                img.classList.add('game-app__img');
                img.src = 'image/default.png';

                item.style.width = `calc(100%/${width}`;
                btn.appendChild(img);
                item.appendChild(btn);

                row.classList.add('game-app__row');
                row.append(item);
            }
            list.appendChild(row);
        }
        DOMmethods.getId('container').appendChild(list);
    }

    on(event, fn) {
        this.handlers[event] = this.handlers[event] || [];

        if (this.handlers[event].indexOf(fn) === -1) {
            this.handlers[event].push(fn);
        }
    }

    trigger(event) {
        if (this.handlers[event]) {
            var args = Array.prototype.slice.call(arguments, 1);

            this.handlers[event].forEach(function (fn) {
                fn.apply(null, args);
            });
        }
    }

    openImg(target, src, flag) {
        target.children[0].src = src;
        target.classList.add('active');
    }

    closeImg() {
        let allImg = View.prototype.getAvailableLinks();
        for (let i = 0; i < allImg.length; i++) {
            allImg[i].classList.remove('active');
            allImg[i].children[0].src = 'image/default.png';
        }
    }

    getAllLinks() {
        return DOMmethods.getClass('game-app__link');
    }

    getAvailableLinks() {
        let allElems = DOMmethods.getClass('game-app__link');
        let filterElems = [];
        for (let i = 0; i < allElems.length; i++) {
            if (!allElems[i].classList.contains('isClose')) {
                filterElems.push(allElems[i]);
            }
        }
        return filterElems;
    }

    checkAllActive(className, elems) {
        let res = false;
        for (let el of elems) {
            if (el.classList.contains(className)) {
                res = el.dataset.id;
                break;
            }
        }
        return res;
    }

    blockedImg(firstIndex, secondIndex) {
        let allBlocks = View.prototype.getAllLinks();
        for (let i = 0; i < allBlocks.length; i++) {
            if (allBlocks[i].dataset.id == firstIndex || allBlocks[i].dataset.id == secondIndex) {
                allBlocks[i].classList.add('isClose');
            }
        }
    }

    removeGame() {
        let elems = DOMmethods.getId('container').children;
        for (let i = 0; i < elems.length; i++) {
            elems[i].remove();
        }
    }

    disableEvent() {
        DOMmethods.getId('container').removeEventListener('click', this.onHandle, true);
    }

    enableEvent() {
        DOMmethods.getId('container').addEventListener('click', this.onHandle, true);
    }

}

module.exports = View;

},{"./static/DOMmethods":4,"./static/eventObj":5}]},{},[1])

//# sourceMappingURL=build.js.map
