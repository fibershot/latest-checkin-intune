// Import modules
import express from 'express';
import path from 'path';
import settings from "./js/appSettings.js";
import { fetchLogon, initializeGraph } from "./js/graph.js";
import { checkToken } from './js/auth.js';

// Define variables
const app = express();
const PORT = 1869;
var AUTH = false;

// Define express settings
app.use(express.json());
app.use(express.static("public"));

// Connect to MS Graph
initializeGraph(settings);

// Authentication - auth.js
app.post('/api/fetch-token', async (req, res) => {
    const { address } = req.body;
    try {
        // Check if the token in url matches given token
        const results = await checkToken(address);

        if (results) {
            AUTH = true;
            res.status(200).json({ results });
        } else {
            AUTH = false;
            res.status(403).json({ error: 'Invalid token.'});
        }
    } catch (error) {
        AUTH = false;
        console.error(error);
        res.status(500).json({ error: 'Error fetching token details.' });
    }
});

// Get data about users and devices - return to app.js request
app.post('/api/fetch-logon', async (req, res) => {
    const { serial } = req.body;
    try {
        // Require token AUTH
        if (AUTH){
            // Send request to graph.js for data
            const results = await fetchLogon(serial);
            res.status(200).json({ results });
        } else {
            res.status(403).json({ error: 'Invalid token.'})
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching logon details.' });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

// Listen to defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
