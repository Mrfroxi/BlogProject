import {Router} from "express";
import {authLoginValidator} from "../validators/auth-login.validator";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation-result";
import {authLoginHandler} from "./handlers/auth-login.handler";


export const authRoute = Router({})

authRoute
    .post('/login',authLoginValidator,inputValidationResultMiddleware,authLoginHandler)

