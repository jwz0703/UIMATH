const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let vector = {x: 100, y: 0};
let translation = {x: 0, y: 0};

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
            
            // x 軸刻度
            ctx.fillText(i * 50, x, y + 15);
            ctx.beginPath();
            ctx.moveTo(x, y - 5);
            ctx.lineTo(x, y + 5);
            ctx.stroke();

            // y 軸刻度
            ctx.fillText(-i * 50, y + 5, x);
            ctx.beginPath();
            ctx.moveTo(y - 5, x);
            ctx.lineTo(y + 5, x);
            ctx.stroke();
        }
    }

    // 添加座標軸標籤
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

    // 繪製向量線
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + x, centerY - y);
    ctx.stroke();

    // 繪製箭頭
    const headlen = 10;
    const angle = Math.atan2(y, x);
    ctx.beginPath();
    ctx.moveTo(centerX + x, centerY - y);
    ctx.lineTo(centerX + x - headlen * Math.cos(angle - Math.PI / 6), centerY - y + headlen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(centerX + x - headlen * Math.cos(angle + Math.PI / 6), centerY - y + headlen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();

    // 標註坐標
    ctx.font = '12px Arial';
    ctx.fillText(`(${x.toFixed(1)}, ${y.toFixed(1)})`, centerX + x + 5, centerY - y - 5);
}

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCoordinateSystem();
    drawVector(vector.x, vector.y);
}

function translateVector() {
    const dx = parseFloat(document.getElementById('xInput').value);
    const dy = parseFloat(document.getElementById('yInput').value);
    
    const startX = vector.x;
    const startY = vector.y;
    
    gsap.to(vector, {
        x: startX + dx,
        y: startY + dy,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function() {
            drawScene();
            updateMatrixInfo();
        }
    });

    translation.x += dx;
    translation.y += dy;
}

function resetVector() {
    gsap.to(vector, {
        x: 100,
        y: 0,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function() {
            drawScene();
            updateMatrixInfo();
        }
    });

    translation.x = 0;
    translation.y = 0;
}

function updateMatrixInfo() {
    const matrixInfo = document.getElementById('matrixInfo');
    matrixInfo.innerHTML = `
    <p>
    \\[
    \\begin{bmatrix}
    ${vector.x.toFixed(2)} \\\\
    ${vector.y.toFixed(2)}
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    1 & 0 \\\\
    0 & 1
    \\end{bmatrix}
    \\begin{bmatrix}
    100 \\\\
    0
    \\end{bmatrix}
    +
    \\begin{bmatrix}
    ${translation.x.toFixed(2)} \\\\
    ${translation.y.toFixed(2)}
    \\end{bmatrix}
    \\]
    </p>
    <p>公式：</p>
    <p>
    \\[
    \\begin{bmatrix}
    x' \\\\
    y'
    \\end{bmatrix}
    =
    \\begin{bmatrix}
    1 & 0 \\\\
    0 & 1
    \\end{bmatrix}
    \\begin{bmatrix}
    x \\\\
    y
    \\end{bmatrix}
    +
    \\begin{bmatrix}
    t_x \\\\
    t_y
    \\end{bmatrix}
    \\]
    </p>
    <p>其中：</p>
    <p>
    \\[
    \\begin{array}{ll}
    x' & \\text{平移後的 } x \\\\
    y' & \\text{平移後的 } y \\\\
    x & \\text{原始 } x \\\\
    y & \\text{原始 } y \\\\
    t_x & \\text{x 方向的平移量} \\\\
    t_y & \\text{y 方向的平移量}
    \\end{array}
    \\]
    </p>
    `;

    // 重新渲染 MathJax
    MathJax.typeset();
}

// 測驗相關代碼
const quizQuestions = [
    {
        question: "在2D平移中，向量的新位置如何計算？",
        options: ["原始位置加上平移量", "原始位置乘以平移量", "原始位置減去平移量", "原始位置除以平移量"],
        correctAnswer: 0
    },
    {
        question: "2D平移矩陣的形式是什麼？",
        options: [
            "[1 0; 0 1] + [tx; ty]",
            "[cos(θ) -sin(θ); sin(θ) cos(θ)]",
            "[sx 0; 0 sy]",
            "[1 tx; ty 1]"
        ],
        correctAnswer: 0
    }
];

function displayQuiz() {
    const quizContainer = document.getElementById('quizContainer');
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

// 初始化
drawScene();
updateMatrixInfo();
displayQuiz();