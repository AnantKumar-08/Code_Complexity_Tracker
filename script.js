document.getElementById('analyzeBtn').addEventListener("click", function () {
    const code = document.getElementById('codeInput').value;
    const newCode = code.replaceAll("\n", " ");

    // counting number of lines

    let lines = 0;
    let consecutive = 0;

    for (const char of code) {
        if (char != '\n') {
            consecutive = 0;
        }
        if (char == '\n') {
            lines++;
            if (consecutive) {
                lines--;
            }
            consecutive++
        }

    }

    document.getElementById('loc').innerText = lines;

    // counting number of functions

    const data = newCode.split(" ");

    let functionCount = 0;

    for (let i = 0; i < data.length; i++) {
        if (data[i] === 'function' || data[i] === '(function') {
            functionCount++;
        }
    }

    const arrowFnRegex = /(?:const|let|var)?\s*[a-zA-Z_$][\w$]*\s*=\s*(async\s*)?(?:\([\s\S]*?\)|[a-zA-Z_$][\w$]*)\s*=>/g;
    const arrowFunctions = code.match(arrowFnRegex);
    if (arrowFunctions) {
        functionCount = functionCount + arrowFunctions.length;
    }

    document.getElementById('functions').innerText = functionCount;

    //counting number of loops

    const loopData = newCode.split(" ");

    let loopCount = 0;

    for (let i = 0; i < loopData.length; i++) {
        if (loopData[i] === 'for' || loopData[i] === 'for(' || loopData[i] === 'while' || loopData[i] === 'while(') {
            loopCount++;
        }
    }

    document.getElementById('loops').innerText = loopCount;

    //counting number of conditional expressions

    const conditionData = newCode.split(" ");

    let conditionCount = 0;

    for (let i = 0; i < conditionData.length; i++) {
        if (conditionData[i] === 'if' || conditionData[i] === 'switch' || conditionData[i] === 'case' || conditionData[i] === 'else' || conditionData[i] === 'default:' || conditionData[i] === 'default') {
            conditionCount++;
        }
        if (conditionData[i] === 'else' && conditionData[i + 1] === 'if') {
            conditionCount--;
        }
    }

    document.getElementById('conditionals').innerText = conditionCount;

    //calculating the maxnesting

    const nestingData = newCode.split(" ");
    let nesting = 0, maxNesting = 0, allClosed = 0;

    for (let i = 0; i < nestingData.length; i++) {
        if (nestingData[i] === '{') {
            nesting++;
            allClosed++
        }
        if (nestingData[i] === '}' || nestingData[i] === '},') {
            allClosed--;
            if (nesting > maxNesting) {
                maxNesting = nesting;
            }
            nesting--;
            if (!allClosed) {
                if (nesting > maxNesting) {
                    maxNesting = nesting;
                    nesting = 0;
                }
            }
        }
    }

    document.getElementById('nesting').innerText = maxNesting;

    //Calculating complexity

    const score = (functionCount * 2) + (loopCount * 3) + (conditionCount * 2) + (maxNesting * 4) + (lines / 10);
    
    let statement = '';

    const complexityBadge = document.getElementById('complexityBadge');
    if (score > 0 && score <= 15) {
        complexityBadge.innerText = 'Low complexity';
        complexityBadge.style.color = '#7ca982';
        statement = 'Easy one huhh'
    }
    else if (score > 15 && score <= 30) {
        complexityBadge.innerText = 'Medium complexity';
        complexityBadge.style.color = '#d6b87c';
        statement = 'Bit hard hmmmmm'
    }
    else if (score > 30) {
        complexityBadge.innerText = 'High complexity';
        complexityBadge.style.color = '#b66a5c';
        statement = 'Tu to gya aaj betee!!'
    }
    else {
        complexityBadge.innerText = 'Some Error Occured!!';
        complexityBadge.style.color = 'red';
        document.getElementById('myChart').display = none;
    }


    //chart

    const ctx = document.getElementById("myChart").getContext("2d");

    new Chart(ctx, {
      type: 'polarArea',
      data: {
        labels: [
            'Lines of Code',
            'Functions',
            'Loops',
            'Conditionals',
            'Max Nesting'
        ],
        datasets: [{
            label: statement,
            data: [lines, functionCount, loopCount, conditionCount, maxNesting],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)'
            ]
        }]
      },
      options: {
        responsive: true,
      }
    });

})



