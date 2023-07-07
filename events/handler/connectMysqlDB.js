const Sequelize = require("sequelize");

const sequelize = new Sequelize('miyabi', process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    host: 'localhost',
    port: '3306',
    dialect: 'mysql',
    logging: false
});

const connectMysqlDB = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        console.log('Connected to the MySQL database.');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = { sequelize, connectMysqlDB };