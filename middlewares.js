export const isNotLoggedIn = (req, res, next) => {
  // 지금 로그인 안한 상태: next
  if (!req.user) next();
  else {
    res.status(403).json({ code: res.status, data: '로그인 되어 있습니다.' });
  }
};

export const isLoggedIn = (req, res, next) => {
  // 지금 로그인 한 상태: next
  if (req.user) next();
  else res.status(401).redirect('/');
};
