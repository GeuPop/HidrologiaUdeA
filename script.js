const JSON_URL = "Hidro.json";

async function cargarDatos() {
    try {
        const resp = await fetch(JSON_URL);
        if (!resp.ok) throw new Error("No se pudo cargar el JSON");
        return await resp.json();
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    const datos = await cargarDatos();
    const input = document.getElementById("cedula");
    const buscarBtn = document.getElementById("buscar");
    const resultado = document.getElementById("resultado");

    buscarBtn.onclick = () => buscar();

    input.onkeypress = e => {
        if (e.key === "Enter") buscar();
    };

    function buscar() {
        const cedula = input.value.trim();

        if (!cedula) return mostrarError("Ingrese un número de cédula válido.");
        if (!datos) return mostrarError("No se pudieron cargar los datos.");

        mostrarCargando();

        setTimeout(() => {
            const estudiante = datos.find(e => e.Cédula == cedula);
            if (!estudiante) return mostrarError("No se encontró esta cédula.");
            mostrarResultado(estudiante);
        }, 700);
    }

    function mostrarCargando() {
        resultado.classList.add("show");
        resultado.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Buscando información...</p>
            </div>
        `;
    }

    function mostrarError(msg) {
        resultado.classList.add("show");
        resultado.innerHTML = `
            <div class="error">
                <i class="fas fa-exclamation-circle"></i>
                <span>${msg}</span>
            </div>
        `;
    }

    function mostrarResultado(est) {

        resultado.classList.add("show");

        resultado.innerHTML = `
            <div class="res-title">
                <i class="fas fa-user-graduate"></i>
                <h3>Información del estudiante</h3>
            </div>

            <div class="res-grid">
                <div><strong>Cédula:</strong> ${est["Cédula"]}</div>
                <div><strong>Nombre:</strong> ${est["Nombre"]}</div>
                <div><strong>Email:</strong> ${est["Email"]}</div>
            </div>

            <div class="grades">
                <div class="grade-card">
                    <span>Parcial 1 (20%)</span>
                    <h2>${est["P1"]}</h2>
                </div>
                <div class="grade-card">
                    <span>Parcial 2 (20%)</span>
                    <h2>${est["P2"]}</h2>
                </div>
                <div class="grade-card">
                    <span>Actividad Complementaria (10%)</span>
                    <h2>${est["ActComP"]}</h2>
                </div>
            </div>
        `;
    }
});
