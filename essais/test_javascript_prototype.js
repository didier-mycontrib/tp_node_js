console.log("javascript_prototype");

function Client(name){
this.name =name;
this.direBonjour = methDireBonjour;
this.showInternal = methShowInternal;
}

Client.prototype.address="1, rue elle"; //as static default address
Client.prototype.country="France"; //as static default country
//Client.prototype.liveIn = function(otherContry) { Client.prototype.country = otherContry; } //change static default property
Client.prototype.liveIn = function(otherContry) { this.country = otherContry; } //change property

function methDireBonjour(){
    console.log("Bonjour, mon nom est "+this.name);
	console.log("my default address is "+this.address);
	console.log("my default country is "+this.country);
};

function methShowInternal(){
console.log("this.constructor.toString()=" + this.constructor.toString());
console.log("this.constructor.prototype.address=" + this.constructor.prototype.address);
console.log("this.constructor.prototype.country=" + this.constructor.prototype.country);
};

var c1 = new Client("c1");
//c1.direBonjour();
c1.liveIn("USA");
//c1.country="United State of america";


var c2 = new Client("c2");
//c2.direBonjour();
c2.liveIn("UK");



c1.direBonjour();
c2.direBonjour();
/*
console.log(c1.constructor.toString());
console.log(c1.constructor.prototype.address);
console.log(c1.constructor.prototype.country);
*/
c1.showInternal();

console.log("*************  PSEUDO HERITAGE (assez fragile) entre Dog et Animal ***************");

//Methode générique pour définir un "pseudo héritage" entre 2 "speudo classes" :
var extendClass = function(child, parent) {
    var Surrogate = function() {};    //surrogate est un mot anglais qui signifie "substitut" , "de substitution"
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();
};

function Animal(){
	//this.constructor.prototype.color="black"; //not working (too early for accessing this.constructor ?)
}
Animal.prototype.name="no name";
Animal.prototype.color="black";

function Dog(type){
	this.type=type;
}
extendClass(Dog,Animal);
Dog.prototype.height="40"; // Après HERITAGE !!!



var d1 = new Dog("berger allemand");
console.log("d1.type=" + d1.type);
console.log("d1.name=" + d1.name);
console.log("d1.height=" + d1.height);
console.log("d1.color=" + d1.color);
if(d1 instanceof Dog)
	console.log("d1 is a Dog");
if(d1 instanceof Animal)
	console.log("d1 is a Animal");
