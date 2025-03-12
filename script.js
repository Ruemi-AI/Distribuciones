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

// Obtener valores de las matrices
function obtenerMatriz(contenedorId, filas, columnas) {
    let matriz = [];
    for (let i = 0; i < filas; i++) {
        let fila = [];
        for (let j = 0; j < columnas; j++) {
            const valor = parseFloat(document.getElementById(`${contenedorId}-${i}-${j}`).value) || 0;
            fila.push(valor);
        }
        matriz.push(fila);
    }
    return matriz;
}

// Operaciones con matrices
function operarMatrices(operacion) {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);
    const filasB = parseInt(document.getElementById('filasB').value);
    const columnasB = parseInt(document.getElementById('columnasB').value);

    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    const matrizB = obtenerMatriz('matrizBInput', filasB, columnasB);

    try {
        const resultado = operacion(matrizA, matrizB);
        mostrarResultado(resultado);
    } catch (error) {
        alert("Error: " + error.message);
    }
}

// Función para mostrar los resultados
function mostrarResultado(resultado) {
    document.getElementById('resultadosAlgebra').innerHTML = `<pre>${JSON.stringify(resultado, null, 2)}</pre>`;
}

// Eventos de botones para cálculos de matrices
document.getElementById('calcularSuma').addEventListener('click', () => operarMatrices(sumarMatrices));
document.getElementById('calcularResta').addEventListener('click', () => operarMatrices(restarMatrices));
document.getElementById('calcularMultiplicacion').addEventListener('click', () => operarMatrices(multiplicarMatrices));

document.getElementById('calcularTranspuesta').addEventListener('click', () => {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);
    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    mostrarResultado(transponerMatriz(matrizA));
});

document.getElementById('calcularInversa').addEventListener('click', () => {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);
    if (filasA !== columnasA) {
        alert("La matriz debe ser cuadrada para calcular la inversa.");
        return;
    }
    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    try {
        mostrarResultado(invertirMatriz(matrizA));
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// Función para calcular Mínimos Cuadrados
document.getElementById('calcularMinimosCuadrados').addEventListener('click', () => {
    const filasA = parseInt(document.getElementById('filasA').value);
    const columnasA = parseInt(document.getElementById('columnasA').value);
    const filasB = parseInt(document.getElementById('filasB').value);
    const columnasB = parseInt(document.getElementById('columnasB').value);

    if (columnasB !== 1) {
        alert("La matriz B debe ser un vector columna (n x 1).");
        return;
    }

    const matrizA = obtenerMatriz('matrizAInput', filasA, columnasA);
    const matrizB = obtenerMatriz('matrizBInput', filasB, columnasB);

    try {
        const coeficientes = minimosCuadrados(matrizA, matrizB);
        mostrarResultado(coeficientes);
    } catch (error) {
        alert("Error al calcular mínimos cuadrados: " + error.message);
    }
});

function minimosCuadrados(matrizA, matrizB) {
    const matrizAT = transponerMatriz(matrizA);
    const productoATA = multiplicarMatrices(matrizAT, matrizA);
    
    let inversaATA;
    try {
        inversaATA = invertirMatriz(productoATA);
    } catch (error) {
        throw new Error("La matriz (A^T * A) no es invertible.");
    }

    const productoATB = multiplicarMatrices(matrizAT, matrizB);
    return multiplicarMatrices(inversaATA, productoATB);
}

// Funciones matemáticas
function sumarMatrices(matrizA, matrizB) {
    return matrizA.map((fila, i) => fila.map((valor, j) => valor + matrizB[i][j]));
}

function restarMatrices(matrizA, matrizB) {
    return matrizA.map((fila, i) => fila.map((valor, j) => valor - matrizB[i][j]));
}

function multiplicarMatrices(matrizA, matrizB) {
    if (matrizA[0].length !== matrizB.length) {
        throw new Error("Número de columnas de A debe coincidir con filas de B.");
    }
    return matrizA.map((fila, i) =>
        Array.from({ length: matrizB[0].length }, (_, j) =>
            fila.reduce((sum, valor, k) => sum + valor * matrizB[k][j], 0)
        )
    );
}

function transponerMatriz(matriz) {
    return matriz[0].map((_, i) => matriz.map(fila => fila[i]));
}

function invertirMatriz(matriz) {
    // Código de inversión de matriz (ya incluido antes)
}

