import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import settings from "./js/appSettings.js";
import { fetchLogon, initializeGraph } from "./js/graph.js";
import { checkToken } from './js/auth.js';

// Define __dirname manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 1869;
var AUTH = false;

app.use(express.json());
app.use(express.static("public"));
app.use('/css', express.static(path.join(__dirname, 'public', 'css'), { setHeaders: (res) => res.set('Content-Type', 'text/css') }));
app.use('/js', express.static(path.join(__dirname, 'public', 'js'), { setHeaders: (res) => res.set('Content-Type', 'application/javascript') }));
app.use('/fonts', express.static(path.join(__dirname, 'public', 'fonts'), { setHeaders: (res) => res.set('Content-Type', 'font/ttf') }));

initializeGraph(settings);

app.post('/api/fetch-token', async (req, res) => {
    const { address } = req.body;
    try {
        const results = await checkToken(address);

        if (results) {
            AUTH = true;
            res.status(200).json({ results });
        } else {
            AUTH = false;
            res.status(403).json({ error: '[AUTH] Invalid token.'});
        }
    } catch (error) {
        AUTH = false;
        console.error(error);
        res.status(500).json({ error: '[AUTH] Error fetching token details.' });
    }
});

app.post('/api/fetch-logon', async (req, res) => {
    const { serial } = req.body;
    try {
        if (AUTH){
            const results = await fetchLogon(serial);
            res.status(200).json({ results });
        } else {
            res.status(403).json({ error: '[AUTH] Invalid token.'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '[ERROR] Error fetching logon details.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`[INFO] Server is running on http://localhost:${PORT}`);
});

