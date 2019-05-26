var mycomputer_module = require('./mycomputer_module'); // ./ for searching in local relative
var markdown = require('markdown').markdown; // without "./" in node_modules sub directory

var x=5;
var y=6;
var resString = mycomputer_module.myAddStringFct(x,y);
console.log(resString);

var resHtmlString = markdown.toHTML("**"+resString+"**");
//NB: "markdown" est un mini langage de balisage 
// où un encadrement par ** génère un équivalent de
// <strong> HTML (proche de <bold>)
console.log(resHtmlString);