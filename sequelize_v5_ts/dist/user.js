"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//real class for instanciation ,  with constructor .
class UserObject {
    constructor(id, firstName = "?", lastName = "?", phoneNumber = "?", email = "?") {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.email = email;
    }
}
exports.UserObject = UserObject;
