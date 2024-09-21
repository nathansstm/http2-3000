# http2-3000

This project sets up a simple HTTP/2 server using Node.js with SSL/TLS for secure connections. It includes preflight request handling, improved asset support, and intuitive fallbacks for more robust responses.

## Features
- HTTP/2 support
- SSL/TLS encryption
- CORS support for 'GET', 'POST', and 'OPTIONS' requests
- Preflight requests are handled with a 200 status code response.
- Improved static asset handling and fallback responses.
- Simple '/app/path/test' route for verifying server setup, tested with XMLHttpRequest and WebView.

## Prerequisites
- Node.js (v14 or later)
- SSL certificate files ('privkey.pem' and 'fullchain.pem') stored in '/var/www/ssl/'
- Git

## Usage

After cloning the repository, you can use the HTTP/2 server as follows:

1. **Start the Server**:  
   To start the server, navigate to the project directory and run:  
   'node server.js'

   The server will listen on port 3000. This is an unprivileged port, meaning you won't need root privileges to run it. The server.json configuration now includes a more conventional directory path setup.

2. **Serving Static Assets**:  
   Static assets are served efficiently using 'fs.createReadStream', which pipes the file directly to the server's response, improving performance when handling large files. If an asset is not found, fallback handling will intuitively return appropriate responses to avoid broken links.

3. **Accessing the Server**:  
   Once the server is running, you can access it via:  
   'https://localhost:3000/app/path/test'

   You should receive a JSON response: '{ message: "Connection successful" }'

4. **Running in the Background**:  
   To run the server in the background and return to the command line, you can use:  
   'node server.js & disown'

   This allows the server to keep running even after closing the terminal.

5. **Using with Certbot and Let's Encrypt**:  
   The server is designed to work seamlessly with Certbot and Let's Encrypt for SSL certificate management. You can set up automated certificate renewal to ensure your SSL certificates are always up to date.

6. **Dynamic DNS with FreeMyIP**:  
   For dynamic IP environments, consider using FreeMyIP or similar services to keep your domain pointing to your server’s IP address. This is especially useful for home servers or those behind dynamic IP addresses.

## Possible Enhancements
- **Additional Routes**: You can add more routes to handle different requests based on your application's needs.
- **Logging**: Implement logging mechanisms to monitor requests and errors for better debugging and maintenance.
- **Rate Limiting**: Consider adding rate limiting to prevent abuse of your server endpoints.
- **Database Integration**: Integrate with a database (e.g., MongoDB or PostgreSQL) for storing and retrieving data.

## License
This project is licensed under the [Apache 2.0 License](LICENSE).
