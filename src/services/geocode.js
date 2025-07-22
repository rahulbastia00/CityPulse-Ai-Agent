const axios = require("axios");
require("dotenv").config();

async function geocodeLocation(location) {
  if (!location) return { lat: null, lng: null };

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (results.length === 0) {
      console.warn(`No geocode result for location: "${location}"`);
      return { lat: null, lng: null };
    }

    const { lat, lng } = results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error("Geocoding failed:", error.message);
    return { lat: null, lng: null };
  }
}

module.exports = geocodeLocation;
