const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let vector = {x: 100, y: 100};
let originalVector = {x: 100, y: 100};
let previousVector = {x: 100, y: 100};
let scaleX = 1;
let scaleY = 1;

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
    drawVector(previousVector.x, previousVector.y, 'gray');
    drawVector(vector.x, vector.y);
}

function transformVector() {
    const newScaleX = parseFloat(document.getElementById('scaleXInput').value);
    const newScaleY = parseFloat(document.getElementById('scaleYInput').value);
    
    previousVector = {...vector};
    animateTransformation(newScaleX, newScaleY);
}

function animateTransformation(targetScaleX, targetScaleY) {
    gsap.to({scaleX: scaleX, scaleY: scaleY}, {
        scaleX: targetScaleX,
        scaleY: targetScaleY,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function() {
            scaleX = this.targets()[0].scaleX;
            scaleY = this.targets()[0].scaleY;
            vector.x = originalVector.x * scaleX;
            vector.y = originalVector.y * scaleY;
            drawScene();
            updateMatrixInfo();
        }
    });
}

function resetTransformation() {
    previousVector = {...vector};
    animateTransformation(1, 1);
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
    ${scaleX.toFixed(2)} & 0 \\\\
    0 & ${scaleY.toFixed(2)}
    \\end{bmatrix}
    \\times
    \\begin{bmatrix}
    ${previousVector.x.toFixed(2)} \\\\
    ${previousVector.y.toFixed(2)}
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
    s_x & 0 \\\\
    0 & s_y
    \\end{bmatrix}
    \\begin{bmatrix}
    x \\\\
    y
    \\end{bmatrix}
    \\]
    </p>
    <p>其中：</p>
    <p>
    \\[
    \\begin{array}{ll}
    x' & \\text{縮放後的 } x \\\\
    y' & \\text{縮放後的 } y \\\\
    s_x & \\text{X軸縮放比例} \\\\
    s_y & \\text{Y軸縮放比例} \\\\
    x & \\text{原始 } x \\\\
    y & \\text{原始 } y \\\\
    \\end{array}
    \\]
    </p>
    `;

    // 重新渲染 MathJax
    MathJax.typeset();
}

const quizQuestions = [
    {
        question: "伸縮矩陣的主對角線元素代表什麼?",
        options: ["旋轉角度", "縮放比例", "平移距離", "剪切係數"],
        correctAnswer: 1
    },
    {
        question: "當X軸和Y軸的縮放比例相同時,會發生什麼?",
        options: ["向量旋轉", "向量平移", "向量等比例縮放", "向量扭曲"],
        correctAnswer: 2
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

displayQuiz();
drawScene();
updateMatrixInfo();