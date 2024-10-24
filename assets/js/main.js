const getElem = e => document.querySelector(e);

const loveMaths = {
    selectedGame: 'add', // default in case input is not checked in HTML
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