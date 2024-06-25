const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
const mongoURL = process.env.LOCAL_MONGODB_URI;

async function connectToMongoDB() {
    console.log("---Attempting Connection to DB...---")
    mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('---✔ Successfully connected to MongoDB--- \n');
    })
    .catch((err)=>{
        console.error('---❌ Error connecting to MongoDB:---', err);
    })
}

module.exports = connectToMongoDB;