## Project Setup and API Endpoint

This project uses Firebase Admin SDK to interact with Firestore.  The setup is as follows:

1. **Firebase Service Account:** The `src/config/firebase.js` file initializes the Firebase Admin SDK using a service account key located at `../../keys/firestore.json`. Ensure this file is present and contains the correct credentials.  The database URL is also set in this file.

2. **Fetching Events:** The `src/services/fetchEvents.js` file contains a function `fetchEvents` that presumably retrieves event data.  You'll need to implement the logic for fetching events from your Firestore database within this function.

3. **API Endpoint:** The `server.js` file sets up an Express server with an endpoint at `/events`.  This endpoint calls the `fetchEvents` function and returns the retrieved events as a JSON response.

**To run the server:**

1. Make sure you have installed the required dependencies: `npm install`
2. Start the server: `node server.js`

The server will run on port 8080 or the port specified in the `PORT` environment variable.


