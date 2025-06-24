const connectDB = async (URL) => {
    try {
        await mongoose.connect(URL, {
            serverSelectionTimeoutMS: 30000,  // 30 seconds for server selection
            socketTimeoutMS: 45000,          // 45 seconds for socket timeout
            connectTimeoutMS: 30000,         // 30 seconds for initial connection
            maxPoolSize: 10,                 // Limit connections to avoid overload
            retryWrites: true,               // Enable retry on write failures
            retryReads: true                // Enable retry on read failures
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
    console.log("Mongoose disconnected! Attempting reconnect...");
    setTimeout(() => connectDB(process.env.MONGO_URL), 5000); 
});

module.exports = { connectDB };