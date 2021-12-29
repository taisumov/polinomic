let inputSize = document.getElementById("input-size");      //input для ввода рамзерности матрицы
let inputBtn = document.getElementById("input-btn");        //кнопка для построения таблицы
let matrixDiv = document.getElementById("matrixDiv");       //контейнер таблицы
let tableMatrix = document.getElementById("tableMatrix");   //таблица

inputSize.value = 3;

function calc() {

    if(document.getElementById("matrices")) {
        matrixDiv.removeChild(document.getElementById("matrices"));
    }

    let matrices = document.createElement("div");
    matrices.id = "matrices";

    matrixDiv.appendChild(matrices);

    let isEmpty = false;
    for(let i = 0; i < inputSize.value; i++) {
        for(let j = 0; j < inputSize.value; j++) {
            if(document.getElementById(String(i)+String(j)).value === ''){
                isEmpty = true;
                console.log("error!");
            }
        }
    }
    let matrix = [];
    if(isEmpty == false) {
        for(let i = 0; i < inputSize.value; i++) {
            matrix[i] = [];
            for(let j = 0; j < inputSize.value; j++) {
                matrix[i][j] = parseInt(document.getElementById(String(i)+String(j)).value);
            }
        }
    }
    console.log(matrix);
    Triangulation(matrix, matrices);
}

let submitSize = () => {

    //заново создаем matrixDiv
    document.getElementById("pseudocontainer").removeChild(document.getElementById("matrixDiv"));
    matrixDiv = document.createElement("div");
    matrixDiv.id = "matrixDiv";
    document.getElementById("pseudocontainer").appendChild(matrixDiv);

    tableMatrix = document.getElementById("tableMatrix");   //получаем элемент "таблица"
    let size = inputSize.value;                             //получаем размер таблицы

    //создание элемента "таблица"
    let table = document.createElement("table");
    table.id = "tableMatrix";
    table.className = "tableMatrix";

    //генерация матрицы в виде таблицы
    for (let i = 0; i < size; i++) {
        let tr = document.createElement('tr');
        tr.className = "tableSto";
        
        for (let j = 0; j < size; j++) {
            let td = document.createElement('td');
            td.className = "tableStr";

            let inp = document.createElement('input');
            inp.type = "number";
            inp.className = "inpNum";
            inp.id = String(i) + String(j);
            td.appendChild(inp);

            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }

    matrixDiv.appendChild(table);   //добавляем таблицу

    //создание кнопки для триангуляции матрицы
    let btn_calc = document.createElement("button");
    btn_calc.id = "btn-calc";
    btn_calc.className = "draw meet";
    btn_calc.innerHTML = "Рассчитать";
    btn_calc.onclick = function(){
        calc();
    }

    matrixDiv.appendChild(btn_calc);    //добавляем кнопку

    //после нажатия происходит прокрутка вниз для лучшего отображения
    document.getElementById("label").scrollIntoView({behavior: "smooth"});  
}

let copyMatrix = (matrix) => {

    let n           = matrix.length;
    let newMatrix   = [];

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            newMatrix[i] = new Array(n);
        }
    }

    for(let i = 0; i < n; i++) {
        for(let j = 0; j < n; j++) {
            newMatrix[i][j] = matrix[i][j];
        }
    }

    return newMatrix;
}

function output_iteration(matrix, i, matrices) {
    let iter = document.createElement("div");
    iter.id = "iteration" + i;
    iter.className = "iteration";
    
    let article = document.createElement("p");
    article.id = "article" + i;

    article.innerHTML = "На итерации №" + (i+1) + " получим следующую матрицу:";
    iter.appendChild(article);

    let formula = document.createElement("div");
    formula.className = "formula";
    iter.appendChild(formula);

    matrices.appendChild(iter);

    let form = "\\begin{bmatrix}\n";

    for(let j = 0; j < matrix.length; j++) {
        for(let k = 0; k < matrix.length; k++) {
            form += matrix[j][k];
            if(k != matrix.length-1){
                form += "&";
            }
        }
        form += " \\\\\n";
    }
    form = form + "\\end{bmatrix}";
    katex.render(form, formula);
}

