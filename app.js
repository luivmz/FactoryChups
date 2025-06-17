const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    if (url=== '/') {
        res.write('<html>');
        res.write('<head><title>Mi primera pagina</title></head>');
        res.write('<body><h1>Saludos desde mi clase</h1><form action="/crear-usuario" method="POST"><input type="text" name="nombreusuario"></input><button type="submit">Crear</button></form></body>');
        res.write('</html>');
        return res.end();
    }
    if (url=== '/usuarios') {
        res.write('<html>');
        res.write('<head><title>Mi primera pagina</title></head>');
        res.write('<body><ul><li>Juan</li><li>Pedro</li><li>Luis</li></ul></body>');
        res.write('</html>');
        return res.end();
    }

    if (url === '/crear-usuario' && method === 'POST') {
        const body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        });
        return req.on('end', () => {
            const txtBody = Buffer.concat(body).toString();
            const nombreusuario = txtBody.split('=')[1];
            console.log(nombreusuario);
            fs.writeFile('nombreusuario.txt', nombreusuario, err => {
                res.statusCode = '302';
                res.setHeader('Location', '/')
                return res.end();
            });
        })

    }

})

server.listen(3000);