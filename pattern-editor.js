// Custom Pattern Editor for Wordle Art Generator
class PatternEditor {
    constructor() {
        this.pattern = Array(6).fill().map(() => Array(5).fill('gray'));
        this.selectedColor = 'green';
        this.patternSelectedCallback = null;
    }

    setPatternSelectedCallback(callback) {
        this.patternSelectedCallback = callback;
    }

    createEditor() {
        const container = document.createElement('div');
        container.className = 'pattern-editor';
        
        const colorPicker = this.createColorPicker();
        const grid = this.createGrid();
        const buttons = this.createButtons();
        
        container.appendChild(colorPicker);
        container.appendChild(grid);
        container.appendChild(buttons);
        
        return container;
    }

    createColorPicker() {
        const picker = document.createElement('div');
        picker.className = 'color-picker';
        
        const colors = ['gray', 'yellow', 'green'];
        const labels = ['⬜ Gray', '🟡 Yellow', '🟢 Green'];
        
        colors.forEach((color, index) => {
            const button = document.createElement('button');
            button.className = `color-btn ${color}`;
            button.textContent = labels[index];
            button.dataset.color = color;
            
            if (color === this.selectedColor) {
                button.classList.add('active');
            }
            
            button.addEventListener('click', () => {
                this.selectedColor = color;
                document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
            
            picker.appendChild(button);
        });
        
        return picker;
    }

    createGrid() {
        const grid = document.createElement('div');
        grid.className = 'pattern-grid';
        
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 5; col++) {
                const square = document.createElement('div');
                square.className = 'pattern-square gray';
                square.dataset.row = row;
                square.dataset.col = col;
                
                square.addEventListener('click', () => {
                    this.pattern[row][col] = this.selectedColor;
                    this.updateGrid();
                });
                
                square.addEventListener('mouseenter', () => {
                    if (event.buttons === 1) {
                        this.pattern[row][col] = this.selectedColor;
                        this.updateGrid();
                    }
                });
                
                grid.appendChild(square);
            }
        }
        
        return grid;
    }

    createButtons() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'editor-buttons';
        
        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear All';
        clearBtn.addEventListener('click', () => {
            this.pattern = Array(6).fill().map(() => Array(5).fill('gray'));
            this.updateGrid();
        });
        
        const usePatternBtn = document.createElement('button');
        usePatternBtn.textContent = 'Use This Pattern';
        usePatternBtn.className = 'primary-btn';
        usePatternBtn.addEventListener('click', () => {
            if (this.patternSelectedCallback) {
                this.patternSelectedCallback([...this.pattern.map(row => [...row])]);
            }
        });
        
        buttonContainer.appendChild(clearBtn);
        buttonContainer.appendChild(usePatternBtn);
        
        return buttonContainer;
    }

    updateGrid() {
        const squares = document.querySelectorAll('.pattern-square');
        squares.forEach(square => {
            const row = parseInt(square.dataset.row);
            const col = parseInt(square.dataset.col);
            const color = this.pattern[row][col];
            
            square.className = `pattern-square ${color}`;
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PatternEditor;
} 