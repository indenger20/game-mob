let eventObj = require('./static/eventObj');
let DOMmethods = require('./static/DOMmethods');
let model = require('./model');


module.exports = function (view) {
    let thet = this;

    view.on('firstOpen', function( target, index ) {
        model.getImgToIndex(index).then( data => {
            view.openImg(target, data.img);
        });
    });

    view.on('doubleOpen', function( target, index, prevIndex ) {
        view.disableEvent();
        model.getImgToIndex(index).then( data => {
            view.openImg(target, data.img);
            view.enableEvent();
        });
        model.isCheck(index,prevIndex).then(data=> {
                let isCheck = data.flag;
            if(isCheck) {
                view.blockedImg(index, prevIndex);
                view.enableEvent();
            }else {
                setTimeout(function () {
                    view.closeImg();
                    view.enableEvent();
                }, 500);
            }
        })



    });

    view.on('finish', function() {
        console.log('finish')
        thet.resetGame();
    });

    this.resetGame = function() {
        view.removeGame();
        thet.newGame();
    }

    this.newGame = function() {
        model.getSize().then((data)=> {
            let width = data.width <= 8 ? data.width : 8,
            height = data.height <= 8 ? data.height: 8;

            view.render(width, height);

        });
    }

    return {
        newGame: this.newGame,
        reset: this.resetGame
    }


}