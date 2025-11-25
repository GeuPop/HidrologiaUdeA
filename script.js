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
            mostrarError("Ingrese un número de cédula.");
            return;
        }

        if (!datos) {
            mostrarError("Error cargando los datos.");
            return;
        }

        // Mostrar estado de carga
        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner"></i> Buscando información...
            </div>
        `;

        // Pequeña demora para mostrar la animación de carga
        setTimeout(() => {
            const estudiante = datos.find(e => e.Cédula == cedulaIngresada);

            if (!estudiante) {
                mostrarError("El documento no está en la base de datos.");
                return;
            }

            // Mostrar resultados
            resultadoDiv.innerHTML = `
                <h3><i class="fas fa-user-graduate"></i> Información del Estudiante</h3>
                <p><strong>Cédula:</strong> ${estudiante["Cédula"]}</p>
                <p><strong>Nombre:</strong> ${estudiante["Nombre"]}</p>
                <p><strong>Email:</strong> ${estudiante["Email"]}</p>
                
                <div class="notas-container">
                    <div class="nota-item">
                        <strong>Parcial 1</strong>
                        <div class="nota-valor">${estudiante["P1"]}</div>
                    </div>
                    <div class="nota-item">
                        <strong>Parcial 2</strong>
                        <div class="nota-valor">${estudiante["P2"]}</div>
                    </div>
                </div>
            `;
        }, 800);
    });

    function mostrarError(mensaje) {
        resultadoDiv.style.display = "block";
        resultadoDiv.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> ${mensaje}</div>`;
    }

    // Permitir buscar con Enter
    inputCedula.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            btnBuscar.click();
        }
    });
});
