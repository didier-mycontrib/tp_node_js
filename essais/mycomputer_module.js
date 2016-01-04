

var myAddStringFct = function(a,b) {
   result=a+b;
   resultString = "" + a + " + " + b +" = " + result;
   return resultString;
};

exports.myAddStringFct = myAddStringFct;