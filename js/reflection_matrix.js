const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let vector = {x: 100, y: 50};
let originalVector = {x: 100, y: 50};
let previousVector = {x: 100, y: 50};

function drawCoordinateSystem() {
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 1;
    
    // 繪製 x 軸和 y 軸
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // 繪製刻度和標籤
    ctx.font = '10px Arial';
    ctx.fillStyle = '#999';
    for (let i = -4; i <= 4; i++) {
        if (i !== 0) {
            const x = canvas.width / 2 + i * 50;
            const y = canvas.height / 2;
            
            ctx.fillText(i * 50, x, y + 15);
            ctx.beginPath();
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x, y + 5);
            ctx.stroke();

            ctx.fillText(-i * 50, y + 5, x);
            ctx.beginPath();
            ctx.moveTo(y - 5, x);
            ctx.lineTo(y + 5, x);
            ctx.stroke();
        }
    }

    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText('X', canvas.width - 10, canvas.height / 2 - 10);
    ctx.fillText('Y', canvas.width / 2 + 10, 10);
}

function drawVector(x, y, color = 'blue') {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + x, centerY - y);
    ctx.stroke();

    const headlen = 10;
    const angle = Math.atan2(y, x);
    ctx.beginPath();
    ctx.moveTo(centerX + x, centerY - y);
    ctx.lineTo(centerX + x - headlen * Math.cos(angle - Math.PI / 6), centerY - y + headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(centerX + x - headlen * Math.cos(angle + Math.PI / 6), centerY - y + headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    ctx.font = '12px Arial';
    ctx.fillText(`(${x.toFixed(1)}, ${y.toFixed(1)})`, centerX + x + 5, centerY - y - 5);
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoordinateSystem();
    drawVector(previousVector.x, previousVector.y, 'gray');
    drawVector(vector.x, vector.y);
}

function applyReflection() {
    const axis = document.getElementById('axisSelect').value;
    let matrix;

    switch(axis) {
        case 'x':
            matrix = [[1, 0], [0, -1]];
            break;
        case 'y':
            matrix = [[-1, 0], [0, 1]];
            break;
        case 'xy':
            matrix = [[0, 1], [1, 0]];
            break;
    }

    previousVector = {...vector};
    const newX = matrix[0][0] * vector.x + matrix[0][1] * vector.y;
    const newY = matrix[1][0] * vector.x + matrix[1][1] * vector.y;

    gsap.to(vector, {
        x: newX,
        y: newY,
        duration: 1,
        onUpdate: drawScene,
        onComplete: updateMatrixInfo
    });
}

function resetVector() {
    previousVector = {...vector};
    gsap.to(vector, {
        x: originalVector.x,
        y: originalVector.y,
        duration: 1,
        onUpdate: drawScene,
        onComplete: updateMatrixInfo
    });
}

function updateMatrixInfo() {
    const axis = document.getElementById('axisSelect').value;
    let matrix, axisName;

    switch(axis) {
        case 'x':
            matrix = [[1, 0], [0, -1]];
            axisName = 'X軸';
            break;
        case 'y':
            matrix = [[-1, 0], [0, 1]];
            axisName = 'Y軸';
            break;
        case 'xy':
            matrix = [[0, 1], [1, 0]];
            axisName = 'y=x軸';
            break;
    }

    const matrixInfo = document.getElementById('matrixInfo');
    matrixInfo.innerHTML = `
    <p>鏡射軸: ${axisName}</p>
    <p>
    \\[
    \\begin{bmatrix}
    ${vector.x.toFixed(2)} \\\\
    ${vector.y.toFixed(2)}
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    ${matrix[0][0]} & ${matrix[0][1]} \\\\
    ${matrix[1][0]} & ${matrix[1][1]}
    \\end{bmatrix}
    \\times
    \\begin{bmatrix}
    ${previousVector.x.toFixed(2)} \\\\
    ${previousVector.y.toFixed(2)}
    \\end{bmatrix}
    \\]
    </p>
    `;

    MathJax.typeset();
}

const quizQuestions = [
    {
        question: "哪個矩陣代表沿 X 軸的鏡射?",
        options: [
            "[[1, 0], [0, 1]]",
            "[[1, 0], [0, -1]]",
            "[[-1, 0], [0, 1]]",
            "[[0, 1], [1, 0]]"
        ],
        correctAnswer: 1
    },
    {
        question: "鏡射變換會改變向量的什麼?",
        options: ["長度", "方向", "兩者都改變", "兩者都不改變"],
        correctAnswer: 1
    }
];

function displayQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = ''; // 清空容器
    quizQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `
            <p>${index + 1}. ${q.question}</p>
            ${q.options.map((option, i) => `
                <input type="radio" name="q${index}" value="${i}" id="q${index}o${i}">
                <label for="q${index}o${i}">${option}</label><br>
            `).join('')}
        `;
        quizContainer.appendChild(questionDiv);
    });
}

function checkAnswers() {
    let score = 0;
    quizQuestions.forEach((q, index) => {
        const selectedAnswer = document.querySelector(`input[name="q${index}"]:checked`);
        if (selectedAnswer && parseInt(selectedAnswer.value) === q.correctAnswer) {
            score++;
        }
    });
    alert(`您的得分是: ${score}/${quizQuestions.length}`);
}

drawScene();
updateMatrixInfo();
displayQuiz();