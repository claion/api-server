export default (sequelize, DataTypes) =>
  sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'local'
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true
      }
    },
    {
      timestamps: true,
      paranoid: true
    }
  );
