import { Router } from 'express';
import { AuthController } from './auth.controller';
import { authLoginValidator } from '../validators/auth-login.validator';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result';
import { registerValidators } from '../validators/auth-registration.validator';
import { codeValidator } from '../validators/auth-registration-confirmation.validator';
import { emailResendingValidator } from '../validators/auth-registration-resending.validator';
import { rateLimitMiddleware } from '../../entities/rateLimit/middleware/rateLimit-middleware';
import { refreshTokenValidator } from '../validators/refreshToken.validator';
import { container } from '../../composition-root';
import { JwtAuthorizations } from './middleware/jwt-authorizations.guard-middleware';
import { emailValidator } from '../validators/recovery-password.validator';
import { newPasswordValidator } from '../validators/new-password.validator';

export const authRoute = Router({});

const authController = container.get<AuthController>(AuthController);

authRoute
  .post(
    '/login',
    rateLimitMiddleware,
    authLoginValidator,
    inputValidationResultMiddleware,
    authController.login.bind(authController)
  )
  .get('/me', JwtAuthorizations, authController.me.bind(authController))
  .post(
    '/registration',
    rateLimitMiddleware,
    registerValidators,
    inputValidationResultMiddleware,
    authController.registration.bind(authController)
  )
  .post(
    '/registration-confirmation',
    rateLimitMiddleware,
    codeValidator,
    inputValidationResultMiddleware,
    authController.registrationConfirmation.bind(authController)
  )
  .post(
    '/registration-email-resending',
    rateLimitMiddleware,
    emailResendingValidator,
    inputValidationResultMiddleware,
    authController.registrationEmailResending.bind(authController)
  )
  .post('/refresh-token', refreshTokenValidator, authController.refreshToken.bind(authController))
  .post('/logout', refreshTokenValidator, authController.logout.bind(authController))
  .post(
    '/password-recovery',
    rateLimitMiddleware,
    emailValidator,
    inputValidationResultMiddleware,
    authController.passwordRecovery.bind(authController)
  )

  .post(
    '/new-password',
    rateLimitMiddleware,
    newPasswordValidator,
    inputValidationResultMiddleware,
    authController.newPassword.bind(authController)
  );
