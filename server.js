const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const { procesarArchivos } = require('./procesarArchivos');

const app = express();

// Middleware para manejar la carga de archivos
app.use(fileUpload());

app.post('/upload', (req, res) => {
    console.log("Llegó al upload");

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    console.log("Archivos recibidos:", req.files);

    let sociosFile = req.files.socios;
    let prestamosFile = req.files.prestamos;

    console.log("Voy a enviar a procesar archivos");

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
