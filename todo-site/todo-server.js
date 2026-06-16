const http = require('http');

const siteSettings = {
    status: "Server is running smoothly",
    recommendedColor: "#ffd39d"
}

const server = http.createServer((req, res) => {
    if (req.url === '/status') {
        res.writeHead(200, {
            'content-type': 'application/json',
            'access-control-allow-origin': '*'
        });
        res.end(JSON.stringify(siteSettings));
    } else if (req.url === '/color') {
        res.writeHead(200, {
            'content-type': 'application/json',
            'access-control-allow-origin': '*'
        });
        res.end(JSON.stringify(siteSettings));
    } else if (req.url === '/') {
        res.writeHead(200, {
            'content-type': 'text/plain',
            'access-control-allow-origin': '*'
        });
        res.end('Welcome to the main page!');
    } else {
        res.writeHead(404, {
            'content-type': 'text/plain'
        })
        res.end('Page Not Found');
    }
});

server.listen(4000, () => {
    console.log('Server started on http://localhost:4000')
})