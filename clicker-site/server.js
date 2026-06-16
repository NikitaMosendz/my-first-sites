const http = require('http');

const profile = {
    username: "NikitaMosendz",
    role: "Fullstack Developer",
    clicks: 1000
}


const server = http.createServer((req, res) => {
    if (req.url === '/profile') {
        res.writeHead(200, { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(profile));
    } else if (req.url === '/') {
        res.writeHead(200, { 
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*'});
        res.end('Welcome to the Home Page!');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
    }
    
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});