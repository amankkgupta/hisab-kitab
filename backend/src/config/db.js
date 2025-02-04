const mongoose= require('mongoose');

const dbconnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected");
    } catch (error) {
        console.log("mongoDB connection failed", error);
        process.exit(1);
    }
}

module.exports = dbconnect;