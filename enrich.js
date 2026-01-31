import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, 'data', 'real_estate_dataset.json');

// Unsplash Image Collections (High quality, Direct URLs)
const IMAGES = {
    apartment: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
        "https://images.unsplash.com/photo-1512918760383-eda2723ad6da?w=800"
    ],
    villa: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
        "https://images.unsplash.com/photo-1580587771525-78b9e3f904ca?w=800",
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
        "https://images.unsplash.com/photo-1600596542815-60c37c6525fa?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800"
    ],
    plot: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        "https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800",
        "https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=800",
        "https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?w=800"
    ]
};

const getRandomImages = (type) => {
    let collection = IMAGES.apartment; // Default
    const lowerType = (type || '').toLowerCase();

    if (lowerType.includes('villa') || lowerType.includes('house') || lowerType.includes('independent')) {
        collection = IMAGES.villa;
    } else if (lowerType.includes('plot') || lowerType.includes('land')) {
        collection = IMAGES.plot;
    }

    // Return 1 to 3 random images with unique signatures
    const numImages = Math.floor(Math.random() * 3) + 1;
    const shuffled = [...collection].sort(() => 0.5 - Math.random()).slice(0, numImages);

    return shuffled.map(url => {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}sig=${Math.floor(Math.random() * 10000)}`;
    });
};

const formatPrice = (price) => {
    if (!price) return 'Contact for Price';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString('en-IN')}`;
};

async function enrichData() {
    try {
        console.log("Reading data from:", DATA_FILE);
        if (!fs.existsSync(DATA_FILE)) {
            console.error("Data file not found!");
            return;
        }

        const rawData = fs.readFileSync(DATA_FILE, 'utf-8');
        let data = JSON.parse(rawData);

        // Handle structure: Array vs Object wrapping Array
        let listings = [];
        let isWrappedObject = false;

        if (Array.isArray(data)) {
            // Check if it's [ { real_estate_listings: [...] } ]
            if (data.length > 0 && data[0].real_estate_listings && Array.isArray(data[0].real_estate_listings)) {
                listings = data[0].real_estate_listings;
                isWrappedObject = true;
            } else {
                listings = data;
            }
        } else if (data.real_estate_listings && Array.isArray(data.real_estate_listings)) {
            listings = data.real_estate_listings;
        } else {
            console.log("Unknown data structure. Assuming empty.");
            listings = [];
        }

        if (listings.length === 0) {
            console.log("No listings found to enrich.");
            return;
        }

        console.log(`Processing ${listings.length} listings...`);

        const enrichedListings = listings.map(listing => {
            const priceText = formatPrice(listing.price);
            const typeLower = (listing.type || '').toLowerCase();
            const city = listing.city || 'India';
            const locality = listing.neighborhood || 'Prime Location';

            // Generate Description Variables
            const bhkDisplay = listing.beds && listing.beds > 0 ? `${listing.beds} BHK` : 'Spacious';
            const sizeDisplay = listing.size && listing.size !== '0' && listing.size !== '0 sqft' && listing.size !== ''
                ? listing.size
                : 'generous area';

            const baths = listing.baths && listing.baths > 0 ? listing.baths : 'modern';

            // Generate Description
            let desc = '';

            if (typeLower.includes('plot') || typeLower.includes('land')) {
                desc = `Premium residential plot available for sale in ${locality}, ${city}. `;
                desc += `This plot covers a ${sizeDisplay}, making it perfect for your dream construction or investment. `;
                desc += `Priced at ${priceText}, it offers excellent value in a developing area.`;
            } else if (typeLower.includes('villa') || typeLower.includes('independent') || typeLower.includes('house')) {
                desc = `Luxurious ${bhkDisplay} Villa property in ${locality}, ${city}. `;
                desc += `Experience premium living with modern architecture and high-end finishes. `;
                desc += `This ${sizeDisplay} villa features ${baths} bathrooms and ample living space. `;
                desc += `Listed at ${priceText}. A perfect blend of comfort and style.`;
            } else {
                // Default / Apartment
                desc = `Modern ${bhkDisplay} Apartment for sale in ${locality}, ${city}. `;
                desc += `This well-designed unit spans a ${sizeDisplay} and is ready to move in. `;
                desc += `Includes ${baths} bathrooms and contemporary fixtures. `;
                desc += `Located close to key amenities and transport links. `;
                desc += `Asking price: ${priceText}. Perfect for families or professionals.`;
            }

            return {
                ...listing,
                description: desc,
                images: getRandomImages(listing.type)
            };
        });

        // Write back preserving structure
        if (isWrappedObject) {
            data[0].real_estate_listings = enrichedListings;
        } else if (Array.isArray(data) && !isWrappedObject) {
            data = enrichedListings;
        } else {
            data.real_estate_listings = enrichedListings;
        }

        console.log("Writing enriched data...");
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
        console.log("Success! Data enriched with unique images and detailed descriptions.");

    } catch (error) {
        console.error("Error enriching data:", error);
    }
}

// Execute
(async () => {
    await enrichData();
})();
