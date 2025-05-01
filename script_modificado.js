document.addEventListener('DOMContentLoaded', () => {
    // Configuración del simulador solar
    const area = 1.6;
    const eficiencia = 0.18;

    const dias = Array.from({ length: 31 }, (_, i) => i + 1);
    const radiacion = [
        4.95, 4.11, 5.12, 3.78, 4.67, 3.95, 4.23, 5.35, 4.42, 4.89,
        4.58, 3.66, 4.12, 5.02, 4.71, 3.88, 4.35, 4.77, 5.14, 3.91,
        4.84, 5.21, 3.79, 4.61, 4.28, 3.95, 4.73, 5.05, 3.85, 4.90, 4.16
    ];
    const consumo = [
        4.83, 5.17, 5.88, 4.71, 5.35, 5.92, 4.22, 5.10, 4.94, 5.63,
        5.41, 4.88, 5.33, 5.00, 5.46, 4.77, 4.90, 5.15, 4.58, 5.29,
        5.04, 5.31, 4.63, 5.12, 4.99, 5.55, 4.73, 5.08, 4.82, 5.22, 5.06
    ];

    let chart, histo, chartNublado;

    // Mostrar/ocultar modales
    const estadisticaBtn = document.getElementById('estadisticaBtn');
    const algebraBtn = document.getElementById('algebraBtn');
    const planosBtn = document.getElementById('planosBtn');
    const ayudaBtn = document.getElementById('ayudaBtn');
    const pronosticoBtn = document.getElementById('pronosticoBtn');
    const simuladorBtn = document.getElementById('simuladorBtn');

    if (simuladorBtn) {
        simuladorBtn.addEventListener('click', () => {
            document.getElementById('simuladorModal').style.display = 'flex';
            // Pequeño retraso para asegurar que el modal esté visible
            setTimeout(() => {
                updateChart();
            }, 100);
        });
    }

    if (estadisticaBtn) {
        estadisticaBtn.addEventListener('click', () => {
            document.getElementById('estadisticaModal').style.display = 'flex';
        });
    }

    if (algebraBtn) {
        algebraBtn.addEventListener('click', () => {
            document.getElementById('algebraModal').style.display = 'flex';
        });
    }

    if (planosBtn) {
        planosBtn.addEventListener('click', () => {
            document.getElementById('planosModal').style.display = 'flex';
        });
    }

    if (ayudaBtn) {
        ayudaBtn.addEventListener('click', () => {
            document.getElementById('ayudaModal').style.display = 'flex';
            mostrarFormulas();
        });
    }

    if (pronosticoBtn) {
        pronosticoBtn.addEventListener('click', () => {
            document.getElementById('pronosticoModal').style.display = 'flex';
            obtenerDatosReales();
        });
    }

    // Cerrar modales al hacer clic en la "X"
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.parentElement.parentElement.style.display = 'none';
        });
    });

    // Cerrar modales al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Funciones del simulador solar
    document.getElementById('paneles')?.addEventListener('input', updateChart);

    function updateChart() {
        const paneles = parseInt(document.getElementById("paneles").value);
        document.getElementById("panelCount").textContent = paneles;

        const generacion = radiacion.map(r => r * area * eficiencia * paneles);

        let diasCubiertos = 0;
        for (let i = 0; i < consumo.length; i++) {
            if (generacion[i] >= consumo[i]) diasCubiertos++;
        }
        const cobertura = (diasCubiertos / consumo.length * 100).toFixed(1);
        document.getElementById("cobertura").textContent = `Cobertura del consumo: ${cobertura}% de los días`;

        // Gráfica principal (Generación vs Consumo)
        const ctx = document.getElementById('grafica').getContext('2d');
        const data = {
            labels: dias,
            datasets: [
                {
                    label: 'Consumo (kWh)',
                    data: consumo,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: `Generación con ${paneles} panel(es) (kWh)`,
                    data: generacion,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        };

        if (chart) {
            chart.data = data;
            chart.update();
        } else {
            chart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'kWh/día'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: "Días"
                            }
                        }
                    }
                }
            });
        }

        drawHistogram();
        drawNublado(paneles);
    }

    function drawHistogram() {
        const ctx = document.getElementById("histogramaChart").getContext("2d");
        
        if (histo) {
            histo.destroy();
        }

        histo = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: dias,
                datasets: [
                    {
                        label: "Radiación (kWh/m²)",
                        data: radiacion,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    },
                    {
                        label: "Consumo (kWh)",
                        data: consumo,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "kWh"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Días"
                        }
                    }
                }
            }
        });
    }

    function drawNublado(paneles) {
        const ctx = document.getElementById("nubladoChart").getContext("2d");
        const radiacionNublada = [...radiacion];
        
        // Simular días nublados (días 10 al 14)
        for (let i = 9; i <= 13; i++) {
            radiacionNublada[i] = 1.0;
        }

        const generacion = radiacionNublada.map(r => r * area * eficiencia * paneles);

        if (chartNublado) {
            chartNublado.destroy();
        }

        chartNublado = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dias,
                datasets: [
                    {
                        label: 'Consumo (kWh)',
                        data: consumo,
                        borderColor: 'rgba(255, 159, 64, 1)',
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: `Generación con ${paneles} panel(es) (nublado)`,
                        data: generacion,
                        borderColor: 'rgba(153, 102, 255, 1)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'kWh/día'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Días"
                        }
                    }
                }
            }
        });
    }

    // Resto de las funciones (creación de matrices, operaciones matriciales, etc.)
    // ... (mantén todo el resto del código que ya tenías para las otras funcionalidades)
    
    // Crear matrices A y B
    const crearMatrizA = document.getElementById('crearMatrizA');
    const crearMatrizB = document.getElementById('crearMatrizB');

    if (crearMatrizA) {
        crearMatrizA.addEventListener('click', () => {
            const filas = parseInt(document.getElementById('filasA').value);
            const columnas = parseInt(document.getElementById('columnasA').value);
            crearMatrizInput('matrizAInput', filas, columnas);
        });
    }

    if (crearMatrizB) {
        crearMatrizB.addEventListener('click', () => {
            const filas = parseInt(document.getElementById('filasB').value);
            const columnas = parseInt(document.getElementById('columnasB').value);
            crearMatrizInput('matrizBInput', filas, columnas);
        });
    }

    // Event listeners para operaciones de matrices
    const calcularSuma = document.getElementById('calcularSuma');
    const calcularResta = document.getElementById('calcularResta');
    const calcularMultiplicacion = document.getElementById('calcularMultiplicacion');
    const calcularTranspuesta = document.getElementById('calcularTranspuesta');
    const calcularInversa = document.getElementById('calcularInversa');
    const calcularMinimosCuadrados = document.getElementById('calcularMinimosCuadrados');

    if (calcularSuma) {
        calcularSuma.addEventListener('click', () => {
            const matrizA = obtenerMatrizDesdeInput('matrizAInput');
            const matrizB = obtenerMatrizDesdeInput('matrizBInput');
            const resultado = sumarMatrices(matrizA, matrizB);
            mostrarResultado(resultado, 'resultadosAlgebra');
        });
    }

    if (calcularResta) {
        calcularResta.addEventListener('click', () => {
            const matrizA = obtenerMatrizDesdeInput('matrizAInput');
            const matrizB = obtenerMatrizDesdeInput('matrizBInput');
            const resultado = restarMatrices(matrizA, matrizB);
            mostrarResultado(resultado, 'resultadosAlgebra');
        });
    }

    if (calcularMultiplicacion) {
        calcularMultiplicacion.addEventListener('click', () => {
            const matrizA = obtenerMatrizDesdeInput('matrizAInput');
            const matrizB = obtenerMatrizDesdeInput('matrizBInput');
            const resultado = multiplicarMatrices(matrizA, matrizB);
            mostrarResultado(resultado, 'resultadosAlgebra');
        });
    }

    if (calcularTranspuesta) {
        calcularTranspuesta.addEventListener('click', () => {
            const matrizA = obtenerMatrizDesdeInput('matrizAInput');
            const resultado = transponerMatriz(matrizA);
            mostrarResultado(resultado, 'resultadosAlgebra');
        });
    }

    if (calcularInversa) {
        calcularInversa.addEventListener('click', () => {
            const matrizA = obtenerMatrizDesdeInput('matrizAInput');
            try {
                const resultado = invertirMatriz(matrizA);
                mostrarResultado(resultado, 'resultadosAlgebra');
            } catch (error) {
                alert(error.message);
            }
        });
    }

    if (calcularMinimosCuadrados) {
        calcularMinimosCuadrados.addEventListener('click', () => {
            const matrizA = obtenerMatrizDesdeInput('matrizAInput');
            const matrizB = obtenerMatrizDesdeInput('matrizBInput');
            try {
                const resultado = minimosCuadradosMultiples(matrizA, matrizB);
                mostrarResultado(resultado, 'resultadosAlgebra');
            } catch (error) {
                alert(error.message);
            }
        });
    }

    // Función para obtener datos reales
    async function obtenerDatosReales() {
        try {
            const demandaTexas = await obtenerDemandaTexas();
            const demandaMexico = await obtenerDemandaMexico();
            const demandaCalifornia = await obtenerDemandaCalifornia();

            const resultadosPronostico = document.getElementById('resultadosPronostico');
            resultadosPronostico.innerHTML = `
                <h3>Pronóstico de Demanda Eléctrica</h3>
                <ul>
                    <li><strong>Texas:</strong> ${demandaTexas} MW</li>
                    <li><strong>México:</strong> ${demandaMexico} MW</li>
                    <li><strong>California:</strong> ${demandaCalifornia} MW</li>
                </ul>
            `;
        } catch (error) {
            console.error("Error al obtener los datos:", error);
            alert("No se pudieron obtener los datos. Inténtalo de nuevo más tarde.");
        }
    }

    // Funciones simuladas para obtener datos reales
    async function obtenerDemandaTexas() {
        return Math.floor(Math.random() * 10000) + 5000;
    }

    async function obtenerDemandaMexico() {
        return Math.floor(Math.random() * 8000) + 4000;
    }

    async function obtenerDemandaCalifornia() {
        return Math.floor(Math.random() * 12000) + 6000;
    }

    // Funciones para operaciones matriciales
    function sumarMatrices(matrizA, matrizB) {
        return matrizA.map((fila, i) => fila.map((valor, j) => valor + matrizB[i][j]));
    }

    function restarMatrices(matrizA, matrizB) {
        return matrizA.map((fila, i) => fila.map((valor, j) => valor - matrizB[i][j]));
    }

    function multiplicarMatrices(matrizA, matrizB) {
        const resultado = Array.from({ length: matrizA.length }, () => Array(matrizB[0].length).fill(0));
        for (let i = 0; i < matrizA.length; i++) {
            for (let j = 0; j < matrizB[0].length; j++) {
                for (let k = 0; k < matrizA[0].length; k++) {
                    resultado[i][j] += matrizA[i][k] * matrizB[k][j];
                }
            }
        }
        return resultado;
    }

    function transponerMatriz(matriz) {
        return matriz[0].map((_, i) => matriz.map(fila => fila[i]));
    }

    function invertirMatriz(matriz) {
        const n = matriz.length;
        const identidad = Array.from({ length: n }, (_, i) => 
            Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
        );
        const aumentada = matriz.map((fila, i) => [...fila, ...identidad[i]]);

        for (let i = 0; i < n; i++) {
            if (aumentada[i][i] === 0) {
                let j = i + 1;
                while (j < n && aumentada[j][i] === 0) j++;
                if (j === n) throw new Error("Matriz no invertible");
                [aumentada[i], aumentada[j]] = [aumentada[j], aumentada[i]];
            }
            const divisor = aumentada[i][i];
            aumentada[i] = aumentada[i].map(valor => valor / divisor);
            for (let j = 0; j < n; j++) {
                if (j !== i) {
                    const factor = aumentada[j][i];
                    aumentada[j] = aumentada[j].map((valor, k) => valor - factor * aumentada[i][k]);
                }
            }
        }

        return aumentada.map(fila => fila.slice(n));
    }

    function minimosCuadradosMultiples(X, Y) {
        if (X.length === 0 || Y.length === 0) {
            throw new Error("Las matrices no pueden estar vacías.");
        }

        const XConIntercepto = X.map(fila => [1, ...fila]);
        const YVector = Y.map(fila => [fila[0]]);
        const XTranspuesta = transponerMatriz(XConIntercepto);
        const XTX = multiplicarMatrices(XTranspuesta, XConIntercepto);

        let XTXInversa;
        try {
            XTXInversa = invertirMatriz(XTX);
        } catch (error) {
            throw new Error("No se puede calcular la inversa de X^T * X. Verifica que las variables independientes no sean colineales.");
        }

        const XTY = multiplicarMatrices(XTranspuesta, YVector);
        const beta = multiplicarMatrices(XTXInversa, XTY);

        return beta;
    }

    // Funciones auxiliares
    function crearMatrizInput(contenedorId, filas, columnas) {
        const contenedor = document.getElementById(contenedorId);
        contenedor.innerHTML = '';
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                const input = document.createElement('input');
                input.type = 'number';
                input.id = `${contenedorId}-${i}-${j}`;
                input.placeholder = `[${i + 1},${j + 1}]`;
                contenedor.appendChild(input);
            }
            contenedor.appendChild(document.createElement('br'));
        }
    }

    function obtenerMatrizDesdeInput(contenedorId) {
        const inputs = document.querySelectorAll(`#${contenedorId} input`);
        const filas = parseInt(document.getElementById('filasA').value);
        const columnas = parseInt(document.getElementById('columnasA').value);
        const matriz = [];
        for (let i = 0; i < filas; i++) {
            const fila = [];
            for (let j = 0; j < columnas; j++) {
                const valor = parseFloat(inputs[i * columnas + j].value);
                fila.push(isNaN(valor) ? 0 : valor);
            }
            matriz.push(fila);
        }
        return matriz;
    }

    function mostrarResultado(resultado, contenedorId) {
        const contenedor = document.getElementById(contenedorId);
        const tabla = document.createElement('table');
        tabla.style.borderCollapse = 'collapse';
        tabla.style.marginTop = '20px';

        resultado.forEach(fila => {
            const tr = document.createElement('tr');
            fila.forEach(valor => {
                const td = document.createElement('td');
                td.textContent = valor.toFixed(2);
                td.style.border = '1px solid #000';
                td.style.padding = '8px';
                td.style.textAlign = 'center';
                tr.appendChild(td);
            });
            tabla.appendChild(tr);
        });

        contenedor.innerHTML = '';
        contenedor.appendChild(tabla);
    }

    function leerArchivoExcel(file, callback) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            callback(json);
        };
        reader.readAsArrayBuffer(file);
    }

    function mostrarFormulas() {
        const formulas = `
            <h3>Fórmulas Utilizadas</h3>
            <ul>
                <li><strong>Media:</strong> μ = (Σx) / N</li>
                <li><strong>Moda:</strong> Valor que más se repite</li>
                <li><strong>Mediana:</strong> Valor central de un conjunto de datos ordenados</li>
                <li><strong>Desviación Estándar:</strong> σ = √(Σ(x - μ)² / N)</li>
                <li><strong>Varianza:</strong> σ² = Σ(x - μ)² / N</li>
                <li><strong>Cuartiles:</strong> Q1, Q2 (mediana), Q3</li>
                <li><strong>Sesgo:</strong> Medida de la asimetría de la distribución</li>
                <li><strong>Curtosis:</strong> Medida de la "cola" de la distribución</li>
                <li><strong>Suma de Matrices:</strong> C = A + B</li>
                <li><strong>Resta de Matrices:</strong> C = A - B</li>
                <li><strong>Multiplicación de Matrices:</strong> C = A * B</li>
                <li><strong>Transpuesta:</strong> A^T</li>
                <li><strong>Inversa:</strong> A^(-1)</li>
                <li><strong>Mínimos Cuadrados:</strong> β = (X^T X)^-1 X^T Y</li>
            </ul>
        `;
        document.getElementById('formulasAyuda').innerHTML = formulas;
    }

