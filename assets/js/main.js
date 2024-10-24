const getElem = e => document.querySelector(e);

const loveMaths = {
    selectedGame: 'add', // default in case input is not checked in HTML
    randomNum: function (min, max) {
        return Math.floor(Math.random() * (max-min+1)) + min;
    },
    generateQuestion: function (questionType = this.selectedGame) {
    // returns array: [operand1 (Int), operand2 (Int), answer (Int)]
        returnArray = [];
        if (questionType == 'add') {
            // use subtract method to ensure the answer wont be over 100
            returnArray = this.generateQuestion('subtract');
            let answer = returnArray.shift();
            returnArray.push(answer);
        } else if (questionType == 'subtract') {
            returnArray.push(this.randomNum(1, 100));

            // ensure both numbers aren't identical
            let secondNum;
            do {
                secondNum = this.randomNum(1, 100);
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
            returnArray.push(this.randomNum(2,12));
            returnArray.push(this.randomNum(2,12));
            returnArray.push(returnArray[0]*returnArray[1]);
        } else if (questionType == 'divide') {
            // rearrange multiply
            returnArray = this.generateQuestion('multiply');
            let answer = returnArray.pop();
            returnArray.unshift(answer);
        } else {
            throw new Error('unknown question type');
        }
        return returnArray;
    },
    writeQuestion: function () {
        let questionData = this.generateQuestion();
        let boxes = document.querySelectorAll('#question>input[type=number]');

        let randBox = this.randomNum(0,2);

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
        }
    },
    loadGame: function (name) {
         // set class of question, remove all other classes
        getElem('#question').className = name;

        // change operator
        switch (name) {
            case 'add':
                getElem('#operator').innerText = '+';
                break;
            case 'subtract':
                getElem('#operator').innerText = '-';
                break;
            case 'multiply':
                getElem('#operator').innerText = 'x';
                break;
            case 'divide':
                getElem('#operator').innerText = '/';
                break;
        }

        // set current state
        this.selectedGame = name;
        this.writeQuestion();
    },
    init: function () {
        if (getElem('input[name=operation]:checked')) {
            this.selectedGame = getElem('input[name=operation]:checked').value;
        } else {
            // set radio button corresponding to current game to checked 
            getElem('#radio_'+this.selectedGame).setAttribute('checked', true)
        }
        this.loadGame(this.selectedGame);

        // game switching
        document.querySelectorAll('input[name=operation]').forEach(element => {
            element.addEventListener('change', () => {
                if (element.value !== loveMaths.selectedGame) {
                    loveMaths.loadGame(element.value);
                }
            });
        });
    }
}

loveMaths.init();