const express = require('express');
const bodyParser = require('body-parser');
const Rcon = require('rcon');

const app = express();
const port = 3000;

// Configuración de RCON
const rconConfig = {
    host: 'localhost', // Cambia a la IP de tu servidor de Minecraft
    port: 25575,       // Cambia al puerto de RCON configurado en server.properties
    password: '' // Cambia a la contraseña de RCON configurada en server.properties
};

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Ruta para procesar comandos
app.post('/send-command', (req, res) => {
    const command = req.body.command;
    const rcon = new Rcon(rconConfig.host, rconConfig.port, rconConfig.password);

    rcon.on('auth', () => {
        console.log('Conexión RCON exitosa.');
        rcon.send(command);
    });

    rcon.on('response', (response) => {
        console.log('Respuesta del servidor:', response);
        res.json({ success: true, response }); // Devuelve un JSON con la respuesta
        rcon.disconnect();
    });

    rcon.on('error', (err) => {
        console.error('Error:', err.message);
        res.status(500).json({ success: false, error: err.message }); // Devuelve un JSON con el error
    });

    rcon.connect();
});


// Inicia el servidor web
app.listen(port, () => {
    console.log(`Servidor web iniciado en http://localhost:${port}`);
});
