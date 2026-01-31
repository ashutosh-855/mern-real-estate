import mongoose from "mongoose";
import dotenv from "dotenv";
import Listing from "./models/listing.model.js";
import User from "./models/user.model.js";
import fs from "fs";
import path from "path";
import bcryptjs from "bcryptjs";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust path to point to data/real_estate_dataset.json (which is in root/data)
// api/seed_atlas.js is in /api, so we need to go up one level
const DATA_FILE = path.resolve(__dirname, "..", "data", "real_estate_dataset.json");

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to MongoDB Atlas!");
        seedDB();
    })
    .catch((err) => {
        console.error("MongoDB Connection Error:", err);
        console.error("Please check your MONGO_URL in .env");
        process.exit(1);
    });

async function seedDB() {
    try {
        // 1. Create Seed User (so listings have an owner)
        const seedUserEmail = "seed@mern.estate";
        let user = await User.findOne({ email: seedUserEmail });

        if (!user) {
            console.log("Creating default seed user...");
            const hashedPassword = bcryptjs.hashSync("password123", 10);
            user = new User({
                username: "Admin",
                email: seedUserEmail,
                password: hashedPassword,
                avatar: "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
            });
            await user.save();
            console.log("Seed User created with ID:", user._id);
        } else {
            console.log("Using existing Seed User:", user._id);
        }

        // 2. Read Enriched Data
        if (!fs.existsSync(DATA_FILE)) {
            throw new Error(`Enriched data file not found at ${DATA_FILE}. Run enrich.js first.`);
        }
        const rawData = fs.readFileSync(DATA_FILE, "utf-8");
        const json = JSON.parse(rawData);

        // Handle array or object structure
        const listings = Array.isArray(json)
            ? (json[0]?.real_estate_listings || json)
            : (json.real_estate_listings || []);

        if (listings.length === 0) {
            console.log("No listings found to seed.");
            process.exit();
        }

        console.log(`Found ${listings.length} listings in dataset.`);

        // 3. Clean up previous seed data (optional, to avoid duplicates)
        console.log("Clearing old seed listings...");
        await Listing.deleteMany({ userRef: user._id });

        // 4. Map and Insert
        console.log("Mapping data to Listing schema...");
        const newListings = listings.map(item => {
            // Fallbacks for missing data
            const beds = item.beds && item.beds > 0 ? item.beds : 1; // Default 1 bed if missing
            const baths = item.baths && item.baths > 0 ? item.baths : 1;
            const price = item.price && item.price > 0 ? item.price : 4500000; // Default price

            // Construct a catchy title
            let name = item.type || "Property";
            if (item.neighborhood && item.city) {
                name = `${beds} BHK ${item.type} in ${item.neighborhood}, ${item.city}`;
            }

            // Ensure name isn't too long (MongoDB usually fine, but good practice)
            if (name.length > 60) name = name.substring(0, 60) + "...";

            return {
                name: name,
                description: item.description || "No description available.",
                address: `${item.neighborhood || 'Unknown Location'}, ${item.city || 'India'}`,
                regularPrice: price,
                discountPrice: 0,
                bathrooms: baths,
                bedrooms: beds,
                furnished: Math.random() > 0.7, // Randomly mark some as furnished
                parking: Math.random() > 0.6,   // Randomly mark some with parking
                type: "sale", // All are for sale based on dataset
                offer: false,
                imageUrls: item.images && item.images.length > 0 ? item.images : [
                    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"
                ],
                userRef: user._id.toString()
            };
        });

        const upcomingListings = [
            {
                name: "The Royal Orchid | Mumbai Launch",
                description: "Ultra-luxury 4BHK apartments with panoramic sea views. Launching exclusively for members.",
                address: "Worli, Mumbai",
                regularPrice: 85000000,
                discountPrice: 75000000,
                bathrooms: 4,
                bedrooms: 4,
                furnished: true,
                parking: true,
                type: "sale",
                offer: true,
                imageUrls: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200"],
                userRef: user._id.toString(),
                isUpcoming: true,
                launchDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
                hypeDescription: "Mumbai's Most Awaited Luxury Launch! Pre-register for Early Bird Pricing."
            },
            {
                name: "Silicon Valley Towers | Bangalore",
                description: "Smart 2BHK flats in the heart of the tech corridor. Optimized for modern living.",
                address: "Whitefield, Bangalore",
                regularPrice: 12000000,
                discountPrice: 10500000,
                bathrooms: 2,
                bedrooms: 2,
                furnished: false,
                parking: true,
                type: "sale",
                offer: true,
                imageUrls: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"],
                userRef: user._id.toString(),
                isUpcoming: true,
                launchDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
                hypeDescription: "The Techie's Dream Home! Launching in 5 days with exclusive furniture package."
            },
            {
                name: "Verdant Greens | Pune",
                description: "Eco-friendly villa living with private gardens and forest trails.",
                address: "Baner-Pashan Link Rd, Pune",
                regularPrice: 45000000,
                discountPrice: 42000000,
                bathrooms: 3,
                bedrooms: 3,
                furnished: true,
                parking: true,
                type: "sale",
                offer: true,
                imageUrls: ["https://images.unsplash.com/photo-1628744276229-49744383636f?w=1200"],
                userRef: user._id.toString(),
                isUpcoming: true,
                launchDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
                hypeDescription: "Live in Paradise! Launching soon. Only 12 Units Available."
            },
            {
                name: "The Capital Sky | Delhi",
                description: "Penthouse suites with views of the Central Business District.",
                address: "Connaught Place, Delhi",
                regularPrice: 120000000,
                discountPrice: 110000000,
                bathrooms: 5,
                bedrooms: 5,
                furnished: true,
                parking: true,
                type: "sale",
                offer: true,
                imageUrls: ["https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200"],
                userRef: user._id.toString(),
                isUpcoming: true,
                launchDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
                hypeDescription: "Sky High Luxury! Launching in 48 Hours. Ultimate VIP Access."
            },
            {
                name: "Marina Bliss | Chennai",
                description: "Modern beach-facing condos with world-class amenities.",
                address: "East Coast Road, Chennai",
                regularPrice: 28000000,
                discountPrice: 25000000,
                bathrooms: 3,
                bedrooms: 3,
                furnished: false,
                parking: true,
                type: "sale",
                offer: true,
                imageUrls: ["https://images.unsplash.com/photo-1515263487990-61b07816b324?w=1200"],
                userRef: user._id.toString(),
                isUpcoming: true,
                launchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                hypeDescription: "Beach Life Awaits! Secure your unit now with a pre-launch booking."
            },
            {
                name: "Heritage Heights | Hyderabad",
                description: "Gated community of high-end independent villas.",
                address: "Jubilee Hills, Hyderabad",
                regularPrice: 95000000,
                discountPrice: 88000000,
                bathrooms: 4,
                bedrooms: 4,
                furnished: true,
                parking: true,
                type: "sale",
                offer: true,
                imageUrls: ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1200"],
                userRef: user._id.toString(),
                isUpcoming: true,
                launchDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
                hypeDescription: "Nizam's Luxury Redefined! Pre-booking open for Phase 1."
            }
        ];

        const allToInsert = [...newListings, ...upcomingListings];

        console.log(`Inserting ${allToInsert.length} total listings into Atlas (including ${upcomingListings.length} upcoming)...`);
        await Listing.insertMany(allToInsert);
        console.log(`Successfully seeded ${allToInsert.length} listings!`);
        console.log("Database migration complete. You can now start the app.");

        process.exit();

    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}
