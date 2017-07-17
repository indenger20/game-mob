let eventObj = require('./static/eventObj');
let DOMmethods = require('./static/DOMmethods');

class View {
    constructor() {
        let thet = this;
        let flag = false;
        this.allLinks = null;

        this.handlers = {};

        this.onHandle = function(e = window.event) {
            let $this = e.target;

            if( $this.dataset.id ) {
                let index = $this.dataset.id ? $this.dataset.id : null;

                if(index) {
                    let flag = index ? $this.classList.contains('active') : null;
                    let firstOpen = thet.checkAllActive('active', thet.getAvailableLinks());

                    if(!firstOpen && !flag) {
                        thet.trigger('firstOpen', e.target, index);
                    }else if( firstOpen && !flag ) {
                        thet.trigger('doubleOpen', e.target, index, firstOpen);
                    }
                }

                let closedElems = thet.getAvailableLinks();
                if(closedElems.length === 2) {
                    setTimeout(()=> {
                        let closedElems = thet.getAvailableLinks();
                        if(!closedElems.length) {
                            thet.trigger('finish');
                        }
                    }, 200)
                }

            }
        };

        this.offHandle = function(e = window.event) {
            e.preventDefault();
        }

        DOMmethods.getId('container').addEventListener('click', this.onHandle, true);
    }

    render(width, height) {
        let list = document.createElement('ul');
        list.classList.add('game-app__list');
        let counter = 0;
        for(let i = 0; i < height; i++) {
            let row = document.createElement('div');
            for(var j = 0; j < width; j++) {
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

            this.handlers[event].forEach(function(fn) {
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
        for(let i = 0; i < allImg.length; i++) {
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
        for(let i = 0; i < allElems.length; i++) {
            if( !allElems[i].classList.contains('isClose') ) {
                filterElems.push(allElems[i]);
            }
        }
        return filterElems;
    }

    checkAllActive(className, elems) {
        let res = false;
        for(let el of elems) {
           if(el.classList.contains(className)) {
               res = el.dataset.id;
               break;
           }
        }
        return res;
    }

    blockedImg(firstIndex, secondIndex) {
        let allBlocks = View.prototype.getAllLinks();
        for(let i = 0; i < allBlocks.length; i++) {
            if( allBlocks[i].dataset.id == firstIndex || allBlocks[i].dataset.id == secondIndex ) {
                allBlocks[i].classList.add('isClose');
            }
        }
    }

    removeGame() {
        let elems = DOMmethods.getId('container').children;
        for(let i = 0; i < elems.length; i++) {
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