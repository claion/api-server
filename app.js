import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import passport from 'passport';

require('dotenv').config();

import indexRouter from './routers';
import db from './models';
import passportConfig from './passport';

const app = express();
db.sequelize.sync();
passportConfig(passport);

app.set('port', process.env.PORT || 8002);

const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false
  }
});

app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('static'));

app.use('/', indexRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const server = app.listen(app.get('port'), () => {
  console.log('서버 레디');
});
