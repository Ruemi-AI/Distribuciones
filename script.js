document.addEventListener('DOMContentLoaded', () => {
    // Mostrar/ocultar modales
    document.getElementById('estadisticaBtn').addEventListener('click', () => {
        document.getElementById('estadisticaModal').style.display = 'flex';
    });

    document.getElementById('algebraBtn').addEventListener('click', () => {
        document.getElementById('algebraModal').style.display = 'flex';
    });

    document.getElementById('planosBtn').addEventListener('click', () => {
        document.getElementById('planosModal').style.display = 'flex';
    });

    document.getElementById('ayudaBtn').addEventListener('click', () => {
        document.getElementById('ayudaModal').style.display = 'flex';
        mostrarFormulas();
    });

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

    // Crear matrices A y B
    document.getElementById('crearMatrizA').addEventListener('click', () => {
        const filas = parseInt(document.getElementById('filasA').value);
        const columnas = parseInt(document.getElementById('columnasA').value);
        crearMatrizInput('matrizAInput', filas, columnas);
    });

    document.getElementById('crearMatrizB').addEventListener('click', () => {
        const filas = parseInt(document.getElementById('filasB').value);
        const columnas = parseInt(document.getElementById('columnasB').value);
        crearMatrizInput('matrizBInput', filas, columnas);
    });

    // Event listeners para operaciones de matrices
    document.getElementById('calcularSuma').addEventListener('click', () => {
        const matrizA = obtenerMatrizDesdeInput('matrizAInput');
        const matrizB = obtenerMatrizDesdeInput('matrizBInput');
        const resultado = sumarMatrices(matrizA, matrizB);
        mostrarResultado(resultado, 'resultadosAlgebra');
    });

    document.getElementById('calcularResta').addEventListener('click', () => {
        const matrizA = obtenerMatrizDesdeInput('matrizAInput');
        const matrizB = obtenerMatrizDesdeInput('matrizBInput');
        const resultado = restarMatrices(matrizA, matrizB);
        mostrarResultado(resultado, 'resultadosAlgebra');
    });

    document.getElementById('calcularMultiplicacion').addEventListener('click', () => {
        const matrizA = obtenerMatrizDesdeInput('matrizAInput');
        const matrizB = obtenerMatrizDesdeInput('matrizBInput');
        const resultado = multiplicarMatrices(matrizA, matrizB);
        mostrarResultado(resultado, 'resultadosAlgebra');
    });

    document.getElementById('calcularTranspuesta').addEventListener('click', () => {
        const matrizA = obtenerMatrizDesdeInput('matrizAInput');
        const resultado = transponerMatriz(matrizA);
        mostrarResultado(resultado, 'resultadosAlgebra');
    });

    document.getElementById('calcularInversa').addEventListener('click', () => {
        const matrizA = obtenerMatrizDesdeInput('matrizAInput');
        try {
            const resultado = invertirMatriz(matrizA);
            mostrarResultado(resultado, 'resultadosAlgebra');
        } catch (error) {
            alert(error.message); // Muestra un mensaje si la matriz no es invertible
        }
    });

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

        // Crear una tabla HTML para mostrar la matriz
        const tabla = document.createElement('table');
        tabla.style.borderCollapse = 'collapse';
        tabla.style.marginTop = '20px';

        // Recorrer la matriz y crear las filas y celdas
        resultado.forEach(fila => {
            const tr = document.createElement('tr');
            fila.forEach(valor => {
                const td = document.createElement('td');
                td.textContent = valor.toFixed(2); // Mostrar valores con 2 decimales
                td.style.border = '1px solid #000';
                td.style.padding = '8px';
                td.style.textAlign = 'center';
                tr.appendChild(td);
            });
            tabla.appendChild(tr);
        });

        // Limpiar el contenedor y agregar la tabla
        contenedor.innerHTML = '';
        contenedor.appendChild(tabla);
    }

    // Leer archivo de Excel
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

    // Mostrar fórmulas de ayuda
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
            </ul>
        `;
        document.getElementById('formulasAyuda').innerHTML = formulas;
    }
});