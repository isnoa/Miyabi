// const { DataTypes } = require('sequelize');
// const sequelize = require('../events/handler/connectDB.js');
// const user = require('./user.js');

// const hoyolab = sequelize.define('hoyolab', {
//     num: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         comment: "고유 순서 넘버"
//     },
//     is_authorized: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//         comment: "쿠키를 이용한 인증 여부"
//     },
//     is_autocheckin: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//         comment: "자동 출석체크 사용 여부"
//     },
//     authcookie: {
//         type: DataTypes.STRING(112),
//         allowNull: true,
//         comment: "암호화된 인증용 쿠키"
//     },
//     hoyolab_uid: {
//         type: DataTypes.STRING(9),
//         allowNull: true,
//         comment: "고유 HoYoLAB uid"
//     }
// }, {

//     charset: "utf8", // 한국어 설정
//     collate: "utf8_general_ci", // 한국어 설정
//     tableName: 'hoyolab', // 테이블 이름
//     timestamps: true, // createAt & updateAt 활성화
//     underscored: true,
//     paranoid: false // deletedAt 활성화
// });

// // user와 hoyolab 테이블 간의 관계 설정 (user_id)
// hoyolab.belongsTo(user, { foreignKey: 'user_id' });

// module.exports = hoyolab;
