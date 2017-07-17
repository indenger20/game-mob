let eventObj = require('./static/eventObj');



module.exports = {

    getSize() {
        return new Promise((resolve, reject)=> {
            eventObj.ajaxGet('size', function(data) {
                resolve(data);
            })

        })
    },

    getImgToIndex(index) {

        return new Promise((resolve, reject)=> {
            eventObj.ajaxGet(`/imgToIndex?index=${index}`, function(data) {
                resolve(data);
            });

        })
    },
    isCheck(index1, index2) {
        return new Promise((resolve, reject)=> {
            eventObj.ajaxGet(`/isCheck?index1=${index1}&index2=${index2}`, function(data) {
                resolve(data);
            })

        })
    }

}