// procesarArchivos.js
const XLSX = require('xlsx');
const fs = require('fs');

function procesarArchivos(sociosFile, prestamosFile) {
    // Leer archivos Excel
    const sociosWorkbook = XLSX.read(sociosFile.data, { type: 'buffer' });
    const prestamosWorkbook = XLSX.read(prestamosFile.data, { type: 'buffer' });

    const sociosSheet = sociosWorkbook.Sheets[sociosWorkbook.SheetNames[0]];
    const prestamosSheet = prestamosWorkbook.Sheets[prestamosWorkbook.SheetNames[0]];

    const sociosData = XLSX.utils.sheet_to_json(sociosSheet);
    const prestamosData = XLSX.utils.sheet_to_json(prestamosSheet);

    // Unir los datos por el número de legal
    const mergedData = sociosData.map(socio => {
        const prestamo = prestamosData.find(p => p.LEGAJO === socio['LEGAJO BBVA']);
        return { ...socio, ...prestamo };
    });

    // Filtrar los datos de los socios con préstamos
    const sociosConPrestamos = mergedData.filter(data => data.LEGAJO !== undefined);

    // Generar archivo de texto
    generarArchivoAlta(sociosConPrestamos, 'alta_deudores.txt');
}

function generarArchivoAlta(data, filename) {
    const stream = fs.createWriteStream(filename, { encoding: 'ascii' });
    data.forEach(row => {
        const linea = `${row['CUIT'].padStart(11, ' ')}${row['TIPO_DOCUMENTO'].padStart(2, ' ')}${row['NUMERO_DOCUMENTO'].padStart(20, ' ')}`
                    + `${row['APELLIDO_Y_NOMBRE'].padStart(70, ' ')}${row['FECHA_NACIMIENTO'].padStart(8, ' ')}${row['TIPO_SOCIEDAD_PERSONA'].padStart(1, ' ')}`
                    + `${row['EST_CIVIL'].padStart(1, ' ')}${row['DIRECCION'].padStart(40, ' ')}${row['LOCALIDAD'].padStart(20, ' ')}${row['PROVINCIA'].padStart(1, ' ')}`
                    + `${row['COD_POSTAL'].padStart(8, ' ')}${row['TELEFONO_FIJO'].padStart(14, ' ')}${row['TELEFONO_CELULAR'].padStart(14, ' ')}`
                    + `${row['NACIONALIDAD'].padStart(1, ' ')}${row['RETORNO'].padStart(2, ' ')}\r\n`;
        stream.write(linea);
    });
    stream.end();
}

module.exports = { procesarArchivos };
