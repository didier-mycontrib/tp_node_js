"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// ErrorWithStatus est une version améliorée de Error (err.message)
// avec un attribut status (404,500,...) permettant une automatisation
// du retour du status http dans le "apiErrorHandler"
//NB: Error is a very special class (native)
//subclass cannot be test with instanceof , ...
var ErrorWithStatus = /** @class */ (function (_super) {
    __extends(ErrorWithStatus, _super);
    function ErrorWithStatus(message, status) {
        if (status === void 0) { status = 500; }
        var _this = _super.call(this, message) || this;
        _this.msg = message;
        _this.status = status;
        return _this;
    }
    ErrorWithStatus.extractStatusInNativeError = function (e) {
        var status = 500; //500 (Internal Server Error)
        var jsonStr = JSON.stringify(e);
        var errWithStatus = JSON.parse(jsonStr);
        if (errWithStatus.status)
            status = errWithStatus.status;
        return status;
    };
    return ErrorWithStatus;
}(Error));
exports.ErrorWithStatus = ErrorWithStatus;
var NotFoundError = /** @class */ (function (_super) {
    __extends(NotFoundError, _super);
    function NotFoundError(message, status) {
        if (message === void 0) { message = "not found"; }
        if (status === void 0) { status = 404; }
        return _super.call(this, message, status) || this;
    }
    return NotFoundError;
}(ErrorWithStatus));
exports.NotFoundError = NotFoundError;
var ConflictError = /** @class */ (function (_super) {
    __extends(ConflictError, _super);
    function ConflictError(message, status) {
        if (message === void 0) { message = "conflict (with already existing)"; }
        if (status === void 0) { status = 409; }
        return _super.call(this, message, status) || this;
    }
    return ConflictError;
}(ErrorWithStatus));
exports.ConflictError = ConflictError;
exports.apiErrorHandler = function (err, req, res, next) {
    //console.log("in apiErrorHandler err=", err + " " + JSON.stringify(err));
    //console.log("in apiErrorHandler typeof err=",typeof err);
    if (typeof err == 'string') {
        res.status(500).json({ errorCode: '500', message: 'Internal Server Error :' + err });
    }
    else if (err instanceof Error) {
        //console.log("in apiErrorHandler err is instanceof Error");
        var status = ErrorWithStatus.extractStatusInNativeError(err);
        res.status(status).json({ errorCode: "" + status, message: err.message });
    }
    else
        res.status(500).json({ errorCode: '500', message: 'Internal Server Error' });
};