// ========== SIMULADOR DE CÉSAR ========== //
document.getElementById('simuladorCesarBtn')?.addEventListener('click', () => {
    document.getElementById('simuladorCesarModal').style.display = 'flex';
    setTimeout(() => {
        const radiacionCesar = [5.1, 5.3, 4.8, 5.6, 6.2, 4.9, 5.4, 5.8, 4.7, 5.0, 5.5, 5.9, 6.1, 4.5, 5.2, 5.7, 6.0, 4.8, 5.3, 5.1, 4.9, 5.4, 6.3, 5.2, 4.6, 5.8, 5.7, 5.0, 4.7, 5.5, 5.9];
        const consumoCesar = [4.8, 5.2, 5.9, 4.5, 5.7, 5.1, 5.4, 4.9, 5.6, 5.3, 4.7, 5.8, 5.0, 5.5, 4.6, 5.2, 5.4, 4.8, 5.7, 5.1, 5.9, 4.7, 5.3, 5.0, 5.6, 4.9, 5.5, 5.2, 4.8, 5.4, 5.7];
        let chartCesar, chartNubladoCesar;
        const areaCesar = 1.8;
        const eficienciaCesar = 0.21;

        document.getElementById('panelesCesar').addEventListener('input', function() {
            const paneles = parseInt(this.value);
            document.getElementById("panelCountCesar").textContent = paneles;
            const generacion = radiacionCesar.map(r => r * areaCesar * eficienciaCesar * paneles);
            const diasCubiertos = consumoCesar.filter((c, i) => generacion[i] >= c).length;
            document.getElementById("coberturaCesar").textContent = `Cobertura del consumo: ${((diasCubiertos/31)*100).toFixed(1)}% de los días`;

            // Actualizar gráfica principal
            if (chartCesar) chartCesar.destroy();
            chartCesar = new Chart(document.getElementById('graficaCesar').getContext('2d'), {
                type: 'line',
                data: {
                    labels: Array.from({length: 31}, (_, i) => i + 1),
                    datasets: [
                        { label: 'Consumo (kWh)', data: consumoCesar, borderColor: '#FF6384', tension: 0.3 },
                        { label: `Generación (${paneles} paneles)`, data: generacion, borderColor: '#36A2EB', tension: 0.3 }
                    ]
                }
            });

            // Actualizar días nublados
            const radiacionNublada = radiacionCesar.map((r, i) => (i >= 10 && i <= 15) ? r * 0.3 : r);
            const generacionNublada = radiacionNublada.map(r => r * areaCesar * eficienciaCesar * paneles);
            if (chartNubladoCesar) chartNubladoCesar.destroy();
            chartNubladoCesar = new Chart(document.getElementById('nubladoCesar').getContext('2d'), {
                type: 'line',
                data: {
                    labels: Array.from({length: 31}, (_, i) => i + 1),
                    datasets: [
                        { label: 'Generación normal', data: generacion, borderColor: '#4BC0C0', tension: 0.3 },
                        { label: 'Generación con días nublados', data: generacionNublada, borderColor: '#FF9F40', tension: 0.3 }
                    ]
                }
            });
        }).dispatchEvent(new Event('input'));
    }, 100);
});

});