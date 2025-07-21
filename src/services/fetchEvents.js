const db = require("../config/firebase");

async function fetchEvents() {
  try {
    const snapshot = await db.collection("event_data").get();
    const events = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Enhanced timestamp handling
      let isoTimestamp = null;
      
      if (data.timestamp) {
        try {
          // Handle Firestore Timestamp with toDate method
          if (data.timestamp.toDate && typeof data.timestamp.toDate === 'function') {
            isoTimestamp = data.timestamp.toDate().toISOString();
          }
          // Handle serialized Firestore Timestamp (has _seconds property)
          else if (data.timestamp._seconds !== undefined) {
            const milliseconds = data.timestamp._seconds * 1000 + 
                               (data.timestamp._nanoseconds || 0) / 1000000;
            isoTimestamp = new Date(milliseconds).toISOString();
          }
          // Handle regular Date object
          else if (data.timestamp instanceof Date) {
            isoTimestamp = data.timestamp.toISOString();
          }
          // Handle string timestamps
          else if (typeof data.timestamp === 'string') {
            const date = new Date(data.timestamp);
            if (!isNaN(date.getTime())) {
              isoTimestamp = date.toISOString();
            }
          }
          // Handle numeric timestamps
          else if (typeof data.timestamp === 'number') {
            const date = new Date(data.timestamp < 1e12 ? data.timestamp * 1000 : data.timestamp);
            if (!isNaN(date.getTime())) {
              isoTimestamp = date.toISOString();
            }
          }
        } catch (error) {
          console.error(`Error processing timestamp for document ${doc.id}:`, error);
        }
      }
      
      events.push({
        id: doc.id,
        event_type: data.event_type || "unknown",
        location: data.location || "unknown",
        text: data.text || "",
        source: data.source || "unknown",
        media_url: data.media_url || "",
        timestamp: isoTimestamp,
      });
    });
    
    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

module.exports = fetchEvents;