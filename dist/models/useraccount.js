"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class UserAccount extends sequelize_1.Model {
    static associate(models) {
        // define association here
    }
}
function default_1(sequelize) {
    UserAccount.init({
        email: sequelize_1.DataTypes.STRING,
        password: sequelize_1.DataTypes.STRING,
        login_attempt: sequelize_1.DataTypes.STRING,
        lock_until: sequelize_1.DataTypes.DATE,
    }, {
        sequelize,
        modelName: 'UserAccount',
    });
    return UserAccount;
}
exports.default = default_1;
