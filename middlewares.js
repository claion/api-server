import jwt from 'jsonwebtoken';

export const isNotLoggedIn = (req, res, next) => {
  // 지금 로그인 안한 상태: next
  if (!req.isAuthenticate()) next();
  else {
    res.status(403).json({ code: res.status, data: '로그인 되어 있습니다.' });
  }
};

export const isLoggedIn = (req, res, next) => {
  // 지금 로그인 한 상태: next
  if (req.isAuthenticate()) next();
  else res.status(401).redirect('/');
};

export const verifyToken = (req, res, next) => {
  try {
    req.decode = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다'
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.'
    });
  }
};
