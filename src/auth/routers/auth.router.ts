import { Router } from 'express';
import { authLoginValidator } from '../validators/auth-login.validator';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result';
import { authLoginHandler } from './handlers/auth-login.handler';
import { JwtAuthorizations } from './middleware/jwt-authorizations.guard-middleware';
import { authMeHandler } from './handlers/auth-me.handler';
import { authRegistrationHandler } from './handlers/auth-registration.handler';
import { registerValidators } from '../validators/auth-registration.validator';
import { codeValidator } from '../validators/auth-registration-confirmation.validator';
import { authRegistrationConfirmationHandler } from './handlers/auth-registration-confirmation.handdler';
import { emailResendingValidator } from '../validators/auth-registration-resending.validator';
import { authRegistrationResendingHandler } from './handlers/auth-registration-emailResending';
import { authRefreshTokenHandler } from './handlers/auth-refreshToken.handler';
import { authLogoutHandler } from './handlers/auth-logout.handler';
import { rateLimitMiddleware } from '../../entities/rateLimit/middleware/rateLimit-middleware';

export const authRoute = Router({});

authRoute
  .post(
    '/login',
    rateLimitMiddleware,
    authLoginValidator,
    inputValidationResultMiddleware,
    authLoginHandler
  )
  .get('/me', JwtAuthorizations, authMeHandler)
  .post(
    '/registration',
    rateLimitMiddleware,
    registerValidators,
    inputValidationResultMiddleware,
    authRegistrationHandler
  )
  .post(
    '/registration-confirmation',
    rateLimitMiddleware,
    codeValidator,
    inputValidationResultMiddleware,
    authRegistrationConfirmationHandler
  )
  .post(
    '/registration-email-resending',
    rateLimitMiddleware,
    emailResendingValidator,
    inputValidationResultMiddleware,
    authRegistrationResendingHandler
  )

  .post('/refresh-token', refreshTokenValidator, authRefreshTokenHandler);
// .post('/logout', refreshTokenValidator, authLogoutHandler);
