const { DataTypes } = require('sequelize');
const sequelize = require('../handler/connectDB.js');

const user = sequelize.define('user', {
    num: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    is_hide_uid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_hide_profile: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    }
}, {
    modelName: 'user',
    tableName: 'user',
    timestamps: true,
    underscored: true
});

user.associate = function (models) {
    user.belongsTo(models.zzz, { as: 'zzz', foreignKey: 'user_id' });
}

module.exports = user;