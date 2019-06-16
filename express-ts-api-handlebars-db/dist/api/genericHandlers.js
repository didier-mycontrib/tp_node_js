"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//NB: in case of Error , Promise<T> is excepted to reject ErroWithStatus or subclass
function promiseToJsonResponse(promise, res) {
    promise.then((data) => {
        return res.status(200).json(data);
    })
        .catch((err) => {
        let status = err.status ? err.status : 500;
        return res.status(status).json(err);
    });
}
exports.promiseToJsonResponse = promiseToJsonResponse;
