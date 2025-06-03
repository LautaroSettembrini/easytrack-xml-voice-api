require('dotenv').config();
const express = require('express');
const axios = require('axios');
const xmlbuilder = require('xmlbuilder');

const app = express();
app.use(express.json());

// Validate required environment variables
['EASYTRACK_USER', 'EASYTRACK_PASS', 'BUS_1', 'BUS_2', 'BUS_3'].forEach((key) => {
    if (!process.env[key]) {
        console.warn(`Warning: Missing environment variable ${key}`);
    }
});

// XML configuration constants
const XML_OPTS = { voice: 'Polly.Andres-Neural', language: 'es-MX' };

// Middleware: request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Store latest XML responses per bus
let latestXml = {
    bus_1: null,
    bus_2: null,
    bus_3: null,
};

// Bus license plates loaded from .env
const buses = {
    bus_1: process.env.BUS_1,
    bus_2: process.env.BUS_2,
    bus_3: process.env.BUS_3,
};

// API credentials loaded from environment variables
const apiCredentials = {
    username: process.env.EASYTRACK_USER,
    password: process.env.EASYTRACK_PASS,
};

// Retrieve JWT token from EasyTrack API
async function getAuthToken() {
    try {
        const response = await axios.post('https://apiavl.easytrack.com.ar/sessions/auth/', {
            username: apiCredentials.username,
            password: apiCredentials.password,
        });
        return response.data.jwt;
    } catch (error) {
        console.error('Error retrieving token:', error);
        throw new Error('Authentication failed');
    }
}

// Get bus location from API using plate number
async function getBusLocation(token, licensePlate) {
    try {
        const response = await axios.get(
            `https://apiavl.easytrack.com.ar/positions/${licensePlate}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const busData = response.data[0];
        if (busData && busData.position) {
            const formattedAddress = busData.position.split(',').slice(0, 2).join(',').trim();
            console.log(`Bus ${licensePlate} location: ${formattedAddress}`);
            return { success: true, text: formattedAddress };
        } else {
            console.log(`No position found for ${licensePlate}`);
            return { success: false, text: '' };
        }
    } catch (error) {
        console.error(`Error fetching location for ${licensePlate}:`, error);
        return { success: false, text: '' };
    }
}

// Fetch and generate XML for all buses
async function extractDataAndGenerateXML() {
    try {
        const token = await getAuthToken();

        for (const [key, licensePlate] of Object.entries(buses)) {
            const result = await getBusLocation(token, licensePlate);
            if (result.success) {
                const xml = xmlbuilder.create('Response')
                    .ele('Say', XML_OPTS, result.text)
                    .end({ pretty: true });

                latestXml[key] = xml;
            } else {
                latestXml[key] = null;
            }
        }
    } catch (error) {
        console.error('Failed to extract data:', error);
        Object.keys(latestXml).forEach(key => latestXml[key] = null);
    }
}

// Update XML via POST
app.post('/update', async (req, res) => {
    try {
        await extractDataAndGenerateXML();
        res.status(200).send({ message: 'XML update triggered successfully.' });
    } catch (error) {
        res.status(500).json({
            error: true,
            message: 'Failed to update XML.',
            detail: error.message || 'Internal error',
        });
    }
});

// Serve XML via GET
app.get('/voice/:busKey', (req, res) => {
    const busKey = req.params.busKey;

    if (latestXml[busKey]) {
        res.type('application/xml');
        res.send(latestXml[busKey]);
    } else {
        const fallbackXml = xmlbuilder.create('Response')
            .ele('Say', XML_OPTS, 'Lo sentimos, no se pudo obtener la información en este momento. Por favor, intente nuevamente más tarde.')
            .end({ pretty: true });

        res.type('application/xml');
        res.send(fallbackXml);
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});