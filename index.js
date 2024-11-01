import express from 'express';
import path from 'path';
import settings from "./js/appSettings.js";
import { fetchLogon, initializeGraph } from "./js/graph.js";

const app = express();
const PORT = 1869;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

initializeGraph(settings);

app.post('/api/fetch-logon', async (req, res) => {
    const { serial } = req.body;
    try {
        const results = await fetchLogon(serial);
        res.status(200).json({ results });
        //res.status(200).json({ message: `Logon details fetched successfully. Username: ${results[0].userName} and login date: ${results[0].lastLogOnDateTime}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching logon details' });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
