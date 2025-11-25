const CSV_URL = "Hidro.csv";

async function cargarCSV() {
    const response = await fetch(CSV_URL + "?v=" + Date.now());
    const data = await response.text();
    return parseCSV(data);
}

function parseCSV(text) {
    const rows = text.trim().split("\n").map(r => r.split(";"));

    const headers = rows[0];
    const entries = rows.slice(1).map(row => {
        let obj = {};
        headers.forEach((h, i) => {
            obj[h.trim()] = row[i] ? row[i].trim() : "";
        });
        return obj;
    });

    return entries;
}

async function buscarCedula() {
    const cedulaIngresada = document.getElementById("cedula").value.trim();
    const salida = document.getElementById("resultado");
    salida.innerHTML = "";

    if (cedulaIngresada === "") {
        salida.innerHTML = `<div class="error">Debe ingresar un número de cédula.</div>`;
        return;
    }

    const data = await cargarCSV();
    const match = data.find(d => d["Cédula"] === cedulaIngresada);

    if (!match) {
        salida.innerHTML = `<div class="error">La cédula ingresada no se encuentra en la base de datos.</div>`;
        return;
    }

    salida.innerHTML = `
        <div class="resultado">
            <strong>Nombre:</strong> ${match["Nombre"]}<br>
            <strong>Email:</strong> ${match["Email"]}<br>
            <strong>P1:</strong> ${match["P1"]}<br>
            <strong>P2:</strong> ${match["P2"]}<br>
        </div>
    `;
}
