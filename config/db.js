const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connect with DB")
    } catch (error) {
        throw error.message;
    }
}

module.exports = connectDB

