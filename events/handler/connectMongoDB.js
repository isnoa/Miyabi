const mongoose = require('mongoose');

const connectMongoDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGODB_DATABASE_URI);
    console.log(`Connected to the Mongo database.`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = { connectMongoDB };