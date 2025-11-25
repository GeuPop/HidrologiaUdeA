const JSON_URL = "Hidro.json";

async function cargarDatos() {
    try {
        const respuesta = await fetch(JSON_URL);
        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el archivo JSON");
        }
        const datos = await respuesta.json();
        return datos;
    } catch (error) {
        console.error("Error cargando JSON:", error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const datos = await cargarDatos();
    const inputCedula = document.getElementById("cedula");
    const btnBuscar = document.getElementById("buscar");
    const resultadoDiv = document.getElementById("resultado");

    btnBuscar.addEventListener("click", () => {
        const cedulaIngresada = inputCedula.value.trim();
        
        if (!cedulaIngresada) {
            mostrarError("Por favor, ingrese un número de cédula válido.");
            return;
        }

        if (!datos) {
            mostrarError("Error al cargar los datos del sistema.");
            return;
        }

        mostrarCargando();

        setTimeout(() => {
            const estudiante = datos.find(e => e.Cédula == cedulaIngresada);

            if (!estudiante) {
                mostrarError("No se encontró ningún estudiante con esta cédula.");
                return;
            }

            mostrarResultado(estudiante);
        }, 1000);
    });

    function mostrarCargando() {
        resultadoDiv.className = "result-container show";
        resultadoDiv.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Buscando información...</p>
            </div>
        `;
    }

    function mostrarError(mensaje) {
        resultadoDiv.className = "result-container show";
        resultadoDiv.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${mensaje}</span>
            </div>
        `;
    }

    function mostrarResultado(estudiante) {
        resultadoDiv.className = "result-container show";
        resultadoDiv.innerHTML = `
            <div class="result-header">
                <i class="fas fa-user-graduate"></i>
                <h3>Información del Estudiante</h3>
            </div>
            <div class="result-grid">
                <div class="result-item">
                    <span class="result-label">Cédula:</span>
                    <span class="result-value">${estudiante["Cédula"]}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Nombre:</span>
                    <span class="result-value">${estudiante["Nombre"]}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Email:</span>
                    <span class="result-value">${estudiante["Email"]}</span>
                </div>
            </div>
            <div class="grades-container">
                <div class="grade-card">
                    <div class="grade-label">Parcial 1</div>
                    <div class="grade-value">${estudiante["P1"]}</div>
                </div>
                <div class="grade-card">
                    <div class="grade-label">Parcial 2</div>
                    <div class="grade-value">${estudiante["P2"]}</div>
                </div>
            </div>
        `;
    }

    inputCedula.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            btnBuscar.click();
        }
    });
});
