let eventObj = require('./static/eventObj');
let DOMmethods = require('./static/DOMmethods');
let model = require('./model');


module.exports = function (view) {

    model.getSize().then((data)=> {

        let width = data.width <= 8 ? data.width : 8,
            height = data.height <= 8 ? data.height: 8;

        view.render(width, height);

        model.saveData(width, height);

    });

    view.on('check', function( target ) {

        let index = target.parentNode.dataset.id;
        let flag = index ? target.classList.contains('active') : null
        view.closeImg();
        if(index) {
            let thisImg = model.getImgToIndex(index);
            if(!flag) {
                view.openImg(target, thisImg);
            }

        }

    });


}