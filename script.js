document.getElementById("ayudaBtn").onclick = function () {
    document.getElementById("ayudaModal").style.display = "block";
};

document.querySelector(".close").onclick = function () {
    document.getElementById("ayudaModal").style.display = "none";
};

window.onclick = function (event) {
    if (event.target === document.getElementById("ayudaModal")) {
        document.getElementById("ayudaModal").style.display = "none";
    }
};

function procesarArchivo() {
    const input = document.getElementById("fileInput").files[0];
    if (!input) {
        alert("Selecciona un archivo de datos");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Convertimos los datos a números, ignorando encabezados y valores no numéricos
        const datos = jsonData.flat().filter(x => typeof x === "number");

        if (datos.length === 0) {
            alert("El archivo no contiene datos numéricos válidos.");
            return;
        }

        calcularEstadisticas(datos);
        graficarHistograma(datos);
        graficarBoxplot(datos);
        graficarScatter(datos);
    };
    reader.readAsArrayBuffer(input);
}

function calcularEstadisticas(datos) {
    const n = datos.length;
    const media = datos.reduce((a, b) => a + b, 0) / n;
    const mediana = datos.sort((a, b) => a - b)[Math.floor(n / 2)];
    const moda = datos.sort((a,b) =>
        datos.filter(v => v === a).length - datos.filter(v => v === b).length
    ).pop();
    const varianza = datos.reduce((sum, x) => sum + (x - media) ** 2, 0) / n;
    const desviacion = Math.sqrt(varianza);
    const sesgo = (3 * (media - mediana)) / desviacion;

    document.getElementById("estadisticas").innerHTML = `
        <p><strong>Media:</strong> ${media.toFixed(2)}</p>
        <p><strong>Mediana:</strong> ${mediana}</p>
        <p><strong>Moda:</strong> ${moda}</p>
        <p><strong>Varianza:</strong> ${varianza.toFixed(2)}</p>
        <p><strong>Desviación estándar:</strong> ${desviacion.toFixed(2)}</p>
        <p><strong>Sesgo:</strong> ${sesgo.toFixed(2)}</p>
    `;
}

function graficarHistograma(datos) {
    const ctx = document.getElementById("histograma").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [...new Set(datos)].sort((a, b) => a - b),
            datasets: [{
                label: "Frecuencia",
                data: [...new Set(datos)].map(x => datos.filter(y => y === x).length),
                backgroundColor: "blue",
            }]
        }
    });
}

function graficarBoxplot(datos) {
    const trace = {
        y: datos,
        type: "box",
        name: "Boxplot"
    };
    Plotly.newPlot("boxplot", [trace]);
}

function graficarScatter(datos) {
    const trace = {
        x: Array.from({ length: datos.length }, (_, i) => i + 1),
        y: datos,
        mode: "lines+markers",
        name: "Tendencia"
    };
    Plotly.newPlot("scatterplot", [trace]);
}
