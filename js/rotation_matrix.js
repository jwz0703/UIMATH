const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        let tAngle = 0;
        let angle = 0;
        let vector = {x: 100, y: 0};
        let lastVector = {x: 100, y: 0};
        let animationId = null;

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
            const angle = Math.atan2(y,x);
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

        function drawAngle() {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = 30;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, -angle * Math.PI / 180, true);
            ctx.strokeStyle = 'green';
            ctx.stroke();

            // 標註角度
            const labelRadius = radius + 15;
            const labelAngle = angle / 2 * Math.PI / 180;
            const labelX = centerX + labelRadius * Math.cos(labelAngle);
            const labelY = centerY - labelRadius * Math.sin(labelAngle);
            
            ctx.font = '12px Arial';
            ctx.fillStyle = 'green';
            ctx.fillText(`θ = ${Math.round(angle)}°`, labelX, labelY);
        }


        function drawScene() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawCoordinateSystem();
            drawVector(vector.x, vector.y);
            drawAngle();
        }

        function transformVector() {
            const inputAngle = parseFloat(document.getElementById('angleInput').value);
            tAngle = angle + inputAngle; // 設定目標角度為當前角度加上輸入角度
            
            animateTransformation(tAngle);
        }
        

        function animateTransformation(targetAngle) {
            lastVector = { x: 100 * Math.cos(angle * Math.PI / 180), y: 100 * Math.sin(angle * Math.PI / 180) };
    // 使用GSAP來動畫化angle和vector
    gsap.to({angle: angle}, {
        angle: targetAngle,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: function() {
            angle = this.targets()[0].angle;
            const radian = angle * Math.PI / 180;
            vector.x = 100 * Math.cos(radian);
            vector.y = 100 * Math.sin(radian);
            drawScene();
            updateMatrixInfo();
        }
    });
}
        
            
             function updateMatrixInfo() {
                const radian = angle * Math.PI / 180;
                const cosTheta = Math.cos(radian).toFixed(4);
                const sinTheta = Math.sin(radian).toFixed(4);
                const x = vector.x.toFixed(2);
                const y = vector.y.toFixed(2);
            
                const matrixInfo = document.getElementById('matrixInfo');
                matrixInfo.innerHTML = `
                <p>
                \\[
                \\begin{bmatrix}
                ${x} \\\\
                ${y}
                \\end{bmatrix}
                =
                \\begin{bmatrix}
                \\cos${angle.toFixed(1)}^\\circ & -\\sin${angle.toFixed(1)}^\\circ \\\\
                \\sin${angle.toFixed(1)}^\\circ & \\cos${angle.toFixed(1)}^\\circ
                \\end{bmatrix}
                \\times
                \\begin{bmatrix}
                ${lastVector.x.toFixed(2)} \\\\
                ${lastVector.y.toFixed(2)}
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
                \\cos\\theta & -\\sin\\theta \\\\
                \\sin\\theta & \\cos\\theta
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
                x' & \\text{旋轉後的 } x \\\\
                y' & \\text{旋轉後的 } y \\\\
                x & \\text{原始 } x \\\\
                y & \\text{原始 } y \\\\
                \\end{array}
                \\]
                </p>
                
            `;
            
            
                // 重新渲染 MathJax
                MathJax.typeset();
            }
            
        

       // 測驗相關代碼（保持不變）
       const quizQuestions = [
       {
           question: "旋轉矩陣中的 cos θ 和 sin θ 代表什麼?",
           options: ["角度", "坐標", "三角函數值", "向量"],
           correctAnswer: 2
       },
       {
           question: "使用旋轉矩陣可以實現哪種變換?",
           options: ["平移", "縮放", "旋轉", "切變"],
           correctAnswer: 2
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

        displayQuiz();
        drawScene();
        updateMatrixInfo();
        renderMatrixFormula();