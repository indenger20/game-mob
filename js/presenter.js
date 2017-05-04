let eventObj = require('./static/eventObj');
let DOMmethods = require('./static/DOMmethods');
let model = require('./model');


module.exports = function (view) {
    let thet = this;

    view.on('firstOpen', function( target, index ) {

        //console.log(index);
        let thisImg = model.getImgToIndex(index);
        view.openImg(target, thisImg);


    });

    view.on('doubleOpen', function( target, index, prevIndex ) {

        let thisImg = model.getImgToIndex(index);
        let isCheck = model.isCheck(index, prevIndex);
        view.openImg(target, thisImg);
        if(isCheck) {
            view.blockedImg(index, prevIndex);
        }else {
            view.disableEvent();
            setTimeout(function () {
                view.closeImg();
                view.enableEvent();
            }, 500);
        }

    });

    view.on('finish', function() {
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

            width = 2;
            height = 2;

            view.render(width, height);
            model.saveData(width, height);

        });
    }

    return {
        newGame: this.newGame,
        reset: this.resetGame
    }


}