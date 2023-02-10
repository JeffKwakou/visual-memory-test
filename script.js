class Game {
    constructor() {
        this.elementRef = document.querySelector('#board-game')
        this.level = 1;
        this.lives = 3;
        this.wrongCell = 3;
        this.sizeGame = 3;
        this.cellToFind = [];
        this.cellClicked = [];

        this.isLoading = true;
    }

    init() {
        this.isLoading = true;

        document.querySelector('#level-count').innerHTML = this.level;
        document.querySelector('#lives-count').innerHTML = this.lives;

        this.createGrid();
        this.initCellToFind();
        this.displayCellsToMemorize();
        this.addEventListenerToCells();
    }

    createGrid() {
        this.cleanBoard();

        this.elementRef.style.setProperty('grid-template-columns', 'repeat(' + this.sizeGame + ', 1fr)');
        this.elementRef.style.setProperty('grid-template-rows', 'repeat(' + this.sizeGame + ', 1fr)');
        
        for (let i = 0; i < Math.pow(this.sizeGame, 2); i++) {
            this.createCell();
        }
    }

    createCell() {
        let div = document.createElement('div');
        div.classList.add('cell');
        this.elementRef.appendChild(div);
    }

    cleanBoard() {
        this.elementRef.innerHTML = '';
        this.wrongCell = 3;
        this.cellToFind = [];
        this.cellClicked = [];
    }

    initCellToFind() {
        this.cellToFind = [];

        while(this.cellToFind.length < this.level + 2) {
            let randomNumber = Math.floor(Math.random() * Math.pow(this.sizeGame, 2));
            if (!this.cellToFind.includes(randomNumber)) {
                this.cellToFind.push(randomNumber);
            }
        }
    }
    
    addEventListenerToCells() {
        let cells = document.querySelectorAll('.cell');

        cells.forEach((item, index) => {
            item.addEventListener('click', (event) => {
                this.checkCell(event, index);
            })
        });
    }

    displayCellsToMemorize() {
        let cells = document.querySelectorAll('.cell');

        this.cellToFind.forEach(cellIndex => {
            cells[cellIndex].classList.add('active');
        })

        setTimeout(() => {
            this.cellToFind.forEach(cellIndex => {
                cells[cellIndex].classList.remove('active');
            })

            this.isLoading = false;
        }, 1000);
    }

    checkCell(event, index) {
        if (!this.isLoading && this.wrongCell > 0) {
            if (this.cellToFind.includes(index) && !this.cellClicked.includes(index)) {
                let cellIndex = this.cellToFind.indexOf(index);
                this.cellToFind.splice(cellIndex, 1);
    
                event.target.classList.add('active');

                this.playSound('right-answer');
            } else if (!this.cellToFind.includes(index) && !this.cellClicked.includes(index)) {
                this.wrongCell--;
    
                event.target.classList.add('disable');

                this.playSound('wrong-answer');
            }
    
            this.cellClicked.push(index)
    
            this.levelIsFinished();
        }
    }

    levelIsFinished() {
        if (this.wrongCell == 0) {
            this.roundLost();
        } else if (this.cellToFind.length == 0) {
            this.nextLevel();
        }
    }

    nextLevel() {
        this.level++;

        if (this.level % 2 != 0) {
            this.sizeGame++;
        }

        this.init();
    }

    roundLost() {
        this.lives--;

        if (this.lives <= 0) {
            this.endGame();
        } else {
            this.init();
        }
    }

    endGame() {
        console.log("End of the game")
    }

    playSound(fileName) {
        var audio = new Audio('./sound-effects/' + fileName + '.mp3');
        audio.play();
    }
}

let game = new Game();
game.init();

function restartGame() {
    game = new Game();
    game.init();
}