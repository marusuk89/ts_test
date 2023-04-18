import { DataTypes, Model, Sequelize } from 'sequelize';

interface UserAccountAttributes {
  email: string;
  password: string;
  login_attempt: string;
  lock_until: Date;
}

class UserAccount extends Model<UserAccountAttributes> implements UserAccountAttributes {
  public email!: string;
  public password!: string;
  public login_attempt!: string;
  public lock_until!: Date;

  static associate(models: any) {
    // define association here
  }
}

export default function (sequelize: Sequelize) {
  UserAccount.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    login_attempt: DataTypes.STRING,
    lock_until: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'UserAccount',
  });

  return UserAccount;
}
