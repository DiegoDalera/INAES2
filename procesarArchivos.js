const XLSX = require('xlsx');
const fs = require('fs');

function procesarArchivos(sociosFile, prestamosFile) {
    console.log('Entrando a procesarArchivos'); // Registro de depuración

    // Leer archivos Excel
    const sociosWorkbook = XLSX.read(sociosFile.data, { type: 'buffer' });
    const prestamosWorkbook = XLSX.read(prestamosFile.data, { type: 'buffer' });

    const sociosSheet = sociosWorkbook.Sheets[sociosWorkbook.SheetNames[0]];
    const prestamosSheet = prestamosWorkbook.Sheets[prestamosWorkbook.SheetNames[0]];

    const sociosData = XLSX.utils.sheet_to_json(sociosSheet);
    const prestamosData = XLSX.utils.sheet_to_json(prestamosSheet);

    // Agregar registros de depuración
    console.log('Socios Data:', sociosData);
    console.log('Prestamos Data:', prestamosData);

    // Unir los datos por el número de legal
    const mergedData = sociosData.map(socio => {
        const prestamo = prestamosData.find(p => p.LEGAJO === socio['LEGAJO BBVA']);
        if (prestamo) {
            return { ...socio, ...prestamo };
        }
        return socio;
    });

    // Filtrar los datos de los socios con préstamos
    const sociosConPrestamos = mergedData.filter(data => data.LEGAJO !== undefined);

    // Agregar registros de depuración
    console.log('Socios con Préstamos:', sociosConPrestamos);

    // Generar archivo de texto
    generarArchivoAlta(sociosConPrestamos, 'alta_deudores.txt');
}

function generarArchivoAlta(data, filename) {
    const stream = fs.createWriteStream(filename, { encoding: 'ascii' });
    data.forEach(row => {
        const linea = `${(row['CUIT'] || '').toString().padStart(11, ' ')}`
                    + `${(row['TIPO_DOCUMENTO'] || '').toString().padStart(2, ' ')}`
                    + `${(row['NUMERO_DOCUMENTO'] || '').toString().padStart(20, ' ')}`
                    + `${(row['APELLIDO_Y_NOMBRE'] || '').toString().padStart(70, ' ')}`
                    + `${(row['FECHA_NACIMIENTO'] || '').toString().padStart(8, ' ')}`
                    + `${(row['TIPO_SOCIEDAD_PERSONA'] || '').toString().padStart(1, ' ')}`
                    + `${(row['EST_CIVIL'] || '').toString().padStart(1, ' ')}`
                    + `${(row['DIRECCION'] || '').toString().padStart(40, ' ')}`
                    + `${(row['LOCALIDAD'] || '').toString().padStart(20, ' ')}`
                    + `${(row['PROVINCIA'] || '').toString().padStart(1, ' ')}`
                    + `${(row['COD_POSTAL'] || '').toString().padStart(8, ' ')}`
                    + `${(row['TELEFONO_FIJO'] || '').toString().padStart(14, ' ')}`
                    + `${(row['TELEFONO_CELULAR'] || '').toString().padStart(14, ' ')}`
                    + `${(row['NACIONALIDAD'] || '').toString().padStart(1, ' ')}`
                    + `${(row['RETORNO'] || '').toString().padStart(2, ' ')}\r\n`;
        stream.write(linea);
    });
    stream.end();
}

module.exports = { procesarArchivos };

