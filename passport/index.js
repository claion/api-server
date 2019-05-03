import local from './localStrategy';

import db from '../models';

export default passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.User.findOne({
      where: { id },
      include: [
        {
          model: db.User,
          attributes: ['id', 'username'],
          as: 'Followers'
        },
        {
          model: db.User,
          attributes: ['id', 'username'],
          as: 'Followings'
        }
      ]
    })
      .then(user => done(null, user))
      .catch(e => done(e));
  });

  local(passport);
};
