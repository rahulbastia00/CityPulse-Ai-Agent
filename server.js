require("dotenv").config();
const express = require("express");

const fetchEvents = require("./src/services/fetchEvents");
const geocodeLocation = require("./src/services/geocode");
const embedText = require("./src/services/embedText");

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

// ✅ NEW: Add the /embed route that you're trying to access
app.get("/embed", async (req, res) => {
    const text = req.query.text;
    
    if (!text) {
        return res.status(400).json({ 
            error: "Missing required 'text' parameter" 
        });
    }
    
    try {
        const embedding = await embedText(text);
        res.status(200).json({ 
            text: text, 
            embedding: embedding,
            dimension: embedding.length 
        });
    } catch (error) {
        console.error("Error in /embed:", error);
        res.status(500).json({ 
            error: "Failed to generate embedding",
            details: error.message 
        });
    }
});

// Test Route: Generate embedding for a sample text
app.get("/test-embedding", async (req, res) => {
  const sampleText = req.query.text || "Breaking: Accident in Patia involving multiple casualties.";
  try {
    const embedding = await embedText(sampleText);
    res.json({ text: sampleText, vector: embedding });
  } catch (error) {
    res.status(500).json({ error: "Failed to embed text" });
  }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});