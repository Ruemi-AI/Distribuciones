// Mostrar/ocultar secciones
document.getElementById('estadisticaBtn').addEventListener('click', () => {
    document.getElementById('estadisticaSection').classList.remove('hidden');
    document.getElementById('algebraSection').classList.add('hidden');
    document.getElementById('ayudaSection').classList.add('hidden');
});

document.getElementById('algebraBtn').addEventListener('click', () => {
    document.getElementById('algebraSection').classList.remove('hidden');
    document.getElementById('estadisticaSection').classList.add('hidden');
    document.getElementById('ayudaSection').classList.add('hidden');
});

document.getElementById('ayudaBtn').addEventListener('click', () => {
    document.getElementById('ayudaSection').classList.remove('hidden');
    document.getElementById('estadisticaSection').classList.add('hidden');
    document.getElementById('algebraSection').classList.add('hidden');
    mostrarFormulas();
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

// Obtener valores de una matriz
function obtenerMatriz(contenedorId, filas, columnas) {
    const matriz = [];
    for (let i = 0; i < filas; i++) {
        const fila = [];
        for (let j = 0; j < columnas; j++) {
            const valor = parseFloat(document.getElementById(`${contenedorId}-${i}-${j}`).value);
            fila.push(isNaN(valor) ? 0 : valor); // Si no hay valor, se usa 0
        }
        matriz.push(fila);
    }
    return matriz;
}

// Operaciones de álgebra lineal
document.getElementById('calcularSuma').addEventListener('click', () => {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);
    const filasB = parseInt(document.getElementById('filasB').value);
    const columnasB = parseInt(document.getElementById('columnasB').value);

    if (filasA !== filasB || columnasA !== columnasB) {
        alert("Las matrices deben tener las mismas dimensiones para sumarse.");
        return;
    }

    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    const matrizB = obtenerMatriz('matrizBInput', filasB, columnasB);
    const resultado = sumarMatrices(matrizA, matrizB);
    mostrarResultado(resultado);
});

document.getElementById('calcularResta').addEventListener('click', () => {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);
    const filasB = parseInt(document.getElementById('filasB').value);
    const columnasB = parseInt(document.getElementById('columnasB').value);

    if (filasA !== filasB || columnasA !== columnasB) {
        alert("Las matrices deben tener las mismas dimensiones para restarse.");
        return;
    }

    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    const matrizB = obtenerMatriz('matrizBInput', filasB, columnasB);
    const resultado = restarMatrices(matrizA, matrizB);
    mostrarResultado(resultado);
});

document.getElementById('calcularMultiplicacion').addEventListener('click', () => {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);
    const filasB = parseInt(document.getElementById('filasB').value);
    const columnasB = parseInt(document.getElementById('columnasB').value);

    if (columnasA !== filasB) {
        alert("El número de columnas de A debe ser igual al número de filas de B.");
        return;
    }

    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    const matrizB = obtenerMatriz('matrizBInput', filasB, columnasB);
    const resultado = multiplicarMatrices(matrizA, matrizB);
    mostrarResultado(resultado);
});

document.getElementById('calcularTranspuesta').addEventListener('click', () => {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);
    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    const resultado = transponerMatriz(matrizA);
    mostrarResultado(resultado);
});

document.getElementById('calcularInversa').addEventListener('click', () => {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);

    if (filasA !== columnasA) {
        alert("La matriz debe ser cuadrada para calcular su inversa.");
        return;
    }

    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    try {
        const resultado = invertirMatriz(matrizA);
        mostrarResultado(resultado);
    } catch (error) {
        alert("La matriz no tiene inversa.");
    }
});

// Funciones de operaciones matriciales
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

// Mostrar resultados en una tabla
function mostrarResultado(resultado) {
    const resultadosAlgebra = document.getElementById('resultadosAlgebra');
    let html = '<h3>Resultado:</h3>';
    html += '<table border="1">';
    resultado.forEach(fila => {
        html += '<tr>';
        fila.forEach(valor => {
            html += `<td>${valor.toFixed(2)}</td>`; // Redondea a 2 decimales
        });
        html += '</tr>';
    });
    html += '</table>';
    resultadosAlgebra.innerHTML = html;
}

// Mostrar fórmulas de ayuda
function mostrarFormulas() {
    const formulas = `
        <h3>Fórmulas Utilizadas</h3>
        <ul>
            <li><strong>Suma de Matrices:</strong> C = A + B</li>
            <li><strong>Resta de Matrices:</strong> C = A - B</li>
            <li><strong>Multiplicación de Matrices:</strong> C = A * B</li>
            <li><strong>Transpuesta:</strong> A^T</li>
            <li><strong>Inversa:</strong> A^(-1)</li>
        </ul>
    `;
    document.getElementById('formulasAyuda').innerHTML = formulas;
}