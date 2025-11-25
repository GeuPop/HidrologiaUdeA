// URL cruda del JSON en GitHub Pages o raw.githubusercontent
const url = "https://raw.githubusercontent.com/TU_USUARIO/TU_REPO/main/datos.json";

async function cargarDatos() {
    const error = document.getElementById("error");
    const tabla = document.getElementById("tabla");
    const thead = document.getElementById("thead");
    const tbody = document.getElementById("tbody");

    try {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("No se pudo obtener el JSON");
        }

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("El JSON está vacío o mal formado");
        }

        // Crear encabezados dinámicamente
        const columnas = Object.keys(data[0]);
        thead.innerHTML = `
            <tr>${columnas.map(col => `<th>${col}</th>`).join("")}</tr>
        `;

        // Crear filas
        tbody.innerHTML = data.map(fila =>
            `<tr>${columnas.map(col => `<td>${fila[col]}</td>`).join("")}</tr>`
        ).join("");

        tabla.classList.remove("oculto");

    } catch (e) {
        error.textContent = "❌ Error cargando los datos: " + e.message;
    }
}

cargarDatos();
