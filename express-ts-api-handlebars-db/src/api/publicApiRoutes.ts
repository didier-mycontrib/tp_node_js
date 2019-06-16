import { Router, Request, Response } from "express";
import { deviseDataService } from "../dao/services.index";
import { Devise } from "../model/index.data";
import { promiseToJsonResponse } from "./genericHandlers";

export const publicApiRouter = Router();

// GET .../public/devise/EUR
publicApiRouter.route('/my-api/public/devise/:code')
.get(function (req: Request, res: Response) {
   return promiseToJsonResponse( deviseDataService.findById(req.params.code) , res);
  });

publicApiRouter.route('/my-api/public/devise')
.get(function (req: Request, res: Response) {
   return promiseToJsonResponse( deviseDataService.findAll() , res);
  });