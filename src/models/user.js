const { DataTypes } = require('sequelize');
const sequelize = require('../events/handler/connectDB.js');

const user = sequelize.define('user', {
    num: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: "고유 순서 넘버"
    },
    user_id: {
        type: DataTypes.STRING(24),
        allowNull: false,
        comment: "고유 디스코드 유저 아이디"
    },
}, {

    charset: "utf8", // 한국어 설정
    collate: "utf8_general_ci", // 한국어 설정
    tableName: 'user', // 테이블 이름
    timestamps: true, // createAt & updateAt 활성화
    underscored: true,
    paranoid: true // deletedAt 활성화
});

// user와 hoyolab 테이블 간의 관계 설정 (user_id)
user.hasOne(hoyolab, { foreignKey: 'user_id' });

module.exports = user;