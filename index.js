const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => res.send('OK'));

app.get('/call-a', async (req, res) => {
    try {
        const response = await axios.get('http://microservice-a:3000/health');
        res.send(`Response from A: ${response.data}`);
    } catch (err) {
        res.status(500).send('Failed to call A');
    }
});

app.listen(PORT, () => console.log(`Microservice B listening on port ${PORT}`));
