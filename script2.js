
class Game2048 {
    constructor(gridId, scoreId) {
        this.grid = document.getElementById(gridId);
        this.scoreDisplay = document.getElementById(scoreId);
        this.size = 4;
        this.matrix = [];
        this.score = 0;
        this.bestScore = localStorage.getItem(scoreId + "_best") || 0;
        this.startGame();
    }

    startGame() {
        this.grid.innerHTML = "";
        this.score = 0;
        this.scoreDisplay.innerText = "0";
        this.matrix = Array.from({ length: this.size }, () => Array(this.size).fill(0));
        this.createGrid();
        this.generateTile();
        this.generateTile();
    }

    createGrid() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                let tile = document.createElement("div");
                tile.classList.add("box");
                tile.setAttribute("data-position", `${r}_${c}`);
                this.grid.appendChild(tile);
            }
        }
        this.updateGrid();
    }

    isGameOver() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.matrix[r][c] === 0) return false;
                if (c < this.size - 1 && this.matrix[r][c] === this.matrix[r][c + 1]) return false;
                if (r < this.size - 1 && this.matrix[r][c] === this.matrix[r + 1][c]) return false;
            }
        }
        return true;
    }

    generateTile() {
        let emptyTiles = [];
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.matrix[r][c] === 0) emptyTiles.push([r, c]);
            }
        }

        if (emptyTiles.length > 0) {
            let [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
            this.matrix[r][c] = Math.random() > 0.5 ? 2 : 4;
            this.updateGrid();
        }
    }

    updateGrid() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                let tile = this.grid.querySelector(`[data-position='${r}_${c}']`);
                tile.innerText = this.matrix[r][c] ? this.matrix[r][c] : "";
                tile.className = "box";
                if (this.matrix[r][c]) tile.classList.add(`box-${this.matrix[r][c]}`);
            }
        }
        this.scoreDisplay.innerText = this.score;

        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem(this.scoreDisplay.id + "_best", this.bestScore);
        }
    }

    move(direction) {
        let rotated = direction === "up" || direction === "down";
        let reverse = direction === "right" || direction === "down";

        let newMatrix = this.matrix.map((row) => row.slice());

        for (let i = 0; i < this.size; i++) {
            let line = rotated ? newMatrix.map(row => row[i]) : newMatrix[i];
            if (reverse) line.reverse();

            let filtered = line.filter(num => num);
            let merged = [];

            while (filtered.length) {
                if (filtered.length > 1 && filtered[0] === filtered[1]) {
                    merged.push(filtered[0] * 2);
                    this.score += filtered[0] * 2;
                    filtered.splice(0, 2);
                } else {
                    merged.push(filtered.shift());
                }
            }

            while (merged.length < this.size) merged.push(0);
            if (reverse) merged.reverse();

            if (rotated) newMatrix.forEach((row, j) => row[i] = merged[j]);
            else newMatrix[i] = merged;
        }

        if (JSON.stringify(this.matrix) !== JSON.stringify(newMatrix)) {
            this.matrix = newMatrix;
            this.generateTile();
        }
        
        
        if (this.isGameOver()) {
            alert(`Game Over!`);
        }
        
    }
}

// **Create Two Game Instances for Both Players**
const player1 = new Game2048("grid1", "score1");
const player2 = new Game2048("grid2", "score2");


// **Add Event Listeners for Player Movements**
document.addEventListener("keydown", (e) => {
    const player1Keys = { "KeyA": "left", "KeyD": "right", "KeyW": "up", "KeyS": "down" };
    const player2Keys = { "ArrowLeft": "left", "ArrowRight": "right", "ArrowUp": "up", "ArrowDown": "down" };
    if (player1Keys[e.code]) {
        player1.move(player1Keys[e.code]); // Player 1 moves with WASD
    }
    if (player2Keys[e.code]) {
        player2.move(player2Keys[e.code]); // Player 2 moves with Arrow Keys
    }
    
});

// **Restart Buttons for Each Player**
document.getElementById("start1").onclick = () => player1.startGame();
document.getElementById("start2").onclick = () => player2.startGame();

document.getElementById("best1").innerText = player1.bestScore;
document.getElementById("best2").innerText = player2.bestScore;
