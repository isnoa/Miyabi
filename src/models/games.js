// const { DataTypes } = require('sequelize');
// const sequelize = require('../events/handler/connectDB.js');
// const user = require('./user.js');

// const games = sequelize.define('games', {
//     num: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true,
//         comment: "고유 순서 넘버"
//     },
//     zzzero: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//         comment: "Zenless Zone Zero"
//     },
//     honkai_3rd: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//         comment: "Honkai Impact 3rd"
//     },
//     honkai_starrail: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//         comment: "Honkai StarRail"
//     },
//     genshin_impact: {
//         type: DataTypes.BOOLEAN,
//         allowNull: false,
//         defaultValue: false,
//         comment: "Genshin Impact"
//     }
// }, {

//     charset: "utf8", // 한국어 설정
//     collate: "utf8_general_ci", // 한국어 설정
//     tableName: 'games', // 테이블 이름
//     timestamps: true, // createAt & updateAt 활성화
//     underscored: true,
//     paranoid: false // deletedAt 활성화
// });

// // user와 games 테이블 간의 관계 설정 (user_id)
// games.belongsTo(user, { foreignKey: 'user_id' });

// module.exports = games;
