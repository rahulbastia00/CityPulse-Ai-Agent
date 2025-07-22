require("dotenv").config();
const express = require("express");

const fetchEvents = require("./src/services/fetchEvents");
const geocodeLocation = require("./src/services/geocode");

const app = express();
const PORT = process.env.PORT || 8080;

// Route 1: Basic Firestore data fetch
app.get("/events", async (req, res) => {
    try {
        const events = await fetchEvents();
        res.status(200).json(events);
    } catch (error) {
        console.error("Error in /events:", error);
        res.status(500).json({ error: "Failed to fetch events" });
    }
});

// ✅ Route 2: Events enriched with geocoded latitude/longitude
app.get("/events-with-coordinates", async (req, res) => {
    try {
        const events = await fetchEvents();

        const enrichedEvents = await Promise.all(
            events.map(async (event) => {
                const coords = await geocodeLocation(event.location);
                return {
                    ...event,
                    latitude: coords.lat,
                    longitude: coords.lng,
                };
            })
        );

        res.status(200).json(enrichedEvents);
    } catch (error) {
        console.error("Error in /events-with-coordinates:", error);
        res.status(500).json({ error: "Failed to geocode events" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
