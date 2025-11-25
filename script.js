// ================================
//   CONFIGURACIÓN
// ================================
const CSV_URL = "Hidro.csv?t=" + new Date().getTime(); // evitar caché

// Columnas que NO quieres mostrar
const COLUMNAS_OCULTAS = ["Numero", "Area"];


// ================================
//   Cargar CSV
// ================================
async function cargarCSV() {
    try {
        const respuesta = await fetch(CSV_URL, { cache: "no-store" });
        let texto = await respuesta.text();

        // Eliminar BOM invisible al inicio
        texto = texto.replace(/^\uFEFF/, "");

        return parseCSV(texto);
    } catch (e) {
        console.error("Error cargando CSV:", e);
        return [];
    }
}


// ================================
//   Parsear CSV separado por ;
// ================================
function parseCSV(csv) {
    const lineas = csv.trim().split("\n");
    const headers = lineas[0].split(";").map(h => h.trim());

    return lineas.slice(1).map(linea => {
        const columnas = linea.split(";");

        let obj = {};
        headers.forEach((h, i) => {
            obj[h] = columnas[i] ? columnas[i].trim() : "";
        });
        return obj;
    });
}


// ================================
//   Buscar por Cédula
// ================================
async function buscarCedula() {
    const cedula = document.getElementById("cedula").value.trim();
    const contenedor = document.getElementById("resultado");

    if (cedula === "") {
        contenedor.innerHTML = `<p style="color:red">Por favor ingrese una cédula.</p>`;
        return;
    }

    const datos = await cargarCSV();

    // Buscar coincidencia exacta
    const encontrado = datos.find(row =>
        row["Cédula"]?.toString().trim() === cedula
    );

    if (!encontrado) {
        contenedor.innerHTML = `<p style="color:red">No se encontraron datos para esta cédula.</p>`;
        return;
    }

    mostrarResultado(encontrado);
}


// ================================
//   Mostrar los datos encontrados
// ================================
function mostrarResultado(row) {
    const contenedor = document.getElementById("resultado");

    let html = `
        <div class="card">
            <h3>Resultados</h3>
            <table class="tabla">
    `;

    Object.keys(row).forEach(columna => {
        if (!COLUMNAS_OCULTAS.includes(columna)) {
            html += `
                <tr>
                    <td><strong>${columna}</strong></td>
                    <td>${row[columna]}</td>
                </tr>
            `;
        }
    });

    html += `
            </table>
            <p style="color:red; margin-top:10px;">
                Si tiene dudas sobre las notas o el nombre y notas no corresponde a las suyas contáctese con el profesor.
            </p>
        </div>
    `;

    contenedor.innerHTML = html;
}
