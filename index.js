// index.js
const express = require('express');
const axios = require('axios');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const MS_A_GRPC = process.env.MS_A_GRPC || 'localhost:50051';

// URL de microservice-A via env var
const SERVICE_A_URL = process.env.SERVICE_A_URL || 'http://microservice-a:80';

// gRPC Setup (Industrial Approach Level 3)
const grpcLib = require('@cdesplanches-orka/grpc-lib');
const packageDefinition = protoLoader.loadSync(grpcLib.protoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const serviceProto = grpc.loadPackageDefinition(packageDefinition).service;
const client = new serviceProto.DataService(MS_A_GRPC, grpc.credentials.createInsecure());

app.get('/health', (req, res) => res.send('OK'));

app.get('/call-a', async (req, res) => {
    try {
        const response = await axios.get(`${SERVICE_A_URL}/health`);
        res.send(`Response from A: ${response.data}`);
    } catch (err) {
        res.status(500).send('Failed to call A');
    }
});

// Aggregate endpoint (gRPC)
app.get('/api/b/aggregate', (req, res) => {
    client.getData({ id: '123' }, (err, response) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({
            message: 'Hello from microservice B (Aggregation)',
            serviceAData: response
        });
    });
});

app.listen(PORT, () => console.log(`Microservice B listening on port ${PORT}`));
