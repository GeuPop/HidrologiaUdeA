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
            resultadoDiv.innerHTML = "<p style='color:red;'>Ingrese un número de cédula.</p>";
            return;
        }

        if (!datos) {
            resultadoDiv.innerHTML = "<p style='color:red;'>Error cargando los datos.</p>";
            return;
        }

        const estudiante = datos.find(e => e.Cédula == cedulaIngresada);

        if (!estudiante) {
            resultadoDiv.innerHTML = "<p style='color:red;'>El documento no está en la base de datos.</p>";
            return;
        }

        // Mostrar solo las columnas permitidas
        resultadoDiv.innerHTML = `
            <h3>Resultado</h3>
            <p><strong>Cédula:</strong> ${estudiante["Cédula"]}</p>
            <p><strong>Nombre:</strong> ${estudiante["Nombre"]}</p>
            <p><strong>Email:</strong> ${estudiante["Email"]}</p>
            <p><strong>P1:</strong> ${estudiante["P1"]}</p>
            <p><strong>P2:</strong> ${estudiante["P2"]}</p>

            <p style="color:red; margin-top:20px;">
                Si tiene dudas sobre las notas o el nombre y notas no corresponde a las suyas 
                contáctese con el profesor.
            </p>
        `;
    });
});
