// index.js
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// URL de microservice-A via env var
const SERVICE_A_URL = process.env.SERVICE_A_URL || 'http://microservice-a:80';

app.get('/health', (req, res) => res.send('OK'));

app.get('/call-a', async (req, res) => {
    try {
        const response = await axios.get(`${SERVICE_A_URL}/health`);
        res.send(`Response from A: ${response.data}`);
    } catch (err) {
        res.status(500).send('Failed to call A');
    }
});

app.listen(PORT, () => console.log(`Microservice B listening on port ${PORT}`));
