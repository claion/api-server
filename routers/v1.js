import express from 'express';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../middlewares';
import db from '../models';

const router = express.Router();

router.post('/token', async (req, res) => {
  const { clientSecret } = req.body;
  try {
    const domain = await db.Domain.findOne({
      where: { clientSecret },
      include: {
        model: db.User,
        attribute: ['username', 'id']
      }
    });
    if (!domain) {
      return res.status(401).json({
        code: 401,
        message: '등록되지 않은 도메인 입니다.'
      });
    }

    const token = jwt.sign(
      {
        id: domain.userId,
        username: domain.user.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 1000 * 10,
        issuer: 'api-server'
      }
    );

    return res.json({
      code: 200,
      message: '토큰 발급',
      token
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      code: 500,
      message: '서버 에러'
    });
  }
});

router.get('/test', verifyToken, (req, res) => {
  res.json(req.decode);
});

export default router;
