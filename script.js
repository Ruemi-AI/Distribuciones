let historial = [];

function mostrarSeccion(seccion) {
    document.querySelectorAll(".pantalla").forEach(pantalla => {
        pantalla.classList.add("d-none");
    });

    if (seccion === "calculadora") {
        limpiarFormulario();
    }

    document.getElementById(seccion).classList.remove("d-none");
}

function volverInicio() {
    mostrarSeccion("inicio");
}

function limpiarFormulario() {
    document.getElementById("consumo").value = "";
    document.getElementById("ubicacion").value = "";
    document.getElementById("eficiencia").value = "";
    document.getElementById("resultado").innerHTML = "";
}

function calcularPaneles() {
    let consumo = parseFloat(document.getElementById("consumo").value);
    let horasSol = parseFloat(document.getElementById("ubicacion").value);
    let eficiencia = parseFloat(document.getElementById("eficiencia").value);

    if (isNaN(consumo) || isNaN(horasSol) || isNaN(eficiencia)) {
        document.getElementById("resultado").innerHTML = "⚠ Ingresa valores válidos.";
        return;
    }

    let energiaDiaria = consumo / 30;
    let potenciaRequerida = energiaDiaria / horasSol;
    let panelesNecesarios = Math.ceil(potenciaRequerida / (eficiencia / 100 * 400));

    let resultadoTexto = `🌞 Necesitas aproximadamente <strong>${panelesNecesarios}</strong> paneles solares de 400W.`;
    document.getElementById("resultado").innerHTML = resultadoTexto;

    historial.push({
        consumo,
        horasSol,
        eficiencia,
        panelesNecesarios
    });
}

// 📘 Menú Lateral
function toggleMenu() {
    let menu = document.getElementById("menuLateral");
    if (menu.style.left === "0px") {
        menu.style.left = "-300px";
    } else {
        menu.style.left = "0px";
    }
}
