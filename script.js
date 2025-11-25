const JSON_URL = "Hidro.json?v=3";
let datos = [];

// Cargar JSON
fetch(JSON_URL)
  .then(r => r.json())
  .then(d => {
      datos = d;
      console.log("Datos cargados:", datos.length);
  })
  .catch(err => console.error("Error cargando JSON:", err));

function buscar() {
    const cedula = document.getElementById("cedulaInput").value.trim();
    const mensaje = document.getElementById("mensaje");
    const resultado = document.getElementById("resultado");

    mensaje.textContent = "";
    resultado.classList.add("oculto");

    if (cedula === "") {
        mensaje.textContent = "Ingrese un número de cédula.";
        return;
    }

    const registro = datos.find(x => String(x.Cédula) === cedula);

    if (!registro) {
        mensaje.textContent = "No se encontró esta cédula en la base de datos.";
        return;
    }

    document.getElementById("nombre").textContent = registro.Nombre;
    document.getElementById("email").textContent = registro.Email;
    document.getElementById("p1").textContent = registro.P1 || "—";
    document.getElementById("p2").textContent = registro.P2 || "—";

    resultado.classList.remove("oculto");
}
