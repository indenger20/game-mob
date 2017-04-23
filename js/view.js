let eventObj = require('./static/eventObj');
let DOMmethods = require('./static/DOMmethods');

module.exports = function() {
    var thet = this;
    this.handlers = {};

    document.addEventListener('click', function(e) {
        thet.trigger('check', e.target);
    });


    this.render = function(width, height) {

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
    },

    this.on = function(event, fn) {
        this.handlers[event] = this.handlers[event] || [];

        if (this.handlers[event].indexOf(fn) === -1) {
            this.handlers[event].push(fn);
        }
    },
    this.trigger = function(event) {
        if (this.handlers[event]) {
            var args = Array.prototype.slice.call(arguments, 1);

            this.handlers[event].forEach(function(fn) {
                fn.apply(null, args);
            });
        }
    },

    this.openImg = function(target, src, flag) {
        console.log(target);
        target.src = src;
        target.parentNode.classList.add('active');
    },

    this.closeImg = function() {
        let allImg = DOMmethods.getClass('game-app__link');
        for(let i = 0; i < allImg.length; i++) {
            allImg[i].classList.remove('active');
            allImg[i].children[0].src = 'image/default.png';
        }
    }




};