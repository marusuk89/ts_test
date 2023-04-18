import { Model, Sequelize } from 'sequelize';
interface UserAccountAttributes {
    email: string;
    password: string;
    login_attempt: string;
    lock_until: Date;
}
declare class UserAccount extends Model<UserAccountAttributes> implements UserAccountAttributes {
    email: string;
    password: string;
    login_attempt: string;
    lock_until: Date;
    static associate(models: any): void;
}
export default function (sequelize: Sequelize): typeof UserAccount;
export {};
