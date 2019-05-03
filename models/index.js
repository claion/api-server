import User from './user';
import Post from './post';
import Hashtag from './hashtag';
import Domain from './domain';
import Sequelize from 'sequelize';
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User(sequelize, Sequelize);
db.Post = Post(sequelize, Sequelize);
db.Hashtag = Hashtag(sequelize, Sequelize);
db.Domain = Domain(sequelize, Sequelize);

db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });
db.User.belongsToMany(db.User, {
  foreginKey: 'followingId',
  as: 'Followers',
  through: 'Follow'
});
db.User.belongsToMany(db.User, {
  foreignKey: 'followerId',
  as: 'Followings',
  through: 'Follow'
});
db.User.hasMany(db.Domain);
db.Domain.belongsTo(db.User);

export default db;
