export type Session = {
  userId: string;
  deviceId: string;
  deviceName: string | null;
  ip: string;
  iat: number;
  exp: number;
};
