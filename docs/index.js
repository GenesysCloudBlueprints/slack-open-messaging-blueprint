const cors = require('cors');
var express = require('express');
var app = express();
const https = require('https');
const fs = require('fs');
const routes = require('./routes');
const localtunnel = require('localtunnel');

// Reserved domain name for Local Tunnel
const LT_SUBDOMAIN = 'corpuz-om';

app.use(cors());
app.options('*', cors());
app.use(express.json());

const PORT = 12000;
const HOST = '0.0.0.0';

//CORS Options
app.use(cors());
app.options('*', cors());

app.use(express.json());

app.use('/', routes);

app.listen(PORT, HOST);

// Start express on the defined port
app.listen(PORT, () => {
    console.log(`Server listening on local port ${PORT}`);

    // Start Local Tunnel for public internet access
    (async () => {
        const tunnel = await localtunnel({ 
            port: PORT, 
            subdomain: LT_SUBDOMAIN
        });

        console.log(`Server listening on external URL ${tunnel.url}`);

        tunnel.on('close', () => {
            // tunnels are closed
        });
    })();
});