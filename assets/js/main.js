const getElem = e => document.querySelector(e);

const loveMaths = {
    selectedGame: 'add', // default in case input is not checked in HTML
    randomNum: function (max) {
        return Math.ceil(Math.random() * max)
    },
    generateQuestion: function (questionType) {
    // returns array: [operand1 (Int), operand2 (Int), answer (Int)]
        returnArray = [];
        if (questionType == 'add') {
            // use subtract method to ensure the answer wont be over 100
            returnArray = this.generateQuestion('subtract');
            let answer = returnArray.shift();
            returnArray.push(answer);
        } else if (questionType == 'subtract') {
            returnArray.push(this.randomNum(100));

            // ensure both numbers aren't identical
            let secondNum;
            do {
                secondNum = this.randomNum(100);
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

        } else if (questionType == 'divide') {

        } else {
            throw new Error('unknown question type');
        }
        return returnArray;
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
console.log(loveMaths.generateQuestion('subtract'));
console.log(loveMaths.generateQuestion('add'));