/**
 * Created by User on 18.06.2017.
 */

var obj = {
    width: 2,
    height: 2
};

var express = require('express');
var app = express();
var path = require("path");

var request = require("request");

var url = "https://kde.link/test/get_field_size.php"

//model module
let model = require('./model');

// сообщаем Node где лежат ресурсы сайта
var parentDir = path.join(__dirname, '../');
console.log(parentDir)
app.use(express.static(parentDir));

// создаём маршрут для главной страницы
// http://localhost:8080/
app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/size', function (req, res) {
    request({
        url: url,
        json: true
    }, function (error, response, data) {

        if (!error && response.statusCode === 200) {
            model.saveData(data);
            res.send(data);
        }
    })

});

app.get('/imgToIndex', function (req, res) {
    let val = req.query.index;
    let img = model.getImgToIndex(val);
    let dataStr = JSON.stringify( {img:img} );
    res.send(dataStr);
});
app.get('/isCheck', function (req, res) {
    let val1 = +req.query.index1;
    let val2 = +req.query.index2;

    let flag = model.isCheck(val1, val2);
    let dataStr = JSON.stringify( {flag:flag} );
    res.send(dataStr);
});

// запускаем сервер на порту 8080
app.listen(8080);
// отправляем сообщение
console.log('Сервер стартовал!');





// ------ этот код запускает веб-сервер -------


