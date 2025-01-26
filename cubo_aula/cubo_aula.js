var canvas;
var gl;

var theta = [0, 0, 0]; // Ângulos de rotação para X, Y e Z
var thetaLoc;          // Localização da uniform no shader

var NumVertices = 36;

var direction = 1;       // Sentido de rotação
var rotationSpeed = [0.002, 0.002, 0.001]; // Velocidade inicial para cada eixo
var isRotating = true;   // Controle da rotação (inicia ativa)

var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

var translation = [0, 0, 0]; // Posição do cubo
var translationLoc;          // Localização da uniform no shader

var scale = 1.0; // Fator de escala
var scaleLoc;    // Localização da uniform no shader

var isMoveMode = true; // Variável para alternar entre mover e girar

var vertices = [
    vec3(0.5, 0.5, 0.5), 
    vec3(-0.5, 0.5, 0.5),
    vec3(-0.5, -0.5, 0.5), 
    vec3(0.5, -0.5, 0.5),
    vec3(0.5, 0.5, -0.5), 
    vec3(-0.5, 0.5, -0.5),
    vec3(-0.5, -0.5, -0.5), 
    vec3(0.5, -0.5, -0.5)
];

var faces = [
    [0, 1, 2, 3], 
    [4, 7, 6, 5],
    [0, 4, 5, 1], 
    [1, 5, 6, 2],
    [2, 6, 7, 3], 
    [3, 7, 4, 0]
];

var cores = [
    vec4(1.0, 0.0, 0.0, 1.0), 
    vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0), 
    vec4(0.0, 1.0, 1.0, 1.0),
    vec4(1.0, 0.0, 1.0, 1.0), 
    vec4(1.0, 1.0, 0.0, 1.0)
];

var sh_vertices = [];
var sh_colors = [];

function create_cube() {
    for (var f = 0; f < faces.length; f++) {
        var a = faces[f][0];
        var b = faces[f][1];
        var c = faces[f][2];
        var d = faces[f][3];

        sh_vertices.push(vertices[a], vertices[b], vertices[c]);
        sh_vertices.push(vertices[a], vertices[c], vertices[d]);

        for (var i = 0; i < 6; i++) {
            sh_colors.push(cores[f]);
        }
    }
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    
    // Definir tamanho do canvas dinamicamente
    canvas.width = 512;
    canvas.height = 512;

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    create_cube();

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sh_vertices), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(sh_colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    thetaLoc = gl.getUniformLocation(program, "theta");
    translationLoc = gl.getUniformLocation(program, "translation");
    scaleLoc = gl.getUniformLocation(program, "scale");

    // Eventos para os controles
    document.getElementById("toggle-direction").onclick = () => {
        direction *= -1; // Inverte o sentido de rotação
    };

    document.getElementById("toggle-rotation").onclick = () => {
        isRotating = !isRotating; // Alterna entre parar e retomar a rotação
    };

    document.getElementById("toggle-mode").onclick = () => {
        isMoveMode = !isMoveMode; // Alterna entre mover e girar
        document.getElementById("toggle-mode").innerText = isMoveMode ? "Alternar Modo (Mover/Girar)" : "Alternar Modo (Girar/Mover)";
    };

    document.getElementById("x-slider").oninput = (e) => {
        rotationSpeed[0] = parseFloat(e.target.value);
    };

    document.getElementById("y-slider").oninput = (e) => {
        rotationSpeed[1] = parseFloat(e.target.value);
    };

    document.getElementById("z-slider").oninput = (e) => {
        rotationSpeed[2] = parseFloat(e.target.value);
    };

    document.getElementById("scale-slider").oninput = (e) => {
        scale = parseFloat(e.target.value);
    };

    // Eventos de mouse para clicar e arrastar
    canvas.addEventListener('mousedown', function(e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        // Verificar se o clique está dentro do cubo
        if (isInsideCube(x, y)) {
            isDragging = true;
            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        isDragging = false;
    });

    canvas.addEventListener('mousemove', function(e) {
        if (isDragging) {
            var deltaX = e.clientX - previousMousePosition.x;
            var deltaY = e.clientY - previousMousePosition.y;

            if (isMoveMode) {
                translation[0] += deltaX * 0.01;
                translation[1] -= deltaY * 0.01; // Inverter para mover na direção correta
            } else {
                theta[0] += deltaY * 0.01;
                theta[1] += deltaX * 0.01;
            }

            previousMousePosition = {
                x: e.clientX,
                y: e.clientY
            };
        }
    });

    render();
};

function isInsideCube(x, y) {
    var canvasCenterX = canvas.width / 2;
    var canvasCenterY = canvas.height / 2;
    var cubeSize = 256; // Tamanho do cubo em pixels

    return (
        x > canvasCenterX - cubeSize / 2 &&
        x < canvasCenterX + cubeSize / 2 &&
        y > canvasCenterY - cubeSize / 2 &&
        y < canvasCenterY + cubeSize / 2
    );
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (isRotating) {
        if (document.getElementById("x-checkbox").checked) {
            theta[0] += direction * rotationSpeed[0];
        }
        if (document.getElementById("y-checkbox").checked) {
            theta[1] += direction * rotationSpeed[1];
        }
        if (document.getElementById("z-checkbox").checked) {
            theta[2] += direction * rotationSpeed[2];
        }
    }

    gl.uniform3fv(thetaLoc, theta);
    gl.uniform3fv(translationLoc, translation);
    gl.uniform1f(scaleLoc, scale);

    gl.drawArrays(gl.TRIANGLES, 0, NumVertices);

    requestAnimFrame(render);
}