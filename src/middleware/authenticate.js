import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  // 1. Перевіряємо наявність обох кук
  if (!sessionId || !accessToken) {
    throw createHttpError(401, 'Missing access token');
  }

  // 2. Шукаємо сесію за sessionId та accessToken
  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // 3. Перевіряємо термін дії access токена
  const isAccessTokenExpired = session.accessTokenValidUntil < new Date();
  if (isAccessTokenExpired) {
    throw createHttpError(401, 'Access token expired');
  }

  // 4. Шукаємо користувача, пов'язаного з цією сесією
  const user = await User.findById(session.userId);
  if (!user) {
    throw createHttpError(401);
  }

  // 5. Додаємо користувача до запиту і передаємо управління далі
  req.user = user;
  next();
};
