console.log("Loading Connection.js...");

let mongoose;
try {
    mongoose = require("mongoose");
    console.log("Mongoose loaded successfully");
} catch (error) {
    console.error("Failed to load mongoose:", error);
    throw error;
}

const connectDB = async (URL) => {
    try {
        console.log("Attempting to connect to DB...");
        await mongoose.connect(URL, {
            serverSelectionTimeoutMS: 30000, 
            socketTimeoutMS: 45000, 
        });
        console.log("DB Connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
});

module.exports = { connectDB };