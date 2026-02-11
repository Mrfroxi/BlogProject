import { Router } from 'express';
import { refreshTokenValidator } from '../../auth/validators/refreshToken.validator';
import { securityDeviceGetListHandler } from '../../entities/session/handlers/securityDevice-get-list.handler';
import { securityDeviceTerminateAllDeviceSHandler } from '../../entities/session/handlers/securityDevice-terminateAll-device`s.handler';
import { securityDeviceTerminateOneDeviceHandler } from '../../entities/session/handlers/securityDevice-terminateOne-device.handler';
import { deviceIdValidator } from '../../entities/session/validators/session-delete-one.validator';
import { inputValidationResultMiddleware } from '../middlewares/validation/input-validation-result';

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/', refreshTokenValidator, securityDeviceGetListHandler);
securityDevicesRouter.delete('/', refreshTokenValidator, securityDeviceTerminateAllDeviceSHandler);
securityDevicesRouter.delete(
  '/:deviceId',
  deviceIdValidator,
  inputValidationResultMiddleware,
  refreshTokenValidator,
  securityDeviceTerminateOneDeviceHandler
);
