import express from 'express';
import uuidv4 from 'uuid/v4';
import { User, Domain } from './models';

const router = express.Router();

router.post('/', (req, res, next) => {
  res.json('로그인 구현 중');
});

router.post('/domain', (req, res, next) => {
  Domain.create({
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
