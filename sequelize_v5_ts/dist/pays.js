"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//exemple: (1 , "France" , "Paris") 
//real class for instanciation ,  with constructor .
class PaysObject {
    constructor(idPays = 0, name = "?", capitale = "?") {
        this.idPays = idPays;
        this.name = name;
        this.capitale = capitale;
    }
}
exports.PaysObject = PaysObject;
