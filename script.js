// Cambia esto por el RAW URL de tu CSV en GitHub
const CSV_URL = "TU_URL_RAW_DEL_CSV_AQUI.csv";

async function cargarCSV() {
    const noCacheUrl = CSV_URL + "?v=" + new Date().getTime(); // evita caché

    const response = await fetch(noCacheUrl, {
        cache: "no-store"
    });

    const data = await response.text();
    return parseCSV(data);
}

function parseCSV(csv) {
    const lineas = csv.trim().split("\n");
    const headers = lineas[0].split(",");

    return lineas.slice(1).map(linea => {
        const columnas = linea.split(",");
        let obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = columnas[i]?.trim();
        });
        return obj;
    });
}

async function buscarCedula() {
    const cedula = document.getElementById("cedulaInput").value.trim();
    const resultadoDiv = document.getElementById("resultado");

    if (cedula === "") {
        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = "<p>Por favor ingrese un número de cédula.</p>";
        return;
    }

    const datos = await cargarCSV();
    const encontrado = datos.find(row => row["Cédula"] === cedula);

    if (!encontrado) {
        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = "<p>No se encontró información para esta cédula.</p>";
        return;
    }

    resultadoDiv.style.display = "block";
    resultadoDiv.innerHTML = `
        <p><strong>Cédula:</strong> ${encontrado["Cédula"]}</p>
        <p><strong>Nombre:</strong> ${encontrado["Nombre"]}</p>
        <p><strong>Email:</strong> ${encontrado["Email"]}</p>
        <p><strong>P1:</strong> ${encontrado["P1"]}</p>
        <p><strong>P2:</strong> ${encontrado["P2"]}</p>
    `;
}
