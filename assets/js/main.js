document.addEventListener('DOMContentLoaded', () => {

    let selectedGame = 'add'; // default in case input is not checked in HTML

    function randomNum (min, max) {
        return Math.floor(Math.random() * (max-min+1)) + min;
    }

    function generateQuestion(questionType=selectedGame) {
        // returns array: [operand1 (Int), operand2 (Int), answer (Int)]
        returnArray = [];
        if (questionType == 'add') {
            // use subtract method to ensure the answer wont be over 100
            returnArray = generateQuestion('subtract');
            let answer = returnArray.shift();
            returnArray.push(answer);
        } else if (questionType == 'subtract') {
            returnArray.push(randomNum(1, 100));

            // ensure both numbers aren't identical
            let secondNum;
            do {
                secondNum = randomNum(1, 100);
            } while (secondNum == returnArray[0]);

            // largest number first
            if (secondNum > returnArray[0]) {
                returnArray.unshift(secondNum);
            } else {
                returnArray.push(secondNum);
            }

            // add answer
            returnArray.push(returnArray[0]-returnArray[1]);

        } else if (questionType == 'multiply') {
            returnArray.push(randomNum(2,12));
            returnArray.push(randomNum(2,12));
            returnArray.push(returnArray[0]*returnArray[1]);
        } else if (questionType == 'divide') {
            // rearrange multiply
            returnArray = generateQuestion('multiply');
            let answer = returnArray.pop();
            returnArray.unshift(answer);
        } else {
            throw new Error('unknown question type');
        }
        return returnArray;
    }

    function writeQuestion() {
        let questionData = generateQuestion();
        let boxes = document.querySelectorAll('#question input[type=number]');

        let randBox = randomNum(0,2);

        for (let x=0; x<3; x++) {
            if (x !== randBox) {
                boxes[x].value = questionData[x];
                boxes[x].disabled = true;
                boxes[x].removeAttribute('data-answer');
                continue;
            }
            boxes[x].value = '';
            boxes[x].disabled = false;
            boxes[x].setAttribute('data-answer', questionData[x]);
            boxes[x].focus();
        }
    }

    function checkAnswer() {
        let answerBox = document.querySelector('input[data-answer]');
        if (parseInt(answerBox.getAttribute('data-answer')) == parseInt(answerBox.value)) {
            modal('Correct!', 'correctAnswer');
            incrementCounter('correct');
        } else {
            modal(`Nope. The correct answer was ${answerBox.getAttribute('data-answer')}!`, 'incorrectAnswer');
            incrementCounter('incorrect');
        }

        // refresh question
        writeQuestion();
    }

    function modal(message, className='') {
        let modal = document.querySelector('#modal');
        modal.className = className;
        let modalContent = document.querySelector('#modal-content');
        modalContent.innerText = message;
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 3000);
    }

    function incrementCounter(counter) {
        let span = document.querySelector(`#${counter}>span`);
        let currentCount = parseInt(span.innerText);
        span.innerText = ++currentCount;
    }

    function loadGame() {
        // set class of question, remove all other classes
        document.querySelector('#question').className = selectedGame;

        // change operator
        switch (selectedGame) {
            case 'add':
                document.querySelector('#operator').innerText = '+';
                break;
            case 'subtract':
                document.querySelector('#operator').innerText = '−';
                break;
            case 'multiply':
                document.querySelector('#operator').innerText = '×';
                break;
            case 'divide':
                document.querySelector('#operator').innerText = '÷';
                break;
        }

        // set current state
        writeQuestion();
    }

    function init() {
        if (document.querySelector('input[name=operation]:checked')) {
            selectedGame = document.querySelector('input[name=operation]:checked').value;
        } else {
            // set radio button corresponding to current game to checked 
            document.querySelector(`#radio_${selectedGame}`).setAttribute('checked', true)
        }
        loadGame();

        // game switching
        document.querySelectorAll('input[name=operation]').forEach(element => {
            element.addEventListener('change', () => {
                if (element.value !== selectedGame) {
                    selectedGame = element.value;
                    loadGame();
                }
            });
        });

        document.querySelector('form').addEventListener('submit', e => {
            e.preventDefault();
            if (document.querySelector('input[data-answer]').value) checkAnswer();
        })
    }

    init();

});
