// import mongoose from 'mongoose';
const mongoose = require('mongoose')
const MONGO_URI = "mongodb://localhost/Inotebook"
const connectMongo = () => {
    mongoose.connect(MONGO_URI, () => {
        console.log("Connected to MongoDb ");
    })
}

module.exports = connectMongo