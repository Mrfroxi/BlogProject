import {Router} from "express";
import {authLoginValidator} from "../validators/auth-login.validator";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation-result";
import {authLoginHandler} from "./handlers/auth-login.handler";
import {JwtAuthorizations} from "./middleware/jwt-authorizations.guard-middleware";
import {authMeHandler} from "./handlers/auth-me.handler";


export const authRoute = Router({})

authRoute
    .post('/login',authLoginValidator,inputValidationResultMiddleware,authLoginHandler)
    .get('/me',JwtAuthorizations,authMeHandler)

