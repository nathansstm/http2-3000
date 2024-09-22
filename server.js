const http2 = require('http2');
const fs = require('fs');
const path = require('path');

// Load configuration from server.json using __dirname for the path
const configPath = path.join(__dirname, 'server.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Paths to your SSL certificate and key using paths from config
const sslOptions = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
};

// You can now use sslOptions for your HTTP2 server setup

const HTTP_PORT = config.httpPort; // Use configured port

// Create HTTP/2 server with secure connection
const server = http2.createSecureServer(sslOptions, (req, res) => {
    const urlPath = req.url === '/' ? config.httpRoute : req.url; // Normalize URL path
    const filePath = path.join(config.httpDir, urlPath); // Construct file path

    // Check if the requested asset exists
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            // If the file exists, serve it
            res.writeHead(200, {
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            // If the file doesn't exist, check the configuration for fallback
            let fallbackPath = null;
            for (const key in config) {
                if (key.endsWith("Route") && urlPath.startsWith(config[key])) {
                    const keyBase = key.replace("Route", "");
                    const dirKey = keyBase + "Dir";
                    const fileKey = keyBase + "File";

                    // If the route is exact match, return the configured file
                    if (config[key] === urlPath) {
                        fallbackPath = path.join(config[dirKey], config[fileKey]);
                    }
                    // If the route is a subpath, fall back to the directory
                    else if (urlPath.startsWith(config[key])) {
                        fallbackPath = path.join(config[dirKey], urlPath.replace(config[key], ''));
                    }
                }
            }

            // Serve fallback file or a general message
            if (fallbackPath) {
                fs.stat(fallbackPath, (fallbackErr, fallbackStats) => {
                    if (!fallbackErr && fallbackStats.isFile()) {
                        res.writeHead(200, {
                            'Content-Type': 'text/html',
                            'Access-Control-Allow-Origin': '*'
                        });
                        fs.createReadStream(fallbackPath).pipe(res);
                    } else {
                        // If no file found, send a message
                        res.writeHead(200, {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        });
                        res.end(JSON.stringify({ message: 'Not Found' }));
                    }
                });
            } else {
                // If no matching route or fallback found
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ message: 'Not Found' }));
            }
        }
    });
});

// Start the server
server.listen(HTTP_PORT, () => {
    console.log(`HTTP/2 server running on https://localhost:${HTTP_PORT}`);
});
