
let View = require('./view');
let DOMmethods = require('./static/DOMmethods');
let Presenter = require('./presenter');

let myGame = new Presenter(new View());

myGame.newGame();

DOMmethods.getId('btn').addEventListener('click', function(e) {
    myGame.reset();
    console.log(myGame)
    e.preventDefault()
})