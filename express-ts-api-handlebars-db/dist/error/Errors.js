"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorWithStatus extends Error {
    constructor(msg = "internal server error", status = 500) {
        super();
        this.message = msg;
        this.status = status;
    }
}
exports.ErrorWithStatus = ErrorWithStatus;
;
class NotFoundError extends ErrorWithStatus {
    constructor(msg = "Not Found") {
        super(msg, 404);
    }
}
exports.NotFoundError = NotFoundError;
;
