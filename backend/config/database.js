const mongoose = require('mongoose');

const connectDatabase = async () => {
    try {
        // Change this line to use process.env
        const MONGODB_URI = process.env.MONGODB_URI; 
        
        // Optional: Add a check to make sure the URI is actually being loaded
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env file");
        }

        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDatabase;