import {Router} from "express";
import {authLoginValidator} from "../validators/auth-login.validator";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/input-validation-result";
import {authLoginHandler} from "./handlers/auth-login.handler";
import {JwtAuthorizations} from "./middleware/jwt-authorizations.guard-middleware";
import {authMeHandler} from "./handlers/auth-me.handler";
import {authRegistrationHandler} from "./handlers/auth-registration.handler";
import {registerValidators} from "../validators/auth-registration.validator";
import {codeValidator} from "../validators/auth-registration-confirmation.validator";
import {authRegistrationConfirmationHandler} from "./handlers/auth-registration-confirmation.handdler";


export const authRoute = Router({})

authRoute
    .post('/login',authLoginValidator,inputValidationResultMiddleware,authLoginHandler)
    .get('/me',JwtAuthorizations,authMeHandler)
    .post('/registration',registerValidators,inputValidationResultMiddleware,authRegistrationHandler)
    .post('/registration-confirmation',codeValidator,inputValidationResultMiddleware,authRegistrationConfirmationHandler)

