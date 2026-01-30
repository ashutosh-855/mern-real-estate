import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URL)
    .then(async () => {
        console.log("Connected to MongoDB Successfully!");

        // Get any user from the database
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const user = await User.findOne();

        if (user) {
            console.log("\n✅ Found user ID:");
            console.log(user._id.toString());
            console.log("\nCopy this ID and replace SAMPLE_USER_ID in seedListings.js");
        } else {
            console.log("\n⚠️  No users found in database.");
            console.log("Please create a user account first by signing up on the website.");
        }

        mongoose.connection.close();
        process.exit(0);
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
        process.exit(1);
    });
