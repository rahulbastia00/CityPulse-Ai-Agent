require("dotenv").config();
const express = require("express");
const fetchEvents = require("./src/services/fetchEvents");

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/events", async(req, res) => {
    const events = await fetchEvents();
    res.json(events);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})