import { Response } from "express";
import { ErrorWithStatus } from "../error/Errors";

//NB: in case of Error , Promise<T> is excepted to reject ErroWithStatus or subclass

export function promiseToJsonResponse<T>( promise : Promise<T> , res : Response) : any{
promise.then((data: Object) => {
  return res.status(200).json(data);
})
.catch((err: ErrorWithStatus) => {
  let status = err.status ? err.status : 500;
  return res.status(status).json(err);
})
}