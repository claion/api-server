import bcrypt from 'bcrypt';

import db from '../models';

const LocalStrategy = require('passport-local').Strategy;

//serialize, deserialize 설정 passport 파라메터
export default passport => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'username',
        passwordField: 'password'
      },
      async (username, password, done) => {
        try {
          const exUser = await db.User.findOne({ where: { username } });
          if (exUser) {
            const result = await bcrypt.compare(password, exUser.password);
            if (result) {
              done(null, exUser);
            } else {
              done(null, false, { message: '비밀번호 불일치' });
            }
          } else {
            done(null, false, { message: '없는 아이디' });
          }
        } catch (e) {
          console.error(e);
          next(e);
        }
      }
    )
  );
};
