let eventObj = require('./static/eventObj');

function randomNumbers(a, b) {
    return Math.random() - 0.5;
};


function mixImages(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

module.exports = {
    data: [],
    getSize() {
        return new Promise((resolve, reject)=> {
            eventObj.ajaxGet('https://kde.link/test/get_field_size.php', function(data) {
                resolve(data);
            })
        })
    },
    getImages() {
        var imagePath = [];
        for(var i = 0; i<10; i++) {
            imagePath.push('https://kde.link/test/'+ i +'.png');
        }
        return imagePath;
    },
    getMixArr(width, height) {
        let allImg = mixImages( this.getImages() );
        newArr = [];
        let maxImg = allImg.length;
        let counter = 0;

        for(let i = 0; i < width*height/2; i++) {
            if( !allImg[counter] ) {
                counter = 0;
                continue;
            }
            newArr.push(allImg[counter]);
            if ( allImg[counter] ){
                counter++;
            }
        };
        return newArr;
    },
    saveData(width, height) {
        let firstArr = this.getMixArr(width,height);
        let secondArr = mixImages( firstArr.slice() );

        this.data = firstArr.concat(secondArr);
    },
    getData(index) {
        let x = 0;
        return this.data;
    },
    getImgToIndex(index) {
        return this.data[index - 1];
    }

}