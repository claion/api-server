import express from 'express';
import morgan from 'morgan';
import session from 'session';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import flash from 'connect-flash';
import Router from './routers';

require('dotenv').config();

import { sequelize } from './models';

const app = express();

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

app.use('/uploads', express.static('uploads'));
app.use('/static', express.static('static'));

app.use('/', Router);

const server = app.listen(process.env.PORT || 8888, () => {
  console.log('서버 레디');
});
