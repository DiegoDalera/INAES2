
// server.js
const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

// Middleware para manejar la carga de archivos
app.use(fileUpload());

const { procesarArchivos } = require('./procesarArchivos');

// Endpoint para subir archivos
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let sociosFile = req.files.socios;
    let prestamosFile = req.files.prestamos;

    // Procesar archivos y generar archivos de texto
    procesarArchivos(sociosFile, prestamosFile);

    res.send('Files processed and text files generated!');
});

// Servir archivos estáticos (para React)
app.use(express.static(path.join(__dirname, 'client/build')));

// Manejar todas las demás rutas con React
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
