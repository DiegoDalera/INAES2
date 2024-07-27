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

    // Verificar las claves de los objetos en sociosData
    if (sociosData.length > 0) {
        console.log('Claves de un objeto en sociosData:', Object.keys(sociosData[0]));
    }
    if (prestamosData.length > 0) {
        console.log('Claves de un objeto en prestamosData:', Object.keys(prestamosData[0]));
    }

    // Crear un mapa para una búsqueda rápida de socios por 'LEGAJO BBVA'
    const sociosMap = sociosData.reduce((map, socio) => {
        const key = socio['LEGAJO BBVA'];
        if (key === undefined) {
            console.log('Objeto de socio sin LEGAJO BBVA:', socio);
        }
        map[key] = socio;
        return map;
    }, {});

    console.log('Mapa de Socios:', sociosMap);

    // Unir los datos por el número de legajo y asegurarse de que el resultado tenga la cantidad de registros de `prestamosData`
    const mergedData = prestamosData.map(prestamo => {
        const socio = sociosMap[prestamo.LEGAJO] || {};
        return { ...prestamo, ...socio };
    });

    console.log('Datos Unificados:', mergedData);

    // Retornar los datos unificados
    //return mergedData;

    generarArchivoAlta(mergedData,"alta.txt")
}

function generarArchivoAlta(data, filename) {

    console.log("data" , data)

    const stream = fs.createWriteStream(filename, { encoding: 'ascii' });

    data.forEach(row => {
        const linea = `${(row['LEGAJO'] || '').toString().padStart(11, ' ')}`
                    // + `${(row['TIPO_DOCUMENTO'] || '').toString().padStart(2, ' ')}`
                    // + `${(row['NUMERO_DOCUMENTO'] || '').toString().padStart(20, ' ')}`
                    // + `${(row['APELLIDO_Y_NOMBRE'] || '').toString().padStart(70, ' ')}`
                    // + `${(row['FECHA_NACIMIENTO'] || '').toString().padStart(8, ' ')}`
                    // + `${(row['TIPO_SOCIEDAD_PERSONA'] || '').toString().padStart(1, ' ')}`
                    // + `${(row['EST_CIVIL'] || '').toString().padStart(1, ' ')}`
                    // + `${(row['DIRECCION'] || '').toString().padStart(40, ' ')}`
                    // + `${(row['LOCALIDAD'] || '').toString().padStart(20, ' ')}`
                    // + `${(row['PROVINCIA'] || '').toString().padStart(1, ' ')}`
                    // + `${(row['COD_POSTAL'] || '').toString().padStart(8, ' ')}`
                    // + `${(row['TELEFONO_FIJO'] || '').toString().padStart(14, ' ')}`
                    // + `${(row['TELEFONO_CELULAR'] || '').toString().padStart(14, ' ')}`
                    // + `${(row['NACIONALIDAD'] || '').toString().padStart(1, ' ')}`
                    // + `${(row['RETORNO'] || '').toString().padStart(2, ' ')}\r\n`;
        stream.write(linea);
    });
    stream.end();
}

module.exports = { procesarArchivos };

