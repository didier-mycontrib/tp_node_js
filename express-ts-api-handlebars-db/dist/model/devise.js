"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Devise in a natural/simple type name for every technology
//real class for instanciation ,  with constructor .
class DeviseObject {
    constructor(code = "?", name = "?", change = 0) {
        this.code = code;
        this.name = name;
        this.change = change;
    }
}
exports.DeviseObject = DeviseObject;
//exemples: ("USD" , "dollar" , 1) ,  ("EUR" , "euro" , 0.9)