function lastOutput(numOfFinalIter, success) {
    if (success) {
        let last = document.createElement("p");
        last.innerHTML = "Алгоритм успешно выполнил " + numOfFinalIter + " итераций и окончил свою работу!"; 
        matrices.appendChild(last);
    } else {
        let last = document.createElement("p");
        last.innerHTML = "Алгоритм остановился на итерации №" + numOfFinalIter + " вследствие отсутствия ненулевых элементов на необходимых позициях."; 
        matrices.appendChild(last);
    }
}

function Triangulation(initMatrix, matrices){

    let N               = initMatrix.length,
        resultMatrix    = copyMatrix(initMatrix),
        denomimator     = 1,
        isFound         = true,
        numOfFinalIter;

    for (let i = 0; i < N-1; ++i){
        let maxN = i;

        if(resultMatrix[i][i] == 0) {
            isFound = false;
            for (let j = i + 1; j < N; ++j){
                let value = resultMatrix[j][i];
                if(value) {
                    isFound = true;
                    for(let x = j; x > i; x--) {
                        let temp = resultMatrix[x];
                        resultMatrix[x] = resultMatrix[x-1];
                        resultMatrix[x-1] = temp;
                    }
                    break;
                }
            }
        }

        if(isFound) {
            let iiElement = resultMatrix[i][i];

            for (let j = i+1; j < N; ++j){

                let value2 = resultMatrix[j][i];
                resultMatrix[j][i] = 0;

                for (let k = i+1; k < N; ++k)
                    resultMatrix[j][k] = (resultMatrix[j][k] * iiElement - resultMatrix[i][k] * value2) / denomimator;
            }
        
            denomimator = iiElement;
            console.log(i, copyMatrix(resultMatrix));
            output_iteration(resultMatrix, i, matrices);
        } else {
            numOfFinalIter = i;
            lastOutput(numOfFinalIter, false);
            break;
        }
    }

    lastOutput(N-1, true);

    return resultMatrix;
}

(function() {
    'use strict';

    function ctrls() {
        var _this = this;

        this.counter = 3;
        this.els = {
            decrement: document.querySelector('.ctrl-button-decrement'),
            counter: {
                container: document.querySelector('.ctrl-counter'),
                num: document.querySelector('.ctrl-counter-num'),
                input: document.querySelector('.ctrl-counter-input')
            },
            increment: document.querySelector('.ctrl-button-increment')
        };

        this.decrement = function() {
            var counter = _this.getCounter();
            var nextCounter = (_this.counter > 0) ? --counter: counter;
            _this.setCounter(nextCounter);
        };

        this.increment = function() {
            var counter = _this.getCounter();
            var nextCounter = (counter < 9999999999) ? ++counter: counter;
            _this.setCounter(nextCounter);
        };

        this.getCounter = function() {
            return _this.counter;
        };

        this.setCounter = function(nextCounter) {
            _this.counter = nextCounter;
        };

        this.debounce = function(callback) {
            setTimeout(callback, 100);
        };

        this.render = function(hideClassName, visibleClassName) {
            _this.els.counter.num.classList.add(hideClassName);

            setTimeout(function() {
                _this.els.counter.num.innerText = _this.getCounter();
                _this.els.counter.input.value = _this.getCounter();
                _this.els.counter.num.classList.add(visibleClassName);
            },
            100);

            setTimeout(function() {
                _this.els.counter.num.classList.remove(hideClassName);
                _this.els.counter.num.classList.remove(visibleClassName);
            },
            200);
        };

        this.ready = function() {
            _this.els.decrement.addEventListener('click',
            function() {
                _this.debounce(function() {
                    _this.decrement();
                    _this.render('is-decrement-hide', 'is-decrement-visible');
                });
            });

            _this.els.increment.addEventListener('click',
            function() {
                _this.debounce(function() {
                    _this.increment();
                    _this.render('is-increment-hide', 'is-increment-visible');
                });
            });

            _this.els.counter.input.addEventListener('input',
            function(e) {
                var parseValue = parseInt(e.target.value);
                if (!isNaN(parseValue) && parseValue >= 0) {
                    _this.setCounter(parseValue);
                    _this.render();
                }
            });

            _this.els.counter.input.addEventListener('focus',
            function(e) {
                _this.els.counter.container.classList.add('is-input');
            });

            _this.els.counter.input.addEventListener('blur',
            function(e) {
                _this.els.counter.container.classList.remove('is-input');
                _this.render();
            });
        };
    };

    // init
    var controls = new ctrls();
    document.addEventListener('DOMContentLoaded', controls.ready);
})();
