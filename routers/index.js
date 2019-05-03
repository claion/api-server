import express from 'express';
import uuidv4 from 'uuid/v4';
import passport from 'passport';
import db from '../models';
import bcrypt from 'bcrypt';
import { isLoggedIn, isNotLoggedIn } from '../middlewares';

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.user) {
    res
      .status(200)
      .json({ code: res.status, data: { home: 'api-server', user: req.user } });
  } else {
    res.status(200).json({ code: res.status, data: { home: 'api-server' } });
  }
});

router.post('/', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    return req.login(user, loginError => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

router.post('/signup', isNotLoggedIn, async (req, res, next) => {
  const {
    body: { username, password }
  } = req;
  const exUser = await db.User.findOne({ where: { username } });

  if (exUser) {
    res.status(403).json({ code: res.status, data: '이미 존재하는 아이디' });
  } else {
    const hash = await bcrypt.hash(password, 12);

    db.User.create({
      username,
      password: hash
    })
      .then(user => {
        res.status(200).json({ code: res.status, data: user });
      })
      .catch(e => {
        console.error(e);
        next(e);
      });
  }
});

router.post('/domain', (req, res, next) => {
  db.Domain.create({
    userId: req.user.id,
    host: req.body.host,
    type: req.body.type,
    clientSecret: uuidv4()
  })
    .then(data => {
      res.status(200).json({ code: res.status, data });
    })
    .catch(e => {
      next(e);
    });
});

export default router;
